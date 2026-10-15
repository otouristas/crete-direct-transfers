import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export async function authorizeBookingRequest(
  request: Request,
  bookingId: string,
  role: "owner" | "driver",
) {
  const authorization = request.headers.get("authorization");
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || !authorization?.startsWith("Bearer ")) return false;
  const client = createClient<Database>(url, key, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client.auth.getUser(authorization.slice(7));
  if (error || !data.user) return false;
  const { data: booking } = await client
    .from("bookings")
    .select("user_id,customer_email,driver_id")
    .eq("id", bookingId)
    .maybeSingle();
  if (!booking) return false;
  const { data: admin } = await client.rpc("is_admin");
  if (admin) return true;
  return role === "driver"
    ? booking.driver_id === data.user.id
    : booking.user_id === data.user.id ||
        (!!data.user.email_confirmed_at &&
          booking.customer_email.toLowerCase() === data.user.email?.toLowerCase());
}
