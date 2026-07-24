import { createFileRoute, Link } from "@tanstack/react-router";
import { formatEur } from "@/lib/pricing";
import { buildHead } from "@/lib/seo";
import { getDict, useLocale, type Locale } from "@/i18n";
import { getLocalizedAirports, getLocalizedAirportRoutes } from "@/i18n/content";
import { CtaBand } from "@/components/sections/cta-band";
import { Plane } from "lucide-react";

export const Route = createFileRoute("/{-$locale}/airports/")({
  head: ({ params }) => {
    const locale = (params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/airports",
      title: t.seo.airportsIndexTitle,
      description: t.seo.airportsIndexDescription,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Airport transfers in Greece",
        numberOfItems: getLocalizedAirports(locale).length,
        itemListElement: getLocalizedAirports(locale).map((a, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `${a.name} Transfers (${a.iata})`,
          url: `https://transferaround.com/airports/${a.slug}`,
        })),
      },
    });
  },
  component: AirportsIndexPage,
});

function AirportsIndexPage() {
  const locale = useLocale();
  const airports = getLocalizedAirports(locale);
  const allRoutes = getLocalizedAirportRoutes(locale);

  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Greece</p>
          <h1 className="mt-3 text-4xl font-display md:text-6xl">Airport transfers</h1>
          <p className="mt-4 max-w-2xl text-lg text-primary-foreground/80">
            Private fixed-price transfers from {airports.length} Greek airports — meet & greet,
            flight tracking, licensed local chauffeurs.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {airports.map((a) => {
            const routes = allRoutes.filter((r) => r.airportSlug === a.slug);
            return (
              <Link
                key={a.slug}
                to="/{-$locale}/airports/$slug"
                params={{ slug: a.slug }}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-lg"
              >
                <div
                  className="aspect-[16/9] bg-cover bg-center"
                  style={{ backgroundImage: `url(${a.heroImage})` }}
                />
                <div className="p-5">
                  <div className="flex items-center gap-2 text-accent-deep">
                    <Plane className="size-4" />
                    <span className="text-xs font-semibold uppercase tracking-wide">{a.iata}</span>
                    {a.bookable === "instant" ? (
                      <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold uppercase text-accent-deep">
                        Instant book
                      </span>
                    ) : (
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
                        Quote
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 text-xl font-display text-primary group-hover:text-accent-deep">
                    {a.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {a.cityName}
                    {a.island ? ` · ${a.island}` : ""}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    From {formatEur(a.fromPriceEur)} · {routes.length} popular routes
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <CtaBand
        title="Ready to book your Greek airport transfer?"
        subtitle="Pick your airport, choose a destination, get a fixed price."
      />
    </>
  );
}
