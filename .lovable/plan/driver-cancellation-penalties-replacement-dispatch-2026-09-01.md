# Driver Cancellation, Penalties & Replacement Dispatch

Extends the payout ledger with a full driver account: penalties, incentives, negative balance, reliability scoring, and instant re-dispatch of abandoned bookings.

## What changes for a driver

- Cancelling an accepted job asks for a reason and shows the exact penalty **before** confirming, based on how close to pickup it is: free over 72h, 10% at 72–48h, 25% at 48–24h, 50% under 24h, 100% for a no-show.
- The penalty is a separate line in their account, never a silent change to the fare. It offsets against available balance; with no balance it becomes a negative balance that is automatically recovered from their next earnings before any payout.
- Their earnings screen gains a full account ledger: Earnings, Commission, Penalties, Incentives, Available Balance, Negative Balance, Payouts — each as its own row type.
- A Reliability Score (0–100) is shown, with the recent cancellations/no-shows that moved it. Low scores lose dispatch priority and premium-job access; repeated violations can suspend the account.

## What changes for the traveller and dispatch

- The moment a driver cancels or is marked no-show, the booking is released back to the marketplace as an **Urgent / Last-Minute** job and fanned out immediately to nearby online drivers, skipping the usual batching delay.
- Ops (or an automatic rule for very short notice) can attach a **replacement incentive** — extra pay on top of the standard 85% — to make the job attractive. The incentive is independent of the penalty amount.
- Driver no-show blocks the original driver's earnings entirely (voided), and the replacement driver earns the job normally once completed.

## What changes for admins

New "Driver accounts" area in Ops:
- Per-driver balance: available, pending, negative, lifetime penalties, lifetime incentives.
- Penalty list with waive/adjust (with reason, audit-logged).
- Set or override a replacement incentive on any released booking.
- Configure the penalty tiers, no-show penalty, auto-incentive rules, and reliability thresholds globally.
- Reliability score per driver with the ability to suspend/reinstate.

## Technical plan

### Database (one migration)

- `platform_settings` gains: `penalty_tier_72_bps`, `penalty_tier_48_bps`, `penalty_tier_24_bps`, `penalty_no_show_bps`, `auto_incentive_hours`, `auto_incentive_bps`, `reliability_min_score`, `reliability_suspend_score`.
- New `driver_account_entries` — the single source of truth for the driver's money ledger. Columns: `driver_id`, `booking_id` (nullable), `type` (`earning` | `commission` | `penalty` | `incentive` | `payout` | `adjustment`), `amount_cents` (signed), `currency`, `status`, `reason`, `created_by`, `metadata`, timestamps. Existing `driver_earnings` rows keep driving payouts; a trigger mirrors them into the ledger so the ledger reports every movement.
- New `driver_cancellations` — `booking_id`, `driver_id`, `cancelled_at`, `hours_before_pickup`, `tier`, `penalty_bps`, `penalty_cents`, `kind` (`cancellation` | `no_show`), `replacement_booking_released_at`, `notes`.
- New `driver_reliability` — `driver_id` PK, `score` int default 100, `cancellations_90d`, `no_shows_90d`, `completed_90d`, `suspended_until`, `updated_at`. Recomputed by trigger on each cancellation/completion.
- `bookings` gains `incentive_cents` (default 0) and `released_at`; `driver_earnings.net_cents` for a job with an incentive = base net + incentive.
- Every new public table: GRANT to `authenticated` (own rows only) and `service_role`, RLS enabled, owner-scoped SELECT policies plus admin policies via `is_admin()`.

New RPCs (all `security definer`, `search_path = ''`, revoked from anon):
- `preview_driver_cancellation(p_booking_id)` — returns tier, bps and penalty cents without mutating; drives the confirm dialog.
- `driver_cancel_job(p_booking_id, p_reason)` — validates ownership and status, computes the tier from `pickup_at`, writes the penalty ledger entry and `driver_cancellations` row, voids the driver's earning for that booking, clears `driver_id`/`assigned_at`, sets `status = 'released'`, `urgency = 'urgent'`, `released_at = now()`, applies the auto-incentive when inside `auto_incentive_hours`, and bumps reliability.
- `admin_mark_driver_no_show(p_booking_id, p_note)` — same release path at 100% penalty, records `kind = 'no_show'`, and leaves the earning voided.
- `admin_set_replacement_incentive(p_booking_id, p_cents)` and `admin_adjust_driver_account(p_driver_id, p_amount_cents, p_reason)` — admin-gated.
- `driver_account_balance(p_driver_id)` — available / pending / negative totals from the ledger.
- Payout run is amended so a negative balance is netted off before a transfer, and a driver whose net is below `min_payout_cents` (or negative) is skipped and carries forward.

### Server / dispatch

- `src/server/dispatch.ts`: released bookings re-enter the fan-out immediately at batch 0 with the urgent flag, and the offer window is shortened.
- `src/functions/payouts.ts`: `runPayoutBatch` nets negative balances and incentives; refunds/disputes already void earnings — extend to leave penalties intact.
- New `src/functions/driver-account.ts` server functions for cancel preview/confirm, balance, and ledger reads (auth-middleware protected).

### Frontend

- `src/routes/{-$locale}/driver.jobs.tsx` (and job detail): "Cancel job" action with a penalty-preview dialog.
- `src/routes/{-$locale}/driver.earnings.tsx`: adds Balance card (available / negative), Reliability score card, and a ledger tab showing all entry types.
- `src/routes/{-$locale}/ops.tsx`: "Driver accounts" tab — balances, penalties (waive/adjust), no-show marking, incentive setting, reliability & suspension, and the policy settings form.
- New i18n keys for the penalty policy, ledger types, reliability and ops controls, propagated to all 7 locales.

## Out of scope for this phase

- Charging a penalty directly to the driver's card (balance offset only, as specified).
- Automatic bidding/auction on incentives — incentives are rule-based or admin-set.
