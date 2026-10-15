import { postJson } from "./api";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";
import type { MobilePlace, PlaceGroup } from "@transferaround/mobile-shared/ui";
import { resolveCoords } from "@transferaround/mobile-shared/ui";
import * as Location from "expo-location";
import { PRESET_ROUTES } from "./presets";

const knownPlaces: MobilePlace[] = Array.from(
  new Map(
    PRESET_ROUTES.flatMap((r) => [r.from, r.to]).map((label) => [
      label,
      {
        id: `known:${label}`,
        label,
        kind: label.includes("Airport") ? ("airport" as const) : ("destination" as const),
        ...resolveCoords(label),
        countryCode: label.includes("Barcelona") ? "ES" : "GR",
      },
    ]),
  ).values(),
);

export type PlaceQuote = {
  priceCents: number | null;
  routeSlug: string | null;
  distanceKm: number | null;
  durationMin: number | null;
  source: "fixed" | "distance" | "hourly" | null;
  market: string;
  countryCode: string | null;
  geometry?: [number, number][] | null;
  routeSource?: "road" | "estimated" | null;
};

export async function searchPlacesMobile(
  query: string,
  contextPlace?: MobilePlace | null,
): Promise<{ places: MobilePlace[]; groups?: PlaceGroup[] }> {
  try {
    return await postJson("/api/places/search", {
      query,
      limit: 10,
      contextPlace: contextPlace ?? null,
    });
  } catch {
    const q = query.trim();
    if (!q)
      return {
        places: [],
        groups: [{ key: "known", label: "Airports and cities", places: knownPlaces }],
      };
    const local = knownPlaces.filter(
      (p) =>
        p.label.toLowerCase().includes(q.toLowerCase()) ||
        p.label.match(/\(([A-Z]{3})\)/)?.[1] === q.toUpperCase(),
    );
    if (local.length) return { places: local };
    if (q.length < 3) return { places: [] };
    // Apple's native geocoder keeps address lookup usable when the web API is unavailable.
    const results = await Location.geocodeAsync(q);
    return {
      places: results.slice(0, 5).map((p, i) => ({
        id: `native:${p.latitude},${p.longitude}:${i}`,
        label: q,
        kind: "address",
        lat: p.latitude,
        lng: p.longitude,
      })),
    };
  }
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
