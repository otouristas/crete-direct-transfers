import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "@/components/contact-form";
import { Check } from "lucide-react";
import { getDict, useT, type Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/{-$locale}/for-hotels")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/for-hotels",
      title: t.forHotels.metaTitle,
      description: t.forHotels.metaDescription,
    });
  },
  component: function ForHotelsPage() {
    const t = useT();
    return (
      <>
        <section className="border-b border-border bg-muted">
          <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
            <div className="text-xs uppercase tracking-[0.2em] text-accent">{t.forHotels.eyebrow}</div>
            <h1 className="mt-3 text-4xl md:text-6xl font-display text-primary">{t.forHotels.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">{t.forHotels.subtitle}</p>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-6 py-16 grid gap-12 lg:grid-cols-2 items-start">
          <div>
            <h2 className="font-display text-2xl text-primary">{t.forHotels.benefitsTitle}</h2>
            <ul className="mt-6 space-y-3 text-sm">
              {t.forHotels.benefits.map((x) => (
                <li key={x} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" /> {x}
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-xl border border-border bg-card p-4 text-sm">
              <p className="font-semibold text-foreground">{t.forHotels.referralsTitle}</p>
              <p className="mt-2 text-muted-foreground">{t.forHotels.referralsBody}</p>
            </div>
            <p className="mt-8 text-muted-foreground text-sm">{t.forHotels.partnersNote}</p>
          </div>
          <div>
            <h2 className="font-display text-2xl text-primary mb-6">{t.forHotels.formTitle}</h2>
            <ContactForm
              topic="hotel"
              showCompany
              submitLabel={t.forHotels.submitLabel}
              placeholder={t.forHotels.placeholder}
            />
          </div>
        </section>
      </>
    );
  },
});
