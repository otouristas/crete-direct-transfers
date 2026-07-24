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

export type DriverInfo = {
  full_name: string | null;
  phone: string | null;
  vehicle_make_model: string | null;
  vehicle_plate: string | null;
  vehicle_class: string | null;
};

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

/** RLS enforces the cancellation rules (own booking, pending/claimed, >24h
 *  before pickup); zero returned rows means it refused. */
export async function cancelBooking(id: string): Promise<void> {
  if (isDemoBookingId(id)) throw new Error("cancel_refused");
  const { data, error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", id)
    .select("id");
  if (error) throw error;
  if (!data || data.length === 0) throw new Error("cancel_refused");
}
