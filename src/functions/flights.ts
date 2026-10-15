import { createServerFn } from "@tanstack/react-start";
import type { FlightStatus } from "@/lib/flight-tracking";

type AviationArrival = {
  scheduled?: string | null;
  estimated?: string | null;
  actual?: string | null;
};

type AviationFlight = {
  flight_status?: string | null;
  flight?: { iata?: string | null; number?: string | null } | null;
  arrival?: AviationArrival | null;
};

type AviationResponse = {
  data?: AviationFlight[];
  error?: { code?: string; message?: string };
};

function normalizeFlight(n: string): string {
  return n.replace(/\s+/g, "").toUpperCase();
}

function mapStatus(raw: string | null | undefined): FlightStatus["status"] {
  const s = (raw ?? "").toLowerCase();
  if (s === "scheduled") return "scheduled";
  if (s === "active" || s === "en-route" || s === "enroute") return "active";
  if (s === "landed") return "landed";
  if (s === "cancelled" || s === "canceled") return "cancelled";
  return "unknown";
}

function toIso(value: string | null | undefined): string | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function stub(flightNumber: string): FlightStatus {
  return {
    flightNumber,
    status: "scheduled",
    scheduledArrival: null,
    estimatedArrival: null,
    source: "stub",
  };
}

/** Server-side Aviationstack lookup. Key never leaves the server. */
export async function lookupFlightServer(flightNumber: string): Promise<FlightStatus> {
  const normalized = normalizeFlight(flightNumber);
  if (!normalized) return stub(normalized);

  const key = process.env.FLIGHT_API_KEY;
  if (!key) {
    console.info("[flights] FLIGHT_API_KEY missing — returning stub");
    return stub(normalized);
  }

  const base = (process.env.FLIGHT_API_URL ?? "https://api.aviationstack.com/v1").replace(
    /\/$/,
    "",
  );
  const url = new URL(`${base}/flights`);
  url.searchParams.set("access_key", key);
  url.searchParams.set("flight_iata", normalized);
  url.searchParams.set("limit", "1");

  try {
    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      console.warn("[flights] Aviationstack HTTP", res.status);
      return stub(normalized);
    }
    const json = (await res.json()) as AviationResponse;
    if (json.error) {
      console.warn("[flights] Aviationstack error", json.error.code, json.error.message);
      return stub(normalized);
    }
    const row = json.data?.[0];
    if (!row) return stub(normalized);

    const scheduled = toIso(row.arrival?.scheduled);
    const estimated = toIso(row.arrival?.estimated) ?? toIso(row.arrival?.actual) ?? scheduled;

    return {
      flightNumber: normalizeFlight(row.flight?.iata ?? normalized),
      status: mapStatus(row.flight_status),
      scheduledArrival: scheduled,
      estimatedArrival: estimated,
      source: "live",
    };
  } catch (err) {
    console.warn("[flights] lookup failed", err);
    return stub(normalized);
  }
}

export const lookupFlightStatus = createServerFn({ method: "POST" })
  .inputValidator((d: { flightNumber: string }) => d)
  .handler(async ({ data }) => lookupFlightServer(data.flightNumber));
