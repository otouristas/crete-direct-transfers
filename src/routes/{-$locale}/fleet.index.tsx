import { createFileRoute, Link } from "@tanstack/react-router";
import type { Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { VEHICLE_CLASSES, ROUTES } from "@/data/routes";
import { quote, formatEur } from "@/lib/pricing";

export const Route = createFileRoute("/{-$locale}/fleet/")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    return buildHead({
      locale,
      path: "/fleet",
      title: "Our Fleet | Economy to Luxury, All Licensed · CreteTransfers",
      description:
        "Four vehicle classes — Economy, Comfort, Minivan and Luxury. All under seven years old, licensed and insured, with fixed pricing.",
    });
  },
  component: FleetHub,
});

function FleetHub() {
  return (
    <>
      <section className="border-b border-border bg-muted">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="text-xs uppercase tracking-[0.2em] text-accent">The fleet</div>
          <h1 className="mt-3 text-4xl md:text-6xl font-display text-primary">
            Four vehicle classes.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            All under seven years old. All air-conditioned. All driven by licensed local Cretans.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 grid gap-8 md:grid-cols-2">
        {VEHICLE_CLASSES.map((v) => {
          const price = quote({ routeSlug: ROUTES[0].slug, vehicleClass: v.id });
          return (
            <Link
              key={v.id}
              to="/{-$locale}/fleet/$class"
              params={{ class: v.id }}
              className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-accent transition"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                  style={{ backgroundImage: `url(${v.image})` }}
                />
              </div>
              <div className="p-6">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="font-display text-3xl text-primary">{v.label}</div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                      {v.capacity} · {v.bags}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">from</div>
                    <div className="font-display text-2xl text-accent">
                      {price ? formatEur(price.totalEur) : "—"}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-foreground/80">{v.description}</p>
                <div className="mt-6 text-sm text-accent group-hover:underline">See details →</div>
              </div>
            </Link>
          );
        })}
      </section>
    </>
  );
}
