import { createFileRoute, Link } from "@tanstack/react-router";
import { ROUTES } from "@/data/routes";
import { quote, formatEur } from "@/lib/pricing";

export const Route = createFileRoute("/routes/")({
  head: () => ({
    meta: [
      { title: "All Crete Transfer Routes | Fixed Prices | CreteTransfers" },
      {
        name: "description",
        content:
          "Every Crete transfer route we cover — airport, port and cross-island. Fixed prices, licensed local drivers.",
      },
      { property: "og:title", content: "All Crete Transfer Routes | CreteTransfers" },
      {
        property: "og:description",
        content: "Fixed-price airport and port transfers across all four regions of Crete.",
      },
      { property: "og:url", content: "/routes" },
    ],
    links: [{ rel: "canonical", href: "/routes" }],
  }),
  component: RoutesIndex,
});

function RoutesIndex() {
  const byRegion = ROUTES.reduce<Record<string, typeof ROUTES>>((acc, r) => {
    (acc[r.region] ??= []).push(r);
    return acc;
  }, {});

  return (
    <>
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-6xl px-6 pt-16 pb-12">
          <div className="text-xs uppercase tracking-[0.2em] text-accent">Routes</div>
          <h1 className="mt-3 text-4xl md:text-5xl font-serif text-primary max-w-2xl">
            Every Crete transfer route, one clear price.
          </h1>
          <p className="mt-4 text-muted-foreground max-w-xl">
            {ROUTES.length} routes across the island's two airports and three ports. Prices shown from
            economy — comfort, minivan and luxury quoted at checkout.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 space-y-16">
        {Object.entries(byRegion).map(([region, list]) => (
          <div key={region}>
            <h2 className="font-serif text-2xl text-primary mb-6">{region}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {list.map((r) => {
                const q = quote({ routeSlug: r.slug, vehicleClass: "economy" });
                return (
                  <Link
                    key={r.slug}
                    to="/routes/$slug"
                    params={{ slug: r.slug }}
                    className="group flex items-center gap-5 rounded-xl bg-card border border-border/60 p-5 hover:border-accent transition"
                  >
                    <div
                      className="w-24 h-24 rounded-lg bg-cover bg-center shrink-0"
                      style={{ backgroundImage: `url(${r.heroImage})` }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-serif text-lg text-primary truncate">
                        {r.from} → {r.to}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {r.distanceKm} km · {r.durationMin} min
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs text-muted-foreground">from</div>
                      <div className="font-serif text-xl text-accent">
                        {q ? formatEur(q.totalEur) : "—"}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
