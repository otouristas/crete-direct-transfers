import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getDestination, DESTINATIONS } from "@/data/destinations";
import { formatEur } from "@/lib/pricing";
import { buildHead } from "@/lib/seo";
import { getDict, useLocale, useT, type Locale } from "@/i18n";
import {
  getLocalizedAirports,
  getLocalizedAirportRoutes,
  getLocalizedMarketHubAirports,
  getLocalizedMarketHubCities,
  getLocalizedMarkets,
} from "@/i18n/content";
import { CtaBand } from "@/components/sections/cta-band";

export const Route = createFileRoute("/{-$locale}/cities/$slug")({
  loader: ({ params }) => {
    const locale = (params.locale ?? "en") as Locale;
    const city = getDestination(params.slug);
    const marketHubCity = getLocalizedMarketHubCities(locale).find(
      (item) => item.slug === params.slug,
    );
    if (!city && marketHubCity) {
      const market = getLocalizedMarkets(locale).find(
        (item) => item.slug === marketHubCity.countrySlug,
      );
      return {
        city: {
          ...marketHubCity,
          type: "city" as const,
          region: market?.name ?? marketHubCity.countrySlug,
          island: undefined,
          countrySlug: marketHubCity.countrySlug,
        },
      };
    }
    if (!city || (city.type !== "city" && city.type !== "resort" && city.type !== "port")) {
      // allow any destination with a page for SEO hubs
      const any = getDestination(params.slug);
      if (!any) throw notFound();
      return { city: any };
    }
    return { city };
  },
  head: ({ loaderData, params }) => {
    const locale = (params.locale ?? "en") as Locale;
    const t = getDict(locale);
    if (!loaderData) {
      return {
        meta: [
          { title: t.seo.notFound(t.directoryPages.cityEntity) },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { city } = loaderData;
    return buildHead({
      locale,
      path: `/cities/${city.slug}`,
      title: t.seo.cityTitle(city.name),
      description: t.directoryPages.cityMetaDescription(city.name),
    });
  },
  component: CityPage,
  notFoundComponent: CityNotFound,
});

function CityNotFound() {
  const t = useT();
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-3xl font-display text-primary">{t.notFound.title}</h1>
      <Link
        to="/{-$locale}/cities"
        className="mt-6 inline-flex rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
      >
        {t.directoryPages.allCities}
      </Link>
    </div>
  );
}

function CityPage() {
  const { city } = Route.useLoaderData();
  const locale = useLocale();
  const t = useT();
  const countrySlug = "countrySlug" in city ? city.countrySlug : undefined;
  const airports = countrySlug
    ? getLocalizedMarketHubAirports(locale, countrySlug).filter(
        (airport) =>
          airport.cityName.toLowerCase() === city.name.toLowerCase() ||
          airport.cityName.toLowerCase().includes(city.name.toLowerCase()) ||
          city.name.toLowerCase().startsWith(airport.cityName.toLowerCase()),
      )
    : getLocalizedAirports(locale).filter((a) => a.citySlug === city.slug);
  const routesTo = getLocalizedAirportRoutes(locale).filter((r) => r.toSlug === city.slug);
  const nearbyCities = countrySlug
    ? getLocalizedMarketHubCities(locale, countrySlug)
        .filter((item) => item.slug !== city.slug)
        .slice(0, 8)
    : DESTINATIONS.filter(
        (d) =>
          d.slug !== city.slug &&
          d.type === "city" &&
          (d.island === city.island || d.region === city.region),
      ).slice(0, 8);

  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <nav className="mb-4 flex gap-2 text-xs text-primary-foreground/70">
            <Link to="/{-$locale}" className="hover:text-accent">
              {t.nav.home}
            </Link>
            <span>/</span>
            <Link to="/{-$locale}/cities" className="hover:text-accent">
              {t.nav.cities}
            </Link>
            <span>/</span>
            <span>{city.name}</span>
          </nav>
          <h1 className="text-4xl font-display md:text-6xl">
            {t.directoryPages.privateTransfersIn(city.name)}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-primary-foreground/80">
            {t.directoryPages.cityHeroSubtitle(
              city.name,
              city.island ? `, ${city.island}` : city.region ? `, ${city.region}` : "",
            )}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <p className="max-w-3xl text-lg leading-relaxed text-foreground/90">
          {t.directoryPages.cityIntro(city.name)}
        </p>

        {airports.length > 0 ? (
          <div className="mt-12">
            <h2 className="text-2xl font-display text-primary">
              {t.directoryPages.airportsFor(city.name)}
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {airports.map((a) => (
                <li key={a.slug}>
                  <Link
                    to="/{-$locale}/airports/$slug"
                    params={{ slug: a.slug }}
                    className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-4 font-medium hover:border-accent"
                  >
                    <span>
                      {a.name} ({a.iata})
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {a.fromPriceEur > 0
                        ? `${t.common.from} ${formatEur(a.fromPriceEur)}`
                        : t.marketsDirectory.quoteFirst}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {routesTo.length > 0 ? (
          <div className="mt-12">
            <h2 className="text-2xl font-display text-primary">
              {t.directoryPages.popularTransfersTo(city.name)}
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {routesTo.map((r) => (
                <li key={r.routeSlug}>
                  <Link
                    to="/{-$locale}/airports/$slug/$routeSlug"
                    params={{ slug: r.airportSlug, routeSlug: r.routeSlug }}
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
        ) : null}

        {nearbyCities.length > 0 ? (
          <div className="mt-12">
            <h2 className="text-2xl font-display text-primary">
              {t.directoryPages.nearbyDestinations}
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {nearbyCities.map((c) => (
                <li key={c.slug}>
                  <Link
                    to="/{-$locale}/cities/$slug"
                    params={{ slug: c.slug }}
                    className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm hover:border-accent"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-12">
          <Link
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            to={`/{-$locale}/${countrySlug ?? "greece"}` as any}
            className="text-sm font-semibold text-accent-deep hover:underline"
          >
            ← {countrySlug ? city.region : t.directoryPages.allTransfersInGreece}
          </Link>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
