-- ASAP / NOW dispatch for Touristas AI
-- Uses urgency (scheduled|asap) so it does not collide with partners dispatch_mode (offer|partner_assign).

-- Ensure driver online toggle exists (partners migration may already have added it).
alter table public.driver_profiles
  add column if not exists is_online boolean not null default false,
  add column if not exists online_at timestamptz;

create or replace function public.set_driver_online(p_online boolean)
returns public.driver_profiles
language plpgsql security definer set search_path = public as $$
declare
  v_row public.driver_profiles;
begin
  if not public.is_approved_driver() then
    raise exception 'not_approved_driver';
  end if;
  update public.driver_profiles
     set is_online = coalesce(p_online, false),
         online_at = case when coalesce(p_online, false) then now() else online_at end
   where id = auth.uid()
   returning * into v_row;
  if v_row.id is null then
    raise exception 'driver_profile_missing';
  end if;
  return v_row;
end $$;

revoke execute on function public.set_driver_online(boolean) from public, anon;
grant execute on function public.set_driver_online(boolean) to authenticated;

alter table public.bookings
  add column if not exists urgency text not null default 'scheduled',
  add column if not exists asap_expires_at timestamptz,
  add column if not exists eta_minutes integer;


do $$ begin
  alter table public.bookings
    add constraint bookings_urgency_check
    check (urgency in ('scheduled', 'asap'));
exception when duplicate_object then null;
end $$;

create index if not exists idx_bookings_asap_open
  on public.bookings (asap_expires_at)
  where status = 'pending' and driver_id is null and urgency = 'asap';

-- Non-PII fanout table for Realtime (drivers subscribe here, not to bookings PII).
create table if not exists public.asap_dispatch_events (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  route_slug text not null,
  vehicle_class text not null,
  passengers int not null,
  pickup_address text,
  dropoff_address text,
  price_cents int not null,
  currency text not null default 'EUR',
  eta_hint_minutes int,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_asap_dispatch_events_expires
  on public.asap_dispatch_events (expires_at);

alter table public.asap_dispatch_events enable row level security;

revoke all on public.asap_dispatch_events from anon, authenticated;
grant select on public.asap_dispatch_events to authenticated;
grant all on public.asap_dispatch_events to service_role;

drop policy if exists "approved drivers read asap events" on public.asap_dispatch_events;
create policy "approved drivers read asap events"
  on public.asap_dispatch_events for select to authenticated
  using (public.is_approved_driver());

-- Fan out ASAP jobs to drivers; remove when claimed/cancelled.
create or replace function public.asap_booking_fanout()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' and new.urgency = 'asap' and new.status = 'pending' then
    insert into public.asap_dispatch_events (
      booking_id, route_slug, vehicle_class, passengers,
      pickup_address, dropoff_address, price_cents, currency,
      eta_hint_minutes, expires_at
    ) values (
      new.id, new.route_slug, new.vehicle_class, new.passengers,
      new.pickup_address, new.dropoff_address, new.price_cents, new.currency,
      coalesce((new.extras->>'eta_hint_minutes')::int, null),
      coalesce(new.asap_expires_at, now() + interval '8 minutes')
    )
    on conflict (booking_id) do nothing;
  elsif tg_op = 'UPDATE' then
    if new.status is distinct from 'pending' or new.driver_id is not null then
      delete from public.asap_dispatch_events where booking_id = new.id;
    end if;
  end if;
  return new;
end $$;

drop trigger if exists bookings_asap_fanout on public.bookings;
create trigger bookings_asap_fanout
  after insert or update on public.bookings
  for each row execute function public.asap_booking_fanout();

-- Open pool: include ASAP (expires_at in future) even when pickup_at ~= now().
-- PostgreSQL cannot use CREATE OR REPLACE VIEW when the projected column list
-- changes. Drop the earlier migration's view so fresh database builds work.
drop view if exists public.open_jobs;
create view public.open_jobs as
  select id, route_slug, vehicle_class, passengers, pickup_at, trip_type, return_at,
         bags_checked, bags_cabin, pickup_address, dropoff_address,
         extras, price_cents, currency, created_at,
         urgency, asap_expires_at, eta_minutes
  from public.bookings
  where status = 'pending'
    and driver_id is null
    and public.is_approved_driver()
    and (
      (urgency = 'asap' and coalesce(asap_expires_at, now()) > now())
      or (coalesce(urgency, 'scheduled') <> 'asap' and pickup_at > now())
    );

revoke all on public.open_jobs from anon;
grant select on public.open_jobs to authenticated;

-- Create ASAP booking (guests + authenticated). Returns the booking row.
create or replace function public.create_asap_booking(
  p_route_slug text,
  p_vehicle_class text,
  p_passengers int,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_pickup_address text,
  p_dropoff_address text,
  p_price_cents int,
  p_eta_hint_minutes int default 35,
  p_bags_checked int default 0,
  p_bags_cabin int default 0,
  p_notes text default null,
  p_pickup_lat double precision default null,
  p_pickup_lng double precision default null,
  p_dropoff_lat double precision default null,
  p_dropoff_lng double precision default null,
  p_currency text default 'EUR'
)
returns public.bookings
language plpgsql security definer set search_path = public as $$
declare
  v_booking public.bookings;
  v_user uuid := auth.uid();
  v_pickup jsonb := null;
  v_dropoff jsonb := null;
begin
  if p_route_slug is null or length(trim(p_route_slug)) = 0 then
    raise exception 'route_required';
  end if;
  if p_price_cents is null or p_price_cents < 1000 then
    raise exception 'price_invalid';
  end if;
  if p_customer_email is null or position('@' in p_customer_email) = 0 then
    raise exception 'email_required';
  end if;
  if p_customer_phone is null or length(trim(p_customer_phone)) < 6 then
    raise exception 'phone_required';
  end if;
  if p_passengers is null or p_passengers < 1 or p_passengers > 16 then
    raise exception 'passengers_invalid';
  end if;

  if p_pickup_lat is not null and p_pickup_lng is not null then
    v_pickup := jsonb_build_object('lat', p_pickup_lat, 'lng', p_pickup_lng);
  end if;
  if p_dropoff_lat is not null and p_dropoff_lng is not null then
    v_dropoff := jsonb_build_object('lat', p_dropoff_lat, 'lng', p_dropoff_lng);
  end if;

  insert into public.bookings (
    route_slug, vehicle_class, passengers, pickup_at,
    customer_name, customer_email, customer_phone,
    notes, bags_checked, bags_cabin,
    pickup_address, dropoff_address,
    pickup_point, dropoff_point,
    extras, price_cents, currency, status, user_id,
    urgency, asap_expires_at, trip_type
  ) values (
    p_route_slug, p_vehicle_class, p_passengers, now(),
    coalesce(nullif(trim(p_customer_name), ''), 'ASAP guest'),
    lower(trim(p_customer_email)), trim(p_customer_phone),
    p_notes, coalesce(p_bags_checked, 0), coalesce(p_bags_cabin, 0),
    p_pickup_address, p_dropoff_address,
    v_pickup, v_dropoff,
    jsonb_build_object('eta_hint_minutes', coalesce(p_eta_hint_minutes, 35), 'source', 'touristas_asap'),
    p_price_cents, coalesce(p_currency, 'EUR'), 'pending', v_user,
    'asap', now() + interval '8 minutes', 'oneway'
  )
  returning * into v_booking;

  return v_booking;
end $$;

revoke execute on function public.create_asap_booking(
  text, text, int, text, text, text, text, text, int, int, int, int, text,
  double precision, double precision, double precision, double precision, text
) from public;
grant execute on function public.create_asap_booking(
  text, text, int, text, text, text, text, text, int, int, int, int, text,
  double precision, double precision, double precision, double precision, text
) to anon, authenticated;

-- Public status poll for chat (no PII beyond driver first name after claim).
create or replace function public.get_asap_dispatch_status(p_booking_id uuid)
returns table (
  booking_id uuid,
  status text,
  urgency text,
  eta_minutes int,
  expires_at timestamptz,
  price_cents int,
  currency text,
  pickup_address text,
  dropoff_address text,
  driver_first_name text,
  expired boolean
)
language plpgsql volatile security definer set search_path = public as $$
declare
  v_b public.bookings;
  v_name text;
  v_expired boolean;
begin
  select * into v_b from public.bookings where id = p_booking_id;
  if v_b.id is null then
    return;
  end if;

  v_expired := (
    v_b.urgency = 'asap'
    and v_b.status = 'pending'
    and v_b.asap_expires_at is not null
    and v_b.asap_expires_at <= now()
  );

  if v_expired then
    update public.bookings as booking
       set status = 'cancelled',
           notes = coalesce(booking.notes || E'\n', '') || 'ASAP expired — no driver claimed.'
     where booking.id = v_b.id and booking.status = 'pending';
    v_b.status := 'cancelled';
    delete from public.asap_dispatch_events as event where event.booking_id = v_b.id;
  end if;

  if v_b.driver_id is not null then
    select split_part(coalesce(p.full_name, 'Driver'), ' ', 1)
      into v_name
      from public.profiles p where p.id = v_b.driver_id;
  end if;

  booking_id := v_b.id;
  status := v_b.status;
  urgency := v_b.urgency;
  eta_minutes := v_b.eta_minutes;
  expires_at := v_b.asap_expires_at;
  price_cents := v_b.price_cents;
  currency := v_b.currency;
  pickup_address := v_b.pickup_address;
  dropoff_address := v_b.dropoff_address;
  driver_first_name := v_name;
  expired := v_expired or v_b.status = 'cancelled';
  return next;
end $$;

revoke execute on function public.get_asap_dispatch_status(uuid) from public;
grant execute on function public.get_asap_dispatch_status(uuid) to anon, authenticated;

create or replace function public.expire_asap_bookings()
returns int
language plpgsql security definer set search_path = public as $$
declare
  n int;
begin
  with expired as (
    update public.bookings
       set status = 'cancelled',
           notes = coalesce(notes || E'\n', '') || 'ASAP expired — no driver claimed.'
     where urgency = 'asap'
       and status = 'pending'
       and driver_id is null
       and asap_expires_at is not null
       and asap_expires_at <= now()
     returning id
  )
  select count(*) into n from expired;
  delete from public.asap_dispatch_events e
   where e.expires_at <= now()
      or not exists (select 1 from public.bookings b where b.id = e.booking_id and b.status = 'pending');
  return coalesce(n, 0);
end $$;

revoke execute on function public.expire_asap_bookings() from public, anon;
grant execute on function public.expire_asap_bookings() to authenticated, service_role;

-- Patch claim_job: set eta_minutes for ASAP; optional online/partner when those features exist.
create or replace function public.claim_job(p_booking_id uuid)
returns public.bookings
language plpgsql security definer set search_path = public as $$
declare
  v_booking public.bookings;
  v_eta int;
  v_has_online boolean;
  v_has_offers boolean;
  v_is_online boolean;
begin
  if not public.is_approved_driver() then
    raise exception 'not_approved_driver';
  end if;

  select exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'driver_profiles' and column_name = 'is_online'
  ) into v_has_online;

  if v_has_online then
    select is_online into v_is_online from public.driver_profiles where id = auth.uid();
    if v_is_online is distinct from true then
      raise exception 'driver_offline';
    end if;
  end if;

  select * into v_booking from public.bookings where id = p_booking_id for update;
  if v_booking.id is null then
    raise exception 'job_not_found';
  end if;
  if v_booking.status <> 'pending' or v_booking.driver_id is not null then
    raise exception 'job_already_claimed';
  end if;

  if v_booking.urgency = 'asap'
     and v_booking.asap_expires_at is not null
     and v_booking.asap_expires_at <= now() then
    raise exception 'asap_expired';
  end if;

  v_eta := coalesce(
    v_booking.eta_minutes,
    nullif((v_booking.extras->>'eta_hint_minutes'), '')::int,
    35
  );

  update public.bookings
     set driver_id = auth.uid(),
         status = 'claimed',
         assigned_at = now(),
         eta_minutes = v_eta
   where id = p_booking_id and status = 'pending' and driver_id is null
   returning * into v_booking;
  if v_booking.id is null then
    raise exception 'job_already_claimed';
  end if;

  delete from public.asap_dispatch_events where booking_id = p_booking_id;

  select to_regclass('public.job_offers') is not null into v_has_offers;
  if v_has_offers then
    update public.job_offers
       set status = 'cancelled', responded_at = now()
     where booking_id = p_booking_id and status = 'pending' and driver_id <> auth.uid();
    update public.job_offers
       set status = 'accepted', responded_at = now()
     where booking_id = p_booking_id and driver_id = auth.uid() and status = 'pending';
  end if;

  return v_booking;
end $$;

-- Realtime publication for asap_dispatch_events (+ bookings for authenticated customer watches).
do $$ begin
  alter publication supabase_realtime add table public.asap_dispatch_events;
exception when duplicate_object then null;
         when undefined_object then null;
end $$;

do $$ begin
  alter publication supabase_realtime add table public.bookings;
exception when duplicate_object then null;
         when undefined_object then null;
end $$;
