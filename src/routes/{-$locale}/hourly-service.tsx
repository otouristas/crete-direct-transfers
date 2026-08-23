import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { BookingWidget } from "@/components/booking-widget";
import { CtaBand } from "@/components/sections/cta-band";
import { FaqAccordion } from "@/components/faq-accordion";
import { PageHero } from "@/components/sections/page-hero";
import { Reveal } from "@/components/reveal";
import { getDict, useT, type Locale } from "@/i18n";
import { buildCanonicalUrl, buildHead } from "@/lib/seo";
import { ORGANIZATION_ID } from "@/lib/structured-data";

export const Route = createFileRoute("/{-$locale}/hourly-service")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    const p = t.hourlyPage;
    const canonical = buildCanonicalUrl(locale, "/hourly-service");
    return buildHead({
      locale,
      path: "/hourly-service",
      title: p.metaTitle,
      description: p.metaDescription,
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Service",
            "@id": `${canonical}#service`,
            name: p.title,
            serviceType: p.eyebrow,
            description: p.metaDescription,
            provider: { "@id": ORGANIZATION_ID },
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
  component: function HourlyServicePage() {
    const t = useT();
    const p = t.hourlyPage;

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
              <BookingWidget variant="hbar" defaultService="hourly" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
          <Reveal>
            <h2 className="text-2xl font-display text-primary sm:text-3xl">{p.useCasesTitle}</h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {p.useCases.map((useCase) => (
              <div key={useCase.title} className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-display text-lg text-primary">{useCase.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{useCase.body}</p>
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
              <h2 className="text-2xl font-display text-primary sm:text-3xl">{p.howTitle}</h2>
              <ol className="mt-6 space-y-6">
                {p.howSteps.map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="mt-0.5 font-mono text-xs tabular-nums text-accent-deep">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-lg text-primary">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
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
