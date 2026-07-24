/**
 * Smoke-checks the dispatch → push wiring without needing a live device.
 * Run: bun run scripts/verify-dispatch-push.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const checks = [];

function ok(name, pass, detail = "") {
  checks.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

const dispatch = readFileSync(resolve(root, "src/server/dispatch.ts"), "utf8");
ok("dispatch imports pushToUsers", dispatch.includes("pushToUsers"));
ok("dispatch notifies job offers via push", dispatch.includes('type: "job_offer"'));
ok("dispatch pushes driver_assigned to rider", dispatch.includes('type: "driver_assigned"'));
ok("expire path notifies fresh offers", dispatch.includes("freshOffers"));

const push = readFileSync(resolve(root, "src/server/push.ts"), "utf8");
ok("Expo push endpoint configured", push.includes("exp.host/--/api/v2/push/send"));
ok("device token upsert exists", push.includes("upsertDeviceToken"));

const migration = resolve(root, "supabase/migrations/20260724200000_push_device_tokens.sql");
ok("device_tokens migration present", existsSync(migration));

const server = readFileSync(resolve(root, "src/server.ts"), "utf8");
ok("HTTP /api/dispatch/new", server.includes("/api/dispatch/new"));
ok("HTTP /api/dispatch/assigned", server.includes("/api/dispatch/assigned"));
ok("HTTP /api/dispatch/expire", server.includes("/api/dispatch/expire"));
ok("HTTP /api/stripe/checkout", server.includes("/api/stripe/checkout"));

ok("driver app offers screen", existsSync(resolve(root, "apps/driver/app/(tabs)/index.tsx")));
ok("driver app job detail", existsSync(resolve(root, "apps/driver/app/job/[id].tsx")));
ok("rider app book screen", existsSync(resolve(root, "apps/rider/app/(tabs)/index.tsx")));
ok("mobile-shared package", existsSync(resolve(root, "packages/mobile-shared/src/index.ts")));

const book = readFileSync(resolve(root, "src/routes/{-$locale}/book.tsx"), "utf8");
ok("web book calls dispatchNewBooking", book.includes("dispatchNewBooking"));

const failed = checks.filter((c) => !c.pass);
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`);
if (failed.length) process.exit(1);
