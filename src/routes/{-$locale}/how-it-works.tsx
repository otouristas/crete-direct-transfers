import { createFileRoute, Link } from "@tanstack/react-router";
import { getDict, useT, type Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { CtaBand } from "@/components/sections/cta-band";
import { TrustPills } from "@/components/sections/trust-pills";

export const Route = createFileRoute("/{-$locale}/how-it-works")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/how-it-works",
      title: t.howItWorksPage.metaTitle,
      description: t.howItWorksPage.metaDescription,
    });
  },
  component: function HowItWorksPage() {
    const t = useT();
    return (
      <>
        <section className="border-b border-border bg-muted">
          <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
            <div className="text-xs uppercase tracking-[0.2em] text-accent">{t.howItWorksPage.eyebrow}</div>
            <h1 className="mt-3 text-4xl md:text-6xl font-display text-primary">
              {t.howItWorksPage.title}
            </h1>
          </div>
        </section>
        <section className="mx-auto max-w-4xl px-6 py-16 space-y-12">
          {t.howItWorksPage.steps.map((step) => (
            <div key={step.n} className="grid gap-6 md:grid-cols-[100px_1fr] items-start">
              <div className="font-display text-6xl text-accent">{step.n}</div>
              <div>
                <h2 className="font-display text-2xl text-primary">{step.title}</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
          <div className="pt-6">
            <TrustPills />
          </div>
          <div className="pt-2">
            <Link
              to="/{-$locale}/book"
              className="inline-flex rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:opacity-90"
            >
              {t.howItWorksPage.cta}
            </Link>
          </div>
        </section>
        <CtaBand />
      </>
    );
  },
});
