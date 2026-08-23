import { createFileRoute, Link } from "@tanstack/react-router";
import { Anchor } from "lucide-react";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { getDict, useLocale, useT, type Locale } from "@/i18n";
import { getCountryName } from "@/i18n/markets";
import { MARKETS } from "@/data/markets";
import { formatEur } from "@/lib/pricing";
import { buildCanonicalUrl, buildHead } from "@/lib/seo";
import { listIndexablePorts, listIndexablePortsByCountry } from "@/lib/port-resolve";

export const Route = createFileRoute("/{-$locale}/ports/")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    const p = t.portPages;
    const ports = listIndexablePorts();
    return buildHead({
      locale,
      path: "/ports",
      title: p.indexMetaTitle,
      description: p.indexMetaDescription,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: p.indexTitle,
        numberOfItems: ports.length,
        itemListElement: ports.map((port, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: port.name,
          url: buildCanonicalUrl(locale, `/ports/${port.slug}`),
        })),
      },
    });
  },
  component: PortsIndexPage,
});

function PortsIndexPage() {
  const t = useT();
  const locale = useLocale();
  const p = t.portPages;
  const byCountry = listIndexablePortsByCountry();
  const total = byCountry.reduce((sum, g) => sum + g.ports.length, 0);
  const marketSlugByCode = new Map(MARKETS.map((m) => [m.countryCode.toUpperCase(), m.slug]));

  return (
    <>
      <PageHero
        eyebrow={t.nav.destinations}
        title={p.indexTitle}
        subtitle={p.indexSubtitle(total)}
        crumbs={[{ label: p.indexTitle }]}
      />

      <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
        <div className="space-y-12">
          {byCountry.map((group) => {
            const marketSlug = marketSlugByCode.get(group.countryCode);
            const label = marketSlug ? getCountryName(locale, marketSlug) : group.countryName;
            return (
              <div key={group.countryCode}>
                <div className="flex flex-wrap items-baseline gap-3 border-b border-border pb-2">
                  <h2 className="font-display text-xl text-primary">{label}</h2>
                  <span className="text-sm text-muted-foreground">{group.ports.length}</span>
                </div>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.ports.map((port) => (
                    <li key={port.slug}>
                      <Link
                        to="/{-$locale}/ports/$slug"
                        params={{ slug: port.slug }}
                        className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm shadow-sm transition hover:border-accent"
                      >
                        <span className="flex items-center gap-2">
                          <Anchor className="size-4 shrink-0 text-accent-deep" aria-hidden />
                          <span className="font-medium text-foreground">{port.name}</span>
                        </span>
                        <span className="shrink-0 text-muted-foreground">
                          {formatEur(port.fromPriceEur)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <CtaBand title={p.ctaTitle} subtitle={p.ctaSubtitle} />
    </>
  );
}
