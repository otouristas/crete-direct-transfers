import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getRoute, VEHICLE_CLASSES, ROUTES } from "@/data/routes";
import { quote, formatEur } from "@/lib/pricing";
import { BookingWidget } from "@/components/booking-widget";
import { RouteCard } from "@/components/sections/route-card";
import { CtaBand } from "@/components/sections/cta-band";
import { getDict, useT, type Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { Check, Clock, MapPin } from "lucide-react";

export const Route = createFileRoute("/{-$locale}/routes/$slug")({
  loader: ({ params }) => {
    const route = getRoute(params.slug);
    if (!route) throw notFound();
    return { route };
  },
  head: ({ loaderData, params }) => {
    const locale = (params.locale ?? "en") as Locale;
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
    const path = `/routes/${params.slug}`;
    const faqs = [
      {
        q: `How much is a transfer from ${r.from} to ${r.to}?`,
        a: `From ${price} for Economy — fixed price, no bidding.`,
      },
      { q: `How long is the drive?`, a: `Around ${r.durationMin} minutes for ${r.distanceKm} km.` },
      {
        q: `What if my flight is delayed?`,
        a: `We track your flight number automatically. Driver adjusts pickup, no extra charge.`,
      },
    ];
    return buildHead({
      locale,
      path,
      title: `${r.from} to ${r.to} Transfer | Fixed Price ${price} · CreteTransfers`,
      description: `Fixed-price transfer from ${r.from} to ${r.to}. ${r.durationMin} min, ${r.distanceKm} km. Licensed local drivers, flight tracked. From ${price}.`,
      ogImage: r.heroImage,
      jsonLd: {
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
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Routes", item: `${SITE_URL}/routes` },
              {
                "@type": "ListItem",
                position: 3,
                name: `${r.from} to ${r.to}`,
                item: `${SITE_URL}${path}`,
              },
            ],
          },
        ],
      },
    });
  },
  component: RoutePage,
  notFoundComponent: RouteNotFound,
});

function RouteNotFound() {
  const t = useT();
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-3xl font-display text-primary">{t.notFound.title}</h1>
      <p className="mt-3 text-muted-foreground">{t.notFound.body}</p>
      <Link
        to="/{-$locale}/routes"
        className="mt-6 inline-flex rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
      >
        {t.common.seeAllRoutes}
      </Link>
    </div>
  );
}

function RoutePage() {
  const { route } = Route.useLoaderData();
  const t = useT();
  const q = quote({ routeSlug: route.slug, vehicleClass: "economy" })!;
  const others = ROUTES.filter((r) => r.slug !== route.slug && r.region === route.region).slice(
    0,
    3,
  );

  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div
          className="aspect-[16/8] bg-cover bg-center md:aspect-[16/6]"
          style={{ backgroundImage: `url(${route.heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-10 text-primary-foreground md:pb-14">
          <nav className="mb-4 flex items-center gap-2 text-xs text-primary-foreground/70">
            <Link to="/{-$locale}" className="hover:text-accent">
              {t.nav.home}
            </Link>
            <span>/</span>
            <Link to="/{-$locale}/routes" className="hover:text-accent">
              {t.nav.routes}
            </Link>
            <span>/</span>
            <span>{route.region}</span>
          </nav>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            <MapPin className="mr-1 inline h-3 w-3" /> {route.region}
          </div>
          <h1 className="mt-3 max-w-4xl text-3xl font-display md:text-5xl">
            {route.from} → {route.to}
          </h1>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-primary-foreground/85">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {route.durationMin} {t.common.minutes}
            </span>
            <span>{route.distanceKm} km</span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-accent" /> {t.common.fixedPrice} {t.common.from}{" "}
              {formatEur(q.totalEur)}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-14 lg:grid-cols-[1fr_400px]">
        <div>
          <p className="max-w-2xl text-lg leading-relaxed text-foreground/90">{route.blurb}</p>

          <div className="mt-12">
            <h2 className="text-2xl font-display text-primary">{t.routesPages.priceTableTitle}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t.routesPages.priceTableSubtitle}</p>
            <div className="mt-6 space-y-3">
              {VEHICLE_CLASSES.map((v) => {
                const price = quote({ routeSlug: route.slug, vehicleClass: v.id });
                return (
                  <Link
                    key={v.id}
                    to="/{-$locale}/book"
                    search={{ route: route.slug, class: v.id }}
                    className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 transition hover:border-accent hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="h-16 w-16 shrink-0 rounded-xl bg-cover bg-center"
                        style={{ backgroundImage: `url(${v.image})` }}
                      />
                      <div>
                        <div className="font-display text-lg text-primary">{v.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {v.capacity} · {v.bags}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-display text-primary">
                        {price ? formatEur(price.totalEur) : "—"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t.common.fixedPrice.toLowerCase()}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-display text-primary">What to expect</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{route.notes}</p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-display text-lg text-primary">Included</h3>
              <ul className="mt-4 space-y-2 text-sm">
                {[
                  "Fixed price — no bidding, no surge",
                  "Flight & ferry tracking",
                  "Meet-and-greet at arrivals",
                  "Free waiting 60 min for flights",
                  "Water bottles on board",
                  "Named driver + WhatsApp",
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-deep" /> {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-display text-lg text-primary">Optional extras</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>Child / booster seat · +€10</li>
                <li>Extra stop en route · +€15</li>
                <li>Physical name sign · +€10</li>
                <li>Night surcharge 22:00–06:00 · +15%</li>
              </ul>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-display text-primary">{t.routesPages.faqTitle}</h2>
            <div className="mt-6 space-y-6 text-sm">
              {[
                {
                  q: `How much is a transfer from ${route.from} to ${route.to}?`,
                  a: `From ${formatEur(q.totalEur)} for Economy class, ${formatEur(quote({ routeSlug: route.slug, vehicleClass: "minivan" })!.totalEur)} for Minivan. Fixed price — no bidding, no surge.`,
                },
                {
                  q: "How long does the drive take?",
                  a: `Around ${route.durationMin} minutes for ${route.distanceKm} km. We build a buffer for peak-season traffic.`,
                },
                {
                  q: "What if my flight is delayed?",
                  a: "We track your flight number — the driver adjusts pickup automatically. No extra charge.",
                },
                {
                  q: "Can I pay cash or by card?",
                  a: "Both. Every driver carries a card terminal (Visa, Mastercard, Amex) and accepts cash in EUR.",
                },
                {
                  q: "Can I cancel for free?",
                  a: "Yes — free cancellation up to 24 hours before pickup. Inside 24h a 50% fee applies.",
                },
              ].map((f) => (
                <div key={f.q}>
                  <div className="font-semibold text-foreground">{f.q}</div>
                  <p className="mt-1 text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="h-fit lg:sticky lg:top-24">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent-deep">
            {t.routesPages.bookThisRoute}
          </div>
          <BookingWidget defaultRoute={route.slug} compact />
        </aside>
      </section>

      {others.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <h2 className="mb-6 text-2xl font-display text-primary">{t.routesPages.relatedTitle}</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {others.map((r) => (
              <RouteCard key={r.slug} route={r} />
            ))}
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
