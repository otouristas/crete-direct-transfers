import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getServiceSupabase } from "@/integrations/supabase/service";
import { getStripe } from "@/server/stripe-connect";
import { hashCheckoutToken } from "@/server/payment-security";

export const checkoutStatus = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        bookingId: z.string().uuid(),
        sessionId: z.string().max(200).optional(),
        checkoutToken: z
          .string()
          .regex(/^[a-f0-9]{64}$/)
          .optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const admin = getServiceSupabase();
    if (!admin) return { status: "unavailable" as const, priceCents: null };
    const { data: booking } = await admin
      .from("bookings")
      .select("checkout_access_hash,stripe_checkout_session_id,payment_status,price_cents")
      .eq("id", data.bookingId)
      .maybeSingle();
    if (!booking) return { status: "unavailable" as const, priceCents: null };
    let allowed =
      !!data.checkoutToken &&
      !!booking.checkout_access_hash &&
      (await hashCheckoutToken(data.checkoutToken!)) === booking.checkout_access_hash;
    if (!allowed && data.sessionId && data.sessionId === booking.stripe_checkout_session_id) {
      const stripe = getStripe();
      if (stripe) {
        const session = await stripe.checkout.sessions.retrieve(data.sessionId);
        allowed = session.metadata?.booking_id === data.bookingId;
      }
    }
    if (!allowed) return { status: "unavailable" as const, priceCents: null };
    return {
      status: booking.payment_status === "paid" ? ("paid" as const) : ("unpaid" as const),
      priceCents: booking.price_cents,
    };
  });
