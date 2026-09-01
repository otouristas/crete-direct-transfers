import { createServerFn } from "@tanstack/react-start";
import Stripe from "stripe";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { getServiceSupabase } from "@/integrations/supabase/service";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("payouts_not_configured");
  return new Stripe(key);
}

export type PayoutRunResult = {
  drivers: number;
  transfers: number;
  amountCents: number;
  matured: number;
  failures: { driverId: string; reason: string }[];
};

type Schedule = "weekly" | "monthly" | "instant";

/** Should a driver on this cadence be paid in this run? */
function isDue(schedule: Schedule, now: Date): boolean {
  if (schedule === "instant") return true;
  if (schedule === "weekly") return now.getUTCDay() === 1; // Monday
  return now.getUTCDate() === 1; // monthly, first of month
}

/**
 * Mature held earnings, then pay every driver who has available money.
 * `force` ignores the cadence check (used by the admin "run now" button).
 */
export async function runPayoutBatch(options: {
  force?: boolean;
  driverId?: string;
}): Promise<PayoutRunResult> {
  const admin = getServiceSupabase();
  if (!admin) throw new Error("payouts_not_configured");
  const stripe = getStripe();
  const now = new Date();

  const { data: maturedCount } = await admin.rpc("mature_held_earnings");
  const matured = typeof maturedCount === "number" ? maturedCount : 0;

  const { data: settings } = await admin
    .from("platform_settings")
    .select("min_payout_cents")
    .maybeSingle();
  const minPayout = settings?.min_payout_cents ?? 0;

  let query = admin
    .from("driver_earnings")
    .select("id, driver_id, net_cents, currency")
    .eq("status", "available")
    .is("payout_id", null);
  if (options.driverId) query = query.eq("driver_id", options.driverId);

  const { data: earnings, error } = await query;
  if (error) throw error;

  const groups = new Map<string, { ids: string[]; amount: number; currency: string }>();
  for (const row of earnings ?? []) {
    const group = groups.get(row.driver_id) ?? { ids: [], amount: 0, currency: row.currency };
    group.ids.push(row.id);
    group.amount += row.net_cents;
    groups.set(row.driver_id, group);
  }

  const result: PayoutRunResult = {
    drivers: groups.size,
    transfers: 0,
    amountCents: 0,
    matured,
    failures: [],
  };

  for (const [driverId, group] of groups) {
    const { data: account } = await admin
      .from("driver_payout_accounts")
      .select("stripe_account_id, payouts_enabled, payout_schedule")
      .eq("driver_id", driverId)
      .maybeSingle();

    if (!account?.stripe_account_id || !account.payouts_enabled) {
      result.failures.push({ driverId, reason: "payout_account_not_ready" });
      continue;
    }
    const schedule = (account.payout_schedule ?? "weekly") as Schedule;
    if (!options.force && !isDue(schedule, now)) continue;
    if (group.amount < minPayout) continue;

    const { data: payout, error: payoutError } = await admin
      .from("driver_payouts")
      .insert({
        driver_id: driverId,
        amount_cents: group.amount,
        currency: group.currency,
        method: schedule === "instant" ? "instant" : "standard",
        period_end: now.toISOString(),
      })
      .select("*")
      .single();
    if (payoutError || !payout) {
      result.failures.push({ driverId, reason: "payout_record_failed" });
      continue;
    }

    // Claim the lines first so a retry can never pay them twice.
    await admin
      .from("driver_earnings")
      .update({ payout_id: payout.id })
      .in("id", group.ids)
      .is("payout_id", null);

    try {
      const transfer = await stripe.transfers.create(
        {
          amount: group.amount,
          currency: group.currency,
          destination: account.stripe_account_id,
          transfer_group: `payout_${payout.id}`,
          metadata: { payout_id: payout.id, driver_id: driverId },
        },
        { idempotencyKey: `payout:${payout.id}` },
      );

      await admin
        .from("driver_payouts")
        .update({ status: "paid", stripe_transfer_id: transfer.id })
        .eq("id", payout.id);
      await admin
        .from("driver_earnings")
        .update({ status: "paid", paid_at: now.toISOString() })
        .eq("payout_id", payout.id);

      result.transfers += 1;
      result.amountCents += group.amount;
    } catch (err) {
      const reason = err instanceof Error ? err.message : "transfer_failed";
      await admin
        .from("driver_payouts")
        .update({ status: "failed", failure_reason: reason })
        .eq("id", payout.id);
      await admin
        .from("driver_earnings")
        .update({ payout_id: null })
        .eq("payout_id", payout.id)
        .neq("status", "paid");
      result.failures.push({ driverId, reason });
    }
  }

  return result;
}

async function assertAdmin(context: { supabase: ReturnType<typeof getServiceSupabase> }) {
  const client = context.supabase;
  if (!client) throw new Error("forbidden");
  const { data, error } = await client.rpc("is_admin");
  if (error || data !== true) throw new Error("forbidden");
}

/** Admin: run a payout batch immediately. */
export const adminRunPayouts = createServerFn({ method: "POST" })
  .inputValidator((d: { driverId?: string }) => d)
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }): Promise<PayoutRunResult> => {
    await assertAdmin(context as never);
    return runPayoutBatch({ force: true, driverId: data.driverId });
  });

/** Admin: refund a booking (full or partial) and void the driver's earnings. */
export const adminRefundBooking = createServerFn({ method: "POST" })
  .inputValidator((d: { bookingId: string; amountCents?: number }) => d)
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }): Promise<{ ok: true; refundId: string }> => {
    await assertAdmin(context as never);
    const admin = getServiceSupabase();
    if (!admin) throw new Error("payouts_not_configured");
    const stripe = getStripe();

    const { data: booking, error } = await admin
      .from("bookings")
      .select("id, price_cents, stripe_payment_intent_id, payment_status")
      .eq("id", data.bookingId)
      .maybeSingle();
    if (error || !booking) throw new Error("booking_not_found");
    if (!booking.stripe_payment_intent_id) throw new Error("no_payment_to_refund");

    const amount = data.amountCents ?? booking.price_cents;
    const refund = await stripe.refunds.create(
      { payment_intent: booking.stripe_payment_intent_id, amount },
      { idempotencyKey: `refund:${booking.id}:${amount}` },
    );

    await admin
      .from("bookings")
      .update({
        refund_status: "refunded",
        refund_amount_cents: amount,
        refund_percent: Math.round((amount / booking.price_cents) * 100),
        payment_status: amount >= booking.price_cents ? "refunded" : booking.payment_status,
      })
      .eq("id", booking.id);

    await admin
      .from("driver_earnings")
      .update({ status: "voided", note: "refunded by admin" })
      .eq("booking_id", booking.id)
      .in("status", ["pending", "held", "available"]);

    return { ok: true, refundId: refund.id };
  });
