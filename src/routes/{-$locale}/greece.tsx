import { createFileRoute, Link } from "@tanstack/react-router";
import { AIRPORTS } from "@/data/airports";
import { listCityDestinations } from "@/data/destinations";
import { formatEur } from "@/lib/pricing";
import { buildHead } from "@/lib/seo";
import { type Locale } from "@/i18n";
import { CtaBand } from "@/components/sections/cta-band";

export const Route = createFileRoute("/{-$locale}/greece")({
  head: ({ params }) => {
    const locale = (params.locale ?? "en") as Locale;
    return buildHead({
      locale,
      path: "/greece",
      title: "Private Transfers in Greece | Airports & Cities · TransferAround",
      description:
        "Fixed-price private transfers across Greece — Athens, Crete, Cyclades, Ionian and Dodecanese airports. Licensed local drivers, meet & greet, flight tracking.",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Private transfers in Greece",
        provider: { "@type": "LocalBusiness", name: "TransferAround" },
        areaServed: { "@type": "Country", name: "Greece" },
      },
    });
  },
  component: GreecePage,
});

function GreecePage() {
  const cities = listCityDestinations().slice(0, 18);

  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Country</p>
          <h1 className="mt-3 text-4xl font-display md:text-6xl">
            Private transportation in Greece
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-primary-foreground/80">
            Airport pickups, island resorts and mainland cities — fixed prices with licensed local
            chauffeurs. Instant booking on Crete; quote confirmation elsewhere in Greece.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <h2 className="text-2xl font-display text-primary">Popular search intents</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Private airport transfer in Greece",
            "Taxi service in Greece",
            "City-to-city rides across Greece",
            "Chauffeur service in Greece",
            "Island airport transfers",
            "Ferry port transfers",
          ].map((label) => (
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
            <h2 className="text-2xl font-display text-primary">Airports we cover</h2>
            <Link
              to="/{-$locale}/airports"
              className="text-sm font-semibold text-accent-deep hover:underline"
            >
              View all →
            </Link>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {AIRPORTS.map((a) => (
              <li key={a.slug}>
                <Link
                  to="/{-$locale}/airports/$slug"
                  params={{ slug: a.slug }}
                  className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium hover:border-accent"
                >
                  <span>
                    {a.name} ({a.iata})
                  </span>
                  <span className="text-muted-foreground">{formatEur(a.fromPriceEur)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-display text-primary">Cities</h2>
            <Link
              to="/{-$locale}/cities"
              className="text-sm font-semibold text-accent-deep hover:underline"
            >
              View all →
            </Link>
          </div>
          <ul className="mt-6 flex flex-wrap gap-2">
            {cities.map((c) => (
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

        <div className="mt-14 max-w-3xl space-y-4 text-muted-foreground leading-relaxed">
          <h2 className="text-2xl font-display text-primary">Travel tips for Greece</h2>
          <p>
            Greece combines mainland motorways with island road networks that can be narrow and
            busy in summer. Pre-booking a private transfer removes taxi queues at ATH, HER, CHQ
            and the island airports, and locks your fare before you land.
          </p>
          <p>
            Ferry connections from Piraeus, Rafina and Lavrio pair naturally with Athens Airport
            transfers. On Crete, our catalogue covers HER and CHQ corridors with instant fixed
            prices; elsewhere in Greece we confirm quotes quickly with local partner drivers.
          </p>
        </div>
      </section>

      <CtaBand
        title="Plan your Greece transfer"
        subtitle="Airport to hotel, port to resort — one fixed price."
      />
    </>
  );
}
