alter table public.test_rides drop constraint test_rides_vehicle_class_check;
alter table public.test_rides add constraint test_rides_vehicle_class_check check(vehicle_class in ('economy','comfort','luxury','suv','minivan','van-first','minibus-12','minibus-16'));
alter table public.test_rides drop constraint test_rides_passengers_check;
alter table public.test_rides add constraint test_rides_passengers_check check(passengers between 1 and 16);
alter table public.test_rides add column bags_checked integer not null default 0 check(bags_checked between 0 and 16);
alter table public.test_rides add column flight_number text check(length(flight_number)<=20);
drop function public.create_test_ride(uuid,jsonb,jsonb,text,text,timestamptz,text,integer,integer);
create function public.create_test_ride(p_request_id uuid,p_from jsonb,p_to jsonb,p_pickup_address text,p_dropoff_address text,
  p_pickup_at timestamptz,p_vehicle_class text,p_passengers integer,p_price_cents integer,p_bags_checked integer default 0,p_flight_number text default null) returns public.test_rides
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
  if p_vehicle_class is null or p_vehicle_class not in ('economy','comfort','luxury','suv','minivan','van-first','minibus-12','minibus-16') then raise exception 'invalid_vehicle'; end if;
  if p_passengers is null or not(p_passengers between 1 and (case p_vehicle_class when 'minivan' then 7 when 'suv' then 6 when 'van-first' then 6 when 'minibus-12' then 12 when 'minibus-16' then 16 else 3 end)) then raise exception 'vehicle_capacity'; end if;
  if p_bags_checked is null or not(p_bags_checked between 0 and (case p_vehicle_class when 'minivan' then 7 when 'suv' then 6 when 'van-first' then 6 when 'minibus-12' then 12 when 'minibus-16' then 16 else 3 end)) then raise exception 'luggage_capacity'; end if;
  if length(coalesce(p_flight_number,''))>20 then raise exception 'invalid_flight_reference'; end if;
  insert into public.test_rides(id,user_id,pickup_point,dropoff_point,pickup_address,dropoff_address,pickup_at,vehicle_class,passengers,price_cents,bags_checked,flight_number)
  values(p_request_id,auth.uid(),jsonb_build_object('lat',a,'lng',o),jsonb_build_object('lat',c,'lng',d),
    p_pickup_address,p_dropoff_address,p_pickup_at,p_vehicle_class,p_passengers,p_price_cents,p_bags_checked,nullif(upper(trim(p_flight_number)),'')) returning * into b;
  -- Test availability is explicit and short-lived; it never approves a real driver.
  insert into public.test_ride_offers(booking_id,driver_id)
    select b.id,p.user_id from transfer_private.test_driver_presence p
    join transfer_private.test_members m on m.user_id=p.user_id
    where p.available_until>now() and p.user_id<>auth.uid()
      and not exists(select 1 from public.test_rides t where t.driver_id=p.user_id and t.status in ('claimed','en_route') and t.expires_at>now())
    order by p.available_until desc limit 10;
  return b;
end $$;

revoke all on function public.create_test_ride(uuid,jsonb,jsonb,text,text,timestamptz,text,integer,integer,integer,text) from public,anon,authenticated;
grant execute on function public.create_test_ride(uuid,jsonb,jsonb,text,text,timestamptz,text,integer,integer,integer,text) to authenticated;
