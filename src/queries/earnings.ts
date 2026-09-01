import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type DriverEarning = Tables<"driver_earnings">;
export type DriverPayout = Tables<"driver_payouts">;
export type PlatformSettings = Tables<"platform_settings">;
export type PayoutSchedule = "weekly" | "monthly" | "instant";

export type EarningWithBooking = DriverEarning & {
  booking: Pick<
    Tables<"bookings">,
    "id" | "route_slug" | "pickup_at" | "pickup_address" | "dropoff_address"
  > | null;
};

async function attachBookings(rows: DriverEarning[]): Promise<EarningWithBooking[]> {
  if (rows.length === 0) return [];
  const ids = [...new Set(rows.map((r) => r.booking_id))];
  const { data } = await supabase
    .from("bookings")
    .select("id, route_slug, pickup_at, pickup_address, dropoff_address")
    .in("id", ids);
  const byId = new Map((data ?? []).map((b) => [b.id, b]));
  return rows.map((r) => ({ ...r, booking: byId.get(r.booking_id) ?? null }));
}

/** Earnings lines for the signed-in driver (RLS scopes this to their own). */
export const myEarningsQuery = (driverId: string) =>
  queryOptions({
    queryKey: ["my-earnings", driverId],
    queryFn: async (): Promise<EarningWithBooking[]> => {
      const { data, error } = await supabase
        .from("driver_earnings")
        .select("*")
        .eq("driver_id", driverId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return attachBookings((data as DriverEarning[]) ?? []);
    },
  });

export const myPayoutsQuery = (driverId: string) =>
  queryOptions({
    queryKey: ["my-payouts", driverId],
    queryFn: async (): Promise<DriverPayout[]> => {
      const { data, error } = await supabase
        .from("driver_payouts")
        .select("*")
        .eq("driver_id", driverId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as DriverPayout[]) ?? [];
    },
  });

export const platformSettingsQuery = queryOptions({
  queryKey: ["platform-settings"],
  queryFn: async (): Promise<PlatformSettings | null> => {
    const { data, error } = await supabase.from("platform_settings").select("*").maybeSingle();
    if (error) throw error;
    return (data as PlatformSettings | null) ?? null;
  },
});

/** Admin: the whole ledger with booking context. */
export const opsEarningsQuery = queryOptions({
  queryKey: ["ops-earnings"],
  queryFn: async (): Promise<EarningWithBooking[]> => {
    const { data, error } = await supabase
      .from("driver_earnings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;
    return attachBookings((data as DriverEarning[]) ?? []);
  },
  refetchInterval: 60_000,
});

export const opsPayoutsQuery = queryOptions({
  queryKey: ["ops-payouts"],
  queryFn: async (): Promise<DriverPayout[]> => {
    const { data, error } = await supabase
      .from("driver_payouts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    return (data as DriverPayout[]) ?? [];
  },
  refetchInterval: 60_000,
});

export async function setEarningStatusAdmin(input: {
  id: string;
  status: "pending" | "held" | "available" | "voided" | "disputed";
  note?: string;
}): Promise<DriverEarning> {
  const { data, error } = await supabase.rpc("admin_set_earning_status", {
    p_earning_id: input.id,
    p_status: input.status,
    p_note: input.note ?? undefined,
  });
  if (error) throw error;
  return data as unknown as DriverEarning;
}

export async function updatePlatformSettingsAdmin(input: {
  commissionBps?: number;
  holdingPeriodHours?: number;
  defaultPayoutSchedule?: PayoutSchedule;
  minPayoutCents?: number;
}): Promise<PlatformSettings> {
  const { data, error } = await supabase.rpc("admin_update_platform_settings", {
    p_commission_bps: input.commissionBps ?? undefined,
    p_holding_period_hours: input.holdingPeriodHours ?? undefined,
    p_default_payout_schedule: input.defaultPayoutSchedule ?? undefined,
    p_min_payout_cents: input.minPayoutCents ?? undefined,
  });
  if (error) throw error;
  return data as unknown as PlatformSettings;
}

export async function setMyPayoutSchedule(schedule: PayoutSchedule): Promise<void> {
  const { error } = await supabase.rpc("set_my_payout_schedule", { p_schedule: schedule });
  if (error) throw error;
}

/** Totals for the driver dashboard cards. */
export function summariseEarnings(rows: DriverEarning[]) {
  const sum = (statuses: string[]) =>
    rows.filter((r) => statuses.includes(r.status)).reduce((n, r) => n + r.net_cents, 0);
  return {
    pendingCents: sum(["pending", "held"]),
    availableCents: sum(["available"]),
    totalCents: sum(["pending", "held", "available", "paid"]),
    paidCents: sum(["paid"]),
  };
}

/** Next Monday / next 1st of month, in the driver's local time. */
export function nextPayoutDate(schedule: PayoutSchedule, from = new Date()): Date | null {
  if (schedule === "instant") return null;
  const d = new Date(from);
  d.setHours(0, 0, 0, 0);
  if (schedule === "weekly") {
    const delta = (8 - d.getDay()) % 7 || 7;
    d.setDate(d.getDate() + delta);
    return d;
  }
  return new Date(d.getFullYear(), d.getMonth() + 1, 1);
}
