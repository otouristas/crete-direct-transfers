import { createServerFn } from "@tanstack/react-start";
import Stripe from "stripe";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { getServiceSupabase } from "@/integrations/supabase/service";
import { SITE_URL } from "@/lib/site";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("payouts_not_configured");
  return new Stripe(key);
}

export type ConnectStatus = {
  configured: boolean;
  stripeAccountId: string | null;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  instantEligible: boolean;
  payoutSchedule: "weekly" | "monthly" | "instant";
  requirementsDue: string[];
};

const EMPTY_STATUS: ConnectStatus = {
  configured: false,
  stripeAccountId: null,
  chargesEnabled: false,
  payoutsEnabled: false,
  detailsSubmitted: false,
  instantEligible: false,
  payoutSchedule: "weekly",
  requirementsDue: [],
};

/** Refresh a connected account row from Stripe and return the merged status. */
async function syncAccount(driverId: string, accountId: string): Promise<ConnectStatus> {
  const stripe = getStripe();
  const admin = getServiceSupabase();
  const account = await stripe.accounts.retrieve(accountId);
  const instantEligible = (account.capabilities?.transfers ?? "inactive") === "active";
  const requirements = account.requirements?.currently_due ?? [];

  if (admin) {
    await admin
      .from("driver_payout_accounts")
      .update({
        charges_enabled: account.charges_enabled ?? false,
        payouts_enabled: account.payouts_enabled ?? false,
        details_submitted: account.details_submitted ?? false,
        requirements_due: requirements,
        instant_eligible: instantEligible,
        country: account.country ?? null,
      })
      .eq("driver_id", driverId);
  }

  const { data } = admin
    ? await admin
        .from("driver_payout_accounts")
        .select("payout_schedule")
        .eq("driver_id", driverId)
        .maybeSingle()
    : { data: null };

  return {
    configured: true,
    stripeAccountId: accountId,
    chargesEnabled: account.charges_enabled ?? false,
    payoutsEnabled: account.payouts_enabled ?? false,
    detailsSubmitted: account.details_submitted ?? false,
    instantEligible,
    payoutSchedule: (data?.payout_schedule ?? "weekly") as ConnectStatus["payoutSchedule"],
    requirementsDue: requirements,
  };
}

/** Current Stripe Connect status for the signed-in driver. */
export const getConnectStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ConnectStatus> => {
    const admin = getServiceSupabase();
    if (!admin || !process.env.STRIPE_SECRET_KEY) return EMPTY_STATUS;

    const { data } = await admin
      .from("driver_payout_accounts")
      .select("*")
      .eq("driver_id", context.userId)
      .maybeSingle();

    if (!data?.stripe_account_id) return EMPTY_STATUS;
    return syncAccount(context.userId, data.stripe_account_id);
  });

/**
 * Create (once) an Express connected account for the driver and return a
 * hosted onboarding link. Payouts are manual so Stripe never pays a driver on
 * its own schedule — the platform releases money after the holding period.
 */
export const startDriverOnboarding = createServerFn({ method: "POST" })
  .inputValidator((d: { locale?: string }) => d)
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }): Promise<{ url: string }> => {
    const admin = getServiceSupabase();
    if (!admin) throw new Error("payouts_not_configured");
    const stripe = getStripe();

    const { data: existing } = await admin
      .from("driver_payout_accounts")
      .select("*")
      .eq("driver_id", context.userId)
      .maybeSingle();

    let accountId = existing?.stripe_account_id ?? null;

    if (!accountId) {
      const { data: profile } = await admin
        .from("profiles")
        .select("id")
        .eq("id", context.userId)
        .maybeSingle();
      if (!profile) throw new Error("profile_not_found");

      const email =
        typeof context.claims?.["email"] === "string"
          ? (context.claims["email"] as string)
          : undefined;

      const account = await stripe.accounts.create({
        type: "express",
        email,
        capabilities: {
          transfers: { requested: true },
        },
        business_type: "individual",
        settings: { payouts: { schedule: { interval: "manual" } } },
        metadata: { driver_id: context.userId },
      });
      accountId = account.id;

      const { error } = await admin.from("driver_payout_accounts").upsert(
        {
          driver_id: context.userId,
          stripe_account_id: accountId,
          country: account.country ?? null,
        },
        { onConflict: "driver_id" },
      );
      if (error) throw error;
    }

    const locale = data.locale && data.locale !== "en" ? `/${data.locale}` : "";
    const returnUrl = `${SITE_URL}${locale}/driver/earnings?onboarding=done`;
    const link = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${SITE_URL}${locale}/driver/earnings?onboarding=refresh`,
      return_url: returnUrl,
      type: "account_onboarding",
    });

    return { url: link.url };
  });

/** Stripe Express dashboard link for a driver who already onboarded. */
export const getDriverStripeDashboardLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ url: string }> => {
    const admin = getServiceSupabase();
    if (!admin) throw new Error("payouts_not_configured");
    const stripe = getStripe();

    const { data } = await admin
      .from("driver_payout_accounts")
      .select("stripe_account_id")
      .eq("driver_id", context.userId)
      .maybeSingle();
    if (!data?.stripe_account_id) throw new Error("no_payout_account");

    const login = await stripe.accounts.createLoginLink(data.stripe_account_id);
    return { url: login.url };
  });
