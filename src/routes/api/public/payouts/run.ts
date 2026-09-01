import { createFileRoute } from "@tanstack/react-router";
import { runPayoutBatch } from "@/functions/payouts";

/**
 * Scheduled payout run. Matures held earnings, then pays drivers whose cadence
 * is due today. Guarded by a shared secret — never publicly callable.
 */
export const Route = createFileRoute("/api/public/payouts/run")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.DISPATCH_CRON_SECRET ?? process.env.OUTBOX_CRON_SECRET;
        const provided = request.headers.get("x-cron-secret");
        if (!secret || provided !== secret) {
          return new Response("Unauthorized", { status: 401 });
        }
        try {
          const result = await runPayoutBatch({});
          return Response.json(result);
        } catch (error) {
          const message = error instanceof Error ? error.message : "payout_run_failed";
          return Response.json({ error: message }, { status: 500 });
        }
      },
    },
  },
});
