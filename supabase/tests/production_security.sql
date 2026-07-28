begin;
create extension if not exists pgtap with schema extensions;
select plan(12);

select ok(
  (select relrowsecurity from pg_class where oid = 'public.profiles'::regclass),
  'profiles has RLS enabled'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.bookings'::regclass),
  'bookings has RLS enabled'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.saved_travelers'::regclass),
  'saved travelers has RLS enabled'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.driver_onboarding_submissions'::regclass),
  'driver onboarding has RLS enabled'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.driver_documents'::regclass),
  'driver documents has RLS enabled'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.driver_onboarding_events'::regclass),
  'driver onboarding events has RLS enabled'
);

select is(
  (
    select count(*)::integer
    from information_schema.role_table_grants
    where grantee = 'anon'
      and table_schema = 'public'
      and table_name in (
        'driver_onboarding_submissions',
        'driver_documents',
        'driver_onboarding_events'
      )
  ),
  0,
  'anonymous users have no onboarding table grants'
);

select ok(
  exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'driver_documents'
      and policyname = 'drivers read own documents'
      and qual like '%auth.uid()%'
      and qual like '%is_admin()%'
  ),
  'documents are isolated by owner with operations review access'
);

select ok(
  exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'saved_travelers'
      and qual like '%auth.uid()%'
  ),
  'saved travelers are isolated by owner'
);

select ok(
  exists (
    select 1
    from storage.buckets
    where id = 'driver-documents'
      and public = false
      and file_size_limit = 10485760
  ),
  'driver document bucket is private and size limited'
);

select is(
  (
    select count(*)::integer
    from pg_proc as procedure
    join pg_namespace as namespace on namespace.oid = procedure.pronamespace
    where namespace.nspname = 'public'
      and procedure.prosecdef
      and not coalesce(procedure.proconfig, '{}'::text[]) @> array['search_path=""']
      and not coalesce(procedure.proconfig, '{}'::text[]) @> array['search_path=']
  ),
  0,
  'all public SECURITY DEFINER routines have an empty search path'
);

select ok(
  not has_function_privilege(
    'anon',
    'public.review_driver_onboarding(uuid,text,text)',
    'EXECUTE'
  ),
  'anonymous users cannot execute onboarding review'
);

select * from finish();
rollback;
