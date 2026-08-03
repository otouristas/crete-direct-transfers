import type { AirportData } from "@/data/airports";
import type { AirportRouteData } from "@/data/airport-routes";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { vehicleFromPrices, formatEur } from "@/lib/pricing";
import { buildHead } from "@/lib/seo";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { getDict, useT, type Locale } from "@/i18n";
import {
  getLocalizedAirport,
  getLocalizedAirportRoute,
  getLocalizedAirportRoutes,
} from "@/i18n/content";
import { CtaBand } from "@/components/sections/cta-band";
import { AskTouristasBand } from "@/components/touristas-ai/ask-band";
import { AskTouristasInline } from "@/components/touristas-ai/ask-inline";
import {
  AirportBookingSlot,
  AirportFaqs,
  AirportTrustStrip,
  AirportVehicles,
} from "@/components/airports/airport-page-sections";

export const Route = createFileRoute("/{-$locale}/airports/$slug/$routeSlug")({
  loader: ({ params }) => {
    const locale = (params.locale ?? "en") as Locale;
    const airport = getLocalizedAirport(locale, params.slug);
    if (!airport) throw notFound();
    const route = getLocalizedAirportRoute(locale, airport.slug, params.routeSlug);
    if (!route) throw notFound();
    const siblings = getLocalizedAirportRoutes(locale).filter(
      (r) => r.airportSlug === airport.slug && r.routeSlug !== route.routeSlug,
    );
    return { airport, route, siblings } as {
      airport: AirportData;
      route: AirportRouteData;
      siblings: AirportRouteData[];
    };
  },
  head: ({ loaderData, params }) => {
    const locale = (params.locale ?? "en") as Locale;
    const t = getDict(locale);
    if (!loaderData) {
      return {
        meta: [
          { title: t.seo.notFound(t.airportPages.route) },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { airport, route } = loaderData;
    const path = `/airports/${airport.slug}/${route.routeSlug}`;
    const price = formatEur(route.basePriceEur);
    const localePrefix = locale === "en" ? "" : `/${locale}`;

    return buildHead({
      locale,
      path,
      title: t.seo.airportRouteTitle(route.fromName, route.toName),
      description: t.airportPages.routeDescription(
        route.fromName,
        route.toName,
        String(route.distanceKm),
        String(route.durationMin),
        price,
      ),
      ogImage: airport.heroImage,
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "TaxiService",
            name: t.airportPages.transferFromTo(route.fromName, route.toName),
            provider: { "@type": "LocalBusiness", name: SITE_NAME },
            areaServed: t.airportPages.areaServed(airport.cityName, airport.country),
            offers: {
              "@type": "Offer",
              price: route.basePriceEur,
              priceCurrency: "EUR",
            },
          },
          {
            "@type": "FAQPage",
            mainEntity: route.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: t.nav.home,
                item: `${SITE_URL}${localePrefix || "/"}`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: t.nav.airports,
                item: `${SITE_URL}${localePrefix}/airports`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: airport.name,
                item: `${SITE_URL}${localePrefix}/airports/${airport.slug}`,
              },
              {
                "@type": "ListItem",
                position: 4,
                name: route.toName,
                item: `${SITE_URL}${localePrefix}${path}`,
              },
            ],
          },
        ],
      },
    });
  },
  component: AirportRoutePage,
  notFoundComponent: RouteNotFound,
});

function RouteNotFound() {
  const t = useT();
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-3xl font-display text-primary">{t.notFound.title}</h1>
      <Link
        to="/{-$locale}/airports"
        className="mt-6 inline-flex rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
      >
        {t.airportPages.viewAllAirports}
      </Link>
    </div>
  );
}

function AirportRoutePage() {
  const { airport, route, siblings } = Route.useLoaderData() as {
    airport: AirportData;
    route: AirportRouteData;
    siblings: AirportRouteData[];
  };
  const t = useT();
  const vehicles = vehicleFromPrices(airport, route);

  return (
    <>
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: `url(${airport.heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/50" />
        <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-16 md:pt-24">
          <nav className="mb-4 flex flex-wrap gap-2 text-xs text-primary-foreground/70">
            <Link to="/{-$locale}" className="hover:text-accent">
              {t.nav.home}
            </Link>
            <span>/</span>
            <Link to="/{-$locale}/airports" className="hover:text-accent">
              {t.nav.airports}
            </Link>
            <span>/</span>
            <Link
              to="/{-$locale}/airports/$slug"
              params={{ slug: airport.slug }}
              className="hover:text-accent"
            >
              {airport.name}
            </Link>
            <span>/</span>
            <span>{route.toName}</span>
          </nav>
          <h1 className="max-w-3xl text-3xl font-display md:text-5xl">
            {t.airportPages.transferFromTo(route.fromName, route.toName)}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-primary-foreground/85">
            {t.airportPages.distanceSummary(
              String(route.distanceKm),
              String(route.durationMin),
              formatEur(route.basePriceEur),
            )}
          </p>
          <div className="mt-6">
            <AskTouristasInline
              prompt={t.airportPages.routeAiPrompt(route.fromName, route.toName)}
            />
          </div>
          <div className="mt-8" id="react-picker">
            <AirportBookingSlot
              airport={{ ...airport, bookable: route.bookable, fromPriceEur: route.basePriceEur }}
              defaultRouteSlug={route.legacyRouteSlug}
            />
          </div>
        </div>
      </section>

      <AskTouristasBand
        pageType="corridor"
        entityLabel={`${airport.name} (${airport.iata})`}
        secondaryLabel={route.toName}
      />

      <AirportTrustStrip />

      <section id="key-transfer-facts" className="bg-secondary/40 py-14">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl font-display text-primary sm:text-3xl">
            {t.airportPages.routeFactsTitle(route.fromName, route.toName)}
          </h2>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                label: t.airportPages.route,
                value: `${route.fromName} → ${route.toName}`,
              },
              { label: t.routesPages.factDistance, value: `${route.distanceKm} km` },
              {
                label: t.airportPages.averageTravelTime,
                value: `${route.durationMin} min`,
              },
              {
                label: t.airportPages.startingPrice,
                value: formatEur(route.basePriceEur),
              },
              {
                label: t.routesPages.factTracking,
                value: t.airportPages.routeFlightValue,
              },
              {
                label: t.airportPages.waitingTime,
                value: t.airportPages.routeWaitValue,
              },
            ].map((f) => (
              <div key={f.label} className="rounded-xl border border-border bg-card p-5">
                <dt className="text-sm text-muted-foreground">{f.label}</dt>
                <dd className="mt-1 font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="airport-operational-info" className="bg-background py-14">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl font-display text-primary sm:text-3xl">
            {t.airportPages.routeKnowTitle(route.fromName, route.toName)}
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {route.tips.map((tip) => (
              <div key={tip.title} className="border-t border-border pt-6">
                <h3 className="font-semibold text-foreground">{tip.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tip.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-3xl leading-relaxed text-muted-foreground">{route.body}</p>
        </div>
      </section>

      <AirportVehicles airport={airport} vehicles={vehicles} />

      <AirportFaqs
        title={t.airportPages.routeFaqTitle(route.fromName, route.toName)}
        subtitle={t.airportPages.routeFaqSubtitle}
        faqs={route.faqs}
      />

      <section className="bg-secondary/40 py-14">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl font-display text-primary">
            {t.airportPages.alternativesTitle(airport.name)}
          </h2>
          <Link
            to="/{-$locale}/airports/$slug"
            params={{ slug: airport.slug }}
            className="mt-2 inline-flex text-sm font-semibold text-accent-deep hover:underline"
          >
            {t.airportPages.viewAllTransfers(airport.name)} <span aria-hidden>→</span>
          </Link>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {siblings.slice(0, 6).map((r) => (
              <li key={r.routeSlug}>
                <Link
                  to="/{-$locale}/airports/$slug/$routeSlug"
                  params={{ slug: airport.slug, routeSlug: r.routeSlug }}
                  className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium hover:border-accent"
                >
                  <span>
                    {r.fromName} → {r.toName}
                  </span>
                  <span className="text-muted-foreground">{formatEur(r.basePriceEur)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
