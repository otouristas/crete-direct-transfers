# Stripe Connect — Driver Earnings & Payouts

Goal: customer pays the full fare, the platform keeps 15%, the driver earns 85% — but no money moves to the driver until the ride is completed, a holding period has passed, and a scheduled payout run releases it.

Note on accounts: this build extends the project's existing Stripe setup (your own Stripe secret key), because Connect and connected driver accounts require a platform Stripe account. Lovable's built-in payments product does not support marketplace payouts.

## Money flow

```text
Customer pays (full fare, funds stay on the platform account)
   -> booking paid, ledger entry created: status = pending
Ride completed
   -> entry status = held, available_at = completed_at + holding period
Holding period elapses
   -> entry status = available
Payout run (weekly default / monthly / instant)
   -> one Stripe transfer per driver for the summed amount
   -> entry status = paid, payout row records the batch
```

No-show, cancellation, refund or dispute keeps the entry blocked (`voided` or `disputed`) and never reaches a payout. Refunds pull back from the platform balance since the driver was never paid.

Stripe processing fees are absorbed by the platform: the driver always receives exactly 85% of the fare.

## Driver onboarding (Stripe Express)

- "Set up payouts" in the driver portal creates a Stripe Express connected account and opens Stripe's hosted onboarding (KYC, bank details).
- Return/refresh URLs land back in the driver portal; a status card shows Not started / In review / Ready.
- Drivers can accept jobs before onboarding, but earnings stay unpayable and the dashboard shows a clear prompt. Payout runs skip drivers without `payouts_enabled`.
- Connected accounts are set to manual payout schedule so Stripe never pays a driver automatically.

## Driver dashboard (rebuild of the Earnings page)

- Four figures: Pending, Available, Total earned, Next payout date.
- Per-booking earnings table: date, route, fare, commission, driver share, status.
- Payout history: date, amount, number of bookings, Stripe status, plus a drill-down to the bookings in each payout.
- Payout preference selector: Weekly (default), Monthly, Instant (only shown when Stripe reports instant payouts available for that account).

## Admin console (new Payments tab in Ops)

- Payments list: booking, customer amount, commission, driver share, payment status, ledger status.
- Actions: issue full/partial refund, hold or release a driver's earnings entry, mark a dispute, void an entry.
- Payouts list: run a payout batch now, view history, retry failed transfers.
- Settings: commission percentage, holding period hours, default payout schedule, minimum payout amount. Stored in the database so changes take effect without a redeploy; each ledger entry records the commission rate used at the time.
- Reconciliation view: Booking ID -> Stripe payment -> driver -> commission -> driver earnings -> payout, in one row.

## Technical section

### Database (one migration)

- `platform_settings` — single-row config: `commission_bps` (default 1500), `holding_period_hours` (default 24), `default_payout_schedule`, `min_payout_cents`. Admin-only writes.
- `driver_payout_accounts` — `driver_id`, `stripe_account_id`, `charges_enabled`, `payouts_enabled`, `details_submitted`, `payout_schedule`, `instant_eligible`. Driver reads own row; admin reads all.
- `driver_earnings` — one row per booking: `booking_id` (unique), `driver_id`, `gross_cents`, `commission_bps`, `commission_cents`, `net_cents`, `currency`, `status` (`pending|held|available|paid|voided|disputed`), `available_at`, `payout_id`, `note`. Driver reads own; admin all.
- `driver_payouts` — `driver_id`, `amount_cents`, `currency`, `status` (`pending|paid|failed`), `stripe_transfer_id`, `method` (`standard|instant`), `period_start/end`, `failure_reason`.
- Security-definer functions: `record_booking_earning`, `release_earning_on_completion`, `mature_held_earnings` (holding period sweep), `admin_hold_earning` / `admin_release_earning` / `admin_void_earning`.
- Hooks: the Stripe checkout webhook path creates the `pending` entry; `update_job_status('completed')` moves it to `held` with `available_at`; cancellation/no-show/incident paths void it.
- GRANTs and RLS on every new table, admin gated through the existing `is_admin()`.

### Server functions and routes

- `src/functions/connect.ts` — `createDriverConnectAccount`, `createOnboardingLink`, `getConnectStatus`, `setPayoutSchedule` (all auth-gated to the signed-in driver).
- `src/functions/payouts.ts` — admin-gated `runPayoutBatch` (groups available earnings per driver, one Stripe transfer each, idempotency key per driver+period), `refundBooking`, `holdEarning`, `releaseEarning`, `updatePlatformSettings`.
- Extend the existing Stripe webhook to handle `account.updated` (sync Connect capabilities), `transfer.paid` / `transfer.failed`, `charge.dispute.created` (mark earnings disputed), and `charge.refunded`.
- `src/routes/api/public/payouts/run.ts` — cron endpoint guarded by a shared secret: matures held earnings and runs the due weekly/monthly batches.

### Frontend

- `src/queries/earnings.ts` and `src/queries/payouts.ts` for driver and admin reads.
- Rebuild `driver.earnings.tsx` (stat cards, bookings table, payout history, schedule selector) and add a payouts setup card to `driver.index.tsx`.
- Add a Payments/Payouts section to `ops.tsx` with the tables, actions and settings form.
- All new copy added to the i18n dictionaries (en, el, de, fr, it, es, nl) — no hardcoded strings.
