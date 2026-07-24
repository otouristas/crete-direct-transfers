import { createFileRoute, Link } from "@tanstack/react-router";
import { getDict, useLocale, useT, type Locale } from "@/i18n";
import { getLocalizedRegions, getLocalizedRoutes } from "@/i18n/content";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/{-$locale}/regions/")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/regions",
      title: t.seo.regionsIndexTitle,
      description: t.seo.regionsIndexDescription,
    });
  },
  component: RegionsHub,
});

function RegionsHub() {
  const t = useT();
  const locale = useLocale();
  const regions = getLocalizedRegions(locale);
  const routes = getLocalizedRoutes(locale);

  return (
    <>
      <section className="border-b border-border bg-muted">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="text-xs uppercase tracking-[0.2em] text-accent">{t.nav.regions}</div>
          <h1 className="mt-3 text-4xl md:text-6xl font-display text-primary">
            {t.regionsPages.indexTitle}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            {t.regionsPages.indexSubtitle}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 grid gap-6 md:grid-cols-2">
        {regions.map((r) => {
          const count = routes.filter((route) => route.region === r.name).length;
          return (
            <Link
              key={r.slug}
              to="/{-$locale}/regions/$slug"
              params={{ slug: r.slug }}
              className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-accent transition"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                  style={{ backgroundImage: `url(${r.heroImage})` }}
                />
              </div>
              <div className="p-6">
                <div className="text-xs uppercase tracking-widest text-accent">{r.gateway}</div>
                <div className="mt-2 font-display text-3xl text-primary">{r.name}</div>
                <p className="mt-3 text-muted-foreground line-clamp-2">{r.intro}</p>
                <div className="mt-4 text-sm text-accent group-hover:underline">
                  {count} {t.nav.routes.toLowerCase()} →
                </div>
              </div>
            </Link>
          );
        })}
      </section>
    </>
  );
}
