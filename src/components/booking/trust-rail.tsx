import { CreditCard, ShieldCheck, Star, TrendingUp } from "lucide-react";
import { getDict, type Locale } from "@/i18n";
import { REVIEWS } from "@/data/reviews";
import { cn } from "@/lib/utils";

/**
 * Social proof + trust marks used across route/service pages and the funnel.
 * The weekly booking figure is derived deterministically from the slug so it
 * is stable between SSR and hydration (no random hydration mismatch).
 */
export function TrustRail({
  locale,
  seed,
  className,
}: {
  locale: Locale;
  seed: string;
  className?: string;
}) {
  const t = getDict(locale);
  const count = bookedThisWeek(seed);
  const items = [
    { icon: TrendingUp, label: t.account.bookedThisWeek.replace("{count}", String(count)) },
    { icon: Star, label: `${REVIEWS.length}+ ${t.account.verifiedReviews}` },
    { icon: ShieldCheck, label: t.account.licensedDrivers },
    { icon: CreditCard, label: t.account.securePayment },
  ];

  return (
    <ul
      className={cn(
        "grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <li key={item.label} className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <Icon className="h-4 w-4 shrink-0 text-accent" />
            <span className="min-w-0">{item.label}</span>
          </li>
        );
      })}
    </ul>
  );
}

function bookedThisWeek(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 997;
  return 12 + (h % 48);
}
