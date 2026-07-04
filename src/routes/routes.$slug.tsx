import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getRoute, VEHICLE_CLASSES, ROUTES } from "@/data/routes";
import { quote, formatEur } from "@/lib/pricing";
import { Check, Clock, MapPin, Star } from "lucide-react";

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
    const title = `${r.from} to ${r.to} Transfer | Fixed Price ${price} · CreteTransfers`;
    const desc = `Fixed-price transfer from ${r.from} to ${r.to}. ${r.durationMin} min, ${r.distanceKm} km. Licensed local drivers, flight tracked. From ${price}.`;
    const faqs = [
      { q: `How much is a transfer from ${r.from} to ${r.to}?`, a: `From ${price} for Economy — fixed price, no bidding.` },
      { q: `How long is the drive?`, a: `Around ${r.durationMin} minutes for ${r.distanceKm} km.` },
      { q: `What if my flight is delayed?`, a: `We track your flight number automatically. Driver adjusts pickup, no extra charge.` },
    ];
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
            "@graph": [
              {
                "@type": "TaxiService",
                name: `${r.from} to ${r.to} Transfer`,
                provider: { "@type": "LocalBusiness", name: "CreteTransfers" },
                areaServed: "Crete, Greece",
                offers: { "@type": "Offer", price: q?.totalEur, priceCurrency: "EUR" },
              },
              {
                "@type": "FAQPage",
                mainEntity: faqs.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: "/" },
                  { "@type": "ListItem", position: 2, name: "Routes", item: "/routes" },
                  { "@type": "ListItem", position: 3, name: `${r.from} to ${r.to}`, item: `/routes/${params.slug}` },
                ],
              },
            ],
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
      <Link to="/routes" className="inline-flex mt-6 rounded-full bg-accent px-5 py-2 text-sm text-accent-foreground">
        See all routes
      </Link>
    </div>
  );
}

function RoutePage() {
  const { route } = Route.useLoaderData();
  const q = quote({ routeSlug: route.slug, vehicleClass: "economy" })!;
  const others = ROUTES.filter((r) => r.slug !== route.slug && r.region === route.region).slice(0, 3);
  const bookSearch = { route: route.slug, class: "economy" as const };

  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div
          className="aspect-[16/8] md:aspect-[16/6] bg-cover bg-center"
          style={{ backgroundImage: `url(${route.heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-10 md:pb-16 text-primary-foreground">
          <nav className="flex items-center gap-2 text-xs text-primary-foreground/70 mb-4">
            <Link to="/" className="hover:text-accent">Home</Link>
            <span>/</span>
            <Link to="/routes" className="hover:text-accent">Routes</Link>
            <span>/</span>
            <span>{route.region}</span>
          </nav>
          <div className="text-xs uppercase tracking-[0.2em] text-accent">
            <MapPin className="inline w-3 h-3 mr-1" /> {route.region}
          </div>
          <h1 className="mt-3 text-3xl md:text-5xl lg:text-6xl font-serif max-w-4xl">
            {route.from} → {route.to}
          </h1>
          <div className="mt-4 flex flex-wrap gap-6 text-sm text-primary-foreground/85">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {route.durationMin} min</span>
            <span>{route.distanceKm} km</span>
            <span className="flex items-center gap-1"><Check className="w-4 h-4 text-accent" /> Fixed price from {formatEur(q.totalEur)}</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 grid gap-12 lg:grid-cols-[1fr_360px]">
        <div>
          <p className="text-lg text-foreground/90 leading-relaxed max-w-2xl">{route.blurb}</p>

          <div className="mt-12">
            <h2 className="font-serif text-2xl text-primary">Fixed price by vehicle class</h2>
            <div className="mt-6 space-y-3">
              {VEHICLE_CLASSES.map((v) => {
                const price = quote({ routeSlug: route.slug, vehicleClass: v.id });
                return (
                  <Link
                    key={v.id}
                    to="/book"
                    search={{ route: route.slug, class: v.id }}
                    className="flex items-center justify-between rounded-2xl bg-card border border-border/60 p-5 hover:border-accent transition"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-16 h-16 rounded-xl bg-cover bg-center shrink-0"
                        style={{ backgroundImage: `url(${v.image})` }}
                      />
                      <div>
                        <div className="font-serif text-lg text-primary">{v.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {v.capacity} · {v.bags}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-serif text-2xl text-accent">
                        {price ? formatEur(price.totalEur) : "—"}
                      </div>
                      <div className="text-xs text-muted-foreground">fixed price</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-12">
            <h2 className="font-serif text-2xl text-primary">What to expect</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl">{route.notes}</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-card border border-border/60 p-6">
              <h3 className="font-serif text-lg text-primary">Included</h3>
              <ul className="mt-4 space-y-2 text-sm">
                {["Fixed price — no bidding, no surge", "Flight & ferry tracking", "Meet-and-greet at arrivals", "Free waiting 60 min for flights", "Water bottles on board", "Named driver + WhatsApp"].map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" /> {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-card border border-border/60 p-6">
              <h3 className="font-serif text-lg text-primary">Optional extras</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>Child / booster seat · +€10</li>
                <li>Extra stop en route · +€15</li>
                <li>Physical name sign · +€10</li>
                <li>Night surcharge 22:00–06:00 · +15%</li>
              </ul>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="font-serif text-2xl text-primary">Common questions</h2>
            <div className="mt-6 space-y-6 text-sm">
              <div>
                <div className="font-medium text-foreground">How much is a transfer from {route.from} to {route.to}?</div>
                <p className="mt-1 text-muted-foreground">
                  From {formatEur(q.totalEur)} for Economy class, {formatEur(quote({ routeSlug: route.slug, vehicleClass: "minivan" })!.totalEur)} for Minivan. Fixed price — no bidding, no surge.
                </p>
              </div>
              <div>
                <div className="font-medium text-foreground">How long does the drive take?</div>
                <p className="mt-1 text-muted-foreground">
                  Around {route.durationMin} minutes for {route.distanceKm} km. We build a buffer for peak-season traffic.
                </p>
              </div>
              <div>
                <div className="font-medium text-foreground">What if my flight is delayed?</div>
                <p className="mt-1 text-muted-foreground">
                  We track your flight number — the driver adjusts pickup automatically. No extra charge.
                </p>
              </div>
              <div>
                <div className="font-medium text-foreground">Can I pay cash or by card?</div>
                <p className="mt-1 text-muted-foreground">
                  Both. Every driver carries a card terminal (Visa, Mastercard, Amex) and accepts cash in EUR.
                </p>
              </div>
              <div>
                <div className="font-medium text-foreground">Can I cancel for free?</div>
                <p className="mt-1 text-muted-foreground">
                  Yes — free cancellation up to 24 hours before pickup. Inside 24h a 50% fee applies.
                </p>
              </div>
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 h-fit rounded-2xl border border-border/60 bg-primary text-primary-foreground p-6">
          <div className="flex gap-0.5 text-accent mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-current" />
            ))}
          </div>
          <div className="text-xs uppercase tracking-widest text-accent">Book this transfer</div>
          <div className="mt-2 font-serif text-3xl">from {formatEur(q.totalEur)}</div>
          <ul className="mt-6 space-y-2 text-sm text-primary-foreground/80">
            <li>· Fixed price, no bidding</li>
            <li>· Free cancellation up to 24h</li>
            <li>· Pay online or on arrival</li>
            <li>· Named driver with WhatsApp</li>
          </ul>
          <Link
            to="/book"
            search={bookSearch}
            className="mt-6 block text-center rounded-full bg-accent px-5 py-3 text-accent-foreground text-sm hover:opacity-90"
          >
            Continue to booking
          </Link>
        </aside>
      </section>

      {others.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <h2 className="font-serif text-2xl text-primary mb-6">Other routes in {route.region}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {others.map((r) => (
              <Link
                key={r.slug}
                to="/routes/$slug"
                params={{ slug: r.slug }}
                className="rounded-2xl bg-card border border-border/60 p-5 hover:border-accent transition"
              >
                <div className="font-serif text-primary">{r.from} → {r.to}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {r.durationMin} min · from {formatEur(quote({ routeSlug: r.slug, vehicleClass: "economy" })!.totalEur)}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
