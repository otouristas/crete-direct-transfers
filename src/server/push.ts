import { getServiceSupabase } from "@/integrations/supabase/service";

export type DeviceRole = "customer" | "driver";
export type DevicePlatform = "ios" | "android";

export type ExpoPushMessage = {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sound?: "default" | null;
  priority?: "default" | "normal" | "high";
  channelId?: string;
};

type ExpoPushTicket = {
  status: "ok" | "error";
  id?: string;
  message?: string;
  details?: { error?: string };
};

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

export async function upsertDeviceToken(input: {
  userId: string;
  role: DeviceRole;
  platform: DevicePlatform;
  expoPushToken: string;
}) {
  const admin = getServiceSupabase();
  if (!admin) return { ok: false as const, reason: "no_service_role" as const };

  const token = input.expoPushToken.trim();
  if (!token.startsWith("ExponentPushToken[") && !token.startsWith("ExpoPushToken[")) {
    return { ok: false as const, reason: "invalid_token" as const };
  }

  const { error } = await admin.from("device_tokens").upsert(
    {
      user_id: input.userId,
      role: input.role,
      platform: input.platform,
      expo_push_token: token,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "expo_push_token" },
  );

  if (error) {
    console.error("[push] upsert failed", error);
    return { ok: false as const, reason: "db_error" as const };
  }
  return { ok: true as const };
}

export async function deleteDeviceToken(input: { userId: string; expoPushToken: string }) {
  const admin = getServiceSupabase();
  if (!admin) return { ok: false as const, reason: "no_service_role" as const };

  const { error } = await admin
    .from("device_tokens")
    .delete()
    .eq("user_id", input.userId)
    .eq("expo_push_token", input.expoPushToken.trim());

  if (error) {
    console.error("[push] delete failed", error);
    return { ok: false as const, reason: "db_error" as const };
  }
  return { ok: true as const };
}

export async function getExpoPushTokensForUsers(userIds: string[]): Promise<string[]> {
  const admin = getServiceSupabase();
  if (!admin || userIds.length === 0) return [];

  const { data, error } = await admin
    .from("device_tokens")
    .select("expo_push_token")
    .in("user_id", userIds);

  if (error) {
    console.error("[push] load tokens failed", error);
    return [];
  }
  return [...new Set((data ?? []).map((r) => r.expo_push_token).filter(Boolean))];
}

export async function sendExpoPush(messages: ExpoPushMessage[]): Promise<{ sent: number }> {
  if (messages.length === 0) return { sent: 0 };

  try {
    const res = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messages),
    });
    if (!res.ok) {
      console.error("[push] expo http", res.status, await res.text());
      return { sent: 0 };
    }
    const json = (await res.json()) as { data?: ExpoPushTicket | ExpoPushTicket[] };
    const tickets = Array.isArray(json.data) ? json.data : json.data ? [json.data] : [];
    const sent = tickets.filter((t) => t.status === "ok").length;
    for (const t of tickets) {
      if (t.status === "error") {
        console.error("[push] ticket error", t.message, t.details);
      }
    }
    return { sent };
  } catch (err) {
    console.error("[push] send failed", err);
    return { sent: 0 };
  }
}

export async function pushToUsers(input: {
  userIds: string[];
  title: string;
  body: string;
  data?: Record<string, unknown>;
  priority?: "default" | "normal" | "high";
}) {
  const tokens = await getExpoPushTokensForUsers(input.userIds);
  if (tokens.length === 0) return { sent: 0 };

  return sendExpoPush(
    tokens.map((to) => ({
      to,
      title: input.title,
      body: input.body,
      data: input.data,
      sound: "default" as const,
      priority: input.priority ?? "high",
      channelId: "default",
    })),
  );
}
