-- Partner orgs, service zones, driver availability, hybrid dispatch offers.
-- Greece: offer fan-out to online drivers. Spain/Italy: partner_assign inbox.

-- ---------------------------------------------------------------------------
-- Partners + zones
-- ---------------------------------------------------------------------------

create table public.partners (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  market text not null check (market in ('greece', 'spain', 'italy')),
  dispatch_email text not null,
  status text not null default 'active' check (status in ('active', 'paused')),
  dispatch_mode text check (dispatch_mode is null or dispatch_mode in ('offer', 'partner_assign')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger partners_updated_at before update on public.partners
  for each row execute function public.set_updated_at();

create table public.service_zones (
  id uuid primary key default gen_random_uuid(),
  market text not null check (market in ('greece', 'spain', 'italy')),
  slug text not null,
  name text not null,
  lat double precision not null,
  lng double precision not null,
  created_at timestamptz not null default now(),
  unique (market, slug)
);

create table public.partner_zones (
  partner_id uuid not null references public.partners(id) on delete cascade,
  zone_id uuid not null references public.service_zones(id) on delete cascade,
  primary key (partner_id, zone_id)
);

create table public.partner_members (
  partner_id uuid not null references public.partners(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('dispatcher', 'driver')),
  created_at timestamptz not null default now(),
  primary key (partner_id, user_id)
);

create index idx_partner_members_user on public.partner_members (user_id);
create index idx_partner_zones_zone on public.partner_zones (zone_id);

-- ---------------------------------------------------------------------------
-- Driver availability + partner link
-- ---------------------------------------------------------------------------

alter table public.driver_profiles
  add column if not exists partner_id uuid references public.partners(id) on delete set null,
  add column if not exists is_online boolean not null default false,
  add column if not exists online_at timestamptz,
  add column if not exists primary_zone_id uuid references public.service_zones(id) on delete set null;

create index idx_driver_profiles_online
  on public.driver_profiles (partner_id, is_online)
  where approval_status = 'approved' and is_online = true;

-- Drivers may toggle online via RPC only (not direct column update).
revoke update on public.driver_profiles from authenticated;
grant update (
  vehicle_class, vehicle_make_model, vehicle_plate,
  license_number, insurance_number, id_document_number, vehicle_registration_number
) on public.driver_profiles to authenticated;

-- ---------------------------------------------------------------------------
-- Bookings dispatch columns
-- ---------------------------------------------------------------------------

alter table public.bookings
  add column if not exists market text check (market is null or market in ('greece', 'spain', 'italy')),
  add column if not exists zone_id uuid references public.service_zones(id) on delete set null,
  add column if not exists partner_id uuid references public.partners(id) on delete set null,
  add column if not exists dispatch_mode text check (dispatch_mode is null or dispatch_mode in ('offer', 'partner_assign')),
  add column if not exists offered_at timestamptz,
  add column if not exists dispatch_batch integer not null default 0;

create index idx_bookings_partner_pending
  on public.bookings (partner_id, pickup_at)
  where status = 'pending' and driver_id is null;

create index idx_bookings_market on public.bookings (market);

-- ---------------------------------------------------------------------------
-- Job offers
-- ---------------------------------------------------------------------------

create table public.job_offers (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  driver_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'declined', 'expired', 'cancelled')),
  expires_at timestamptz not null,
  batch integer not null default 1,
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  unique (booking_id, driver_id)
);

create index idx_job_offers_driver_pending
  on public.job_offers (driver_id, expires_at)
  where status = 'pending';

create index idx_job_offers_booking
  on public.job_offers (booking_id, status);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.is_partner_dispatcher(p_partner_id uuid)
returns boolean
language sql stable security definer set search_path = public as $$
  select public.is_admin()
    or exists (
      select 1 from public.partner_members pm
      where pm.partner_id = p_partner_id
        and pm.user_id = auth.uid()
        and pm.role = 'dispatcher'
    )
$$;

create or replace function public.my_partner_ids()
returns setof uuid
language sql stable security definer set search_path = public as $$
  select partner_id from public.partner_members where user_id = auth.uid()
$$;

create or replace function public.default_dispatch_mode(p_market text)
returns text
language sql immutable as $$
  select case
    when p_market = 'greece' then 'offer'
    else 'partner_assign'
  end
$$;

-- Haversine distance in km (approx).
create or replace function public.haversine_km(
  lat1 double precision, lng1 double precision,
  lat2 double precision, lng2 double precision
) returns double precision
language sql immutable as $$
  select 6371 * 2 * asin(sqrt(
    power(sin(radians(lat2 - lat1) / 2), 2) +
    cos(radians(lat1)) * cos(radians(lat2)) *
    power(sin(radians(lng2 - lng1) / 2), 2)
  ))
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.partners enable row level security;
alter table public.service_zones enable row level security;
alter table public.partner_zones enable row level security;
alter table public.partner_members enable row level security;
alter table public.job_offers enable row level security;

revoke all on public.partners from anon, authenticated;
revoke all on public.service_zones from anon, authenticated;
revoke all on public.partner_zones from anon, authenticated;
revoke all on public.partner_members from anon, authenticated;
revoke all on public.job_offers from anon, authenticated;

grant select on public.partners to authenticated;
grant select on public.service_zones to authenticated;
grant select on public.partner_zones to authenticated;
grant select on public.partner_members to authenticated;
grant select on public.job_offers to authenticated;

grant all on public.partners to service_role;
grant all on public.service_zones to service_role;
grant all on public.partner_zones to service_role;
grant all on public.partner_members to service_role;
grant all on public.job_offers to service_role;

create policy "partners readable by members or admin" on public.partners
  for select to authenticated
  using (
    public.is_admin()
    or id in (select public.my_partner_ids())
    or exists (
      select 1 from public.driver_profiles dp
      where dp.id = auth.uid() and dp.partner_id = partners.id
    )
  );

create policy "zones readable authenticated" on public.service_zones
  for select to authenticated using (true);

create policy "partner_zones readable authenticated" on public.partner_zones
  for select to authenticated using (true);

create policy "members read own membership" on public.partner_members
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin() or public.is_partner_dispatcher(partner_id));

create policy "drivers read own offers" on public.job_offers
  for select to authenticated
  using (driver_id = auth.uid() or public.is_admin());

-- Partner dispatchers can read pending bookings for their partner (PII for assign).
create policy "partner dispatchers read partner bookings" on public.bookings
  for select to authenticated
  using (
    partner_id is not null
    and public.is_partner_dispatcher(partner_id)
  );

create policy "admins read all bookings" on public.bookings
  for select to authenticated
  using (public.is_admin());

-- Partner dispatchers / admins need driver roster for assignment UI
create policy "dispatchers read partner member profiles" on public.profiles
  for select to authenticated
  using (
    public.is_admin()
    or exists (
      select 1
      from public.partner_members me
      join public.partner_members them on them.partner_id = me.partner_id
      where me.user_id = auth.uid()
        and me.role = 'dispatcher'
        and them.user_id = profiles.id
    )
  );

create policy "dispatchers read partner driver profiles" on public.driver_profiles
  for select to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.partner_members pm
      where pm.user_id = auth.uid()
        and pm.role = 'dispatcher'
        and pm.partner_id = driver_profiles.partner_id
    )
  );

-- Admins can read all partners
drop policy if exists "partners readable by members or admin" on public.partners;
create policy "partners readable by members or admin" on public.partners
  for select to authenticated
  using (
    public.is_admin()
    or id in (select public.my_partner_ids())
    or exists (
      select 1 from public.driver_profiles dp
      where dp.id = auth.uid() and dp.partner_id = partners.id
    )
  );

-- ---------------------------------------------------------------------------
-- Views
-- ---------------------------------------------------------------------------

drop view if exists public.open_jobs;
create view public.open_jobs
with (security_invoker = false)
as
  select b.id, b.route_slug, b.vehicle_class, b.passengers, b.pickup_at, b.trip_type, b.return_at,
         b.bags_checked, b.bags_cabin, b.pickup_address, b.dropoff_address,
         b.extras, b.price_cents, b.currency, b.created_at, b.market, b.zone_id, b.partner_id,
         b.dispatch_mode
  from public.bookings b
  where b.status = 'pending'
    and b.driver_id is null
    and b.pickup_at > now()
    and public.is_approved_driver()
    and exists (
      select 1 from public.driver_profiles dp
      where dp.id = auth.uid()
        and dp.is_online = true
        and (b.partner_id is null or dp.partner_id = b.partner_id)
        and (
          b.zone_id is null
          or dp.primary_zone_id = b.zone_id
          or exists (
            select 1 from public.partner_zones pz
            where pz.partner_id = dp.partner_id and pz.zone_id = b.zone_id
          )
        )
    );

revoke all on public.open_jobs from anon;
grant select on public.open_jobs to authenticated;

create or replace view public.my_job_offers
with (security_invoker = false)
as
  select
    o.id as offer_id,
    o.status as offer_status,
    o.expires_at,
    o.batch,
    o.created_at as offered_at,
    b.id,
    b.route_slug,
    b.vehicle_class,
    b.passengers,
    b.pickup_at,
    b.trip_type,
    b.return_at,
    b.bags_checked,
    b.bags_cabin,
    b.pickup_address,
    b.dropoff_address,
    b.extras,
    b.price_cents,
    b.currency,
    b.market,
    b.zone_id,
    b.partner_id
  from public.job_offers o
  join public.bookings b on b.id = o.booking_id
  where o.driver_id = auth.uid()
    and o.status = 'pending'
    and o.expires_at > now()
    and b.status = 'pending'
    and b.driver_id is null
    and public.is_approved_driver();

revoke all on public.my_job_offers from anon;
grant select on public.my_job_offers to authenticated;

-- ---------------------------------------------------------------------------
-- RPCs: online toggle
-- ---------------------------------------------------------------------------

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
     set is_online = p_online,
         online_at = case when p_online then now() else online_at end
   where id = auth.uid()
  returning * into v_row;
  if v_row.id is null then
    raise exception 'driver_profile_missing';
  end if;
  return v_row;
end $$;

revoke execute on function public.set_driver_online(boolean) from public, anon;
grant execute on function public.set_driver_online(boolean) to authenticated;

-- ---------------------------------------------------------------------------
-- claim_job: require online + eligibility
-- ---------------------------------------------------------------------------

create or replace function public.claim_job(p_booking_id uuid)
returns public.bookings
language plpgsql security definer set search_path = public as $$
declare
  v_booking public.bookings;
  v_driver public.driver_profiles;
begin
  if not public.is_approved_driver() then
    raise exception 'not_approved_driver';
  end if;

  select * into v_driver from public.driver_profiles where id = auth.uid();
  if v_driver.id is null or not v_driver.is_online then
    raise exception 'driver_offline';
  end if;

  select * into v_booking from public.bookings where id = p_booking_id for update;
  if v_booking.id is null then
    raise exception 'job_not_found';
  end if;
  if v_booking.status <> 'pending' or v_booking.driver_id is not null then
    raise exception 'job_already_claimed';
  end if;

  if v_booking.partner_id is not null
     and v_driver.partner_id is distinct from v_booking.partner_id then
    raise exception 'not_eligible';
  end if;

  update public.bookings
     set driver_id = auth.uid(), status = 'claimed', assigned_at = now()
   where id = p_booking_id and status = 'pending' and driver_id is null
   returning * into v_booking;
  if v_booking.id is null then
    raise exception 'job_already_claimed';
  end if;

  update public.job_offers
     set status = 'cancelled', responded_at = now()
   where booking_id = p_booking_id and status = 'pending' and driver_id <> auth.uid();

  update public.job_offers
     set status = 'accepted', responded_at = now()
   where booking_id = p_booking_id and driver_id = auth.uid() and status = 'pending';

  return v_booking;
end $$;

-- ---------------------------------------------------------------------------
-- respond_to_offer
-- ---------------------------------------------------------------------------

create or replace function public.respond_to_offer(p_offer_id uuid, p_accept boolean)
returns public.bookings
language plpgsql security definer set search_path = public as $$
declare
  v_offer public.job_offers;
begin
  if not public.is_approved_driver() then
    raise exception 'not_approved_driver';
  end if;

  select * into v_offer from public.job_offers
   where id = p_offer_id and driver_id = auth.uid()
   for update;
  if v_offer.id is null then
    raise exception 'offer_not_found';
  end if;
  if v_offer.status <> 'pending' then
    raise exception 'offer_not_pending';
  end if;
  if v_offer.expires_at <= now() then
    update public.job_offers set status = 'expired', responded_at = now() where id = v_offer.id;
    raise exception 'offer_expired';
  end if;

  if not p_accept then
    update public.job_offers
       set status = 'declined', responded_at = now()
     where id = v_offer.id;
    return null;
  end if;

  -- Accept path reuses claim eligibility (online etc.)
  return public.claim_job(v_offer.booking_id);
end $$;

revoke execute on function public.respond_to_offer(uuid, boolean) from public, anon;
grant execute on function public.respond_to_offer(uuid, boolean) to authenticated;

-- ---------------------------------------------------------------------------
-- assign_job_to_driver (partner dispatcher / admin)
-- ---------------------------------------------------------------------------

create or replace function public.assign_job_to_driver(p_booking_id uuid, p_driver_id uuid)
returns public.bookings
language plpgsql security definer set search_path = public as $$
declare
  v_booking public.bookings;
  v_driver public.driver_profiles;
begin
  select * into v_booking from public.bookings where id = p_booking_id for update;
  if v_booking.id is null then
    raise exception 'job_not_found';
  end if;
  if v_booking.status <> 'pending' or v_booking.driver_id is not null then
    raise exception 'job_already_claimed';
  end if;
  if v_booking.partner_id is null then
    raise exception 'no_partner';
  end if;
  if not public.is_partner_dispatcher(v_booking.partner_id) then
    raise exception 'not_dispatcher';
  end if;

  select * into v_driver from public.driver_profiles where id = p_driver_id;
  if v_driver.id is null or v_driver.approval_status <> 'approved' then
    raise exception 'driver_not_approved';
  end if;
  if v_driver.partner_id is distinct from v_booking.partner_id then
    raise exception 'driver_wrong_partner';
  end if;
  if v_driver.partner_id is distinct from v_booking.partner_id
     and not exists (
       select 1 from public.partner_members pm
       where pm.partner_id = v_booking.partner_id
         and pm.user_id = p_driver_id
     ) then
    raise exception 'driver_not_member';
  end if;

  update public.bookings
     set driver_id = p_driver_id, status = 'claimed', assigned_at = now()
   where id = p_booking_id and status = 'pending' and driver_id is null
   returning * into v_booking;
  if v_booking.id is null then
    raise exception 'job_already_claimed';
  end if;

  update public.job_offers
     set status = 'cancelled', responded_at = now()
   where booking_id = p_booking_id and status = 'pending';

  return v_booking;
end $$;

revoke execute on function public.assign_job_to_driver(uuid, uuid) from public, anon;
grant execute on function public.assign_job_to_driver(uuid, uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- create_dispatch_for_booking + offer batch helper
-- ---------------------------------------------------------------------------

create or replace function public.resolve_zone_id(
  p_market text,
  p_lat double precision,
  p_lng double precision
) returns uuid
language plpgsql stable security definer set search_path = public as $$
declare
  v_zone_id uuid;
begin
  if p_lat is null or p_lng is null then
    select id into v_zone_id
      from public.service_zones
     where market = p_market
     order by slug
     limit 1;
    return v_zone_id;
  end if;

  select id into v_zone_id
    from public.service_zones
   where market = p_market
   order by public.haversine_km(lat, lng, p_lat, p_lng)
   limit 1;
  return v_zone_id;
end $$;

create or replace function public.pick_partner_for_zone(p_zone_id uuid)
returns uuid
language sql stable security definer set search_path = public as $$
  select p.id
  from public.partners p
  join public.partner_zones pz on pz.partner_id = p.id
  where pz.zone_id = p_zone_id
    and p.status = 'active'
  order by p.created_at
  limit 1
$$;

create or replace function public.create_offer_batch(p_booking_id uuid, p_limit integer default 5)
returns integer
language plpgsql security definer set search_path = public as $$
declare
  v_booking public.bookings;
  v_batch integer;
  v_inserted integer := 0;
  r record;
begin
  select * into v_booking from public.bookings where id = p_booking_id for update;
  if v_booking.id is null or v_booking.status <> 'pending' or v_booking.driver_id is not null then
    return 0;
  end if;

  v_batch := coalesce(v_booking.dispatch_batch, 0) + 1;

  for r in
    select dp.id as driver_id
    from public.driver_profiles dp
    join public.profiles p on p.id = dp.id
    where dp.approval_status = 'approved'
      and p.role = 'driver'
      and dp.is_online = true
      and dp.partner_id = v_booking.partner_id
      and (v_booking.vehicle_class is null or dp.vehicle_class = v_booking.vehicle_class
           or dp.vehicle_class in ('minivan', 'luxury', 'comfort'))
      and not exists (
        select 1 from public.job_offers jo
        where jo.booking_id = p_booking_id and jo.driver_id = dp.id
      )
      and (
        v_booking.zone_id is null
        or dp.primary_zone_id = v_booking.zone_id
        or exists (
          select 1 from public.partner_zones pz
          where pz.partner_id = dp.partner_id and pz.zone_id = v_booking.zone_id
        )
      )
    order by dp.online_at desc nulls last
    limit greatest(p_limit, 1)
  loop
    insert into public.job_offers (booking_id, driver_id, status, expires_at, batch)
    values (p_booking_id, r.driver_id, 'pending', now() + interval '90 seconds', v_batch)
    on conflict (booking_id, driver_id) do nothing;
  end loop;

  select count(*)::integer into v_inserted
    from public.job_offers
   where booking_id = p_booking_id and batch = v_batch;

  update public.bookings
     set dispatch_batch = v_batch,
         offered_at = coalesce(offered_at, now()),
         dispatch_mode = coalesce(dispatch_mode, 'offer')
   where id = p_booking_id;

  return v_inserted;
end $$;

create or replace function public.create_dispatch_for_booking(
  p_booking_id uuid,
  p_market text default null,
  p_lat double precision default null,
  p_lng double precision default null,
  p_preferred_partner_id uuid default null
)
returns public.bookings
language plpgsql security definer set search_path = public as $$
declare
  v_booking public.bookings;
  v_market text;
  v_zone_id uuid;
  v_partner_id uuid;
  v_mode text;
begin
  select * into v_booking from public.bookings where id = p_booking_id for update;
  if v_booking.id is null then
    raise exception 'job_not_found';
  end if;

  v_market := coalesce(p_market, v_booking.market, 'greece');
  v_zone_id := coalesce(v_booking.zone_id, public.resolve_zone_id(v_market, p_lat, p_lng));
  v_partner_id := coalesce(
    p_preferred_partner_id,
    v_booking.partner_id,
    public.pick_partner_for_zone(v_zone_id)
  );

  select coalesce(p.dispatch_mode, public.default_dispatch_mode(v_market))
    into v_mode
  from public.partners p
  where p.id = v_partner_id;
  if v_mode is null then
    v_mode := public.default_dispatch_mode(v_market);
  end if;

  update public.bookings
     set market = v_market,
         zone_id = v_zone_id,
         partner_id = v_partner_id,
         dispatch_mode = v_mode
   where id = p_booking_id
   returning * into v_booking;

  if v_mode = 'offer' and v_partner_id is not null then
    perform public.create_offer_batch(p_booking_id, 5);
    select * into v_booking from public.bookings where id = p_booking_id;
  end if;

  return v_booking;
end $$;

revoke execute on function public.create_dispatch_for_booking(uuid, text, double precision, double precision, uuid) from public, anon;
grant execute on function public.create_dispatch_for_booking(uuid, text, double precision, double precision, uuid) to service_role;

revoke execute on function public.create_offer_batch(uuid, integer) from public, anon, authenticated;
grant execute on function public.create_offer_batch(uuid, integer) to service_role;

-- ---------------------------------------------------------------------------
-- expire_job_offers: expire pending, cascade next batch or flag for escalate
-- Returns json: { expired, next_batch, still_open, booking_ids[] needing escalate }
-- ---------------------------------------------------------------------------

create or replace function public.expire_job_offers()
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_expired integer := 0;
  v_next integer := 0;
  v_escalate uuid[] := array[]::uuid[];
  r record;
  v_added integer;
begin
  update public.job_offers
     set status = 'expired', responded_at = coalesce(responded_at, now())
   where status = 'pending' and expires_at <= now();
  get diagnostics v_expired = row_count;

  for r in
    select b.id, b.dispatch_batch
    from public.bookings b
    where b.status = 'pending'
      and b.driver_id is null
      and b.dispatch_mode = 'offer'
      and b.partner_id is not null
      and b.offered_at is not null
      and not exists (
        select 1 from public.job_offers jo
        where jo.booking_id = b.id and jo.status = 'pending'
      )
  loop
    if r.dispatch_batch >= 3 then
      v_escalate := array_append(v_escalate, r.id);
    else
      v_added := public.create_offer_batch(r.id, 5);
      v_next := v_next + 1;
      if v_added = 0 then
        v_escalate := array_append(v_escalate, r.id);
      end if;
    end if;
  end loop;

  return jsonb_build_object(
    'expired', v_expired,
    'next_batches', v_next,
    'escalate', to_jsonb(v_escalate)
  );
end $$;

revoke execute on function public.expire_job_offers() from public, anon;
grant execute on function public.expire_job_offers() to authenticated;
grant execute on function public.expire_job_offers() to service_role;

-- Ops: pause partner
create or replace function public.set_partner_status(p_partner_id uuid, p_status text)
returns public.partners
language plpgsql security definer set search_path = public as $$
declare
  v_row public.partners;
begin
  if not public.is_admin() then
    raise exception 'not_admin';
  end if;
  if p_status not in ('active', 'paused') then
    raise exception 'invalid_status';
  end if;
  update public.partners set status = p_status where id = p_partner_id
  returning * into v_row;
  return v_row;
end $$;

revoke execute on function public.set_partner_status(uuid, text) from public, anon;
grant execute on function public.set_partner_status(uuid, text) to authenticated;

-- ---------------------------------------------------------------------------
-- Realtime
-- ---------------------------------------------------------------------------

do $$
begin
  begin
    alter publication supabase_realtime add table public.job_offers;
  exception when duplicate_object then null;
  end;
  begin
    alter publication supabase_realtime add table public.bookings;
  exception when duplicate_object then null;
  end;
end $$;

-- ---------------------------------------------------------------------------
-- Seed zones + demo partners
-- ---------------------------------------------------------------------------

insert into public.service_zones (market, slug, name, lat, lng) values
  ('greece', 'crete-chania', 'Crete · Chania', 35.5138, 24.0180),
  ('greece', 'crete-rethymno', 'Crete · Rethymno', 35.3655, 24.4822),
  ('greece', 'crete-heraklion', 'Crete · Heraklion', 35.3387, 25.1442),
  ('greece', 'crete-lasithi', 'Crete · Lasithi', 35.1900, 25.7170),
  ('greece', 'athens', 'Athens', 37.9364, 23.9445),
  ('spain', 'madrid', 'Madrid', 40.4983, -3.5676),
  ('spain', 'barcelona', 'Barcelona', 41.2971, 2.0785),
  ('spain', 'malaga', 'Málaga', 36.6749, -4.4991),
  ('italy', 'rome', 'Rome', 41.8003, 12.2389),
  ('italy', 'milan', 'Milan', 45.6301, 8.7231),
  ('italy', 'venice', 'Venice', 45.5050, 12.3399)
on conflict (market, slug) do nothing;

insert into public.partners (slug, name, market, dispatch_email, status, dispatch_mode) values
  ('greece-demo', 'TransferAround Greece Demo', 'greece', 'dispatch-gr@transferaround.com', 'active', 'offer'),
  ('spain-demo', 'TransferAround Spain Demo', 'spain', 'dispatch-es@transferaround.com', 'active', 'partner_assign'),
  ('italy-demo', 'TransferAround Italy Demo', 'italy', 'dispatch-it@transferaround.com', 'active', 'partner_assign')
on conflict (slug) do nothing;

insert into public.partner_zones (partner_id, zone_id)
select p.id, z.id
from public.partners p
join public.service_zones z on z.market = p.market
where p.slug in ('greece-demo', 'spain-demo', 'italy-demo')
on conflict do nothing;

-- Attach any existing approved drivers to greece-demo + membership
update public.driver_profiles dp
   set partner_id = (select id from public.partners where slug = 'greece-demo' limit 1),
       primary_zone_id = coalesce(
         dp.primary_zone_id,
         (select id from public.service_zones where slug = 'crete-heraklion' limit 1)
       )
 where dp.approval_status = 'approved'
   and dp.partner_id is null;

insert into public.partner_members (partner_id, user_id, role)
select p.id, dp.id, 'driver'
from public.driver_profiles dp
join public.partners p on p.slug = 'greece-demo'
where dp.partner_id = p.id
on conflict do nothing;
