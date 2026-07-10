import { Star, ShieldCheck, CalendarX2, PlaneLanding, Wallet } from "lucide-react";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";

export function TrustPills({ dark = false, className }: { dark?: boolean; className?: string }) {
  const t = useT();
  const pills = [
    { icon: Star, label: t.trust.rating, star: true },
    { icon: ShieldCheck, label: t.trust.licensed },
    { icon: CalendarX2, label: t.trust.freeCancel },
    { icon: PlaneLanding, label: t.trust.flightTracked },
    { icon: Wallet, label: t.trust.payOnArrival },
  ];
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {pills.map(({ icon: Icon, label, star }) => (
        <span
          key={label}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium",
            dark
              ? "bg-primary-foreground/10 text-primary-foreground ring-1 ring-primary-foreground/15"
              : "bg-card text-foreground ring-1 ring-border",
          )}
        >
          <Icon
            className={cn("h-3.5 w-3.5", star ? "text-highlight fill-highlight" : "text-accent")}
          />
          {label}
        </span>
      ))}
    </div>
  );
}
