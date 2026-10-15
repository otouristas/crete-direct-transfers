
alter table public.bookings add column if not exists checkout_access_hash text;
alter table public.bookings add column if not exists platform_fee_cents integer,
  add column if not exists carrier_payout_cents integer,
  add column if not exists stripe_transfer_id text,
  add column if not exists payout_status text not null default 'pending';
alter table public.driver_profiles add column if not exists stripe_account_id text,
  add column if not exists stripe_onboarding_complete boolean not null default false;
alter table public.partners add column if not exists stripe_account_id text,
  add column if not exists stripe_onboarding_complete boolean not null default false;

-- Prices, ownership, payment and assignment must only change through the trusted server/RPCs.
revoke insert, update on public.bookings from anon, authenticated;
-- Column grants survive table-level revocation; clear any legacy direct-write grants too.
do $$ declare c record; begin
  for c in select column_name from information_schema.columns where table_schema='public' and table_name='bookings' loop
    execute format('revoke insert (%I), update (%I) on public.bookings from anon, authenticated',c.column_name,c.column_name);
  end loop;
end $$;

create or replace function public.require_paid_driver_assignment()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  if new.driver_id is not null and (new.driver_id is distinct from old.driver_id)
    and new.payment_status <> 'paid' then
    raise exception 'payment_required_before_assignment';
  end if;
  return new;
end;
$$;
revoke all on function public.require_paid_driver_assignment() from public, anon, authenticated;
create trigger bookings_require_paid_assignment before update on public.bookings
for each row execute function public.require_paid_driver_assignment();

-- Old anonymous RPCs accepted client-supplied fares; use the server checkout flow.
do $$ declare f record; begin
  for f in select oid::regprocedure as signature from pg_proc
    where pronamespace='public'::regnamespace and proname in ('create_asap_booking','create_quote_record')
  loop
    execute format('revoke execute on function %s from public, anon, authenticated',f.signature);
  end loop;
end $$;
