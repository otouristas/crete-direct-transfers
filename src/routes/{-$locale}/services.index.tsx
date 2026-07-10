import { createFileRoute, Link } from "@tanstack/react-router";
import type { Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { SERVICES } from "@/data/services";

export const Route = createFileRoute("/{-$locale}/services/")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    return buildHead({
      locale,
      path: "/services",
      title: "Transfer Services in Crete | Airport, Port, Tours · TransferAround",
      description:
        "Airport transfers, port pickups, private day tours, long-distance and group transfers — all fixed-price with licensed Cretan drivers.",
    });
  },
  component: ServicesHub,
});

function ServicesHub() {
  return (
    <>
      <section className="border-b border-border bg-muted">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="text-xs uppercase tracking-[0.2em] text-accent">Services</div>
          <h1 className="mt-3 text-4xl md:text-6xl font-display text-primary">
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
            to="/{-$locale}/services/$slug"
            params={{ slug: s.slug }}
            className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-accent transition"
          >
            <div className="aspect-[16/10] overflow-hidden">
              <div
                className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: `url(${s.heroImage})` }}
              />
            </div>
            <div className="p-6">
              <div className="font-display text-2xl text-primary">{s.name}</div>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{s.tagline}</p>
              <div className="mt-4 text-sm text-accent group-hover:underline">Learn more →</div>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
