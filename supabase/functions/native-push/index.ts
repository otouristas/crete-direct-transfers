import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.110.0";

type Delivery = {
  id: string;
  lease_token: string;
  token: string;
  topic: string;
  environment: "production" | "sandbox";
  offer_id: string;
  booking_id: string;
  is_test: boolean;
  title: string;
  body: string;
  expires_at: string;
  attempts: number;
};
const encode = (value: Uint8Array | string) =>
  btoa(typeof value === "string" ? value : String.fromCharCode(...value))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");
let cached: { value: string; expires: number } | undefined;

async function providerToken(): Promise<string> {
  if (cached && cached.expires > Date.now()) return cached.value;
  const team = Deno.env.get("APNS_TEAM_ID"),
    kid = Deno.env.get("APNS_KEY_ID"),
    raw = Deno.env.get("APNS_PRIVATE_KEY_B64");
  if (!team || !kid || !raw) throw new Error("apple_push_not_configured");
  const pem = atob(raw)
    .replace(/-----[^-]+-----/g, "")
    .replace(/\s/g, "");
  const key = await crypto.subtle.importKey(
    "pkcs8",
    Uint8Array.from(atob(pem), (c) => c.charCodeAt(0)),
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"],
  );
  const unsigned = `${encode(JSON.stringify({ alg: "ES256", kid }))}.${encode(JSON.stringify({ iss: team, iat: Math.floor(Date.now() / 1000) }))}`;
  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    new TextEncoder().encode(unsigned),
  );
  const value = `${unsigned}.${encode(new Uint8Array(signature))}`;
  cached = { value, expires: Date.now() + 40 * 60 * 1000 };
  return value;
}

async function equalSecret(a: string, b: string) {
  const hash = async (s: string) =>
    new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)));
  const [x, y] = await Promise.all([hash(a), hash(b)]);
  let difference = 0;
  for (let i = 0; i < x.length; i++) difference |= x[i] ^ y[i];
  return difference === 0;
}

Deno.serve(async (request) => {
  const secret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (
    request.method !== "POST" ||
    !secret ||
    !(await equalSecret(request.headers.get("authorization") ?? "", `Bearer ${secret}`))
  )
    return Response.json({ error: "unauthorized" }, { status: 401 });
  let jwt: string;
  try {
    jwt = await providerToken();
  } catch {
    return Response.json({ error: "Apple push credentials are not configured" }, { status: 503 });
  }
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  await admin.rpc("expire_test_ride_offers");
  const { data, error } = await admin.rpc("claim_native_push", { p_limit: 100 });
  if (error) return Response.json({ error: "queue_unavailable" }, { status: 503 });
  const queue = (data ?? []) as Delivery[];
  let accepted = 0,
    retrying = 0,
    failed = 0;
  const deliver = async (item: Delivery) => {
    let success = false,
      permanent = false,
      reason = "transport_retry",
      invalidDevice = false;
    try {
      if (!["com.transferaround.driver", "com.transferaround.rider"].includes(item.topic))
        throw new Error("unsupported_topic");
      const host =
        item.environment === "production" ? "api.push.apple.com" : "api.sandbox.push.apple.com";
      const response = await fetch(`https://${host}/3/device/${item.token}`, {
        method: "POST",
        signal: AbortSignal.timeout(8000),
        headers: {
          authorization: `bearer ${jwt}`,
          "apns-topic": item.topic,
          "apns-push-type": "alert",
          "apns-priority": "10",
          "content-type": "application/json",
          "apns-expiration": String(Math.floor(Date.parse(item.expires_at) / 1000)),
          "apns-collapse-id": item.offer_id,
        },
        body: JSON.stringify({
          aps: {
            alert: { title: item.title, body: item.body },
            sound: "default",
            category: "TRANSFER_OFFER",
            "thread-id": "transfer-offers",
          },
          type: "job_offer",
          bookingId: item.booking_id,
          offerId: item.offer_id,
          isTest: item.is_test,
          expiresAt: item.expires_at,
        }),
      });
      success = response.status === 200;
      const body = await response.json().catch(() => ({}));
      reason = success
        ? "accepted_by_apple"
        : `apns_${response.status}_${body.reason ?? "unknown"}`;
      invalidDevice = response.status === 410 || body.reason === "BadDeviceToken";
      permanent =
        invalidDevice ||
        ["DeviceTokenNotForTopic", "TopicDisallowed", "BadTopic", "PayloadTooLarge"].includes(
          body.reason,
        );
      if (body.reason === "ExpiredProviderToken") cached = undefined;
    } catch {
      /* A bounded lease and backoff make transport failures retryable. */
    }
    const { error: ack } = await admin.rpc("finish_native_push", {
      p_id: item.id,
      p_lease_token: item.lease_token,
      p_delivered: success,
      p_permanent: permanent,
      p_error: success ? null : reason,
    });
    if (ack) {
      retrying++;
      return;
    }
    if (invalidDevice)
      await admin
        .from("native_device_tokens")
        .delete()
        .eq("token", item.token)
        .eq("topic", item.topic);
    if (success) accepted++;
    else if (permanent || item.attempts >= 5) failed++;
    else retrying++;
  };
  // Bound concurrency; the same code handles a large queue across repeated claims.
  for (let index = 0; index < queue.length; index += 25)
    await Promise.allSettled(queue.slice(index, index + 25).map(deliver));
  return Response.json({ ok: true, acceptedByApple: accepted, retrying, failed });
});
