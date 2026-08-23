import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

type ScheduledContext = {
  waitUntil(promise: Promise<unknown>): void;
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

function withSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(self), payment=(self)");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const response = await (async () => {
      try {
        const url = new URL(request.url);
        if (request.method === "POST" && url.pathname === "/api/stripe/webhook") {
          try {
            const { handleStripeWebhook } = await import("./functions/stripe");
            const rawBody = await request.text();
            const signature = request.headers.get("stripe-signature");
            const result = await handleStripeWebhook(rawBody, signature);
            return new Response(JSON.stringify(result), {
              status: 200,
              headers: { "content-type": "application/json" },
            });
          } catch (webhookError) {
            console.error("[stripe] webhook rejected", webhookError);
            return new Response("invalid webhook", { status: 400 });
          }
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

        // Trusted cron: claim and deliver database-authored side effects.
        if (request.method === "POST" && url.pathname === "/api/outbox/process") {
          const secret = process.env.OUTBOX_CRON_SECRET;
          const auth = request.headers.get("authorization");
          if (!secret || auth !== `Bearer ${secret}`) {
            return new Response("unauthorized", { status: 401 });
          }
          const { processEventOutbox } = await import("./server/outbox");
          const result = await processEventOutbox();
          return new Response(JSON.stringify(result), {
            status: result.ok ? 200 : 207,
            headers: { "content-type": "application/json" },
          });
        }

        // Mobile: Stripe Checkout session URL
        if (request.method === "POST" && url.pathname === "/api/stripe/checkout") {
          const body = (await request.json()) as {
            bookingId?: string;
            locale?: string;
          };
          if (!body.bookingId) {
            return new Response(JSON.stringify({ error: "bookingId required" }), {
              status: 400,
              headers: { "content-type": "application/json" },
            });
          }
          const { requireBookingAccess } = await import("./server/request-auth");
          const access = await requireBookingAccess(request, body.bookingId, "customer");
          if (!access.ok) return access.response;
          const { runCreateCheckoutSession } = await import("./functions/stripe");
          const result = await runCreateCheckoutSession({
            bookingId: body.bookingId,
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
    })();
    return withSecurityHeaders(response);
  },
  async scheduled(_controller: unknown, _env: unknown, ctx: ScheduledContext) {
    ctx.waitUntil(
      Promise.all([
        import("./server/outbox").then(({ processEventOutbox }) => processEventOutbox()),
        import("./server/dispatch").then(({ runExpireAndEscalate }) => runExpireAndEscalate()),
      ]).then(() => undefined),
    );
  },
};
