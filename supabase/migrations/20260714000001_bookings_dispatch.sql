-- Booking dispatch: link bookings to customers + drivers, lock the status
-- lifecycle, open-pool claiming.
-- Lifecycle: pending (open pool) -> claimed -> en_route -> completed | no_show;
-- cancelled is reachable from pending/claimed.

alter table public.bookings
  add column user_id uuid references auth.users(id) on delete set null,
  add column driver_id uuid references public.profiles(id) on delete set null,
  add column assigned_at timestamptz,
  add column updated_at timestamptz not null default now();

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

-- Clients may only ever update `status`; driver_id/assigned_at are written
-- exclusively by the claim_job() definer function.
revoke update on public.bookings from authenticated;
grant update (status) on public.bookings to authenticated;

-- Recreate INSERT policy: guests still book freely, but user_id can only be
-- null or the caller's own id (no spoofing), and rows start unassigned.
drop policy if exists "anyone can create booking" on public.bookings;
create policy "anyone can create booking" on public.bookings
  for insert to anon, authenticated
  with check (
    status = 'pending'
    and driver_id is null
    and (user_id is null or user_id = auth.uid())
  );

-- Account linkage: by stamped user_id or by verified email (email confirmation
-- must be ON in Auth settings for the email arm to be safe).
create policy "customers read own bookings" on public.bookings
  for select to authenticated
  using (user_id = auth.uid() or lower(customer_email) = lower(auth.email()));

create policy "drivers read own jobs" on public.bookings
  for select to authenticated
  using (driver_id = auth.uid());

-- NOTE: permissive UPDATE policies pool their USING and WITH CHECK clauses
-- with OR, so each WITH CHECK below re-asserts ownership — otherwise a
-- customer could satisfy the driver policy's check (or vice versa).
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

-- Open pool for approved drivers. Owner-rights view (bypasses bookings RLS on
-- purpose; the Supabase security advisor will flag it — intentional): access is
-- gated by is_approved_driver(), and customer PII (name/email/phone/flight/
-- notes/map points) stays hidden until a job is claimed.
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

-- Atomic claim: the WHERE clause makes racing claims safe — the loser matches
-- zero rows and gets a clean, translatable error code.
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

-- Driver card shown to the customer once their booking is claimed.
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
