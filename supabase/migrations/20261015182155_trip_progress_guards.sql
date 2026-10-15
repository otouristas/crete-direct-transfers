-- Keep trip-stage ordering valid even if a client writes directly to bookings.
create function transfer_private.guard_trip_stage() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.journey_stage is not distinct from old.journey_stage then return new; end if;
  if coalesce(auth.role(),'')='service_role' or (auth.uid() is null and current_user='postgres') or public.is_admin() then return new; end if;
  if auth.uid() is null or old.driver_id is distinct from auth.uid() or new.driver_id is distinct from old.driver_id
    or old.status<>'en_route' or new.status<>'en_route' then raise exception 'forbidden_trip_stage'; end if;
  if not exists(select 1 from public.driver_profiles d where d.id=auth.uid() and d.approval_status='approved') then raise exception 'driver_not_approved';end if;
  if (old.journey_stage='to_pickup' and new.journey_stage='at_pickup') or (old.journey_stage='at_pickup' and new.journey_stage='on_trip') then return new;end if;
  raise exception 'invalid_trip_transition';
end $$;
create trigger guard_trip_stage before update of journey_stage on public.bookings
  for each row execute function transfer_private.guard_trip_stage();
