import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getRoute, VEHICLE_CLASSES, ROUTES } from "@/data/routes";
import { quote, formatEur } from "@/lib/pricing";

export const Route = createFileRoute("/routes/$slug")({
  loader: ({ params }) => {
    const route = getRoute(params.slug);
    if (!route) throw notFound();
    return { route };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Route not found | CreteTransfers" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const r = loaderData.route;
    const q = quote({ routeSlug: r.slug, vehicleClass: "economy" });
    const price = q ? formatEur(q.totalEur) : "";
    const title = `${r.from} to ${r.to} Transfer | Fixed Price ${price} | CreteTransfers`;
    const desc = `Fixed-price transfer from ${r.from} to ${r.to}. ${r.durationMin} min, ${r.distanceKm} km. Licensed local drivers, flight tracked, from ${price}.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:image", content: r.heroImage },
        { property: "og:url", content: `/routes/${params.slug}` },
        { name: "twitter:image", content: r.heroImage },
      ],
      links: [{ rel: "canonical", href: `/routes/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TaxiService",
            name: `${r.from} to ${r.to} Transfer`,
            provider: { "@type": "LocalBusiness", name: "CreteTransfers" },
            areaServed: "Crete, Greece",
            offers: {
              "@type": "Offer",
              price: q?.totalEur,
              priceCurrency: "EUR",
            },
          }),
        },
      ],
    };
  },
  component: RoutePage,
  notFoundComponent: RouteNotFound,
});

function RouteNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-serif text-3xl text-primary">Route not found</h1>
      <p className="mt-3 text-muted-foreground">We don't currently list that route.</p>
      <Link
        to="/routes"
        className="inline-flex mt-6 rounded-full bg-accent px-5 py-2 text-sm text-accent-foreground"
      >
        See all routes
      </Link>
    </div>
  );
}

function RoutePage() {
  const { route } = Route.useLoaderData();
  const others = ROUTES.filter((r) => r.slug !== route.slug).slice(0, 3);

  return (
    <>
      <section className="relative">
        <div
          className="aspect-[16/7] bg-cover bg-center"
          style={{ backgroundImage: `url(${route.heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-6 pb-10 text-primary-foreground">
          <div className="text-xs uppercase tracking-[0.2em] text-accent">{route.region}</div>
          <h1 className="mt-3 text-4xl md:text-5xl font-serif max-w-3xl">
            {route.from} → {route.to}
          </h1>
          <div className="mt-4 flex flex-wrap gap-6 text-sm text-primary-foreground/80">
            <span>{route.distanceKm} km</span>
            <span>{route.durationMin} min drive</span>
            <span>Fixed price</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 grid gap-12 lg:grid-cols-[1fr_360px]">
        <div>
          <p className="text-lg text-foreground/90 leading-relaxed max-w-2xl">{route.blurb}</p>
          <div className="mt-10">
            <h2 className="font-serif text-2xl text-primary">What to expect</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl">{route.notes}</p>
          </div>

          <div className="mt-12">
            <h2 className="font-serif text-2xl text-primary">Choose a vehicle</h2>
            <div className="mt-6 space-y-3">
              {VEHICLE_CLASSES.map((v) => {
                const q = quote({ routeSlug: route.slug, vehicleClass: v.id });
                return (
                  <Link
                    key={v.id}
                    to="/book"
                    search={{ route: route.slug, class: v.id }}
                    className="flex items-center justify-between rounded-xl bg-card border border-border/60 p-5 hover:border-accent transition"
                  >
                    <div>
                      <div className="font-serif text-lg text-primary">{v.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {v.capacity} · {v.bags} · {v.example}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-serif text-2xl text-accent">
                        {q ? formatEur(q.totalEur) : "—"}
                      </div>
                      <div className="text-xs text-muted-foreground">fixed price</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-12">
            <h2 className="font-serif text-2xl text-primary">Common questions</h2>
            <div className="mt-6 space-y-6 text-sm">
              <div>
                <div className="font-medium text-foreground">
                  How much is a transfer from {route.from} to {route.to}?
                </div>
                <p className="mt-1 text-muted-foreground">
                  From {formatEur(quote({ routeSlug: route.slug, vehicleClass: "economy" })!.totalEur)}{" "}
                  for our Economy class. Fixed price — no bidding, no surge.
                </p>
              </div>
              <div>
                <div className="font-medium text-foreground">How long does the drive take?</div>
                <p className="mt-1 text-muted-foreground">
                  Around {route.durationMin} minutes for {route.distanceKm} km. We build a buffer for
                  peak-season traffic.
                </p>
              </div>
              <div>
                <div className="font-medium text-foreground">What if my flight is delayed?</div>
                <p className="mt-1 text-muted-foreground">
                  We track your flight number — the driver adjusts pickup automatically. No extra
                  charge.
                </p>
              </div>
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 h-fit rounded-2xl border border-border/60 bg-primary text-primary-foreground p-6">
          <div className="text-xs uppercase tracking-widest text-accent">Book this transfer</div>
          <div className="mt-2 font-serif text-3xl">
            from{" "}
            {formatEur(quote({ routeSlug: route.slug, vehicleClass: "economy" })!.totalEur)}
          </div>
          <ul className="mt-6 space-y-2 text-sm text-primary-foreground/80">
            <li>· Fixed price, no bidding</li>
            <li>· Free cancellation up to 24h</li>
            <li>· Pay online or on arrival</li>
            <li>· Named driver with WhatsApp</li>
          </ul>
          <Link
            to="/book"
            search={{ route: route.slug, class: "economy" }}
            className="mt-6 block text-center rounded-full bg-accent px-5 py-3 text-accent-foreground text-sm hover:opacity-90"
          >
            Continue to booking
          </Link>
        </aside>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="font-serif text-2xl text-primary mb-6">Other routes you may need</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {others.map((r) => (
            <Link
              key={r.slug}
              to="/routes/$slug"
              params={{ slug: r.slug }}
              className="rounded-xl bg-card border border-border/60 p-5 hover:border-accent transition"
            >
              <div className="font-serif text-primary">{r.from} → {r.to}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {r.durationMin} min · from{" "}
                {formatEur(quote({ routeSlug: r.slug, vehicleClass: "economy" })!.totalEur)}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
