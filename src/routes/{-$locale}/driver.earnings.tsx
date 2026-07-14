import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { getDict } from "@/i18n";
import { useAuth } from "@/hooks/use-auth";
import { driverJobsQuery } from "@/queries/driver";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatEur } from "@/lib/pricing";

export const Route = createFileRoute("/{-$locale}/driver/earnings")({
  component: EarningsPage,
});

function EarningsPage() {
  const { locale } = Route.useRouteContext();
  const t = getDict(locale);
  const { user } = useAuth();

  const jobs = useQuery({
    ...driverJobsQuery(user?.id ?? ""),
    enabled: !!user,
  });

  if (jobs.isPending) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    );
  }

  const completed = (jobs.data ?? []).filter((b) => b.status === "completed");
  const totalCents = completed.reduce((sum, b) => sum + b.price_cents, 0);
  const thisMonthKey = new Date().toISOString().slice(0, 7);
  // updated_at is when the job was marked completed — good enough for monthly
  // grouping at this volume.
  const monthCents = completed
    .filter((b) => b.updated_at?.slice(0, 7) === thisMonthKey)
    .reduce((sum, b) => sum + b.price_cents, 0);

  const dateLocale = locale === "en" ? "en-GB" : locale;
  const byMonth = new Map<string, number>();
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    byMonth.set(d.toISOString().slice(0, 7), 0);
  }
  for (const b of completed) {
    const key = (b.updated_at ?? b.pickup_at).slice(0, 7);
    if (byMonth.has(key)) byMonth.set(key, (byMonth.get(key) ?? 0) + b.price_cents);
  }
  const chartData = [...byMonth.entries()].map(([key, cents]) => ({
    month: new Date(`${key}-01T00:00:00`).toLocaleDateString(dateLocale, {
      month: "short",
    }),
    earnings: cents / 100,
  }));

  const chartConfig = {
    earnings: { label: t.driver.tabEarnings, color: "var(--accent)" },
  } satisfies ChartConfig;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label={t.driver.earningsTotal} value={formatEur(totalCents / 100)} />
        <StatCard label={t.driver.earningsJobs} value={String(completed.length)} />
        <StatCard label={t.driver.earningsMonth} value={formatEur(monthCents / 100)} />
      </div>

      <div className="rounded-2xl border border-border bg-card p-8">
        <h3 className="font-display text-lg text-primary">{t.driver.earningsChartTitle}</h3>
        {completed.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">{t.driver.earningsEmpty}</p>
        ) : (
          <ChartContainer config={chartConfig} className="mt-6 h-64 w-full">
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={48} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="earnings" fill="var(--color-earnings)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
        <p className="mt-4 text-xs text-muted-foreground">{t.driver.payoutNote}</p>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-3xl text-primary">{value}</div>
    </div>
  );
}
