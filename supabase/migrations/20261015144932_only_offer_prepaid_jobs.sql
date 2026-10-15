create or replace view public.open_jobs as
select id,route_slug,vehicle_class,passengers,pickup_at,trip_type,return_at,bags_checked,bags_cabin,
pickup_address,dropoff_address,extras,price_cents,currency,created_at,urgency,asap_expires_at,eta_minutes
from public.bookings
where status='pending' and payment_status='paid' and driver_id is null and public.is_approved_driver()
and ((urgency='asap' and coalesce(asap_expires_at,now())>now())
or (coalesce(urgency,'scheduled')<>'asap' and pickup_at>now()));
