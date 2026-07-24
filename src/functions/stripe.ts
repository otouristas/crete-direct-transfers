import { createServerFn } from "@tanstack/react-start";
import Stripe from "stripe";
import { SITE_URL } from "@/lib/site";

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export async function runCreateCheckoutSession(data: {
  bookingId: string;
  priceCents: number;
  customerEmail: string;
  description: string;
  locale?: string;
  successPath?: string;
  cancelPath?: string;
}) {
  const stripe = getStripe();
  if (!stripe) {
    return { skipped: true as const, url: null as string | null, paymentIntentId: null as string | null };
  }

  const localePrefix = data.locale && data.locale !== "en" ? `/${data.locale}` : "";
  const success =
    data.successPath ??
    `${localePrefix}/book/success?id=${encodeURIComponent(data.bookingId)}`;
  const cancel =
    data.cancelPath ?? `${localePrefix}/account/bookings/${encodeURIComponent(data.bookingId)}`;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: data.customerEmail,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: data.priceCents,
          product_data: {
            name: "TransferAround private transfer",
            description: data.description,
          },
        },
      },
    ],
    metadata: { booking_id: data.bookingId },
    success_url: `${SITE_URL}${success}${success.includes("?") ? "&" : "?"}paid=1`,
    cancel_url: `${SITE_URL}${cancel}`,
  });

  return {
    skipped: false as const,
    url: session.url,
    paymentIntentId:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null,
  };
}

export const createCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      bookingId: string;
      priceCents: number;
      customerEmail: string;
      description: string;
      locale?: string;
      successPath?: string;
      cancelPath?: string;
    }) => d,
  )
  .handler(async ({ data }) => runCreateCheckoutSession(data));

export const refundStripePayment = createServerFn({ method: "POST" })
  .inputValidator(
    (d: { paymentIntentId: string; amountCents?: number; bookingId: string }) => d,
  )
  .handler(async ({ data }) => {
    const stripe = getStripe();
    if (!stripe) return { skipped: true as const, refundId: null as string | null };

    const refund = await stripe.refunds.create({
      payment_intent: data.paymentIntentId,
      amount: data.amountCents,
      metadata: { booking_id: data.bookingId },
    });

    return { skipped: false as const, refundId: refund.id };
  });

/** Verify webhook and return booking payment update instructions. */
export async function handleStripeWebhook(
  rawBody: string,
  signature: string | null,
): Promise<{ bookingId: string; paymentIntentId: string } | null> {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret || !signature) return null;

  const event = stripe.webhooks.constructEvent(rawBody, signature, secret);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.booking_id;
    const pi =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;
    if (!bookingId || !pi) return null;
    return { bookingId, paymentIntentId: pi };
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const bookingId = pi.metadata?.booking_id;
    if (!bookingId) return null;
    return { bookingId, paymentIntentId: pi.id };
  }

  return null;
}
