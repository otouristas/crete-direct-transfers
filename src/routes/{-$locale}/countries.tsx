import { createFileRoute, Link } from "@tanstack/react-router";
import { MARKETS } from "@/data/markets";
import { MARKET_HUB_AIRPORTS, MARKET_HUB_CITIES } from "@/data/market-hubs";
import { buildHead } from "@/lib/seo";
import { getDict, useLocale, useT, type Locale } from "@/i18n";
import { localizeMarket } from "@/i18n/markets";
import { getMarketNavigation } from "@/lib/market-navigation";

export const Route = createFileRoute("/{-$locale}/countries")({
  head: ({ params }) => {
    const locale = (params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/countries",
      title: t.marketsDirectory.metaTitle,
      description: t.marketsDirectory.metaDescription,
    });
  },
  component: CountriesPage,
});

function CountriesPage() {
  const locale = useLocale();
  const t = useT();
  const navigation = getMarketNavigation(locale);
  const markets = MARKETS.map((market) => localizeMarket(market, locale));

  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {t.nav.destinations}
          </p>
          <h1 className="mt-3 text-4xl font-display md:text-6xl">{t.marketsDirectory.title}</h1>
          <p className="mt-4 max-w-3xl text-lg text-primary-foreground/80">
            {t.marketsDirectory.subtitle}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {markets.map((market) => {
            const navItem = navigation.find((item) => item.slug === market.slug)!;
            const airportCount =
              market.slug === "greece"
                ? undefined
                : MARKET_HUB_AIRPORTS.filter((airport) => airport.countrySlug === market.slug)
                    .length;
            const cityCount =
              market.slug === "greece"
                ? undefined
                : MARKET_HUB_CITIES.filter((city) => city.countrySlug === market.slug).length;

            return (
              <Link
                key={market.slug}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                to={`/{-$locale}/${market.slug}` as any}
                className="group flex min-h-72 flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-accent hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="text-4xl" aria-hidden>
                    {navItem.flag}
                  </span>
                  <span className="rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-accent-deep">
                    {market.slug === "greece"
                      ? t.marketsDirectory.instantCrete
                      : t.marketsDirectory.quoteFirst}
                  </span>
                </div>
                <h2 className="mt-5 text-2xl font-display text-primary">{market.name}</h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {market.heroBody}
                </p>
                {airportCount !== undefined && cityCount !== undefined ? (
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {airportCount} {t.nav.airports} · {cityCount} {t.nav.cities}
                  </p>
                ) : null}
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent-deep">
                  {t.marketsDirectory.explore}
                  <span aria-hidden>→</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
