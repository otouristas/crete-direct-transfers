create function public.get_test_driver_availability() returns timestamptz
language sql stable security definer set search_path='' as $$
  select available_until from transfer_private.test_driver_presence
  where public.is_transfer_tester() and user_id=auth.uid() and available_until>now()
$$;
create function public.cancel_test_ride(p_ride_id uuid) returns public.test_rides
language plpgsql security definer set search_path='' as $$
declare b public.test_rides;
begin
  if not public.is_transfer_tester() then raise exception 'tester_required'; end if;
  select * into b from public.test_rides where id=p_ride_id for update;
  if not found or (b.user_id is distinct from auth.uid() and b.driver_id is distinct from auth.uid()) then raise exception 'forbidden'; end if;
  if b.status in ('completed','cancelled','expired') then return b; end if;
  update public.test_rides set status='cancelled',updated_at=now() where id=p_ride_id returning * into b;
  update public.test_ride_offers set status='cancelled' where booking_id=b.id and status='pending';
  delete from public.test_trip_locations where booking_id=b.id;
  return b;
end $$;
create function public.expire_test_ride_offers() returns void
language plpgsql security definer set search_path='' as $$
begin
  update public.test_ride_offers set status='expired' where status='pending' and expires_at<=now();
  update public.test_rides b set status='expired',updated_at=now()
    where b.status in ('pending','claimed','en_route') and (b.expires_at<=now()
      or (b.status='pending' and b.created_at<now()-interval '90 seconds' and not exists(
        select 1 from public.test_ride_offers o where o.booking_id=b.id and o.status='pending' and o.expires_at>now())));
  delete from public.test_trip_locations l using public.test_rides b where b.id=l.booking_id and b.status not in ('claimed','en_route');
end $$;
revoke all on function public.get_test_driver_availability(),public.cancel_test_ride(uuid) from public,anon;
grant execute on function public.get_test_driver_availability(),public.cancel_test_ride(uuid) to authenticated;
revoke all on function public.expire_test_ride_offers() from public,anon,authenticated;
grant execute on function public.expire_test_ride_offers() to service_role;
