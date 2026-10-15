import type { Json } from "@/integrations/supabase/types";
/**
 * Nuitee Connect (LiteAPI) server client.
 * Key stays server-side only — never EXPO_PUBLIC / VITE_.
 * When LITE_API_KEY is unset locally, falls back to the deployed `liteapi` Edge Function
 * (which already has the secret).
 */

const API_BASE = "https://api.liteapi.travel/v3.0";
const BOOK_BASE = "https://book.liteapi.travel/v3.0";

export function getLiteApiKey(): string | null {
  return process.env.LITE_API_KEY || process.env.LITEAPI_API_KEY || null;
}

export class LiteApiError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

function edgeActionFor(base: string, path: string, method: string): string | null {
  const p = path.replace(/\?.*$/, "");
  if (method === "GET" && p === "/data/places") return "places";
  if (method === "GET" && p.startsWith("/data/places/")) return "place";
  if (method === "POST" && p === "/hotels/rates") return "hotel-rates";
  if (method === "GET" && p === "/data/hotel") return "hotel-details";
  if (method === "GET" && p === "/data/reviews") return "hotel-reviews";
  if (method === "POST" && base === BOOK_BASE && p === "/rates/prebook") return "hotel-prebook";
  if (method === "POST" && base === BOOK_BASE && p === "/rates/book") return "hotel-book";
  if (method === "POST" && p === "/flights/rates") return "flight-rates";
  if (method === "POST" && p === "/flights/prebooks") return "flight-prebook";
  if (method === "POST" && p === "/flights/bookings") return "flight-book";
  return null;
}

async function liteFetchViaEdge<T>(action: string, payload: Record<string, Json>): Promise<T> {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new LiteApiError(
      "LITE_API_KEY not configured (and no Supabase Edge fallback)",
      503,
      null,
    );
  }
  const headers: Record<string, string> = {
    "content-type": "application/json",
    apikey: key,
  };
  if (key.startsWith("eyJ")) headers.Authorization = `Bearer ${key}`;
  const res = await fetch(`${url}/functions/v1/liteapi`, {
    method: "POST",
    headers,
    body: JSON.stringify({ action, ...payload }),
  });
  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }
  if (!res.ok) {
    const errObj = data as { error?: string } | null;
    throw new LiteApiError(errObj?.error || `LiteAPI edge ${res.status}`, res.status, data);
  }
  return data as T;
}

async function liteFetch<T>(
  base: string,
  path: string,
  init?: RequestInit & { query?: Record<string, string | undefined> },
): Promise<T> {
  const key = getLiteApiKey();
  const method = (init?.method || "GET").toUpperCase();

  if (!key) {
    const action = edgeActionFor(base, path, method);
    if (!action) throw new LiteApiError("LITE_API_KEY not configured", 503, null);
    const payload: Record<string, Json> = {};
    if (init?.query) Object.assign(payload, init.query);
    if (path.startsWith("/data/places/") && path !== "/data/places") {
      payload.placeId = decodeURIComponent(path.replace("/data/places/", ""));
    }
    if (init?.body && typeof init.body === "string") {
      try {
        Object.assign(payload, JSON.parse(init.body) as Record<string, Json>);
      } catch {
        /* ignore */
      }
    }
    // hotel-details uses hotelId query
    if (action === "hotel-details" && init?.query?.hotelId) {
      payload.hotelId = init.query.hotelId;
    }
    return liteFetchViaEdge<T>(action, payload);
  }

  const url = new URL(path.startsWith("http") ? path : `${base}${path}`);
  if (init?.query) {
    for (const [k, v] of Object.entries(init.query)) {
      if (v != null && v !== "") url.searchParams.set(k, v);
    }
  }

  const { query: _q, ...rest } = init ?? {};
  const res = await fetch(url.toString(), {
    ...rest,
    headers: {
      accept: "application/json",
      "X-API-Key": key,
      ...(rest.body ? { "content-type": "application/json" } : {}),
      ...(rest.headers as Record<string, string> | undefined),
    },
  });

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }

  if (!res.ok) {
    const errObj = data as { error?: { message?: string; description?: string } } | null;
    const msg = errObj?.error?.message || errObj?.error?.description || `LiteAPI ${res.status}`;
    throw new LiteApiError(msg, res.status, data);
  }

  return data as T;
}

// —— Hotels / places ——

export type LitePlace = {
  placeId: string;
  displayName: string;
  formattedAddress?: string;
  types?: string[];
};

export async function searchLitePlaces(textQuery: string, type?: string) {
  return liteFetch<{ data: LitePlace[] }>(API_BASE, "/data/places", {
    method: "GET",
    query: { textQuery, type, language: "en" },
  });
}

export async function getLitePlace(placeId: string) {
  return liteFetch<{ data: Record<string, Json> }>(
    API_BASE,
    `/data/places/${encodeURIComponent(placeId)}`,
    { method: "GET", query: { language: "en" } },
  );
}

export type HotelRatesInput = {
  checkin: string;
  checkout: string;
  adults?: number;
  currency?: string;
  guestNationality?: string;
  placeId?: string;
  hotelIds?: string[];
  aiSearch?: string;
  maxRatesPerHotel?: number;
  roomMapping?: boolean;
  includeHotelData?: boolean;
};

export async function searchHotelRates(input: HotelRatesInput) {
  const body: Record<string, Json> = {
    occupancies: [{ adults: input.adults ?? 2 }],
    currency: input.currency ?? "EUR",
    guestNationality: input.guestNationality ?? "GR",
    checkin: input.checkin,
    checkout: input.checkout,
    roomMapping: input.roomMapping ?? true,
    maxRatesPerHotel: input.maxRatesPerHotel ?? 1,
    includeHotelData: input.includeHotelData ?? true,
  };
  if (input.placeId) body.placeId = input.placeId;
  if (input.hotelIds?.length) body.hotelIds = input.hotelIds;
  if (input.aiSearch) body.aiSearch = input.aiSearch;

  return liteFetch<Record<string, Json>>(API_BASE, "/hotels/rates", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getHotelDetails(hotelId: string) {
  return liteFetch<{ data: Record<string, Json> }>(API_BASE, "/data/hotel", {
    method: "GET",
    query: { hotelId, timeout: "8" },
  });
}

export async function getHotelReviews(hotelId: string, limit = 12) {
  return liteFetch<{ data: Array<Record<string, Json>> }>(API_BASE, "/data/reviews", {
    method: "GET",
    query: { hotelId, limit: String(limit) },
  });
}

export async function prebookHotel(offerId: string) {
  return liteFetch<{ data: Record<string, Json> }>(BOOK_BASE, "/rates/prebook", {
    method: "POST",
    body: JSON.stringify({ usePaymentSdk: true, offerId }),
  });
}

export async function bookHotel(input: {
  prebookId: string;
  transactionId: string;
  holder: { firstName: string; lastName: string; email: string };
  guests?: Array<{
    occupancyNumber: number;
    firstName: string;
    lastName: string;
    email: string;
  }>;
}) {
  const guests = input.guests ?? [
    {
      occupancyNumber: 1,
      firstName: input.holder.firstName,
      lastName: input.holder.lastName,
      email: input.holder.email,
    },
  ];
  if (process.env.TRAVEL_BOOKING_ENABLED !== "true")
    throw new LiteApiError(
      "Hotel and flight checkout is not available yet. Private transfer booking is available.",
      503,
      null,
    );
  return liteFetch<{ data: Record<string, Json> }>(BOOK_BASE, "/rates/book", {
    method: "POST",
    body: JSON.stringify({
      prebookId: input.prebookId,
      holder: input.holder,
      payment: { method: "TRANSACTION_ID", transactionId: input.transactionId },
      guests,
    }),
  });
}

// —— Flights ——

export type FlightRatesInput = {
  legs: Array<{ origin: string; destination: string; date: string; direction?: string }>;
  adults: number;
  children?: number;
  infants?: number;
  currency?: string;
  cabinClass?: string;
  country?: string;
};

export async function searchFlightRates(input: FlightRatesInput) {
  return liteFetch<Record<string, Json>>(API_BASE, "/flights/rates", {
    method: "POST",
    body: JSON.stringify({
      legs: input.legs,
      adults: input.adults,
      children: input.children ?? 0,
      infants: input.infants ?? 0,
      currency: input.currency ?? "EUR",
      cabinClass: input.cabinClass ?? "ECONOMY",
      country: input.country ?? "GR",
    }),
  });
}

export async function prebookFlight(input: {
  offerId: string;
  contact: { firstName: string; lastName: string; email: string; phone?: string };
  passengers: Array<Record<string, Json>>;
  usePaymentSdk?: boolean;
}) {
  return liteFetch<{ data: Record<string, Json> }>(API_BASE, "/flights/prebooks", {
    method: "POST",
    body: JSON.stringify({
      offerId: input.offerId,
      usePaymentSdk: input.usePaymentSdk ?? true,
      contact: input.contact,
      passengers: input.passengers,
    }),
  });
}

export async function bookFlight(input: {
  prebookId: string;
  transactionId?: string;
  payment?: { method: string; transactionId?: string };
}) {
  if (process.env.TRAVEL_BOOKING_ENABLED !== "true")
    throw new LiteApiError(
      "Hotel and flight checkout is not available yet. Private transfer booking is available.",
      503,
      null,
    );
  return liteFetch<{ data: Record<string, Json> }>(API_BASE, "/flights/bookings", {
    method: "POST",
    body: JSON.stringify({
      prebookId: input.prebookId,
      payment: input.payment ?? {
        method: "TRANSACTION_ID",
        transactionId: input.transactionId,
      },
    }),
  });
}
