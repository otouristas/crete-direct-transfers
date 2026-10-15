-- Stripe Connect: carrier payout accounts + booking payout tracking.
-- Platform collects 100% at Checkout; on completed trip transfers 85% to carrier.

alter table public.partners
  add column if not exists stripe_account_id text,
  add column if not exists stripe_onboarding_complete boolean not null default false;

alter table public.driver_profiles
  add column if not exists stripe_account_id text,
  add column if not exists stripe_onboarding_complete boolean not null default false;

alter table public.bookings
  add column if not exists platform_fee_cents integer,
  add column if not exists carrier_payout_cents integer,
  add column if not exists stripe_transfer_id text,
  add column if not exists payout_status text not null default 'pending'
    check (payout_status in ('pending', 'transferred', 'skipped_no_account', 'failed'));

create index if not exists idx_bookings_payout_pending
  on public.bookings (payout_status)
  where payout_status in ('pending', 'failed')
    and payment_status = 'paid'
    and status = 'completed';

comment on column public.bookings.platform_fee_cents is '15% platform fee retained from price_cents';
comment on column public.bookings.carrier_payout_cents is '85% remitted to carrier Connect account';
comment on column public.bookings.payout_status is 'Separate-charges transfer lifecycle after trip completed';
