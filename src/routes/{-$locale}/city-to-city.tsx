import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { BookingWidget } from "@/components/booking-widget";
import { CtaBand } from "@/components/sections/cta-band";
import { FaqAccordion } from "@/components/faq-accordion";
import { PageHero } from "@/components/sections/page-hero";
import { Reveal } from "@/components/reveal";
import { getDict, useLocale, useT, type Locale } from "@/i18n";
import { getLocalizedVehicles } from "@/i18n/content";
import { buildHead } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

/** Intercity rides default to Standard Class and above for the extra room. */
const INTERCITY_CLASSES = new Set(["comfort", "luxury", "suv", "minivan", "van-first"]);

export const Route = createFileRoute("/{-$locale}/city-to-city")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    const p = t.cityToCityPage;
    return buildHead({
      locale,
      path: "/city-to-city",
      title: p.metaTitle,
      description: p.metaDescription,
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Service",
            "@id": `${SITE_URL}/city-to-city#service`,
            name: p.title,
            serviceType: p.eyebrow,
            description: p.metaDescription,
            provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
          },
          {
            "@type": "FAQPage",
            mainEntity: p.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ],
      },
    });
  },
  component: function CityToCityPage() {
    const t = useT();
    const locale = useLocale();
    const p = t.cityToCityPage;
    const vehicles = getLocalizedVehicles(locale).filter((v) => INTERCITY_CLASSES.has(v.id));

    return (
      <>
        <PageHero
          eyebrow={p.eyebrow}
          title={p.title}
          subtitle={p.subtitle}
          crumbs={[{ label: t.nav.services, to: "/{-$locale}/services" }, { label: p.eyebrow }]}
        />

        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
            <h2 className="text-2xl font-display text-primary">{p.bookTitle}</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">{p.bookSubtitle}</p>
            <div className="relative z-20 mt-8">
              <BookingWidget variant="hbar" defaultClass="comfort" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
          <Reveal>
            <h2 className="text-2xl font-display text-primary sm:text-3xl">{p.whyTitle}</h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {p.why.map((reason) => (
              <div key={reason.title} className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-display text-lg text-primary">{reason.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{reason.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-muted/50">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 md:py-20 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-display text-primary sm:text-3xl">{p.includedTitle}</h2>
              <ul className="mt-6 space-y-3 text-sm">
                {p.included.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-display text-primary sm:text-3xl">{t.nav.fleet}</h2>
              <ul className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
                {vehicles.map((v) => (
                  <li key={v.id}>
                    <Link
                      to="/{-$locale}/fleet/$class"
                      params={{ class: v.id }}
                      className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-muted/40"
                    >
                      <span className="font-medium text-foreground">{v.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {v.capacity} · {v.bags}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-14 md:py-20">
          <FaqAccordion groups={[{ title: p.faqTitle, items: p.faqs }]} />
        </section>

        <CtaBand title={p.ctaTitle} subtitle={p.ctaSubtitle} />
      </>
    );
  },
});
