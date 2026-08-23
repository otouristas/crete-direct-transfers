begin;
create extension if not exists pgtap with schema extensions;
select plan(12);

select ok(
  (select reloptions @> array['security_invoker=true'] from pg_class where oid = 'public.open_jobs'::regclass),
  'open jobs uses invoker security'
);
select ok(
  (select reloptions @> array['security_invoker=true'] from pg_class where oid = 'public.my_job_offers'::regclass),
  'my job offers uses invoker security'
);
select ok(
  not has_function_privilege('anon', 'public.open_incident(uuid,text,text,timestamptz,text[])', 'EXECUTE'),
  'anonymous users cannot open incidents'
);
select ok(
  not has_function_privilege('anon', 'public.request_cancellation(uuid,text,text,boolean)', 'EXECUTE'),
  'anonymous users cannot request cancellation'
);
select ok(
  not has_function_privilege('anon', 'public.resolve_incident(uuid,text,text,boolean)', 'EXECUTE'),
  'anonymous users cannot resolve incidents'
);
select ok(
  not has_function_privilege('anon', 'public.update_job_status(uuid,text)', 'EXECUTE'),
  'anonymous users cannot update job status'
);
select ok(
  not has_function_privilege('authenticated', 'public.asap_booking_fanout()', 'EXECUTE'),
  'authenticated users cannot call ASAP trigger function'
);
select ok(
  not has_function_privilege('authenticated', 'public.bump_dns_on_resolve()', 'EXECUTE'),
  'authenticated users cannot call DNS trigger function'
);
select ok(
  not has_function_privilege('authenticated', 'public.create_dispatch_for_booking(uuid,text,double precision,double precision,uuid)', 'EXECUTE'),
  'authenticated users cannot start global dispatch'
);
select ok(
  not has_function_privilege('authenticated', 'public.expire_job_offers()', 'EXECUTE'),
  'authenticated users cannot mutate offer expiry queues'
);
select ok(
  has_function_privilege('service_role', 'public.expire_job_offers()', 'EXECUTE'),
  'service role can expire offer queues'
);
select ok(
  exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'event_outbox'
      and policyname = 'browser roles cannot access event outbox'
  ),
  'closed outbox has an explicit deny policy'
);

select * from finish();
rollback;
