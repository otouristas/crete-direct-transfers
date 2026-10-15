import { createClient } from "@supabase/supabase-js";
// Optional development-only fixture. The production project uses isolated practice sessions instead.
const url = process.env.DEMO_SUPABASE_URL;
const serviceKey = process.env.DEMO_SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.DEMO_EMAIL;
const password = process.env.DEMO_PASSWORD;
const role = process.env.DEMO_ROLE || "customer";
if (process.env.DEMO_ENVIRONMENT !== "development" || !url || url.includes("mlrgwkgiazmrsfjhfrnq"))
  throw new Error(
    "Use a separate development Supabase project. For this website, use /apps practice sessions instead.",
  );
if (
  !serviceKey ||
  !email ||
  !password ||
  password.length < 12 ||
  !["customer", "driver"].includes(role)
)
  throw new Error(
    "Set development credentials, DEMO_EMAIL, DEMO_PASSWORD (12+ characters), and DEMO_ROLE.",
  );
const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const { data, error } = await admin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  user_metadata: {
    full_name: role === "driver" ? "Practice Driver" : "Practice Traveler",
    signup_role: role,
  },
});
if (error) throw error; // Never reset or overwrite an existing user's credentials.
if (role === "driver") {
  const { error: writeError } = await admin
    .from("driver_profiles")
    .update({
      vehicle_class: "comfort",
      vehicle_make_model: "Mercedes E-Class",
      vehicle_plate: "DEMO",
      approval_status: "approved",
      is_online: false,
    })
    .eq("id", data.user.id);
  if (writeError) throw writeError;
}
console.log(
  JSON.stringify({
    ok: true,
    userId: data.user.id,
    role,
    note: "Development fixture created. Credentials are not printed.",
  }),
);
