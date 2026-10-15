import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const env = {};
for (const line of (await readFile(".env", "utf8")).split("\n")) {
  const split = line.indexOf("=");
  if (split > 0 && !line.startsWith("#"))
    env[line.slice(0, split)] = line
      .slice(split + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
}
const fixture = JSON.parse(await readFile("release/ios/testing/tracking-fixture.json", "utf8"));
assert.ok(fixture.accounts.rider.email.endsWith("@example.invalid"));
const client = createClient(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const { data, error } = await client.auth.signInWithPassword(fixture.accounts.rider);
assert.ifError(error);
const base = process.env.TA_AI_BASE || "http://127.0.0.1:8084";
const call = async (payload, authenticated = true) => {
  const response = await fetch(`${base}/api/ride-ai`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(authenticated ? { authorization: `Bearer ${data.session.access_token}` } : {}),
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(55000),
  });
  const result = await response.json();
  return { status: response.status, result };
};
const incomplete = [{ role: "user", content: "I need an airport transfer tomorrow in Crete." }];
assert.equal(
  (await call({ messages: incomplete }, false)).status,
  401,
  "paid inference is authenticated",
);
let { status, result } = await call({ messages: incomplete });
assert.equal(status, 200, JSON.stringify(result));
assert.equal(result.recommendation, null);
assert.ok(result.questions.length >= 3);
console.log("PASS missing details: no invented fare, hotel, party or pickup time");
const messages = [
  {
    role: "user",
    content:
      "Tomorrow at 5pm I need a transfer from Chania Airport CHQ to Chania Town, 2 people, 2 large suitcases. Flight X is unknown.",
  },
];
({ status, result } = await call({ messages }));
assert.equal(status, 200, JSON.stringify(result));
assert.equal(result.from?.kind, "airport", JSON.stringify(result));
assert.equal(result.intent.passengers, 2);
assert.equal(result.intent.bags, 2);
assert.equal(result.intent.pickupTime, "17:00");
assert.equal(result.intent.flightNumber, null);
assert.ok(result.destinationOptions.length > 0);
const selectedTo = result.destinationOptions.find((p) => /^chania/i.test(p.label));
assert.ok(selectedTo, "actual destination choice available");
({ status, result } = await call({
  messages: [...messages, { role: "assistant", content: result.reply }],
  selectedTo,
  mode: "selection",
  intent: result.intent,
  selectedToQuery: result.intent.destinationQuery,
}));
assert.equal(status, 200, JSON.stringify(result));
assert.ok(result.recommendation, JSON.stringify(result.questions));
assert.equal(result.recommendation.vehicleClass, "economy");
assert.ok(result.recommendation.priceCents > 0);
assert.ok(result.recommendation.distanceKm > 5);
assert.ok(result.recommendation.bookPath.startsWith("/book?"));
assert.equal(
  new URL(result.recommendation.bookPath, "https://transferaround.com").searchParams.get(
    "bagsChecked",
  ),
  "2",
);
console.log(
  `PASS complete proposal: verified place selection, local 17:00 pickup, ${result.recommendation.distanceKm.toFixed(1)} km, server fare, review link with travelers/bags; no booking or payment mutation`,
);
await client.auth.signOut();
