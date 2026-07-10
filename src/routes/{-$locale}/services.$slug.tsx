import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getService, SERVICES } from "@/data/services";
import { ROUTES, routesByService } from "@/data/routes";
import { quote, formatEur } from "@/lib/pricing";
import { Check } from "lucide-react";
import type { Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/{-$locale}/services/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData, params }) => {
    const locale = (params.locale ?? "en") as Locale;
    if (!loaderData) {
      return {
        meta: [
          { title: "Service not found | CreteTransfers" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const s = loaderData.service;
    return buildHead({
      locale,
      path: `/services/${params.slug}`,
      title: `${s.name} in Crete | Fixed Price · CreteTransfers`,
      description: s.tagline,
      ogImage: s.heroImage,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Service",
        serviceType: s.name,
        provider: { "@type": "LocalBusiness", name: "CreteTransfers" },
        areaServed: "Crete, Greece",
        description: s.body,
      },
    });
  },
  component: ServicePage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl text-primary">Service not found</h1>
      <Link
        to="/{-$locale}/services"
        className="inline-flex mt-6 rounded-xl bg-accent px-5 py-2 text-sm text-accent-foreground"
      >
        All services
      </Link>
    </div>
  ),
});

function ServicePage() {
  const { service } = Route.useLoaderData();
  const routes =
    service.slug === "airport-transfers"
      ? routesByService("airport")
      : service.slug === "port-transfers"
        ? routesByService("port")
        : service.slug === "long-distance"
          ? routesByService("cross-island")
          : service.slug === "hotel-transfers"
            ? routesByService("hotel")
            : ROUTES.slice(0, 6);

  const others = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <section className="relative">
        <div
          className="aspect-[16/7] bg-cover bg-center"
          style={{ backgroundImage: `url(${service.heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-10 md:pb-14 text-primary-foreground">
          <nav className="flex gap-2 text-xs text-primary-foreground/70 mb-3">
            <Link to="/{-$locale}" className="hover:text-accent">
              Home
            </Link>
            <span>/</span>
            <Link to="/{-$locale}/services" className="hover:text-accent">
              Services
            </Link>
            <span>/</span>
            <span>{service.name}</span>
          </nav>
          <h1 className="text-4xl md:text-6xl font-display">{service.name}</h1>
          <p className="mt-3 text-lg text-primary-foreground/85 max-w-2xl">{service.tagline}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 grid gap-12 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="text-lg text-foreground/90 leading-relaxed max-w-2xl">{service.intro}</p>
          <p className="mt-6 text-muted-foreground max-w-2xl leading-relaxed">{service.body}</p>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-card border border-border p-6">
              <h3 className="font-display text-lg text-primary">Included</h3>
              <ul className="mt-4 space-y-2 text-sm">
                {service.whatsIncluded.map((x: string) => (
                  <li key={x} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" /> {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-card border border-border p-6">
              <h3 className="font-display text-lg text-primary">Best for</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {service.bestFor.map((x: string) => (
                  <li key={x}>· {x}</li>
                ))}
              </ul>
            </div>
          </div>

          {routes.length > 0 && (
            <div className="mt-12">
              <h2 className="font-display text-2xl text-primary">
                Popular {service.name.toLowerCase()} routes
              </h2>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {routes.slice(0, 8).map((r) => {
                  const price = quote({ routeSlug: r.slug, vehicleClass: "economy" });
                  return (
                    <Link
                      key={r.slug}
                      to="/{-$locale}/routes/$slug"
                      params={{ slug: r.slug }}
                      className="rounded-xl bg-card border border-border p-4 hover:border-accent flex justify-between items-center transition"
                    >
                      <span className="text-sm font-medium text-foreground">
                        {r.from} → {r.to}
                      </span>
                      <span className="text-sm text-accent">
                        from {price ? formatEur(price.totalEur) : "—"}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 h-fit rounded-2xl bg-primary text-primary-foreground p-6">
          <div className="text-xs uppercase tracking-widest text-accent">Book {service.name}</div>
          <p className="mt-3 text-sm text-primary-foreground/80">
            Fixed price, licensed drivers, flight tracked.
          </p>
          <Link
            to="/{-$locale}/book"
            className="mt-5 block text-center rounded-xl bg-accent px-5 py-3 text-accent-foreground text-sm hover:opacity-90"
          >
            Get a quote
          </Link>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <h2 className="font-display text-2xl text-primary mb-6">Other services</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {others.map((s) => (
            <Link
              key={s.slug}
              to="/{-$locale}/services/$slug"
              params={{ slug: s.slug }}
              className="rounded-xl bg-card border border-border p-5 hover:border-accent transition"
            >
              <div className="font-display text-primary text-lg">{s.name}</div>
              <div className="text-sm text-muted-foreground mt-1 line-clamp-2">{s.tagline}</div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
