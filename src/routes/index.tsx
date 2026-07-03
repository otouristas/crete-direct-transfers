import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ROUTES, VEHICLE_CLASSES } from "@/data/routes";
import { quote, formatEur } from "@/lib/pricing";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const REVIEWS = [
  {
    quote: "Driver was waiting at arrivals with a sign, spotless Mercedes, exactly the price on the website. No surprises.",
    author: "Sarah M.",
    route: "Heraklion Airport → Elounda",
  },
  {
    quote: "Ferry from Piraeus was 40 minutes late at Souda. Driver was there anyway, no extra charge. That's the difference.",
    author: "Andreas K.",
    route: "Souda Port → Chania",
  },
  {
    quote: "Booked a minivan for six of us. Got the driver's WhatsApp the night before. Felt like a friend picking us up.",
    author: "The Whelan family",
    route: "Chania Airport → Rethymno",
  },
  {
    quote: "Used another platform on my last trip, spent 20 minutes on WhatsApp confirming a price. This time: two clicks.",
    author: "Marcus B.",
    route: "Heraklion Airport → Agios Nikolaos",
  },
  {
    quote: "The driver knew exactly which gate at the Domes Elounda to pull into. Local knowledge you don't get elsewhere.",
    author: "Priya S.",
    route: "Heraklion Airport → Elounda",
  },
  {
    quote: "Late-night arrival, sleeping kids. Driver had a booster seat ready as requested. Worth every euro.",
    author: "Jonas H.",
    route: "Chania Airport → Chania Old Town",
  },
];

function HomePage() {
  const navigate = useNavigate();
  const [fromSlug, setFromSlug] = useState(ROUTES[0].slug);
  const [pax, setPax] = useState(2);
  const [date, setDate] = useState("");

  const selected = ROUTES.find((r) => r.slug === fromSlug)!;
  const q = useMemo(
    () => quote({ routeSlug: fromSlug, vehicleClass: "economy" }),
    [fromSlug],
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/book",
      search: { route: fromSlug, class: "economy", date, pax },
    });
  };

  const popular = ROUTES.slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1601581875039-e899893d520c?auto=format&fit=crop&w=2000&q=80)",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-primary/80" />
        <div className="mx-auto max-w-6xl px-6 pt-24 pb-32 text-primary-foreground">
          <div className="max-w-2xl">
            <div className="text-sm uppercase tracking-[0.2em] text-accent">
              Fixed price. Local drivers. No bidding.
            </div>
            <h1 className="mt-6 text-5xl md:text-6xl font-serif leading-[1.05]">
              Crete transfers,<br />
              priced before you book.
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/80 max-w-xl">
              A curated fleet of licensed Cretan drivers. Airport, port and cross-island routes at a
              guaranteed price — quoted the moment you enter your trip.
            </p>
          </div>

          {/* Quote widget */}
          <form
            onSubmit={submit}
            className="mt-12 rounded-2xl bg-background text-foreground shadow-2xl p-6 md:p-8 grid gap-4 md:grid-cols-[1fr_140px_120px_auto] items-end"
          >
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">
                Route
              </label>
              <select
                value={fromSlug}
                onChange={(e) => setFromSlug(e.target.value)}
                className="mt-1 w-full bg-transparent border-b border-border py-2 text-base focus:outline-none focus:border-accent"
              >
                {ROUTES.map((r) => (
                  <option key={r.slug} value={r.slug}>
                    {r.from} → {r.to}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">
                Pickup
              </label>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 w-full bg-transparent border-b border-border py-2 text-base focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">
                Pax
              </label>
              <input
                type="number"
                min={1}
                max={8}
                value={pax}
                onChange={(e) => setPax(Number(e.target.value))}
                className="mt-1 w-full bg-transparent border-b border-border py-2 text-base focus:outline-none focus:border-accent"
              />
            </div>
            <button
              type="submit"
              className="rounded-full bg-accent px-6 py-3 text-accent-foreground text-sm hover:opacity-90"
            >
              Get fixed price
            </button>
            <div className="md:col-span-4 flex flex-wrap items-baseline justify-between pt-4 border-t border-border">
              <div className="text-sm text-muted-foreground">
                {selected.distanceKm} km · {selected.durationMin} min · Economy from
              </div>
              <div className="font-serif text-3xl text-primary">
                {q ? formatEur(q.totalEur) : "—"}
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-border/60 bg-background">
        <div className="mx-auto max-w-6xl px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          {[
            ["Fixed price", "Quoted before you book. No bidding, no surge."],
            ["Licensed drivers", "Every driver KTEL-licensed and insured."],
            ["Free cancellation", "Up to 24h before pickup, no charge."],
            ["Flight tracked", "Late flight? Driver waits, still fixed price."],
          ].map(([title, body]) => (
            <div key={title}>
              <div className="font-serif text-lg text-primary">{title}</div>
              <div className="mt-1 text-muted-foreground">{body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular routes */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-accent">Popular routes</div>
            <h2 className="mt-2 text-3xl md:text-4xl font-serif text-primary">
              From every arrival gate to every hotel gate.
            </h2>
          </div>
          <Link to="/routes" className="text-sm text-accent hover:underline shrink-0">
            All routes →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {popular.map((r) => {
            const price = quote({ routeSlug: r.slug, vehicleClass: "economy" });
            return (
              <Link
                key={r.slug}
                to="/routes/$slug"
                params={{ slug: r.slug }}
                className="group rounded-xl overflow-hidden bg-card border border-border/60 hover:border-accent transition"
              >
                <div
                  className="aspect-[4/3] bg-cover bg-center group-hover:scale-[1.03] transition-transform duration-500"
                  style={{ backgroundImage: `url(${r.heroImage})` }}
                />
                <div className="p-5">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">
                    {r.region}
                  </div>
                  <div className="mt-2 font-serif text-xl text-primary">
                    {r.from.replace(" (HER)", "").replace(" (CHQ)", "").replace(" (Ferry)", "")} →{" "}
                    {r.to}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{r.durationMin} min · {r.distanceKm} km</span>
                    <span className="font-serif text-lg text-accent">
                      from {price ? formatEur(price.totalEur) : "—"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Fleet strip */}
      <section className="bg-sand border-y border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="text-xs uppercase tracking-[0.2em] text-accent">The fleet</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-serif text-primary max-w-2xl">
            Four vehicle classes. All under seven years old. All ours.
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {VEHICLE_CLASSES.map((v) => {
              const p = quote({ routeSlug: ROUTES[0].slug, vehicleClass: v.id });
              return (
                <div key={v.id} className="rounded-xl bg-card border border-border/60 p-6">
                  <div className="font-serif text-2xl text-primary">{v.label}</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                    {v.capacity}
                  </div>
                  <p className="mt-4 text-sm text-foreground/80">{v.description}</p>
                  <div className="mt-6 pt-4 border-t border-border/60 flex items-baseline justify-between">
                    <span className="text-xs text-muted-foreground">from</span>
                    <span className="font-serif text-xl text-accent">
                      {p ? formatEur(p.totalEur) : "—"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Region map */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-accent">The island</div>
            <h2 className="mt-2 text-3xl md:text-4xl font-serif text-primary">
              We cover all four regions of Crete.
            </h2>
            <p className="mt-4 text-muted-foreground">
              From Chania in the west to Lasithi in the east — 260km of coastline, two international
              airports, three ferry ports. Our drivers live here. Every one of them.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              {["Chania", "Rethymno", "Heraklion", "Lasithi"].map((region) => (
                <li key={region} className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  <span className="font-serif text-lg text-primary">{region}</span>
                  <span className="text-muted-foreground">
                    · {ROUTES.filter((r) => r.region === region).length} routes covered
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="aspect-[4/3] rounded-2xl border border-border/60 bg-card p-6">
            <CreteMap />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="text-xs uppercase tracking-[0.2em] text-accent">How it works</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-serif">Three steps. No back-and-forth.</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              ["01", "Get your price", "Enter your route and date — see the fixed price instantly. No offers to compare, no waiting."],
              ["02", "Book in a minute", "Passenger name, flight number, contact. That's it. Pay on arrival or in advance."],
              ["03", "Meet your driver", "You get the driver's name, photo, plate and WhatsApp the day before. They meet you at the gate."],
            ].map(([n, title, body]) => (
              <div key={n}>
                <div className="text-accent font-serif text-4xl">{n}</div>
                <div className="mt-2 font-serif text-2xl">{title}</div>
                <p className="mt-3 text-primary-foreground/70">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-xs uppercase tracking-[0.2em] text-accent">In their words</div>
        <h2 className="mt-2 text-3xl md:text-4xl font-serif text-primary max-w-2xl">
          A different kind of transfer review.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <blockquote
              key={i}
              className="rounded-xl bg-card border border-border/60 p-6"
            >
              <p className="font-serif text-lg text-foreground leading-snug">"{r.quote}"</p>
              <footer className="mt-4 text-xs text-muted-foreground">
                <div className="font-medium text-foreground">{r.author}</div>
                <div>{r.route}</div>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>
    </>
  );
}

function CreteMap() {
  // Simple stylised SVG of Crete with 4 region markers
  return (
    <svg viewBox="0 0 400 200" className="w-full h-full">
      <path
        d="M20 130 Q60 90 110 100 T210 95 Q260 90 310 105 T380 120 Q370 145 320 150 T220 155 Q170 160 120 155 T30 150 Z"
        fill="oklch(0.93 0.01 85)"
        stroke="oklch(0.32 0.05 235)"
        strokeWidth="1.5"
      />
      {[
        { x: 60, y: 125, label: "Chania" },
        { x: 140, y: 125, label: "Rethymno" },
        { x: 230, y: 128, label: "Heraklion" },
        { x: 330, y: 130, label: "Lasithi" },
      ].map((r) => (
        <g key={r.label}>
          <circle cx={r.x} cy={r.y} r="4" fill="oklch(0.58 0.14 42)" />
          <text
            x={r.x}
            y={r.y - 10}
            textAnchor="middle"
            fontSize="10"
            fontFamily="Inter"
            fill="oklch(0.32 0.05 235)"
          >
            {r.label}
          </text>
        </g>
      ))}
      <path
        className="route-line"
        d="M60 125 Q145 105 230 128 T330 130"
        fill="none"
        stroke="oklch(0.58 0.14 42)"
        strokeWidth="1.5"
        strokeDasharray="3 4"
      />
    </svg>
  );
}
