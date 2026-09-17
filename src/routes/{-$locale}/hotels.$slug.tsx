import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, Clock, MapPin, Plane } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { BookingWidget } from "@/components/booking-widget";
import { EnglishOnlyNote } from "@/components/editorial/english-only-note";
import { getHotelArea, HOTEL_AREAS } from "@/data/hotels";
import { guideForRoute } from "@/data/route-guides";
import { getRoute } from "@/data/routes";
import { driversForRegion, driverInitials } from "@/data/drivers";
import { formatEur } from "@/lib/pricing";
import { buildCanonicalUrl, buildHead } from "@/lib/seo";
import { DRIVER_PROFILES_VERIFIED } from "@/lib/site";
import { ORGANIZATION_ID } from "@/lib/structured-data";
import { getDict, useT, type Locale } from "@/i18n";

export const Route = createFileRoute("/{-$locale}/hotels/$slug")({
  loader: ({ params }) => {
    const area = getHotelArea(params.slug);
    if (!area) throw notFound();
    return { area };
  },
  head: ({ loaderData, params }) => {
    const locale = (params.locale ?? "en") as Locale;
    const t = getDict(locale);
    if (!loaderData) {
      return {
        meta: [{ title: t.editorial.hotelUnavailable }, { name: "robots", content: "noindex" }],
      };
    }
    const { area } = loaderData;
    const path = `/hotels/${area.slug}`;
    const canonical = buildCanonicalUrl(locale, path);
    return buildHead({
      locale,
      path,
      title: t.editorial.hotelMetaTitle(area.name, area.airport, area.airportIata),
      description: t.editorial.hotelMetaDescription(
        area.name,
        area.distanceKm,
        area.driveMin,
        area.airport,
        formatEur(area.fromPriceEur),
      ),
      ogImage: area.heroImage,
      englishOnly: true,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${canonical}#service`,
        name: t.editorial.hotelServiceName(area.name),
        serviceType: "Private airport transfer",
        provider: { "@id": ORGANIZATION_ID },
        areaServed: { "@type": "Place", name: `${area.name}, Crete, Greece` },
        offers: {
          "@type": "Offer",
          price: area.fromPriceEur,
          priceCurrency: "EUR",
        },
      },
    });
  },
  component: HotelAreaPage,
});

function HotelAreaPage() {
  const t = useT();
  const { area } = Route.useLoaderData();
  const route = getRoute(area.routeSlug);
  const guide = guideForRoute(area.routeSlug);
  const drivers = DRIVER_PROFILES_VERIFIED ? driversForRegion(area.region).slice(0, 3) : [];
  const others = HOTEL_AREAS.filter((a) => a.slug !== area.slug && a.region === area.region).slice(
    0,
    3,
  );

  return (
    <>
      <PageHero
        eyebrow={t.editorial.hotelEyebrow}
        title={t.editorial.hotelTitle(area.name)}
        subtitle={area.summary}
        crumbs={[{ label: t.editorial.hotelsNav, to: "/{-$locale}/hotels" }, { label: area.name }]}
      />

      <EnglishOnlyNote />

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-14 lg:grid-cols-[1fr_380px]">
        <div className="space-y-12">
          <div className="overflow-hidden rounded-2xl border border-border">
            <img
              src={area.heroImage}
              alt={area.name}
              className="aspect-[16/9] w-full object-cover"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            {[
              {
                icon: Plane,
                label: t.editorial.hotelNearestAirport,
                value: `${area.airport} (${area.airportIata})`,
              },
              {
                icon: MapPin,
                label: t.editorial.hotelDistance,
                value: t.editorial.kilometres(area.distanceKm),
              },
              {
                icon: Clock,
                label: t.editorial.hotelDriveTime,
                value: t.editorial.minutes(area.driveMin),
              },
              {
                icon: Check,
                label: t.editorial.hotelFixedFrom,
                value: formatEur(area.fromPriceEur),
              },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-5">
                <Icon className="h-5 w-5 text-accent-deep" />
                <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">
                  {label}
                </p>
                <p className="mt-1 font-semibold text-primary">{value}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {area.description.map((p) => (
              <p key={p} className="text-lg leading-relaxed text-foreground/85">
                {p}
              </p>
            ))}
          </div>

          <div>
            <h2 className="font-display text-2xl text-primary">{t.editorial.hotelArrivingTitle}</h2>
            <ul className="mt-5 space-y-3">
              {area.arrivalNotes.map((note) => (
                <li key={note} className="flex gap-3 text-muted-foreground">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent-deep" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-2xl text-primary">
              {t.editorial.hotelPropertiesTitle}
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {area.propertyTypes.map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm text-primary"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {route && (
            <div className="rounded-2xl border border-border bg-muted/40 p-6">
              <h2 className="font-display text-xl text-primary">
                {route.from} → {route.to}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {t.editorial.hotelRouteLine(
                  route.distanceKm,
                  route.durationMin,
                  formatEur(route.basePriceEur),
                )}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/{-$locale}/routes/$slug"
                  params={{ slug: area.routeSlug }}
                  className="inline-flex items-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
                >
                  {t.editorial.hotelSeeAllPrices}
                </Link>
                {guide && (
                  <Link
                    to="/{-$locale}/guides/$slug"
                    params={{ slug: guide.slug }}
                    className="inline-flex items-center rounded-xl border border-border px-6 py-3 text-sm font-semibold text-primary transition hover:bg-card"
                  >
                    {t.editorial.hotelReadGuide}
                  </Link>
                )}
              </div>
            </div>
          )}

          {drivers.length > 0 && (
            <div>
              <h2 className="font-display text-2xl text-primary">
                {t.editorial.hotelDriversCovering(area.region)}
              </h2>
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

          {others.length > 0 && (
            <div>
              <h2 className="font-display text-2xl text-primary">{t.editorial.hotelNearby}</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {others.map((a) => (
                  <Link
                    key={a.slug}
                    to="/{-$locale}/hotels/$slug"
                    params={{ slug: a.slug }}
                    className="rounded-2xl border border-border bg-card p-4 transition hover:shadow-md"
                  >
                    <span className="block font-semibold text-primary">{a.name}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {t.editorial.hotelMinutesFrom(a.driveMin, a.airportIata)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <BookingWidget />
        </aside>
      </section>
      <CtaBand />
    </>
  );
}
