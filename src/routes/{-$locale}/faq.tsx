import { createFileRoute } from "@tanstack/react-router";
import { getDict, type Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { FAQ_GROUPS } from "@/data/faqs";
import { FaqAccordion } from "@/components/faq-accordion";

export const Route = createFileRoute("/{-$locale}/faq")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/faq",
      title: t.faqPage.metaTitle,
      description: t.faqPage.metaDescription,
    });
  },
  component: () => (
    <>
      <section className="border-b border-border bg-muted">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <div className="text-xs uppercase tracking-[0.2em] text-accent">FAQ</div>
          <h1 className="mt-3 text-4xl md:text-6xl font-display text-primary">Frequently asked.</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Everything travellers ask before booking a Crete transfer. Still stuck? Contact us.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-6 py-16">
        <FaqAccordion groups={FAQ_GROUPS} />
      </section>
    </>
  ),
});
