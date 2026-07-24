import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { Booking } from "./bookings";

/** Row from the PII-masked open_jobs view (no customer name/phone/flight). */
export type OpenJob = Tables<"open_jobs"> & {
  urgency?: string | null;
  asap_expires_at?: string | null;
  eta_minutes?: number | null;
};
export type MyJobOffer = Tables<"my_job_offers">;
export type DriverProfileRow = Tables<"driver_profiles">;

export const openJobsQuery = queryOptions({
  queryKey: ["open-jobs"],
  queryFn: async (): Promise<OpenJob[]> => {
    const { data, error } = await supabase
      .from("open_jobs")
      .select("*")
      .order("pickup_at", { ascending: true });
    if (error) throw error;
    const rows = (data ?? []) as OpenJob[];
    return rows.sort((a, b) => {
      const aAsap = a.urgency === "asap" ? 0 : 1;
      const bAsap = b.urgency === "asap" ? 0 : 1;
      if (aAsap !== bAsap) return aAsap - bAsap;
      return String(a.pickup_at ?? "").localeCompare(String(b.pickup_at ?? ""));
    });
  },
  refetchInterval: 15_000,
});

export const myJobOffersQuery = queryOptions({
  queryKey: ["my-job-offers"],
  queryFn: async (): Promise<MyJobOffer[]> => {
    // Expire / cascade before reading so drivers see fresh offers.
    await supabase.rpc("expire_job_offers");
    const { data, error } = await supabase
      .from("my_job_offers")
      .select("*")
      .order("expires_at", { ascending: true });
    if (error) throw error;
    return data as MyJobOffer[];
  },
  refetchInterval: 15_000,
});

export const driverJobsQuery = (driverId: string) =>
  queryOptions({
    queryKey: ["driver-jobs", driverId],
    queryFn: async (): Promise<Booking[]> => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("driver_id", driverId)
        .order("pickup_at", { ascending: false });
      if (error) throw error;
      return data as Booking[];
    },
  });

/** Atomic claim via the claim_job RPC; throws "job_already_claimed" when
 *  another driver won the race. */
export async function claimJob(bookingId: string): Promise<Booking> {
  const { data, error } = await supabase.rpc("claim_job", { p_booking_id: bookingId });
  if (error) throw error;
  return data as unknown as Booking;
}

export async function respondToOffer(offerId: string, accept: boolean): Promise<Booking | null> {
  const { data, error } = await supabase.rpc("respond_to_offer", {
    p_offer_id: offerId,
    p_accept: accept,
  });
  if (error) throw error;
  return (data as unknown as Booking) ?? null;
}

export async function setDriverOnline(online: boolean): Promise<DriverProfileRow> {
  const { data, error } = await supabase.rpc("set_driver_online", { p_online: online });
  if (error) throw error;
  return data as unknown as DriverProfileRow;
}

/** Lifecycle move for the driver's own job via update_job_status RPC
 *  (enforces waiting-time window for traveler no-show). */
export async function updateJobStatus(
  id: string,
  status: "en_route" | "completed" | "no_show",
): Promise<void> {
  const { error } = await supabase.rpc("update_job_status", {
    p_booking_id: id,
    p_status: status,
  });
  if (error) {
    if (error.message?.includes("wait_not_elapsed")) throw new Error("wait_not_elapsed");
    throw error;
  }
}

export async function reportUnableToComplete(bookingId: string, note?: string): Promise<void> {
  const { error } = await supabase.rpc("open_incident", {
    p_booking_id: bookingId,
    p_type: "unable_to_complete",
    p_note: note ?? null,
    p_claimed_wait_until: null,
    p_evidence_urls: [],
  });
  if (error) throw error;
}
