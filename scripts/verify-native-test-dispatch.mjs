import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { randomUUID, randomBytes } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const env = { ...process.env };
for (const file of [".env", ".env.local"])
  for (const line of (await readFile(file, "utf8")).split("\n")) {
    const match = line.match(/^([A-Z_]+)\s*=\s*["']?(.*?)["']?\s*$/);
    if (match && !env[match[1]]) env[match[1]] = match[2];
  }
assert.equal(env.VITE_SUPABASE_URL, "https://mlrgwkgiazmrsfjhfrnq.supabase.co");
const options = { auth: { persistSession: false, autoRefreshToken: false } };
const admin = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, options);
const fixture = JSON.parse(await readFile("release/ios/testing/tracking-fixture.json", "utf8"));
assert.match(fixture.marker, /^native-tracking-/);
const checked = (result, label) => {
  if (result.error) throw new Error(`${label}: ${result.error.message}`);
  return result.data;
};
const clients = {};
const rideIds = [];
const deviceTokens = [];
let outside;
try {
  for (const [role, account] of Object.entries(fixture.accounts)) {
    assert.match(account.email, /@example\.invalid$/);
    const client = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY, options);
    checked(
      await client.auth.signInWithPassword({ email: account.email, password: account.password }),
      "fixture sign in",
    );
    clients[role] = client;
    assert.equal(checked(await client.rpc("is_transfer_tester"), "tester membership"), true);
  }
  checked(
    await admin.from("profiles").update({ role: "driver" }).eq("id", fixture.accounts.intruder.id),
    "disposable second driver",
  );
  checked(
    await admin
      .from("driver_profiles")
      .upsert({ id: fixture.accounts.intruder.id, approval_status: "draft", is_online: false }),
    "draft test driver",
  );
  const outsiderEmail = `outside.${randomUUID()}@example.invalid`,
    outsiderPassword = randomBytes(24).toString("base64url");
  outside = checked(
    await admin.auth.admin.createUser({
      email: outsiderEmail,
      password: outsiderPassword,
      email_confirm: true,
      app_metadata: { internal_verification: fixture.marker },
    }),
    "outside identity",
  ).user.id;
  const outsider = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY, options);
  checked(
    await outsider.auth.signInWithPassword({ email: outsiderEmail, password: outsiderPassword }),
    "outside sign in",
  );
  assert.equal(checked(await outsider.rpc("is_transfer_tester"), "outside membership"), false);
  assert.ok(
    (await outsider.rpc("set_test_driver_online", { p_online: true })).error,
    "a non-member cannot enable testing",
  );

  for (const role of ["driver", "intruder"]) {
    checked(
      await clients[role].rpc("set_test_driver_online", { p_online: true }),
      "online test driver",
    );
    const token = randomBytes(32).toString("hex");
    deviceTokens.push(token);
    checked(
      await clients[role].from("native_device_tokens").insert({
        user_id: fixture.accounts[role].id,
        token,
        role: "driver",
        topic: "com.transferaround.driver",
        environment: "production",
      }),
      "isolated APNs token",
    );
  }
  const request = {
    p_request_id: randomUUID(),
    p_from: { lat: 35.5396, lng: 24.1497 },
    p_to: { lat: 35.5138, lng: 24.018 },
    p_pickup_address: "Internal airport fixture",
    p_dropoff_address: "Internal town fixture",
    p_pickup_at: new Date(Date.now() + 3600000).toISOString(),
    p_vehicle_class: "economy",
    p_passengers: 2,
    p_price_cents: 3500,
  };
  const ride = checked(await clients.rider.rpc("create_test_ride", request), "demo booking");
  rideIds.push(ride.id);
  assert.equal(ride.is_test, true);
  assert.equal(ride.payment_status, "demo");
  assert.equal(
    checked(await clients.rider.rpc("create_test_ride", request), "idempotent demo booking").id,
    ride.id,
  );
  assert.equal(
    (await admin.from("bookings").select("id").eq("id", ride.id)).data.length,
    0,
    "test transfer cannot become a financial booking",
  );
  assert.equal(
    checked(await outsider.from("test_rides").select().eq("id", ride.id), "outsider RLS").length,
    0,
  );
  assert.equal(
    checked(
      await clients.driver.from("test_rides").select().eq("id", ride.id),
      "unassigned driver PII protection",
    ).length,
    0,
  );
  const offers = await Promise.all(
    ["driver", "intruder"].map(async (role) => ({
      role,
      offer: checked(await clients[role].rpc("my_test_ride_offers"), "masked offer").find(
        (o) => o.id === ride.id,
      ),
    })),
  );
  assert.ok(offers.every((o) => o.offer));
  assert.equal(
    new Set(offers.map((o) => o.offer.offer_id)).size,
    2,
    "each driver has their own offer id",
  );
  const queue = checked(
    await admin.from("native_push_outbox").select("offer_id").eq("booking_id", ride.id),
    "durable notifications",
  );
  assert.equal(queue.length, 2);
  assert.equal(new Set(queue.map((q) => q.offer_id)).size, 2);
  const claimed = checked(
    await admin.rpc("claim_native_push", { p_limit: 100 }),
    "worker claim",
  ).filter((q) => q.booking_id === ride.id);
  assert.equal(claimed.length, 2);
  const duplicateClaims = checked(
    await admin.rpc("claim_native_push", { p_limit: 100 }),
    "second worker claim",
  ).filter((q) => q.booking_id === ride.id);
  assert.equal(
    duplicateClaims.length,
    0,
    "workers must not concurrently deliver the same leased item",
  );
  for (const item of claimed)
    checked(
      await admin.rpc("finish_native_push", {
        p_id: item.id,
        p_lease_token: item.lease_token,
        p_delivered: false,
        p_permanent: true,
        p_error: "isolated_fixture_never_send",
      }),
      "stop fake-token fixture",
    );
  const attempts = await Promise.all(
    offers.map(({ role, offer }) =>
      clients[role].rpc("respond_to_test_ride", { p_offer_id: offer.offer_id, p_accept: true }),
    ),
  );
  assert.equal(attempts.filter((a) => !a.error).length, 1, "exactly one concurrent driver wins");
  const winner = attempts.findIndex((a) => !a.error),
    winnerRole = offers[winner].role,
    driver = clients[winnerRole];
  assert.ok(
    (await driver.rpc("advance_test_ride", { p_ride_id: ride.id, p_action: "complete" })).error,
    "completion cannot skip pickup and boarding",
  );
  for (const action of ["start", "arrive", "board"])
    checked(
      await driver.rpc("advance_test_ride", { p_ride_id: ride.id, p_action: action }),
      `stage ${action}`,
    );
  checked(
    await driver.rpc("publish_test_trip_location", {
      p_ride_id: ride.id,
      p_lat: 35.52,
      p_lng: 24.08,
      p_heading: 220,
      p_captured_at: new Date().toISOString(),
    }),
    "real GPS sample protocol",
  );
  const location = checked(
    await clients.rider.from("test_trip_locations").select().eq("booking_id", ride.id),
    "traveler position visibility",
  );
  assert.equal(location.length, 1);
  assert.equal(location[0].latitude, 35.52);
  assert.equal(
    checked(
      await outsider.from("test_trip_locations").select().eq("booking_id", ride.id),
      "GPS isolation",
    ).length,
    0,
  );
  assert.ok(
    (
      await driver.rpc("publish_test_trip_location", {
        p_ride_id: ride.id,
        p_lat: 35.52,
        p_lng: 24.08,
        p_heading: 0,
        p_captured_at: new Date(Date.now() - 300000).toISOString(),
      })
    ).error,
    "stale samples cannot look live",
  );
  checked(
    await driver.rpc("advance_test_ride", { p_ride_id: ride.id, p_action: "complete" }),
    "complete demo journey",
  );
  assert.equal(
    checked(
      await clients.rider.from("test_trip_locations").select().eq("booking_id", ride.id),
      "closed GPS cleanup",
    ).length,
    0,
  );
  assert.ok(
    (
      await driver.rpc("publish_test_trip_location", {
        p_ride_id: ride.id,
        p_lat: 35.52,
        p_lng: 24.08,
        p_heading: 0,
        p_captured_at: new Date().toISOString(),
      })
    ).error,
    "closed trips cannot recreate live position",
  );
  console.log(
    "PASS: isolated demo booking; no real payment row; 2 recipient-specific durable notifications; exclusive worker leases; concurrent single-winner acceptance; guarded trip stages; participant-only GPS; stale/closed GPS rejected.",
  );
} finally {
  for (const id of rideIds) {
    checked(
      await admin.from("native_push_outbox").delete().eq("booking_id", id),
      "clean test outbox",
    );
    checked(await admin.from("test_rides").delete().eq("id", id), "clean test ride");
  }
  for (const token of deviceTokens)
    checked(
      await admin.from("native_device_tokens").delete().eq("token", token),
      "clean fake device",
    );
  for (const role of ["driver", "intruder"])
    if (clients[role]) await clients[role].rpc("set_test_driver_online", { p_online: false });
  if (outside) checked(await admin.auth.admin.deleteUser(outside), "clean outside identity");
}
