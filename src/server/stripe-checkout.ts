import Stripe from "stripe";
import { SITE_URL } from "@/lib/site";
import { getServiceSupabase } from "@/integrations/supabase/service";
import { getStripe } from "@/server/stripe-connect";
import { hashCheckoutToken, isPaidCheckout, safeCheckoutPath } from "@/server/payment-security";

export async function runCreateCheckoutSession(
  data: {
    bookingId: string;
    priceCents?: number;
    customerEmail?: string;
    description?: string;
    checkoutToken?: string;
    locale?: string;
    successPath?: string;
    cancelPath?: string;
  },
  authorization?: string | null,
) {
  const stripe = getStripe();
  const admin = getServiceSupabase();
  if (!stripe || !admin || !process.env.STRIPE_WEBHOOK_SECRET)
    throw new Error("Online payment is not configured yet. No payment has been taken.");
  const { data: booking, error } = await admin
    .from("bookings")
    .select("*")
    .eq("id", data.bookingId)
    .maybeSingle();
  if (error || !booking) throw new Error("Booking not found.");
  let permitted = false;
  if (data.checkoutToken && /^[a-f0-9]{64}$/.test(data.checkoutToken))
    permitted =
      !!booking.checkout_access_hash &&
      booking.checkout_access_hash === (await hashCheckoutToken(data.checkoutToken));
  if (!permitted && authorization?.startsWith("Bearer ")) {
    const { data: userData, error: authError } = await admin.auth.getUser(authorization.slice(7));
    const user = !authError ? userData.user : null;
    permitted =
      !!user &&
      (booking.user_id === user.id ||
        (!!user.email_confirmed_at &&
          user.email?.toLowerCase() === booking.customer_email.toLowerCase()));
  }
  if (!permitted) throw new Error("Sign in to pay for your booking.");
  if (booking.payment_status === "paid") throw new Error("This booking is already paid.");
  if (["cancelled", "completed", "no_show"].includes(booking.status))
    throw new Error("This booking cannot be paid.");
  if (booking.price_cents <= 0) throw new Error("Invalid booking price.");
  if (booking.stripe_checkout_session_id) {
    const existing = await stripe.checkout.sessions.retrieve(booking.stripe_checkout_session_id);
    if (existing.status === "open" && existing.url)
      return { skipped: false as const, url: existing.url, paymentIntentId: null };
    if (existing.status === "complete")
      throw new Error("Payment is being verified. Please check your booking in a moment.");
  }

  const localePrefix = booking.locale && booking.locale !== "en" ? `/${booking.locale}` : "";
  const success = safeCheckoutPath(
    data.successPath,
    `${localePrefix}/book/success?id=${encodeURIComponent(data.bookingId)}`,
  );
  const cancel = safeCheckoutPath(
    data.cancelPath,
    `${localePrefix}/book/success?id=${encodeURIComponent(data.bookingId)}&cancelled=1`,
  );

  // Leave payment methods automatic so Apple Pay / Google Pay / cards appear when
  // enabled in the Stripe Dashboard (+ Apple Pay domain verification).
  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      integration_identifier:
        "transferaround_" +
        booking.id
          .replaceAll("-", "")
          .slice(0, 8)
          .replace(/[0-9a-f]/g, (c) => String.fromCharCode(97 + parseInt(c, 16))),
      customer_email: booking.customer_email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: booking.currency.toLowerCase(),
            unit_amount: booking.price_cents,
            product_data: {
              name: "TransferAround private transfer",
              description: [booking.pickup_address, booking.dropoff_address]
                .filter(Boolean)
                .join(" → ")
                .slice(0, 500),
            },
          },
        },
      ],
      metadata: { booking_id: data.bookingId },
      payment_intent_data: {
        metadata: { booking_id: data.bookingId },
        transfer_group: `booking_${data.bookingId}`,
      },
      success_url: `${SITE_URL}${success}${success.includes("?") ? "&" : "?"}session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}${cancel}`,
    },
    {
      idempotencyKey: `booking_checkout_${booking.id}_${booking.stripe_checkout_version}_${booking.stripe_checkout_session_id || "initial"}`,
    },
  );
  const { error: persistError } = await admin
    .from("bookings")
    .update({
      stripe_checkout_session_id: session.id,
      stripe_checkout_session_url: session.url,
      stripe_checkout_status: "open",
    })
    .eq("id", booking.id);
  if (persistError) throw new Error("Could not prepare payment. Please try again.");

  return {
    skipped: false as const,
    url: session.url,
    paymentIntentId:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : (session.payment_intent?.id ?? null),
  };
}

/** Verify Stripe signature and accept only settled Checkout payments. */
export async function handleStripeWebhook(rawBody: string, signature: string | null) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) throw new Error("webhook_unavailable");
  if (!signature) throw new Error("missing_signature");
  const event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  if (
    !["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(event.type)
  )
    return null;
  const session = event.data.object as Stripe.Checkout.Session;
  if (!isPaidCheckout(session)) return null;
  const pi =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;
  if (!pi) return null;
  return {
    eventId: event.id,
    eventType: event.type,
    bookingId: session.metadata!.booking_id,
    paymentIntentId: pi,
    sessionId: session.id,
    amountTotal: session.amount_total!,
    currency: session.currency!,
    livemode: event.livemode,
  };
}
