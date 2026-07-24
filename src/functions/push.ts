import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import {
  deleteDeviceToken,
  upsertDeviceToken,
  type DevicePlatform,
  type DeviceRole,
} from "@/server/push";

async function requireUserId(): Promise<string> {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const key =
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
    process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase not configured");

  const request = getRequest();
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) throw new Error("Unauthorized");
  const token = authHeader.slice("Bearer ".length).trim();
  if (!token || token.split(".").length !== 3) throw new Error("Unauthorized");

  const supabase = createClient<Database>(url, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) throw new Error("Unauthorized");
  return data.user.id;
}

export const registerDeviceToken = createServerFn({ method: "POST" })
  .inputValidator(
    (d: { expoPushToken: string; role: DeviceRole; platform: DevicePlatform }) => d,
  )
  .handler(async ({ data }) => {
    const userId = await requireUserId();
    return upsertDeviceToken({
      userId,
      role: data.role,
      platform: data.platform,
      expoPushToken: data.expoPushToken,
    });
  });

export const unregisterDeviceToken = createServerFn({ method: "POST" })
  .inputValidator((d: { expoPushToken: string }) => d)
  .handler(async ({ data }) => {
    const userId = await requireUserId();
    return deleteDeviceToken({ userId, expoPushToken: data.expoPushToken });
  });
