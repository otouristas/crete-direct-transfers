import { pickupTimeZone, pickupClockToDate } from "../../packages/mobile-shared/src/pickup-time";
import {
  getQuickPickGroups,
  matchRouteSlug,
  searchPlaces,
  type PlaceResult,
} from "@/lib/place-search";
import { quoteHourly, quoteTrip } from "@/lib/pricing";
import { fetchTripRoute } from "@/lib/trip-route";
import type { VehicleClass } from "@/data/routes";

export type MobilePlace = PlaceResult;

export async function runPlacesSearch(input: {
  query?: string;
  limit?: number;
  contextPlace?: PlaceResult | null;
}): Promise<{
  places: PlaceResult[];
  groups?: { key: string; label: string; places: PlaceResult[] }[];
}> {
  const query = (input.query ?? "").trim();
  const limit = input.limit ?? 10;
  if (!query) {
    const raw = getQuickPickGroups(10, undefined, input.contextPlace);
    return {
      places: [],
      groups: raw.map((g) => ({
        key: g.kind,
        label: g.label,
        places: g.places,
      })),
    };
  }
  const places = await searchPlaces(query, limit, input.contextPlace);
  // Prefer exact IATA airport codes (HER, CHQ, …) over fuzzy local/route-end hits.
  if (/^[A-Za-z]{3}$/.test(query)) {
    const code = query.toUpperCase();
    places.sort((a, b) => {
      const as = a.iata === code || a.id === `airport:${code}` ? 1 : 0;
      const bs = b.iata === code || b.id === `airport:${code}` ? 1 : 0;
      if (bs !== as) return bs - as;
      const al = a.kind === "airport" ? 1 : 0;
      const bl = b.kind === "airport" ? 1 : 0;
      return bl - al;
    });
  }
  return { places };
}

export async function runPlacesQuote(input: {
  service?: "transfer" | "hourly";
  from?: PlaceResult | null;
  to?: PlaceResult | null;
  vehicleClass?: VehicleClass;
  hours?: number;
  pickupAt?: string | null;
}): Promise<{
  priceCents: number | null;
  routeSlug: string | null;
  distanceKm: number | null;
  durationMin: number | null;
  source: "fixed" | "distance" | "hourly" | null;
  market: string;
  countryCode: string | null;
  geometry: [number, number][] | null;
  routeSource: "road" | "estimated" | null;
}> {
  const service = input.service ?? "transfer";
  const vehicleClass = (input.vehicleClass ?? "economy") as VehicleClass;
  const pickupAt = input.pickupAt
    ? pickupClockToDate(
        input.pickupAt,
        pickupTimeZone(input.from?.countryCode || input.to?.countryCode),
      ) || undefined
    : undefined;
  const market =
    input.from?.countryCode === "ES" || input.to?.countryCode === "ES"
      ? "spain"
      : input.from?.countryCode === "IT" || input.to?.countryCode === "IT"
        ? "italy"
        : "greece";
  const countryCode = input.from?.countryCode ?? input.to?.countryCode ?? null;

  if (service === "hourly") {
    const q = quoteHourly({
      hours: input.hours ?? 2,
      vehicleClass,
      pickupAt,
      timeZone: pickupTimeZone(countryCode),
    });
    return {
      priceCents: q ? Math.round(q.totalEur * 100) : null,
      routeSlug: null,
      distanceKm: null,
      durationMin: null,
      source: q ? "hourly" : null,
      market,
      countryCode,
      geometry: null,
      routeSource: null,
    };
  }

  const matched = matchRouteSlug(input.from ?? null, input.to ?? null) ?? null;
  let distanceKm: number | undefined;
  let durationMin: number | undefined;
  let geometry: [number, number][] | null = null;
  let routeSource: "road" | "estimated" | null = null;

  if (
    input.from?.lat != null &&
    input.from?.lng != null &&
    input.to?.lat != null &&
    input.to?.lng != null
  ) {
    const est = await fetchTripRoute(
      { lat: input.from.lat, lng: input.from.lng },
      { lat: input.to.lat, lng: input.to.lng },
    );
    distanceKm = est.distanceKm;
    durationMin = est.durationMin;
    geometry = est.geometry;
    routeSource = est.source;
  }

  const q = quoteTrip({
    routeSlug: matched ?? undefined,
    distanceKm,
    durationMin,
    vehicleClass,
    pickupAt,
    timeZone: pickupTimeZone(countryCode),
  });

  return {
    priceCents: q ? Math.round(q.totalEur * 100) : null,
    routeSlug: matched,
    distanceKm: distanceKm ?? null,
    durationMin: durationMin ?? null,
    source: q?.source ?? null,
    market,
    countryCode,
    geometry,
    routeSource,
  };
}

export async function runReverseGeocode(input: {
  lat: number;
  lng: number;
}): Promise<{ address: string; place: PlaceResult }> {
  const fallback = `${input.lat.toFixed(5)}, ${input.lng.toFixed(5)}`;
  let address = fallback;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${input.lat}&lon=${input.lng}&zoom=17`,
      {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "User-Agent": "TransferAround/1.0 (places-api)",
        },
      },
    );
    clearTimeout(timer);
    if (res.ok) {
      const data = (await res.json()) as { display_name?: string };
      if (data.display_name) address = data.display_name;
    }
  } catch {
    /* keep fallback */
  }

  const place: PlaceResult = {
    id: `map:${input.lat.toFixed(5)}:${input.lng.toFixed(5)}`,
    label: address,
    kind: "address",
    lat: input.lat,
    lng: input.lng,
  };
  return { address, place };
}
