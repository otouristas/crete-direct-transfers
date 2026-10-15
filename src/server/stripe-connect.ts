import Stripe from "stripe";
import { SITE_URL } from "@/lib/site";
import { getServiceSupabase } from "@/integrations/supabase/service";
import { splitFareCents } from "@/lib/stripe-fees";

export { PLATFORM_FEE_PERCENT, splitFareCents } from "@/lib/stripe-fees";

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

function marketCountry(market: string | null | undefined): string {
  if (market === "spain") return "ES";
  if (market === "italy") return "IT";
  return "GR";
}

function connectUrls(locale?: string) {
  const prefix = locale && locale !== "en" ? `/${locale}` : "";
  const refresh =
    process.env.STRIPE_CONNECT_REFRESH_URL ??
    `${SITE_URL}${prefix}/driver/earnings?connect=refresh`;
  const ret =
    process.env.STRIPE_CONNECT_RETURN_URL ?? `${SITE_URL}${prefix}/driver/earnings?connect=return`;
  return { refresh, return: ret };
}

export async function createOrGetDriverConnectAccount(input: {
  driverId: string;
  email?: string | null;
  market?: string | null;
}): Promise<{ accountId: string; skipped: boolean }> {
  const stripe = getStripe();
  if (!stripe) return { accountId: "", skipped: true };

  const admin = getServiceSupabase();
  if (!admin) throw new Error("Service role required for Connect onboarding");

  const { data: profile } = await admin
    .from("driver_profiles")
    .select("stripe_account_id, stripe_onboarding_complete")
    .eq("id", input.driverId)
    .maybeSingle();

  if (profile?.stripe_account_id) {
    return { accountId: profile.stripe_account_id, skipped: false };
  }

  const account = await stripe.accounts.create({
    type: "express",
    country: marketCountry(input.market),
    email: input.email ?? undefined,
    capabilities: {
      transfers: { requested: true },
    },
    business_type: "individual",
    metadata: { driver_id: input.driverId },
  });

  await admin
    .from("driver_profiles")
    .update({
      stripe_account_id: account.id,
      stripe_onboarding_complete: false,
    })
    .eq("id", input.driverId);

  return { accountId: account.id, skipped: false };
}

export async function createOrGetPartnerConnectAccount(input: {
  partnerId: string;
  email?: string | null;
  market?: string | null;
}): Promise<{ accountId: string; skipped: boolean }> {
  const stripe = getStripe();
  if (!stripe) return { accountId: "", skipped: true };

  const admin = getServiceSupabase();
  if (!admin) throw new Error("Service role required for Connect onboarding");

  const { data: partner } = await admin
    .from("partners")
    .select("stripe_account_id, dispatch_email, market")
    .eq("id", input.partnerId)
    .maybeSingle();

  if (partner?.stripe_account_id) {
    return { accountId: partner.stripe_account_id, skipped: false };
  }

  const account = await stripe.accounts.create({
    type: "express",
    country: marketCountry(input.market ?? partner?.market),
    email: input.email ?? partner?.dispatch_email ?? undefined,
    capabilities: {
      transfers: { requested: true },
    },
    business_type: "company",
    metadata: { partner_id: input.partnerId },
  });

  await admin
    .from("partners")
    .update({
      stripe_account_id: account.id,
      stripe_onboarding_complete: false,
    })
    .eq("id", input.partnerId);

  return { accountId: account.id, skipped: false };
}

export async function createConnectAccountLink(input: {
  accountId: string;
  locale?: string;
  kind?: "driver" | "partner";
}): Promise<{ url: string | null; skipped: boolean }> {
  const stripe = getStripe();
  if (!stripe) return { url: null, skipped: true };

  const prefix = input.locale && input.locale !== "en" ? `/${input.locale}` : "";
  const urls = connectUrls(input.locale);
  const refresh =
    input.kind === "partner"
      ? (process.env.STRIPE_CONNECT_REFRESH_URL ?? `${SITE_URL}${prefix}/partner?connect=refresh`)
      : urls.refresh;
  const ret =
    input.kind === "partner"
      ? (process.env.STRIPE_CONNECT_RETURN_URL ?? `${SITE_URL}${prefix}/partner?connect=return`)
      : urls.return;

  const link = await stripe.accountLinks.create({
    account: input.accountId,
    refresh_url: refresh,
    return_url: ret,
    type: "account_onboarding",
  });

  return { url: link.url, skipped: false };
}

/** After Express return URL — sync charges_enabled / details_submitted. */
export async function refreshConnectOnboardingStatus(input: {
  kind: "driver" | "partner";
  id: string;
}): Promise<{ complete: boolean; skipped: boolean }> {
  const stripe = getStripe();
  if (!stripe) return { complete: false, skipped: true };
  const admin = getServiceSupabase();
  if (!admin) throw new Error("Service role required");

  if (input.kind === "driver") {
    const { data } = await admin
      .from("driver_profiles")
      .select("stripe_account_id")
      .eq("id", input.id)
      .maybeSingle();
    if (!data?.stripe_account_id) return { complete: false, skipped: false };
    const acct = await stripe.accounts.retrieve(data.stripe_account_id);
    const complete = Boolean(acct.charges_enabled && acct.details_submitted);
    await admin
      .from("driver_profiles")
      .update({ stripe_onboarding_complete: complete })
      .eq("id", input.id);
    return { complete, skipped: false };
  }

  const { data } = await admin
    .from("partners")
    .select("stripe_account_id")
    .eq("id", input.id)
    .maybeSingle();
  if (!data?.stripe_account_id) return { complete: false, skipped: false };
  const acct = await stripe.accounts.retrieve(data.stripe_account_id);
  const complete = Boolean(acct.charges_enabled && acct.details_submitted);
  await admin.from("partners").update({ stripe_onboarding_complete: complete }).eq("id", input.id);
  return { complete, skipped: false };
}

type CarrierTarget = {
  accountId: string;
  kind: "partner" | "driver";
  id: string;
};

async function resolveCarrierAccount(booking: {
  partner_id: string | null;
  driver_id: string | null;
}): Promise<CarrierTarget | null> {
  const admin = getServiceSupabase();
  if (!admin) return null;

  if (booking.partner_id) {
    const { data: partner } = await admin
      .from("partners")
      .select("id, stripe_account_id, stripe_onboarding_complete")
      .eq("id", booking.partner_id)
      .maybeSingle();
    if (partner?.stripe_account_id && partner.stripe_onboarding_complete) {
      return { accountId: partner.stripe_account_id, kind: "partner", id: partner.id };
    }
  }

  if (booking.driver_id) {
    const { data: driver } = await admin
      .from("driver_profiles")
      .select("id, stripe_account_id, stripe_onboarding_complete")
      .eq("id", booking.driver_id)
      .maybeSingle();
    if (driver?.stripe_account_id && driver.stripe_onboarding_complete) {
      return { accountId: driver.stripe_account_id, kind: "driver", id: driver.id };
    }
    // Prefer partner of driver if driver not onboarded
    const { data: linked } = await admin
      .from("driver_profiles")
      .select("partner_id")
      .eq("id", booking.driver_id)
      .maybeSingle();
    if (linked?.partner_id) {
      const { data: partner } = await admin
        .from("partners")
        .select("id, stripe_account_id, stripe_onboarding_complete")
        .eq("id", linked.partner_id)
        .maybeSingle();
      if (partner?.stripe_account_id && partner.stripe_onboarding_complete) {
        return { accountId: partner.stripe_account_id, kind: "partner", id: partner.id };
      }
    }
  }

  return null;
}

/**
 * After trip completed + paid: transfer 85% to carrier Connect account.
 * Idempotent when stripe_transfer_id already set.
 */
export async function runCarrierPayout(bookingId: string): Promise<{
  ok: boolean;
  skipped?: boolean;
  payoutStatus: string;
  transferId?: string | null;
  error?: string;
}> {
  const stripe = getStripe();
  const admin = getServiceSupabase();
  if (!stripe || !admin) {
    return {
      ok: false,
      skipped: true,
      payoutStatus: "pending",
      error: "stripe_or_service_unavailable",
    };
  }

  const { data: booking, error } = await admin
    .from("bookings")
    .select(
      "id, status, payment_status, price_cents, currency, partner_id, driver_id, stripe_transfer_id, payout_status",
    )
    .eq("id", bookingId)
    .maybeSingle();

  if (error || !booking) {
    return { ok: false, payoutStatus: "failed", error: error?.message ?? "booking_not_found" };
  }

  if (booking.stripe_transfer_id || booking.payout_status === "transferred") {
    return {
      ok: true,
      payoutStatus: "transferred",
      transferId: booking.stripe_transfer_id,
    };
  }

  if (booking.status !== "completed") {
    return { ok: false, payoutStatus: booking.payout_status, error: "not_completed" };
  }
  if (booking.payment_status !== "paid" && booking.payment_status !== "deposit_paid") {
    return { ok: false, payoutStatus: booking.payout_status, error: "not_paid" };
  }

  const { platformFeeCents, carrierPayoutCents } = splitFareCents(booking.price_cents);
  const carrier = await resolveCarrierAccount(booking);

  if (!carrier) {
    await admin
      .from("bookings")
      .update({
        platform_fee_cents: platformFeeCents,
        carrier_payout_cents: carrierPayoutCents,
        payout_status: "skipped_no_account",
      })
      .eq("id", bookingId);
    return { ok: true, payoutStatus: "skipped_no_account" };
  }

  try {
    const transfer = await stripe.transfers.create(
      {
        amount: carrierPayoutCents,
        currency: (booking.currency || "eur").toLowerCase(),
        destination: carrier.accountId,
        transfer_group: `booking_${bookingId}`,
        metadata: {
          booking_id: bookingId,
          carrier_kind: carrier.kind,
          carrier_id: carrier.id,
          platform_fee_cents: String(platformFeeCents),
        },
      },
      { idempotencyKey: `carrier_payout_${bookingId}` },
    );

    await admin
      .from("bookings")
      .update({
        platform_fee_cents: platformFeeCents,
        carrier_payout_cents: carrierPayoutCents,
        stripe_transfer_id: transfer.id,
        payout_status: "transferred",
      })
      .eq("id", bookingId);

    return { ok: true, payoutStatus: "transferred", transferId: transfer.id };
  } catch (e) {
    const message = e instanceof Error ? e.message : "transfer_failed";
    await admin
      .from("bookings")
      .update({
        platform_fee_cents: platformFeeCents,
        carrier_payout_cents: carrierPayoutCents,
        payout_status: "failed",
      })
      .eq("id", bookingId);
    return { ok: false, payoutStatus: "failed", error: message };
  }
}
