import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ROUTES, type Region } from "@/data/routes";
import { REGIONS } from "@/data/regions";
import { RouteCard } from "@/components/sections/route-card";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { TrustPills } from "@/components/sections/trust-pills";
import { getDict, useT, type Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/{-$locale}/routes/")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/routes",
      title: `All Crete Transfer Routes | ${ROUTES.length} Fixed-Price Routes · TransferAround`,
      description: `Browse ${ROUTES.length} fixed-price transfer routes across Crete — from Heraklion and Chania airports to every resort, port and villa. ${t.routesPages.indexSubtitle}`,
    });
  },
  component: RoutesHub,
});

function RoutesHub() {
  const t = useT();
  const [filter, setFilter] = useState<"All" | Region>("All");
  const filtered = filter === "All" ? ROUTES : ROUTES.filter((r) => r.region === filter);

  return (
    <>
      <PageHero
        eyebrow={t.nav.routes}
        title={t.routesPages.indexTitle}
        subtitle={t.routesPages.indexSubtitle}
        crumbs={[{ label: t.nav.routes }]}
      >
        <TrustPills className="mt-6" />
        <div className="mt-8 flex flex-wrap gap-2">
          {(["All", ...REGIONS.map((r) => r.name)] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                filter === r
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-accent"
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
      </PageHero>

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <RouteCard key={r.slug} route={r} />
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
