export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * API base for places/quote/dispatch/stripe.
 * On rider web at localhost, prefer local Vite (:8080) so new /api/places/*
 * routes work during development even if .env still points at production.
 */
export function getApiUrl() {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");
  const onLocalWeb =
    Platform.OS === "web" &&
    typeof window !== "undefined" &&
    typeof window.location !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  if (onLocalWeb) {
    if (fromEnv && /localhost|127\.0\.0\.1/.test(fromEnv)) return fromEnv;
    return "http://localhost:8080";
  }
  return fromEnv || "https://transferaround.com";
}

/** @deprecated Prefer getApiUrl() so localhost web resolves after window exists. */
export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? "https://transferaround.com").replace(
  /\/$/,
  "",
);

/** Temporary: browse UI without signing in. Set false to restore auth gate. */
export const SKIP_AUTH = false;
import { Platform } from "react-native";
