-- Phase 1: cancellation reasons, refund tracking, booking incidents, RPCs.

-- ---------------------------------------------------------------------------
-- Columns on bookings
-- ---------------------------------------------------------------------------
alter table public.bookings
  add column if not exists cancelled_at timestamptz,
  add column if not exists cancelled_by text
    check (cancelled_by is null or cancelled_by in ('customer', 'driver', 'ops', 'system')),
  add column if not exists cancellation_reason text
    check (
      cancellation_reason is null or cancellation_reason in (
        'customer_plans_changed',
        'customer_booked_wrong',
        'flight_cancelled_airline',
        'traveler_no_show',
        'driver_no_show',
        'driver_late',
        'wrong_vehicle_or_service',
        'safety_concern',
        'missed_each_other',
        'other'
      )
    ),
  add column if not exists cancellation_note text,
  add column if not exists refund_percent integer
    check (refund_percent is null or refund_percent in (0, 50, 100)),
  add column if not exists refund_status text not null default 'none'
    check (refund_status in (
      'none', 'pending_review', 'approved', 'rejected', 'paid', 'credit_issued', 'n_a'
    )),
  add column if not exists refund_amount_cents integer,
  add column if not exists payment_status text not null default 'unpaid'
    check (payment_status in (
      'unpaid', 'deposit_paid', 'paid', 'refunded', 'partially_refunded'
    )),
  add column if not exists prefer_credit boolean not null default false,
  add column if not exists quote_id uuid,
  add column if not exists stripe_payment_intent_id text,
  add column if not exists goodwill_credit_cents integer not null default 0;

-- ---------------------------------------------------------------------------
-- booking_incidents
-- ---------------------------------------------------------------------------
create table if not exists public.booking_incidents (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  opened_by text not null check (opened_by in ('customer', 'driver', 'ops')),
  opened_by_user_id uuid references auth.users(id) on delete set null,
  type text not null check (type in (
    'driver_no_show',
    'driver_late',
    'wrong_vehicle',
    'safety',
    'missed_each_other',
    'unable_to_complete',
    'other'
  )),
  status text not null default 'open'
    check (status in ('open', 'investigating', 'resolved', 'rejected')),
  note text,
  evidence_urls text[] not null default '{}',
  claimed_wait_until timestamptz,
  resolution text
    check (resolution is null or resolution in (
      'full_refund', 'partial_refund', 'credit', 'rebook', 'no_action'
    )),
  resolved_by uuid references auth.users(id) on delete set null,
  resolved_at timestamptz,
  resolution_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_booking_incidents_booking
  on public.booking_incidents (booking_id, created_at desc);
create index if not exists idx_booking_incidents_open
  on public.booking_incidents (status, created_at desc)
  where status in ('open', 'investigating');

drop trigger if exists booking_incidents_updated_at on public.booking_incidents;
create trigger booking_incidents_updated_at before update on public.booking_incidents
  for each row execute function public.set_updated_at();

alter table public.booking_incidents enable row level security;

-- ---------------------------------------------------------------------------
-- quotes (Phase 2 prep — created early so quote_id FK is valid)
-- ---------------------------------------------------------------------------
create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  inputs_hash text not null,
  route_slug text not null,
  vehicle_class text not null,
  trip_type text not null default 'oneway',
  extras jsonb not null default '{}'::jsonb,
  pickup_at timestamptz,
  return_at timestamptz,
  distance_km numeric,
  hours integer,
  service text not null default 'transfer'
    check (service in ('transfer', 'hourly')),
  market text not null default 'greece',
  bookable_mode text not null default 'instant'
    check (bookable_mode in ('instant', 'quote')),
  price_cents integer not null,
  currency text not null default 'EUR',
  breakdown jsonb not null default '[]'::jsonb,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_quotes_expires on public.quotes (expires_at);

do $$ begin
  alter table public.bookings
    add constraint bookings_quote_id_fkey
    foreign key (quote_id) references public.quotes(id) on delete set null;
exception when duplicate_object then null;
end $$;

alter table public.quotes enable row level security;

-- Anyone can read a quote by id (needed to confirm booking); inserts via service/RPC.
create policy "quotes readable by id" on public.quotes
  for select to anon, authenticated using (true);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

create or replace function public.booking_wait_minutes(
  p_pickup_address text,
  p_route_slug text,
  p_flight_number text
)
returns integer
language plpgsql immutable as $$
begin
  if p_flight_number is not null and length(trim(p_flight_number)) > 0 then
    return 60;
  end if;
  if coalesce(p_pickup_address, '') ~* '(airport|aiport|αεροδρ|aeroporto|flughafen|aéroport|port|λιμάν|ferry|harbour|harbor)'
     or coalesce(p_route_slug, '') ~* '(airport|port|heraklion-airport|chania-airport|souda)' then
    return 60;
  end if;
  return 30;
end $$;

create or replace function public.owns_booking(p_booking public.bookings)
returns boolean
language sql stable as $$
  select
    p_booking.user_id = auth.uid()
    or lower(p_booking.customer_email) = lower(auth.email());
$$;

-- ---------------------------------------------------------------------------
-- RLS for incidents
-- ---------------------------------------------------------------------------
drop policy if exists "customers read own incidents" on public.booking_incidents;
create policy "customers read own incidents" on public.booking_incidents
  for select to authenticated
  using (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id and public.owns_booking(b)
    )
    or exists (
      select 1 from public.bookings b
      where b.id = booking_id and b.driver_id = auth.uid()
    )
    or public.is_admin()
  );

-- Inserts go through security-definer RPCs only.
revoke insert, update, delete on public.booking_incidents from anon, authenticated;
grant select on public.booking_incidents to authenticated;

-- Quotes: no direct client insert
revoke insert, update, delete on public.quotes from anon, authenticated;
grant select on public.quotes to anon, authenticated;
grant insert on public.quotes to authenticated, anon; -- create_quote_record used from client via RPC preferred; keep insert for service later

-- ---------------------------------------------------------------------------
-- request_cancellation
-- ---------------------------------------------------------------------------
create or replace function public.request_cancellation(
  p_booking_id uuid,
  p_reason text,
  p_note text default null,
  p_prefer_credit boolean default true
)
returns public.bookings
language plpgsql security definer set search_path = public as $$
declare
  v_booking public.bookings;
  v_hours numeric;
  v_percent integer;
  v_refund_status text;
  v_amount integer;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  if p_reason is null or p_reason not in (
    'customer_plans_changed',
    'customer_booked_wrong',
    'flight_cancelled_airline',
    'other'
  ) then
    raise exception 'invalid_cancellation_reason';
  end if;

  select * into v_booking from public.bookings where id = p_booking_id for update;
  if not found then
    raise exception 'booking_not_found';
  end if;

  if not public.owns_booking(v_booking) and not public.is_admin() then
    raise exception 'forbidden';
  end if;

  if v_booking.status not in ('pending', 'claimed') then
    raise exception 'cancel_not_allowed';
  end if;

  if v_booking.pickup_at <= now() then
    raise exception 'use_incident_flow';
  end if;

  v_hours := extract(epoch from (v_booking.pickup_at - now())) / 3600.0;

  if p_reason = 'flight_cancelled_airline' then
    v_percent := 100;
    v_refund_status := case when p_prefer_credit then 'credit_issued' else 'approved' end;
  elsif v_hours >= 24 then
    v_percent := 100;
    v_refund_status := case when p_prefer_credit then 'credit_issued' else 'approved' end;
  else
    v_percent := 50;
    -- Partial refunds need ops/Stripe review until webhooks automate them
    v_refund_status := 'pending_review';
  end if;

  if v_booking.payment_status in ('unpaid') then
    v_refund_status := 'n_a';
    v_amount := 0;
  else
    v_amount := round(v_booking.price_cents * v_percent / 100.0);
  end if;

  update public.bookings set
    status = 'cancelled',
    cancelled_at = now(),
    cancelled_by = 'customer',
    cancellation_reason = p_reason,
    cancellation_note = nullif(trim(coalesce(p_note, '')), ''),
    prefer_credit = coalesce(p_prefer_credit, true),
    refund_percent = v_percent,
    refund_status = v_refund_status,
    refund_amount_cents = v_amount,
    updated_at = now()
  where id = p_booking_id
  returning * into v_booking;

  return v_booking;
end $$;

grant execute on function public.request_cancellation(uuid, text, text, boolean) to authenticated;

-- ---------------------------------------------------------------------------
-- open_incident
-- ---------------------------------------------------------------------------
create or replace function public.open_incident(
  p_booking_id uuid,
  p_type text,
  p_note text default null,
  p_claimed_wait_until timestamptz default null,
  p_evidence_urls text[] default '{}'
)
returns public.booking_incidents
language plpgsql security definer set search_path = public as $$
declare
  v_booking public.bookings;
  v_opened_by text;
  v_incident public.booking_incidents;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  if p_type is null or p_type not in (
    'driver_no_show', 'driver_late', 'wrong_vehicle', 'safety',
    'missed_each_other', 'unable_to_complete', 'other'
  ) then
    raise exception 'invalid_incident_type';
  end if;

  select * into v_booking from public.bookings where id = p_booking_id for update;
  if not found then
    raise exception 'booking_not_found';
  end if;

  if public.owns_booking(v_booking) then
    v_opened_by := 'customer';
  elsif v_booking.driver_id = auth.uid() then
    v_opened_by := 'driver';
  elsif public.is_admin() then
    v_opened_by := 'ops';
  else
    raise exception 'forbidden';
  end if;

  if v_booking.status not in ('claimed', 'en_route', 'completed', 'no_show', 'pending') then
    raise exception 'incident_not_allowed';
  end if;

  -- Driver unable_to_complete: only the assigned driver
  if p_type = 'unable_to_complete' and v_opened_by <> 'driver' and not public.is_admin() then
    raise exception 'forbidden';
  end if;

  insert into public.booking_incidents (
    booking_id, opened_by, opened_by_user_id, type, note,
    claimed_wait_until, evidence_urls, status
  ) values (
    p_booking_id,
    v_opened_by,
    auth.uid(),
    p_type,
    nullif(trim(coalesce(p_note, '')), ''),
    p_claimed_wait_until,
    coalesce(p_evidence_urls, '{}'),
    'open'
  ) returning * into v_incident;

  -- Flag booking for refund review on customer-reported driver fault
  if v_opened_by = 'customer' and p_type in (
    'driver_no_show', 'driver_late', 'wrong_vehicle', 'safety', 'missed_each_other'
  ) then
    update public.bookings set
      refund_status = case
        when payment_status = 'unpaid' then 'pending_review'
        else 'pending_review'
      end,
      cancellation_reason = case p_type
        when 'driver_no_show' then 'driver_no_show'
        when 'driver_late' then 'driver_late'
        when 'wrong_vehicle' then 'wrong_vehicle_or_service'
        when 'safety' then 'safety_concern'
        when 'missed_each_other' then 'missed_each_other'
        else cancellation_reason
      end,
      updated_at = now()
    where id = p_booking_id;
  end if;

  -- Driver unable to complete → pending review make-good
  if p_type = 'unable_to_complete' then
    update public.bookings set
      refund_status = 'pending_review',
      cancellation_reason = coalesce(cancellation_reason, 'other'),
      updated_at = now()
    where id = p_booking_id;
  end if;

  return v_incident;
end $$;

grant execute on function public.open_incident(uuid, text, text, timestamptz, text[]) to authenticated;

-- ---------------------------------------------------------------------------
-- resolve_incident (admin)
-- ---------------------------------------------------------------------------
create or replace function public.resolve_incident(
  p_incident_id uuid,
  p_resolution text,
  p_notes text default null,
  p_reject boolean default false
)
returns public.booking_incidents
language plpgsql security definer set search_path = public as $$
declare
  v_incident public.booking_incidents;
  v_booking public.bookings;
  v_goodwill integer := 2500; -- €25
begin
  if not public.is_admin() then
    raise exception 'forbidden';
  end if;

  if p_reject then
    update public.booking_incidents set
      status = 'rejected',
      resolution = 'no_action',
      resolution_notes = nullif(trim(coalesce(p_notes, '')), ''),
      resolved_by = auth.uid(),
      resolved_at = now(),
      updated_at = now()
    where id = p_incident_id
    returning * into v_incident;
    if not found then raise exception 'incident_not_found'; end if;

    update public.bookings set
      refund_status = case when refund_status = 'pending_review' then 'rejected' else refund_status end,
      updated_at = now()
    where id = v_incident.booking_id;

    return v_incident;
  end if;

  if p_resolution is null or p_resolution not in (
    'full_refund', 'partial_refund', 'credit', 'rebook', 'no_action'
  ) then
    raise exception 'invalid_resolution';
  end if;

  select * into v_incident from public.booking_incidents where id = p_incident_id for update;
  if not found then raise exception 'incident_not_found'; end if;

  select * into v_booking from public.bookings where id = v_incident.booking_id for update;

  update public.booking_incidents set
    status = 'resolved',
    resolution = p_resolution,
    resolution_notes = nullif(trim(coalesce(p_notes, '')), ''),
    resolved_by = auth.uid(),
    resolved_at = now(),
    updated_at = now()
  where id = p_incident_id
  returning * into v_incident;

  if p_resolution = 'full_refund' then
    update public.bookings set
      status = case when status in ('pending', 'claimed', 'en_route') then 'cancelled' else status end,
      cancelled_at = coalesce(cancelled_at, now()),
      cancelled_by = coalesce(cancelled_by, 'ops'),
      refund_percent = 100,
      refund_amount_cents = case when payment_status = 'unpaid' then 0 else price_cents end,
      refund_status = case when payment_status = 'unpaid' then 'n_a' else 'approved' end,
      goodwill_credit_cents = v_goodwill,
      updated_at = now()
    where id = v_booking.id;
  elsif p_resolution = 'partial_refund' then
    update public.bookings set
      refund_percent = 50,
      refund_amount_cents = case when payment_status = 'unpaid' then 0 else round(price_cents * 0.5) end,
      refund_status = case when payment_status = 'unpaid' then 'n_a' else 'approved' end,
      updated_at = now()
    where id = v_booking.id;
  elsif p_resolution = 'credit' then
    update public.bookings set
      status = case when status in ('pending', 'claimed', 'en_route') then 'cancelled' else status end,
      cancelled_at = coalesce(cancelled_at, now()),
      cancelled_by = coalesce(cancelled_by, 'ops'),
      refund_percent = 100,
      refund_status = 'credit_issued',
      refund_amount_cents = case when payment_status = 'unpaid' then 0 else price_cents end,
      goodwill_credit_cents = v_goodwill,
      prefer_credit = true,
      updated_at = now()
    where id = v_booking.id;
  elsif p_resolution = 'rebook' then
    update public.bookings set
      refund_status = 'n_a',
      goodwill_credit_cents = v_goodwill,
      updated_at = now()
    where id = v_booking.id;
  else
    update public.bookings set
      refund_status = case when refund_status = 'pending_review' then 'rejected' else refund_status end,
      updated_at = now()
    where id = v_booking.id;
  end if;

  return v_incident;
end $$;

grant execute on function public.resolve_incident(uuid, text, text, boolean) to authenticated;

-- ---------------------------------------------------------------------------
-- Driver status update with wait-window enforcement for no_show
-- ---------------------------------------------------------------------------
create or replace function public.update_job_status(
  p_booking_id uuid,
  p_status text
)
returns public.bookings
language plpgsql security definer set search_path = public as $$
declare
  v_booking public.bookings;
  v_wait integer;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  if p_status not in ('en_route', 'completed', 'no_show') then
    raise exception 'invalid_status';
  end if;

  select * into v_booking from public.bookings where id = p_booking_id for update;
  if not found then raise exception 'booking_not_found'; end if;

  if v_booking.driver_id is distinct from auth.uid() then
    raise exception 'forbidden';
  end if;

  if p_status = 'en_route' and v_booking.status <> 'claimed' then
    raise exception 'update_refused';
  end if;

  if p_status in ('completed', 'no_show') and v_booking.status not in ('claimed', 'en_route') then
    raise exception 'update_refused';
  end if;

  if p_status = 'no_show' then
    v_wait := public.booking_wait_minutes(
      v_booking.pickup_address, v_booking.route_slug, v_booking.flight_number
    );
    if now() < v_booking.pickup_at + make_interval(mins => v_wait) then
      raise exception 'wait_not_elapsed';
    end if;

    update public.bookings set
      status = 'no_show',
      cancelled_by = 'driver',
      cancellation_reason = 'traveler_no_show',
      cancelled_at = now(),
      refund_percent = 0,
      refund_status = case when payment_status = 'unpaid' then 'n_a' else 'none' end,
      refund_amount_cents = 0,
      updated_at = now()
    where id = p_booking_id
    returning * into v_booking;
  else
    update public.bookings set
      status = p_status,
      updated_at = now()
    where id = p_booking_id
    returning * into v_booking;
  end if;

  return v_booking;
end $$;

grant execute on function public.update_job_status(uuid, text) to authenticated;

-- ---------------------------------------------------------------------------
-- create_quote (server-side price lock for Phase 2)
-- ---------------------------------------------------------------------------
create or replace function public.create_quote_record(
  p_route_slug text,
  p_vehicle_class text,
  p_trip_type text,
  p_extras jsonb,
  p_pickup_at timestamptz,
  p_return_at timestamptz,
  p_distance_km numeric,
  p_hours integer,
  p_service text,
  p_market text,
  p_bookable_mode text,
  p_price_cents integer,
  p_breakdown jsonb,
  p_inputs_hash text,
  p_ttl_minutes integer default 30
)
returns public.quotes
language plpgsql security definer set search_path = public as $$
declare
  v_quote public.quotes;
begin
  if p_price_cents is null or p_price_cents < 0 then
    raise exception 'invalid_price';
  end if;

  insert into public.quotes (
    inputs_hash, route_slug, vehicle_class, trip_type, extras,
    pickup_at, return_at, distance_km, hours, service, market,
    bookable_mode, price_cents, breakdown, expires_at
  ) values (
    p_inputs_hash,
    p_route_slug,
    p_vehicle_class,
    coalesce(p_trip_type, 'oneway'),
    coalesce(p_extras, '{}'::jsonb),
    p_pickup_at,
    p_return_at,
    p_distance_km,
    p_hours,
    coalesce(p_service, 'transfer'),
    coalesce(p_market, 'greece'),
    coalesce(p_bookable_mode, 'instant'),
    p_price_cents,
    coalesce(p_breakdown, '[]'::jsonb),
    now() + make_interval(mins => greatest(coalesce(p_ttl_minutes, 30), 5))
  ) returning * into v_quote;

  return v_quote;
end $$;

grant execute on function public.create_quote_record(
  text, text, text, jsonb, timestamptz, timestamptz, numeric, integer,
  text, text, text, integer, jsonb, text, integer
) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- saved travelers (Phase 5 prep)
-- ---------------------------------------------------------------------------
create table if not exists public.saved_travelers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  email text,
  child_seat_needed boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_saved_travelers_user on public.saved_travelers (user_id);

alter table public.saved_travelers enable row level security;

drop policy if exists "users manage own travelers" on public.saved_travelers;
create policy "users manage own travelers" on public.saved_travelers
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop trigger if exists saved_travelers_updated_at on public.saved_travelers;
create trigger saved_travelers_updated_at before update on public.saved_travelers
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- partner referrals (Phase 5)
-- ---------------------------------------------------------------------------
create table if not exists public.partner_referrals (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  partner_name text not null,
  partner_email text,
  commission_percent numeric not null default 10,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.booking_referrals (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  partner_id uuid not null references public.partner_referrals(id),
  commission_cents integer not null default 0,
  status text not null default 'pending'
    check (status in ('pending', 'payable', 'paid', 'void')),
  created_at timestamptz not null default now()
);

alter table public.partner_referrals enable row level security;
alter table public.booking_referrals enable row level security;

create policy "partners readable active codes" on public.partner_referrals
  for select to anon, authenticated using (active = true);

create policy "admin all partners" on public.partner_referrals
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "admin booking referrals" on public.booking_referrals
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "customers read own booking referrals" on public.booking_referrals
  for select to authenticated
  using (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id and public.owns_booking(b)
    )
  );

-- Driver DNS strike counter on driver_profiles
alter table public.driver_profiles
  add column if not exists dns_strikes integer not null default 0;

-- When ops resolves a driver_no_show as full_refund/credit, bump strikes
create or replace function public.bump_dns_on_resolve()
returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_driver uuid;
  v_strikes integer;
begin
  if new.status = 'resolved'
     and new.type = 'driver_no_show'
     and new.resolution in ('full_refund', 'credit', 'rebook')
     and (old.status is distinct from 'resolved') then
    select driver_id into v_driver from public.bookings where id = new.booking_id;
    if v_driver is not null then
      update public.driver_profiles
        set dns_strikes = dns_strikes + 1,
            approval_status = case
              when dns_strikes + 1 >= 3 then 'suspended'
              else approval_status
            end,
            updated_at = now()
      where id = v_driver
      returning dns_strikes into v_strikes;
    end if;
  end if;
  return new;
end $$;

drop trigger if exists booking_incidents_dns_strike on public.booking_incidents;
create trigger booking_incidents_dns_strike
  after update on public.booking_incidents
  for each row execute function public.bump_dns_on_resolve();
