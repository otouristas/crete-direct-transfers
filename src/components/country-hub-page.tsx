import { Link } from "@tanstack/react-router";
import { listCityDestinations } from "@/data/destinations";
import { type Market } from "@/data/markets";
import { formatEur } from "@/lib/pricing";
import { useLocale, useT } from "@/i18n";
import {
  getLocalizedAirports,
  getLocalizedMarketHubAirports,
  getLocalizedMarketHubCities,
} from "@/i18n/content";
import { CtaBand } from "@/components/sections/cta-band";
import { AskTouristasBand } from "@/components/touristas-ai/ask-band";
import { translate } from "@transferaround/i18n";

export function CountryHubPage({ market }: { market: Market }) {
  const t = useT();
  const locale = useLocale();
  const tr = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  const isGreece = market.slug === "greece";
  const airports = isGreece
    ? getLocalizedAirports(locale)
    : getLocalizedMarketHubAirports(locale, market.slug);
  const cities = isGreece
    ? listCityDestinations().slice(0, 18)
    : getLocalizedMarketHubCities(locale, market.slug);

  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {t.seo.countryEyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-display md:text-6xl">{market.heroTitle}</h1>
          <p className="mt-4 max-w-2xl text-lg text-primary-foreground/80">{market.heroBody}</p>
        </div>
      </section>

      <AskTouristasBand
        pageType="country"
        entityLabel={market.name}
        entitySlug={market.slug}
        market={
          market.slug === "greece" || market.slug === "spain" || market.slug === "italy"
            ? market.slug
            : undefined
        }
      />

      <section className="mx-auto max-w-7xl px-6 py-14">
        <h2 className="text-2xl font-display text-primary">{t.seo.searchIntents}</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {market.searchIntents.map((label) => (
            <li
              key={label}
              className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground"
            >
              {label}
            </li>
          ))}
        </ul>

        <div className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-display text-primary">{t.seo.airportsCovered}</h2>
            {isGreece && (
              <Link
                to="/{-$locale}/airports"
                className="text-sm font-semibold text-accent-deep hover:underline"
              >
                {t.seo.viewAll}
              </Link>
            )}
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {airports.map((a) => (
              <li key={a.slug}>
                {isGreece ? (
                  <Link
                    to="/{-$locale}/airports/$slug"
                    params={{ slug: a.slug }}
                    className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium hover:border-accent"
                  >
                    <span>
                      {a.name} {"iata" in a ? `(${a.iata})` : ""}
                    </span>
                    <span className="text-muted-foreground">
                      {formatEur("fromPriceEur" in a ? a.fromPriceEur : 0)}
                    </span>
                  </Link>
                ) : (
                  <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium">
                    <span>
                      {a.name} ({a.iata})
                    </span>
                    <span className="text-muted-foreground">{tr("market.quoteOnly")}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-display text-primary">{t.seo.citiesCovered}</h2>
            {isGreece && (
              <Link
                to="/{-$locale}/cities"
                className="text-sm font-semibold text-accent-deep hover:underline"
              >
                {t.seo.viewAll}
              </Link>
            )}
          </div>
          <ul className="mt-6 flex flex-wrap gap-2">
            {cities.map((c) => (
              <li key={c.slug}>
                {isGreece ? (
                  <Link
                    to="/{-$locale}/cities/$slug"
                    params={{ slug: c.slug }}
                    className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm hover:border-accent"
                  >
                    {c.name}
                  </Link>
                ) : (
                  <span className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm">
                    {c.name}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {!isGreece && (
          <div className="mt-14 max-w-3xl space-y-4 text-muted-foreground leading-relaxed">
            <h2 className="text-2xl font-display text-primary">{tr("market.bookingTitle")}</h2>
            <p>{tr("market.bookingBody")}</p>
          </div>
        )}
      </section>

      <CtaBand title={tr("market.ctaTitle")} subtitle={tr("market.ctaSubtitle")} />
    </>
  );
}
