import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ROUTES, type Region } from "@/data/routes";
import { REGIONS } from "@/data/regions";
import { quote, formatEur } from "@/lib/pricing";
import { Clock, MapPin } from "lucide-react";

export const Route = createFileRoute("/routes/")({
  head: () => ({
    meta: [
      { title: `All Crete Transfer Routes | ${ROUTES.length}+ Fixed-Price Routes · CreteTransfers` },
      {
        name: "description",
        content: `Browse ${ROUTES.length}+ fixed-price transfer routes across Crete — from Heraklion and Chania airports to every resort, port and villa. Instant pricing, licensed drivers.`,
      },
      { property: "og:title", content: "All Crete Transfer Routes | CreteTransfers" },
      { property: "og:description", content: `${ROUTES.length}+ fixed-price transfer routes across Crete.` },
      { property: "og:url", content: "/routes" },
    ],
    links: [{ rel: "canonical", href: "/routes" }],
  }),
  component: RoutesHub,
});

function RoutesHub() {
  const [filter, setFilter] = useState<"All" | Region>("All");
  const filtered = filter === "All" ? ROUTES : ROUTES.filter((r) => r.region === filter);

  return (
    <>
      <section className="border-b border-border/60 bg-sand">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="text-xs uppercase tracking-[0.2em] text-accent">Routes</div>
          <h1 className="mt-3 text-4xl md:text-6xl font-serif text-primary">
            Every route on the island.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            {ROUTES.length} fixed-price transfer routes across {REGIONS.length} regions. Pick one to see
            pricing across all four vehicle classes.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {(["All", ...REGIONS.map((r) => r.name)] as const).map((r) => (
              <button
                key={r}
                onClick={() => setFilter(r)}
                className={`rounded-full px-4 py-2 text-sm border transition ${
                  filter === r
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:border-accent"
                }`}
              >
                {r}
                {r !== "All" && (
                  <span className="ml-1.5 opacity-60">
                    {ROUTES.filter((route) => route.region === r).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => {
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
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                    style={{ backgroundImage: `url(${r.heroImage})` }}
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                    <MapPin className="w-3 h-3" /> {r.region}
                  </div>
                  <div className="mt-2 font-serif text-lg text-primary leading-snug">
                    {r.from} → {r.to}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {r.durationMin} min · {r.distanceKm} km
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
      </section>
    </>
  );
}
