import { postJson } from "./api";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";
import type { MobilePlace, PlaceGroup } from "@transferaround/mobile-shared/ui";

export type PlaceQuote = {
  priceCents: number | null;
  routeSlug: string | null;
  distanceKm: number | null;
  durationMin: number | null;
  source: "fixed" | "distance" | "hourly" | null;
  market: string;
  countryCode: string | null;
};

export async function searchPlacesMobile(
  query: string,
  contextPlace?: MobilePlace | null,
): Promise<{ places: MobilePlace[]; groups?: PlaceGroup[] }> {
  return postJson("/api/places/search", {
    query,
    limit: 10,
    contextPlace: contextPlace ?? null,
  });
}

export async function quotePlacesMobile(input: {
  service: "transfer" | "hourly";
  from: MobilePlace | null;
  to: MobilePlace | null;
  vehicleClass: string;
  hours?: number;
  pickupAt?: string | null;
}): Promise<PlaceQuote> {
  return postJson("/api/places/quote", input);
}

export async function reverseGeocodeMobile(
  lat: number,
  lng: number,
): Promise<{ address: string; place: MobilePlace }> {
  return postJson("/api/places/reverse", { lat, lng });
}

/** Retry payment for an existing booking through the shared secure service. */
export async function createStripeCheckoutMobile(input: {
  bookingId: string;
  priceCents: number;
  customerEmail: string;
  description: string;
  accessToken?: string | null;
}): Promise<{ url?: string | null; skipped?: boolean; error?: string }> {
  const { accessToken, ...payload } = input;
  return postJson("/api/stripe/checkout", payload, accessToken || undefined);
}
