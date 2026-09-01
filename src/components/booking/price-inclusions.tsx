import { CalendarX2, HandHeart, PlaneTakeoff, ShieldCheck, Timer } from "lucide-react";
import { getDict, type Locale } from "@/i18n";

export function PriceInclusions({ locale, className }: { locale: Locale; className?: string }) {
  const t = getDict(locale);
  const items = [
    { icon: HandHeart, label: t.bookPage.inclMeet },
    { icon: Timer, label: t.bookPage.inclWait },
    { icon: PlaneTakeoff, label: t.bookPage.inclTrack },
    { icon: CalendarX2, label: t.bookPage.inclCancel },
  ];

  return (
    <section className={`rounded-2xl border border-border bg-card p-6 ${className ?? ""}`}>
      <h3 className="font-display text-lg text-primary">{t.bookPage.inclusionsTitle}</h3>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.label} className="flex min-w-0 items-start gap-2.5 text-sm">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span className="text-muted-foreground">{item.label}</span>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 flex items-start gap-2 border-t border-border pt-4 text-sm font-medium text-primary">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        {t.bookPage.noHiddenFees}
      </p>
    </section>
  );
}
