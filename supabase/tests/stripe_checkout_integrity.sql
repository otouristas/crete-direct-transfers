begin;
create extension if not exists pgtap with schema extensions;
select plan(8);

select has_table('public', 'stripe_webhook_events', 'webhook ledger exists');
select ok(
  (select relrowsecurity from pg_class where oid = 'public.stripe_webhook_events'::regclass),
  'webhook ledger has RLS enabled'
);
select ok(
  not has_table_privilege('anon', 'public.stripe_webhook_events', 'SELECT'),
  'anonymous users cannot read webhook events'
);
select ok(
  not has_function_privilege(
    'authenticated',
    'public.process_stripe_checkout_event(text,text,uuid,text,text,integer,text,boolean)',
    'EXECUTE'
  ),
  'authenticated users cannot process Stripe events'
);
select ok(
  has_function_privilege(
    'service_role',
    'public.process_stripe_checkout_event(text,text,uuid,text,text,integer,text,boolean)',
    'EXECUTE'
  ),
  'service role can process Stripe events'
);
select col_not_null('public', 'bookings', 'stripe_checkout_version', 'checkout version is required');
select has_index(
  'public',
  'bookings',
  'bookings_stripe_checkout_session_id_key',
  'checkout session IDs are unique'
);
select ok(
  exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'stripe_webhook_events'
      and policyname = 'browser roles cannot access stripe webhook events'
  ),
  'webhook ledger has a browser deny policy'
);

select * from finish();
rollback;
