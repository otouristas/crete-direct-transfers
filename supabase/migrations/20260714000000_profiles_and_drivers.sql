-- Profiles + driver profiles, auto-created on signup.
-- Roles: customer (default) | driver | admin ('admin' is never settable via signup).

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
  vehicle_class text check (vehicle_class in ('economy', 'comfort', 'minivan', 'luxury')),
  vehicle_make_model text,
  vehicle_plate text,
  -- vetting documents: driving licence, car insurance policy, ID/passport/EOT
  -- registry number, vehicle registration (άδεια κυκλοφορίας)
  license_number text,
  insurance_number text,
  id_document_number text,
  vehicle_registration_number text,
  approval_status text not null default 'pending'
    check (approval_status in ('pending', 'approved', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger driver_profiles_updated_at before update on public.driver_profiles
  for each row execute function public.set_updated_at();

-- SECURITY DEFINER: with email confirmation ON there is no session right after
-- signUp(), so the client cannot insert these rows itself.
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

-- SECURITY DEFINER so bookings policies / the open_jobs view can check driver
-- approval without opening cross-table RLS.
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

-- Column-level grants: users may never change role / approval_status.
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
