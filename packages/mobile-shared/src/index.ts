import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "./database";

export type { Database, Tables };

export type MobileEnv = {
  supabaseUrl: string;
  supabaseAnonKey: string;
};

export function createMobileSupabase(env: MobileEnv): SupabaseClient<Database> {
  return createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  });
}

export type DeviceRole = "customer" | "driver";
export type DevicePlatform = "ios" | "android";

export async function registerDeviceToken(
  client: SupabaseClient<Database>,
  input: {
    userId: string;
    role: DeviceRole;
    platform: DevicePlatform;
    expoPushToken: string;
  },
) {
  const { error } = await client.from("device_tokens").upsert(
    {
      user_id: input.userId,
      role: input.role,
      platform: input.platform,
      expo_push_token: input.expoPushToken,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "expo_push_token" },
  );
  if (error) throw error;
}

export async function unregisterDeviceToken(
  client: SupabaseClient<Database>,
  input: { userId: string; expoPushToken: string },
) {
  const { error } = await client
    .from("device_tokens")
    .delete()
    .eq("user_id", input.userId)
    .eq("expo_push_token", input.expoPushToken);
  if (error) throw error;
}

export async function setDriverOnline(client: SupabaseClient<Database>, online: boolean) {
  const { data, error } = await client.rpc("set_driver_online", { p_online: online });
  if (error) throw error;
  return data;
}

export async function respondToOffer(
  client: SupabaseClient<Database>,
  offerId: string,
  accept: boolean,
) {
  const { data, error } = await client.rpc("respond_to_offer", {
    p_offer_id: offerId,
    p_accept: accept,
  });
  if (error) throw error;
  return data;
}

export async function claimJob(client: SupabaseClient<Database>, bookingId: string) {
  const { data, error } = await client.rpc("claim_job", { p_booking_id: bookingId });
  if (error) throw error;
  return data;
}

export async function updateJobStatus(
  client: SupabaseClient<Database>,
  bookingId: string,
  status: "en_route" | "completed" | "no_show",
) {
  const { error } = await client.rpc("update_job_status", {
    p_booking_id: bookingId,
    p_status: status,
  });
  if (error) throw error;
}

export async function reportUnableToComplete(
  client: SupabaseClient<Database>,
  bookingId: string,
  note?: string,
) {
  const { error } = await client.rpc("open_incident", {
    p_booking_id: bookingId,
    p_type: "unable_to_complete",
    p_note: note ?? null,
    p_claimed_wait_until: null,
    p_evidence_urls: [],
  });
  if (error) throw error;
}

export async function fetchMyJobOffers(client: SupabaseClient<Database>) {
  await client.rpc("expire_job_offers");
  const { data, error } = await client
    .from("my_job_offers")
    .select("*")
    .order("expires_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchOpenJobs(client: SupabaseClient<Database>) {
  const { data, error } = await client
    .from("open_jobs")
    .select("*")
    .order("pickup_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchDriverJobs(client: SupabaseClient<Database>, driverId: string) {
  const { data, error } = await client
    .from("bookings")
    .select("*")
    .eq("driver_id", driverId)
    .order("pickup_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchBooking(client: SupabaseClient<Database>, id: string) {
  const { data, error } = await client.from("bookings").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchMyBookings(
  client: SupabaseClient<Database>,
  userId: string,
  email: string,
) {
  const emailFilter = email ? `,customer_email.ilike."${email.replace(/"/g, "")}"` : "";
  const { data, error } = await client
    .from("bookings")
    .select("*")
    .or(`user_id.eq.${userId}${emailFilter}`)
    .order("pickup_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchProfile(client: SupabaseClient<Database>, userId: string) {
  const { data, error } = await client
    .from("profiles")
    .select("*, driver_profiles(*)")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"];

export async function createBooking(client: SupabaseClient<Database>, row: BookingInsert) {
  const { data, error } = await client.from("bookings").insert(row).select("id").single();
  if (error) throw error;
  return data;
}
