import { createServerFn } from "@tanstack/react-start";
import Stripe from "stripe";
import { getRequest } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { getServiceSupabase } from "@/integrations/supabase/service";
import { hashCheckoutToken, isPaidCheckout, safeCheckoutPath } from "@/server/payment-security";
import { SITE_URL } from "@/lib/site";
import {
  createConnectAccountLink,
  createOrGetDriverConnectAccount,
  createOrGetPartnerConnectAccount,
  getStripe,
  refreshConnectOnboardingStatus,
  runCarrierPayout,
} from "@/server/stripe-connect";

import { runCreateCheckoutSession } from "@/server/stripe-checkout";

export const createCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      bookingId: string;
      priceCents?: number;
      customerEmail?: string;
      description?: string;
      locale?: string;
      successPath?: string;
      cancelPath?: string;
      checkoutToken?: string;
    }) => d,
  )
  .handler(async ({ data }) =>
    runCreateCheckoutSession(data, getRequest().headers.get("authorization")),
  );

export const refundStripePayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { paymentIntentId: string; amountCents?: number; bookingId: string }) => d)
  .handler(async ({ data, context }) => {
    const { data: profile } = await context.supabase
      .from("profiles")
      .select("role")
      .eq("id", context.userId)
      .single();
    if (profile?.role !== "admin") throw new Error("Forbidden");
    const admin = getServiceSupabase();
    if (!admin) throw new Error("Payment service unavailable");
    const { data: booking } = await admin
      .from("bookings")
      .select("stripe_payment_intent_id,price_cents")
      .eq("id", data.bookingId)
      .single();
    if (
      !booking?.stripe_payment_intent_id ||
      booking.stripe_payment_intent_id !== data.paymentIntentId ||
      (data.amountCents != null &&
        (data.amountCents <= 0 || data.amountCents > booking.price_cents))
    )
      throw new Error("Invalid refund");
    const stripe = getStripe();
    if (!stripe) return { skipped: true as const, refundId: null as string | null };

    const refund = await stripe.refunds.create({
      payment_intent: data.paymentIntentId,
      amount: data.amountCents,
      metadata: { booking_id: data.bookingId },
    });

    return { skipped: false as const, refundId: refund.id };
  });

export const startDriverConnectOnboarding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (d: { driverId: string; email?: string | null; market?: string | null; locale?: string }) => d,
  )
  .handler(async ({ data, context }) => {
    if (data.driverId !== context.userId) throw new Error("Forbidden");
    const { data: profile } = await context.supabase
      .from("profiles")
      .select("role")
      .eq("id", context.userId)
      .single();
    if (profile?.role !== "driver") throw new Error("Forbidden");
    const { accountId, skipped } = await createOrGetDriverConnectAccount(data);
    if (skipped || !accountId) return { skipped: true as const, url: null as string | null };
    const link = await createConnectAccountLink({
      accountId,
      locale: data.locale,
      kind: "driver",
    });
    return { skipped: link.skipped, url: link.url };
  });

export const startPartnerConnectOnboarding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (d: { partnerId: string; email?: string | null; market?: string | null; locale?: string }) => d,
  )
  .handler(async ({ data, context }) => {
    const { data: allowed } = await context.supabase.rpc("is_partner_dispatcher", {
      p_partner_id: data.partnerId,
    });
    if (!allowed) throw new Error("Forbidden");
    const { accountId, skipped } = await createOrGetPartnerConnectAccount(data);
    if (skipped || !accountId) return { skipped: true as const, url: null as string | null };
    const link = await createConnectAccountLink({
      accountId,
      locale: data.locale,
      kind: "partner",
    });
    return { skipped: link.skipped, url: link.url };
  });

export const syncConnectOnboarding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { kind: "driver" | "partner"; id: string }) => d)
  .handler(async ({ data, context }) => {
    if (data.kind === "driver" && data.id !== context.userId) throw new Error("Forbidden");
    if (data.kind === "partner") {
      const { data: ok } = await context.supabase.rpc("is_partner_dispatcher", {
        p_partner_id: data.id,
      });
      if (!ok) throw new Error("Forbidden");
    }
    return refreshConnectOnboardingStatus(data);
  });

export const payoutCarrierForBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { bookingId: string }) => d)
  .handler(async ({ data, context }) => {
    const { data: booking } = await context.supabase
      .from("bookings")
      .select("id,driver_id")
      .eq("id", data.bookingId)
      .maybeSingle();
    const { data: isAdmin } = await context.supabase.rpc("is_admin");
    if (!booking || (!isAdmin && booking.driver_id !== context.userId))
      throw new Error("Forbidden");
    return runCarrierPayout(data.bookingId);
  });
