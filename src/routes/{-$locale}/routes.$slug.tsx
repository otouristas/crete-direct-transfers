import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import type { RouteData } from "@/data/routes";
import { quote, formatEur } from "@/lib/pricing";
import { BookingWidget } from "@/components/booking-widget";
import { RouteCard } from "@/components/sections/route-card";
import { CtaBand } from "@/components/sections/cta-band";
import { AskTouristasBand } from "@/components/touristas-ai/ask-band";
import { InpageNav } from "@/components/inpage-nav";
import { getDict, useLocale, useT, type Locale, type Dict } from "@/i18n";
import { getLocalizedRoute, getLocalizedRoutes, getLocalizedVehicles } from "@/i18n/content";
import { buildHead } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { Check, Clock, MapPin, Plane, Radar } from "lucide-react";

function localInfoCopy(route: RouteData, t: Dict): string {
  switch (route.service) {
    case "airport":
      return t.routesPages.localInfoAirport;
    case "port":
      return t.routesPages.localInfoPort;
    case "hotel":
      return t.routesPages.localInfoHotel;
    default:
      return t.routesPages.localInfoCrossIsland;
  }
}

export const Route = createFileRoute("/{-$locale}/routes/$slug")({
  loader: ({ params }) => {
    const locale = (params.locale ?? "en") as Locale;
    const route = getLocalizedRoute(locale, params.slug);
    if (!route) throw notFound();
    return { route };
  },
  head: ({ loaderData, params }) => {
    const locale = (params.locale ?? "en") as Locale;
    const t = getDict(locale);
    if (!loaderData) {
      return {
        meta: [{ title: t.seo.notFound("Route") }, { name: "robots", content: "noindex" }],
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
      title: t.seo.routeTitle(r.from, r.to),
      description: `Fixed-price transfer from ${r.from} to ${r.to}. ${r.durationMin} min, ${r.distanceKm} km. Licensed local drivers, flight tracked. From ${price}.`,
      ogImage: r.heroImage,
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "TaxiService",
            name: `${r.from} to ${r.to} Transfer`,
            provider: { "@type": "LocalBusiness", name: "TransferAround" },
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
  const locale = useLocale();
  const vehicles = getLocalizedVehicles(locale);
  const q = quote({ routeSlug: route.slug, vehicleClass: "economy" })!;
  const vanQ = quote({ routeSlug: route.slug, vehicleClass: "minivan" });
  const others = getLocalizedRoutes(locale)
    .filter((r) => r.slug !== route.slug && r.region === route.region)
    .slice(0, 3);

  const navItems = [
    { id: "book", label: t.inpageNav.bookNow, cta: true },
    { id: "key-facts", label: t.inpageNav.keyFacts },
    { id: "local-info", label: t.inpageNav.localInfo },
    { id: "overview", label: t.inpageNav.overview },
    { id: "compare", label: t.inpageNav.compare },
    { id: "vehicles", label: t.inpageNav.vehicles },
    { id: "faq", label: t.inpageNav.faqs },
    ...(others.length > 0 ? [{ id: "related", label: t.inpageNav.related }] : []),
  ];

  const facts = [
    {
      label: t.routesPages.factDuration,
      value: `${route.durationMin} ${t.common.minutes}`,
      icon: Clock,
    },
    {
      label: t.routesPages.factDistance,
      value: `${route.distanceKm} km`,
      icon: MapPin,
    },
    {
      label: t.routesPages.factFromPrice,
      value: formatEur(q.totalEur),
      icon: Check,
    },
    {
      label: t.routesPages.factWaiting,
      value: t.routesPages.factWaitingValue,
      icon: Plane,
    },
    {
      label: t.routesPages.factTracking,
      value: t.routesPages.factTrackingValue,
      icon: Radar,
    },
  ];

  return (
    <>
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

      <AskTouristasBand
        pageType="routes"
        entityLabel={`${route.from} to ${route.to}`}
        entitySlug={route.slug}
        secondaryLabel={route.to}
      />

      <InpageNav items={navItems} />

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-14 lg:grid-cols-[1fr_400px]">
        <div className="min-w-0 space-y-14">
          <section id="key-facts" className="scroll-mt-32">
            <h2 className="text-2xl font-display text-primary">{t.routesPages.keyFactsTitle}</h2>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {facts.map((f) => (
                <div key={f.label} className="border-b border-border pb-4">
                  <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    <f.icon className="h-3.5 w-3.5 text-accent-deep" aria-hidden />
                    {f.label}
                  </dt>
                  <dd className="mt-2 font-display text-xl text-primary">{f.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section id="local-info" className="scroll-mt-32">
            <h2 className="text-2xl font-display text-primary">{t.routesPages.localInfoTitle}</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
              {localInfoCopy(route, t)}
            </p>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
              {t.routesPages.localInfoDropoff}
            </p>
          </section>

          <section id="overview" className="scroll-mt-32">
            <p className="max-w-2xl text-lg leading-relaxed text-foreground/90">{route.blurb}</p>
            <h2 className="mt-10 text-2xl font-display text-primary">
              {t.routesPages.whatToExpect}
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{route.notes}</p>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-display text-lg text-primary">{t.routesPages.included}</h3>
                <ul className="mt-4 space-y-2 text-sm">
                  {t.routesPages.includedItems.map((x) => (
                    <li key={x} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-deep" /> {x}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-display text-lg text-primary">
                  {t.routesPages.optionalExtras}
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {t.routesPages.optionalItems.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section id="compare" className="scroll-mt-32">
            <h2 className="text-2xl font-display text-primary">{t.routesPages.compareTitle}</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              {t.routesPages.compareSubtitle}
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="border-t-2 border-accent pt-5">
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-deep">
                  {t.routesPages.compareBest}
                </div>
                <h3 className="mt-2 font-display text-lg text-primary">
                  {t.routesPages.comparePrivateTitle}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t.routesPages.comparePrivateBody}
                </p>
                <p className="mt-4 text-sm font-semibold text-primary">
                  {t.common.from} {formatEur(q.totalEur)}
                </p>
              </div>
              <div className="border-t border-border pt-5">
                <h3 className="mt-6 font-display text-lg text-primary md:mt-0">
                  {t.routesPages.compareTaxiTitle}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t.routesPages.compareTaxiBody}
                </p>
              </div>
              <div className="border-t border-border pt-5">
                <h3 className="mt-6 font-display text-lg text-primary md:mt-0">
                  {t.routesPages.compareBusTitle}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {t.routesPages.compareBusBody}
                </p>
              </div>
            </div>
          </section>

          <section id="vehicles" className="scroll-mt-32">
            <h2 className="text-2xl font-display text-primary">{t.routesPages.priceTableTitle}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t.routesPages.priceTableSubtitle}</p>
            <div className="mt-6 space-y-3">
              {vehicles.map((v) => {
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
          </section>

          <section id="faq" className="scroll-mt-32">
            <h2 className="text-2xl font-display text-primary">{t.routesPages.faqTitle}</h2>
            <div className="mt-6 space-y-6 text-sm">
              {[
                {
                  q: `How much is a transfer from ${route.from} to ${route.to}?`,
                  a: `From ${formatEur(q.totalEur)} for Economy class${vanQ ? `, ${formatEur(vanQ.totalEur)} for Van Standard` : ""}. Fixed price — no bidding, no surge.`,
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
          </section>
        </div>

        <aside id="book" className="h-fit scroll-mt-32 lg:sticky lg:top-36">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent-deep">
            {t.routesPages.bookThisRoute}
          </div>
          <BookingWidget defaultRoute={route.slug} compact />
        </aside>
      </section>

      {others.length > 0 && (
        <section id="related" className="mx-auto max-w-7xl scroll-mt-32 px-6 pb-20">
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
