import { createServerFn } from "@tanstack/react-start";
import Stripe from "stripe";
import { SITE_URL } from "@/lib/site";
import { getServiceSupabase } from "@/integrations/supabase/service";

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export async function runCreateCheckoutSession(data: { bookingId: string; locale?: string }) {
  const admin = getServiceSupabase();
  if (!admin) throw new Error("Checkout is unavailable: booking service is not configured");

  const stripe = getStripe();
  if (!stripe) {
    return {
      skipped: true as const,
      url: null as string | null,
      paymentIntentId: null as string | null,
    };
  }

  for (let pass = 0; pass < 3; pass += 1) {
    const { data: booking, error } = await admin
      .from("bookings")
      .select(
        "id, customer_email, price_cents, currency, payment_status, pickup_address, dropoff_address, route_slug, locale, stripe_checkout_session_id, stripe_checkout_session_url, stripe_checkout_status, stripe_checkout_version",
      )
      .eq("id", data.bookingId)
      .single();

    if (error || !booking) throw new Error("Booking not found");
    if (booking.payment_status === "paid") throw new Error("Booking is already paid");
    if (!Number.isInteger(booking.price_cents) || booking.price_cents <= 0) {
      throw new Error("Booking has an invalid price");
    }

    if (booking.stripe_checkout_session_id) {
      const existing = await stripe.checkout.sessions.retrieve(booking.stripe_checkout_session_id);
      if (existing.status === "open" && existing.url) {
        return { skipped: false as const, url: existing.url, paymentIntentId: null };
      }
      if (existing.status === "complete") throw new Error("Checkout is already complete");

      const { data: released } = await admin
        .from("bookings")
        .update({
          stripe_checkout_session_id: null,
          stripe_checkout_session_url: null,
          stripe_checkout_status: "expired",
          stripe_checkout_version: booking.stripe_checkout_version + 1,
        })
        .eq("id", booking.id)
        .eq("stripe_checkout_session_id", booking.stripe_checkout_session_id)
        .select("id")
        .maybeSingle();
      if (released) continue;
      continue;
    }

    const locale = data.locale ?? booking.locale;
    const localePrefix = locale !== "en" ? `/${locale}` : "";
    const success = `${localePrefix}/book/success?id=${encodeURIComponent(data.bookingId)}`;
    const cancel = `${localePrefix}/account/bookings/${encodeURIComponent(data.bookingId)}`;
    const description =
      [booking.pickup_address, booking.dropoff_address].filter(Boolean).join(" → ") ||
      booking.route_slug;
    const idempotencyKey = `booking:${booking.id}:checkout:${booking.stripe_checkout_version}`;

    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        customer_email: booking.customer_email,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: booking.currency.toLowerCase(),
              unit_amount: booking.price_cents,
              product_data: { name: "TransferAround private transfer", description },
            },
          },
        ],
        metadata: { booking_id: booking.id },
        payment_intent_data: { metadata: { booking_id: booking.id } },
        success_url: `${SITE_URL}${success}${success.includes("?") ? "&" : "?"}paid=1`,
        cancel_url: `${SITE_URL}${cancel}`,
      },
      { idempotencyKey },
    );

    const { error: persistError } = await admin
      .from("bookings")
      .update({
        stripe_checkout_session_id: session.id,
        stripe_checkout_session_url: session.url,
        stripe_checkout_status: session.status,
      })
      .eq("id", booking.id)
      .eq("stripe_checkout_version", booking.stripe_checkout_version);
    if (persistError) throw persistError;

    return { skipped: false as const, url: session.url, paymentIntentId: null };
  }

  throw new Error("Could not obtain a stable checkout session");
}

export const createCheckoutSession = createServerFn({ method: "POST" })
  .validator((d: { bookingId: string; locale?: string }) => d)
  .handler(async ({ data }) => runCreateCheckoutSession(data));

/** Verify, deduplicate, validate, and apply a Stripe Checkout webhook. */
export async function handleStripeWebhook(
  rawBody: string,
  signature: string | null,
): Promise<{ received: true; ignored: boolean; duplicate?: boolean }> {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret || !signature) throw new Error("Stripe webhook is not configured");

  const event = stripe.webhooks.constructEvent(rawBody, signature, secret);

  const connectHandled = await handleConnectEvent(event);
  if (connectHandled) return { received: true, ignored: false };

  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.async_payment_succeeded"
  ) {
    return { received: true, ignored: true };
  }

  const key = process.env.STRIPE_SECRET_KEY ?? "";
  if (event.livemode !== key.startsWith("sk_live_")) throw new Error("Stripe mode mismatch");

  const session = event.data.object as Stripe.Checkout.Session;
  const bookingId = session.metadata?.booking_id;
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;
  if (
    !bookingId ||
    !paymentIntentId ||
    session.payment_status !== "paid" ||
    session.amount_total == null ||
    !session.currency
  ) {
    throw new Error("Stripe checkout event is incomplete");
  }

  const admin = getServiceSupabase();
  if (!admin) throw new Error("Booking service is not configured");
  const { data, error } = await admin.rpc("process_stripe_checkout_event", {
    p_event_id: event.id,
    p_event_type: event.type,
    p_booking_id: bookingId,
    p_session_id: session.id,
    p_payment_intent_id: paymentIntentId,
    p_amount_total: session.amount_total,
    p_currency: session.currency,
    p_livemode: event.livemode,
  });
  if (error) throw error;
  const result = data as { ok?: boolean; duplicate?: boolean; error?: string };
  if (!result.ok) throw new Error(`Stripe payment validation failed: ${result.error}`);
  return { received: true, ignored: false, duplicate: result.duplicate === true };
}

/**
 * Connect + payout lifecycle events. Returns true when the event was handled
 * here so the checkout path can ignore it.
 */
async function handleConnectEvent(event: Stripe.Event): Promise<boolean> {
  const admin = getServiceSupabase();
  if (!admin) return false;

  if (event.type === "account.updated") {
    const account = event.data.object as Stripe.Account;
    await admin
      .from("driver_payout_accounts")
      .update({
        charges_enabled: account.charges_enabled ?? false,
        payouts_enabled: account.payouts_enabled ?? false,
        details_submitted: account.details_submitted ?? false,
        requirements_due: account.requirements?.currently_due ?? [],
        instant_eligible: (account.capabilities?.transfers ?? "inactive") === "active",
        country: account.country ?? null,
      })
      .eq("stripe_account_id", account.id);
    return true;
  }

  // Transfer lifecycle names vary by pinned API version; compare as strings.
  const eventName: string = event.type;
  if (eventName === "transfer.paid" || eventName === "transfer.failed") {
    const transfer = event.data.object as Stripe.Transfer;
    const payoutId = transfer.metadata?.payout_id;
    if (!payoutId) return true;
    const paid = eventName === "transfer.paid";
    await admin
      .from("driver_payouts")
      .update({
        status: paid ? "paid" : "failed",
        failure_reason: paid ? null : "transfer_failed",
      })
      .eq("id", payoutId);
    if (!paid) {
      await admin
        .from("driver_earnings")
        .update({ payout_id: null, status: "available" })
        .eq("payout_id", payoutId);
    }
    return true;
  }

  if (event.type === "charge.dispute.created" || event.type === "charge.refunded") {
    const object = event.data.object as Stripe.Dispute | Stripe.Charge;
    const paymentIntent =
      typeof object.payment_intent === "string"
        ? object.payment_intent
        : (object.payment_intent?.id ?? null);
    if (!paymentIntent) return true;

    const { data: booking } = await admin
      .from("bookings")
      .select("id")
      .eq("stripe_payment_intent_id", paymentIntent)
      .maybeSingle();
    if (!booking) return true;

    await admin
      .from("driver_earnings")
      .update({
        status: event.type === "charge.dispute.created" ? "disputed" : "voided",
        note: event.type === "charge.dispute.created" ? "stripe dispute" : "stripe refund",
      })
      .eq("booking_id", booking.id)
      .in("status", ["pending", "held", "available"]);
    return true;
  }

  return false;
}
