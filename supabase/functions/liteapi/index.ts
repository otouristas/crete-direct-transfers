import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const API_BASE = "https://api.liteapi.travel/v3.0";
const BOOK_BASE = "https://book.liteapi.travel/v3.0";

const cors = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, content-type, apikey, x-client-info",
  "access-control-allow-methods": "POST, OPTIONS",
};

async function liteFetch(
  base: string,
  path: string,
  init?: RequestInit & { query?: Record<string, string> },
) {
  const key = Deno.env.get("LITE_API_KEY") || Deno.env.get("LITEAPI_API_KEY");
  if (!key) {
    return new Response(JSON.stringify({ error: "LITE_API_KEY not configured" }), {
      status: 503,
      headers: { ...cors, "content-type": "application/json" },
    });
  }
  const url = new URL(path.startsWith("http") ? path : `${base}${path}`);
  if (init?.query) {
    for (const [k, v] of Object.entries(init.query)) url.searchParams.set(k, v);
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
  return new Response(text || JSON.stringify({ error: "empty" }), {
    status: res.status,
    headers: { ...cors, "content-type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method not allowed" }), {
      status: 405,
      headers: { ...cors, "content-type": "application/json" },
    });
  }

  try {
    const body = (await req.json()) as Record<string, unknown> & { action?: string };
    const action = String(body.action || "");

    if (
      ["hotel-book", "flight-book"].includes(action) &&
      Deno.env.get("TRAVEL_BOOKING_ENABLED") !== "true"
    )
      return Response.json(
        { error: "Provider checkout is not available yet" },
        { status: 503, headers: cors },
      );
    switch (action) {
      case "places":
        return liteFetch(API_BASE, "/data/places", {
          method: "GET",
          query: {
            textQuery: String(body.textQuery || ""),
            language: "en",
            ...(body.type ? { type: String(body.type) } : {}),
          },
        });
      case "hotel-rates": {
        const payload = {
          occupancies: [{ adults: Number(body.adults ?? 2) }],
          currency: body.currency ?? "EUR",
          guestNationality: body.guestNationality ?? "GR",
          checkin: body.checkin,
          checkout: body.checkout,
          roomMapping: true,
          maxRatesPerHotel: body.maxRatesPerHotel ?? 1,
          includeHotelData: true,
          ...(body.placeId ? { placeId: body.placeId } : {}),
          ...(body.hotelIds ? { hotelIds: body.hotelIds } : {}),
          ...(body.aiSearch ? { aiSearch: body.aiSearch } : {}),
        };
        return liteFetch(API_BASE, "/hotels/rates", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      case "hotel-details":
        return liteFetch(API_BASE, "/data/hotel", {
          method: "GET",
          query: { hotelId: String(body.hotelId || ""), timeout: "8" },
        });
      case "hotel-reviews":
        return liteFetch(API_BASE, "/data/reviews", {
          method: "GET",
          query: {
            hotelId: String(body.hotelId || ""),
            limit: String(body.limit ?? 12),
          },
        });
      case "hotel-prebook":
        return liteFetch(BOOK_BASE, "/rates/prebook", {
          method: "POST",
          body: JSON.stringify({ usePaymentSdk: true, offerId: body.offerId }),
        });
      case "hotel-book":
        return liteFetch(BOOK_BASE, "/rates/book", {
          method: "POST",
          body: JSON.stringify({
            prebookId: body.prebookId,
            holder: body.holder,
            payment: { method: "TRANSACTION_ID", transactionId: body.transactionId },
            guests: body.guests ?? [
              {
                occupancyNumber: 1,
                ...(body.holder as object),
              },
            ],
          }),
        });
      case "flight-rates":
        return liteFetch(API_BASE, "/flights/rates", {
          method: "POST",
          body: JSON.stringify({
            legs: body.legs,
            adults: body.adults ?? 1,
            children: body.children ?? 0,
            infants: body.infants ?? 0,
            currency: body.currency ?? "EUR",
            cabinClass: body.cabinClass ?? "ECONOMY",
            country: body.country ?? "GR",
          }),
        });
      case "flight-prebook":
        return liteFetch(API_BASE, "/flights/prebooks", {
          method: "POST",
          body: JSON.stringify({
            offerId: body.offerId,
            usePaymentSdk: true,
            contact: body.contact,
            passengers: body.passengers,
          }),
        });
      case "flight-book":
        return liteFetch(API_BASE, "/flights/bookings", {
          method: "POST",
          body: JSON.stringify({
            prebookId: body.prebookId,
            payment: { method: "TRANSACTION_ID", transactionId: body.transactionId },
          }),
        });
      default:
        return new Response(JSON.stringify({ error: "unknown action" }), {
          status: 400,
          headers: { ...cors, "content-type": "application/json" },
        });
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "error" }), {
      status: 500,
      headers: { ...cors, "content-type": "application/json" },
    });
  }
});
