import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, MapPin } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { EnglishOnlyNote } from "@/components/editorial/english-only-note";
import { listRouteGuides } from "@/data/route-guides";
import { getRoute } from "@/data/routes";
import { formatEur } from "@/lib/pricing";
import { buildHead } from "@/lib/seo";
import { getDict, useT, type Locale } from "@/i18n";

export const Route = createFileRoute("/{-$locale}/guides/")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/guides",
      title: t.editorial.guidesMetaTitle,
      description: t.editorial.guidesMetaDescription,
      englishOnly: true,
    });
  },
  component: GuidesIndex,
});

function GuidesIndex() {
  const t = useT();
  const guides = listRouteGuides();
  return (
    <>
      <PageHero
        eyebrow={t.editorial.guidesEyebrow}
        title={t.editorial.guidesTitle}
        subtitle={t.editorial.guidesSubtitle}
        crumbs={[{ label: t.editorial.guidesNav }]}
      />
      <EnglishOnlyNote />
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
                      <Clock className="h-3.5 w-3.5" /> {t.editorial.minutes(route.durationMin)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> {t.editorial.kilometres(route.distanceKm)}
                    </span>
                    <span className="font-semibold text-accent-deep">
                      {t.editorial.fromPrice(formatEur(route.basePriceEur))}
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
