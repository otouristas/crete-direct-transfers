import { createFileRoute, Link } from "@tanstack/react-router";
import { listCityDestinations } from "@/data/destinations";
import { getLocalizedMarketHubCities } from "@/i18n/content";
import { getCountryName } from "@/i18n/markets";
import { listLiveMarkets } from "@/data/markets";
import { buildHead } from "@/lib/seo";
import { getDict, useLocale, useT, type Locale } from "@/i18n";
import { getLocalizedAirports } from "@/i18n/content";
import { CtaBand } from "@/components/sections/cta-band";

export const Route = createFileRoute("/{-$locale}/cities/")({
  head: ({ params }) => {
    const locale = (params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/cities",
      title: t.seo.citiesIndexTitle,
      description: t.seo.citiesIndexDescription,
    });
  },
  component: CitiesIndexPage,
});

function CitiesIndexPage() {
  const locale = useLocale();
  const t = useT();
  const cities = listCityDestinations();
  const airports = getLocalizedAirports(locale);
  const hubCountries = listLiveMarkets()
    .filter((m) => m.slug !== "greece")
    .map((m) => ({
      slug: m.slug,
      name: getCountryName(locale, m.slug),
      cities: getLocalizedMarketHubCities(locale, m.slug),
    }))
    .filter((c) => c.cities.length > 0);

  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {t.nav.destinations}
          </p>
          <h1 className="mt-3 text-4xl font-display md:text-6xl">{t.directoryPages.citiesTitle}</h1>
          <p className="mt-4 max-w-2xl text-lg text-primary-foreground/80">
            {t.directoryPages.citiesSubtitle}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((c) => {
            const airport = airports.find((a) => a.citySlug === c.slug);
            return (
              <li key={c.slug}>
                <Link
                  to="/{-$locale}/cities/$slug"
                  params={{ slug: c.slug }}
                  className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-4 text-sm font-medium shadow-sm transition hover:border-accent"
                >
                  <span>
                    <span className="block text-base font-display text-primary">{c.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {[c.island, c.region].filter(Boolean).join(" · ")}
                      {airport ? ` · ${airport.iata}` : ""}
                    </span>
                  </span>
                  <span className="text-accent-deep">→</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-20">
          <h2 className="text-2xl font-display text-primary sm:text-3xl">
            {t.directoryPages.allCitiesTitle}
          </h2>
          <div className="mt-10 space-y-10">
            {hubCountries.map((country) => (
              <div key={country.slug}>
                <div className="flex flex-wrap items-baseline gap-3 border-b border-border pb-2">
                  <h3 className="font-display text-xl text-primary">{country.name}</h3>
                  <span className="text-sm text-muted-foreground">{country.cities.length}</span>
                </div>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {country.cities.map((c) => (
                    <li key={c.slug}>
                      <Link
                        to="/{-$locale}/cities/$slug"
                        params={{ slug: c.slug }}
                        className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm transition hover:border-accent hover:shadow-sm"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
