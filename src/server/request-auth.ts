import { getServiceSupabase } from "@/integrations/supabase/service";

export async function requireRequestUser(
  request: Request,
): Promise<{ ok: true; userId: string } | { ok: false; response: Response }> {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) {
    return { ok: false, response: new Response("unauthorized", { status: 401 }) };
  }

  const token = authorization.slice("Bearer ".length).trim();
  const admin = getServiceSupabase();
  if (!token || !admin) {
    return { ok: false, response: new Response("unauthorized", { status: 401 }) };
  }

  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) {
    return { ok: false, response: new Response("unauthorized", { status: 401 }) };
  }

  return { ok: true, userId: data.user.id };
}

export async function requireBookingAccess(
  request: Request,
  bookingId: string,
  role: "customer" | "driver",
): Promise<{ ok: true; userId: string } | { ok: false; response: Response }> {
  const auth = await requireRequestUser(request);
  if (!auth.ok) return auth;

  const admin = getServiceSupabase();
  if (!admin) {
    return { ok: false, response: new Response("service unavailable", { status: 503 }) };
  }

  const column = role === "driver" ? "driver_id" : "user_id";
  const { data: booking } = await admin
    .from("bookings")
    .select("id")
    .eq("id", bookingId)
    .eq(column, auth.userId)
    .maybeSingle();

  if (!booking) {
    return { ok: false, response: new Response("forbidden", { status: 403 }) };
  }

  return auth;
}
