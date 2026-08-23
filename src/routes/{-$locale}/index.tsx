import { createFileRoute, Link } from "@tanstack/react-router";
import { REVIEWS, AVG_RATING } from "@/data/reviews";
import { BookingWidget } from "@/components/booking-widget";
import { TrustPills } from "@/components/sections/trust-pills";
import { Steps } from "@/components/sections/steps";
import { ReviewsGrid } from "@/components/sections/review-card";
import { FleetCard } from "@/components/sections/fleet-card";
import { RoutesChapter } from "@/components/sections/routes-chapter";
import { InpageNav } from "@/components/inpage-nav";
import { Reveal } from "@/components/reveal";
import { getDict, useLocale, useT, type Locale } from "@/i18n";
import { getLocalizedRegions, getLocalizedRoutes, getLocalizedVehicles } from "@/i18n/content";
import { buildHead } from "@/lib/seo";
import { SITE_URL, CONTACT_PHONE, CONTACT_WHATSAPP_HREF, REVIEWS_VERIFIED } from "@/lib/site";
import { Phone } from "lucide-react";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1601161221525-6b3e0f0e13db?auto=format&fit=crop&w=2400&q=80";
const MANIFESTO_IMAGE =
  "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1600&q=75";

export const Route = createFileRoute("/{-$locale}/")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/",
      title: t.home.metaTitle,
      description: t.home.metaDescription,
      ogImage: HERO_IMAGE.replace("w=2400", "w=1600").replace("q=80", "q=70"),
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#business`,
        name: "TransferAround",
        url: SITE_URL,
        description: "Fixed-price private transfers across Crete.",
        areaServed: { "@type": "Place", name: "Crete, Greece" },
        priceRange: "€€",
        ...(CONTACT_PHONE ? { telephone: CONTACT_PHONE } : {}),
        ...(REVIEWS_VERIFIED
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: AVG_RATING,
                reviewCount: REVIEWS.length,
              },
            }
          : {}),
      },
    });
  },
  component: HomePage,
});

function HomePage() {
  const t = useT();
  const locale = useLocale();
  const vehicles = getLocalizedVehicles(locale);
  const regions = getLocalizedRegions(locale);
  const routes = getLocalizedRoutes(locale);

  const navItems = [
    { id: "book", label: t.inpageNav.bookNow, cta: true },
    { id: "manifesto", label: t.inpageNav.howItWorks },
    { id: "routes", label: t.inpageNav.routes },
    { id: "fleet", label: t.inpageNav.fleet },
    ...(REVIEWS_VERIFIED ? [{ id: "reviews", label: t.inpageNav.reviews }] : []),
    { id: "regions", label: t.inpageNav.regions },
  ];

  return (
    <>
      {/* 1. Hero — brand + horizontal booking bar; -mt-16 pulls under sticky transparent header */}
      <section className="relative -mt-16 bg-primary pt-16">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="media-grade absolute inset-0 bg-cover bg-center opacity-40"
            style={{ backgroundImage: `url(${HERO_IMAGE})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/88 to-primary/65" />
        </div>
        <div className="relative mx-auto max-w-[1280px] px-6 pb-14 pt-14 md:pb-16 md:pt-16">
          <div className="max-w-2xl text-primary-foreground">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/70">
              {t.home.heroEyebrow}
            </p>
            <h1 className="mt-5 text-4xl font-display leading-[1.05] md:text-5xl lg:text-6xl">
              {t.home.heroTitle1}
              <span className="sr-only"> </span>
              <br />
              <span className="font-accent text-[1.08em] text-accent">
                {t.home.heroTitleAccent}
              </span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-primary-foreground/80">
              {t.home.heroSubtitle}
            </p>
            <TrustPills dark className="mt-8" />
          </div>
          <div id="book" className="relative z-[35] mt-10 w-full scroll-mt-32">
            <BookingWidget variant="hbar" />
          </div>
        </div>
      </section>

      <InpageNav items={navItems} />

      {/* 2. Manifesto */}
      <section id="manifesto" className="scroll-mt-32 bg-background">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-28">
          <Reveal>
            <h2 className="max-w-3xl text-3xl font-display leading-tight text-primary md:text-5xl lg:text-[3.25rem]">
              {t.home.manifestoLead}{" "}
              <span className="font-accent text-accent">{t.home.manifestoAccent}</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid items-end gap-10 lg:grid-cols-[1fr_1.15fr]">
            <Reveal delay={1}>
              <p className="max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
                {t.home.manifestoBody}
              </p>
              <p className="mt-6 font-display text-xl text-primary md:text-2xl">
                {t.home.manifestoClose}
              </p>
              <div className="mt-10 max-w-md">
                <Steps />
              </div>
              <Link
                to="/{-$locale}/how-it-works"
                className="mt-6 inline-flex text-sm font-semibold text-accent-deep hover:underline"
              >
                {t.common.learnMore} →
              </Link>
            </Reveal>
            <Reveal delay={2} className="overflow-hidden rounded-2xl">
              <div className="aspect-[4/3] overflow-hidden md:aspect-[5/4]">
                <img
                  src={MANIFESTO_IMAGE}
                  alt=""
                  className="media-grade h-full w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3. Routes chapter — sticky image + priced list */}
      <RoutesChapter id="routes" />

      {/* 4. Fleet strip */}
      <section id="fleet" className="scroll-mt-32 border-b border-border bg-muted/50">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {t.nav.fleet}
            </p>
            <h2 className="mt-3 text-3xl font-display text-primary md:text-5xl">
              {t.home.fleetTitle}
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">{t.home.fleetSubtitle}</p>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {vehicles.map((v) => (
              <FleetCard key={v.id} vehicle={v} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Proof — reviews + region ribbon */}
      {REVIEWS_VERIFIED && (
        <section id="reviews" className="scroll-mt-32 bg-background">
          <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
            <Reveal>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {t.nav.reviews}
              </p>
              <h2 className="mt-3 text-3xl font-display text-primary md:text-5xl">
                {t.home.proofTitle}
              </h2>
              <p className="mt-4 max-w-xl text-muted-foreground">{t.home.proofSubtitle}</p>
            </Reveal>
            <div className="mt-12">
              <ReviewsGrid reviews={REVIEWS.slice(0, 3)} />
            </div>
            <div className="mt-8 text-center">
              <Link
                to="/{-$locale}/reviews"
                className="text-sm font-semibold text-accent-deep hover:underline"
              >
                {t.common.viewAll} →
              </Link>
            </div>
          </div>
        </section>
      )}

      <section id="regions" className="scroll-mt-32 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/55">
              {t.nav.regions}
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-display md:text-4xl">
              {t.home.regionsTitle}
            </h2>
            <p className="mt-4 max-w-lg text-primary-foreground/70">{t.home.regionsSubtitle}</p>
          </Reveal>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {regions.map((r) => (
              <Link
                key={r.slug}
                to="/{-$locale}/regions/$slug"
                params={{ slug: r.slug }}
                className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-5 transition hover:border-accent hover:bg-primary-foreground/10"
              >
                <div className="font-display text-xl">{r.name}</div>
                <div className="mt-1 text-xs text-primary-foreground/55">
                  {routes.filter((route) => route.region === r.name).length}{" "}
                  {t.nav.routes.toLowerCase()} · {r.gateway}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Closing CTA */}
      <section className="relative overflow-hidden bg-primary">
        <div
          className="media-grade absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=2000&q=70)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/90 to-primary/70" />
        <div className="relative mx-auto max-w-3xl px-6 py-20 text-center md:py-28">
          <Reveal>
            <h2 className="text-4xl font-display text-primary-foreground md:text-5xl">
              {t.home.closingTitle}{" "}
              <span className="font-accent text-accent">{t.home.closingAccent}</span>
            </h2>
            <p className="mx-auto mt-5 max-w-md text-lg text-primary-foreground/75">
              {t.home.closingSubtitle}
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/{-$locale}/book"
                className="inline-flex items-center rounded-xl bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
              >
                {t.common.getPrice}
              </Link>
              {CONTACT_WHATSAPP_HREF && (
                <a
                  href={CONTACT_WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/25 px-6 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-foreground/10"
                >
                  <Phone className="h-4 w-4" />
                  {t.common.whatsapp}
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
