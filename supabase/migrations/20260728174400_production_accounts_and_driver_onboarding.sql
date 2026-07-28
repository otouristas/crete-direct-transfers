-- Production accounts, profile preferences, resumable driver onboarding,
-- private KYC documents, and explicit privileged-function access.

-- ---------------------------------------------------------------------------
-- Quote-first market expansion
-- ---------------------------------------------------------------------------

alter table public.partners
  drop constraint if exists partners_market_check;
alter table public.partners
  add constraint partners_market_check
  check (market in ('greece', 'spain', 'italy', 'portugal', 'cyprus', 'turkey'));

alter table public.service_zones
  drop constraint if exists service_zones_market_check;
alter table public.service_zones
  add constraint service_zones_market_check
  check (market in ('greece', 'spain', 'italy', 'portugal', 'cyprus', 'turkey'));

alter table public.bookings
  drop constraint if exists bookings_market_check;
alter table public.bookings
  add constraint bookings_market_check
  check (
    market is null
    or market in ('greece', 'spain', 'italy', 'portugal', 'cyprus', 'turkey')
  );

-- ---------------------------------------------------------------------------
-- Profiles and existing driver state
-- ---------------------------------------------------------------------------

alter table public.profiles
  add column if not exists preferred_locale text not null default 'en'
    check (preferred_locale in ('en', 'el', 'de', 'fr', 'it', 'nl', 'es')),
  add column if not exists preferred_currency text not null default 'EUR'
    check (preferred_currency ~ '^[A-Z]{3}$');

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
        'draft',
        'submitted',
        'needs_changes',
        'approved',
        'rejected',
        'suspended'
      )
    );

comment on column public.driver_profiles.license_number is
  'Deprecated. New onboarding stores private document objects instead.';
comment on column public.driver_profiles.insurance_number is
  'Deprecated. New onboarding stores private document objects instead.';
comment on column public.driver_profiles.id_document_number is
  'Deprecated. New onboarding stores private document objects instead.';
comment on column public.driver_profiles.vehicle_registration_number is
  'Deprecated. New onboarding stores private document objects instead.';

revoke update (
  license_number,
  insurance_number,
  id_document_number,
  vehicle_registration_number
) on public.driver_profiles from authenticated;

grant update (
  full_name,
  phone,
  preferred_locale,
  preferred_currency
) on public.profiles to authenticated;

-- Safely backfill accounts created before the profile migration was applied.
insert into public.profiles (id, full_name, phone, role, preferred_locale)
select
  users.id,
  nullif(users.raw_user_meta_data->>'full_name', ''),
  nullif(users.raw_user_meta_data->>'phone', ''),
  case
    when users.raw_user_meta_data->>'signup_role' = 'driver' then 'driver'
    else 'customer'
  end,
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

-- ---------------------------------------------------------------------------
-- Resumable onboarding and document review
-- ---------------------------------------------------------------------------

create table if not exists public.driver_onboarding_submissions (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null unique references public.driver_profiles(id) on delete cascade,
  current_step smallint not null default 1 check (current_step between 1 and 5),
  status text not null default 'draft'
    check (
      status in (
        'draft',
        'submitted',
        'needs_changes',
        'approved',
        'rejected',
        'suspended'
      )
    ),
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
    check (
      document_type in (
        'driving_licence',
        'identity',
        'insurance',
        'vehicle_registration'
      )
    ),
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
create index if not exists driver_documents_expiry_idx
  on public.driver_documents (expires_on)
  where expires_on is not null;
create index if not exists driver_onboarding_events_driver_idx
  on public.driver_onboarding_events (driver_id, created_at desc);

drop trigger if exists driver_onboarding_submissions_updated_at
  on public.driver_onboarding_submissions;
create trigger driver_onboarding_submissions_updated_at
before update on public.driver_onboarding_submissions
for each row execute function public.set_updated_at();

drop trigger if exists driver_documents_updated_at on public.driver_documents;
create trigger driver_documents_updated_at
before update on public.driver_documents
for each row execute function public.set_updated_at();

insert into public.driver_onboarding_submissions (
  driver_id,
  current_step,
  status,
  submitted_at
)
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

-- New signups receive only non-sensitive profile data. Driver KYC is completed
-- after authentication through the private onboarding flow.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_role text := case
    when new.raw_user_meta_data->>'signup_role' = 'driver' then 'driver'
    else 'customer'
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

create or replace function public.submit_driver_onboarding(
  p_consent_version text
)
returns public.driver_onboarding_submissions
language plpgsql
security definer
set search_path = ''
as $$
declare
  submission public.driver_onboarding_submissions;
  document_count integer;
  previous_status text;
begin
  if (select auth.uid()) is null then
    raise exception 'authentication_required';
  end if;

  select *
  into submission
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
    select 1
    from public.driver_profiles
    where id = (select auth.uid())
      and nullif(trim(vehicle_class), '') is not null
      and nullif(trim(vehicle_make_model), '') is not null
      and nullif(trim(vehicle_plate), '') is not null
  ) then
    raise exception 'vehicle_details_incomplete';
  end if;

  select count(distinct document_type)
  into document_count
  from public.driver_documents
  where driver_id = (select auth.uid());

  if document_count <> 4 then
    raise exception 'documents_incomplete';
  end if;

  update public.driver_onboarding_submissions
  set
    current_step = 5,
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

  insert into public.driver_onboarding_events (
    driver_id,
    actor_id,
    event_type,
    from_status,
    to_status
  )
  values (
    (select auth.uid()),
    (select auth.uid()),
    'submitted',
    previous_status,
    'submitted'
  );

  return submission;
end;
$$;

create or replace function public.review_driver_document(
  p_document_id uuid,
  p_status text,
  p_rejection_reason text default null
)
returns public.driver_documents
language plpgsql
security definer
set search_path = ''
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
  set
    status = p_status,
    rejection_reason = case
      when p_status = 'rejected' then trim(p_rejection_reason)
      else null
    end,
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
language plpgsql
security definer
set search_path = ''
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

  select status
  into previous_status
  from public.driver_onboarding_submissions
  where driver_id = p_driver_id
  for update;

  if previous_status is null then
    raise exception 'onboarding_not_found';
  end if;

  if p_status = 'approved' and (
    (
      select count(distinct document_type)
      from public.driver_documents
      where driver_id = p_driver_id
    ) <> 4
    or exists (
      select 1
      from public.driver_documents
      where driver_id = p_driver_id
        and (
          status <> 'verified'
          or (expires_on is not null and expires_on < current_date)
        )
    )
  ) then
    raise exception 'documents_not_verified';
  end if;

  update public.driver_onboarding_submissions
  set
    status = p_status,
    reviewed_at = now(),
    reviewed_by = (select auth.uid()),
    reviewer_notes = nullif(trim(p_notes), '')
  where driver_id = p_driver_id
  returning * into submission;

  update public.driver_profiles
  set
    approval_status = p_status,
    is_online = case when p_status = 'approved' then is_online else false end,
    online_at = case when p_status = 'approved' then online_at else null end
  where id = p_driver_id;

  insert into public.driver_onboarding_events (
    driver_id,
    actor_id,
    event_type,
    from_status,
    to_status,
    notes
  )
  values (
    p_driver_id,
    (select auth.uid()),
    'reviewed',
    previous_status,
    p_status,
    nullif(trim(p_notes), '')
  );

  return submission;
end;
$$;

-- ---------------------------------------------------------------------------
-- Data API grants and RLS
-- ---------------------------------------------------------------------------

alter table public.driver_onboarding_submissions enable row level security;
alter table public.driver_documents enable row level security;
alter table public.driver_onboarding_events enable row level security;

revoke all on public.driver_onboarding_submissions from anon, authenticated;
revoke all on public.driver_documents from anon, authenticated;
revoke all on public.driver_onboarding_events from anon, authenticated;

grant select on public.driver_onboarding_submissions to authenticated;
grant update (current_step) on public.driver_onboarding_submissions to authenticated;

grant select on public.driver_documents to authenticated;
grant insert (
  driver_id,
  document_type,
  storage_path,
  original_filename,
  mime_type,
  size_bytes,
  expires_on
) on public.driver_documents to authenticated;
grant update (
  document_type,
  storage_path,
  original_filename,
  mime_type,
  size_bytes,
  expires_on
) on public.driver_documents to authenticated;
grant delete on public.driver_documents to authenticated;

grant select on public.driver_onboarding_events to authenticated;

grant all on public.driver_onboarding_submissions to service_role;
grant all on public.driver_documents to service_role;
grant all on public.driver_onboarding_events to service_role;
grant usage, select on sequence public.driver_onboarding_events_id_seq to service_role;

drop policy if exists "drivers read own onboarding"
  on public.driver_onboarding_submissions;
create policy "drivers read own onboarding"
on public.driver_onboarding_submissions
for select to authenticated
using (driver_id = (select auth.uid()) or public.is_admin());

drop policy if exists "drivers update own onboarding draft"
  on public.driver_onboarding_submissions;
create policy "drivers update own onboarding draft"
on public.driver_onboarding_submissions
for update to authenticated
using (
  driver_id = (select auth.uid())
  and status in ('draft', 'needs_changes')
)
with check (
  driver_id = (select auth.uid())
  and status in ('draft', 'needs_changes')
);

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
    select 1
    from public.driver_onboarding_submissions
    where driver_id = (select auth.uid())
      and status in ('draft', 'needs_changes')
  )
);

drop policy if exists "drivers update own documents" on public.driver_documents;
create policy "drivers update own documents"
on public.driver_documents
for update to authenticated
using (
  driver_id = (select auth.uid())
  and exists (
    select 1
    from public.driver_onboarding_submissions
    where driver_id = (select auth.uid())
      and status in ('draft', 'needs_changes')
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
    select 1
    from public.driver_onboarding_submissions
    where driver_id = (select auth.uid())
      and status in ('draft', 'needs_changes')
  )
);

drop policy if exists "drivers read own onboarding history"
  on public.driver_onboarding_events;
create policy "drivers read own onboarding history"
on public.driver_onboarding_events
for select to authenticated
using (driver_id = (select auth.uid()) or public.is_admin());

-- ---------------------------------------------------------------------------
-- Private Storage bucket and object ownership
-- ---------------------------------------------------------------------------

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'driver-documents',
  'driver-documents',
  false,
  10485760,
  array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "drivers upload own private documents" on storage.objects;
create policy "drivers upload own private documents"
on storage.objects
for insert to authenticated
with check (
  bucket_id = 'driver-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1
    from public.driver_onboarding_submissions
    where driver_id = (select auth.uid())
      and status in ('draft', 'needs_changes')
  )
);

drop policy if exists "drivers read own private documents" on storage.objects;
create policy "drivers read own private documents"
on storage.objects
for select to authenticated
using (
  bucket_id = 'driver-documents'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or public.is_admin()
  )
);

drop policy if exists "drivers replace own private documents" on storage.objects;
create policy "drivers replace own private documents"
on storage.objects
for update to authenticated
using (
  bucket_id = 'driver-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1
    from public.driver_onboarding_submissions
    where driver_id = (select auth.uid())
      and status in ('draft', 'needs_changes')
  )
)
with check (
  bucket_id = 'driver-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1
    from public.driver_onboarding_submissions
    where driver_id = (select auth.uid())
      and status in ('draft', 'needs_changes')
  )
);

drop policy if exists "drivers delete own private documents" on storage.objects;
create policy "drivers delete own private documents"
on storage.objects
for delete to authenticated
using (
  bucket_id = 'driver-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1
    from public.driver_onboarding_submissions
    where driver_id = (select auth.uid())
      and status in ('draft', 'needs_changes')
  )
);

-- ---------------------------------------------------------------------------
-- Privileged function access
-- ---------------------------------------------------------------------------

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.is_admin() from public, anon;
revoke execute on function public.is_approved_driver() from public, anon;
revoke execute on function public.is_partner_dispatcher(uuid) from public, anon;
revoke execute on function public.my_partner_ids() from public, anon;
revoke execute on function public.resolve_zone_id(text, double precision, double precision)
  from public, anon, authenticated;
revoke execute on function public.pick_partner_for_zone(uuid)
  from public, anon, authenticated;
revoke execute on function public.submit_driver_onboarding(text) from public, anon;
revoke execute on function public.review_driver_document(uuid, text, text) from public, anon;
revoke execute on function public.review_driver_onboarding(uuid, text, text) from public, anon;

grant execute on function public.is_admin() to authenticated, service_role;
grant execute on function public.is_approved_driver() to authenticated, service_role;
grant execute on function public.is_partner_dispatcher(uuid) to authenticated, service_role;
grant execute on function public.my_partner_ids() to authenticated, service_role;
grant execute on function public.resolve_zone_id(text, double precision, double precision)
  to service_role;
grant execute on function public.pick_partner_for_zone(uuid) to service_role;
grant execute on function public.submit_driver_onboarding(text) to authenticated;
grant execute on function public.review_driver_document(uuid, text, text) to authenticated;
grant execute on function public.review_driver_onboarding(uuid, text, text) to authenticated;

-- Harden every existing SECURITY DEFINER routine in the public schema, including
-- routines introduced by earlier repository migrations.
do $$
declare
  routine record;
begin
  for routine in
    select procedure.oid::regprocedure as signature
    from pg_proc as procedure
    join pg_namespace as namespace on namespace.oid = procedure.pronamespace
    where namespace.nspname = 'public'
      and procedure.prosecdef
  loop
    execute format('alter function %s set search_path = %L', routine.signature, '');
  end loop;
end;
$$;
