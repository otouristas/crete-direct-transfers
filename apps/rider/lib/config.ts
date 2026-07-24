export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? "https://transferaround.com").replace(
  /\/$/,
  "",
);

/** Temporary: browse UI without signing in. Set false to restore auth gate. */
export const SKIP_AUTH = true;
