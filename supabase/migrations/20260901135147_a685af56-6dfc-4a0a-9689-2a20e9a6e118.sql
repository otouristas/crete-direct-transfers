create table if not exists public.trip_locations (
  booking_id uuid primary key references public.bookings(id) on delete cascade,
  driver_id uuid not null references auth.users(id) on delete cascade,
  lat double precision not null,
  lng double precision not null,
  heading double precision,
  speed_kph double precision,
  eta_minutes integer,
  distance_km double precision,
  stage text not null default 'to_pickup',
  updated_at timestamptz not null default now()
);

grant select on public.trip_locations to authenticated;
grant all on public.trip_locations to service_role;
revoke insert, update, delete on public.trip_locations from anon, authenticated;

alter table public.trip_locations enable row level security;

drop policy if exists "trip location visible to trip parties" on public.trip_locations;
create policy "trip location visible to trip parties" on public.trip_locations
  for select to authenticated
  using (
    driver_id = auth.uid()
    or exists (
      select 1 from public.bookings b
      where b.id = booking_id and public.owns_booking(b)
    )
    or public.is_admin()
  );

create or replace function public.ping_driver_location(
  p_booking_id uuid,
  p_lat double precision,
  p_lng double precision,
  p_heading double precision default null,
  p_speed_kph double precision default null,
  p_eta_minutes integer default null,
  p_distance_km double precision default null,
  p_stage text default 'to_pickup'
) returns public.trip_locations
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking public.bookings;
  v_row public.trip_locations;
begin
  select * into v_booking from public.bookings where id = p_booking_id;
  if v_booking.id is null then
    raise exception 'booking_not_found';
  end if;
  if v_booking.driver_id is null or v_booking.driver_id <> auth.uid() then
    raise exception 'not_assigned_driver';
  end if;
  if p_lat is null or p_lng is null or p_lat < -90 or p_lat > 90 or p_lng < -180 or p_lng > 180 then
    raise exception 'invalid_coordinates';
  end if;
  if p_stage not in ('to_pickup', 'waiting', 'on_trip') then
    raise exception 'invalid_stage';
  end if;

  insert into public.trip_locations as tl (
    booking_id, driver_id, lat, lng, heading, speed_kph, eta_minutes, distance_km, stage, updated_at
  ) values (
    p_booking_id, auth.uid(), p_lat, p_lng, p_heading, p_speed_kph, p_eta_minutes, p_distance_km, p_stage, now()
  )
  on conflict (booking_id) do update set
    driver_id = excluded.driver_id,
    lat = excluded.lat,
    lng = excluded.lng,
    heading = excluded.heading,
    speed_kph = excluded.speed_kph,
    eta_minutes = excluded.eta_minutes,
    distance_km = excluded.distance_km,
    stage = excluded.stage,
    updated_at = now()
  returning tl.* into v_row;

  return v_row;
end;
$$;

grant execute on function public.ping_driver_location(uuid, double precision, double precision, double precision, double precision, integer, double precision, text) to authenticated;

alter table public.trip_locations replica identity full;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'trip_locations'
  ) then
    execute 'alter publication supabase_realtime add table public.trip_locations';
  end if;
end;
$$;