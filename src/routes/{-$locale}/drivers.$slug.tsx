import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Car, Globe, MapPin, Quote, Star, Users } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { EnglishOnlyNote } from "@/components/editorial/english-only-note";
import { DRIVERS, driverInitials, getDriver } from "@/data/drivers";
import { guideForRoute } from "@/data/route-guides";
import { getRoute } from "@/data/routes";
import { formatEur } from "@/lib/pricing";
import { buildCanonicalUrl, buildHead } from "@/lib/seo";
import { DRIVER_PROFILES_VERIFIED } from "@/lib/site";
import { ORGANIZATION_ID } from "@/lib/structured-data";
import { getDict, useT, type Locale } from "@/i18n";

export const Route = createFileRoute("/{-$locale}/drivers/$slug")({
  loader: ({ params }) => {
    const driver = getDriver(params.slug);
    if (!driver) throw notFound();
    return { driver };
  },
  head: ({ loaderData, params }) => {
    const locale = (params.locale ?? "en") as Locale;
    const t = getDict(locale);
    if (!loaderData) {
      return {
        meta: [{ title: t.editorial.driverUnavailable }, { name: "robots", content: "noindex" }],
      };
    }
    const { driver } = loaderData;
    const path = `/drivers/${driver.slug}`;
    const canonical = buildCanonicalUrl(locale, path);
    return buildHead({
      locale,
      path,
      title: t.editorial.driverMetaTitle(driver.name, driver.base),
      description: t.editorial.driverMetaDescription(
        driver.name,
        driver.base,
        driver.years,
        driver.languages.join(", "),
        driver.vehicle,
      ),
      englishOnly: true,
      // Named people with ratings and counts: indexable only once verified.
      noindex: !DRIVER_PROFILES_VERIFIED,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": `${canonical}#person`,
        name: driver.name,
        jobTitle: t.editorial.driverJobTitle,
        knowsLanguage: driver.languages,
        worksFor: { "@id": ORGANIZATION_ID },
        homeLocation: { "@type": "Place", name: `${driver.base}, Crete, Greece` },
      },
    });
  },
  component: DriverPage,
});

function DriverPage() {
  const t = useT();
  const { driver } = Route.useLoaderData();

  if (!DRIVER_PROFILES_VERIFIED) {
    return (
      <>
        <PageHero
          eyebrow={t.editorial.driversEyebrow}
          title={t.editorial.driversTitle}
          subtitle={t.editorial.driversSubtitle}
          crumbs={[{ label: t.editorial.driversCrumb, to: "/{-$locale}/drivers" }]}
        />
        <section className="mx-auto max-w-3xl px-6 py-14">
          <p className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
            {t.editorial.driversPendingNote}
          </p>
        </section>
        <CtaBand />
      </>
    );
  }

  const others = DRIVERS.filter((d) => d.slug !== driver.slug).slice(0, 3);
  const facts = [
    { icon: MapPin, label: t.editorial.driverBasedIn, value: `${driver.base}, ${driver.region}` },
    { icon: Globe, label: t.editorial.driverLanguages, value: driver.languages.join(", ") },
    {
      icon: Car,
      label: t.editorial.driverVehicle,
      value: `${driver.vehicle} (${driver.vehicleClass})`,
    },
    { icon: Users, label: t.editorial.driverCapacity, value: t.editorial.driverUpTo(driver.seats) },
  ];

  return (
    <>
      <PageHero
        eyebrow={t.editorial.driverEyebrow}
        title={driver.name}
        subtitle={t.editorial.driverSubtitle(
          driver.years,
          driver.region,
          driver.transfers.toLocaleString(),
        )}
        crumbs={[
          { label: t.editorial.driversCrumb, to: "/{-$locale}/drivers" },
          { label: driver.name },
        ]}
      >
        <div className="mt-8 flex items-center gap-5">
          <span className="flex h-24 w-24 items-center justify-center rounded-full bg-primary font-display text-3xl text-primary-foreground">
            {driverInitials(driver.name)}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-primary">
            <Star className="h-4 w-4 fill-highlight text-highlight" />
            {driver.rating.toFixed(1)} {t.editorial.driverAverageRating}
          </span>
        </div>
      </PageHero>

      <EnglishOnlyNote />

      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-2xl border border-border bg-card p-5">
              <Icon className="h-5 w-5 text-accent-deep" />
              <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
              <p className="mt-1 font-semibold text-primary">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 space-y-4">
          {driver.bio.map((p) => (
            <p key={p} className="text-lg leading-relaxed text-foreground/85">
              {p}
            </p>
          ))}
        </div>

        <figure className="mt-10 rounded-2xl border-l-4 border-accent bg-muted/40 p-6">
          <Quote className="h-6 w-6 text-accent-deep" />
          <blockquote className="mt-3 font-display text-xl text-primary">
            “{driver.quote}”
          </blockquote>
          <figcaption className="mt-3 text-sm text-muted-foreground">
            {driver.name}, {driver.base}
          </figcaption>
        </figure>

        <div className="mt-12">
          <h2 className="font-display text-2xl text-primary">{t.editorial.driverKnownFor}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {driver.specialties.map((s) => (
              <span
                key={s}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm text-primary"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="font-display text-2xl text-primary">
            {t.editorial.driverRoutesRun(driver.name.split(" ")[0])}
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {driver.routeSlugs.map((slug) => {
              const route = getRoute(slug);
              if (!route) return null;
              const guide = guideForRoute(slug);
              return (
                <div key={slug} className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="font-semibold text-primary">
                    {route.from} → {route.to}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t.editorial.kilometres(route.distanceKm)} ·{" "}
                    {t.editorial.minutes(route.durationMin)} ·{" "}
                    {t.editorial.fromPrice(formatEur(route.basePriceEur))}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
                    <Link
                      to="/{-$locale}/routes/$slug"
                      params={{ slug }}
                      className="text-accent-deep hover:underline"
                    >
                      {t.editorial.driverBookRoute}
                    </Link>
                    {guide && (
                      <Link
                        to="/{-$locale}/guides/$slug"
                        params={{ slug: guide.slug }}
                        className="text-muted-foreground hover:underline"
                      >
                        {t.editorial.driverReadGuide}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="font-display text-2xl text-primary">{t.editorial.driverOthers}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {others.map((d) => (
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
                  <span className="block text-xs text-muted-foreground">{d.base}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
