/**
 * Flight tracking helpers.
 * Live lookups go through a server function (Aviationstack + FLIGHT_API_KEY).
 * Without a key, callers still get a structured stub so UI/waiting clocks work.
 */

import { lookupFlightStatus } from "@/functions/flights";
import { BOOKING_POLICY } from "@/lib/booking-policy";

export type FlightStatus = {
  flightNumber: string;
  status: "scheduled" | "active" | "landed" | "cancelled" | "unknown";
  scheduledArrival: string | null;
  estimatedArrival: string | null;
  source: "live" | "stub";
};

export function normalizeFlightNumber(n: string): string {
  return n.replace(/\s+/g, "").toUpperCase();
}

export async function lookupFlight(flightNumber: string): Promise<FlightStatus> {
  try {
    return await lookupFlightStatus({ data: { flightNumber } });
  } catch {
    return {
      flightNumber: normalizeFlightNumber(flightNumber),
      status: "scheduled",
      scheduledArrival: null,
      estimatedArrival: null,
      source: "stub",
    };
  }
}

/** Free wait window: 60 min airports/ports (flight), 30 min hotels/addresses. */
export function waitMinutesForBooking(input: {
  flightNumber?: string | null;
  pickupAddress?: string | null;
  routeSlug?: string | null;
}): number {
  const flight = (input.flightNumber ?? "").trim();
  if (flight) return BOOKING_POLICY.waitMinutesAirportPort;

  const hay = `${input.pickupAddress ?? ""} ${input.routeSlug ?? ""}`.toLowerCase();
  if (
    /(airport|aiport|αεροδρ|aeroporto|flughafen|aéroport|port|λιμάν|ferry|harbour|harbor)/i.test(
      hay,
    )
  ) {
    return BOOKING_POLICY.waitMinutesAirportPort;
  }
  return BOOKING_POLICY.waitMinutesHotelAddress;
}

/** Extend free wait clock when a tracked flight is delayed past pickup. */
export function effectiveWaitEnd(input: {
  pickupAt: string;
  waitMinutes: number;
  estimatedArrival?: string | null;
}): Date {
  const base = new Date(new Date(input.pickupAt).getTime() + input.waitMinutes * 60_000);
  if (!input.estimatedArrival) return base;
  const eta = new Date(input.estimatedArrival);
  if (Number.isNaN(eta.getTime())) return base;
  const etaPlus = new Date(eta.getTime() + input.waitMinutes * 60_000);
  return etaPlus > base ? etaPlus : base;
}
