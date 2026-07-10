import { createFileRoute, Link } from "@tanstack/react-router";
import { ROUTES, VEHICLE_CLASSES } from "@/data/routes";
import { REGIONS } from "@/data/regions";
import { SERVICES } from "@/data/services";
import { REVIEWS, AVG_RATING } from "@/data/reviews";
import { FAQ_GROUPS } from "@/data/faqs";
import { BookingWidget } from "@/components/booking-widget";
import { FaqAccordion } from "@/components/faq-accordion";
import { CreteMapReal } from "@/components/crete-map-real";
import { SectionHeading } from "@/components/sections/section-heading";
import { TrustPills } from "@/components/sections/trust-pills";
import { StatsBand } from "@/components/sections/stats-band";
import { AdvantageGrid } from "@/components/sections/advantage-grid";
import { Steps } from "@/components/sections/steps";
import { ReviewsGrid } from "@/components/sections/review-card";
import { RouteCard } from "@/components/sections/route-card";
import { FleetCard } from "@/components/sections/fleet-card";
import { CtaBand } from "@/components/sections/cta-band";
import { getDict, useT, type Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { SITE_URL, CONTACT_PHONE } from "@/lib/site";
import { Star } from "lucide-react";

export const Route = createFileRoute("/{-$locale}/")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/",
      title: t.home.metaTitle,
      description: t.home.metaDescription,
      ogImage:
        "https://images.unsplash.com/photo-1601161221525-6b3e0f0e13db?auto=format&fit=crop&w=1600&q=70",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#business`,
        name: "TransferAround",
        url: SITE_URL,
        description: "Fixed-price private transfers across Crete.",
        areaServed: { "@type": "Place", name: "Crete, Greece" },
        telephone: CONTACT_PHONE,
        priceRange: "€€",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: AVG_RATING,
          reviewCount: REVIEWS.length,
        },
      },
    });
  },
  component: HomePage,
});

function HomePage() {
  const t = useT();
  const popular = ROUTES.slice(0, 6);

  return (
    <>
      {/* Hero: copy left, booking widget right */}
      <section className="relative overflow-hidden bg-primary">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1601161221525-6b3e0f0e13db?auto=format&fit=crop&w=2400&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/85 to-primary/70" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 pb-16 pt-14 md:pb-20 md:pt-20 lg:grid-cols-[1.1fr_420px]">
          <div className="text-primary-foreground">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] ring-1 ring-primary-foreground/15">
              <Star className="h-3 w-3 fill-highlight text-highlight" />
              {t.home.heroEyebrow}
            </div>
            <h1 className="mt-6 text-4xl font-display leading-[1.05] md:text-5xl lg:text-6xl">
              {t.home.heroTitle1}
              <br />
              <span className="text-accent">{t.home.heroTitle2}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-primary-foreground/80">
              {t.home.heroSubtitle}
            </p>
            <TrustPills dark className="mt-8" />
          </div>
          <div className="w-full">
            <BookingWidget />
          </div>
        </div>
      </section>

      <StatsBand />

      {/* Popular routes */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <SectionHeading
          eyebrow={t.nav.routes}
          title={t.home.popularTitle}
          subtitle={t.home.popularSubtitle}
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((r) => (
            <RouteCard key={r.slug} route={r} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/{-$locale}/routes"
            className="inline-flex items-center rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-primary transition hover:border-accent"
          >
            {t.common.seeAllRoutes} →
          </Link>
        </div>
      </section>

      {/* Why us */}
      <section className="border-y border-border bg-muted/60">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <SectionHeading
            eyebrow="TransferAround"
            title={t.advantages.title}
            subtitle={t.advantages.subtitle}
          />
          <div className="mt-12">
            <AdvantageGrid />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <SectionHeading
          eyebrow={t.nav.howItWorks}
          title={t.steps.title}
          subtitle={t.steps.subtitle}
        />
        <div className="mx-auto mt-12 max-w-4xl">
          <Steps />
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/{-$locale}/how-it-works"
            className="text-sm font-semibold text-accent-deep hover:underline"
          >
            {t.common.learnMore} →
          </Link>
        </div>
      </section>

      {/* Fleet */}
      <section className="border-y border-border bg-muted/60">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <SectionHeading
            eyebrow={t.nav.fleet}
            title={t.home.fleetTitle}
            subtitle={t.home.fleetSubtitle}
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VEHICLE_CLASSES.map((v) => (
              <FleetCard key={v.id} vehicle={v} />
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <SectionHeading
          eyebrow={t.nav.reviews}
          title={t.home.reviewsTitle}
          subtitle={t.home.reviewsSubtitle}
        />
        <div className="mt-12">
          <ReviewsGrid reviews={REVIEWS.slice(0, 6)} />
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/{-$locale}/reviews"
            className="text-sm font-semibold text-accent-deep hover:underline"
          >
            {t.common.viewAll} →
          </Link>
        </div>
      </section>

      {/* Regions + map */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:py-24 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow={t.nav.regions}
              title={t.home.regionsTitle}
              subtitle={t.home.regionsSubtitle}
              align="left"
              dark
            />
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {REGIONS.map((r) => (
                <Link
                  key={r.slug}
                  to="/{-$locale}/regions/$slug"
                  params={{ slug: r.slug }}
                  className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-4 transition hover:border-accent hover:bg-primary-foreground/10"
                >
                  <div className="font-display text-xl">{r.name}</div>
                  <div className="mt-1 text-xs text-primary-foreground/60">
                    {ROUTES.filter((route) => route.region === r.name).length}{" "}
                    {t.nav.routes.toLowerCase()} · {r.gateway}
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-primary-foreground/15">
            <CreteMapReal />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <SectionHeading
          eyebrow={t.nav.services}
          title={t.servicesPages.indexTitle}
          subtitle={t.servicesPages.indexSubtitle}
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <Link
              key={s.slug}
              to="/{-$locale}/services/$slug"
              params={{ slug: s.slug }}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="font-display text-xl text-primary">{s.name}</div>
              <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{s.tagline}</p>
              <div className="mt-5 text-sm font-semibold text-accent-deep group-hover:underline">
                {t.common.learnMore} →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ preview */}
      <section className="border-t border-border bg-muted/60">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <SectionHeading
            eyebrow={t.nav.faq}
            title={t.home.faqTitle}
            subtitle={t.home.faqSubtitle}
          />
          <div className="mt-12">
            <FaqAccordion groups={FAQ_GROUPS.slice(0, 2)} />
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/{-$locale}/faq"
              className="text-sm font-semibold text-accent-deep hover:underline"
            >
              {t.common.viewAll} →
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
