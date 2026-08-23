-- Address Supabase security-advisor findings without weakening RLS.

alter view public.open_jobs set (security_invoker = true);
alter view public.my_job_offers set (security_invoker = true);

alter function public.booking_wait_minutes(text, text, text) set search_path = '';
alter function public.owns_booking(public.bookings) set search_path = '';
alter function public.set_updated_at() set search_path = '';
alter function public.default_dispatch_mode(text) set search_path = '';
alter function public.haversine_km(
  double precision,
  double precision,
  double precision,
  double precision
) set search_path = '';

-- Trigger functions are invoked by PostgreSQL, never as browser RPCs.
revoke execute on function public.asap_booking_fanout()
  from public, anon, authenticated;
revoke execute on function public.bump_dns_on_resolve()
  from public, anon, authenticated;

-- These RPCs require a signed-in user and enforce ownership/admin checks in
-- their bodies. Remove Supabase's default anonymous function grants.
revoke execute on function public.open_incident(uuid, text, text, timestamptz, text[])
  from public, anon;
revoke execute on function public.request_cancellation(uuid, text, text, boolean)
  from public, anon;
revoke execute on function public.resolve_incident(uuid, text, text, boolean)
  from public, anon;
revoke execute on function public.update_job_status(uuid, text)
  from public, anon;

-- Dispatch and expiry are trusted background operations. The UI reads the
-- resulting rows; only the service role may mutate the global queues.
revoke execute on function public.create_dispatch_for_booking(
  uuid, text, double precision, double precision, uuid
) from public, anon, authenticated;
grant execute on function public.create_dispatch_for_booking(
  uuid, text, double precision, double precision, uuid
) to service_role;

revoke execute on function public.expire_job_offers()
  from public, anon, authenticated;
grant execute on function public.expire_job_offers() to service_role;

revoke execute on function public.expire_asap_bookings()
  from public, anon, authenticated;
grant execute on function public.expire_asap_bookings() to service_role;

-- A deny policy documents the deliberately closed outbox and satisfies the
-- advisor; the service role bypasses RLS and still has explicit table grants.
create policy "browser roles cannot access event outbox"
  on public.event_outbox
  for all
  to public
  using (false)
  with check (false);
