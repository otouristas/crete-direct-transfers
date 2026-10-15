alter table public.bookings
  add column stripe_checkout_session_id text,
  add column stripe_checkout_session_url text,
  add column stripe_checkout_version integer not null default 1
    check (stripe_checkout_version >= 1),
  add column stripe_checkout_status text
    check (stripe_checkout_status is null or stripe_checkout_status in ('open', 'complete', 'expired'));

create unique index bookings_stripe_checkout_session_id_key
  on public.bookings (stripe_checkout_session_id)
  where stripe_checkout_session_id is not null;

create table public.stripe_webhook_events (
  event_id text primary key,
  event_type text not null,
  booking_id uuid,
  livemode boolean not null,
  status text not null default 'processing'
    check (status in ('processing', 'processed', 'failed')),
  error text,
  received_at timestamptz not null default now(),
  processed_at timestamptz
);

alter table public.stripe_webhook_events enable row level security;
revoke all on table public.stripe_webhook_events from public, anon, authenticated;
grant select, insert, update on table public.stripe_webhook_events to service_role;
create policy "browser roles cannot access stripe webhook events"
  on public.stripe_webhook_events
  for all to public
  using (false)
  with check (false);

create or replace function public.process_stripe_checkout_event(
  p_event_id text,
  p_event_type text,
  p_booking_id uuid,
  p_session_id text,
  p_payment_intent_id text,
  p_amount_total integer,
  p_currency text,
  p_livemode boolean
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  booking public.bookings;
  inserted_count integer;
  failure text;
begin
  insert into public.stripe_webhook_events (
    event_id, event_type, booking_id, livemode
  ) values (
    p_event_id, p_event_type, p_booking_id, p_livemode
  )
  on conflict (event_id) do nothing;
  get diagnostics inserted_count = row_count;

  if inserted_count = 0 then
    return jsonb_build_object('ok', true, 'duplicate', true);
  end if;

  select * into booking
  from public.bookings
  where id = p_booking_id
  for update;

  if booking.id is null then
    failure := 'booking_not_found';
  elsif booking.stripe_checkout_session_id is distinct from p_session_id then
    failure := 'checkout_session_mismatch';
  elsif booking.price_cents is distinct from p_amount_total then
    failure := 'amount_mismatch';
  elsif lower(booking.currency) is distinct from lower(p_currency) then
    failure := 'currency_mismatch';
  elsif coalesce(p_payment_intent_id, '') = '' then
    failure := 'payment_intent_missing';
  end if;

  if failure is not null then
    update public.stripe_webhook_events
    set status = 'failed', error = failure, processed_at = now()
    where event_id = p_event_id;
    return jsonb_build_object('ok', false, 'duplicate', false, 'error', failure);
  end if;

  update public.bookings
  set payment_status = 'paid',
      stripe_payment_intent_id = p_payment_intent_id,
      stripe_checkout_status = 'complete'
  where id = p_booking_id;

  update public.stripe_webhook_events
  set status = 'processed', processed_at = now()
  where event_id = p_event_id;

  return jsonb_build_object('ok', true, 'duplicate', false);
end;
$$;

revoke execute on function public.process_stripe_checkout_event(
  text, text, uuid, text, text, integer, text, boolean
) from public, anon, authenticated;
grant execute on function public.process_stripe_checkout_event(
  text, text, uuid, text, text, integer, text, boolean
) to service_role;
