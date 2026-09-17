import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Plane } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { EnglishOnlyNote } from "@/components/editorial/english-only-note";
import { hotelAreasByRegion, HOTEL_AREAS } from "@/data/hotels";
import { formatEur } from "@/lib/pricing";
import { buildHead } from "@/lib/seo";
import { getDict, useT, type Locale } from "@/i18n";

export const Route = createFileRoute("/{-$locale}/hotels/")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/hotels",
      title: t.editorial.hotelsMetaTitle,
      description: t.editorial.hotelsMetaDescription,
      englishOnly: true,
    });
  },
  component: HotelsIndex,
});

function HotelsIndex() {
  const t = useT();
  const groups = hotelAreasByRegion();
  return (
    <>
      <PageHero
        eyebrow={t.editorial.hotelsEyebrow}
        title={t.editorial.hotelsTitle}
        subtitle={t.editorial.hotelsSubtitle(HOTEL_AREAS.length)}
        crumbs={[{ label: t.editorial.hotelsNav }]}
      />
      <EnglishOnlyNote />
      {groups.map(({ region, areas }) => (
        <section key={region} className="mx-auto max-w-7xl px-6 py-10">
          <h2 className="font-display text-2xl text-primary">{region}</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {areas.map((a) => (
              <Link
                key={a.slug}
                to="/{-$locale}/hotels/$slug"
                params={{ slug: a.slug }}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:shadow-lg"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={a.heroImage}
                    alt={a.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg text-primary">{a.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{a.summary}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Plane className="h-3.5 w-3.5" /> {a.airportIata}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" /> {t.editorial.minutes(a.driveMin)}
                    </span>
                    <span className="font-semibold text-accent-deep">
                      {t.editorial.fromPrice(formatEur(a.fromPriceEur))}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
      <div className="py-6" />
      <CtaBand />
    </>
  );
}
