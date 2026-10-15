import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/** Only the server knows the queue worker credential. No device token is returned. */
export async function processNativePush() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !secret) return { ok: false, error: "Notification service unavailable" };
  const response = await fetch(`${url}/functions/v1/native-push`, {
    method: "POST",
    headers: { authorization: `Bearer ${secret}`, "content-type": "application/json" },
    body: "{}",
    signal: AbortSignal.timeout(25000),
  });
  if (!response.ok) return { ok: false, error: "Apple notification delivery needs a retry" };
  return { ok: true };
}

export async function authorizePushFlush(request: Request, bookingId: string, test: boolean) {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const authorization = request.headers.get("authorization");
  if (!url || !key || !authorization?.startsWith("Bearer ")) return false;
  const client = createClient<Database>(url, key, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client.auth.getUser(authorization.slice(7));
  if (error || !data.user) return false;
  const { data: booking } = await client
    .from(test ? "test_rides" : "bookings")
    .select("user_id,driver_id")
    .eq("id", bookingId)
    .maybeSingle();
  return !!booking && (booking.user_id === data.user.id || booking.driver_id === data.user.id);
}
