-- Archived duplicate snapshot. ============ ASAP realtime dispatch ============
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

grant select on public.asap_dispatch_events to authenticated;
grant all on public.asap_dispatch_events to service_role;

alter table public.asap_dispatch_events enable row level security;

drop policy if exists "approved drivers read asap events" on public.asap_dispatch_events;
create policy "approved drivers read asap events"
  on public.asap_dispatch_events for select to authenticated
  using (public.is_approved_driver());

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
language plpgsql stable security definer set search_path = public as $$
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
    update public.bookings
       set status = 'cancelled',
           notes = coalesce(notes || E'\n', '') || 'ASAP expired - no driver claimed.'
     where id = v_b.id and status = 'pending';
    v_b.status := 'cancelled';
    delete from public.asap_dispatch_events where booking_id = v_b.id;
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
           notes = coalesce(notes || E'\n', '') || 'ASAP expired - no driver claimed.'
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

create or replace function public.claim_job(p_booking_id uuid)
returns public.bookings
language plpgsql security definer set search_path = public as $$
declare
  v_booking public.bookings;
  v_eta int;
  v_is_online boolean;
  v_has_offers boolean;
begin
  if not public.is_approved_driver() then
    raise exception 'not_approved_driver';
  end if;

  select is_online into v_is_online from public.driver_profiles where id = auth.uid();
  if v_is_online is distinct from true then
    raise exception 'driver_offline';
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

-- ============ Push device tokens ============
create table if not exists public.device_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('customer', 'driver')),
  platform text not null check (platform in ('ios', 'android')),
  expo_push_token text not null,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (expo_push_token)
);

create index if not exists device_tokens_user_id_idx on public.device_tokens (user_id);
create index if not exists device_tokens_user_role_idx on public.device_tokens (user_id, role);

grant select, insert, update, delete on public.device_tokens to authenticated;
grant all on public.device_tokens to service_role;

alter table public.device_tokens enable row level security;

drop trigger if exists device_tokens_updated_at on public.device_tokens;
create trigger device_tokens_updated_at
  before update on public.device_tokens
  for each row execute function public.set_updated_at();

drop policy if exists "device_tokens_select_own" on public.device_tokens;
create policy "device_tokens_select_own"
  on public.device_tokens for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "device_tokens_insert_own" on public.device_tokens;
create policy "device_tokens_insert_own"
  on public.device_tokens for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "device_tokens_update_own" on public.device_tokens;
create policy "device_tokens_update_own"
  on public.device_tokens for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "device_tokens_delete_own" on public.device_tokens;
create policy "device_tokens_delete_own"
  on public.device_tokens for delete to authenticated
  using (user_id = auth.uid());

-- ============ Accounts + driver onboarding ============
alter table public.profiles
  add column if not exists preferred_locale text not null default 'en',
  add column if not exists preferred_currency text not null default 'EUR';

do $$ begin
  alter table public.profiles add constraint profiles_preferred_locale_check
    check (preferred_locale in ('en', 'el', 'de', 'fr', 'it', 'nl', 'es'));
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.profiles add constraint profiles_preferred_currency_check
    check (preferred_currency ~ '^[A-Z]{3}$');
exception when duplicate_object then null;
end $$;

alter table public.driver_profiles
  drop constraint if exists driver_profiles_approval_status_check;

update public.driver_profiles
set approval_status = 'submitted'
where approval_status = 'pending';

alter table public.driver_profiles
  alter column approval_status set default 'draft',
  add constraint driver_profiles_approval_status_check
    check (
      approval_status in (
        'draft', 'submitted', 'needs_changes', 'approved', 'rejected', 'suspended'
      )
    );

grant update (full_name, phone, preferred_locale, preferred_currency)
  on public.profiles to authenticated;

insert into public.profiles (id, full_name, phone, role, preferred_locale)
select
  users.id,
  nullif(users.raw_user_meta_data->>'full_name', ''),
  nullif(users.raw_user_meta_data->>'phone', ''),
  case when users.raw_user_meta_data->>'signup_role' = 'driver' then 'driver' else 'customer' end,
  case
    when users.raw_user_meta_data->>'locale' in ('en', 'el', 'de', 'fr', 'it', 'nl', 'es')
      then users.raw_user_meta_data->>'locale'
    else 'en'
  end
from auth.users as users
on conflict (id) do nothing;

insert into public.driver_profiles (id, approval_status)
select profiles.id, 'draft'
from public.profiles as profiles
where profiles.role = 'driver'
on conflict (id) do nothing;

create table if not exists public.driver_onboarding_submissions (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null unique references public.driver_profiles(id) on delete cascade,
  current_step smallint not null default 1 check (current_step between 1 and 5),
  status text not null default 'draft'
    check (status in ('draft', 'submitted', 'needs_changes', 'approved', 'rejected', 'suspended')),
  consent_version text,
  consented_at timestamptz,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewer_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.driver_documents (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references public.driver_profiles(id) on delete cascade,
  document_type text not null
    check (document_type in ('driving_licence', 'identity', 'insurance', 'vehicle_registration')),
  storage_path text not null unique,
  original_filename text not null,
  mime_type text not null
    check (mime_type in ('application/pdf', 'image/jpeg', 'image/png', 'image/webp')),
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 10485760),
  expires_on date,
  status text not null default 'pending'
    check (status in ('pending', 'verified', 'rejected', 'expired')),
  rejection_reason text,
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (driver_id, document_type)
);

create table if not exists public.driver_onboarding_events (
  id bigint generated by default as identity primary key,
  driver_id uuid not null references public.driver_profiles(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  event_type text not null,
  from_status text,
  to_status text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists driver_documents_driver_status_idx
  on public.driver_documents (driver_id, status);
create index if not exists driver_onboarding_events_driver_idx
  on public.driver_onboarding_events (driver_id, created_at desc);

grant select on public.driver_onboarding_submissions to authenticated;
grant update (current_step) on public.driver_onboarding_submissions to authenticated;
grant select, delete on public.driver_documents to authenticated;
grant insert (driver_id, document_type, storage_path, original_filename, mime_type, size_bytes, expires_on)
  on public.driver_documents to authenticated;
grant update (document_type, storage_path, original_filename, mime_type, size_bytes, expires_on)
  on public.driver_documents to authenticated;
grant select on public.driver_onboarding_events to authenticated;
grant all on public.driver_onboarding_submissions to service_role;
grant all on public.driver_documents to service_role;
grant all on public.driver_onboarding_events to service_role;
grant usage, select on sequence public.driver_onboarding_events_id_seq to service_role;

alter table public.driver_onboarding_submissions enable row level security;
alter table public.driver_documents enable row level security;
alter table public.driver_onboarding_events enable row level security;

drop trigger if exists driver_onboarding_submissions_updated_at on public.driver_onboarding_submissions;
create trigger driver_onboarding_submissions_updated_at
before update on public.driver_onboarding_submissions
for each row execute function public.set_updated_at();

drop trigger if exists driver_documents_updated_at on public.driver_documents;
create trigger driver_documents_updated_at
before update on public.driver_documents
for each row execute function public.set_updated_at();

insert into public.driver_onboarding_submissions (driver_id, current_step, status, submitted_at)
select
  driver_profiles.id,
  case when driver_profiles.approval_status = 'draft' then 1 else 5 end,
  driver_profiles.approval_status,
  case
    when driver_profiles.approval_status in ('submitted', 'approved', 'rejected', 'suspended')
      then driver_profiles.created_at
    else null
  end
from public.driver_profiles
on conflict (driver_id) do nothing;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_role text := case
    when new.raw_user_meta_data->>'signup_role' = 'driver' then 'driver' else 'customer'
  end;
  requested_locale text := case
    when new.raw_user_meta_data->>'locale' in ('en', 'el', 'de', 'fr', 'it', 'nl', 'es')
      then new.raw_user_meta_data->>'locale'
    else 'en'
  end;
begin
  insert into public.profiles (id, full_name, phone, role, preferred_locale)
  values (
    new.id,
    nullif(new.raw_user_meta_data->>'full_name', ''),
    nullif(new.raw_user_meta_data->>'phone', ''),
    requested_role,
    requested_locale
  )
  on conflict (id) do nothing;

  if requested_role = 'driver' then
    insert into public.driver_profiles (id, approval_status)
    values (new.id, 'draft')
    on conflict (id) do nothing;

    insert into public.driver_onboarding_submissions (driver_id)
    values (new.id)
    on conflict (driver_id) do nothing;
  end if;

  return new;
end;
$$;

create or replace function public.submit_driver_onboarding(p_consent_version text)
returns public.driver_onboarding_submissions
language plpgsql security definer set search_path = ''
as $$
declare
  submission public.driver_onboarding_submissions;
  document_count integer;
  previous_status text;
begin
  if (select auth.uid()) is null then
    raise exception 'authentication_required';
  end if;

  select * into submission
  from public.driver_onboarding_submissions
  where driver_id = (select auth.uid())
  for update;

  if submission.id is null then
    raise exception 'onboarding_not_found';
  end if;
  if submission.status not in ('draft', 'needs_changes') then
    raise exception 'onboarding_not_editable';
  end if;
  previous_status := submission.status;

  if nullif(trim(p_consent_version), '') is null then
    raise exception 'consent_required';
  end if;

  if not exists (
    select 1 from public.driver_profiles
    where id = (select auth.uid())
      and nullif(trim(vehicle_class), '') is not null
      and nullif(trim(vehicle_make_model), '') is not null
      and nullif(trim(vehicle_plate), '') is not null
  ) then
    raise exception 'vehicle_details_incomplete';
  end if;

  select count(distinct document_type) into document_count
  from public.driver_documents
  where driver_id = (select auth.uid());

  if document_count <> 4 then
    raise exception 'documents_incomplete';
  end if;

  update public.driver_onboarding_submissions
  set current_step = 5,
      status = 'submitted',
      consent_version = trim(p_consent_version),
      consented_at = now(),
      submitted_at = now(),
      reviewed_at = null,
      reviewed_by = null,
      reviewer_notes = null
  where driver_id = (select auth.uid())
  returning * into submission;

  update public.driver_profiles
  set approval_status = 'submitted'
  where id = (select auth.uid());

  insert into public.driver_onboarding_events (driver_id, actor_id, event_type, from_status, to_status)
  values ((select auth.uid()), (select auth.uid()), 'submitted', previous_status, 'submitted');

  return submission;
end;
$$;

create or replace function public.review_driver_document(
  p_document_id uuid,
  p_status text,
  p_rejection_reason text default null
)
returns public.driver_documents
language plpgsql security definer set search_path = ''
as $$
declare
  document public.driver_documents;
begin
  if not public.is_admin() then
    raise exception 'not_admin';
  end if;
  if p_status not in ('pending', 'verified', 'rejected', 'expired') then
    raise exception 'invalid_document_status';
  end if;
  if p_status = 'rejected' and nullif(trim(p_rejection_reason), '') is null then
    raise exception 'rejection_reason_required';
  end if;

  update public.driver_documents
  set status = p_status,
      rejection_reason = case when p_status = 'rejected' then trim(p_rejection_reason) else null end,
      reviewed_at = now(),
      reviewed_by = (select auth.uid())
  where id = p_document_id
  returning * into document;

  if document.id is null then
    raise exception 'document_not_found';
  end if;
  return document;
end;
$$;

create or replace function public.review_driver_onboarding(
  p_driver_id uuid,
  p_status text,
  p_notes text default null
)
returns public.driver_onboarding_submissions
language plpgsql security definer set search_path = ''
as $$
declare
  submission public.driver_onboarding_submissions;
  previous_status text;
begin
  if not public.is_admin() then
    raise exception 'not_admin';
  end if;
  if p_status not in ('needs_changes', 'approved', 'rejected', 'suspended') then
    raise exception 'invalid_onboarding_status';
  end if;
  if p_status in ('needs_changes', 'rejected', 'suspended')
    and nullif(trim(p_notes), '') is null then
    raise exception 'review_notes_required';
  end if;

  select status into previous_status
  from public.driver_onboarding_submissions
  where driver_id = p_driver_id
  for update;

  if previous_status is null then
    raise exception 'onboarding_not_found';
  end if;

  if p_status = 'approved' and (
    (select count(distinct document_type) from public.driver_documents where driver_id = p_driver_id) <> 4
    or exists (
      select 1 from public.driver_documents
      where driver_id = p_driver_id
        and (status <> 'verified' or (expires_on is not null and expires_on < current_date))
    )
  ) then
    raise exception 'documents_not_verified';
  end if;

  update public.driver_onboarding_submissions
  set status = p_status,
      reviewed_at = now(),
      reviewed_by = (select auth.uid()),
      reviewer_notes = nullif(trim(p_notes), '')
  where driver_id = p_driver_id
  returning * into submission;

  update public.driver_profiles
  set approval_status = p_status,
      is_online = case when p_status = 'approved' then is_online else false end,
      online_at = case when p_status = 'approved' then online_at else null end
  where id = p_driver_id;

  insert into public.driver_onboarding_events (driver_id, actor_id, event_type, from_status, to_status, notes)
  values (p_driver_id, (select auth.uid()), 'reviewed', previous_status, p_status, nullif(trim(p_notes), ''));

  return submission;
end;
$$;

drop policy if exists "drivers read own onboarding" on public.driver_onboarding_submissions;
create policy "drivers read own onboarding"
on public.driver_onboarding_submissions
for select to authenticated
using (driver_id = (select auth.uid()) or public.is_admin());

drop policy if exists "drivers update own onboarding draft" on public.driver_onboarding_submissions;
create policy "drivers update own onboarding draft"
on public.driver_onboarding_submissions
for update to authenticated
using (driver_id = (select auth.uid()) and status in ('draft', 'needs_changes'))
with check (driver_id = (select auth.uid()) and status in ('draft', 'needs_changes'));

drop policy if exists "drivers read own documents" on public.driver_documents;
create policy "drivers read own documents"
on public.driver_documents
for select to authenticated
using (driver_id = (select auth.uid()) or public.is_admin());

drop policy if exists "drivers add own documents" on public.driver_documents;
create policy "drivers add own documents"
on public.driver_documents
for insert to authenticated
with check (
  driver_id = (select auth.uid())
  and exists (
    select 1 from public.driver_onboarding_submissions
    where driver_id = (select auth.uid()) and status in ('draft', 'needs_changes')
  )
);

drop policy if exists "drivers update own documents" on public.driver_documents;
create policy "drivers update own documents"
on public.driver_documents
for update to authenticated
using (
  driver_id = (select auth.uid())
  and exists (
    select 1 from public.driver_onboarding_submissions
    where driver_id = (select auth.uid()) and status in ('draft', 'needs_changes')
  )
)
with check (driver_id = (select auth.uid()));

drop policy if exists "drivers delete own documents" on public.driver_documents;
create policy "drivers delete own documents"
on public.driver_documents
for delete to authenticated
using (
  driver_id = (select auth.uid())
  and exists (
    select 1 from public.driver_onboarding_submissions
    where driver_id = (select auth.uid()) and status in ('draft', 'needs_changes')
  )
);

drop policy if exists "drivers read own onboarding history" on public.driver_onboarding_events;
create policy "drivers read own onboarding history"
on public.driver_onboarding_events
for select to authenticated
using (driver_id = (select auth.uid()) or public.is_admin());

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.submit_driver_onboarding(text) from public, anon;
revoke execute on function public.review_driver_document(uuid, text, text) from public, anon;
revoke execute on function public.review_driver_onboarding(uuid, text, text) from public, anon;
grant execute on function public.submit_driver_onboarding(text) to authenticated;
grant execute on function public.review_driver_document(uuid, text, text) to authenticated;
grant execute on function public.review_driver_onboarding(uuid, text, text) to authenticated;
