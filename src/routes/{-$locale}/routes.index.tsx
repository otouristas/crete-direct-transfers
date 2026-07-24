import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { Region } from "@/data/routes";
import { RouteCard } from "@/components/sections/route-card";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { TrustPills } from "@/components/sections/trust-pills";
import { getDict, useLocale, useT, type Locale } from "@/i18n";
import { getLocalizedRegions, getLocalizedRoutes } from "@/i18n/content";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/{-$locale}/routes/")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/routes",
      title: t.seo.routesIndexTitle,
      description: t.seo.routesIndexDescription,
    });
  },
  component: RoutesHub,
});

function RoutesHub() {
  const t = useT();
  const locale = useLocale();
  const routes = getLocalizedRoutes(locale);
  const regions = getLocalizedRegions(locale);
  const [filter, setFilter] = useState<"All" | Region>("All");
  const filtered = filter === "All" ? routes : routes.filter((r) => r.region === filter);

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
          {(["All", ...regions.map((r) => r.name)] as const).map((r) => (
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
                  {routes.filter((route) => route.region === r).length}
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
