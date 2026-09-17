import { createFileRoute, Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { EnglishOnlyNote } from "@/components/editorial/english-only-note";
import { DRIVERS, driverInitials } from "@/data/drivers";
import { buildHead } from "@/lib/seo";
import { DRIVER_PROFILES_VERIFIED } from "@/lib/site";
import { ORGANIZATION_ID } from "@/lib/structured-data";
import { getDict, useT, type Locale } from "@/i18n";

export const Route = createFileRoute("/{-$locale}/drivers/")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/drivers",
      title: t.editorial.driversMetaTitle,
      description: t.editorial.driversMetaDescription,
      englishOnly: true,
      // Named people with ratings and counts: indexable only once verified.
      noindex: !DRIVER_PROFILES_VERIFIED,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: t.editorial.driversListName,
        publisher: { "@id": ORGANIZATION_ID },
        itemListElement: DRIVERS.map((d, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: d.name,
        })),
      },
    });
  },
  component: DriversIndex,
});

function DriversIndex() {
  const t = useT();
  return (
    <>
      <PageHero
        eyebrow={t.editorial.driversEyebrow}
        title={t.editorial.driversTitle}
        subtitle={t.editorial.driversSubtitle}
        crumbs={[{ label: t.editorial.driversCrumb }]}
      />
      <EnglishOnlyNote />
      {DRIVER_PROFILES_VERIFIED ? (
        <section className="mx-auto grid max-w-7xl gap-6 px-6 py-14 md:grid-cols-2 lg:grid-cols-3">
          {DRIVERS.map((d) => (
            <Link
              key={d.slug}
              to="/{-$locale}/drivers/$slug"
              params={{ slug: d.slug }}
              className="group rounded-2xl border border-border bg-card p-6 transition hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary font-display text-xl text-primary-foreground">
                  {driverInitials(d.name)}
                </span>
                <div>
                  <h2 className="font-display text-lg text-primary">{d.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {d.base} · {t.editorial.yearsDriving(d.years)}
                  </p>
                </div>
              </div>
              <p className="mt-4 line-clamp-3 text-sm text-muted-foreground">{d.bio[0]}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {d.languages.map((l) => (
                  <span
                    key={l}
                    className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    {l}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm">
                <span className="inline-flex items-center gap-1.5 font-semibold text-primary">
                  <Star className="h-4 w-4 fill-highlight text-highlight" />
                  {d.rating.toFixed(1)}
                </span>
                <span className="text-muted-foreground">
                  {t.editorial.transfersCount(d.transfers.toLocaleString())}
                </span>
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <section className="mx-auto max-w-3xl px-6 py-14">
          <p className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            {t.editorial.driversPendingNote}
          </p>
        </section>
      )}
      <CtaBand title={t.editorial.driversCtaTitle} subtitle={t.editorial.driversCtaSubtitle} />
    </>
  );
}
