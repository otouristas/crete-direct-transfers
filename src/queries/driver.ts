import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { Booking } from "./bookings";

/** Row from the PII-masked open_jobs view (no customer name/phone/flight). */
export type OpenJob = Tables<"open_jobs">;

export const openJobsQuery = queryOptions({
  queryKey: ["open-jobs"],
  queryFn: async (): Promise<OpenJob[]> => {
    const { data, error } = await supabase
      .from("open_jobs")
      .select("*")
      .order("pickup_at", { ascending: true });
    if (error) throw error;
    return data as OpenJob[];
  },
  // Realtime can't stream an RLS-gated view, so the pool polls; at a few
  // bookings a day this is indistinguishable from a subscription.
  refetchInterval: 30_000,
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

/** Lifecycle move for the driver's own job; RLS decides legality — zero rows
 *  back means it refused. */
export async function updateJobStatus(
  id: string,
  status: "en_route" | "completed" | "no_show",
): Promise<void> {
  const { data, error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id)
    .select("id");
  if (error) throw error;
  if (!data || data.length === 0) throw new Error("update_refused");
}
