import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Anchor, Check, Plane } from "lucide-react";
import { BookingWidget } from "@/components/booking-widget";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { Reveal } from "@/components/reveal";
import { getDict, useT, type Locale } from "@/i18n";
import { formatEur } from "@/lib/pricing";
import { buildCanonicalUrl, buildHead } from "@/lib/seo";
import { ORGANIZATION_ID } from "@/lib/structured-data";
import {
  airportsNearPort,
  getPort,
  isIndexablePort,
  relatedPorts,
  type PortData,
} from "@/lib/port-resolve";

export const Route = createFileRoute("/{-$locale}/ports/$slug")({
  loader: ({ params }) => {
    const port = getPort(params.slug);
    if (!port) throw notFound();
    const indexable = isIndexablePort(params.slug);
    // Out-of-market ports render in English only, same policy as airports.
    if (!indexable && (params.locale ?? "en") !== "en") throw notFound();
    return { port, indexable };
  },
  head: ({ loaderData, params }) => {
    const locale = (params.locale ?? "en") as Locale;
    const t = getDict(locale);
    if (!loaderData) {
      return {
        meta: [{ title: t.seo.notFound("Port") }, { name: "robots", content: "noindex" }],
      };
    }
    const { port, indexable } = loaderData;
    const p = t.portPages;
    const path = `/ports/${port.slug}`;
    const canonical = buildCanonicalUrl(locale, path);
    return buildHead({
      locale,
      path,
      title: p.metaTitle(port.name),
      description: p.metaDescription(port.name, port.countryName),
      noindex: !indexable,
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Service",
            "@id": `${canonical}#service`,
            name: p.title(port.name),
            serviceType: p.eyebrow,
            description: p.intro(port.name, port.countryName),
            provider: { "@id": ORGANIZATION_ID },
            areaServed: {
              "@type": "Place",
              name: port.name,
              geo: {
                "@type": "GeoCoordinates",
                latitude: port.lat,
                longitude: port.lng,
              },
            },
          },
        ],
      },
    });
  },
  component: PortPage,
});

function PortFacts({ port }: { port: PortData }) {
  const t = useT();
  const p = t.portPages;
  const facts = [
    { label: p.factPort, value: port.name },
    { label: p.factCountry, value: port.countryName },
    { label: p.factFrom, value: formatEur(port.fromPriceEur) },
    ...(port.nearestAirport
      ? [
          {
            label: p.factNearestAirport,
            value: `${port.nearestAirport.name} (${port.nearestAirport.iata})`,
          },
        ]
      : []),
    { label: p.factPickup, value: p.factPickupValue },
    { label: p.factWaiting, value: p.factWaitingValue },
  ];
  return (
    <section className="bg-secondary/40 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-2xl font-display text-primary sm:text-3xl">{p.factsTitle}</h2>
        <dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {facts.map((f) => (
            <div key={f.label} className="border-t border-border pt-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{f.label}</dt>
              <dd className="mt-1 font-medium text-foreground">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function PortPage() {
  const { port } = Route.useLoaderData();
  const t = useT();
  const p = t.portPages;
  const nearby = airportsNearPort(port, 6);
  const others = relatedPorts(port, 8);

  return (
    <>
      <PageHero
        eyebrow={p.eyebrow}
        title={p.title(port.name)}
        subtitle={p.intro(port.name, port.countryName)}
        crumbs={[{ label: p.indexTitle, to: "/{-$locale}/ports" }, { label: port.name }]}
      />

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <h2 className="text-2xl font-display text-primary">{p.bookTitle(port.placeName)}</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">{p.bookSubtitle}</p>
          <div className="relative z-20 mt-8">
            <BookingWidget variant="hbar" defaultDestination={port.name} />
          </div>
        </div>
      </section>

      <PortFacts port={port} />

      <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
        <Reveal>
          <h2 className="text-2xl font-display text-primary sm:text-3xl">{p.knowTitle}</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {p.knowItems.map((item) => (
            <div key={item.title} className="rounded-2xl border border-border bg-card p-6">
              <Check className="h-4 w-4 text-accent" aria-hidden />
              <h3 className="mt-3 font-display text-lg text-primary">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/50">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-20">
          <h2 className="text-2xl font-display text-primary sm:text-3xl">
            {p.compareTitle(port.placeName)}
          </h2>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-semibold">{p.compareMode}</th>
                  <th className="px-5 py-3 font-semibold">{p.compareTime}</th>
                  <th className="px-5 py-3 font-semibold">{p.compareCost}</th>
                  <th className="px-5 py-3 font-semibold">{p.comparePros}</th>
                  <th className="px-5 py-3 font-semibold">{p.compareCons}</th>
                </tr>
              </thead>
              <tbody>
                {p.compareRows.map((row, i) => (
                  <tr
                    key={row.mode}
                    className={
                      i === p.compareRows.length - 1
                        ? "bg-accent/5 font-medium"
                        : "border-b border-border/60"
                    }
                  >
                    <td className="px-5 py-4 text-foreground">{row.mode}</td>
                    <td className="px-5 py-4 text-muted-foreground">{row.time}</td>
                    <td className="px-5 py-4 text-muted-foreground">{row.cost}</td>
                    <td className="px-5 py-4 text-muted-foreground">{row.pros}</td>
                    <td className="px-5 py-4 text-muted-foreground">{row.cons}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {nearby.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
          <h2 className="text-2xl font-display text-primary sm:text-3xl">
            {p.airportsTitle(port.placeName)}
          </h2>
          <p className="mt-2 text-muted-foreground">{p.airportsBody}</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {nearby.map((a) => (
              <li key={a.slug}>
                <Link
                  to="/{-$locale}/airports/$slug"
                  params={{ slug: a.slug }}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm shadow-sm transition hover:border-accent"
                >
                  <span className="flex items-center gap-2">
                    <Plane className="size-4 text-accent-deep" aria-hidden />
                    <span>
                      <span className="block font-medium text-foreground">{a.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {p.distanceFromPort(Math.round(a.distanceKm))}
                      </span>
                    </span>
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">{a.iata}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {others.length > 0 && (
        <section className="border-t border-border bg-secondary/40">
          <div className="mx-auto max-w-7xl px-6 py-14 md:py-20">
            <h2 className="text-2xl font-display text-primary sm:text-3xl">
              {p.relatedTitle(port.countryName)}
            </h2>
            <ul className="mt-6 flex flex-wrap gap-2">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link
                    to="/{-$locale}/ports/$slug"
                    params={{ slug: o.slug }}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm transition hover:border-accent hover:shadow-sm"
                  >
                    <Anchor className="size-3.5 text-accent-deep" aria-hidden />
                    {o.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBand title={p.ctaTitle} subtitle={p.ctaSubtitle} />
    </>
  );
}
