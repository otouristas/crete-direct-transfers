import { createFileRoute } from "@tanstack/react-router";
import { getDict, useT, type Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { getLocalizedFaqs } from "@/i18n/content";
import { FaqAccordion } from "@/components/faq-accordion";

export const Route = createFileRoute("/{-$locale}/faq")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    const groups = getLocalizedFaqs(locale);
    return buildHead({
      locale,
      path: "/faq",
      title: t.faqPage.metaTitle,
      description: t.faqPage.metaDescription,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: groups.flatMap((group) =>
          group.items.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a,
            },
          })),
        ),
      },
    });
  },
  component: function FaqPage() {
    const t = useT();
    const locale = (Route.useParams().locale ?? "en") as Locale;
    return (
      <>
        <section className="border-b border-border bg-muted">
          <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
            <div className="text-xs uppercase tracking-[0.2em] text-accent">
              {t.faqPage.eyebrow}
            </div>
            <h1 className="mt-3 text-4xl md:text-6xl font-display text-primary">
              {t.faqPage.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">{t.faqPage.subtitle}</p>
          </div>
        </section>
        <section className="mx-auto max-w-4xl px-6 py-16">
          <FaqAccordion groups={getLocalizedFaqs(locale)} />
        </section>
      </>
    );
  },
});
