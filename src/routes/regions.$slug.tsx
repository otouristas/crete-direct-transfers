import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getRegion, REGIONS } from "@/data/regions";
import { ROUTES } from "@/data/routes";
import { quote, formatEur } from "@/lib/pricing";
import { Clock } from "lucide-react";

export const Route = createFileRoute("/regions/$slug")({
  loader: ({ params }) => {
    const region = getRegion(params.slug);
    if (!region) throw notFound();
    return { region };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Region not found | CreteTransfers" }, { name: "robots", content: "noindex" }] };
    }
    const r = loaderData.region;
    const title = `${r.name} Transfers | Fixed-Price Transfers in ${r.name}, Crete · CreteTransfers`;
    const desc = `${r.headline} Fixed-price transfers to every hotel and town in ${r.name}. Licensed local drivers.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:image", content: r.heroImage },
        { property: "og:url", content: `/regions/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/regions/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Place",
            name: `${r.name}, Crete`,
            description: r.body,
            containedInPlace: { "@type": "Place", name: "Crete, Greece" },
          }),
        },
      ],
    };
  },
  component: RegionPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-serif text-3xl text-primary">Region not found</h1>
      <Link to="/regions" className="inline-flex mt-6 rounded-full bg-accent px-5 py-2 text-sm text-accent-foreground">
        All regions
      </Link>
    </div>
  ),
});

function RegionPage() {
  const { region } = Route.useLoaderData();
  const routes = ROUTES.filter((r) => r.region === region.name);
  const other = REGIONS.filter((r) => r.slug !== region.slug);

  return (
    <>
      <section className="relative">
        <div className="aspect-[16/7] bg-cover bg-center" style={{ backgroundImage: `url(${region.heroImage})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-10 md:pb-16 text-primary-foreground">
          <nav className="flex gap-2 text-xs text-primary-foreground/70 mb-4">
            <Link to="/" className="hover:text-accent">Home</Link><span>/</span>
            <Link to="/regions" className="hover:text-accent">Regions</Link><span>/</span>
            <span>{region.name}</span>
          </nav>
          <div className="text-xs uppercase tracking-[0.2em] text-accent">{region.gateway}</div>
          <h1 className="mt-3 text-4xl md:text-6xl font-serif">{region.name}</h1>
          <p className="mt-3 text-lg text-primary-foreground/85 max-w-2xl">{region.headline}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 grid gap-12 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="text-lg text-foreground/90 leading-relaxed max-w-2xl">{region.intro}</p>
          <p className="mt-6 text-muted-foreground max-w-2xl leading-relaxed">{region.body}</p>

          <div className="mt-12">
            <h2 className="font-serif text-2xl text-primary">Routes in {region.name}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {routes.map((r) => {
                const price = quote({ routeSlug: r.slug, vehicleClass: "economy" });
                return (
                  <Link
                    key={r.slug}
                    to="/routes/$slug"
                    params={{ slug: r.slug }}
                    className="rounded-xl bg-card border border-border/60 p-5 hover:border-accent transition"
                  >
                    <div className="font-serif text-primary">{r.from} → {r.to}</div>
                    <div className="mt-2 flex justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {r.durationMin} min
                      </span>
                      <span className="text-accent">from {price ? formatEur(price.totalEur) : "—"}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mt-12">
            <h2 className="font-serif text-2xl text-primary">Hotels we serve in {region.name}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {region.hotels.map((h) => (
                <span key={h} className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground/80">
                  {h}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Not on the list? We serve every hotel and villa in {region.name} — enter your address at
              booking.
            </p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 h-fit rounded-2xl bg-primary text-primary-foreground p-6">
          <div className="text-xs uppercase tracking-widest text-accent">Book in {region.name}</div>
          <p className="mt-3 text-sm text-primary-foreground/80">
            Local drivers who live here — not shipped in from elsewhere on the island.
          </p>
          <Link
            to="/book"
            className="mt-5 block text-center rounded-full bg-accent px-5 py-3 text-accent-foreground text-sm hover:opacity-90"
          >
            Get a fixed price
          </Link>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <h2 className="font-serif text-2xl text-primary mb-6">Other regions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {other.map((r) => (
            <Link
              key={r.slug}
              to="/regions/$slug"
              params={{ slug: r.slug }}
              className="rounded-xl bg-card border border-border/60 p-5 hover:border-accent transition"
            >
              <div className="font-serif text-primary text-lg">{r.name}</div>
              <div className="text-sm text-muted-foreground mt-1">{r.gateway}</div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
