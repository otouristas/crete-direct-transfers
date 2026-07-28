import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { Booking } from "./bookings";

export type Partner = Tables<"partners">;
export type PartnerMember = Tables<"partner_members">;

export type PartnerDriver = {
  id: string;
  full_name: string | null;
  phone: string | null;
  is_online: boolean;
  vehicle_class: string | null;
  vehicle_make_model: string | null;
  vehicle_plate: string | null;
};

export const myPartnerMembershipsQuery = (userId: string) =>
  queryOptions({
    queryKey: ["partner-memberships", userId],
    queryFn: async (): Promise<(PartnerMember & { partner?: Partner | null })[]> => {
      const { data, error } = await supabase
        .from("partner_members")
        .select("*")
        .eq("user_id", userId);
      if (error) throw error;
      const members = (data as PartnerMember[]) ?? [];
      const partnerIds = [...new Set(members.map((m) => m.partner_id))];
      if (partnerIds.length === 0) return members.map((m) => ({ ...m, partner: null }));

      const { data: partners } = await supabase.from("partners").select("*").in("id", partnerIds);
      const byId = new Map(((partners as Partner[]) ?? []).map((p) => [p.id, p]));
      return members.map((m) => ({ ...m, partner: byId.get(m.partner_id) ?? null }));
    },
  });

export const partnerInboxQuery = (partnerId: string) =>
  queryOptions({
    queryKey: ["partner-inbox", partnerId],
    queryFn: async (): Promise<Booking[]> => {
      await supabase.rpc("expire_job_offers");
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("partner_id", partnerId)
        .eq("status", "pending")
        .is("driver_id", null)
        .gt("pickup_at", new Date().toISOString())
        .order("pickup_at", { ascending: true });
      if (error) throw error;
      return (data as Booking[]) ?? [];
    },
    refetchInterval: 15_000,
  });

export const partnerDriversQuery = (partnerId: string) =>
  queryOptions({
    queryKey: ["partner-drivers", partnerId],
    queryFn: async (): Promise<PartnerDriver[]> => {
      const { data: members, error } = await supabase
        .from("partner_members")
        .select("user_id")
        .eq("partner_id", partnerId)
        .eq("role", "driver");
      if (error) throw error;
      const ids = ((members as { user_id: string }[]) ?? []).map((m) => m.user_id);

      const { data: linked } = await supabase
        .from("driver_profiles")
        .select("id")
        .eq("partner_id", partnerId)
        .eq("approval_status", "approved");
      for (const row of (linked as { id: string }[]) ?? []) {
        if (!ids.includes(row.id)) ids.push(row.id);
      }
      if (ids.length === 0) return [];

      const { data: profiles, error: pErr } = await supabase
        .from("profiles")
        .select(
          "id, full_name, phone, driver_profiles(is_online, vehicle_class, vehicle_make_model, vehicle_plate, approval_status)",
        )
        .in("id", ids);
      if (pErr) throw pErr;

      return (
        (profiles as unknown as {
          id: string;
          full_name: string | null;
          phone: string | null;
          driver_profiles: {
            is_online: boolean;
            vehicle_class: string | null;
            vehicle_make_model: string | null;
            vehicle_plate: string | null;
            approval_status: string;
          } | null;
        }[]) ?? []
      )
        .filter((p) => p.driver_profiles?.approval_status === "approved")
        .map((p) => ({
          id: p.id,
          full_name: p.full_name,
          phone: p.phone,
          is_online: p.driver_profiles?.is_online ?? false,
          vehicle_class: p.driver_profiles?.vehicle_class ?? null,
          vehicle_make_model: p.driver_profiles?.vehicle_make_model ?? null,
          vehicle_plate: p.driver_profiles?.vehicle_plate ?? null,
        }));
    },
    refetchInterval: 30_000,
  });

export async function assignJobToDriver(bookingId: string, driverId: string): Promise<Booking> {
  const { data, error } = await supabase.rpc("assign_job_to_driver", {
    p_booking_id: bookingId,
    p_driver_id: driverId,
  });
  if (error) throw error;
  return data as unknown as Booking;
}
