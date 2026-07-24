import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type SavedTraveler = Tables<"saved_travelers">;

export const savedTravelersQuery = (userId: string) =>
  queryOptions({
    queryKey: ["saved-travelers", userId],
    queryFn: async (): Promise<SavedTraveler[]> => {
      const { data, error } = await supabase
        .from("saved_travelers")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as SavedTraveler[]) ?? [];
    },
  });

export async function createSavedTraveler(input: {
  userId: string;
  fullName: string;
  phone?: string;
  email?: string;
  childSeatNeeded?: boolean;
  notes?: string;
}): Promise<SavedTraveler> {
  const { data, error } = await supabase
    .from("saved_travelers")
    .insert({
      user_id: input.userId,
      full_name: input.fullName,
      phone: input.phone ?? null,
      email: input.email ?? null,
      child_seat_needed: input.childSeatNeeded ?? false,
      notes: input.notes ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as SavedTraveler;
}

export async function deleteSavedTraveler(id: string): Promise<void> {
  const { error } = await supabase.from("saved_travelers").delete().eq("id", id);
  if (error) throw error;
}
