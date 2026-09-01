import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { quote, quoteHourly, quoteTrip, type Extras, type TripType } from "@/lib/pricing";
import type { VehicleClass } from "@/data/routes";
import { getAirport } from "@/data/airports";
import { getAirportRoute } from "@/data/airport-routes";
import { getRoute } from "@/data/routes";

export type QuoteRow = Tables<"quotes">;

export type CreateQuoteInput = {
  service?: "transfer" | "hourly";
  routeSlug: string;
  vehicleClass: VehicleClass;
  tripType?: TripType;
  extras?: Extras;
  pickupAt?: string | null;
  returnAt?: string | null;
  distanceKm?: number | null;
  durationMin?: number | null;
  hours?: number | null;
  market?: string;
  airportSlug?: string | null;
  airportRouteSlug?: string | null;
};

function inputsHash(input: CreateQuoteInput & { priceCents: number }): string {
  return btoa(
    unescape(
      encodeURIComponent(
        JSON.stringify({
          s: input.service ?? "transfer",
          r: input.routeSlug,
          v: input.vehicleClass,
          t: input.tripType ?? "oneway",
          e: input.extras ?? {},
          p: input.pickupAt ?? null,
          ret: input.returnAt ?? null,
          d: input.distanceKm ?? null,
          h: input.hours ?? null,
          m: input.market ?? "greece",
          c: input.priceCents,
        }),
      ),
    ),
  ).slice(0, 64);
}

function resolveBookable(input: CreateQuoteInput): "instant" | "quote" {
  if (input.airportSlug) {
    if (input.airportRouteSlug) {
      return getAirportRoute(input.airportSlug, input.airportRouteSlug)?.bookable ?? "quote";
    }
    return getAirport(input.airportSlug)?.bookable ?? "quote";
  }
  if (getRoute(input.routeSlug)) return "instant";
  return "instant";
}

/** Compute price locally (same engine as the booking UI). */
export function computeQuotePrice(input: CreateQuoteInput): {
  priceCents: number;
  breakdown: PriceLine[];
  bookableMode: "instant" | "quote";
} | null {
  const pickupAt = input.pickupAt ? new Date(input.pickupAt) : undefined;
  const returnAt = input.returnAt ? new Date(input.returnAt) : undefined;
  const bookableMode = resolveBookable(input);

  if (input.service === "hourly") {
    const h = quoteHourly({
      hours: input.hours ?? 2,
      vehicleClass: input.vehicleClass,
      pickupAt,
    });
    if (!h) return null;
    return {
      priceCents: h.totalEur * 100,
      breakdown: h.breakdown,
      bookableMode,
    };
  }

  if (typeof input.distanceKm === "number" && input.distanceKm > 0 && !getRoute(input.routeSlug)) {
    const t = quoteTrip({
      routeSlug: input.routeSlug,
      vehicleClass: input.vehicleClass,
      pickupAt,
      extras: input.extras,
      tripType: input.tripType,
      returnAt,
      distanceKm: input.distanceKm,
      durationMin: input.durationMin ?? undefined,
    });
    if (!t) return null;
    return {
      priceCents: t.totalEur * 100,
      breakdown: t.breakdown,
      bookableMode,
    };
  }

  const q = quote({
    routeSlug: input.routeSlug,
    vehicleClass: input.vehicleClass,
    pickupAt,
    extras: input.extras,
    tripType: input.tripType,
    returnAt,
  });
  if (!q) {
    // Distance fallback when route slug is synthetic
    if (typeof input.distanceKm === "number") {
      const t = quoteTrip({
        routeSlug: input.routeSlug,
        vehicleClass: input.vehicleClass,
        pickupAt,
        extras: input.extras,
        tripType: input.tripType,
        returnAt,
        distanceKm: input.distanceKm,
        durationMin: input.durationMin ?? undefined,
      });
      if (!t) return null;
      return {
        priceCents: t.totalEur * 100,
        breakdown: t.breakdown,
        bookableMode,
      };
    }
    return null;
  }

  return {
    priceCents: q.totalEur * 100,
    breakdown: q.breakdown,
    bookableMode,
  };
}

/** Persist a server-validated quote row; returns the quote id + locked price. */
export async function createAndPersistQuote(
  input: CreateQuoteInput,
): Promise<{ quoteId: string; priceCents: number; bookableMode: "instant" | "quote" }> {
  const computed = computeQuotePrice(input);
  if (!computed) throw new Error("quote_unavailable");

  const hash = inputsHash({ ...input, priceCents: computed.priceCents });
  const { data, error } = await supabase.rpc("create_quote_record", {
    p_route_slug: input.routeSlug,
    p_vehicle_class: input.vehicleClass,
    p_trip_type: input.tripType ?? "oneway",
    p_extras: (input.extras ?? {}) as never,
    p_pickup_at: (input.pickupAt ?? null) as unknown as string,
    p_return_at: (input.returnAt ?? null) as unknown as string,
    p_distance_km: (input.distanceKm ?? null) as unknown as number,
    p_hours: (input.hours ?? null) as unknown as number,
    p_service: input.service ?? "transfer",
    p_market: input.market ?? "greece",
    p_bookable_mode: computed.bookableMode,
    p_price_cents: computed.priceCents,
    p_breakdown: computed.breakdown as never,
    p_inputs_hash: hash,
    p_ttl_minutes: 30,
  });

  if (error || !data) throw error ?? new Error("quote_persist_failed");
  const row = data as unknown as QuoteRow;
  return {
    quoteId: row.id,
    priceCents: row.price_cents,
    bookableMode: row.bookable_mode as "instant" | "quote",
  };
}

/** Fetch a quote and ensure it has not expired. */
export async function getValidQuote(quoteId: string): Promise<QuoteRow | null> {
  const { data, error } = await supabase.from("quotes").select("*").eq("id", quoteId).maybeSingle();
  if (error || !data) return null;
  const row = data as QuoteRow;
  if (new Date(row.expires_at).getTime() < Date.now()) return null;
  return row;
}
