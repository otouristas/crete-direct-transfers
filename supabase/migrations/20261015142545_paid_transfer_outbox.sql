
create or replace function public.enqueue_paid_transfer_event()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  insert into public.event_outbox(event_type,aggregate_id,idempotency_key,payload)
  values('booking.paid',new.id,'booking.paid:'||new.id::text,jsonb_build_object('locale',new.locale))
  on conflict(idempotency_key) do nothing;
  return new;
end; $$;
revoke all on function public.enqueue_paid_transfer_event() from public, anon, authenticated;
create trigger bookings_paid_event after update of payment_status on public.bookings
for each row when (new.payment_status='paid' and old.payment_status is distinct from 'paid')
execute function public.enqueue_paid_transfer_event();
