import { createFileRoute, Link } from "@tanstack/react-router";
import { ROUTES, VEHICLE_CLASSES } from "@/data/routes";
import { REGIONS } from "@/data/regions";
import { SERVICES } from "@/data/services";
import { REVIEWS, AVG_RATING } from "@/data/reviews";
import { FAQ_GROUPS } from "@/data/faqs";
import { quote, formatEur } from "@/lib/pricing";
import { BookingWidget } from "@/components/booking-widget";
import { FaqAccordion } from "@/components/faq-accordion";
import { CreteMap } from "@/components/crete-map";
import { Star, Check, MapPin, Clock, ShieldCheck, Plane, Phone } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Crete Transfers | Fixed-Price Airport & Port Transfers · CreteTransfers" },
      {
        name: "description",
        content:
          "Fixed-price transfers across Crete. Licensed local drivers, no bidding, flight-tracked pickups. Book Heraklion, Chania, Elounda, Rethymno and every route in minutes.",
      },
      { property: "og:title", content: "CreteTransfers — Fixed-Price Crete Transfers" },
      { property: "og:description", content: "Licensed local drivers. Fixed prices. Book in minutes." },
      { property: "og:image", content: "https://images.unsplash.com/photo-1601161221525-6b3e0f0e13db?auto=format&fit=crop&w=1600&q=70" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": "https://cretetransfers.example/#business",
          name: "CreteTransfers",
          description: "Fixed-price private transfers across Crete.",
          areaServed: { "@type": "Place", name: "Crete, Greece" },
          telephone: "+30 28 1000 0000",
          priceRange: "€€",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: AVG_RATING,
            reviewCount: REVIEWS.length,
          },
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const popular = ROUTES.slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1601161221525-6b3e0f0e13db?auto=format&fit=crop&w=2400&q=80)",
          }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/70 via-primary/60 to-primary/80" />
        <div className="mx-auto max-w-7xl px-6 pt-20 md:pt-28 pb-16 md:pb-20 text-primary-foreground">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-accent bg-accent/10 border border-accent/30 rounded-full px-4 py-1.5">
              <Star className="w-3 h-3 fill-accent" /> Rated {AVG_RATING} / 5 · {REVIEWS.length}+ reviews
            </div>
            <h1 className="mt-6 text-4xl md:text-6xl lg:text-7xl font-serif leading-[1.02]">
              Crete transfers,<br />
              <span className="text-accent">priced before you book.</span>
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/85 max-w-xl">
              A curated fleet of licensed Cretan drivers. Airport, port and cross-island routes at a
              guaranteed price — no bidding, no comparing offers.
            </p>
          </div>

          <div className="mt-10 md:mt-14">
            <BookingWidget />
          </div>

          {/* Trust pills right under hero */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
            {[
              [Check, "Fixed price"],
              [ShieldCheck, "Licensed drivers"],
              [Clock, "Free cancellation 24h"],
              [Plane, "Flight tracked"],
              [Phone, "24/7 support"],
            ].map(([Icon, label]) => {
              const I = Icon as typeof Check;
              return (
                <div
                  key={label as string}
                  className="flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/15 rounded-full px-4 py-2.5 backdrop-blur"
                >
                  <I className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-primary-foreground/90">{label as string}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.2em] text-accent">How it works</div>
          <h2 className="mt-3 text-3xl md:text-5xl font-serif text-primary">
            Three steps. Zero back-and-forth.
          </h2>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3 relative">
          <div className="absolute top-8 left-[15%] right-[15%] h-px bg-border hidden md:block" />
          {[
            ["01", "Get your price", "Enter your route and date — see the fixed price instantly. No offers to compare, no waiting."],
            ["02", "Book in a minute", "Passenger name, flight number, contact. That's it. Pay on arrival or in advance."],
            ["03", "Meet your driver", "You get the driver's name, photo, plate and WhatsApp the day before. They meet you at the gate."],
          ].map(([n, title, body]) => (
            <div key={n as string} className="relative bg-background">
              <div className="w-16 h-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-serif text-xl mb-5 relative z-10">
                {n}
              </div>
              <div className="font-serif text-2xl text-primary">{title}</div>
              <p className="mt-3 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular routes */}
      <section className="bg-sand border-y border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-accent">Popular routes</div>
              <h2 className="mt-3 text-3xl md:text-5xl font-serif text-primary">
                From every arrival gate to every hotel gate.
              </h2>
            </div>
            <Link to="/routes" className="hidden md:inline-flex text-sm text-accent hover:underline shrink-0">
              All {ROUTES.length} routes →
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
                  className="group rounded-2xl overflow-hidden bg-card border border-border/60 hover:border-accent hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <div
                      className="w-full h-full bg-cover bg-center group-hover:scale-[1.06] transition-transform duration-700"
                      style={{ backgroundImage: `url(${r.heroImage})` }}
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                      <MapPin className="w-3 h-3" /> {r.region}
                    </div>
                    <div className="mt-2 font-serif text-lg text-primary leading-snug">
                      {r.from.replace(" (HER)", "").replace(" (CHQ)", "").replace(" (Ferry)", "")} → {r.to}
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {r.durationMin} min
                      </span>
                      <span className="font-serif text-lg text-accent">
                        from {price ? formatEur(price.totalEur) : "—"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-10 text-center md:hidden">
            <Link to="/routes" className="inline-flex text-sm text-accent hover:underline">
              All {ROUTES.length} routes →
            </Link>
          </div>
        </div>
      </section>

      {/* Fleet */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.2em] text-accent">The fleet</div>
          <h2 className="mt-3 text-3xl md:text-5xl font-serif text-primary">
            Four classes. All under seven years old.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {VEHICLE_CLASSES.map((v) => {
            const p = quote({ routeSlug: ROUTES[0].slug, vehicleClass: v.id });
            return (
              <Link
                key={v.id}
                to="/fleet/$class"
                params={{ class: v.id }}
                className="group rounded-2xl overflow-hidden bg-card border border-border/60 hover:border-accent transition"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url(${v.image})` }}
                  />
                </div>
                <div className="p-5">
                  <div className="font-serif text-2xl text-primary">{v.label}</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                    {v.capacity}
                  </div>
                  <p className="mt-3 text-sm text-foreground/80 line-clamp-2">{v.description}</p>
                  <div className="mt-4 pt-4 border-t border-border/60 flex items-baseline justify-between">
                    <span className="text-xs text-muted-foreground">from</span>
                    <span className="font-serif text-xl text-accent">
                      {p ? formatEur(p.totalEur) : "—"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Map + regions */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-accent">The island</div>
            <h2 className="mt-3 text-3xl md:text-5xl font-serif">All four regions of Crete.</h2>
            <p className="mt-4 text-primary-foreground/80 max-w-lg">
              From Chania in the west to Lasithi in the east — 260km of coastline, two international
              airports, three ferry ports. Our drivers live here. Every one of them.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {REGIONS.map((r) => (
                <Link
                  key={r.slug}
                  to="/regions/$slug"
                  params={{ slug: r.slug }}
                  className="group rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-4 hover:border-accent hover:bg-primary-foreground/10 transition"
                >
                  <div className="font-serif text-xl">{r.name}</div>
                  <div className="text-xs text-primary-foreground/60 mt-1">
                    {ROUTES.filter((route) => route.region === r.name).length} routes · {r.gateway}
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="aspect-[4/3] rounded-2xl bg-background p-6">
            <CreteMap />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.2em] text-accent">Services</div>
          <h2 className="mt-3 text-3xl md:text-5xl font-serif text-primary">Beyond the airport run.</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <Link
              key={s.slug}
              to="/services/$slug"
              params={{ slug: s.slug }}
              className="group rounded-2xl border border-border/60 bg-card p-6 hover:border-accent hover:-translate-y-1 transition-all"
            >
              <div className="font-serif text-2xl text-primary">{s.name}</div>
              <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{s.tagline}</p>
              <div className="mt-6 text-sm text-accent group-hover:underline">Learn more →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-sand border-y border-border/60">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="flex items-end justify-between gap-6 mb-10">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-accent">In their words</div>
              <h2 className="mt-3 text-3xl md:text-5xl font-serif text-primary max-w-2xl">
                {AVG_RATING} from {REVIEWS.length}+ travellers.
              </h2>
            </div>
            <Link to="/reviews" className="hidden md:inline-flex text-sm text-accent hover:underline shrink-0">
              All reviews →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.slice(0, 6).map((r, i) => (
              <blockquote key={i} className="rounded-2xl bg-card border border-border/60 p-6">
                <div className="flex gap-0.5 text-accent mb-3">
                  {Array.from({ length: r.rating }).map((_, k) => (
                    <Star key={k} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="font-serif text-lg text-foreground leading-snug">"{r.quote}"</p>
                <footer className="mt-4 text-xs text-muted-foreground flex justify-between">
                  <div>
                    <div className="font-medium text-foreground">{r.author}</div>
                    <div>{r.route}</div>
                  </div>
                  <div className="text-right">{r.source}</div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ preview */}
      <section className="mx-auto max-w-4xl px-6 py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-[0.2em] text-accent">Common questions</div>
          <h2 className="mt-3 text-3xl md:text-5xl font-serif text-primary">Frequently asked.</h2>
        </div>
        <div className="mt-12">
          <FaqAccordion groups={FAQ_GROUPS.slice(0, 3)} />
        </div>
        <div className="mt-10 text-center">
          <Link to="/faq" className="inline-flex text-sm text-accent hover:underline">
            See all questions →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl px-6 py-20 md:py-24 text-center">
          <h2 className="text-3xl md:text-5xl font-serif">Ready when you land.</h2>
          <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto">
            Fixed price, licensed drivers, flight tracked. Book your Crete transfer in under two minutes.
          </p>
          <Link
            to="/book"
            className="inline-flex mt-8 items-center gap-2 rounded-full bg-accent px-8 py-4 text-accent-foreground text-base hover:opacity-90"
          >
            Get your fixed price →
          </Link>
        </div>
      </section>
    </>
  );
}
