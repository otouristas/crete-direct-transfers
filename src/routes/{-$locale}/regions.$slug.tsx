import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getRegion, REGIONS } from "@/data/regions";
import { ROUTES } from "@/data/routes";
import { RouteCard } from "@/components/sections/route-card";
import { CtaBand } from "@/components/sections/cta-band";
import { getDict, useT, type Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/{-$locale}/regions/$slug")({
  loader: ({ params }) => {
    const region = getRegion(params.slug);
    if (!region) throw notFound();
    return { region };
  },
  head: ({ loaderData, params }) => {
    const locale = (params.locale ?? "en") as Locale;
    if (!loaderData) {
      return {
        meta: [
          { title: "Region not found | TransferAround" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const r = loaderData.region;
    return buildHead({
      locale,
      path: `/regions/${params.slug}`,
      title: `${r.name} Transfers | Fixed-Price Transfers in ${r.name}, Crete · TransferAround`,
      description: `${r.headline} Fixed-price transfers to every hotel and town in ${r.name}. Licensed local drivers.`,
      ogImage: r.heroImage,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Place",
        name: `${r.name}, Crete`,
        description: r.body,
        containedInPlace: { "@type": "Place", name: "Crete, Greece" },
      },
    });
  },
  component: RegionPage,
  notFoundComponent: RegionNotFound,
});

function RegionNotFound() {
  const t = useT();
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-3xl font-display text-primary">{t.notFound.title}</h1>
      <Link
        to="/{-$locale}/regions"
        className="mt-6 inline-flex rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
      >
        {t.nav.regions}
      </Link>
    </div>
  );
}

function RegionPage() {
  const { region } = Route.useLoaderData();
  const t = useT();
  const routes = ROUTES.filter((r) => r.region === region.name);
  const other = REGIONS.filter((r) => r.slug !== region.slug);

  return (
    <>
      <section className="relative">
        <div
          className="aspect-[16/7] bg-cover bg-center"
          style={{ backgroundImage: `url(${region.heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-10 text-primary-foreground md:pb-14">
          <nav className="mb-4 flex gap-2 text-xs text-primary-foreground/70">
            <Link to="/{-$locale}" className="hover:text-accent">
              {t.nav.home}
            </Link>
            <span>/</span>
            <Link to="/{-$locale}/regions" className="hover:text-accent">
              {t.nav.regions}
            </Link>
            <span>/</span>
            <span>{region.name}</span>
          </nav>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {region.gateway}
          </div>
          <h1 className="mt-3 text-4xl font-display md:text-6xl">{region.name}</h1>
          <p className="mt-3 max-w-2xl text-lg text-primary-foreground/85">{region.headline}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-14 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="max-w-2xl text-lg leading-relaxed text-foreground/90">{region.intro}</p>
          <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">{region.body}</p>

          <div className="mt-12">
            <h2 className="text-2xl font-display text-primary">
              {t.regionsPages.routesIn} — {region.name}
            </h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {routes.map((r) => (
                <RouteCard key={r.slug} route={r} />
              ))}
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-display text-primary">
              {t.regionsPages.hotelsTitle} — {region.name}
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {region.hotels.map((h: string) => (
                <span
                  key={h}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground/80"
                >
                  {h}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Not on the list? We serve every hotel and villa in {region.name} — enter your address
              at booking.
            </p>
          </div>
        </div>

        <aside className="h-fit rounded-2xl bg-primary p-6 text-primary-foreground lg:sticky lg:top-24">
          <div className="text-xs uppercase tracking-widest text-accent">
            {t.common.bookTransfer} — {region.name}
          </div>
          <p className="mt-3 text-sm text-primary-foreground/80">
            Local drivers who live here — not shipped in from elsewhere on the island.
          </p>
          <Link
            to="/{-$locale}/book"
            className="mt-5 block rounded-xl bg-accent px-5 py-3 text-center text-sm font-semibold text-accent-foreground transition hover:opacity-90"
          >
            {t.common.getPrice}
          </Link>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <h2 className="mb-6 text-2xl font-display text-primary">{t.nav.regions}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {other.map((r) => (
            <Link
              key={r.slug}
              to="/{-$locale}/regions/$slug"
              params={{ slug: r.slug }}
              className="rounded-xl border border-border bg-card p-5 transition hover:border-accent hover:shadow-md"
            >
              <div className="font-display text-lg text-primary">{r.name}</div>
              <div className="mt-1 text-sm text-muted-foreground">{r.gateway}</div>
            </Link>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
