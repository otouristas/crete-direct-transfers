import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type AccountEntry = Tables<"driver_account_entries">;
export type DriverCancellation = Tables<"driver_cancellations">;
export type DriverReliability = Tables<"driver_reliability">;
export type DriverAccountSummary = Tables<"driver_account_summary">;

export type AccountEntryType = AccountEntry["entry_type"];

export type AccountBalance = {
  available_cents: number;
  pending_cents: number;
  negative_cents: number;
  penalties_cents: number;
  incentives_cents: number;
  paid_cents: number;
};

export const EMPTY_BALANCE: AccountBalance = {
  available_cents: 0,
  pending_cents: 0,
  negative_cents: 0,
  penalties_cents: 0,
  incentives_cents: 0,
  paid_cents: 0,
};

export type CancellationPreview = {
  hours_before_pickup: number;
  tier: "free" | "tier_72" | "tier_48" | "tier_24" | "no_show";
  penalty_bps: number;
  net_cents: number;
  penalty_cents: number;
  currency: string;
};

/** Ledger lines for the signed-in driver (RLS scopes this to their own). */
export const myAccountLedgerQuery = (driverId: string) =>
  queryOptions({
    queryKey: ["driver-ledger", driverId],
    queryFn: async (): Promise<AccountEntry[]> => {
      const { data, error } = await supabase
        .from("driver_account_entries")
        .select("*")
        .eq("driver_id", driverId)
        .neq("status", "voided")
        .order("created_at", { ascending: false })
        .limit(300);
      if (error) throw error;
      return (data as AccountEntry[]) ?? [];
    },
  });

export const myAccountBalanceQuery = (driverId: string) =>
  queryOptions({
    queryKey: ["driver-balance", driverId],
    queryFn: async (): Promise<AccountBalance> => {
      const { data, error } = await supabase.rpc("driver_account_balance", {
        p_driver_id: driverId,
      });
      if (error) throw error;
      const row = (data as AccountBalance[] | null)?.[0];
      return row ?? EMPTY_BALANCE;
    },
  });

export const myReliabilityQuery = (driverId: string) =>
  queryOptions({
    queryKey: ["driver-reliability", driverId],
    queryFn: async (): Promise<DriverReliability | null> => {
      const { data, error } = await supabase
        .from("driver_reliability")
        .select("*")
        .eq("driver_id", driverId)
        .maybeSingle();
      if (error) throw error;
      return (data as DriverReliability | null) ?? null;
    },
  });

export const myCancellationsQuery = (driverId: string) =>
  queryOptions({
    queryKey: ["driver-cancellations", driverId],
    queryFn: async (): Promise<DriverCancellation[]> => {
      const { data, error } = await supabase
        .from("driver_cancellations")
        .select("*")
        .eq("driver_id", driverId)
        .order("cancelled_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data as DriverCancellation[]) ?? [];
    },
  });

/** What would cancelling this job cost right now? Read-only. */
export async function previewCancellation(bookingId: string): Promise<CancellationPreview> {
  const { data, error } = await supabase.rpc("preview_driver_cancellation", {
    p_booking_id: bookingId,
  });
  if (error) throw error;
  return data as unknown as CancellationPreview;
}

/* ------------------------------- admin side ------------------------------- */

export const opsDriverAccountsQuery = queryOptions({
  queryKey: ["ops-driver-accounts"],
  queryFn: async (): Promise<DriverAccountSummary[]> => {
    const { data, error } = await supabase
      .from("driver_account_summary")
      .select("*")
      .order("negative_cents", { ascending: false })
      .limit(200);
    if (error) throw error;
    return (data as DriverAccountSummary[]) ?? [];
  },
  refetchInterval: 60_000,
});

export const opsPenaltiesQuery = queryOptions({
  queryKey: ["ops-penalties"],
  queryFn: async (): Promise<AccountEntry[]> => {
    const { data, error } = await supabase
      .from("driver_account_entries")
      .select("*")
      .eq("entry_type", "penalty")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    return (data as AccountEntry[]) ?? [];
  },
  refetchInterval: 60_000,
});

export async function waivePenaltyAdmin(input: {
  entryId: string;
  reason: string;
}): Promise<AccountEntry> {
  const { data, error } = await supabase.rpc("admin_waive_penalty", {
    p_entry_id: input.entryId,
    p_reason: input.reason,
  });
  if (error) throw error;
  return data as unknown as AccountEntry;
}

export async function adjustDriverAccountAdmin(input: {
  driverId: string;
  amountCents: number;
  reason: string;
  entryType?: "adjustment" | "incentive" | "penalty";
}): Promise<AccountEntry> {
  const { data, error } = await supabase.rpc("admin_adjust_driver_account", {
    p_driver_id: input.driverId,
    p_amount_cents: input.amountCents,
    p_reason: input.reason,
    p_entry_type: input.entryType ?? "adjustment",
  });
  if (error) throw error;
  return data as unknown as AccountEntry;
}

export async function setReplacementIncentiveAdmin(input: {
  bookingId: string;
  cents: number;
}): Promise<void> {
  const { error } = await supabase.rpc("admin_set_replacement_incentive", {
    p_booking_id: input.bookingId,
    p_cents: input.cents,
  });
  if (error) throw error;
}

export async function setDriverSuspensionAdmin(input: {
  driverId: string;
  until: string | null;
}): Promise<void> {
  const { error } = await supabase.rpc("admin_set_driver_suspension", {
    p_driver_id: input.driverId,
    p_until: input.until as unknown as string,
  });
  if (error) throw error;
}

export async function updatePenaltySettingsAdmin(input: {
  penaltyTier72Bps?: number;
  penaltyTier48Bps?: number;
  penaltyTier24Bps?: number;
  penaltyNoShowBps?: number;
  autoIncentiveHours?: number;
  autoIncentiveBps?: number;
  reliabilitySuspendScore?: number;
  reliabilitySuspendDays?: number;
}): Promise<void> {
  const { error } = await supabase.rpc("admin_update_penalty_settings", {
    p_penalty_tier_72_bps: input.penaltyTier72Bps ?? undefined,
    p_penalty_tier_48_bps: input.penaltyTier48Bps ?? undefined,
    p_penalty_tier_24_bps: input.penaltyTier24Bps ?? undefined,
    p_penalty_no_show_bps: input.penaltyNoShowBps ?? undefined,
    p_auto_incentive_hours: input.autoIncentiveHours ?? undefined,
    p_auto_incentive_bps: input.autoIncentiveBps ?? undefined,
    p_reliability_suspend_score: input.reliabilitySuspendScore ?? undefined,
    p_reliability_suspend_days: input.reliabilitySuspendDays ?? undefined,
  });
  if (error) throw error;
}

/** Suspended right now? */
export function isSuspended(reliability: DriverReliability | null): boolean {
  if (!reliability?.suspended_until) return false;
  return new Date(reliability.suspended_until).getTime() > Date.now();
}
