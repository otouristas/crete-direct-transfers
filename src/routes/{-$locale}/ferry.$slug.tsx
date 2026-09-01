import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Anchor, Check, Clock, MapPin, Ship } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { BookingWidget } from "@/components/booking-widget";
import { FERRY_PORTS, getFerryPort } from "@/data/ferry-ports";
import { getRoute } from "@/data/routes";
import { driversForRegion, driverInitials } from "@/data/drivers";
import { formatEur } from "@/lib/pricing";
import { buildCanonicalUrl, buildHead } from "@/lib/seo";
import { ORGANIZATION_ID } from "@/lib/structured-data";
import type { Locale } from "@/i18n";

export const Route = createFileRoute("/{-$locale}/ferry/$slug")({
  loader: ({ params }) => {
    const port = getFerryPort(params.slug);
    if (!port) throw notFound();
    return { port };
  },
  head: ({ loaderData, params }) => {
    const locale = (params.locale ?? "en") as Locale;
    if (!loaderData) {
      return { meta: [{ title: "Port unavailable" }, { name: "robots", content: "noindex" }] };
    }
    const { port } = loaderData;
    const path = `/ferry/${port.slug}`;
    const canonical = buildCanonicalUrl(locale, path);
    return buildHead({
      locale,
      path,
      title: `${port.name} transfers — ferry & cruise arrivals`,
      description: `Private transfers from ${port.name}, ${port.town}. Berthing times, meeting point at the terminal exit, 60 minutes free waiting and a fixed price from ${formatEur(port.fromPriceEur)}.`,
      ogImage: port.heroImage,
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Service",
            "@id": `${canonical}#service`,
            name: `${port.name} ferry transfers`,
            serviceType: "Private port transfer",
            provider: { "@id": ORGANIZATION_ID },
            areaServed: { "@type": "Place", name: `${port.town}, Crete, Greece` },
          },
          {
            "@type": "FAQPage",
            "@id": `${canonical}#faq`,
            mainEntity: port.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ],
      },
    });
  },
  component: FerryPortPage,
});

function FerryPortPage() {
  const { port } = Route.useLoaderData();
  const route = port.routeSlug ? getRoute(port.routeSlug) : undefined;
  const drivers = driversForRegion(port.region).slice(0, 3);
  const others = FERRY_PORTS.filter((p) => p.slug !== port.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow="Ferry & cruise arrivals"
        title={port.name}
        subtitle={port.summary}
        crumbs={[{ label: "Ferry ports", to: "/{-$locale}/ferry" }, { label: port.name }]}
      />

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-14 lg:grid-cols-[1fr_380px]">
        <div className="space-y-12">
          <div className="overflow-hidden rounded-2xl border border-border">
            <img src={port.heroImage} alt={port.name} className="aspect-[16/9] w-full object-cover" />
          </div>

          <div className="space-y-4">
            {port.intro.map((p) => (
              <p key={p} className="text-lg leading-relaxed text-foreground/85">
                {p}
              </p>
            ))}
          </div>

          <div>
            <h2 className="font-display text-2xl text-primary">Who sails here</h2>
            <div className="mt-5 overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3">Operator</th>
                    <th className="px-5 py-3">Connects</th>
                    <th className="px-5 py-3">Frequency</th>
                  </tr>
                </thead>
                <tbody>
                  {port.lines.map((l) => (
                    <tr key={l.operator} className="border-t border-border bg-card">
                      <td className="px-5 py-3 font-semibold text-primary">{l.operator}</td>
                      <td className="px-5 py-3 text-muted-foreground">{l.connects}</td>
                      <td className="px-5 py-3 text-muted-foreground">{l.frequency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-muted/40 p-6">
              <Clock className="h-5 w-5 text-accent-deep" />
              <h3 className="mt-3 font-semibold text-primary">Arrival times</h3>
              <p className="mt-2 text-sm text-muted-foreground">{port.arrivalTimes}</p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/40 p-6">
              <MapPin className="h-5 w-5 text-accent-deep" />
              <h3 className="mt-3 font-semibold text-primary">Where we meet you</h3>
              <p className="mt-2 text-sm text-muted-foreground">{port.meetingPoint}</p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl text-primary">Getting off the boat</h2>
            <ul className="mt-5 space-y-3">
              {port.disembarkNotes.map((n) => (
                <li key={n} className="flex gap-3 text-muted-foreground">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent-deep" />
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </div>

          {route && port.routeSlug && (
            <div className="rounded-2xl border border-border bg-muted/40 p-6">
              <h2 className="inline-flex items-center gap-2 font-display text-xl text-primary">
                <Ship className="h-5 w-5 text-accent-deep" />
                Popular onward transfer
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {route.from} → {route.to} · {route.distanceKm} km · {route.durationMin} min · fixed
                from {formatEur(route.basePriceEur)}
              </p>
              <Link
                to="/{-$locale}/routes/$slug"
                params={{ slug: port.routeSlug }}
                className="mt-5 inline-flex items-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                See prices
              </Link>
            </div>
          )}

          <div>
            <h2 className="font-display text-2xl text-primary">Questions we get asked</h2>
            <div className="mt-5 space-y-4">
              {port.faqs.map((f) => (
                <div key={f.q} className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="font-semibold text-primary">{f.q}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          {drivers.length > 0 && (
            <div>
              <h2 className="font-display text-2xl text-primary">Drivers who work this port</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {drivers.map((d) => (
                  <Link
                    key={d.slug}
                    to="/{-$locale}/drivers/$slug"
                    params={{ slug: d.slug }}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition hover:shadow-md"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {driverInitials(d.name)}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-primary">{d.name}</span>
                      <span className="block text-xs text-muted-foreground">{d.vehicle}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="font-display text-2xl text-primary">Other Crete ports</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {others.map((p) => (
                <Link
                  key={p.slug}
                  to="/{-$locale}/ferry/$slug"
                  params={{ slug: p.slug }}
                  className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card p-4 text-sm font-semibold text-primary transition hover:shadow-md"
                >
                  <Anchor className="h-4 w-4 text-accent-deep" />
                  {p.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <BookingWidget />
        </aside>
      </section>
      <CtaBand />
    </>
  );
}
