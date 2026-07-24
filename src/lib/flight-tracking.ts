/**
 * Flight tracking helpers.
 * When VITE_FLIGHT_API_URL + VITE_FLIGHT_API_KEY are set, lookups hit that API.
 * Otherwise we return a structured stub so UI/waiting clocks still work.
 */

export type FlightStatus = {
  flightNumber: string;
  status: "scheduled" | "active" | "landed" | "cancelled" | "unknown";
  scheduledArrival: string | null;
  estimatedArrival: string | null;
  source: "live" | "stub";
};

function normalizeFlight(n: string): string {
  return n.replace(/\s+/g, "").toUpperCase();
}

export async function lookupFlight(flightNumber: string): Promise<FlightStatus> {
  const normalized = normalizeFlight(flightNumber);
  const base = import.meta.env.VITE_FLIGHT_API_URL as string | undefined;
  const key = import.meta.env.VITE_FLIGHT_API_KEY as string | undefined;

  if (base && key) {
    try {
      const res = await fetch(
        `${base.replace(/\/$/, "")}/flights/${encodeURIComponent(normalized)}`,
        { headers: { Authorization: `Bearer ${key}` } },
      );
      if (res.ok) {
        const json = (await res.json()) as Partial<FlightStatus>;
        return {
          flightNumber: normalized,
          status: json.status ?? "unknown",
          scheduledArrival: json.scheduledArrival ?? null,
          estimatedArrival: json.estimatedArrival ?? null,
          source: "live",
        };
      }
    } catch {
      /* fall through to stub */
    }
  }

  return {
    flightNumber: normalized,
    status: "scheduled",
    scheduledArrival: null,
    estimatedArrival: null,
    source: "stub",
  };
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
  const etaPlus = new Date(eta.getTime() + input.waitMinutes * 60_000);
  return etaPlus > base ? etaPlus : base;
}
