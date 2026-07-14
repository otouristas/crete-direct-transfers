import { queryOptions, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export type DriverProfile = {
  id: string;
  vehicle_class: string | null;
  vehicle_make_model: string | null;
  vehicle_plate: string | null;
  license_number: string | null;
  insurance_number: string | null;
  id_document_number: string | null;
  vehicle_registration_number: string | null;
  approval_status: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: string;
  driver_profiles: DriverProfile | null;
};

export const profileQuery = (userId: string) =>
  queryOptions({
    queryKey: ["profile", userId],
    queryFn: async (): Promise<Profile> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, phone, role, driver_profiles (*)")
        .eq("id", userId)
        .single();
      if (error) throw error;
      return data as unknown as Profile;
    },
  });

/** Profile (incl. driver sub-profile) for the signed-in user; null query while
 *  logged out. */
export function useProfile() {
  const { user, ready } = useAuth();
  return useQuery({
    ...profileQuery(user?.id ?? ""),
    enabled: ready && !!user,
  });
}
