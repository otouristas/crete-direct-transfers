import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Clock, Compass, Lightbulb, MapPin, Route as RouteIcon } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { BookingWidget } from "@/components/booking-widget";
import { getRouteGuide, ROUTE_GUIDES } from "@/data/route-guides";
import { getRoute } from "@/data/routes";
import { driversForRoute, driverInitials } from "@/data/drivers";
import { formatEur } from "@/lib/pricing";
import { buildCanonicalUrl, buildHead } from "@/lib/seo";
import { ORGANIZATION_ID } from "@/lib/structured-data";
import type { Locale } from "@/i18n";

export const Route = createFileRoute("/{-$locale}/guides/$slug")({
  loader: ({ params }) => {
    const guide = getRouteGuide(params.slug);
    if (!guide) throw notFound();
    return { guide };
  },
  head: ({ loaderData, params }) => {
    const locale = (params.locale ?? "en") as Locale;
    if (!loaderData) {
      return { meta: [{ title: "Guide unavailable" }, { name: "robots", content: "noindex" }] };
    }
    const { guide } = loaderData;
    const path = `/guides/${guide.slug}`;
    const canonical = buildCanonicalUrl(locale, path);
    return buildHead({
      locale,
      path,
      title: guide.title,
      description: guide.subtitle,
      ogImage: guide.heroImage,
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Article",
            "@id": `${canonical}#article`,
            headline: guide.title,
            description: guide.subtitle,
            image: guide.heroImage,
            publisher: { "@id": ORGANIZATION_ID },
          },
          {
            "@type": "FAQPage",
            "@id": `${canonical}#faq`,
            mainEntity: guide.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ],
      },
    });
  },
  component: GuidePage,
});

function GuidePage() {
  const { guide } = Route.useLoaderData();
  const route = getRoute(guide.routeSlug);
  const drivers = driversForRoute(guide.routeSlug);
  const related = ROUTE_GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <img
          src={guide.heroImage}
          alt={guide.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/40" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/70">
            Route guide
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl text-primary-foreground md:text-5xl">
            {guide.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-primary-foreground/80">{guide.subtitle}</p>
          {route && (
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                { icon: Clock, label: `${route.durationMin} min` },
                { icon: MapPin, label: `${route.distanceKm} km` },
                { icon: RouteIcon, label: `from ${formatEur(route.basePriceEur)}` },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 px-4 py-2 text-sm text-primary-foreground"
                >
                  <Icon className="h-4 w-4" /> {label}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-14 lg:grid-cols-[1fr_380px]">
        <div className="space-y-14">
          <div className="space-y-4">
            {guide.intro.map((p) => (
              <p key={p} className="text-lg leading-relaxed text-foreground/85">
                {p}
              </p>
            ))}
          </div>

          <div>
            <h2 className="font-display text-2xl text-primary">The drive, minute by minute</h2>
            <ol className="mt-6 space-y-0">
              {guide.drive.map((stop) => (
                <li key={stop.title} className="relative flex gap-5 pb-8 last:pb-0">
                  <div className="flex flex-col items-center">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent/10 text-xs font-semibold text-accent-deep">
                      {stop.atMin}′
                    </span>
                    <span className="mt-1 w-px flex-1 bg-border" />
                  </div>
                  <div className="pt-2">
                    <h3 className="font-semibold text-primary">{stop.title}</h3>
                    <p className="mt-1.5 text-muted-foreground">{stop.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="font-display text-2xl text-primary">Detours worth asking for</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {guide.detours.map((d) => (
                <div key={d.name} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-primary">{d.name}</h3>
                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                      +{d.addMin} min
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{d.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-muted/40 p-6">
              <Clock className="h-5 w-5 text-accent-deep" />
              <h3 className="mt-3 font-semibold text-primary">Timing and traffic</h3>
              <p className="mt-2 text-sm text-muted-foreground">{guide.timing}</p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/40 p-6">
              <Compass className="h-5 w-5 text-accent-deep" />
              <h3 className="mt-3 font-semibold text-primary">The arrival</h3>
              <p className="mt-2 text-sm text-muted-foreground">{guide.arrival}</p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl text-primary">Local knowledge</h2>
            <ul className="mt-5 space-y-3">
              {guide.tips.map((tip) => (
                <li key={tip} className="flex gap-3 text-muted-foreground">
                  <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-accent-deep" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {drivers.length > 0 && (
            <div>
              <h2 className="font-display text-2xl text-primary">Drivers who run this route</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {drivers.map((d) => (
                  <Link
                    key={d.slug}
                    to="/{-$locale}/drivers/$slug"
                    params={{ slug: d.slug }}
                    className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition hover:shadow-md"
                  >
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary font-display text-lg text-primary-foreground">
                      {driverInitials(d.name)}
                    </span>
                    <span>
                      <span className="block font-semibold text-primary">{d.name}</span>
                      <span className="block text-sm text-muted-foreground">
                        {d.base} · {d.years} years · {d.vehicle}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="font-display text-2xl text-primary">Questions we get asked</h2>
            <div className="mt-5 space-y-4">
              {guide.faqs.map((f) => (
                <div key={f.q} className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="font-semibold text-primary">{f.q}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/{-$locale}/routes/$slug"
              params={{ slug: guide.routeSlug }}
              className="inline-flex items-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              See fixed prices for this route
            </Link>
            <Link
              to="/{-$locale}/guides"
              className="inline-flex items-center rounded-xl border border-border px-6 py-3 text-sm font-semibold text-primary transition hover:bg-muted"
            >
              All route guides
            </Link>
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <BookingWidget />
        </aside>
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <h2 className="font-display text-2xl text-primary">More route guides</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {related.map((g) => (
              <Link
                key={g.slug}
                to="/{-$locale}/guides/$slug"
                params={{ slug: g.slug }}
                className="rounded-2xl border border-border bg-card p-5 transition hover:shadow-md"
              >
                <h3 className="font-semibold text-primary">{g.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{g.subtitle}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
