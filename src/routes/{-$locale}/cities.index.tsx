import { createFileRoute, Link } from "@tanstack/react-router";
import { listCityDestinations } from "@/data/destinations";
import { buildHead } from "@/lib/seo";
import { getDict, useLocale, type Locale } from "@/i18n";
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
  const cities = listCityDestinations();
  const airports = getLocalizedAirports(locale);

  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Greece</p>
          <h1 className="mt-3 text-4xl font-display md:text-6xl">Cities</h1>
          <p className="mt-4 max-w-2xl text-lg text-primary-foreground/80">
            Private transfers and airport pickups for cities and towns across Greece.
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

      <CtaBand />
    </>
  );
}
