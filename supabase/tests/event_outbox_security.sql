begin;
create extension if not exists pgtap with schema extensions;
select plan(10);

select has_table('public', 'event_outbox', 'event outbox exists');

select ok(
  (select relrowsecurity from pg_class where oid = 'public.event_outbox'::regclass),
  'event outbox has RLS enabled'
);

select is(
  (
    select count(*)::integer
    from information_schema.role_table_grants
    where grantee in ('anon', 'authenticated')
      and table_schema = 'public'
      and table_name = 'event_outbox'
  ),
  0,
  'browser roles have no event outbox grants'
);

select ok(
  not has_function_privilege('anon', 'public.claim_event_outbox(integer)', 'EXECUTE'),
  'anonymous users cannot claim events'
);

select ok(
  not has_function_privilege('authenticated', 'public.claim_event_outbox(integer)', 'EXECUTE'),
  'authenticated users cannot claim events'
);

select ok(
  not has_function_privilege(
    'anon',
    'public.complete_event_outbox(uuid,boolean,text)',
    'EXECUTE'
  ),
  'anonymous users cannot complete events'
);

select ok(
  has_function_privilege('service_role', 'public.claim_event_outbox(integer)', 'EXECUTE'),
  'service role can claim events'
);

select ok(
  exists (
    select 1
    from pg_trigger
    where tgrelid = 'public.bookings'::regclass
      and tgname = 'bookings_event_outbox'
      and not tgisinternal
  ),
  'booking event trigger is installed'
);

select ok(
  exists (
    select 1
    from pg_trigger
    where tgrelid = 'public.booking_incidents'::regclass
      and tgname = 'booking_incidents_event_outbox'
      and not tgisinternal
  ),
  'incident event trigger is installed'
);

select ok(
  exists (
    select 1
    from pg_constraint
    where conrelid = 'public.bookings'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) like '%locale%'
  ),
  'booking locale is constrained to supported locales'
);

select * from finish();
rollback;
