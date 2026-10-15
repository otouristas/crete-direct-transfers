import assert from "node:assert/strict";
import { randomUUID, randomBytes } from "node:crypto";
import { readFile, writeFile, mkdir, unlink } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";
const env = { ...process.env };
for (const file of [".env", ".env.local"]) {
  try {
    for (const line of (await readFile(file, "utf8")).split("\n")) {
      const m = line.match(/^([A-Z_]+)\s*=\s*["']?(.*?)["']?\s*$/);
      if (m && !env[m[1]]) env[m[1]] = m[2];
    }
  } catch {}
}
const url = env.VITE_SUPABASE_URL,
  key = env.VITE_SUPABASE_PUBLISHABLE_KEY,
  secret = env.SUPABASE_SERVICE_ROLE_KEY;
assert.equal(url, "https://mlrgwkgiazmrsfjhfrnq.supabase.co");
assert.ok(key && secret, "Configure existing project credentials locally.");
const options = { auth: { persistSession: false, autoRefreshToken: false } };
const admin = createClient(url, secret, options);
const fixtureFile = "release/ios/testing/tracking-fixture.json";
const checked = (r, label) => {
  if (r.error) throw new Error(`${label}: ${r.error.message}`);
  return r.data;
};
async function cleanup(f) {
  if (f.bookingId)
    checked(
      await admin
        .from("bookings")
        .delete()
        .eq("id", f.bookingId)
        .eq("customer_email", f.accounts.rider.email),
      "clean test trip",
    );
  for (const a of Object.values(f.accounts))
    if (a.id) checked(await admin.auth.admin.deleteUser(a.id), "clean test identity");
  await unlink(fixtureFile).catch(() => {});
}
if (process.argv.includes("--cleanup")) {
  const f = JSON.parse(await readFile(fixtureFile, "utf8"));
  assert.match(f.marker, /^native-tracking-/);
  await cleanup(f);
  console.log("PASS: isolated tracking fixtures removed.");
  process.exit(0);
}
const marker = `native-tracking-${randomUUID()}`;
const fixture = { marker, accounts: {}, bookingId: null };
const clients = {};
let channel;
let retained = false;
const waitFor = (test, label) =>
  new Promise((resolve, reject) => {
    const start = Date.now();
    const tick = setInterval(() => {
      if (test()) {
        clearInterval(tick);
        resolve();
      } else if (Date.now() - start > 12000) {
        clearInterval(tick);
        reject(new Error(label));
      }
    }, 50);
  });
try {
  for (const role of ["driver", "rider", "intruder"]) {
    const email = `${role}.${randomUUID()}@example.invalid`,
      password = randomBytes(24).toString("base64url");
    const { user } = checked(
      await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        app_metadata: { internal_verification: marker },
        user_metadata: { full_name: `Internal ${role} test` },
      }),
      "create isolated test identity",
    );
    fixture.accounts[role] = { id: user.id, email, password };
    const client = createClient(url, key, options);
    checked(await client.auth.signInWithPassword({ email, password }), "sign in isolated identity");
    clients[role] = client;
  }
  const driver = fixture.accounts.driver.id,
    rider = fixture.accounts.rider.id;
  checked(
    await admin.from("profiles").update({ role: "driver" }).eq("id", driver),
    "set test driver role",
  );
  checked(
    await admin.from("driver_profiles").upsert({
      id: driver,
      approval_status: "approved",
      vehicle_class: "comfort",
      vehicle_make_model: "Internal test vehicle",
      vehicle_plate: "TEST ONLY",
      is_online: false,
    }),
    "create isolated driver fixture",
  );
  const b = checked(
    await admin
      .from("bookings")
      .insert({
        user_id: rider,
        driver_id: driver,
        customer_name: "Internal tracking test",
        customer_email: fixture.accounts.rider.email,
        customer_phone: "",
        route_slug: "chania-airport-to-chania",
        passengers: 2,
        currency: "EUR",
        pickup_at: new Date(Date.now() + 7200000).toISOString(),
        pickup_address: "Chania Airport (CHQ)",
        dropoff_address: "Chania Old Town",
        pickup_point: { lat: 35.5317, lng: 24.1497 },
        dropoff_point: { lat: 35.5138, lng: 24.018 },
        status: "claimed",
        payment_status: "unpaid",
        price_cents: 0,
        vehicle_class: "comfort",
        extras: { internal_verification: marker },
      })
      .select("id")
      .single(),
    "create unpaid isolated test trip",
  );
  fixture.bookingId = b.id;
  const events = [];
  const statusEvents = [];
  let subscribed = false;
  const rs = await clients.rider.auth.getSession();
  await clients.rider.realtime.setAuth(rs.data.session.access_token);
  channel = clients.rider
    .channel(marker)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "trip_locations", filter: `booking_id=eq.${b.id}` },
      (e) => events.push(e),
    )
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "bookings", filter: `id=eq.${b.id}` },
      (e) => statusEvents.push(e),
    )
    .subscribe((s, e) => {
      console.log("Realtime:", s, e?.message || "");
      if (s === "SUBSCRIBED") subscribed = true;
    });
  await waitFor(() => subscribed, "Rider Realtime subscription timed out");
  const sample = {
    booking_id: b.id,
    driver_id: driver,
    latitude: 35.5317,
    longitude: 24.1497,
    accuracy: 8,
    heading: 245,
    speed: 8,
    captured_at: new Date().toISOString(),
    received_at: "2100-01-01T00:00:00Z",
    driver_name: "Forged",
  };
  checked(
    await clients.driver.from("trip_locations").upsert(sample),
    "publish assigned driver position",
  );
  const visible = checked(
    await clients.rider.from("trip_locations").select("latitude").eq("booking_id", b.id),
    "verify traveler initial visibility",
  );
  console.log("Rider can read sample:", visible.length === 1);
  await waitFor(
    () => events.some((e) => e.new?.latitude === sample.latitude),
    "First GPS sample did not reach traveler over WebSocket",
  );
  const first = checked(
    await clients.rider.from("trip_locations").select("*").eq("booking_id", b.id).single(),
    "read own trip GPS",
  );
  assert.notEqual(first.driver_name, "Forged");
  assert.ok(Date.parse(first.received_at) < Date.now() + 10000);
  const next = {
    ...sample,
    latitude: 35.5309,
    longitude: 24.1479,
    captured_at: new Date(Date.now() + 1000).toISOString(),
  };
  checked(
    await clients.driver.from("trip_locations").upsert(next),
    "publish moving driver position",
  );
  await waitFor(
    () => events.some((e) => e.new?.latitude === next.latitude),
    "Second moving GPS sample did not reach traveler",
  );
  const stranger = checked(
    await clients.intruder.from("trip_locations").select("*").eq("booking_id", b.id),
    "check unrelated account privacy",
  );
  assert.equal(stranger.length, 0);
  assert.ok(
    (await createClient(url, key, options).from("trip_locations").select("*")).error,
    "anonymous access must fail",
  );
  assert.ok(
    (await clients.rider.from("trip_locations").upsert(next)).error,
    "traveler must not write driver GPS",
  );
  assert.ok(
    (await clients.intruder.from("trip_locations").upsert(next)).error,
    "unrelated account must not write GPS",
  );
  assert.ok(
    (await clients.driver.from("trip_locations").upsert({ ...next, latitude: 200 })).error,
    "coordinates must be validated",
  );
  assert.ok(
    (
      await clients.driver
        .from("trip_locations")
        .upsert({ ...next, captured_at: new Date(Date.now() - 3600000).toISOString() })
    ).error,
    "stale samples must be rejected",
  );
  checked(await clients.driver.from("trip_locations").upsert(sample), "ignore old GPS replay");
  assert.equal(
    checked(
      await clients.rider.from("trip_locations").select("latitude").eq("booking_id", b.id).single(),
      "check replay result",
    ).latitude,
    next.latitude,
  );
  assert.ok(
    (await clients.intruder.rpc("advance_trip", { p_booking_id: b.id, p_stage: "at_pickup" }))
      .error,
    "stranger must not advance a trip",
  );
  assert.ok(
    (await clients.rider.rpc("advance_trip", { p_booking_id: b.id, p_stage: "at_pickup" })).error,
    "traveler must not advance driver stage",
  );
  assert.ok(
    (await clients.driver.rpc("advance_trip", { p_booking_id: b.id, p_stage: "on_trip" })).error,
    "boarding must follow arrival",
  );
  checked(
    await clients.driver.rpc("update_job_status", { p_booking_id: b.id, p_status: "en_route" }),
    "head to pickup",
  );
  assert.ok(
    (await clients.driver.from("bookings").update({ journey_stage: "on_trip" }).eq("id", b.id))
      .error,
    "direct writes must not skip arrival",
  );
  checked(
    await clients.driver.rpc("advance_trip", { p_booking_id: b.id, p_stage: "at_pickup" }),
    "arrive at pickup",
  );
  checked(
    await clients.driver.rpc("advance_trip", { p_booking_id: b.id, p_stage: "on_trip" }),
    "traveler on board",
  );
  await waitFor(
    () => statusEvents.some((e) => e.new?.journey_stage === "on_trip"),
    "Trip status did not reach traveler over Realtime",
  );
  checked(
    await clients.driver.rpc("update_job_status", { p_booking_id: b.id, p_status: "completed" }),
    "complete isolated trip",
  );
  assert.equal(
    checked(
      await admin.from("trip_locations").select("*").eq("booking_id", b.id),
      "check automatic GPS deletion",
    ).length,
    0,
  );
  assert.ok(
    (
      await clients.driver
        .from("trip_locations")
        .upsert({ ...next, captured_at: new Date().toISOString() })
    ).error,
    "closed trips must reject GPS",
  );
  console.log(
    "PASS: two moving GPS samples delivered over Realtime; traveler read, anonymous/intruder privacy, writer ownership, metadata stamping, freshness, replay protection, ordered trip stages, automatic deletion, and closed-trip write guards.",
  );
  if (process.env.TA_KEEP_TRACKING_FIXTURES === "1") {
    checked(
      await admin
        .from("bookings")
        .update({ status: "claimed", journey_stage: "to_pickup" })
        .eq("id", b.id),
      "reset isolated trip for native UI verification",
    );
    await mkdir("release/ios/testing", { recursive: true, mode: 0o700 });
    await writeFile(fixtureFile, JSON.stringify(fixture), { mode: 0o600 });
    retained = true;
    console.log("Private disposable fixtures retained for native UI verification.");
  }
} finally {
  if (channel) await clients.rider.removeChannel(channel);
  if (!retained) await cleanup(fixture);
  for (const c of Object.values(clients)) await c.auth.signOut();
}
