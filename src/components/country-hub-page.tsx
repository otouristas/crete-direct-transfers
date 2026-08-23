import { Link } from "@tanstack/react-router";
import { listCityDestinations } from "@/data/destinations";
import { type Market } from "@/data/markets";
import { formatEur } from "@/lib/pricing";
import { useLocale, useT } from "@/i18n";
import {
  getLocalizedAirports,
  getLocalizedCountryGuide,
  getLocalizedMarketHubAirports,
  getLocalizedMarketHubCities,
} from "@/i18n/content";
import { CtaBand } from "@/components/sections/cta-band";
import { BookingWidget } from "@/components/booking-widget";
import { ServicesRail } from "@/components/sections/services-rail";
import { PhotoCredit } from "@/components/photo-credit";
import { Reveal } from "@/components/reveal";
import { FaqAccordion } from "@/components/faq-accordion";
import { getCityImage, getCountryImage, imageUrl } from "@/lib/place-image";
import { translate } from "@transferaround/i18n";
import { ArrowUpRight, Plane } from "lucide-react";

const HERO_IATA: Record<string, string> = {
  greece: "HER",
  spain: "MAD",
  italy: "FCO",
  portugal: "LIS",
  cyprus: "LCA",
  turkey: "IST",
};

const HERO_DESTINATIONS = {
  en: [
    "Elounda",
    "Madrid city centre",
    "Rome city centre",
    "Lisbon city centre",
    "Limassol",
    "Istanbul city centre",
  ],
  el: [
    "Ελούντα",
    "Κέντρο Μαδρίτης",
    "Κέντρο Ρώμης",
    "Κέντρο Λισαβόνας",
    "Λεμεσός",
    "Κέντρο Κωνσταντινούπολης",
  ],
  de: [
    "Elounda",
    "Stadtzentrum Madrid",
    "Stadtzentrum Rom",
    "Stadtzentrum Lissabon",
    "Limassol",
    "Stadtzentrum Istanbul",
  ],
  fr: [
    "Elounda",
    "Centre de Madrid",
    "Centre de Rome",
    "Centre de Lisbonne",
    "Limassol",
    "Centre d’Istanbul",
  ],
  it: [
    "Elounda",
    "Centro di Madrid",
    "Centro di Roma",
    "Centro di Lisbona",
    "Limassol",
    "Centro di Istanbul",
  ],
  nl: [
    "Elounda",
    "Centrum van Madrid",
    "Centrum van Rome",
    "Centrum van Lissabon",
    "Limassol",
    "Centrum van Istanbul",
  ],
  es: [
    "Elounda",
    "Centro de Madrid",
    "Centro de Roma",
    "Centro de Lisboa",
    "Limasol",
    "Centro de Estambul",
  ],
} as const;

const HERO_MARKETS = ["greece", "spain", "italy", "portugal", "cyprus", "turkey"] as const;

/**
 * Country landing page: a travel guide and the market's commercial hub in one.
 *
 * The editorial half (where to go, when, what to know) comes from
 * country-guides.ts; the commercial half (airports, cities, prices, services)
 * comes from the coverage data. They interleave deliberately — someone reading
 * about the Amalfi road should meet the transfer that drives it, not a separate
 * sales page.
 */
export function CountryHubPage({ market }: { market: Market }) {
  const t = useT();
  const locale = useLocale();
  const tr = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  const isGreece = market.slug === "greece";
  const guide = getLocalizedCountryGuide(locale, market.slug);
  const heroPhoto = getCountryImage(market.slug);

  const airports = isGreece
    ? getLocalizedAirports(locale)
    : getLocalizedMarketHubAirports(locale, market.slug);
  const cities = isGreece
    ? listCityDestinations().slice(0, 18)
    : getLocalizedMarketHubCities(locale, market.slug);

  const heroIndex = HERO_MARKETS.indexOf(market.slug as (typeof HERO_MARKETS)[number]);
  const heroDefault =
    heroIndex >= 0
      ? { iata: HERO_IATA[market.slug], destination: HERO_DESTINATIONS[locale][heroIndex] }
      : undefined;

  return (
    <>
      {/* Hero — country photography, the same layered treatment as the homepage */}
      <section className="relative bg-primary text-primary-foreground">
        <div className="pointer-events-none hero-stage" aria-hidden>
          <div
            className="hero-photo media-grade"
            style={{ backgroundImage: `url(${imageUrl(heroPhoto, { width: 2400 })})` }}
          />
          <div className="hero-scrim" />
          <div className="hero-grain" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-24">
          <p className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/85 ring-1 ring-primary-foreground/15">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
            {t.seo.guideGuideLabel}
          </p>
          <h1 className="mt-5 font-display text-4xl leading-[1.02] tracking-[-0.025em] md:text-6xl">
            {market.heroTitle}
          </h1>
          {guide ? (
            <p className="mt-4 max-w-2xl font-accent text-xl text-accent md:text-2xl">
              {guide.tagline}
            </p>
          ) : null}
          <p className="mt-4 max-w-2xl text-lg text-primary-foreground/80">{market.heroBody}</p>

          {heroDefault ? (
            <div className="relative z-20 mt-10">
              <BookingWidget
                variant="hbar"
                defaultIata={heroDefault.iata}
                defaultDestination={heroDefault.destination}
              />
            </div>
          ) : null}

          <PhotoCredit image={heroPhoto} overlay className="bottom-3" />
        </div>
      </section>

      {/* At a glance — practical facts plus our own coverage numbers */}
      {guide ? (
        <section className="border-b border-border bg-card">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-7 px-6 py-9 md:grid-cols-3 lg:grid-cols-6">
            {guide.facts.map((fact) => (
              <div key={fact.label}>
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {fact.label}
                </div>
                <div className="mt-1.5 text-sm font-medium text-primary">{fact.value}</div>
              </div>
            ))}
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {t.seo.airportsCovered}
              </div>
              <div className="mt-1.5 text-sm font-medium text-primary">
                {t.home.countriesAirports(airports.length)}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* The guide */}
      {guide ? (
        <section className="bg-background">
          <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
            <Reveal>
              <h2 className="text-2xl font-display text-primary md:text-3xl">
                {t.seo.guideIntroTitle} {market.name}
              </h2>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                {guide.intro}
              </p>
            </Reveal>

            {/* Where to go — photo cards, so the guide reads as a guide */}
            <div className="mt-16">
              <Reveal>
                <h2 className="text-2xl font-display text-primary md:text-3xl">
                  {t.seo.guideHighlights}
                </h2>
              </Reveal>
              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {guide.highlights.map((highlight) => {
                  const photo = highlight.citySlug
                    ? getCityImage(highlight.citySlug, market.slug)
                    : null;
                  return (
                    <article
                      key={highlight.title}
                      className="overflow-hidden rounded-2xl border border-border bg-card"
                    >
                      {photo ? (
                        <div className="aspect-[16/10] overflow-hidden">
                          <img
                            src={imageUrl(photo, { width: 700 })}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            style={{ backgroundColor: photo.avgColor }}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : null}
                      <div className="p-6">
                        <h3 className="font-display text-xl text-primary">{highlight.title}</h3>
                        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                          {highlight.body}
                        </p>
                        {/* Credit sits on the card, not the photo: white-on-photo
                            was unreadable over bright skies and stonework. */}
                        {photo ? <PhotoCredit image={photo} className="mt-4" /> : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* When to visit */}
            <div className="mt-16">
              <Reveal>
                <h2 className="text-2xl font-display text-primary md:text-3xl">
                  {t.seo.guideSeasons}
                </h2>
              </Reveal>
              <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
                {guide.seasons.map((season) => (
                  <div key={season.season} className="bg-card p-6">
                    <div className="font-display text-lg text-primary">{season.season}</div>
                    <div className="mt-0.5 text-xs font-medium uppercase tracking-[0.1em] text-accent-deep">
                      {season.months}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {season.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Getting around — the hinge where the guide becomes the service */}
      {guide ? (
        <section className="border-y border-border bg-muted/40">
          <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
              <Reveal>
                <h2 className="text-2xl font-display text-primary md:text-3xl">
                  {guide.gettingAroundTitle}
                </h2>
                <ul className="mt-7 space-y-5">
                  {guide.gettingAround.map((point) => (
                    <li key={point} className="flex gap-3.5">
                      <span
                        aria-hidden
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                      />
                      <p className="text-sm leading-relaxed text-muted-foreground">{point}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={1}>
                <h2 className="text-2xl font-display text-primary md:text-3xl">
                  {t.seo.guideServices}
                </h2>
                <div className="mt-7">
                  <ServicesRail compact />
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        {/* Airports */}
        <div>
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-display text-primary md:text-3xl">
              {t.seo.airportsCovered}
            </h2>
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
                <Link
                  to="/{-$locale}/airports/$slug"
                  params={{ slug: a.slug }}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3.5 text-sm font-medium transition hover:border-accent hover:shadow-sm"
                >
                  <span className="inline-flex min-w-0 items-center gap-2.5">
                    <Plane className="h-4 w-4 shrink-0 text-accent-deep" aria-hidden />
                    <span className="truncate">
                      {a.name} {"iata" in a ? `(${a.iata})` : ""}
                    </span>
                  </span>
                  <span className="shrink-0 text-muted-foreground">
                    {"fromPriceEur" in a && a.fromPriceEur > 0
                      ? formatEur(a.fromPriceEur)
                      : tr("market.quoteOnly")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Cities — photo cards rather than chips */}
        <div className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-display text-primary md:text-3xl">
              {t.seo.citiesCovered}
            </h2>
            {isGreece && (
              <Link
                to="/{-$locale}/cities"
                className="text-sm font-semibold text-accent-deep hover:underline"
              >
                {t.seo.viewAll}
              </Link>
            )}
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cities.slice(0, 12).map((c) => {
              const photo = getCityImage(c.slug, market.slug);
              return (
                <div
                  key={c.slug}
                  className="group relative isolate h-40 overflow-hidden rounded-2xl"
                >
                  <img
                    src={imageUrl(photo, { width: 500 })}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    style={{ backgroundColor: photo.avgColor }}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-primary from-0% via-primary/50 via-40% to-transparent to-80%"
                  />
                  <Link
                    to="/{-$locale}/cities/$slug"
                    params={{ slug: c.slug }}
                    className="absolute inset-0 flex items-end justify-between gap-2 p-4 text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
                  >
                    <span className="truncate font-display text-lg">{c.name}</span>
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 opacity-70 transition group-hover:opacity-100"
                      aria-hidden
                    />
                  </Link>
                </div>
              );
            })}
          </div>
          {cities.length > 12 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {cities.slice(12).map((c) => (
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
          )}
        </div>

        {/* Know before you go */}
        {guide ? (
          <div className="mt-16">
            <Reveal>
              <h2 className="text-2xl font-display text-primary md:text-3xl">
                {t.seo.guideKnowBefore}
              </h2>
            </Reveal>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {guide.knowBefore.map((tip) => (
                <div
                  key={tip.title}
                  className="rounded-2xl border border-border bg-card p-6 [border-left-width:3px] [border-left-color:var(--accent)]"
                >
                  <h3 className="font-display text-lg text-primary">{tip.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tip.body}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Search intents — kept for SEO, demoted below the editorial content */}
        <div className="mt-16">
          <h2 className="text-2xl font-display text-primary md:text-3xl">{t.seo.searchIntents}</h2>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {market.searchIntents.map((label) => (
              <li
                key={label}
                className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground"
              >
                {label}
              </li>
            ))}
          </ul>
        </div>

        {!isGreece && (
          <div className="mt-16 max-w-3xl space-y-4 leading-relaxed text-muted-foreground">
            <h2 className="text-2xl font-display text-primary md:text-3xl">
              {tr("market.bookingTitle")}
            </h2>
            <p>{tr("market.bookingBody")}</p>
          </div>
        )}
      </section>

      {/* FAQs */}
      {guide && guide.faqs.length > 0 ? (
        <section className="border-t border-border bg-muted/40">
          <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
            {/* Matches city-to-city and hourly-service: one titled group. */}
            <FaqAccordion groups={[{ title: t.seo.guideFaqs, items: guide.faqs }]} />
          </div>
        </section>
      ) : null}

      <CtaBand title={tr("market.ctaTitle")} subtitle={tr("market.ctaSubtitle")} />
    </>
  );
}
