import { readFile } from "node:fs/promises";
const env = { ...process.env };
for (const file of [".env.local", ".env"]) {
  try {
    for (const line of (await readFile(file, "utf8")).split("\n")) {
      const m = line.match(/^([A-Z_]+)\s*=\s*["']?(.*?)["']?\s*$/);
      if (m && !env[m[1]]) env[m[1]] = m[2];
    }
  } catch {}
}
const required = [
  "VITE_SUPABASE_URL",
  "VITE_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_URL",
  "SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "RESEND_API_KEY",
  "RESEND_FROM",
  "DISPATCH_CRON_SECRET",
];
const missing = required.filter((name) => !env[name]?.trim());
const issues = [];
if (
  env.VITE_SUPABASE_URL !== "https://mlrgwkgiazmrsfjhfrnq.supabase.co" ||
  env.SUPABASE_URL !== env.VITE_SUPABASE_URL
)
  issues.push("Website/server must use the verified Transferaround.com Supabase project.");
if (
  env.VITE_SUPABASE_PUBLISHABLE_KEY?.startsWith("sb_secret_") ||
  env.VITE_SUPABASE_PUBLISHABLE_KEY?.includes("service_role")
)
  issues.push("A secret key must never be in VITE_* configuration.");
if (env.VITE_DEMO_BOOKINGS !== "false")
  issues.push("Disable account sample bookings in production: VITE_DEMO_BOOKINGS=false.");
if (env.DISPATCH_CRON_SECRET && env.DISPATCH_CRON_SECRET.length < 32)
  issues.push("Use a random cron secret of at least 32 characters.");
const config = await readFile("apps/ios-native/Shared/PublicConfig.plist", "utf8");
if (!config.includes("mlrgwkgiazmrsfjhfrnq.supabase.co"))
  issues.push("Swift apps must use the verified TransferAround project.");
console.log(
  "TransferAround local launch configuration (values are never printed; deployed secrets are checked separately)",
);
for (const name of required) console.log(`${missing.includes(name) ? "MISSING" : "SET"} ${name}`);
for (const issue of issues) console.log(`CHECK ${issue}`);
console.log(
  "Required before accepting payments: verify one Stripe sandbox checkout and signed webhook, schedule /api/events/process and /api/dispatch/expire, then verify a live-mode checkout.",
);
console.log(
  "Native Xcode builds use the configured Apple team and bundle IDs. Physical-device authentication and push delivery still require device verification.",
);
if (missing.length || issues.length) {
  console.log(
    "NOT CLEARED FOR LIVE PAYMENTS. Isolated test transfers remain separate from live payments.",
  );
  process.exitCode = 1;
} else console.log("Configuration present. Payment and deployment verification still required.");
