-- Live GPS is scoped to a single assigned trip. No location history is retained.
create schema if not exists transfer_private;
revoke all on schema transfer_private from public, anon, authenticated;

alter table public.bookings add column if not exists journey_stage text not null default 'to_pickup'
  check (journey_stage in ('to_pickup', 'at_pickup', 'on_trip'));

create table public.trip_locations (
  booking_id uuid primary key references public.bookings(id) on delete cascade,
  driver_id uuid not null references public.profiles(id) on delete cascade,
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  heading double precision check (heading between 0 and 360),
  accuracy double precision check (accuracy between 0 and 10000),
  speed double precision check (speed between 0 and 150),
  captured_at timestamptz not null,
  received_at timestamptz not null default clock_timestamp(),
  driver_name text,
  vehicle_name text,
  vehicle_plate text
);
create index trip_locations_driver_idx on public.trip_locations(driver_id);
alter table public.trip_locations enable row level security;
revoke all on public.trip_locations from public, anon;
grant select, insert, update, delete on public.trip_locations to authenticated;
grant all on public.trip_locations to service_role;

create policy "trip participants read active driver position" on public.trip_locations
for select to authenticated using (
  exists (select 1 from public.bookings b where b.id = trip_locations.booking_id
    and b.driver_id = trip_locations.driver_id and b.status in ('claimed','en_route')
    and (b.driver_id = (select auth.uid()) or b.user_id = (select auth.uid())
      or lower(b.customer_email) = lower((select auth.email()))))
);
create policy "assigned driver inserts own live position" on public.trip_locations
for insert to authenticated with check (
  driver_id = (select auth.uid()) and exists (
    select 1 from public.bookings b join public.driver_profiles d on d.id = b.driver_id
    where b.id = booking_id and b.driver_id = (select auth.uid())
      and b.status in ('claimed','en_route') and d.approval_status = 'approved')
);
create policy "assigned driver updates own live position" on public.trip_locations
for update to authenticated using (
  driver_id = (select auth.uid()) and exists (select 1 from public.bookings b
    where b.id = booking_id and b.driver_id = (select auth.uid()) and b.status in ('claimed','en_route'))
) with check (
  driver_id = (select auth.uid()) and exists (
    select 1 from public.bookings b join public.driver_profiles d on d.id = b.driver_id
    where b.id = booking_id and b.driver_id = (select auth.uid())
      and b.status in ('claimed','en_route') and d.approval_status = 'approved')
);
create policy "driver stops own sharing" on public.trip_locations
for delete to authenticated using (driver_id = (select auth.uid()));

create function transfer_private.stamp_trip_location() returns trigger
language plpgsql set search_path = '' as $$
begin
  if TG_OP = 'UPDATE' then
    if new.booking_id <> old.booking_id or new.driver_id <> old.driver_id then
      raise exception 'location_owner_immutable';
    end if;
    if new.captured_at <= old.captured_at then return null; end if;
  end if;
  if new.captured_at < clock_timestamp() - interval '2 minutes'
    or new.captured_at > clock_timestamp() + interval '1 minute' then
    raise exception 'location_sample_expired';
  end if;
  new.received_at := clock_timestamp();
  select p.full_name, d.vehicle_make_model, d.vehicle_plate
    into new.driver_name, new.vehicle_name, new.vehicle_plate
    from public.profiles p join public.driver_profiles d on d.id=p.id where p.id=new.driver_id;
  return new;
end $$;
create trigger stamp_trip_location before insert or update on public.trip_locations
  for each row execute function transfer_private.stamp_trip_location();

create function transfer_private.clear_finished_trip_location() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.status not in ('claimed','en_route') or new.driver_id is distinct from old.driver_id then
    delete from public.trip_locations where booking_id = new.id;
  end if;
  return new;
end $$;
create trigger clear_finished_trip_location after update of status, driver_id on public.bookings
  for each row execute function transfer_private.clear_finished_trip_location();

create function public.advance_trip(p_booking_id uuid, p_stage text) returns public.bookings
language plpgsql security definer set search_path = '' as $$
declare b public.bookings;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  select * into b from public.bookings where id=p_booking_id for update;
  if not found or b.driver_id is distinct from auth.uid() then raise exception 'forbidden'; end if;
  if b.status not in ('claimed','en_route') then raise exception 'trip_not_active'; end if;
  if not exists(select 1 from public.driver_profiles where id=auth.uid() and approval_status='approved') then
    raise exception 'driver_not_approved'; end if;
  if (p_stage='at_pickup' and b.status='en_route' and b.journey_stage='to_pickup')
    or (p_stage='on_trip' and b.status='en_route' and b.journey_stage='at_pickup') then
    update public.bookings set journey_stage=p_stage, updated_at=now() where id=p_booking_id returning * into b;
    return b;
  end if;
  raise exception 'invalid_trip_transition';
end $$;
revoke all on function public.advance_trip(uuid,text) from public, anon;
grant execute on function public.advance_trip(uuid,text) to authenticated;

do $$ begin
  if exists(select 1 from pg_publication where pubname='supabase_realtime') then
    if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='trip_locations') then
      alter publication supabase_realtime add table public.trip_locations;
    end if;
    if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='bookings') then
      alter publication supabase_realtime add table public.bookings;
    end if;
  end if;
end $$;
