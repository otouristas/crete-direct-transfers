import { getServiceSupabase } from "@/integrations/supabase/service";
import { getStripe } from "@/server/stripe-connect";

/** Database-approved cash refunds only; pending reviews and credits never charge Stripe. */
export async function settleApprovedRefunds() {
  const admin = getServiceSupabase();
  const stripe = getStripe();
  if (!admin || !stripe) return;
  const { data: bookings, error } = await admin
    .from("bookings")
    .select("*")
    .eq("refund_status", "approved")
    .eq("payment_status", "paid")
    .limit(10);
  if (error) throw new Error("Could not read approved refunds");
  for (const booking of bookings || []) {
    const amount = booking.refund_amount_cents;
    if (!booking.stripe_payment_intent_id || !amount || amount < 1 || amount > booking.price_cents)
      continue;
    if (booking.stripe_transfer_id) {
      const reversal = Math.round(
        ((booking.carrier_payout_cents || 0) * amount) / booking.price_cents,
      );
      if (reversal > 0)
        await stripe.transfers.createReversal(
          booking.stripe_transfer_id,
          { amount: reversal },
          { idempotencyKey: `booking_reversal_${booking.id}_${amount}` },
        );
    }
    await stripe.refunds.create(
      {
        payment_intent: booking.stripe_payment_intent_id,
        amount,
        metadata: { booking_id: booking.id },
      },
      { idempotencyKey: `booking_refund_${booking.id}_${amount}` },
    );
    const { error: writeError } = await admin
      .from("bookings")
      .update({
        refund_status: "paid",
        payment_status: amount === booking.price_cents ? "refunded" : "partially_refunded",
      })
      .eq("id", booking.id)
      .eq("refund_status", "approved");
    if (writeError) throw new Error("Could not record refund; safe to retry");
  }
}
