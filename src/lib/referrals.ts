import { supabase } from "@/integrations/supabase/client";

/** Attach a partner referral code to a booking when present. */
export async function attachReferral(bookingId: string, code: string | undefined | null) {
  if (!code?.trim()) return;
  const normalized = code.trim().toUpperCase();
  const { data: partner } = await supabase
    .from("partner_referrals")
    .select("id, commission_percent")
    .eq("code", normalized)
    .eq("active", true)
    .maybeSingle();
  if (!partner) return;

  const { data: booking } = await supabase
    .from("bookings")
    .select("price_cents")
    .eq("id", bookingId)
    .maybeSingle();
  if (!booking) return;

  const commission = Math.round((booking.price_cents * Number(partner.commission_percent)) / 100);

  await supabase.from("booking_referrals").insert({
    booking_id: bookingId,
    partner_id: partner.id,
    commission_cents: commission,
    status: "pending",
  });
}
