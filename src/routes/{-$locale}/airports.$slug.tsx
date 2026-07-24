import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { vehicleFromPrices, formatEur } from "@/lib/pricing";
import { buildHead } from "@/lib/seo";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { getDict, useT, type Locale } from "@/i18n";
import { getLocalizedAirport, getLocalizedAirportRoutes } from "@/i18n/content";
import { getIataAirport } from "@/data/iata-airports";
import { CtaBand } from "@/components/sections/cta-band";
import { AskTouristasBand } from "@/components/touristas-ai/ask-band";
import {
  AirportHero,
  AirportInPageNav,
  AirportBookingSlot,
  AirportFacts,
  AirportTrustStrip,
  AirportKnowBefore,
  AirportInsights,
  AirportComparison,
  AirportVehicles,
  AirportFaqs,
  AirportPopularRoutes,
  OtherAirportsInGreece,
} from "@/components/airports/airport-page-sections";

export const Route = createFileRoute("/{-$locale}/airports/$slug")({
  loader: ({ params }) => {
    const locale = (params.locale ?? "en") as Locale;
    const airport = getLocalizedAirport(locale, params.slug);
    if (!airport) throw notFound();
    const routes = getLocalizedAirportRoutes(locale).filter((r) => r.airportSlug === airport.slug);
    return { airport, routes };
  },
  head: ({ loaderData, params }) => {
    const locale = (params.locale ?? "en") as Locale;
    const t = getDict(locale);
    if (!loaderData) {
      return {
        meta: [
          { title: t.seo.notFound("Airport") },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { airport, routes } = loaderData;
    const path = `/airports/${airport.slug}`;
    const price = formatEur(airport.fromPriceEur);

    return buildHead({
      locale,
      path,
      title: t.seo.airportTitle(airport.name, airport.iata),
      description: `Book fixed-price airport transfers from ${airport.name} (${airport.iata}). Free cancellation, flight tracking, meet & greet. From ${price}.`,
      ogImage: airport.heroImage,
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebPage",
            "@id": `${SITE_URL}${path}#webpage`,
            url: `${SITE_URL}${path}`,
            name: `${airport.name} Transfers (${airport.iata})`,
            description: airport.intro,
          },
          {
            "@type": "Service",
            name: `${airport.name} Transfers (${airport.iata})`,
            serviceType: "Airport Transfer",
            provider: { "@type": "LocalBusiness", name: SITE_NAME },
            areaServed: {
              "@type": "Airport",
              name: airport.officialName,
              iataCode: airport.iata,
              address: {
                "@type": "PostalAddress",
                addressLocality: airport.cityName,
                addressCountry: getIataAirport(airport.iata)?.countryCode ?? "GR",
              },
            },
            offers: {
              "@type": "AggregateOffer",
              priceCurrency: "EUR",
              lowPrice: airport.fromPriceEur,
              availability: "https://schema.org/InStock",
            },
          },
          {
            "@type": "FAQPage",
            mainEntity: airport.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
          {
            "@type": "ItemList",
            name: `Transfer routes from ${airport.name}`,
            itemListElement: routes.map((r, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: `Transfer from ${r.fromName} to ${r.toName}`,
              url: `${SITE_URL}/airports/${airport.slug}/${r.routeSlug}`,
            })),
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
              {
                "@type": "ListItem",
                position: 2,
                name: "Airports",
                item: `${SITE_URL}/airports`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: `${airport.name} (${airport.iata})`,
                item: `${SITE_URL}${path}`,
              },
            ],
          },
        ],
      },
    });
  },
  component: AirportHubPage,
  notFoundComponent: AirportNotFound,
});

function AirportNotFound() {
  const t = useT();
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-3xl font-display text-primary">{t.notFound.title}</h1>
      <Link
        to="/{-$locale}/airports"
        className="mt-6 inline-flex rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
      >
        All airports
      </Link>
    </div>
  );
}

function AirportHubPage() {
  const { airport, routes } = Route.useLoaderData();
  const vehicles = vehicleFromPrices(airport);
  const defaultLegacy = routes.find((r) => r.legacyRouteSlug)?.legacyRouteSlug;

  return (
    <>
      <AirportHero
        airport={airport}
        bookingSlot={
          <AirportBookingSlot airport={airport} defaultRouteSlug={defaultLegacy} />
        }
      />
      <AskTouristasBand
        pageType="airport"
        entityLabel={`${airport.name} (${airport.iata})`}
      />
      <AirportInPageNav />
      <AirportFacts airport={airport} />
      <AirportTrustStrip />
      <AirportKnowBefore airport={airport} />
      <AirportInsights airport={airport} />
      <AirportComparison airport={airport} />
      <AirportVehicles airport={airport} vehicles={vehicles} />
      <AirportFaqs
        title="Frequently Asked Questions"
        subtitle={`Specific answers about transfers at ${airport.name} — booking, pickup zones, local tolls, and terminals.`}
        faqs={airport.faqs}
      />
      <AirportPopularRoutes airport={airport} routes={routes} />
      <OtherAirportsInGreece airport={airport} />
      <CtaBand
        title="Ready to book?"
        subtitle="Reserve your private transfer — fixed price, professional local drivers and real-time flight tracking."
      />
    </>
  );
}
