import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Check, ChevronDown, Clock, MapPin, Plane, Shield, Sparkles } from "lucide-react";
import type { AirportData } from "@/data/airports";
import type { AirportRouteData } from "@/data/airport-routes";
import { relatedAirportsByCountry } from "@/lib/airport-resolve";
import { formatEur } from "@/lib/pricing";
import { BookingWidget } from "@/components/booking-widget";
import { cn } from "@/lib/utils";
import { useLocale, useT } from "@/i18n";
import { getCountryName } from "@/i18n/markets";

function displayCountry(airport: AirportData, locale: ReturnType<typeof useLocale>) {
  return airport.countrySlug ? getCountryName(locale, airport.countrySlug) : airport.country;
}

export function AirportHero({
  airport,
  bookingSlot,
}: {
  airport: AirportData;
  bookingSlot: ReactNode;
}) {
  const t = useT();
  const locale = useLocale();
  return (
    <section className="relative bg-primary text-primary-foreground">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${airport.heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/75 to-primary/40" />
      </div>
      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-16 md:pb-14 md:pt-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {displayCountry(airport, locale)} <span aria-hidden>·</span> {airport.iata}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-display md:text-5xl lg:text-6xl">
          {t.airportPages.transfersTitle(airport.name, airport.iata)}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-primary-foreground/85">
          {t.airportPages.heroDescription}
        </p>
        <p className="mt-4 text-sm text-primary-foreground/65">{t.airportPages.heroTrustLine}</p>
        <div className="mt-8" id="react-picker">
          {bookingSlot}
        </div>
      </div>
    </section>
  );
}

export function AirportInPageNav({ showVehicles = true }: { showVehicles?: boolean }) {
  const t = useT();
  const navItems = [
    { id: "key-transfer-facts", label: t.inpageNav.keyFacts },
    { id: "airport-operational-info", label: t.inpageNav.localInfo },
    { id: "transfer-overview", label: t.inpageNav.overview },
    { id: "transport-comparison", label: t.inpageNav.compare },
    ...(showVehicles ? [{ id: "vehicles-available", label: t.inpageNav.vehicles }] : []),
    { id: "airport-faq", label: t.inpageNav.faqs },
    { id: "related-routes", label: t.inpageNav.related },
  ];
  return (
    <nav
      className="sticky top-0 z-20 border-y border-border bg-background/95 backdrop-blur"
      aria-label={t.inpageNav.ariaLabel}
    >
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 text-sm sm:px-6">
        <a
          href="#react-picker"
          className="shrink-0 rounded-full bg-primary px-4 py-2 font-semibold text-primary-foreground"
        >
          {t.common.bookNow}
        </a>
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="shrink-0 rounded-full px-3 py-2 font-medium text-muted-foreground transition hover:text-accent-deep"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export function AirportBookingSlot({
  airport,
  defaultRouteSlug,
}: {
  airport: AirportData;
  defaultRouteSlug?: string;
}) {
  const t = useT();
  return (
    <div className="relative z-20 rounded-2xl bg-card p-4 text-foreground shadow-xl md:p-6">
      {airport.bookable !== "instant" && (
        <p className="mb-4 text-sm text-muted-foreground">
          {airport.fromPriceEur > 0
            ? t.airportPages.quoteNote(formatEur(airport.fromPriceEur))
            : t.marketsDirectory.quoteFirst}
        </p>
      )}
      <BookingWidget defaultIata={airport.iata} defaultRoute={defaultRouteSlug} compact />
    </div>
  );
}

export function AirportFacts({ airport }: { airport: AirportData }) {
  const t = useT();
  const locale = useLocale();
  const facts = [
    { label: t.airportPages.airportName, value: `${airport.name} (${airport.iata})` },
    { label: t.airportPages.primaryCity, value: airport.cityName },
    { label: t.airportPages.country, value: displayCountry(airport, locale) },
    {
      label: t.airportPages.startingPrice,
      value:
        airport.fromPriceEur > 0 ? formatEur(airport.fromPriceEur) : t.marketsDirectory.quoteFirst,
    },
    {
      label: t.routesPages.factTracking,
      value: t.airportPages.flightMonitoringValue,
    },
    {
      label: t.airportPages.waitingTime,
      value: t.airportPages.waitingTimeValue,
    },
  ];

  return (
    <section id="key-transfer-facts" className="bg-secondary/40 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <nav className="mb-6 flex flex-wrap gap-2 text-xs uppercase tracking-wide text-muted-foreground">
          <Link to="/{-$locale}" className="hover:text-accent-deep">
            {t.nav.home}
          </Link>
          <span>/</span>
          <Link to="/{-$locale}/airports" className="hover:text-accent-deep">
            {t.nav.airports}
          </Link>
          <span>/</span>
          <span className="text-foreground">{airport.name}</span>
        </nav>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-2xl font-display text-primary sm:text-3xl">
            {t.airportPages.factsTitle(airport.name, airport.iata)}
          </h2>
          <p className="text-xs text-muted-foreground">
            {t.airportPages.updated(airport.updatedAt)}
          </p>
        </div>
        <p className="mt-3 max-w-3xl text-base text-muted-foreground">{airport.intro}</p>
        <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {facts.map((f) => (
            <div key={f.label} className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <dt className="text-sm text-muted-foreground">{f.label}</dt>
              <dd className="mt-1 font-medium text-foreground">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function AirportTrustStrip() {
  const t = useT();
  const items = [
    { icon: Shield, label: t.trust.licensed, value: t.airportPages.privateHire },
    {
      icon: Sparkles,
      label: t.airportPages.arrivalCare,
      value: t.advantages.meetTitle,
    },
    {
      icon: Check,
      label: t.airportPages.transparentFares,
      value: t.common.fixedPrice,
    },
    { icon: Clock, label: t.airportPages.flexibility, value: t.trust.freeCancel },
  ];
  return (
    <section
      className="border-b border-border bg-card py-6"
      aria-label={t.airportPages.trustHighlights}
    >
      <div className="mx-auto flex max-w-7xl gap-4 overflow-x-auto px-6">
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex min-w-[180px] flex-1 items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-accent/15 text-accent-deep">
              <Icon className="size-4" />
            </span>
            <div>
              <p className="text-xs font-semibold text-muted-foreground">{label}</p>
              <p className="text-sm font-bold text-foreground">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AirportKnowBefore({ airport }: { airport: AirportData }) {
  const t = useT();
  return (
    <section id="airport-operational-info" className="bg-background py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-2xl font-display text-primary sm:text-3xl">
          {t.airportPages.knowBeforeTitle(airport.name, airport.iata)}
        </h2>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          {t.airportPages.knowBeforeBody(airport.name)}
        </p>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {airport.knowBefore.map((tip) => (
            <div key={tip.title} className="border-t border-border pt-6">
              <h3 className="text-base font-semibold text-foreground">{tip.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tip.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AirportInsights({ airport }: { airport: AirportData }) {
  const t = useT();
  const locale = useLocale();
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="transfer-overview" className="bg-secondary/40 py-14 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <h2 className="text-3xl font-display text-primary sm:text-4xl">
            {t.airportPages.insightsTitle(airport.name)}
          </h2>
          <div
            className={cn(
              "relative mt-6 space-y-4 overflow-hidden transition-all",
              expanded ? "max-h-none" : "max-h-[28rem]",
            )}
          >
            {airport.insights.map((p, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card/90 p-6 text-sm leading-relaxed text-muted-foreground shadow-sm"
                dangerouslySetInnerHTML={{
                  __html: p.replace(
                    /\*\*(.*?)\*\*/g,
                    "<strong class='text-foreground'>$1</strong>",
                  ),
                }}
              />
            ))}
            {!expanded && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-secondary/95 to-transparent" />
            )}
          </div>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2 text-sm font-semibold text-foreground transition hover:border-accent"
          >
            {expanded ? t.airportPages.showLess : t.airportPages.readMoreInsights}
            <ChevronDown className={cn("size-4 transition", expanded && "rotate-180")} />
          </button>
        </div>

        <aside className="rounded-3xl border border-border bg-card p-6 shadow-xl">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-accent/15 text-accent-deep">
              <Plane className="size-5" />
            </span>
            <div>
              <h3 className="text-xl font-display text-primary">{airport.name}</h3>
              <p className="text-sm text-muted-foreground">{airport.cityName}</p>
            </div>
          </div>
          <div className="mt-6 space-y-2 text-sm">
            <InfoRow label={t.airportPages.status} value={t.airportPages.operating} highlight />
            <InfoRow label={t.airportPages.officialName} value={airport.officialName} />
            <InfoRow label={t.airportPages.iataCode} value={airport.iata} />
            <InfoRow label={t.airportPages.address} value={airport.address} />
            <div className="flex flex-col gap-1 rounded-2xl bg-secondary/60 px-4 py-3 sm:flex-row sm:justify-between">
              <span className="font-bold text-muted-foreground">{t.airportPages.city}</span>
              <Link
                to="/{-$locale}/cities/$slug"
                params={{ slug: airport.citySlug }}
                className="font-bold text-accent-deep hover:underline sm:text-right"
              >
                {airport.cityName}
              </Link>
            </div>
            <div className="flex flex-col gap-1 rounded-2xl bg-secondary/60 px-4 py-3 sm:flex-row sm:justify-between">
              <span className="font-bold text-muted-foreground">{t.airportPages.country}</span>
              <Link
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                to={`/{-$locale}/${airport.countrySlug ?? "greece"}` as any}
                className="font-bold text-accent-deep hover:underline sm:text-right"
              >
                {displayCountry(airport, locale)}
              </Link>
            </div>
            {airport.zip ? <InfoRow label={t.airportPages.zipcode} value={airport.zip} /> : null}
            <InfoRow label={t.airportPages.alias} value={airport.alias} />
            <InfoRow label={t.airportPages.pickup} value={airport.pickupPoint} />
            <InfoRow label={t.airportPages.terminals} value={airport.terminals} />
          </div>
          <div className="mt-6 overflow-hidden rounded-2xl border border-border">
            <img
              src={airport.heroImage}
              alt={`${airport.name} transfers`}
              className="aspect-square w-full object-cover"
              loading="lazy"
            />
          </div>
        </aside>
      </div>
    </section>
  );
}

function InfoRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-2xl px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
        highlight ? "bg-accent/15 font-bold text-accent-deep" : "bg-secondary/60",
      )}
    >
      <span className={highlight ? undefined : "font-bold text-muted-foreground"}>{label}</span>
      <span className={cn("sm:text-right", !highlight && "text-foreground")}>{value}</span>
    </div>
  );
}

export function AirportComparison({ airport }: { airport: AirportData }) {
  const t = useT();
  return (
    <section id="transport-comparison" className="bg-background py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-2xl font-display text-primary sm:text-3xl">
          {t.airportPages.comparisonTitle(airport.name, airport.iata, airport.cityName)}
        </h2>
        <p className="mt-2 max-w-3xl text-muted-foreground">{t.airportPages.comparisonBody}</p>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-bold">{t.airportPages.mode}</th>
                <th className="px-4 py-3 font-bold">{t.widget.time}</th>
                <th className="px-4 py-3 font-bold">{t.airportPages.cost}</th>
                <th className="px-4 py-3 font-bold">{t.airportPages.pros}</th>
                <th className="px-4 py-3 font-bold">{t.airportPages.cons}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {airport.comparison.map((row) => (
                <tr
                  key={row.mode}
                  className={cn(row.recommended && "bg-accent/10 font-medium text-foreground")}
                >
                  <td className="px-4 py-4 align-top">
                    <span className="font-bold">
                      {row.mode.replace(
                        "TransferAround private transfer",
                        "TransferAround private transfer",
                      )}
                    </span>
                    {row.recommended ? (
                      <span className="ml-2 inline-flex rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase text-accent-foreground">
                        {t.airportPages.recommended}
                      </span>
                    ) : null}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 align-top">{row.time}</td>
                  <td className="whitespace-nowrap px-4 py-4 align-top">{row.cost}</td>
                  <td className="px-4 py-4 align-top text-muted-foreground">{row.pros}</td>
                  <td className="px-4 py-4 align-top text-muted-foreground">{row.cons}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{t.airportPages.comparisonNote}</p>
      </div>
    </section>
  );
}

export function AirportVehicles({
  airport,
  vehicles,
}: {
  airport: AirportData;
  vehicles: {
    id: string;
    label: string;
    capacity: string;
    bags: string;
    example: string;
    fromEur: number;
  }[];
}) {
  const t = useT();
  return (
    <section id="vehicles-available" className="bg-secondary/40 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-2xl font-display text-primary sm:text-3xl">
          {t.airportPages.vehiclesTitle(airport.name, airport.iata)}
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">{t.airportPages.vehiclesBody}</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => (
            <a
              key={v.id}
              href="#react-picker"
              className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-accent/40 hover:shadow-lg"
            >
              <h3 className="text-lg font-bold text-foreground">{v.label}</h3>
              <p className="text-xs text-muted-foreground">{v.example}</p>
              <div className="mt-4 flex items-end justify-between">
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3" />
                    {v.capacity}
                  </span>
                  <span>{v.bags}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground">{t.common.from}</span>
                  <p className="text-xl font-bold text-foreground">{formatEur(v.fromEur)}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AirportFaqs({
  title,
  subtitle,
  faqs,
}: {
  title: string;
  subtitle: string;
  faqs: { q: string; a: string }[];
}) {
  const t = useT();
  return (
    <section id="airport-faq" className="bg-background py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-display text-primary sm:text-4xl">{title}</h2>
          <p className="mt-3 text-muted-foreground">{subtitle}</p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition open:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-left text-sm font-medium text-foreground">
                <span>{f.q}</span>
                <ChevronDown className="mt-0.5 size-4 shrink-0 text-accent-deep transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 border-t border-border pt-3 text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AirportPopularRoutes({
  airport,
  routes,
}: {
  airport: AirportData;
  routes: AirportRouteData[];
}) {
  const t = useT();
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? routes : routes.slice(0, 6);

  return (
    <section id="related-routes" className="bg-background py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-display text-primary sm:text-4xl">
              {t.airportPages.popularRoutesTitle(airport.name, airport.iata)}
            </h2>
            <p className="mt-2 max-w-3xl text-muted-foreground">
              {t.airportPages.popularRoutesBody}
            </p>
          </div>
          {routes.length > 6 ? (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-bold text-foreground hover:border-accent"
            >
              {showAll ? t.airportPages.showFewer : t.airportPages.viewMore}
            </button>
          ) : null}
        </div>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((r) => (
            <li key={r.routeSlug}>
              <Link
                to="/{-$locale}/airports/$slug/$routeSlug"
                params={{ slug: airport.slug, routeSlug: r.routeSlug }}
                className="block rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-lg"
              >
                <span className="text-sm uppercase tracking-wide text-accent-deep">
                  {t.airportPages.route}
                </span>
                <span className="mt-2 block text-lg font-bold text-foreground">
                  {t.airportPages.transferFromTo(r.fromName, r.toName)}
                </span>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between rounded-lg bg-secondary/60 px-3 py-2">
                    <dt className="font-bold">{t.routesPages.factFromPrice}</dt>
                    <dd className="font-bold">{formatEur(r.basePriceEur)}</dd>
                  </div>
                  <div className="flex justify-between rounded-lg bg-secondary/60 px-3 py-2">
                    <dt className="font-bold">{t.routesPages.factDuration}</dt>
                    <dd>{r.durationMin} min</dd>
                  </div>
                  <div className="flex justify-between rounded-lg bg-secondary/60 px-3 py-2">
                    <dt className="font-bold">{t.routesPages.factDistance}</dt>
                    <dd>{r.distanceKm} km</dd>
                  </div>
                </dl>
                <span className="mt-3 inline-flex text-sm font-bold text-muted-foreground">
                  {t.airportPages.compareFares} <span aria-hidden>→</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function OtherAirportsInCountry({ airport }: { airport: AirportData }) {
  const t = useT();
  const locale = useLocale();
  // Country-aware: show other airports in the same country (curated slug where a
  // rich page exists, generated slug otherwise). Falls back to nothing if none.
  const others = relatedAirportsByCountry(airport.iata, 9);
  if (others.length === 0) return null;
  const country = displayCountry(airport, locale);
  return (
    <section className="bg-secondary/40 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-2xl font-display text-primary sm:text-3xl">
          {t.airportPages.otherAirportsTitle(country)}
        </h2>
        <p className="mt-2 text-muted-foreground">{t.airportPages.otherAirportsBody(country)}</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((a) => (
            <li key={a.slug}>
              <Link
                to="/{-$locale}/airports/$slug"
                params={{ slug: a.slug }}
                className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium shadow-sm transition hover:border-accent"
              >
                <span>
                  {a.name} ({a.iata})
                </span>
                <span className="text-accent-deep transition group-hover:translate-x-1">→</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          to="/{-$locale}/airports"
          className="mt-6 inline-flex text-sm font-semibold text-accent-deep hover:underline"
        >
          {t.airportPages.viewAllAirports} <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}

export function useRevealOnMount() {
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);
}
