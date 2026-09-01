-- ---------------------------------------------------------------------------
-- 1. Policy settings
-- ---------------------------------------------------------------------------
alter table public.platform_settings
  add column if not exists penalty_tier_72_bps integer not null default 1000
    check (penalty_tier_72_bps between 0 and 10000),
  add column if not exists penalty_tier_48_bps integer not null default 2500
    check (penalty_tier_48_bps between 0 and 10000),
  add column if not exists penalty_tier_24_bps integer not null default 5000
    check (penalty_tier_24_bps between 0 and 10000),
  add column if not exists penalty_no_show_bps integer not null default 10000
    check (penalty_no_show_bps between 0 and 10000),
  add column if not exists auto_incentive_hours integer not null default 24
    check (auto_incentive_hours between 0 and 168),
  add column if not exists auto_incentive_bps integer not null default 1500
    check (auto_incentive_bps between 0 and 10000),
  add column if not exists reliability_suspend_score integer not null default 40
    check (reliability_suspend_score between 0 and 100),
  add column if not exists reliability_suspend_days integer not null default 14
    check (reliability_suspend_days between 1 and 365);

-- ---------------------------------------------------------------------------
-- 2. Bookings: replacement incentive + release marker
-- ---------------------------------------------------------------------------
alter table public.bookings
  add column if not exists incentive_cents integer not null default 0
    check (incentive_cents >= 0),
  add column if not exists released_at timestamptz;

-- ---------------------------------------------------------------------------
-- 3. Driver account ledger
-- ---------------------------------------------------------------------------
create table public.driver_account_entries (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null,
  booking_id uuid references public.bookings(id) on delete set null,
  earning_id uuid references public.driver_earnings(id) on delete set null,
  payout_id uuid references public.driver_payouts(id) on delete set null,
  entry_type text not null check (
    entry_type in ('earning', 'commission', 'penalty', 'incentive', 'payout', 'adjustment')
  ),
  -- Signed: credits are positive, debits negative.
  amount_cents integer not null,
  currency text not null default 'eur',
  -- 'settled' counts toward the available balance, 'pending' is not yet
  -- earned, 'info' is display-only (commission breakdown), 'voided' is undone.
  status text not null default 'settled'
    check (status in ('pending', 'settled', 'info', 'voided')),
  reason text,
  created_by uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index driver_account_entries_driver_idx
  on public.driver_account_entries (driver_id, created_at desc);
create index driver_account_entries_booking_idx
  on public.driver_account_entries (booking_id);
create unique index driver_account_entries_earning_key
  on public.driver_account_entries (earning_id, entry_type);

grant select on public.driver_account_entries to authenticated;
grant all on public.driver_account_entries to service_role;
alter table public.driver_account_entries enable row level security;

create policy "drivers read their own ledger" on public.driver_account_entries
  for select to authenticated
  using (driver_id = auth.uid() or public.is_admin());

create trigger driver_account_entries_updated_at
before update on public.driver_account_entries
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 4. Cancellation log
-- ---------------------------------------------------------------------------
create table public.driver_cancellations (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  driver_id uuid not null,
  kind text not null default 'cancellation'
    check (kind in ('cancellation', 'no_show')),
  cancelled_at timestamptz not null default now(),
  hours_before_pickup numeric(10, 2) not null,
  tier text not null check (tier in ('free', 'tier_72', 'tier_48', 'tier_24', 'no_show')),
  penalty_bps integer not null default 0 check (penalty_bps between 0 and 10000),
  penalty_cents integer not null default 0 check (penalty_cents >= 0),
  net_reference_cents integer not null default 0 check (net_reference_cents >= 0),
  released_at timestamptz,
  reason text,
  notes text,
  created_at timestamptz not null default now()
);

create index driver_cancellations_driver_idx
  on public.driver_cancellations (driver_id, cancelled_at desc);

grant select on public.driver_cancellations to authenticated;
grant all on public.driver_cancellations to service_role;
alter table public.driver_cancellations enable row level security;

create policy "drivers read their own cancellations" on public.driver_cancellations
  for select to authenticated
  using (driver_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------------
-- 5. Reliability
-- ---------------------------------------------------------------------------
create table public.driver_reliability (
  driver_id uuid primary key,
  score integer not null default 100 check (score between 0 and 100),
  cancellations_90d integer not null default 0 check (cancellations_90d >= 0),
  no_shows_90d integer not null default 0 check (no_shows_90d >= 0),
  completed_90d integer not null default 0 check (completed_90d >= 0),
  suspended_until timestamptz,
  updated_at timestamptz not null default now()
);

grant select on public.driver_reliability to authenticated;
grant all on public.driver_reliability to service_role;
alter table public.driver_reliability enable row level security;

create policy "drivers read their own reliability" on public.driver_reliability
  for select to authenticated
  using (driver_id = auth.uid() or public.is_admin());

create or replace function public.recompute_driver_reliability(p_driver_id uuid)
returns public.driver_reliability
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_settings public.platform_settings;
  v_cancels integer;
  v_no_shows integer;
  v_completed integer;
  v_score integer;
  v_row public.driver_reliability;
begin
  select * into v_settings from public.platform_settings where id limit 1;

  select
    count(*) filter (where kind = 'cancellation' and penalty_bps > 0),
    count(*) filter (where kind = 'no_show')
  into v_cancels, v_no_shows
  from public.driver_cancellations
  where driver_id = p_driver_id
    and cancelled_at > now() - interval '90 days';

  select count(*) into v_completed
  from public.bookings
  where driver_id = p_driver_id
    and status = 'completed'
    and pickup_at > now() - interval '90 days';

  -- Completed jobs earn back trust; penalised cancellations and no-shows cost.
  v_score := greatest(
    0,
    least(100, 100 - (v_cancels * 15) - (v_no_shows * 30) + least(15, v_completed))
  );

  insert into public.driver_reliability as r (
    driver_id, score, cancellations_90d, no_shows_90d, completed_90d, updated_at
  ) values (
    p_driver_id, v_score, v_cancels, v_no_shows, v_completed, now()
  )
  on conflict (driver_id) do update set
    score = excluded.score,
    cancellations_90d = excluded.cancellations_90d,
    no_shows_90d = excluded.no_shows_90d,
    completed_90d = excluded.completed_90d,
    suspended_until = case
      when excluded.score < coalesce(v_settings.reliability_suspend_score, 40)
        then greatest(
          coalesce(r.suspended_until, now()),
          now() + make_interval(days => coalesce(v_settings.reliability_suspend_days, 14))
        )
      else r.suspended_until
    end,
    updated_at = now()
  returning * into v_row;

  return v_row;
end;
$$;

revoke execute on function public.recompute_driver_reliability(uuid)
  from public, anon, authenticated;
grant execute on function public.recompute_driver_reliability(uuid) to service_role;

-- ---------------------------------------------------------------------------
-- 6. Earnings: allow a replacement earning per booking, mirror into the ledger
-- ---------------------------------------------------------------------------
alter table public.driver_earnings
  drop constraint if exists driver_earnings_booking_id_key;
create unique index driver_earnings_active_booking_key
  on public.driver_earnings (booking_id)
  where status <> 'voided';

create or replace function public.mirror_earning_to_ledger()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_status text;
begin
  v_status := case
    when new.status in ('pending', 'held') then 'pending'
    when new.status in ('available', 'paid') then 'settled'
    else 'voided'
  end;

  insert into public.driver_account_entries (
    driver_id, booking_id, earning_id, entry_type, amount_cents, currency, status, reason
  ) values (
    new.driver_id, new.booking_id, new.id, 'earning',
    new.net_cents, new.currency, v_status, 'transfer earnings'
  )
  on conflict (earning_id, entry_type) do update set
    driver_id = excluded.driver_id,
    amount_cents = excluded.amount_cents,
    status = excluded.status,
    updated_at = now();

  insert into public.driver_account_entries (
    driver_id, booking_id, earning_id, entry_type, amount_cents, currency, status, reason
  ) values (
    new.driver_id, new.booking_id, new.id, 'commission',
    -new.commission_cents, new.currency, 'info', 'platform commission'
  )
  on conflict (earning_id, entry_type) do update set
    driver_id = excluded.driver_id,
    amount_cents = excluded.amount_cents,
    updated_at = now();

  return new;
end;
$$;

revoke execute on function public.mirror_earning_to_ledger() from public, anon, authenticated;

drop trigger if exists driver_earnings_ledger on public.driver_earnings;
create trigger driver_earnings_ledger
after insert or update of status, net_cents, commission_cents, driver_id
on public.driver_earnings
for each row execute function public.mirror_earning_to_ledger();

-- Backfill the ledger for earnings that already exist.
insert into public.driver_account_entries (
  driver_id, booking_id, earning_id, entry_type, amount_cents, currency, status, reason
)
select e.driver_id, e.booking_id, e.id, 'earning', e.net_cents, e.currency,
  case
    when e.status in ('pending', 'held') then 'pending'
    when e.status in ('available', 'paid') then 'settled'
    else 'voided'
  end,
  'transfer earnings'
from public.driver_earnings e
on conflict (earning_id, entry_type) do nothing;

insert into public.driver_account_entries (
  driver_id, booking_id, earning_id, entry_type, amount_cents, currency, status, reason
)
select e.driver_id, e.booking_id, e.id, 'commission', -e.commission_cents, e.currency,
  'info', 'platform commission'
from public.driver_earnings e
on conflict (earning_id, entry_type) do nothing;

-- Earning creation now accounts for a replacement incentive and can create a
-- fresh line after a previous driver's line was voided.
create or replace function public.sync_booking_earning()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_settings public.platform_settings;
  v_commission integer;
  v_net integer;
  v_existing public.driver_earnings;
begin
  select * into v_settings from public.platform_settings where id limit 1;
  if not found then return new; end if;

  select * into v_existing
  from public.driver_earnings
  where booking_id = new.id and status <> 'voided'
  limit 1;

  if v_existing.id is null then
    if new.payment_status = 'paid' and new.driver_id is not null then
      v_commission := round(new.price_cents * v_settings.commission_bps / 10000.0);
      v_net := new.price_cents - v_commission + coalesce(new.incentive_cents, 0);
      insert into public.driver_earnings (
        booking_id, driver_id, gross_cents, commission_bps,
        commission_cents, net_cents, currency, status
      ) values (
        new.id, new.driver_id, new.price_cents, v_settings.commission_bps,
        v_commission, v_net, lower(new.currency), 'pending'
      )
      returning * into v_existing;
    else
      return new;
    end if;
  end if;

  if v_existing.status = 'pending' then
    v_commission := round(new.price_cents * v_existing.commission_bps / 10000.0);
    update public.driver_earnings set
      driver_id = coalesce(new.driver_id, driver_id),
      gross_cents = new.price_cents,
      commission_cents = v_commission,
      net_cents = new.price_cents - v_commission + coalesce(new.incentive_cents, 0)
    where id = v_existing.id
    returning * into v_existing;
  end if;

  if new.status = 'completed' and v_existing.status = 'pending' then
    update public.driver_earnings set
      status = 'held',
      completed_at = now(),
      available_at = now() + make_interval(hours => v_settings.holding_period_hours)
    where id = v_existing.id;
  end if;

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
end;
$$;

revoke execute on function public.sync_booking_earning() from public, anon, authenticated;
grant execute on function public.sync_booking_earning() to service_role;

-- ---------------------------------------------------------------------------
-- 7. Balance helper
-- ---------------------------------------------------------------------------
create or replace function public.driver_account_balance(p_driver_id uuid)
returns table (
  available_cents integer,
  pending_cents integer,
  negative_cents integer,
  penalties_cents integer,
  incentives_cents integer,
  paid_cents integer
)
language sql
stable
security definer
set search_path = ''
as $$
  with entries as (
    select * from public.driver_account_entries where driver_id = p_driver_id
  ),
  totals as (
    select
      coalesce(sum(amount_cents) filter (where status = 'settled'), 0)::integer as balance,
      coalesce(sum(amount_cents) filter (where status = 'pending'), 0)::integer as pending,
      coalesce(-sum(amount_cents) filter (where entry_type = 'penalty'), 0)::integer as penalties,
      coalesce(sum(amount_cents) filter (where entry_type = 'incentive'), 0)::integer as incentives,
      coalesce(-sum(amount_cents) filter (where entry_type = 'payout'), 0)::integer as paid
    from entries
  )
  select
    greatest(balance, 0),
    pending,
    greatest(-balance, 0),
    penalties,
    incentives,
    paid
  from totals;
$$;

revoke execute on function public.driver_account_balance(uuid) from public, anon;
grant execute on function public.driver_account_balance(uuid) to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- 8. Penalty tiering + cancellation flow
-- ---------------------------------------------------------------------------
create or replace function public.driver_cancellation_tier(p_hours numeric)
returns table (tier text, bps integer)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_settings public.platform_settings;
begin
  select * into v_settings from public.platform_settings where id limit 1;
  if p_hours >= 72 then
    return query select 'free'::text, 0;
  elsif p_hours >= 48 then
    return query select 'tier_72'::text, coalesce(v_settings.penalty_tier_72_bps, 1000);
  elsif p_hours >= 24 then
    return query select 'tier_48'::text, coalesce(v_settings.penalty_tier_48_bps, 2500);
  else
    return query select 'tier_24'::text, coalesce(v_settings.penalty_tier_24_bps, 5000);
  end if;
end;
$$;

revoke execute on function public.driver_cancellation_tier(numeric) from public, anon;
grant execute on function public.driver_cancellation_tier(numeric) to authenticated, service_role;

create or replace function public.preview_driver_cancellation(p_booking_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  v_booking public.bookings;
  v_settings public.platform_settings;
  v_hours numeric;
  v_tier text;
  v_bps integer;
  v_net integer;
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;

  select * into v_booking from public.bookings where id = p_booking_id;
  if not found then raise exception 'booking_not_found'; end if;
  if v_booking.driver_id is distinct from auth.uid() and not public.is_admin() then
    raise exception 'forbidden';
  end if;

  select * into v_settings from public.platform_settings where id limit 1;
  v_hours := extract(epoch from (v_booking.pickup_at - now())) / 3600.0;
  select t.tier, t.bps into v_tier, v_bps from public.driver_cancellation_tier(v_hours) t;

  v_net := coalesce(
    (select net_cents from public.driver_earnings
      where booking_id = v_booking.id and status <> 'voided' limit 1),
    v_booking.price_cents
      - round(v_booking.price_cents * coalesce(v_settings.commission_bps, 1500) / 10000.0)
  );

  return jsonb_build_object(
    'hours_before_pickup', round(v_hours, 2),
    'tier', v_tier,
    'penalty_bps', v_bps,
    'net_cents', v_net,
    'penalty_cents', round(v_net * v_bps / 10000.0),
    'currency', lower(v_booking.currency)
  );
end;
$$;

revoke execute on function public.preview_driver_cancellation(uuid) from public, anon;
grant execute on function public.preview_driver_cancellation(uuid) to authenticated, service_role;

-- Shared release routine: penalise, void the earning, hand the job back to
-- the marketplace as a last-minute job, optionally with an incentive.
create or replace function public.release_booking_from_driver(
  p_booking_id uuid,
  p_driver_id uuid,
  p_kind text,
  p_reason text,
  p_actor uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_booking public.bookings;
  v_settings public.platform_settings;
  v_hours numeric;
  v_tier text;
  v_bps integer;
  v_net integer;
  v_penalty integer;
  v_incentive integer := 0;
begin
  select * into v_booking from public.bookings where id = p_booking_id for update;
  if not found then raise exception 'booking_not_found'; end if;
  if v_booking.driver_id is distinct from p_driver_id then raise exception 'driver_mismatch'; end if;
  if v_booking.status not in ('claimed', 'en_route') then raise exception 'release_refused'; end if;

  select * into v_settings from public.platform_settings where id limit 1;
  v_hours := extract(epoch from (v_booking.pickup_at - now())) / 3600.0;

  if p_kind = 'no_show' then
    v_tier := 'no_show';
    v_bps := coalesce(v_settings.penalty_no_show_bps, 10000);
  else
    select t.tier, t.bps into v_tier, v_bps from public.driver_cancellation_tier(v_hours) t;
  end if;

  v_net := coalesce(
    (select net_cents from public.driver_earnings
      where booking_id = v_booking.id and status <> 'voided' limit 1),
    v_booking.price_cents
      - round(v_booking.price_cents * coalesce(v_settings.commission_bps, 1500) / 10000.0)
  );
  v_penalty := round(v_net * v_bps / 10000.0);

  -- The abandoning driver keeps nothing for this booking.
  update public.driver_earnings set
    status = 'voided',
    note = coalesce(note, 'driver ' || p_kind)
  where booking_id = v_booking.id and status in ('pending', 'held', 'available');

  if v_penalty > 0 then
    insert into public.driver_account_entries (
      driver_id, booking_id, entry_type, amount_cents, currency, status, reason, created_by, metadata
    ) values (
      p_driver_id, v_booking.id, 'penalty', -v_penalty, lower(v_booking.currency), 'settled',
      coalesce(p_reason, p_kind), p_actor,
      jsonb_build_object('tier', v_tier, 'penalty_bps', v_bps, 'hours_before_pickup', round(v_hours, 2))
    );
  end if;

  -- Auto incentive for short-notice replacements.
  if v_hours <= coalesce(v_settings.auto_incentive_hours, 24) then
    v_incentive := round(v_net * coalesce(v_settings.auto_incentive_bps, 1500) / 10000.0);
  end if;

  insert into public.driver_cancellations (
    booking_id, driver_id, kind, hours_before_pickup, tier, penalty_bps,
    penalty_cents, net_reference_cents, released_at, reason
  ) values (
    v_booking.id, p_driver_id, p_kind, round(v_hours, 2), v_tier, v_bps,
    v_penalty, v_net, now(), p_reason
  );

  update public.bookings set
    driver_id = null,
    status = 'pending',
    assigned_at = null,
    offered_at = null,
    dispatch_batch = 0,
    released_at = now(),
    incentive_cents = greatest(coalesce(incentive_cents, 0), v_incentive),
    updated_at = now()
  where id = v_booking.id;

  perform public.recompute_driver_reliability(p_driver_id);

  return jsonb_build_object(
    'booking_id', v_booking.id,
    'tier', v_tier,
    'penalty_cents', v_penalty,
    'incentive_cents', greatest(coalesce(v_booking.incentive_cents, 0), v_incentive),
    'released', true
  );
end;
$$;

revoke execute on function public.release_booking_from_driver(uuid, uuid, text, text, uuid)
  from public, anon, authenticated;
grant execute on function public.release_booking_from_driver(uuid, uuid, text, text, uuid)
  to service_role;

create or replace function public.driver_cancel_job(p_booking_id uuid, p_reason text default null)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'not_authenticated'; end if;
  return public.release_booking_from_driver(
    p_booking_id, auth.uid(), 'cancellation', p_reason, auth.uid()
  );
end;
$$;

revoke execute on function public.driver_cancel_job(uuid, text) from public, anon;
grant execute on function public.driver_cancel_job(uuid, text) to authenticated, service_role;

create or replace function public.admin_mark_driver_no_show(
  p_booking_id uuid,
  p_note text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_driver uuid;
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  select driver_id into v_driver from public.bookings where id = p_booking_id;
  if v_driver is null then raise exception 'booking_has_no_driver'; end if;
  return public.release_booking_from_driver(
    p_booking_id, v_driver, 'no_show', p_note, auth.uid()
  );
end;
$$;

revoke execute on function public.admin_mark_driver_no_show(uuid, text) from public, anon;
grant execute on function public.admin_mark_driver_no_show(uuid, text) to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- 9. Admin controls
-- ---------------------------------------------------------------------------
create or replace function public.admin_set_replacement_incentive(
  p_booking_id uuid,
  p_cents integer
)
returns public.bookings
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_booking public.bookings;
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  if p_cents < 0 or p_cents > 100000 then raise exception 'invalid_amount'; end if;

  update public.bookings set incentive_cents = p_cents, updated_at = now()
  where id = p_booking_id
  returning * into v_booking;
  if not found then raise exception 'booking_not_found'; end if;

  return v_booking;
end;
$$;

revoke execute on function public.admin_set_replacement_incentive(uuid, integer) from public, anon;
grant execute on function public.admin_set_replacement_incentive(uuid, integer)
  to authenticated, service_role;

create or replace function public.admin_adjust_driver_account(
  p_driver_id uuid,
  p_amount_cents integer,
  p_reason text,
  p_entry_type text default 'adjustment'
)
returns public.driver_account_entries
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_row public.driver_account_entries;
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;
  if p_entry_type not in ('adjustment', 'incentive', 'penalty') then
    raise exception 'invalid_entry_type';
  end if;
  if abs(p_amount_cents) > 500000 then raise exception 'invalid_amount'; end if;
  if coalesce(trim(p_reason), '') = '' then raise exception 'reason_required'; end if;

  insert into public.driver_account_entries (
    driver_id, entry_type, amount_cents, status, reason, created_by
  ) values (
    p_driver_id, p_entry_type, p_amount_cents, 'settled', p_reason, auth.uid()
  )
  returning * into v_row;

  return v_row;
end;
$$;

revoke execute on function public.admin_adjust_driver_account(uuid, integer, text, text)
  from public, anon;
grant execute on function public.admin_adjust_driver_account(uuid, integer, text, text)
  to authenticated, service_role;

create or replace function public.admin_waive_penalty(p_entry_id uuid, p_reason text)
returns public.driver_account_entries
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_row public.driver_account_entries;
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;

  update public.driver_account_entries set
    status = 'voided',
    reason = coalesce(reason, '') || ' | waived: ' || coalesce(p_reason, ''),
    updated_at = now()
  where id = p_entry_id and entry_type = 'penalty' and status = 'settled'
  returning * into v_row;
  if not found then raise exception 'penalty_not_found'; end if;

  update public.driver_cancellations set penalty_cents = 0, notes = p_reason
  where booking_id = v_row.booking_id and driver_id = v_row.driver_id;

  perform public.recompute_driver_reliability(v_row.driver_id);
  return v_row;
end;
$$;

revoke execute on function public.admin_waive_penalty(uuid, text) from public, anon;
grant execute on function public.admin_waive_penalty(uuid, text) to authenticated, service_role;

create or replace function public.admin_set_driver_suspension(
  p_driver_id uuid,
  p_until timestamptz
)
returns public.driver_reliability
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_row public.driver_reliability;
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;

  insert into public.driver_reliability (driver_id, suspended_until)
  values (p_driver_id, p_until)
  on conflict (driver_id) do update set suspended_until = excluded.suspended_until,
    updated_at = now()
  returning * into v_row;

  return v_row;
end;
$$;

revoke execute on function public.admin_set_driver_suspension(uuid, timestamptz) from public, anon;
grant execute on function public.admin_set_driver_suspension(uuid, timestamptz)
  to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- 10. Suspended drivers cannot take work
-- ---------------------------------------------------------------------------
create or replace function public.is_suspended_driver(p_driver_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.driver_reliability
    where driver_id = p_driver_id and suspended_until is not null and suspended_until > now()
  );
$$;

revoke execute on function public.is_suspended_driver(uuid) from public, anon;
grant execute on function public.is_suspended_driver(uuid) to authenticated, service_role;