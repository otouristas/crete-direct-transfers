import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      if (request.method === "POST" && url.pathname === "/api/ride-ai") {
        const { runRideAI } = await import("./server/ride-ai");
        return runRideAI(request);
      }
      if (request.method === "POST" && url.pathname === "/api/notifications/flush") {
        const body = (await request.json()) as { bookingId?: string; isTest?: boolean };
        if (!body.bookingId || !/^[0-9a-f-]{36}$/i.test(body.bookingId))
          return Response.json({ error: "Invalid transfer reference" }, { status: 400 });
        const { authorizePushFlush, processNativePush } = await import("./server/native-push");
        if (!(await authorizePushFlush(request, body.bookingId, body.isTest === true)))
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        const result = await processNativePush();
        return Response.json(result, { status: result.ok ? 200 : 503 });
      }
      if (request.method === "POST" && url.pathname === "/api/stripe/webhook") {
        const { handleStripeWebhook } = await import("./server/stripe-checkout");
        const { getServiceSupabase } = await import("./integrations/supabase/service");
        const admin = getServiceSupabase();
        if (!admin || !process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET)
          return Response.json({ error: "Payment service unavailable" }, { status: 503 });
        let result;
        try {
          result = await handleStripeWebhook(
            await request.text(),
            request.headers.get("stripe-signature"),
          );
        } catch {
          return Response.json({ error: "Invalid webhook signature" }, { status: 400 });
        }
        if (!result) return Response.json({ received: true });
        const { data, error } = await admin.rpc("process_stripe_checkout_event", {
          p_event_id: result.eventId,
          p_event_type: result.eventType,
          p_booking_id: result.bookingId,
          p_session_id: result.sessionId,
          p_payment_intent_id: result.paymentIntentId,
          p_amount_total: result.amountTotal,
          p_currency: result.currency,
          p_livemode: result.livemode,
        });
        if (error) return Response.json({ error: "Could not record payment" }, { status: 500 });
        const recorded = data as { ok?: boolean; duplicate?: boolean; error?: string };
        if (!recorded?.ok)
          return Response.json({ error: "Payment details did not match booking" }, { status: 422 });
        if (!recorded.duplicate) {
          const { processEventOutbox } = await import("./server/event-outbox");
          await processEventOutbox().catch((e) => console.error("[paid events]", e));
        }
        return Response.json({ received: true });
      }

      if (request.method === "POST" && url.pathname === "/api/bookings/checkout") {
        const { runBookingCheckout } = await import("./server/booking-checkout");
        try {
          const result = await runBookingCheckout(
            await request.json(),
            request.headers.get("authorization"),
          );
          return Response.json(result, {
            status: result.ok ? 200 : result.status,
            headers: { "access-control-allow-origin": "*" },
          });
        } catch (e) {
          return Response.json(
            { ok: false, error: e instanceof Error ? e.message : "Could not prepare checkout." },
            { status: 500, headers: { "access-control-allow-origin": "*" } },
          );
        }
      }

      if (request.method === "POST" && url.pathname === "/api/events/process") {
        const secret = process.env.DISPATCH_CRON_SECRET;
        if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`)
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        const { processEventOutbox } = await import("./server/event-outbox");
        const result = await processEventOutbox();
        const { processNativePush } = await import("./server/native-push");
        await processNativePush();
        return Response.json(result, { status: result.ok ? 200 : 503 });
      }

      // Cron: expire offer batches + cascade / escalate (Authorization: Bearer DISPATCH_CRON_SECRET)
      if (request.method === "POST" && url.pathname === "/api/dispatch/expire") {
        const secret = process.env.DISPATCH_CRON_SECRET;
        const auth = request.headers.get("authorization");
        if (!secret || auth !== `Bearer ${secret}`) {
          return new Response("unauthorized", { status: 401 });
        }
        const { runExpireAndEscalate } = await import("./server/dispatch");
        const result = await runExpireAndEscalate();
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      }

      // Mobile: notify customer that a driver accepted / was assigned
      if (request.method === "POST" && url.pathname === "/api/dispatch/assigned") {
        const body = (await request.json()) as { bookingId?: string; locale?: string };
        if (!body.bookingId) {
          return new Response(JSON.stringify({ error: "bookingId required" }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }
        const { authorizeBookingRequest } = await import("./server/request-access");
        if (!(await authorizeBookingRequest(request, body.bookingId, "driver")))
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        const { notifyCustomerDriverAssigned } = await import("./server/dispatch");
        await notifyCustomerDriverAssigned(body.bookingId, body.locale);
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      }

      // Mobile / external: start dispatch after booking insert
      if (request.method === "POST" && url.pathname === "/api/dispatch/new") {
        const body = (await request.json()) as {
          bookingId?: string;
          market?: string | null;
          countryCode?: string | null;
          lat?: number | null;
          lng?: number | null;
          locale?: string;
        };
        if (!body.bookingId) {
          return new Response(JSON.stringify({ error: "bookingId required" }), {
            status: 400,
            headers: {
              "content-type": "application/json",
              "access-control-allow-origin": "*",
            },
          });
        }
        const { authorizeBookingRequest } = await import("./server/request-access");
        if (!(await authorizeBookingRequest(request, body.bookingId, "owner")))
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        const { runDispatchNewBooking } = await import("./server/dispatch");
        const result = await runDispatchNewBooking({
          bookingId: body.bookingId,
          market: (body.market as "greece" | "spain" | "italy" | null) ?? null,
          countryCode: body.countryCode ?? null,
          lat: body.lat ?? null,
          lng: body.lng ?? null,
          locale: body.locale,
        });
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: {
            "content-type": "application/json",
            "access-control-allow-origin": "*",
          },
        });
      }

      // Mobile: place search (IATA + hubs + Photon)
      if (request.method === "POST" && url.pathname === "/api/places/search") {
        const body = (await request.json()) as {
          query?: string;
          limit?: number;
          contextPlace?: import("./lib/place-search").PlaceResult | null;
        };
        const { runPlacesSearch } = await import("./server/places");
        const result = await runPlacesSearch(body);
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: {
            "content-type": "application/json",
            "access-control-allow-origin": "*",
          },
        });
      }

      // Mobile: quote from places / route match / distance
      if (request.method === "POST" && url.pathname === "/api/places/quote") {
        const body = (await request.json()) as {
          service?: "transfer" | "hourly";
          from?: import("./lib/place-search").PlaceResult | null;
          to?: import("./lib/place-search").PlaceResult | null;
          vehicleClass?: string;
          hours?: number;
          pickupAt?: string | null;
        };
        const { runPlacesQuote } = await import("./server/places");
        const result = await runPlacesQuote({
          ...body,
          vehicleClass: body.vehicleClass as import("./data/routes").VehicleClass | undefined,
        });
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: {
            "content-type": "application/json",
            "access-control-allow-origin": "*",
          },
        });
      }

      // Mobile: reverse geocode for map pin / GPS
      if (request.method === "POST" && url.pathname === "/api/places/reverse") {
        const body = (await request.json()) as { lat?: number; lng?: number };
        if (body.lat == null || body.lng == null) {
          return new Response(JSON.stringify({ error: "lat/lng required" }), {
            status: 400,
            headers: { "content-type": "application/json", "access-control-allow-origin": "*" },
          });
        }
        const { runReverseGeocode } = await import("./server/places");
        const result = await runReverseGeocode({ lat: body.lat, lng: body.lng });
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: {
            "content-type": "application/json",
            "access-control-allow-origin": "*",
          },
        });
      }

      if (
        request.method === "OPTIONS" &&
        (url.pathname.startsWith("/api/places/") ||
          url.pathname.startsWith("/api/bookings/") ||
          url.pathname.startsWith("/api/stripe/") ||
          url.pathname.startsWith("/api/dispatch/") ||
          url.pathname.startsWith("/api/liteapi/"))
      ) {
        return new Response(null, {
          status: 204,
          headers: {
            "access-control-allow-origin": "*",
            "access-control-allow-methods": "POST, OPTIONS",
            "access-control-allow-headers": "content-type, authorization",
          },
        });
      }

      // Nuitee Connect / LiteAPI proxy (hotels + flights) — key never leaves the server
      if (request.method === "POST" && url.pathname.startsWith("/api/liteapi/")) {
        const action = url.pathname.replace("/api/liteapi/", "");
        const body = await request.json();
        const cors = {
          "content-type": "application/json",
          "access-control-allow-origin": "*",
        };
        try {
          const lite = await import("./server/liteapi");
          let result: unknown;
          switch (action) {
            case "places":
              result = await lite.searchLitePlaces(
                (body as { textQuery: string }).textQuery,
                (body as { type?: string }).type,
              );
              break;
            case "place":
              result = await lite.getLitePlace((body as { placeId: string }).placeId);
              break;
            case "hotel-rates":
              result = await lite.searchHotelRates(
                body as import("./server/liteapi").HotelRatesInput,
              );
              break;
            case "hotel-details":
              result = await lite.getHotelDetails((body as { hotelId: string }).hotelId);
              break;
            case "hotel-reviews":
              result = await lite.getHotelReviews(
                (body as { hotelId: string }).hotelId,
                (body as { limit?: number }).limit,
              );
              break;
            case "hotel-prebook":
              result = await lite.prebookHotel((body as { offerId: string }).offerId);
              break;
            case "hotel-book":
              result = await lite.bookHotel(
                body as {
                  prebookId: string;
                  transactionId: string;
                  holder: { firstName: string; lastName: string; email: string };
                },
              );
              break;
            case "flight-rates":
              result = await lite.searchFlightRates(
                body as import("./server/liteapi").FlightRatesInput,
              );
              break;
            case "flight-prebook":
              result = await lite.prebookFlight(
                body as {
                  offerId: string;
                  contact: { firstName: string; lastName: string; email: string; phone?: string };
                  passengers: Array<Record<string, import("./integrations/supabase/types").Json>>;
                },
              );
              break;
            case "flight-book":
              result = await lite.bookFlight(body as { prebookId: string; transactionId: string });
              break;
            default:
              return new Response(JSON.stringify({ error: "unknown action" }), {
                status: 404,
                headers: cors,
              });
          }
          return new Response(JSON.stringify(result), { status: 200, headers: cors });
        } catch (e) {
          const { LiteApiError } = await import("./server/liteapi");
          const message = e instanceof Error ? e.message : "liteapi_error";
          const status = e instanceof LiteApiError ? e.status : 500;
          return new Response(JSON.stringify({ error: message }), {
            status,
            headers: cors,
          });
        }
      }

      // Mobile: Stripe Checkout session URL
      if (request.method === "POST" && url.pathname === "/api/stripe/checkout") {
        const body = (await request.json()) as {
          bookingId?: string;
          priceCents?: number;
          customerEmail?: string;
          description?: string;
          locale?: string;
          checkoutToken?: string;
        };
        if (!body.bookingId) {
          return new Response(JSON.stringify({ error: "missing fields" }), {
            status: 400,
            headers: {
              "content-type": "application/json",
              "access-control-allow-origin": "*",
            },
          });
        }
        const { runCreateCheckoutSession } = await import("./server/stripe-checkout");
        const result = await runCreateCheckoutSession(
          {
            bookingId: body.bookingId,
            priceCents: body.priceCents,
            customerEmail: body.customerEmail,
            description: body.description ?? "Private transfer",
            locale: body.locale,
            checkoutToken: body.checkoutToken,
          },
          request.headers.get("authorization"),
        );
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: {
            "content-type": "application/json",
            "access-control-allow-origin": "*",
          },
        });
      }

      // After trip completed: remit 85% to carrier Connect account
      if (request.method === "POST" && url.pathname === "/api/stripe/payout") {
        const body = (await request.json()) as { bookingId?: string };
        if (!body.bookingId) {
          return new Response(JSON.stringify({ error: "bookingId required" }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }
        const { authorizeBookingRequest } = await import("./server/request-access");
        const access = await authorizeBookingRequest(request, body.bookingId, "driver");
        if (!access) return Response.json({ error: "Unauthorized" }, { status: 401 });
        const { runCarrierPayout } = await import("./server/stripe-connect");
        const result = await runCarrierPayout(body.bookingId);
        return new Response(JSON.stringify(result), {
          status: result.ok ? 200 : 422,
          headers: { "content-type": "application/json" },
        });
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
