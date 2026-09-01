import { useQuery } from "@tanstack/react-query";
import { CalendarClock, CalendarDays, Gauge, PiggyBank, Wallet } from "lucide-react";
import { getDict, type Locale } from "@/i18n";
import { useProfile } from "@/queries/profile";
import { driverJobsQuery } from "@/queries/driver";
import { myEarningsQuery, summariseEarnings } from "@/queries/earnings";
import { myReliabilityQuery } from "@/queries/driver-account";
import { formatEur } from "@/lib/pricing";
import { Skeleton } from "@/components/ui/skeleton";

const TERMINAL = new Set(["completed", "no_show", "cancelled"]);

export function DriverStatsBand({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const profile = useProfile();
  const driverId = profile.data?.id ?? "";

  const jobs = useQuery({ ...driverJobsQuery(driverId), enabled: !!driverId });
  const earnings = useQuery({ ...myEarningsQuery(driverId), enabled: !!driverId });
  const reliability = useQuery({ ...myReliabilityQuery(driverId), enabled: !!driverId });

  if (!driverId || jobs.isPending || earnings.isPending) {
    return <Skeleton className="h-24 w-full rounded-2xl" />;
  }

  const all = jobs.data ?? [];
  const now = new Date();
  const todayKey = now.toDateString();
  const todayCount = all.filter(
    (b) => new Date(b.pickup_at).toDateString() === todayKey && !TERMINAL.has(b.status),
  ).length;
  const upcomingCount = all.filter(
    (b) => new Date(b.pickup_at).getTime() > now.getTime() && !TERMINAL.has(b.status),
  ).length;

  const sums = summariseEarnings(earnings.data ?? []);
  const score = reliability.data?.score;

  const cards = [
    { icon: CalendarDays, label: t.driver.statsToday, value: String(todayCount) },
    { icon: CalendarClock, label: t.driver.statsUpcoming, value: String(upcomingCount) },
    { icon: PiggyBank, label: t.driver.statsPending, value: formatEur(sums.pendingCents / 100) },
    { icon: Wallet, label: t.driver.statsAvailable, value: formatEur(sums.availableCents / 100) },
    {
      icon: Gauge,
      label: t.driver.statsReliability,
      value: typeof score === "number" ? `${Math.round(score)}%` : "—",
    },
  ];

  return (
    <section aria-label={t.driver.statsOverview} className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.label}
            className="rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon className="h-3.5 w-3.5" />
              <span className="text-[11px] font-medium uppercase tracking-wide">{c.label}</span>
            </div>
            <p className="mt-2 font-display text-2xl text-primary">{c.value}</p>
          </div>
        );
      })}
    </section>
  );
}
