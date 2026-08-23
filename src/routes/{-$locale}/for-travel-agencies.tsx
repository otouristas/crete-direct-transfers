import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PartnerInquiryForm } from "@/components/partner-inquiry-form";
import { useLocale, type Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { TRAVEL_AGENCY_COPY } from "@/lib/travel-agency-copy";

export const Route = createFileRoute("/{-$locale}/for-travel-agencies")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const copy = TRAVEL_AGENCY_COPY[locale];
    return buildHead({
      locale,
      path: "/for-travel-agencies",
      title: copy.metaTitle,
      description: copy.metaDescription,
    });
  },
  component: function ForTravelAgenciesPage() {
    const copy = TRAVEL_AGENCY_COPY[useLocale()];
    return (
      <>
        <section className="border-b border-border bg-muted">
          <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
            <div className="text-xs uppercase tracking-[0.2em] text-accent">{copy.eyebrow}</div>
            <h1 className="mt-3 font-display text-4xl text-primary md:text-6xl">{copy.title}</h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{copy.subtitle}</p>
          </div>
        </section>
        <section className="mx-auto grid max-w-6xl items-start gap-12 px-6 py-16 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl text-primary">{copy.benefitsTitle}</h2>
            <ul className="mt-6 space-y-3 text-sm">
              {copy.benefits.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-xl border border-border bg-card p-4 text-sm">
              <p className="font-semibold text-foreground">{copy.noteTitle}</p>
              <p className="mt-2 text-muted-foreground">{copy.note}</p>
            </div>
          </div>
          <div>
            <h2 className="mb-6 font-display text-2xl text-primary">{copy.formTitle}</h2>
            <PartnerInquiryForm kind="travel_agency" />
          </div>
        </section>
      </>
    );
  },
});
