-- Durable, idempotent side effects for booking/dispatch notifications.
-- The table lives in public for PostgREST service-role access, but has no
-- anon/authenticated grants or policies. Only the service role can claim it.

alter table public.bookings
  add column if not exists locale text not null default 'en'
  check (locale in ('en', 'el', 'de', 'fr', 'it', 'nl', 'es'));

create table public.event_outbox (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (
    event_type in ('booking.created', 'booking.cancelled', 'incident.opened', 'driver.assigned')
  ),
  aggregate_id uuid not null,
  idempotency_key text not null unique,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'sent', 'failed')),
  attempts integer not null default 0 check (attempts >= 0),
  available_at timestamptz not null default now(),
  locked_at timestamptz,
  processed_at timestamptz,
  last_error text,
  created_at timestamptz not null default now()
);

create index event_outbox_pending_idx
  on public.event_outbox (available_at, created_at)
  where status = 'pending';

alter table public.event_outbox enable row level security;
revoke all on table public.event_outbox from public, anon, authenticated;
grant select, insert, update, delete on table public.event_outbox to service_role;

create or replace function public.enqueue_booking_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.event_outbox (event_type, aggregate_id, idempotency_key)
    values ('booking.created', new.id, 'booking.created:' || new.id::text)
    on conflict (idempotency_key) do nothing;
    return new;
  end if;

  if old.status is distinct from new.status and new.status = 'cancelled' then
    insert into public.event_outbox (event_type, aggregate_id, idempotency_key)
    values ('booking.cancelled', new.id, 'booking.cancelled:' || new.id::text)
    on conflict (idempotency_key) do nothing;
  end if;

  if old.driver_id is distinct from new.driver_id and new.driver_id is not null then
    insert into public.event_outbox (event_type, aggregate_id, idempotency_key, payload)
    values (
      'driver.assigned',
      new.id,
      'driver.assigned:' || new.id::text || ':' || new.driver_id::text,
      jsonb_build_object('driver_id', new.driver_id)
    )
    on conflict (idempotency_key) do nothing;
  end if;

  return new;
end;
$$;

revoke execute on function public.enqueue_booking_event() from public, anon, authenticated;

drop trigger if exists bookings_event_outbox on public.bookings;
create trigger bookings_event_outbox
after insert or update of status, driver_id on public.bookings
for each row execute function public.enqueue_booking_event();

create or replace function public.enqueue_incident_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.event_outbox (
    event_type,
    aggregate_id,
    idempotency_key,
    payload
  ) values (
    'incident.opened',
    new.booking_id,
    'incident.opened:' || new.id::text,
    jsonb_build_object('incident_id', new.id)
  )
  on conflict (idempotency_key) do nothing;
  return new;
end;
$$;

revoke execute on function public.enqueue_incident_event() from public, anon, authenticated;

drop trigger if exists booking_incidents_event_outbox on public.booking_incidents;
create trigger booking_incidents_event_outbox
after insert on public.booking_incidents
for each row execute function public.enqueue_incident_event();

create or replace function public.claim_event_outbox(p_limit integer default 20)
returns setof public.event_outbox
language plpgsql
security definer
set search_path = ''
as $$
begin
  return query
  with claimed as (
    select row.id
    from public.event_outbox as row
    where row.status = 'pending'
      and row.available_at <= now()
    order by row.created_at
    for update skip locked
    limit greatest(1, least(coalesce(p_limit, 20), 100))
  )
  update public.event_outbox as row
  set status = 'processing',
      attempts = row.attempts + 1,
      locked_at = now(),
      last_error = null
  from claimed
  where row.id = claimed.id
  returning row.*;
end;
$$;

revoke execute on function public.claim_event_outbox(integer) from public, anon, authenticated;
grant execute on function public.claim_event_outbox(integer) to service_role;

create or replace function public.complete_event_outbox(
  p_id uuid,
  p_success boolean,
  p_error text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.event_outbox as row
  set status = case
        when p_success then 'sent'
        when row.attempts >= 8 then 'failed'
        else 'pending'
      end,
      processed_at = case when p_success then now() else null end,
      available_at = case
        when p_success then row.available_at
        else now() + make_interval(secs => least(3600, (2 ^ least(row.attempts, 10))::integer * 15))
      end,
      locked_at = null,
      last_error = case when p_success then null else left(coalesce(p_error, 'unknown'), 2000) end
  where row.id = p_id
    and row.status = 'processing';
end;
$$;

revoke execute on function public.complete_event_outbox(uuid, boolean, text)
  from public, anon, authenticated;
grant execute on function public.complete_event_outbox(uuid, boolean, text) to service_role;