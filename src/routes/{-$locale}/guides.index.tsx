import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, MapPin } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { listRouteGuides } from "@/data/route-guides";
import { getRoute } from "@/data/routes";
import { formatEur } from "@/lib/pricing";
import { buildHead } from "@/lib/seo";
import type { Locale } from "@/i18n";

export const Route = createFileRoute("/{-$locale}/guides/")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    return buildHead({
      locale,
      path: "/guides",
      title: "Crete transfer route guides | TransferAround",
      description:
        "Minute-by-minute guides to the main Crete transfer routes: what the drive looks like, worthwhile stops, timing, and arrival detail from local drivers.",
    });
  },
  component: GuidesIndex,
});

function GuidesIndex() {
  const guides = listRouteGuides();
  return (
    <>
      <PageHero
        eyebrow="Route guides"
        title="What the drive is actually like"
        subtitle="Written by the drivers who run these roads daily: the timings, the detours worth asking for, and the arrival details that a map never shows."
        crumbs={[{ label: "Route guides" }]}
      />
      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-14 md:grid-cols-2">
        {guides.map(({ guide }) => {
          const route = getRoute(guide.routeSlug);
          return (
            <Link
              key={guide.slug}
              to="/{-$locale}/guides/$slug"
              params={{ slug: guide.slug }}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:shadow-lg"
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img
                  src={guide.heroImage}
                  alt={guide.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h2 className="font-display text-xl text-primary">{guide.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{guide.subtitle}</p>
                {route && (
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" /> {route.durationMin} min
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> {route.distanceKm} km
                    </span>
                    <span className="font-semibold text-accent-deep">
                      from {formatEur(route.basePriceEur)}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </section>
      <CtaBand />
    </>
  );
}
