import { createFileRoute, Link } from "@tanstack/react-router";
import { REVIEWS } from "@/data/reviews";
import { BookingWidget } from "@/components/booking-widget";
import { ResumeQuoteBanner } from "@/components/booking/resume-quote-banner";
import { TrustPills } from "@/components/sections/trust-pills";
import { Steps } from "@/components/sections/steps";
import { ReviewsGrid } from "@/components/sections/review-card";
import { FleetCard } from "@/components/sections/fleet-card";
import { RoutesChapter } from "@/components/sections/routes-chapter";
import { InpageNav } from "@/components/inpage-nav";
import { Reveal } from "@/components/reveal";
import { StatsBand } from "@/components/sections/stats-band";
import { getDict, useLocale, useT, type Locale } from "@/i18n";
import { getLocalizedVehicles } from "@/i18n/content";
import { getMarketNavigation } from "@/lib/market-navigation";
import { buildHead } from "@/lib/seo";
import { CONTACT_WHATSAPP_HREF, REVIEWS_VERIFIED } from "@/lib/site";
import { Phone } from "lucide-react";
import {
  getCountryImage,
  getHeroImage,
  getServiceImage,
  imageOgUrl,
  imageUrl,
} from "@/lib/place-image";
import { PhotoCredit } from "@/components/photo-credit";
import { DestinationCards } from "@/components/sections/destination-cards";
import { ServicesRail } from "@/components/sections/services-rail";
import { NewsletterBand } from "@/components/sections/newsletter-band";
import { COVERAGE } from "@/lib/coverage";

const HERO_PHOTO = getHeroImage();
const MANIFESTO_PHOTO = getCountryImage("greece");
const CLOSING_PHOTO = getServiceImage("long-distance");

const HERO_IMAGE = imageUrl(HERO_PHOTO, { width: 2400 });
const MANIFESTO_IMAGE = imageUrl(MANIFESTO_PHOTO, { width: 1600 });

export const Route = createFileRoute("/{-$locale}/")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/",
      title: t.home.metaTitle,
      description: t.home.metaDescription,
      ogImage: imageOgUrl(HERO_PHOTO),
    });
  },
  component: HomePage,
});

function HomePage() {
  const t = useT();
  const locale = useLocale();
  const vehicles = getLocalizedVehicles(locale);
  const markets = getMarketNavigation(locale).filter((market) => market.published);

  const navItems = [
    { id: "book", label: t.inpageNav.bookNow, cta: true },
    { id: "services", label: t.home.servicesEyebrow },
    { id: "manifesto", label: t.inpageNav.howItWorks },
    { id: "routes", label: t.inpageNav.routes },
    { id: "fleet", label: t.inpageNav.fleet },
    ...(REVIEWS_VERIFIED ? [{ id: "reviews", label: t.inpageNav.reviews }] : []),
    { id: "countries", label: t.nav.destinations },
  ];

  return (
    <>
      {/* 1. Hero — layered photo + booking bar; -mt-16 pulls under the sticky transparent header */}
      <section className="relative -mt-16 bg-primary pt-16">
        <div className="pointer-events-none hero-stage" aria-hidden>
          <img
            src={HERO_IMAGE}
            alt=""
            width={2400}
            height={1350}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="hero-photo media-grade h-full w-full object-cover object-[center_42%]"
          />
          <div className="hero-scrim" />
          <div className="hero-grain" />
        </div>

        <div className="relative mx-auto max-w-[1280px] px-6 pb-14 pt-16 md:pb-16 md:pt-24">
          <div className="max-w-2xl text-primary-foreground">
            <p className="hero-rise hero-rise-1 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/85 ring-1 ring-primary-foreground/15">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
              {t.home.heroEyebrow}
            </p>
            <h1 className="hero-rise hero-rise-2 mt-6 font-display text-[2.6rem] leading-[0.98] tracking-[-0.03em] sm:text-6xl lg:text-[4.5rem]">
              {t.home.heroTitle1}
              <span className="sr-only"> </span>
              <br />
              <span className="font-accent text-[1.1em] font-normal tracking-[-0.01em] text-accent">
                {t.home.heroTitleAccent}
              </span>
            </h1>
            <p className="hero-rise hero-rise-3 mt-6 max-w-md text-lg leading-relaxed text-primary-foreground/80">
              {t.home.heroSubtitle}
            </p>
            <TrustPills dark className="hero-rise hero-rise-4 mt-8" />
          </div>

          <div
            id="book"
            className="hero-rise hero-rise-4 relative z-[35] mt-12 w-full scroll-mt-32"
          >
            <BookingWidget variant="hbar" />
            <ResumeQuoteBanner locale={locale} className="mt-4" />
          </div>

          {/* Coverage ribbon — the same reassurance Transfeero runs, on our real numbers. */}
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-primary-foreground/65">
            <span>{t.home.countriesAirports(COVERAGE.airportPages)}</span>
            <span aria-hidden className="text-primary-foreground/30">
              ·
            </span>
            <span>{t.common.fixedPrice}</span>
            <span aria-hidden className="text-primary-foreground/30">
              ·
            </span>
            <span>{t.trust.freeCancel}</span>
          </div>

          <PhotoCredit image={HERO_PHOTO} overlay className="bottom-3" />
        </div>
      </section>

      <InpageNav items={navItems} />

      <StatsBand />

      {/* 2. Services — six live service pages the homepage previously linked to nowhere */}
      <section id="services" className="scroll-mt-32 bg-background">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent-deep">
              {t.home.servicesEyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-display text-primary md:text-4xl">
              {t.home.servicesTitle}
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">{t.home.servicesSubtitle}</p>
          </Reveal>
          <Reveal delay={1} className="mt-10">
            <ServicesRail />
          </Reveal>
        </div>
      </section>

      {/* 3. Manifesto */}
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
              <div className="relative aspect-[4/3] overflow-hidden md:aspect-[5/4]">
                <img
                  src={MANIFESTO_IMAGE}
                  alt=""
                  loading="lazy"
                  style={{ backgroundColor: MANIFESTO_PHOTO.avgColor }}
                  className="media-grade h-full w-full object-cover"
                />
                <PhotoCredit image={MANIFESTO_PHOTO} overlay />
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

      {/* 5. Destinations — photo cards, imagery resolved from the Pexels manifest */}
      <section id="countries" className="scroll-mt-32 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
              {t.home.destinationsEyebrow}
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-display md:text-5xl">
              {t.home.destinationsTitle}
            </h2>
            <p className="mt-4 max-w-lg text-primary-foreground/70">
              {t.home.destinationsSubtitle}
            </p>
          </Reveal>
          <Reveal delay={1} className="mt-10">
            <DestinationCards markets={markets} />
          </Reveal>
          <div className="mt-8">
            <Link
              to="/{-$locale}/countries"
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent transition hover:opacity-80"
            >
              {t.nav.allDestinations} →
            </Link>
          </div>
        </div>
      </section>

      <NewsletterBand />

      {/* 6. Closing CTA */}
      <section className="relative overflow-hidden bg-primary">
        <div
          className="media-grade absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url(${imageUrl(CLOSING_PHOTO, { width: 2000 })})`,
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
