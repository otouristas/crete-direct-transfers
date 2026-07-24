import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  Check,
  ChevronDown,
  Clock,
  MapPin,
  Plane,
  Shield,
  Sparkles,
} from "lucide-react";
import type { AirportData } from "@/data/airports";
import type { AirportRouteData } from "@/data/airport-routes";
import { AIRPORTS } from "@/data/airports";
import { formatEur } from "@/lib/pricing";
import { BookingWidget } from "@/components/booking-widget";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "key-transfer-facts", label: "Key facts" },
  { id: "airport-operational-info", label: "Local info" },
  { id: "transfer-overview", label: "Airport overview" },
  { id: "transport-comparison", label: "Compare options" },
  { id: "vehicles-available", label: "Vehicles" },
  { id: "airport-faq", label: "FAQs" },
  { id: "related-routes", label: "Popular routes" },
] as const;

export function AirportHero({
  airport,
  bookingSlot,
}: {
  airport: AirportData;
  bookingSlot: ReactNode;
}) {
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
          Greece · {airport.iata}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-display md:text-5xl lg:text-6xl">
          {airport.name} Transfers ({airport.iata})
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-primary-foreground/85">
          Fixed-price private transfers with licensed local chauffeurs. Meet &
          greet, real-time flight tracking and a free 60-minute wait.
        </p>
        <p className="mt-4 text-sm text-primary-foreground/65">
          Fixed price · Free cancellation · Flight monitoring
        </p>
        <div className="mt-8" id="react-picker">
          {bookingSlot}
        </div>
      </div>
    </section>
  );
}

export function AirportInPageNav() {
  return (
    <nav
      className="sticky top-0 z-20 border-y border-border bg-background/95 backdrop-blur"
      aria-label="In-page navigation"
    >
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 text-sm sm:px-6">
        <a
          href="#react-picker"
          className="shrink-0 rounded-full bg-primary px-4 py-2 font-semibold text-primary-foreground"
        >
          Book now
        </a>
        {NAV_ITEMS.map((item) => (
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
  return (
    <div className="relative z-20 rounded-2xl bg-card p-4 text-foreground shadow-xl md:p-6">
      {airport.bookable !== "instant" && (
        <p className="mb-4 text-sm text-muted-foreground">
          From {formatEur(airport.fromPriceEur)} · quote confirmed before you pay.
          Instant checkout is live for Crete; elsewhere we confirm your fare shortly.
        </p>
      )}
      <BookingWidget
        defaultIata={airport.iata}
        defaultRoute={defaultRouteSlug}
        compact
      />
    </div>
  );
}

export function AirportFacts({ airport }: { airport: AirportData }) {
  const facts = [
    { label: "Airport name", value: `${airport.name} (${airport.iata})` },
    { label: "Primary city served", value: airport.cityName },
    { label: "Country", value: airport.country },
    { label: "Starting price", value: formatEur(airport.fromPriceEur) },
    {
      label: "Flight monitoring",
      value: "Real-time flight tracking — driver adjusts if delayed",
    },
    {
      label: "Waiting time",
      value: "60 min free wait at arrivals, 15 min for other pickups",
    },
  ];

  return (
    <section id="key-transfer-facts" className="bg-secondary/40 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <nav className="mb-6 flex flex-wrap gap-2 text-xs uppercase tracking-wide text-muted-foreground">
          <Link to="/{-$locale}" className="hover:text-accent-deep">
            Home
          </Link>
          <span>/</span>
          <Link to="/{-$locale}/airports" className="hover:text-accent-deep">
            Airports
          </Link>
          <span>/</span>
          <span className="text-foreground">{airport.name}</span>
        </nav>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-2xl font-display text-primary sm:text-3xl">
            Essential facts for transfers at {airport.name} ({airport.iata})
          </h2>
          <p className="text-xs text-muted-foreground">Updated {airport.updatedAt}</p>
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
  const items = [
    { icon: Shield, label: "Licensed drivers", value: "Greek private-hire" },
    { icon: Sparkles, label: "Arrival care", value: "Meet & greet included" },
    { icon: Check, label: "Transparent fares", value: "Fixed price" },
    { icon: Clock, label: "Flexibility", value: "Free cancellation" },
  ];
  return (
    <section className="border-b border-border bg-card py-6" aria-label="Trust highlights">
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
  return (
    <section id="airport-operational-info" className="bg-background py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-2xl font-display text-primary sm:text-3xl">
          What to know before your transfer at {airport.name} ({airport.iata})
        </h2>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Tolls, charges, terminal pickup zones and local rules that affect your
          private transfer at {airport.name}.
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
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="transfer-overview" className="bg-secondary/40 py-14 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <h2 className="text-3xl font-display text-primary sm:text-4xl">
            Transfer insights for {airport.name}
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
                  __html: p.replace(/\*\*(.*?)\*\*/g, "<strong class='text-foreground'>$1</strong>"),
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
            {expanded ? "Show less" : "Read more insights"}
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
            <InfoRow label="Status" value="Operating" highlight />
            <InfoRow label="Official name" value={airport.officialName} />
            <InfoRow label="IATA code" value={airport.iata} />
            <InfoRow label="Address" value={airport.address} />
            <div className="flex flex-col gap-1 rounded-2xl bg-secondary/60 px-4 py-3 sm:flex-row sm:justify-between">
              <span className="font-bold text-muted-foreground">City</span>
              <Link
                to="/{-$locale}/cities/$slug"
                params={{ slug: airport.citySlug }}
                className="font-bold text-accent-deep hover:underline sm:text-right"
              >
                {airport.cityName}
              </Link>
            </div>
            <div className="flex flex-col gap-1 rounded-2xl bg-secondary/60 px-4 py-3 sm:flex-row sm:justify-between">
              <span className="font-bold text-muted-foreground">Country</span>
              <Link
                to="/{-$locale}/greece"
                className="font-bold text-accent-deep hover:underline sm:text-right"
              >
                Greece
              </Link>
            </div>
            {airport.zip ? <InfoRow label="Zipcode" value={airport.zip} /> : null}
            <InfoRow label="Alias" value={airport.alias} />
            <InfoRow label="Pickup" value={airport.pickupPoint} />
            <InfoRow label="Terminals" value={airport.terminals} />
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
  return (
    <section id="transport-comparison" className="bg-background py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-2xl font-display text-primary sm:text-3xl">
          Ways to get from {airport.name} ({airport.iata}) to {airport.cityName} — compared
        </h2>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Real time, real cost, real trade-offs across the realistic transport options at this
          airport.
        </p>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-secondary/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-bold">Mode</th>
                <th className="px-4 py-3 font-bold">Time</th>
                <th className="px-4 py-3 font-bold">Cost</th>
                <th className="px-4 py-3 font-bold">Pros</th>
                <th className="px-4 py-3 font-bold">Cons</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {airport.comparison.map((row) => (
                <tr
                  key={row.mode}
                  className={cn(row.recommended && "bg-accent/10 font-medium text-foreground")}
                >
                  <td className="px-4 py-4 align-top">
                    <span className="font-bold">{row.mode.replace("TransferAround private transfer", "TransferAround private transfer")}</span>
                    {row.recommended ? (
                      <span className="ml-2 inline-flex rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase text-accent-foreground">
                        Recommended
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
        <p className="mt-3 text-xs text-muted-foreground">
          Times are typical door-to-door including expected wait. Public-transport fares are
          reference-only and may vary.
        </p>
      </div>
    </section>
  );
}

export function AirportVehicles({
  airport,
  vehicles,
}: {
  airport: AirportData;
  vehicles: { id: string; label: string; capacity: string; bags: string; example: string; fromEur: number }[];
}) {
  return (
    <section id="vehicles-available" className="bg-secondary/40 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-2xl font-display text-primary sm:text-3xl">
          Vehicles available at {airport.name} ({airport.iata})
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Choose the right vehicle for your group size and comfort needs. All fares are fixed and
          include meet & greet.
        </p>
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
                  <span className="text-xs text-muted-foreground">from</span>
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
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? routes : routes.slice(0, 6);

  return (
    <section id="related-routes" className="bg-background py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-display text-primary sm:text-4xl">
              Popular transfer routes from {airport.name} ({airport.iata})
            </h2>
            <p className="mt-2 max-w-3xl text-muted-foreground">
              Discover the most booked private transfers that depart from this airport.
            </p>
          </div>
          {routes.length > 6 ? (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-bold text-foreground hover:border-accent"
            >
              {showAll ? "Show fewer destinations" : "View more destinations"}
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
                <span className="text-sm uppercase tracking-wide text-accent-deep">Route</span>
                <span className="mt-2 block text-lg font-bold text-foreground">
                  Transfer from {r.fromName} to {r.toName}
                </span>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between rounded-lg bg-secondary/60 px-3 py-2">
                    <dt className="font-bold">From</dt>
                    <dd className="font-bold">{formatEur(r.basePriceEur)}</dd>
                  </div>
                  <div className="flex justify-between rounded-lg bg-secondary/60 px-3 py-2">
                    <dt className="font-bold">Duration</dt>
                    <dd>{r.durationMin} min</dd>
                  </div>
                  <div className="flex justify-between rounded-lg bg-secondary/60 px-3 py-2">
                    <dt className="font-bold">Distance</dt>
                    <dd>{r.distanceKm} km</dd>
                  </div>
                </dl>
                <span className="mt-3 inline-flex text-sm font-bold text-muted-foreground">
                  Compare fares →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function OtherAirportsInGreece({ currentSlug }: { currentSlug: string }) {
  const others = AIRPORTS.filter((a) => a.slug !== currentSlug).slice(0, 12);
  return (
    <section className="bg-secondary/40 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-2xl font-display text-primary sm:text-3xl">Other airports in Greece</h2>
        <p className="mt-2 text-muted-foreground">
          Discover more airport transfer options across Greece.
        </p>
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
          View all Greek airports →
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
