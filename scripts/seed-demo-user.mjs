import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv(path) {
  if (!existsSync(path)) return {};
  const env = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const i = trimmed.indexOf("=");
    const key = trimmed.slice(0, i).trim();
    let val = trimmed.slice(i + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
  return env;
}

function argument(name) {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length);
}

const fileEnv = loadEnv(resolve(process.cwd(), ".env"));
const env = { ...fileEnv, ...process.env };
const url = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = env.SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;
const email = argument("email") || env.DEMO_USER_EMAIL;
const password = argument("password") || env.DEMO_USER_PASSWORD;
const fullName = argument("name") || env.DEMO_USER_NAME || "Demo Driver";

if (!url || !serviceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

if (!email || !password) {
  console.error(
    "Provide DEMO_USER_EMAIL and DEMO_USER_PASSWORD, or use --email=... --password=...",
  );
  process.exit(1);
}

if (password.length < 12) {
  console.error("DEMO_USER_PASSWORD must contain at least 12 characters");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  const listed = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (listed.error) throw listed.error;

  let user = listed.data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

  if (!user) {
    const created = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        signup_role: "driver",
        vehicle_class: "comfort",
        vehicle_make_model: "Mercedes E-Class",
        vehicle_plate: "TEST-001",
      },
    });
    if (created.error) throw created.error;
    user = created.data.user;
    console.log("created_user", user.id);
  } else {
    const updated = await admin.auth.admin.updateUserById(user.id, {
      password,
      email_confirm: true,
      user_metadata: {
        ...(user.user_metadata || {}),
        full_name: user.user_metadata?.full_name || fullName,
        signup_role: "driver",
      },
    });
    if (updated.error) throw updated.error;
    user = updated.data.user;
    console.log("updated_user", user.id);
  }

  const { error: pErr } = await admin.from("profiles").upsert({
    id: user.id,
    full_name: fullName,
    role: "driver",
  });
  if (pErr) throw pErr;

  const { data: partner } = await admin
    .from("partners")
    .select("id, slug")
    .eq("slug", "greece-demo")
    .maybeSingle();
  const { data: zone } = await admin
    .from("service_zones")
    .select("id")
    .eq("slug", "crete-heraklion")
    .maybeSingle();

  const driverPayload = {
    id: user.id,
    vehicle_class: "comfort",
    vehicle_make_model: "Mercedes E-Class",
    vehicle_plate: "TEST-001",
    approval_status: "approved",
    partner_id: partner?.id ?? null,
    primary_zone_id: zone?.id ?? null,
    is_online: false,
  };

  let { error: dErr } = await admin.from("driver_profiles").upsert(driverPayload);
  if (dErr) {
    console.warn("full driver upsert failed:", dErr.message);
    const minimal = {
      id: user.id,
      vehicle_class: "comfort",
      vehicle_make_model: "Mercedes E-Class",
      vehicle_plate: "TEST-001",
      approval_status: "approved",
    };
    ({ error: dErr } = await admin.from("driver_profiles").upsert(minimal));
    if (dErr) throw dErr;
  }

  if (partner?.id) {
    const { error: mErr } = await admin
      .from("partner_members")
      .upsert(
        { partner_id: partner.id, user_id: user.id, role: "dispatcher" },
        { onConflict: "partner_id,user_id" },
      );
    if (mErr) console.warn("partner_members:", mErr.message);
  }

  if (!anonKey) {
    console.warn("No anon key — skip login verify");
  } else {
    const anon = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const login = await anon.auth.signInWithPassword({ email, password });
    if (login.error) throw login.error;
  }

  const { data: profile } = await admin
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();
  const { data: dp } = await admin
    .from("driver_profiles")
    .select("approval_status, partner_id, is_online")
    .eq("id", user.id)
    .single();

  console.log(
    JSON.stringify(
      {
        ok: true,
        userId: user.id,
        role: profile?.role,
        approval: dp?.approval_status,
        partner_id: dp?.partner_id ?? null,
        note: "Demo driver account is ready.",
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error("FAIL", e?.message || e);
  process.exit(1);
});
