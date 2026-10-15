interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  DISPATCH_CRON_SECRET: string;
  WEBSITE_URL: string;
}

async function request(url: string, secret: string) {
  const response = await fetch(url, {
    method: "POST",
    headers: { authorization: `Bearer ${secret}`, "content-type": "application/json" },
    body: "{}",
    signal: AbortSignal.timeout(25000),
  });
  if (!response.ok)
    console.error(
      "Scheduled transfer processing needs retry",
      new URL(url).pathname,
      response.status,
    );
}

export default {
  fetch() {
    return new Response("TransferAround dispatch scheduler", { status: 404 });
  },
  async scheduled(
    _controller: unknown,
    env: Env,
    context: { waitUntil(promise: Promise<unknown>): void },
  ) {
    context.waitUntil(
      (async () => {
        // Financial events and offer escalation use their existing authenticated server routes.
        await Promise.allSettled([
          request(`${env.WEBSITE_URL}/api/events/process`, env.DISPATCH_CRON_SECRET),
          request(`${env.WEBSITE_URL}/api/dispatch/expire`, env.DISPATCH_CRON_SECRET),
        ]);
        // Offers expire in 90 seconds. A minute-only retry is too coarse. APNs work
        // is claimed transactionally, so overlapping scheduler runs cannot duplicate a lease.
        const started = Date.now();
        for (let attempt = 0; attempt < 6 && Date.now() - started < 55000; attempt++) {
          await request(
            `${env.SUPABASE_URL}/functions/v1/native-push`,
            env.SUPABASE_SERVICE_ROLE_KEY,
          ).catch(() => console.error("Apple push retry transport unavailable"));
          if (attempt < 5) await new Promise((resolve) => setTimeout(resolve, 8000));
        }
      })(),
    );
  },
};
