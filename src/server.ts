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
      if (request.method === "POST" && url.pathname === "/api/stripe/webhook") {
        const { handleStripeWebhook } = await import("./functions/stripe");
        const { getServiceSupabase } = await import("./integrations/supabase/service");
        const rawBody = await request.text();
        const signature = request.headers.get("stripe-signature");
        const result = await handleStripeWebhook(rawBody, signature);
        if (!result) {
          return new Response("ignored", { status: 200 });
        }
        const admin = getServiceSupabase();
        if (admin) {
          await admin
            .from("bookings")
            .update({
              payment_status: "paid",
              stripe_payment_intent_id: result.paymentIntentId,
            })
            .eq("id", result.bookingId);
        }
        return new Response(JSON.stringify({ received: true }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
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
            headers: { "content-type": "application/json" },
          });
        }
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
          headers: { "content-type": "application/json" },
        });
      }

      // Mobile: Stripe Checkout session URL
      if (request.method === "POST" && url.pathname === "/api/stripe/checkout") {
        const body = (await request.json()) as {
          bookingId?: string;
          priceCents?: number;
          customerEmail?: string;
          description?: string;
          locale?: string;
        };
        if (!body.bookingId || !body.priceCents || !body.customerEmail) {
          return new Response(JSON.stringify({ error: "missing fields" }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }
        const { runCreateCheckoutSession } = await import("./functions/stripe");
        const result = await runCreateCheckoutSession({
          bookingId: body.bookingId,
          priceCents: body.priceCents,
          customerEmail: body.customerEmail,
          description: body.description ?? "Private transfer",
          locale: body.locale,
        });
        return new Response(JSON.stringify(result), {
          status: 200,
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
