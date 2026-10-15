import "jsr:@supabase/functions-js/edge-runtime.d.ts";
const cors = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization,content-type,apikey,x-client-info",
  "access-control-allow-methods": "POST,OPTIONS",
};
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST")
    return Response.json({ error: "Method not allowed" }, { status: 405, headers: cors });
  const origin = Deno.env.get("SITE_URL") || "https://transferaround.com";
  try {
    const upstream = await fetch(`${origin}/api/stripe/checkout`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(req.headers.get("authorization")
          ? { authorization: req.headers.get("authorization")! }
          : {}),
      },
      body: await req.text(),
    });
    return new Response(await upstream.text(), {
      status: upstream.status,
      headers: { ...cors, "content-type": "application/json" },
    });
  } catch {
    return Response.json({ error: "Payment service unavailable" }, { status: 503, headers: cors });
  }
});
