-- ---------------------------------------------------------------------------
-- Platform settings (single row)
-- ---------------------------------------------------------------------------
create table if not exists public.platform_settings (
  id boolean primary key default true,
  commission_bps integer not null default 1500 check (commission_bps between 0 and 10000),
  holding_period_hours integer not null default 24 check (holding_period_hours between 0 and 720),
  default_payout_schedule text not null default 'weekly'
    check (default_payout_schedule in ('weekly', 'monthly', 'instant')),
  min_payout_cents integer not null default 2000 check (min_payout_cents >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint platform_settings_singleton check (id)
);

grant select on public.platform_settings to authenticated;
grant all on public.platform_settings to service_role;
alter table public.platform_settings enable row level security;

create policy "settings readable by authenticated" on public.platform_settings
  for select to authenticated using (true);
create policy "settings writable by admin" on public.platform_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into public.platform_settings (id) values (true) on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Driver Stripe Connect accounts
-- ---------------------------------------------------------------------------
create table if not exists public.driver_payout_accounts (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null unique references auth.users(id) on delete cascade,
  stripe_account_id text unique,
  charges_enabled boolean not null default false,
  payouts_enabled boolean not null default false,
  details_submitted boolean not null default false,
  requirements_due text[] not null default '{}',
  payout_schedule text not null default 'weekly'
    check (payout_schedule in ('weekly', 'monthly', 'instant')),
  instant_eligible boolean not null default false,
  country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.driver_payout_accounts to authenticated;
grant all on public.driver_payout_accounts to service_role;
alter table public.driver_payout_accounts enable row level security;

create policy "payout accounts readable by owner or admin" on public.driver_payout_accounts
  for select to authenticated
  using (driver_id = (select auth.uid()) or public.is_admin());

-- ---------------------------------------------------------------------------
-- Driver earnings ledger
-- ---------------------------------------------------------------------------
create table if not exists public.driver_payouts (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references auth.users(id) on delete cascade,
  amount_cents integer not null check (amount_cents > 0),
  currency text not null default 'eur',
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'failed', 'cancelled')),
  method text not null default 'standard' check (method in ('standard', 'instant')),
  stripe_transfer_id text,
  stripe_payout_id text,
  period_start timestamptz,
  period_end timestamptz,
  failure_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists driver_payouts_driver_idx on public.driver_payouts (driver_id, created_at desc);

grant select on public.driver_payouts to authenticated;
grant all on public.driver_payouts to service_role;
alter table public.driver_payouts enable row level security;

create policy "payouts readable by owner or admin" on public.driver_payouts
  for select to authenticated
  using (driver_id = (select auth.uid()) or public.is_admin());

create table if not exists public.driver_earnings (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  driver_id uuid not null references auth.users(id) on delete cascade,
  gross_cents integer not null check (gross_cents >= 0),
  commission_bps integer not null,
  commission_cents integer not null check (commission_cents >= 0),
  net_cents integer not null check (net_cents >= 0),
  currency text not null default 'eur',
  status text not null default 'pending'
    check (status in ('pending', 'held', 'available', 'paid', 'voided', 'disputed')),
  available_at timestamptz,
  completed_at timestamptz,
  paid_at timestamptz,
  payout_id uuid references public.driver_payouts(id) on delete set null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists driver_earnings_driver_idx on public.driver_earnings (driver_id, status);
create index if not exists driver_earnings_status_idx on public.driver_earnings (status, available_at);

grant select on public.driver_earnings to authenticated;
grant all on public.driver_earnings to service_role;
alter table public.driver_earnings enable row level security;

create policy "earnings readable by owner or admin" on public.driver_earnings
  for select to authenticated
  using (driver_id = (select auth.uid()) or public.is_admin());

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists platform_settings_touch on public.platform_settings;
create trigger platform_settings_touch before update on public.platform_settings
  for each row execute function public.touch_updated_at();
drop trigger if exists driver_payout_accounts_touch on public.driver_payout_accounts;
create trigger driver_payout_accounts_touch before update on public.driver_payout_accounts
  for each row execute function public.touch_updated_at();
drop trigger if exists driver_earnings_touch on public.driver_earnings;
create trigger driver_earnings_touch before update on public.driver_earnings
  for each row execute function public.touch_updated_at();
drop trigger if exists driver_payouts_touch on public.driver_payouts;
create trigger driver_payouts_touch before update on public.driver_payouts
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Ledger maintenance driven by booking lifecycle
-- ---------------------------------------------------------------------------
create or replace function public.sync_booking_earning()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_settings public.platform_settings;
  v_commission integer;
  v_existing public.driver_earnings;
begin
  select * into v_settings from public.platform_settings where id limit 1;
  if not found then return new; end if;

  select * into v_existing from public.driver_earnings where booking_id = new.id;

  -- Create the pending line once the booking is paid and has a driver.
  if v_existing.id is null then
    if new.payment_status = 'paid' and new.driver_id is not null then
      v_commission := round(new.price_cents * v_settings.commission_bps / 10000.0);
      insert into public.driver_earnings (
        booking_id, driver_id, gross_cents, commission_bps,
        commission_cents, net_cents, currency, status
      ) values (
        new.id, new.driver_id, new.price_cents, v_settings.commission_bps,
        v_commission, new.price_cents - v_commission, lower(new.currency), 'pending'
      )
      returning * into v_existing;
    else
      return new;
    end if;
  end if;

  -- Keep the driver in sync while the line is still pending.
  if v_existing.status = 'pending' and new.driver_id is not null
     and new.driver_id is distinct from v_existing.driver_id then
    update public.driver_earnings set driver_id = new.driver_id where id = v_existing.id;
  end if;

  -- Completion starts the holding period.
  if new.status = 'completed' and v_existing.status = 'pending' then
    update public.driver_earnings set
      status = 'held',
      completed_at = now(),
      available_at = now() + make_interval(hours => v_settings.holding_period_hours)
    where id = v_existing.id;
  end if;

  -- Blocking states keep the driver unpaid.
  if new.status in ('cancelled', 'no_show')
     or new.refund_status in ('refunded', 'pending_review') then
    if v_existing.status in ('pending', 'held', 'available') then
      update public.driver_earnings set
        status = 'voided',
        note = coalesce(note, 'blocked by booking ' || new.status)
      where id = v_existing.id;
    end if;
  end if;

  return new;
end $$;

drop trigger if exists bookings_sync_earning on public.bookings;
create trigger bookings_sync_earning after insert or update on public.bookings
  for each row execute function public.sync_booking_earning();

-- Flip held lines to available once the holding period elapsed.
create or replace function public.mature_held_earnings()
returns integer language plpgsql security definer set search_path = public as $$
declare v_count integer;
begin
  update public.driver_earnings set status = 'available'
  where status = 'held' and available_at is not null and available_at <= now();
  get diagnostics v_count = row_count;
  return v_count;
end $$;

revoke execute on function public.mature_held_earnings() from public, anon, authenticated;
grant execute on function public.mature_held_earnings() to service_role;

-- ---------------------------------------------------------------------------
-- Admin controls
-- ---------------------------------------------------------------------------
create or replace function public.admin_set_earning_status(
  p_earning_id uuid,
  p_status text,
  p_note text default null
)
returns public.driver_earnings
language plpgsql security definer set search_path = public as $$
declare v_row public.driver_earnings;
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;
  if p_status not in ('pending', 'held', 'available', 'voided', 'disputed') then
    raise exception 'invalid_status';
  end if;

  select * into v_row from public.driver_earnings where id = p_earning_id for update;
  if not found then raise exception 'earning_not_found'; end if;
  if v_row.status = 'paid' then raise exception 'already_paid'; end if;

  update public.driver_earnings set
    status = p_status,
    note = coalesce(p_note, note),
    available_at = case when p_status = 'available' then now() else available_at end
  where id = v_row.id
  returning * into v_row;

  return v_row;
end $$;

revoke execute on function public.admin_set_earning_status(uuid, text, text) from public, anon;
grant execute on function public.admin_set_earning_status(uuid, text, text) to authenticated, service_role;

create or replace function public.admin_update_platform_settings(
  p_commission_bps integer default null,
  p_holding_period_hours integer default null,
  p_default_payout_schedule text default null,
  p_min_payout_cents integer default null
)
returns public.platform_settings
language plpgsql security definer set search_path = public as $$
declare v_row public.platform_settings;
begin
  if not public.is_admin() then raise exception 'not_admin'; end if;

  update public.platform_settings set
    commission_bps = coalesce(p_commission_bps, commission_bps),
    holding_period_hours = coalesce(p_holding_period_hours, holding_period_hours),
    default_payout_schedule = coalesce(p_default_payout_schedule, default_payout_schedule),
    min_payout_cents = coalesce(p_min_payout_cents, min_payout_cents)
  where id
  returning * into v_row;

  return v_row;
end $$;

revoke execute on function public.admin_update_platform_settings(integer, integer, text, integer)
  from public, anon;
grant execute on function public.admin_update_platform_settings(integer, integer, text, integer)
  to authenticated, service_role;

-- Driver may choose their own payout cadence.
create or replace function public.set_my_payout_schedule(p_schedule text)
returns public.driver_payout_accounts
language plpgsql security definer set search_path = public as $$
declare v_row public.driver_payout_accounts;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  if p_schedule not in ('weekly', 'monthly', 'instant') then raise exception 'invalid_schedule'; end if;

  select * into v_row from public.driver_payout_accounts where driver_id = auth.uid() for update;
  if not found then raise exception 'no_payout_account'; end if;
  if p_schedule = 'instant' and not v_row.instant_eligible then raise exception 'instant_not_available'; end if;

  update public.driver_payout_accounts set payout_schedule = p_schedule
  where id = v_row.id returning * into v_row;
  return v_row;
end $$;

revoke execute on function public.set_my_payout_schedule(text) from public, anon;
grant execute on function public.set_my_payout_schedule(text) to authenticated, service_role;