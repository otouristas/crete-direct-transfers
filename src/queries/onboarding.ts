import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type OnboardingSubmission = Tables<"driver_onboarding_submissions">;
export type DriverDocument = Tables<"driver_documents">;
export type DriverDocumentType =
  | "driving_licence"
  | "identity"
  | "insurance"
  | "vehicle_registration";

export const driverOnboardingQuery = (driverId: string) =>
  queryOptions({
    queryKey: ["driver-onboarding", driverId],
    queryFn: async () => {
      const [
        { data: submission, error: submissionError },
        { data: documents, error: documentError },
      ] = await Promise.all([
        supabase
          .from("driver_onboarding_submissions")
          .select("*")
          .eq("driver_id", driverId)
          .single(),
        supabase
          .from("driver_documents")
          .select("*")
          .eq("driver_id", driverId)
          .order("document_type"),
      ]);
      if (submissionError) throw submissionError;
      if (documentError) throw documentError;
      return {
        submission,
        documents: documents ?? [],
      };
    },
    enabled: !!driverId,
  });

export async function saveDriverIdentity(
  driverId: string,
  values: { full_name: string; phone: string; preferred_locale: string },
) {
  const { error } = await supabase.from("profiles").update(values).eq("id", driverId);
  if (error) throw error;
}

export async function saveDriverVehicle(
  driverId: string,
  values: {
    vehicle_class: string;
    vehicle_make_model: string;
    vehicle_plate: string;
  },
) {
  const { error } = await supabase.from("driver_profiles").update(values).eq("id", driverId);
  if (error) throw error;
}

export async function saveOnboardingStep(driverId: string, currentStep: number) {
  const { error } = await supabase
    .from("driver_onboarding_submissions")
    .update({ current_step: currentStep })
    .eq("driver_id", driverId);
  if (error) throw error;
}

function safeFilename(filename: string) {
  return filename
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(-120);
}

export async function uploadDriverDocument(
  driverId: string,
  documentType: DriverDocumentType,
  file: File,
  current?: DriverDocument,
  expiresOn?: string,
) {
  const allowed = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);
  if (!allowed.has(file.type)) throw new Error("document_type_invalid");
  if (file.size <= 0 || file.size > 10 * 1024 * 1024) {
    throw new Error("document_size_invalid");
  }

  const path = `${driverId}/${documentType}/${crypto.randomUUID()}-${safeFilename(file.name)}`;
  const { error: uploadError } = await supabase.storage
    .from("driver-documents")
    .upload(path, file, { contentType: file.type, upsert: false });
  if (uploadError) throw uploadError;

  try {
    if (current) {
      const { error: deleteRowError } = await supabase
        .from("driver_documents")
        .delete()
        .eq("id", current.id);
      if (deleteRowError) throw deleteRowError;
    }

    const payload: TablesInsert<"driver_documents"> = {
      driver_id: driverId,
      document_type: documentType,
      storage_path: path,
      original_filename: file.name,
      mime_type: file.type,
      size_bytes: file.size,
      expires_on: expiresOn || null,
    };
    const { data, error } = await supabase
      .from("driver_documents")
      .insert(payload)
      .select("*")
      .single();
    if (error) throw error;

    if (current) {
      await supabase.storage.from("driver-documents").remove([current.storage_path]);
    }
    return data;
  } catch (error) {
    await supabase.storage.from("driver-documents").remove([path]);
    throw error;
  }
}

export async function submitDriverOnboarding(consentVersion: string) {
  const { data, error } = await supabase.rpc("submit_driver_onboarding", {
    p_consent_version: consentVersion,
  });
  if (error) throw error;
  return data;
}

export async function createDriverDocumentUrl(path: string) {
  const { data, error } = await supabase.storage.from("driver-documents").createSignedUrl(path, 60);
  if (error) throw error;
  return data.signedUrl;
}
