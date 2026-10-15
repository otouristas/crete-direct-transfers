import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { getDict } from "@/i18n";
import { useAuth } from "@/hooks/use-auth";
import { driverJobsQuery } from "@/queries/driver";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatEur } from "@/lib/pricing";
import { startDriverConnectOnboarding, syncConnectOnboarding } from "@/functions/stripe";
import { PLATFORM_FEE_PERCENT, splitFareCents } from "@/lib/stripe-fees";

export const Route = createFileRoute("/{-$locale}/driver/earnings")({
  validateSearch: (s: Record<string, unknown>) => ({
    connect: typeof s.connect === "string" ? s.connect : undefined,
  }),
  component: EarningsPage,
});

function EarningsPage() {
  const { locale } = Route.useRouteContext();
  const search = useSearch({ from: "/{-$locale}/driver/earnings" });
  const t = getDict(locale);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [busyConnect, setBusyConnect] = useState(false);

  const jobs = useQuery({
    ...driverJobsQuery(user?.id ?? ""),
    enabled: !!user,
  });

  const profile = useQuery({
    queryKey: ["driver-stripe", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("driver_profiles")
        .select("stripe_account_id, stripe_onboarding_complete, partner_id")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!user?.id || (search.connect !== "return" && search.connect !== "refresh")) return;
    void syncConnectOnboarding({ data: { kind: "driver", id: user.id } })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["driver-stripe", user.id] });
        if (search.connect === "return") toast.success(t.driver.connectSynced);
      })
      .catch(() => toast.error(t.driver.connectFailed));
  }, [search.connect, user?.id, queryClient, t.driver.connectFailed, t.driver.connectSynced]);

  const connect = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("not signed in");
      setBusyConnect(true);
      const res = await startDriverConnectOnboarding({
        data: {
          driverId: user.id,
          email: user.email,
          market: "greece",
          locale,
        },
      });
      if (res.skipped || !res.url) throw new Error("Stripe not configured");
      window.location.href = res.url;
    },
    onError: () => {
      setBusyConnect(false);
      toast.error(t.driver.connectFailed);
    },
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
  const netOf = (b: (typeof completed)[number]) =>
    b.carrier_payout_cents ?? splitFareCents(b.price_cents).carrierPayoutCents;

  const totalCents = completed.reduce((sum, b) => sum + netOf(b), 0);
  const thisMonthKey = new Date().toISOString().slice(0, 7);
  const monthCents = completed
    .filter((b) => b.updated_at?.slice(0, 7) === thisMonthKey)
    .reduce((sum, b) => sum + netOf(b), 0);

  const dateLocale = locale === "en" ? "en-GB" : locale;
  const byMonth = new Map<string, number>();
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    byMonth.set(d.toISOString().slice(0, 7), 0);
  }
  for (const b of completed) {
    const key = (b.updated_at ?? b.pickup_at).slice(0, 7);
    if (byMonth.has(key)) byMonth.set(key, (byMonth.get(key) ?? 0) + netOf(b));
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

  const onboarded = Boolean(profile.data?.stripe_onboarding_complete);

  return (
    <div className="space-y-6">
      {!onboarded ? (
        <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6">
          <h3 className="font-display text-lg text-primary">{t.driver.connectTitle}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t.driver.connectBody}</p>
          <button
            type="button"
            disabled={busyConnect || connect.isPending}
            onClick={() => connect.mutate()}
            className="mt-4 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {busyConnect || connect.isPending ? t.driver.connectBusy : t.driver.connectCta}
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card px-6 py-4 text-sm text-muted-foreground">
          {t.driver.connectReady}
        </div>
      )}

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
        <p className="mt-4 text-xs text-muted-foreground">
          {t.driver.payoutNote.replace("{fee}", String(PLATFORM_FEE_PERCENT))}
        </p>
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
