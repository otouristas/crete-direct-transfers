import { createMobileSupabase } from "@transferaround/mobile-shared";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

export const supabase = createMobileSupabase({
  supabaseUrl: SUPABASE_URL || "https://placeholder.supabase.co",
  supabaseAnonKey: SUPABASE_ANON_KEY || "placeholder",
});
