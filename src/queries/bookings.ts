import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import {
  DEMO_BOOKINGS,
  getDemoBooking,
  getDemoDriver,
  isDemoBookingId,
  isDemoBookingsEnabled,
} from "@/data/demo-bookings";

export type Booking = Tables<"bookings">;
export type BookingIncident = Tables<"booking_incidents">;

export type CancellationReason =
  | "customer_plans_changed"
  | "customer_booked_wrong"
  | "flight_cancelled_airline"
  | "other";

export type IncidentType =
  | "driver_no_show"
  | "driver_late"
  | "wrong_vehicle"
  | "safety"
  | "missed_each_other"
  | "unable_to_complete"
  | "other";

export type DriverInfo = {
  full_name: string | null;
  phone: string | null;
  vehicle_make_model: string | null;
  vehicle_plate: string | null;
  vehicle_class: string | null;
};

/** Hours until pickup; negative if pickup already passed. */
export function hoursUntilPickup(pickupAt: string): number {
  return (new Date(pickupAt).getTime() - Date.now()) / (1000 * 60 * 60);
}

/** Preview cancel fee before calling the RPC. */
export function previewCancelRefund(
  pickupAt: string,
  reason: CancellationReason,
): {
  refundPercent: 50 | 100;
  needsReview: boolean;
} {
  if (reason === "flight_cancelled_airline") {
    return { refundPercent: 100, needsReview: false };
  }
  if (hoursUntilPickup(pickupAt) >= 24) {
    return { refundPercent: 100, needsReview: false };
  }
  return { refundPercent: 50, needsReview: true };
}

/**
 * The customer's bookings: linked by user_id or by their (verified) email.
 * The explicit filter mirrors the RLS policy on purpose — without it a
 * driver's claimed jobs would also satisfy their RLS read access and leak
 * into their customer view.
 *
 * When demo mode is on (DEV by default, or VITE_DEMO_BOOKINGS=true), sample
 * bookings are merged in so the account hub can be reviewed with content.
 */
export const myBookingsQuery = (userId: string, email: string) =>
  queryOptions({
    queryKey: ["my-bookings", userId, "demo"],
    queryFn: async (): Promise<Booking[]> => {
      let real: Booking[] = [];
      try {
        // Quote email — @ and . break PostgREST .or() filters otherwise.
        const emailFilter = email ? `,customer_email.ilike."${email.replace(/"/g, "")}"` : "";
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .or(`user_id.eq.${userId}${emailFilter}`)
          .order("pickup_at", { ascending: false });
        if (error) throw error;
        real = (data as Booking[]) ?? [];
      } catch {
        // Still surface demos when the live query fails (common during UI review).
        if (!isDemoBookingsEnabled()) throw new Error("bookings_fetch_failed");
      }
      if (!isDemoBookingsEnabled()) return real;
      return [...DEMO_BOOKINGS, ...real].sort((a, b) => b.pickup_at.localeCompare(a.pickup_at));
    },
  });

export const bookingQuery = (id: string) =>
  queryOptions({
    queryKey: ["booking", id],
    queryFn: async (): Promise<Booking | null> => {
      if (isDemoBookingId(id)) return getDemoBooking(id);
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as Booking | null;
    },
  });

export const bookingIncidentsQuery = (bookingId: string) =>
  queryOptions({
    queryKey: ["booking-incidents", bookingId],
    queryFn: async (): Promise<BookingIncident[]> => {
      if (isDemoBookingId(bookingId)) return [];
      const { data, error } = await supabase
        .from("booking_incidents")
        .select("*")
        .eq("booking_id", bookingId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as BookingIncident[]) ?? [];
    },
  });

/** Driver name/phone/vehicle for a claimed booking the caller owns. */
export const bookingDriverQuery = (id: string) =>
  queryOptions({
    queryKey: ["booking-driver", id],
    queryFn: async (): Promise<DriverInfo | null> => {
      if (isDemoBookingId(id)) return getDemoDriver(id);
      const { data, error } = await supabase.rpc("booking_driver_info", { p_booking_id: id });
      if (error) throw error;
      return (data?.[0] as DriverInfo | undefined) ?? null;
    },
  });

export async function requestCancellation(input: {
  id: string;
  reason: CancellationReason;
  note?: string;
  preferCredit?: boolean;
}): Promise<Booking> {
  if (isDemoBookingId(input.id)) throw new Error("cancel_refused");
  const { data, error } = await supabase.rpc("request_cancellation", {
    p_booking_id: input.id,
    p_reason: input.reason,
    p_note: input.note ?? null,
    p_prefer_credit: input.preferCredit ?? true,
  });
  if (error) throw error;
  return data as unknown as Booking;
}

/** @deprecated Prefer requestCancellation — kept for any stray callers. */
export async function cancelBooking(id: string): Promise<void> {
  await requestCancellation({ id, reason: "customer_plans_changed", preferCredit: true });
}

export async function openIncident(input: {
  bookingId: string;
  type: IncidentType;
  note?: string;
  claimedWaitUntil?: string;
}): Promise<BookingIncident> {
  if (isDemoBookingId(input.bookingId)) throw new Error("incident_refused");
  const { data, error } = await supabase.rpc("open_incident", {
    p_booking_id: input.bookingId,
    p_type: input.type,
    p_note: input.note ?? null,
    p_claimed_wait_until: input.claimedWaitUntil ?? null,
    p_evidence_urls: [],
  });
  if (error) throw error;
  return data as unknown as BookingIncident;
}
