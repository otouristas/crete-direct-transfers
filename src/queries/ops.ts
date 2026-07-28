import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type BookingIncident = Tables<"booking_incidents">;
export type Booking = Tables<"bookings">;
export type Partner = Tables<"partners">;
export type DriverOnboardingSubmission = Tables<"driver_onboarding_submissions">;
export type DriverDocument = Tables<"driver_documents">;
export type Profile = Tables<"profiles">;

export type DriverOnboardingReview = DriverOnboardingSubmission & {
  documents: DriverDocument[];
  profile: Profile | null;
};

export const openIncidentsQuery = queryOptions({
  queryKey: ["ops-incidents"],
  queryFn: async (): Promise<(BookingIncident & { booking?: Booking | null })[]> => {
    const { data, error } = await supabase
      .from("booking_incidents")
      .select("*")
      .in("status", ["open", "investigating"])
      .order("created_at", { ascending: true });
    if (error) throw error;
    const incidents = (data as BookingIncident[]) ?? [];
    const ids = [...new Set(incidents.map((i) => i.booking_id))];
    if (ids.length === 0) return incidents.map((i) => ({ ...i, booking: null }));

    const { data: bookings } = await supabase.from("bookings").select("*").in("id", ids);
    const byId = new Map(((bookings as Booking[]) ?? []).map((b) => [b.id, b]));
    return incidents.map((i) => ({ ...i, booking: byId.get(i.booking_id) ?? null }));
  },
  refetchInterval: 30_000,
});

export const pendingRefundsQuery = queryOptions({
  queryKey: ["ops-refunds"],
  queryFn: async (): Promise<Booking[]> => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("refund_status", "pending_review")
      .order("updated_at", { ascending: true });
    if (error) throw error;
    return (data as Booking[]) ?? [];
  },
  refetchInterval: 30_000,
});

/** Pending bookings still without a driver for > 5 minutes. */
export const unassignedBookingsQuery = queryOptions({
  queryKey: ["ops-unassigned"],
  queryFn: async (): Promise<Booking[]> => {
    await supabase.rpc("expire_job_offers");
    const cutoff = new Date(Date.now() - 5 * 60_000).toISOString();
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("status", "pending")
      .is("driver_id", null)
      .lt("created_at", cutoff)
      .gt("pickup_at", new Date().toISOString())
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data as Booking[]) ?? [];
  },
  refetchInterval: 30_000,
});

export const opsPartnersQuery = queryOptions({
  queryKey: ["ops-partners"],
  queryFn: async (): Promise<Partner[]> => {
    const { data, error } = await supabase.from("partners").select("*").order("market");
    if (error) throw error;
    return (data as Partner[]) ?? [];
  },
});

export const opsDriverOnboardingQuery = queryOptions({
  queryKey: ["ops-driver-onboarding"],
  queryFn: async (): Promise<DriverOnboardingReview[]> => {
    const { data, error } = await supabase
      .from("driver_onboarding_submissions")
      .select("*")
      .in("status", ["submitted", "needs_changes"])
      .order("submitted_at", { ascending: true });
    if (error) throw error;
    const submissions = (data as DriverOnboardingSubmission[]) ?? [];
    const driverIds = submissions.map((submission) => submission.driver_id);
    if (driverIds.length === 0) return [];

    const [{ data: documents, error: documentsError }, { data: profiles, error: profilesError }] =
      await Promise.all([
        supabase.from("driver_documents").select("*").in("driver_id", driverIds),
        supabase.from("profiles").select("*").in("id", driverIds),
      ]);
    if (documentsError) throw documentsError;
    if (profilesError) throw profilesError;

    const typedDocuments = (documents as DriverDocument[]) ?? [];
    const typedProfiles = (profiles as Profile[]) ?? [];
    return submissions.map((submission) => ({
      ...submission,
      documents: typedDocuments.filter((document) => document.driver_id === submission.driver_id),
      profile: typedProfiles.find((profile) => profile.id === submission.driver_id) ?? null,
    }));
  },
});

export async function resolveIncidentAdmin(input: {
  incidentId: string;
  resolution: "full_refund" | "partial_refund" | "credit" | "rebook" | "no_action";
  notes?: string;
  reject?: boolean;
}): Promise<void> {
  const { error } = await supabase.rpc("resolve_incident", {
    p_incident_id: input.incidentId,
    p_resolution: input.resolution,
    p_notes: input.notes ?? null,
    p_reject: input.reject ?? false,
  });
  if (error) throw error;
}

export async function setPartnerStatusAdmin(
  partnerId: string,
  status: "active" | "paused",
): Promise<Partner> {
  const { data, error } = await supabase.rpc("set_partner_status", {
    p_partner_id: partnerId,
    p_status: status,
  });
  if (error) throw error;
  return data as unknown as Partner;
}

export async function opsAssignJob(bookingId: string, driverId: string): Promise<Booking> {
  const { data, error } = await supabase.rpc("assign_job_to_driver", {
    p_booking_id: bookingId,
    p_driver_id: driverId,
  });
  if (error) throw error;
  return data as unknown as Booking;
}

export async function getDriverDocumentReviewUrl(storagePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from("driver-documents")
    .createSignedUrl(storagePath, 5 * 60);
  if (error) throw error;
  return data.signedUrl;
}

export async function reviewDriverDocumentAdmin(input: {
  documentId: string;
  status: "verified" | "rejected" | "expired";
  reason?: string;
}): Promise<DriverDocument> {
  const { data, error } = await supabase.rpc("review_driver_document", {
    p_document_id: input.documentId,
    p_status: input.status,
    p_rejection_reason: input.reason ?? null,
  });
  if (error) throw error;
  return data as unknown as DriverDocument;
}

export async function reviewDriverOnboardingAdmin(input: {
  driverId: string;
  status: "needs_changes" | "approved" | "rejected" | "suspended";
  notes?: string;
}): Promise<DriverOnboardingSubmission> {
  const { data, error } = await supabase.rpc("review_driver_onboarding", {
    p_driver_id: input.driverId,
    p_status: input.status,
    p_notes: input.notes ?? null,
  });
  if (error) throw error;
  return data as unknown as DriverOnboardingSubmission;
}
