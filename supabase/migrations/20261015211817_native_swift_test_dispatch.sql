-- Swift clients use Apple device tokens directly. Test fulfillment remains isolated
-- from bookings, Stripe, driver compliance, invoices and carrier payouts.
create table transfer_private.test_members (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table transfer_private.test_members enable row level security;
revoke all on transfer_private.test_members from public, anon, authenticated;
-- Test membership is provisioned privately by the owner; no personal email
-- addresses or account IDs are distributed in schema migrations.
insert into transfer_private.test_members(user_id)
  select id from auth.users where raw_app_meta_data->>'transfer_test_access'='true';

create function public.is_transfer_tester() returns boolean
language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null and exists(select 1 from transfer_private.test_members where user_id=auth.uid())
$$;
revoke all on function public.is_transfer_tester() from public, anon;
grant execute on function public.is_transfer_tester() to authenticated;

create table public.native_device_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  token text not null check(token ~ '^[a-f0-9]{64}$'),
  topic text not null check(topic in ('com.transferaround.rider','com.transferaround.driver')),
  role text not null check(role in ('customer','driver')),
  environment text not null check(environment in ('sandbox','production')),
  updated_at timestamptz not null default now(),
  unique(token, topic),
  check((role='driver' and topic='com.transferaround.driver') or (role='customer' and topic='com.transferaround.rider'))
);
create index native_device_user_idx on public.native_device_tokens(user_id,role);
alter table public.native_device_tokens enable row level security;
revoke all on public.native_device_tokens from public, anon;
grant select,insert,update,delete on public.native_device_tokens to authenticated;
grant all on public.native_device_tokens to service_role;
create policy "own Apple devices" on public.native_device_tokens to authenticated
using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));

create table transfer_private.test_driver_presence (
  user_id uuid primary key references auth.users(id) on delete cascade,
  available_until timestamptz not null
);
alter table transfer_private.test_driver_presence enable row level security;
revoke all on transfer_private.test_driver_presence from public,anon,authenticated;

create table public.test_rides (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  driver_id uuid references public.profiles(id) on delete set null,
  is_test boolean not null default true check(is_test),
  status text not null default 'pending' check(status in ('pending','claimed','en_route','completed','cancelled','expired')),
  journey_stage text not null default 'to_pickup' check(journey_stage in ('to_pickup','at_pickup','on_trip')),
  payment_status text not null default 'demo' check(payment_status='demo'),
  pickup_point jsonb not null,
  dropoff_point jsonb not null,
  pickup_address text not null check(length(pickup_address) between 2 and 250),
  dropoff_address text not null check(length(dropoff_address) between 2 and 250),
  pickup_at timestamptz not null,
  vehicle_class text not null check(vehicle_class in ('economy','comfort','minivan')),
  passengers integer not null check(passengers between 1 and 7),
  price_cents integer not null check(price_cents between 1 and 1000000),
  customer_name text not null default 'Test traveler',
  customer_phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null default now()+interval '2 hours'
);
create index test_rides_user_idx on public.test_rides(user_id,created_at desc);
create index test_rides_driver_idx on public.test_rides(driver_id,created_at desc);
alter table public.test_rides enable row level security;
revoke all on public.test_rides from public,anon,authenticated;
grant select on public.test_rides to authenticated;
grant all on public.test_rides to service_role;
create policy "test journey participants" on public.test_rides for select to authenticated
using(user_id=(select auth.uid()) or driver_id=(select auth.uid()));

create table public.test_ride_offers (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.test_rides(id) on delete cascade,
  driver_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check(status in ('pending','accepted','declined','cancelled','expired')),
  expires_at timestamptz not null default now()+interval '90 seconds',
  unique(booking_id,driver_id)
);
create index test_offers_driver_idx on public.test_ride_offers(driver_id,expires_at) where status='pending';
alter table public.test_ride_offers enable row level security;
revoke all on public.test_ride_offers from public,anon,authenticated;
grant select on public.test_ride_offers to authenticated;
grant all on public.test_ride_offers to service_role;
create policy "own test offers" on public.test_ride_offers for select to authenticated using(driver_id=(select auth.uid()));

create table public.test_trip_locations (
  booking_id uuid primary key references public.test_rides(id) on delete cascade,
  driver_id uuid not null references public.profiles(id) on delete cascade,
  latitude double precision not null check(latitude between -90 and 90),
  longitude double precision not null check(longitude between -180 and 180),
  heading double precision check(heading between 0 and 360),
  captured_at timestamptz not null,
  received_at timestamptz not null default now(),
  driver_name text,
  vehicle_name text,
  vehicle_plate text
);
create index test_trip_locations_driver_idx on public.test_trip_locations(driver_id);
alter table public.test_trip_locations enable row level security;
revoke all on public.test_trip_locations from public,anon,authenticated;
grant select on public.test_trip_locations to authenticated;
grant all on public.test_trip_locations to service_role;
create policy "test participants see active position" on public.test_trip_locations for select to authenticated
using(exists(select 1 from public.test_rides b where b.id=booking_id and b.status in ('claimed','en_route') and b.expires_at>now()
  and (b.user_id=(select auth.uid()) or b.driver_id=(select auth.uid()))));

create function public.set_test_driver_online(p_online boolean) returns void
language plpgsql security definer set search_path='' as $$
begin
  if not public.is_transfer_tester() then raise exception 'tester_required'; end if;
  if not exists(select 1 from public.driver_profiles where id=auth.uid()) then raise exception 'driver_profile_required'; end if;
  insert into transfer_private.test_driver_presence(user_id,available_until)
  values(auth.uid(),case when p_online then now()+interval '20 minutes' else now() end)
  on conflict(user_id) do update set available_until=excluded.available_until;
end $$;

create function public.create_test_ride(p_request_id uuid,p_from jsonb,p_to jsonb,p_pickup_address text,p_dropoff_address text,
  p_pickup_at timestamptz,p_vehicle_class text,p_passengers integer,p_price_cents integer) returns public.test_rides
language plpgsql security definer set search_path='' as $$
declare b public.test_rides; a double precision; o double precision; c double precision; d double precision;
begin
  if not public.is_transfer_tester() then raise exception 'tester_required'; end if;
  perform pg_advisory_xact_lock(hashtextextended(auth.uid()::text,0));
  select * into b from public.test_rides where id=p_request_id;
  if found then
    if b.user_id<>auth.uid() then raise exception 'forbidden'; end if;
    return b;
  end if;
  if (select count(*) from public.test_rides where user_id=auth.uid() and created_at>now()-interval '1 hour')>=20 then raise exception 'test_rate_limit'; end if;
  a:=(p_from->>'lat')::double precision; o:=(p_from->>'lng')::double precision;
  c:=(p_to->>'lat')::double precision; d:=(p_to->>'lng')::double precision;
  if a is null or o is null or c is null or d is null or not(a between -90 and 90 and c between -90 and 90 and o between -180 and 180 and d between -180 and 180) then raise exception 'invalid_coordinates'; end if;
  if public.haversine_km(a,o,c,d)<0.05 then raise exception 'destination_too_close'; end if;
  if p_pickup_at<now()-interval '1 minute' or p_pickup_at>now()+interval '1 year' then raise exception 'invalid_pickup_time'; end if;
  if p_passengers>(case when p_vehicle_class='minivan' then 7 else 3 end) then raise exception 'vehicle_capacity'; end if;
  insert into public.test_rides(id,user_id,pickup_point,dropoff_point,pickup_address,dropoff_address,pickup_at,vehicle_class,passengers,price_cents)
  values(p_request_id,auth.uid(),jsonb_build_object('lat',a,'lng',o),jsonb_build_object('lat',c,'lng',d),
    p_pickup_address,p_dropoff_address,p_pickup_at,p_vehicle_class,p_passengers,p_price_cents) returning * into b;
  -- Test availability is explicit and short-lived; it never approves a real driver.
  insert into public.test_ride_offers(booking_id,driver_id)
    select b.id,p.user_id from transfer_private.test_driver_presence p
    join transfer_private.test_members m on m.user_id=p.user_id
    where p.available_until>now() and p.user_id<>auth.uid()
      and not exists(select 1 from public.test_rides t where t.driver_id=p.user_id and t.status in ('claimed','en_route') and t.expires_at>now())
    order by p.available_until desc limit 10;
  return b;
end $$;

create function public.my_test_ride_offers() returns table(offer_id uuid,id uuid,expires_at timestamptz,pickup_at timestamptz,
  pickup_address text,dropoff_address text,price_cents integer,passengers integer,vehicle_class text,is_test boolean)
language sql stable security definer set search_path='' as $$
  select o.id,b.id,o.expires_at,b.pickup_at,b.pickup_address,b.dropoff_address,b.price_cents,b.passengers,b.vehicle_class,true
  from public.test_ride_offers o join public.test_rides b on b.id=o.booking_id
  where public.is_transfer_tester() and o.driver_id=auth.uid() and o.status='pending' and o.expires_at>now()
    and b.status='pending' and b.expires_at>now() order by o.expires_at
$$;

create function public.respond_to_test_ride(p_offer_id uuid,p_accept boolean) returns public.test_rides
language plpgsql security definer set search_path='' as $$
declare o public.test_ride_offers; b public.test_rides;
begin
  if not public.is_transfer_tester() then raise exception 'tester_required'; end if;
  -- Lock the ride before any offer: every concurrent accept has the same lock order.
  perform pg_advisory_xact_lock(hashtextextended(auth.uid()::text,0));
  select * into o from public.test_ride_offers where id=p_offer_id and driver_id=auth.uid();
  if not found then raise exception 'offer_not_found'; end if;
  select * into b from public.test_rides where id=o.booking_id for update;
  select * into o from public.test_ride_offers where id=p_offer_id for update;
  if o.status<>'pending' or o.expires_at<=now() or b.expires_at<=now() or b.status<>'pending' or b.driver_id is not null then raise exception 'offer_no_longer_available'; end if;
  if not p_accept then update public.test_ride_offers set status='declined' where id=p_offer_id; return null; end if;
  if exists(select 1 from public.test_rides where driver_id=auth.uid() and status in ('claimed','en_route') and expires_at>now()) then raise exception 'active_test_transfer_exists'; end if;
  update public.test_rides set driver_id=auth.uid(),status='claimed',updated_at=now() where id=b.id returning * into b;
  update public.test_ride_offers set status=case when id=p_offer_id then 'accepted' else 'cancelled' end where booking_id=b.id and status='pending';
  return b;
end $$;

create function public.advance_test_ride(p_ride_id uuid,p_action text) returns public.test_rides
language plpgsql security definer set search_path='' as $$
declare b public.test_rides;
begin
  if not public.is_transfer_tester() then raise exception 'tester_required'; end if;
  select * into b from public.test_rides where id=p_ride_id for update;
  if not found or b.driver_id is distinct from auth.uid() then raise exception 'forbidden'; end if;
  if b.expires_at<=now() then raise exception 'test_transfer_expired'; end if;
  if p_action='start' and b.status='claimed' then b.status:='en_route';
  elsif p_action='arrive' and b.status='en_route' and b.journey_stage='to_pickup' then b.journey_stage:='at_pickup';
  elsif p_action='board' and b.status='en_route' and b.journey_stage='at_pickup' then b.journey_stage:='on_trip';
  elsif p_action='complete' and b.status='en_route' and b.journey_stage='on_trip' then b.status:='completed';
  else raise exception 'invalid_trip_transition'; end if;
  update public.test_rides set status=b.status,journey_stage=b.journey_stage,updated_at=now() where id=p_ride_id returning * into b;
  if b.status='completed' then delete from public.test_trip_locations where booking_id=b.id; end if;
  return b;
end $$;

create function public.publish_test_trip_location(p_ride_id uuid,p_lat double precision,p_lng double precision,p_heading double precision,p_captured_at timestamptz) returns void
language plpgsql security definer set search_path='' as $$
declare b public.test_rides;
begin
  if not public.is_transfer_tester() then raise exception 'tester_required'; end if;
  select * into b from public.test_rides where id=p_ride_id for share;
  if not found or b.driver_id is distinct from auth.uid() or b.status not in ('claimed','en_route') or b.expires_at<=now() then raise exception 'test_trip_not_active'; end if;
  if p_captured_at<clock_timestamp()-interval '2 minutes' or p_captured_at>clock_timestamp()+interval '1 minute' then raise exception 'location_sample_expired'; end if;
  insert into public.test_trip_locations(booking_id,driver_id,latitude,longitude,heading,captured_at,driver_name,vehicle_name,vehicle_plate)
  select b.id,auth.uid(),p_lat,p_lng,p_heading,p_captured_at,p.full_name,d.vehicle_make_model,d.vehicle_plate
    from public.profiles p join public.driver_profiles d on d.id=p.id where p.id=auth.uid()
  on conflict(booking_id) do update set latitude=excluded.latitude,longitude=excluded.longitude,heading=excluded.heading,
    captured_at=excluded.captured_at,received_at=clock_timestamp(),driver_name=excluded.driver_name,vehicle_name=excluded.vehicle_name,vehicle_plate=excluded.vehicle_plate
  where excluded.captured_at>public.test_trip_locations.captured_at;
end $$;

create function public.stop_test_trip_location(p_ride_id uuid) returns void
language plpgsql security definer set search_path='' as $$
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  delete from public.test_trip_locations where booking_id=p_ride_id and driver_id=auth.uid();
end $$;

-- Durable per-device delivery; no send loop runs in a traveler/driver process.
create table public.native_push_outbox (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references public.native_device_tokens(id) on delete cascade,
  offer_id uuid not null,
  booking_id uuid not null,
  is_test boolean not null,
  title text not null,
  body text not null,
  expires_at timestamptz not null,
  attempts integer not null default 0,
  next_attempt_at timestamptz not null default now(),
  lease_until timestamptz,
  lease_token uuid,
  delivered_at timestamptz,
  failed_at timestamptz,
  last_error text,
  unique(device_id,offer_id)
);
create index native_push_ready_idx on public.native_push_outbox(next_attempt_at) where delivered_at is null and failed_at is null;
alter table public.native_push_outbox enable row level security;
revoke all on public.native_push_outbox from public,anon,authenticated;
grant all on public.native_push_outbox to service_role;
create function transfer_private.queue_native_offer() returns trigger
language plpgsql security definer set search_path='' as $$
declare t boolean:=TG_TABLE_NAME='test_ride_offers'; route text; amount integer;
begin
  if new.status<>'pending' then return new; end if;
  if t then select pickup_address||' → '||dropoff_address,price_cents into route,amount from public.test_rides where id=new.booking_id;
  else select pickup_address||' → '||dropoff_address,price_cents into route,amount from public.bookings where id=new.booking_id; end if;
  insert into public.native_push_outbox(device_id,offer_id,booking_id,is_test,title,body,expires_at)
  select d.id,new.id,new.booking_id,t,case when t then 'Test transfer offer' else 'New transfer offer' end,
    coalesce(route,'Your next transfer')||' · €'||round(amount/100.0,2)::text,new.expires_at
    from public.native_device_tokens d where d.user_id=new.driver_id and d.role='driver'
    on conflict(device_id,offer_id) do nothing;
  return new;
end $$;
create trigger queue_native_real_offer after insert on public.job_offers for each row execute function transfer_private.queue_native_offer();
create trigger queue_native_test_offer after insert on public.test_ride_offers for each row execute function transfer_private.queue_native_offer();

create function public.claim_native_push(p_limit integer default 100) returns table(id uuid,lease_token uuid,token text,topic text,environment text,
  offer_id uuid,booking_id uuid,is_test boolean,title text,body text,expires_at timestamptz,attempts integer)
language plpgsql security definer set search_path='' as $$
begin
  if (select auth.jwt()->>'role') is distinct from 'service_role' then raise exception 'service_required'; end if;
  return query
  with ready as (
    select q.id from public.native_push_outbox q where q.delivered_at is null and q.failed_at is null and q.expires_at>now()
      and q.next_attempt_at<=now() and (q.lease_until is null or q.lease_until<now())
      and ((q.is_test and exists(select 1 from public.test_ride_offers o join public.test_rides b on b.id=o.booking_id where o.id=q.offer_id and o.status='pending' and b.status='pending'))
        or (not q.is_test and exists(select 1 from public.job_offers o join public.bookings b on b.id=o.booking_id where o.id=q.offer_id and o.status='pending' and b.status='pending' and b.payment_status='paid')))
    order by q.next_attempt_at limit least(greatest(p_limit,1),100) for update skip locked
  ), claimed as (
    update public.native_push_outbox q set lease_until=now()+interval '45 seconds',lease_token=gen_random_uuid(),attempts=q.attempts+1
    from ready r where q.id=r.id returning q.*
  ) select c.id,c.lease_token,d.token,d.topic,d.environment,c.offer_id,c.booking_id,c.is_test,c.title,c.body,c.expires_at,c.attempts
    from claimed c join public.native_device_tokens d on d.id=c.device_id;
end $$;

create function public.finish_native_push(p_id uuid,p_lease_token uuid,p_delivered boolean,p_permanent boolean default false,p_error text default null) returns void
language plpgsql security definer set search_path='' as $$
begin
  if (select auth.jwt()->>'role') is distinct from 'service_role' then raise exception 'service_required'; end if;
  update public.native_push_outbox set delivered_at=case when p_delivered then now() else null end,
    failed_at=case when not p_delivered and (p_permanent or attempts>=5) then now() else null end,
    next_attempt_at=now()+make_interval(secs=>least(20,power(2,attempts)::integer)),
    lease_until=null,last_error=left(p_error,200) where id=p_id and lease_token=p_lease_token;
end $$;

do $$ declare f record; begin
  for f in select p.oid::regprocedure as signature from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public' and p.proname in ('set_test_driver_online','create_test_ride','my_test_ride_offers','respond_to_test_ride','advance_test_ride','publish_test_trip_location','stop_test_trip_location')
  loop execute 'revoke all on function '||f.signature||' from public,anon'; execute 'grant execute on function '||f.signature||' to authenticated'; end loop;
end $$;
revoke all on function public.claim_native_push(integer) from public,anon,authenticated;
revoke all on function public.finish_native_push(uuid,uuid,boolean,boolean,text) from public,anon,authenticated;
grant execute on function public.claim_native_push(integer),public.finish_native_push(uuid,uuid,boolean,boolean,text) to service_role;
revoke all on function transfer_private.queue_native_offer() from public,anon,authenticated;

do $$ declare t text; begin
  foreach t in array array['test_rides','test_ride_offers','test_trip_locations'] loop
    if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename=t) then
      execute format('alter publication supabase_realtime add table public.%I',t);
    end if;
  end loop;
end $$;
