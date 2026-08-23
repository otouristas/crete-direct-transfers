-- Archived duplicate snapshot. Return trips, luggage and pickup/drop-off locations on bookings (widget v2)
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS trip_type text NOT NULL DEFAULT 'oneway',
  ADD COLUMN IF NOT EXISTS return_at timestamptz,
  ADD COLUMN IF NOT EXISTS return_flight_number text,
  ADD COLUMN IF NOT EXISTS bags_checked int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS bags_cabin int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS pickup_address text,
  ADD COLUMN IF NOT EXISTS dropoff_address text,
  ADD COLUMN IF NOT EXISTS pickup_point jsonb,
  ADD COLUMN IF NOT EXISTS dropoff_point jsonb;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bookings_trip_type_check') THEN
    ALTER TABLE public.bookings ADD CONSTRAINT bookings_trip_type_check CHECK (trip_type IN ('oneway', 'return'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bookings_bags_checked_check') THEN
    ALTER TABLE public.bookings ADD CONSTRAINT bookings_bags_checked_check CHECK (bags_checked BETWEEN 0 AND 20);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bookings_bags_cabin_check') THEN
    ALTER TABLE public.bookings ADD CONSTRAINT bookings_bags_cabin_check CHECK (bags_cabin BETWEEN 0 AND 20);
  END IF;
END $$;

GRANT INSERT ON public.bookings TO anon, authenticated;

-- Profiles + driver profiles, auto-created on signup.
create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'driver', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.driver_profiles (
  id uuid primary key references public.profiles(id) on delete cascade,
  vehicle_class text,
  vehicle_make_model text,
  vehicle_plate text,
  license_number text,
  insurance_number text,
  id_document_number text,
  vehicle_registration_number text,
  approval_status text not null default 'pending'
    check (approval_status in ('pending', 'approved', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint driver_profiles_vehicle_class_check check (
    vehicle_class is null or vehicle_class in (
      'economy','comfort','luxury','suv','minivan','van-first','minibus-12','minibus-16'
    )
  )
);

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger driver_profiles_updated_at before update on public.driver_profiles
  for each row execute function public.set_updated_at();

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_role text := case when new.raw_user_meta_data->>'signup_role' = 'driver'
                 then 'driver' else 'customer' end;
begin
  insert into public.profiles (id, full_name, phone, role)
  values (
    new.id,
    nullif(new.raw_user_meta_data->>'full_name', ''),
    nullif(new.raw_user_meta_data->>'phone', ''),
    v_role
  );
  if v_role = 'driver' then
    insert into public.driver_profiles (
      id, vehicle_class, vehicle_make_model, vehicle_plate,
      license_number, insurance_number, id_document_number, vehicle_registration_number
    )
    values (
      new.id,
      nullif(new.raw_user_meta_data->>'vehicle_class', ''),
      nullif(new.raw_user_meta_data->>'vehicle_make_model', ''),
      nullif(new.raw_user_meta_data->>'vehicle_plate', ''),
      nullif(new.raw_user_meta_data->>'license_number', ''),
      nullif(new.raw_user_meta_data->>'insurance_number', ''),
      nullif(new.raw_user_meta_data->>'id_document_number', ''),
      nullif(new.raw_user_meta_data->>'vehicle_registration_number', '')
    );
  end if;
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_approved_driver() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1
    from public.driver_profiles dp
    join public.profiles p on p.id = dp.id
    where dp.id = auth.uid()
      and p.role = 'driver'
      and dp.approval_status = 'approved'
  )
$$;

alter table public.profiles enable row level security;
alter table public.driver_profiles enable row level security;

revoke all on public.profiles from anon, authenticated;
revoke all on public.driver_profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, phone) on public.profiles to authenticated;
grant select on public.driver_profiles to authenticated;
grant update (vehicle_class, vehicle_make_model, vehicle_plate,
  license_number, insurance_number, id_document_number, vehicle_registration_number)
  on public.driver_profiles to authenticated;
grant all on public.profiles to service_role;
grant all on public.driver_profiles to service_role;

create policy "own profile select" on public.profiles
  for select to authenticated using (id = auth.uid());
create policy "own profile update" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "own driver profile select" on public.driver_profiles
  for select to authenticated using (id = auth.uid());
create policy "own driver profile update" on public.driver_profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- Booking dispatch
alter table public.bookings
  add column if not exists user_id uuid references auth.users(id) on delete set null,
  add column if not exists driver_id uuid references public.profiles(id) on delete set null,
  add column if not exists assigned_at timestamptz,
  add column if not exists updated_at timestamptz not null default now();

create trigger bookings_updated_at before update on public.bookings
  for each row execute function public.set_updated_at();

update public.bookings set status = 'pending'
  where status not in ('pending', 'claimed', 'en_route', 'completed', 'cancelled', 'no_show');
alter table public.bookings add constraint bookings_status_check
  check (status in ('pending', 'claimed', 'en_route', 'completed', 'cancelled', 'no_show'));

create index idx_bookings_user_id on public.bookings (user_id);
create index idx_bookings_customer_email on public.bookings (lower(customer_email));
create index idx_bookings_driver_id on public.bookings (driver_id, pickup_at);
create index idx_bookings_open_pool on public.bookings (pickup_at)
  where status = 'pending' and driver_id is null;

revoke update on public.bookings from authenticated;
grant update (status) on public.bookings to authenticated;
grant all on public.bookings to service_role;

drop policy if exists "anyone can create booking" on public.bookings;
create policy "anyone can create booking" on public.bookings
  for insert to anon, authenticated
  with check (
    status = 'pending'
    and driver_id is null
    and (user_id is null or user_id = auth.uid())
  );

create policy "customers read own bookings" on public.bookings
  for select to authenticated
  using (user_id = auth.uid() or lower(customer_email) = lower(auth.email()));

create policy "drivers read own jobs" on public.bookings
  for select to authenticated
  using (driver_id = auth.uid());

create policy "customers cancel own bookings" on public.bookings
  for update to authenticated
  using (
    (user_id = auth.uid() or lower(customer_email) = lower(auth.email()))
    and status in ('pending', 'claimed')
    and pickup_at > now() + interval '24 hours'
  )
  with check (
    (user_id = auth.uid() or lower(customer_email) = lower(auth.email()))
    and status = 'cancelled'
  );

create policy "drivers progress own jobs" on public.bookings
  for update to authenticated
  using (driver_id = auth.uid() and status in ('claimed', 'en_route'))
  with check (driver_id = auth.uid() and status in ('en_route', 'completed', 'no_show'));

create view public.open_jobs as
  select id, route_slug, vehicle_class, passengers, pickup_at, trip_type, return_at,
         bags_checked, bags_cabin, pickup_address, dropoff_address,
         extras, price_cents, currency, created_at
  from public.bookings
  where status = 'pending'
    and driver_id is null
    and pickup_at > now()
    and public.is_approved_driver();

revoke all on public.open_jobs from anon;
grant select on public.open_jobs to authenticated;

create or replace function public.claim_job(p_booking_id uuid)
returns public.bookings
language plpgsql security definer set search_path = public as $$
declare
  v_booking public.bookings;
begin
  if not public.is_approved_driver() then
    raise exception 'not_approved_driver';
  end if;
  update public.bookings
     set driver_id = auth.uid(), status = 'claimed', assigned_at = now()
   where id = p_booking_id and status = 'pending' and driver_id is null
   returning * into v_booking;
  if v_booking.id is null then
    raise exception 'job_already_claimed';
  end if;
  return v_booking;
end $$;

revoke execute on function public.claim_job(uuid) from public, anon;
grant execute on function public.claim_job(uuid) to authenticated;

create or replace function public.booking_driver_info(p_booking_id uuid)
returns table (full_name text, phone text, vehicle_make_model text, vehicle_plate text, vehicle_class text)
language sql stable security definer set search_path = public as $$
  select p.full_name, p.phone, dp.vehicle_make_model, dp.vehicle_plate, dp.vehicle_class
  from public.bookings b
  join public.profiles p on p.id = b.driver_id
  left join public.driver_profiles dp on dp.id = b.driver_id
  where b.id = p_booking_id
    and (b.user_id = auth.uid() or lower(b.customer_email) = lower(auth.email()))
$$;

revoke execute on function public.booking_driver_info(uuid) from public, anon;
grant execute on function public.booking_driver_info(uuid) to authenticated;
