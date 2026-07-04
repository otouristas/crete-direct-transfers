import { createFileRoute, Link } from "@tanstack/react-router";
import { REGIONS } from "@/data/regions";
import { ROUTES } from "@/data/routes";

export const Route = createFileRoute("/regions/")({
  head: () => ({
    meta: [
      { title: "Crete Regions | Chania, Rethymno, Heraklion, Lasithi Transfers · CreteTransfers" },
      { name: "description", content: "Fixed-price transfers across all four regions of Crete. Explore Chania, Rethymno, Heraklion and Lasithi with a licensed local driver." },
      { property: "og:title", content: "Crete Regions | CreteTransfers" },
      { property: "og:description", content: "Fixed-price transfers across all four regions of Crete." },
      { property: "og:url", content: "/regions" },
    ],
    links: [{ rel: "canonical", href: "/regions" }],
  }),
  component: RegionsHub,
});

function RegionsHub() {
  return (
    <>
      <section className="border-b border-border/60 bg-sand">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="text-xs uppercase tracking-[0.2em] text-accent">Regions</div>
          <h1 className="mt-3 text-4xl md:text-6xl font-serif text-primary">
            The four regions of Crete.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            From the Venetian west to the palm-fringed east — pick your region to see the routes, hotels
            and gateways we serve.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 grid gap-6 md:grid-cols-2">
        {REGIONS.map((r) => {
          const count = ROUTES.filter((route) => route.region === r.name).length;
          return (
            <Link
              key={r.slug}
              to="/regions/$slug"
              params={{ slug: r.slug }}
              className="group rounded-2xl overflow-hidden bg-card border border-border/60 hover:border-accent transition"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                  style={{ backgroundImage: `url(${r.heroImage})` }}
                />
              </div>
              <div className="p-6">
                <div className="text-xs uppercase tracking-widest text-accent">{r.gateway}</div>
                <div className="mt-2 font-serif text-3xl text-primary">{r.name}</div>
                <p className="mt-3 text-muted-foreground line-clamp-2">{r.intro}</p>
                <div className="mt-4 text-sm text-accent group-hover:underline">
                  {count} routes covered →
                </div>
              </div>
            </Link>
          );
        })}
      </section>
    </>
  );
}
