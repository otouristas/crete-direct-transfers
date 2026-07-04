import { createFileRoute, Link } from "@tanstack/react-router";
import { SERVICES } from "@/data/services";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Crete Transfer Services | Airport, Port, Tours · CreteTransfers" },
      { name: "description", content: "Airport transfers, port transfers, hotel-to-hotel, private day tours, long-distance and group transfers across Crete." },
      { property: "og:title", content: "Crete Transfer Services | CreteTransfers" },
      { property: "og:description", content: "Airport, port, hotel, private-tour and group transfers across Crete." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesHub,
});

function ServicesHub() {
  return (
    <>
      <section className="border-b border-border/60 bg-sand">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="text-xs uppercase tracking-[0.2em] text-accent">Services</div>
          <h1 className="mt-3 text-4xl md:text-6xl font-serif text-primary">
            More than an airport run.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Six ways we move you across Crete — all fixed-price, all licensed local drivers.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s) => (
          <Link
            key={s.slug}
            to="/services/$slug"
            params={{ slug: s.slug }}
            className="group rounded-2xl overflow-hidden bg-card border border-border/60 hover:border-accent transition"
          >
            <div className="aspect-[16/10] overflow-hidden">
              <div
                className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: `url(${s.heroImage})` }}
              />
            </div>
            <div className="p-6">
              <div className="font-serif text-2xl text-primary">{s.name}</div>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{s.tagline}</p>
              <div className="mt-4 text-sm text-accent group-hover:underline">Learn more →</div>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
