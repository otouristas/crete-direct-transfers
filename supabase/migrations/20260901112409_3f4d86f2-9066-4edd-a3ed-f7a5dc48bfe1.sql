-- Suspended drivers cannot claim work.
create or replace function public.claim_job(p_booking_id uuid)
returns public.bookings
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_booking public.bookings;
  v_eta int;
  v_is_online boolean;
  v_has_offers boolean;
begin
  if not public.is_approved_driver() then
    raise exception 'not_approved_driver';
  end if;

  if public.is_suspended_driver(auth.uid()) then
    raise exception 'driver_suspended';
  end if;

  select is_online into v_is_online from public.driver_profiles where id = auth.uid();
  if v_is_online is distinct from true then
    raise exception 'driver_offline';
  end if;

  select * into v_booking from public.bookings where id = p_booking_id for update;
  if v_booking.id is null then
    raise exception 'job_not_found';
  end if;
  if v_booking.status <> 'pending' or v_booking.driver_id is not null then
    raise exception 'job_already_claimed';
  end if;

  if v_booking.urgency = 'asap'
     and v_booking.asap_expires_at is not null
     and v_booking.asap_expires_at <= now() then
    raise exception 'asap_expired';
  end if;

  v_eta := coalesce(
    v_booking.eta_minutes,
    nullif((v_booking.extras->>'eta_hint_minutes'), '')::int,
    35
  );

  update public.bookings
     set driver_id = auth.uid(),
         status = 'claimed',
         assigned_at = now(),
         eta_minutes = v_eta
   where id = p_booking_id and status = 'pending' and driver_id is null
   returning * into v_booking;
  if v_booking.id is null then
    raise exception 'job_already_claimed';
  end if;

  delete from public.asap_dispatch_events where booking_id = p_booking_id;

  select to_regclass('public.job_offers') is not null into v_has_offers;
  if v_has_offers then
    update public.job_offers
       set status = 'cancelled', responded_at = now()
     where booking_id = p_booking_id and status = 'pending' and driver_id <> auth.uid();
    update public.job_offers
       set status = 'accepted', responded_at = now()
     where booking_id = p_booking_id and driver_id = auth.uid() and status = 'pending';
  end if;

  return v_booking;
end $function$;

-- Marketplace listing shows released/urgent jobs and their incentive.
create or replace view public.open_jobs
with (security_invoker = true) as
  select id, route_slug, vehicle_class, passengers, pickup_at, trip_type, return_at,
         bags_checked, bags_cabin, pickup_address, dropoff_address, extras,
         price_cents, currency, created_at, urgency, asap_expires_at, eta_minutes,
         released_at, incentive_cents
    from public.bookings
   where status = 'pending'
     and driver_id is null
     and public.is_approved_driver()
     and (
       (urgency = 'asap' and coalesce(asap_expires_at, now()) > now())
       or (coalesce(urgency, 'scheduled') <> 'asap' and pickup_at > now())
     );

grant select on public.open_jobs to authenticated;

-- Admin summary of every driver account.
create or replace view public.driver_account_summary
with (security_invoker = true) as
  select
    e.driver_id,
    p.full_name,
    greatest(coalesce(sum(e.amount_cents) filter (where e.status = 'settled'), 0), 0)::integer
      as available_cents,
    coalesce(sum(e.amount_cents) filter (where e.status = 'pending'), 0)::integer
      as pending_cents,
    greatest(-coalesce(sum(e.amount_cents) filter (where e.status = 'settled'), 0), 0)::integer
      as negative_cents,
    coalesce(-sum(e.amount_cents) filter (where e.entry_type = 'penalty' and e.status = 'settled'), 0)::integer
      as penalties_cents,
    coalesce(sum(e.amount_cents) filter (where e.entry_type = 'incentive' and e.status = 'settled'), 0)::integer
      as incentives_cents,
    r.score,
    r.cancellations_90d,
    r.no_shows_90d,
    r.suspended_until
  from public.driver_account_entries e
  left join public.profiles p on p.id = e.driver_id
  left join public.driver_reliability r on r.driver_id = e.driver_id
  group by e.driver_id, p.full_name, r.score, r.cancellations_90d, r.no_shows_90d, r.suspended_until;

grant select on public.driver_account_summary to authenticated;

-- Penalty policy settings.
create or replace function public.admin_update_penalty_settings(
  p_penalty_tier_72_bps integer default null,
  p_penalty_tier_48_bps integer default null,
  p_penalty_tier_24_bps integer default null,
  p_penalty_no_show_bps integer default null,
  p_auto_incentive_hours integer default null,
  p_auto_incentive_bps integer default null,
  p_reliability_suspend_score integer default null,
  p_reliability_suspend_days integer default null
)
returns public.platform_settings
language plpgsql
security definer
set search_path = ''
as $$
declare v_row public.platform_settings;
begin
  if not public.is_admin() then raise exception 'forbidden'; end if;

  update public.platform_settings set
    penalty_tier_72_bps = coalesce(p_penalty_tier_72_bps, penalty_tier_72_bps),
    penalty_tier_48_bps = coalesce(p_penalty_tier_48_bps, penalty_tier_48_bps),
    penalty_tier_24_bps = coalesce(p_penalty_tier_24_bps, penalty_tier_24_bps),
    penalty_no_show_bps = coalesce(p_penalty_no_show_bps, penalty_no_show_bps),
    auto_incentive_hours = coalesce(p_auto_incentive_hours, auto_incentive_hours),
    auto_incentive_bps = coalesce(p_auto_incentive_bps, auto_incentive_bps),
    reliability_suspend_score = coalesce(p_reliability_suspend_score, reliability_suspend_score),
    reliability_suspend_days = coalesce(p_reliability_suspend_days, reliability_suspend_days),
    updated_at = now()
  where id
  returning * into v_row;

  return v_row;
end;
$$;

revoke execute on function public.admin_update_penalty_settings(
  integer, integer, integer, integer, integer, integer, integer, integer
) from public, anon;
grant execute on function public.admin_update_penalty_settings(
  integer, integer, integer, integer, integer, integer, integer, integer
) to authenticated, service_role;

-- Completing a job should refresh the driver's reliability picture.
create or replace function public.refresh_reliability_on_completion()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status = 'completed' and old.status is distinct from 'completed'
     and new.driver_id is not null then
    perform public.recompute_driver_reliability(new.driver_id);
  end if;
  return new;
end;
$$;

revoke execute on function public.refresh_reliability_on_completion() from public, anon, authenticated;

drop trigger if exists bookings_reliability_refresh on public.bookings;
create trigger bookings_reliability_refresh
after update of status on public.bookings
for each row execute function public.refresh_reliability_on_completion();