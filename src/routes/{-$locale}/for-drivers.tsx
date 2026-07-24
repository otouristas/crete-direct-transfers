import { createFileRoute, Link } from "@tanstack/react-router";
import { getDict, useT, type Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { ContactForm } from "@/components/contact-form";
import { ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/{-$locale}/for-drivers")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/for-drivers",
      title: t.forDrivers.metaTitle,
      description: t.forDrivers.metaDescription,
    });
  },
  component: function ForDriversPage() {
    const t = useT();
    return (
      <>
        <section className="border-b border-border bg-muted">
          <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
            <div className="text-xs uppercase tracking-[0.2em] text-accent">{t.forDrivers.eyebrow}</div>
            <h1 className="mt-3 text-4xl md:text-6xl font-display text-primary">{t.forDrivers.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">{t.forDrivers.subtitle}</p>
            <Link
              to="/{-$locale}/driver/apply"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
            >
              {t.forDrivers.applyCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-6 py-16 grid gap-12 lg:grid-cols-2 items-start">
          <div>
            <h2 className="font-display text-2xl text-primary">{t.forDrivers.requirementsTitle}</h2>
            <ul className="mt-6 space-y-3 text-sm">
              {t.forDrivers.requirements.map((x) => (
                <li key={x} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" /> {x}
                </li>
              ))}
            </ul>
            <h2 className="font-display text-2xl text-primary mt-10">{t.forDrivers.perksTitle}</h2>
            <ul className="mt-6 space-y-3 text-sm">
              {t.forDrivers.perks.map((x) => (
                <li key={x} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" /> {x}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl text-primary mb-2">{t.forDrivers.formTitle}</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              {t.forDrivers.applyIntroBefore}{" "}
              <Link
                to="/{-$locale}/driver/apply"
                className="font-medium text-accent-deep hover:underline"
              >
                {t.forDrivers.applyIntroLink}
              </Link>{" "}
              {t.forDrivers.applyIntroAfter}
            </p>
            <ContactForm
              topic="driver"
              submitLabel={t.forDrivers.submitLabel}
              placeholder={t.forDrivers.placeholder}
            />
          </div>
        </section>
      </>
    );
  },
});
