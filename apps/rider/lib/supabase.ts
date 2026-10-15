import { createMobileSupabase } from "@transferaround/mobile-shared";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, Platform } from "react-native";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

export const supabase = createMobileSupabase({
  supabaseUrl: SUPABASE_URL || "https://placeholder.supabase.co",
  supabaseAnonKey: SUPABASE_ANON_KEY || "placeholder",
  storage: Platform.OS === "web" ? undefined : AsyncStorage,
});

if (Platform.OS !== "web") {
  AppState.addEventListener("change", (state) => {
    if (state === "active") supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}
