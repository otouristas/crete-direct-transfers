import { BadgeEuro, PlaneLanding, ShieldCheck, CalendarX2, Wallet, UserCheck } from "lucide-react";
import { useT } from "@/i18n";

export function AdvantageGrid() {
  const t = useT();
  const items = [
    { icon: BadgeEuro, title: t.advantages.fixedTitle, body: t.advantages.fixedBody },
    { icon: PlaneLanding, title: t.advantages.flightTitle, body: t.advantages.flightBody },
    { icon: ShieldCheck, title: t.advantages.licensedTitle, body: t.advantages.licensedBody },
    { icon: CalendarX2, title: t.advantages.cancelTitle, body: t.advantages.cancelBody },
    { icon: Wallet, title: t.advantages.payTitle, body: t.advantages.payBody },
    { icon: UserCheck, title: t.advantages.meetTitle, body: t.advantages.meetBody },
  ];
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ icon: Icon, title, body }) => (
        <div
          key={title}
          className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
        >
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15">
            <Icon className="h-5 w-5 text-accent-deep" />
          </span>
          <h3 className="mt-4 text-lg font-display text-primary">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
        </div>
      ))}
    </div>
  );
}
