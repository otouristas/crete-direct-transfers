import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const vars = { ...process.env };
for (const file of [".env", ".env.local"]) {
  try {
    for (const line of (await readFile(file, "utf8")).split("\n")) {
      const m = line.match(/^([A-Z_]+)\s*=\s*["']?(.*?)["']?\s*$/);
      if (m && !vars[m[1]]) vars[m[1]] = m[2];
    }
  } catch {}
}
const url = vars.VITE_SUPABASE_URL;
const key = vars.VITE_SUPABASE_PUBLISHABLE_KEY;
assert.ok(url && key, "Configure the public Supabase URL and key first");
async function rpc(token, action, input = {}) {
  const res = await fetch(`${url}/rest/v1/rpc/transfer_practice`, {
    method: "POST",
    headers: { apikey: key, "content-type": "application/json" },
    body: JSON.stringify({ p_token: token, p_action: action, p_input: input }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Practice failed");
  return data;
}
const created = await rpc(null, "create");
const token = created.token;
assert.match(token, /^[a-f0-9]{48}$/);
await assert.rejects(() => rpc("0".repeat(48), "read"));
await assert.rejects(() => rpc(token, "start"));
await rpc(token, "request", { route: "chq-chania", vehicle: "comfort", priceCents: 1 });
assert.equal((await rpc(token, "read")).state.trip.priceCents, 4700);
await assert.rejects(() => rpc(token, "accept"));
await rpc(token, "online");
await rpc(token, "accept");
assert.equal((await rpc(token, "read")).state.trip.status, "claimed");
await assert.rejects(() => rpc(token, "request"));
await rpc(token, "start");
await rpc(token, "complete");
assert.equal((await rpc(token, "read")).state.trip.status, "completed");
await assert.rejects(() => rpc(token, "cancel"));
await rpc(token, "reset");
await rpc(token, "request");
await rpc(token, "cancel");
assert.equal((await rpc(token, "read")).state.trip.status, "cancelled");
await rpc(token, "reset");
const privateRead = await fetch(`${url}/rest/v1/transfer_practice_sessions?select=*`, {
  headers: { apikey: key },
});
assert.equal(privateRead.status, 404);
const directWrite = await fetch(`${url}/rest/v1/bookings`, {
  method: "POST",
  headers: { apikey: key, "content-type": "application/json" },
  body: "{}",
});
assert.ok([401, 403].includes(directWrite.status));
console.log(
  "PASS: shared practice lifecycle, cross-client reads, offline/invalid transition guards, untampered fares, cancellation, reset, private-session isolation and blocked direct booking writes.",
);
