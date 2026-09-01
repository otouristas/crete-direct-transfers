import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { getDict } from "@/i18n";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatEur } from "@/lib/pricing";
import { EarningsSparkline } from "@/components/driver/earnings-sparkline";
import {
  myEarningsQuery,
  myPayoutsQuery,
  nextPayoutDate,
  setMyPayoutSchedule,
  summariseEarnings,
  type EarningWithBooking,
  type PayoutSchedule,
} from "@/queries/earnings";
import {
  isSuspended,
  myAccountBalanceQuery,
  myAccountLedgerQuery,
  myReliabilityQuery,
  type AccountEntry,
} from "@/queries/driver-account";
import { getConnectStatus, startDriverOnboarding, getDriverStripeDashboardLink } from "@/functions/connect";

export const Route = createFileRoute("/{-$locale}/driver/earnings")({
  component: EarningsPage,
});

function EarningsPage() {
  const { locale } = Route.useRouteContext();
  const t = getDict(locale);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const dateLocale = locale === "en" ? "en-GB" : locale;

  const fetchStatus = useServerFn(getConnectStatus);
  const beginOnboarding = useServerFn(startDriverOnboarding);
  const openDashboard = useServerFn(getDriverStripeDashboardLink);

  const earnings = useQuery({ ...myEarningsQuery(user?.id ?? ""), enabled: !!user });
  const payouts = useQuery({ ...myPayoutsQuery(user?.id ?? ""), enabled: !!user });
  const balance = useQuery({ ...myAccountBalanceQuery(user?.id ?? ""), enabled: !!user });
  const ledger = useQuery({ ...myAccountLedgerQuery(user?.id ?? ""), enabled: !!user });
  const reliability = useQuery({ ...myReliabilityQuery(user?.id ?? ""), enabled: !!user });
  const connect = useQuery({
    queryKey: ["connect-status", user?.id],
    queryFn: () => fetchStatus({ data: undefined }),
    enabled: !!user,
    retry: false,
  });

  const onboard = useMutation({
    mutationFn: () => beginOnboarding({ data: { locale } }),
    onSuccess: (result) => {
      window.location.href = result.url;
    },
    onError: () => toast.error(t.payouts.unavailable),
  });

  const dashboard = useMutation({
    mutationFn: () => openDashboard({ data: undefined }),
    onSuccess: (result) => window.open(result.url, "_blank", "noopener"),
    onError: () => toast.error(t.payouts.unavailable),
  });

  const schedule = useMutation({
    mutationFn: setMyPayoutSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connect-status", user?.id] });
      toast.success(t.payouts.scheduleSaved);
    },
    onError: () => toast.error(t.payouts.instantLocked),
  });

  if (earnings.isPending || connect.isPending) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    );
  }

  const rows = earnings.data ?? [];
  const totals = summariseEarnings(rows);
  const status = connect.data;
  const activeSchedule = (status?.payoutSchedule ?? "weekly") as PayoutSchedule;
  const next = nextPayoutDate(activeSchedule);

  const statusLabel = !status?.configured
    ? t.payouts.statusNotStarted
    : status.payoutsEnabled
      ? t.payouts.statusReady
      : t.payouts.statusInReview;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl text-primary">{t.payouts.title}</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t.payouts.subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t.payouts.pending} value={formatEur(totals.pendingCents / 100)} />
        <StatCard label={t.payouts.available} value={formatEur(totals.availableCents / 100)} />
        <StatCard label={t.payouts.total} value={formatEur(totals.totalCents / 100)} />
        <StatCard
          label={t.payouts.nextPayout}
          value={next ? next.toLocaleDateString(dateLocale) : t.payouts.notScheduled}
        />
      </div>

      <EarningsSparkline rows={rows} locale={locale} />

      {/* Account balance + reliability */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <h3 className="font-display text-lg text-primary">{t.driverAccount.balanceTitle}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <MiniStat
              label={t.driverAccount.availableBalance}
              value={formatEur((balance.data?.available_cents ?? 0) / 100)}
            />
            <MiniStat
              label={t.driverAccount.negativeBalance}
              value={`−${formatEur((balance.data?.negative_cents ?? 0) / 100)}`}
              tone={(balance.data?.negative_cents ?? 0) > 0 ? "negative" : "muted"}
            />
            <MiniStat
              label={t.driverAccount.lifetimePenalties}
              value={`−${formatEur((balance.data?.penalties_cents ?? 0) / 100)}`}
            />
          </div>
          {(balance.data?.negative_cents ?? 0) > 0 && (
            <p className="mt-4 text-xs text-muted-foreground">{t.driverAccount.negativeNote}</p>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-lg text-primary">{t.driverAccount.reliabilityTitle}</h3>
          <div className="mt-3 font-display text-4xl text-primary">
            {reliability.data?.score ?? 100}
            <span className="text-base text-muted-foreground">/100</span>
          </div>
          <dl className="mt-4 space-y-1 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <dt>{t.driverAccount.reliabilityCancellations}</dt>
              <dd>{reliability.data?.cancellations_90d ?? 0}</dd>
            </div>
            <div className="flex justify-between">
              <dt>{t.driverAccount.reliabilityNoShows}</dt>
              <dd>{reliability.data?.no_shows_90d ?? 0}</dd>
            </div>
            <div className="flex justify-between">
              <dt>{t.driverAccount.reliabilityCompleted}</dt>
              <dd>{reliability.data?.completed_90d ?? 0}</dd>
            </div>
          </dl>
          {isSuspended(reliability.data ?? null) && (
            <p className="mt-4 rounded-xl bg-destructive/10 p-3 text-xs text-destructive">
              {t.driverAccount.suspendedUntil}{" "}
              {new Date(reliability.data!.suspended_until!).toLocaleDateString(dateLocale)} ·{" "}
              {t.driverAccount.suspendedNote}
            </p>
          )}
          <p className="mt-4 text-xs text-muted-foreground">{t.driverAccount.reliabilityNote}</p>
        </div>
      </div>

      {/* Cancellation policy */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display text-lg text-primary">{t.driverAccount.policyTitle}</h3>
        <ul className="mt-3 grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
          <li>{t.driverAccount.policy72}</li>
          <li>{t.driverAccount.policy48}</li>
          <li>{t.driverAccount.policy24}</li>
          <li>{t.driverAccount.policyLate}</li>
          <li>{t.driverAccount.policyNoShow}</li>
        </ul>
      </section>

      {/* Connect onboarding */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-lg text-primary">{t.payouts.setupTitle}</h3>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">{t.payouts.setupBody}</p>
            <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
              {statusLabel}
            </p>
          </div>
          <div className="flex gap-3">
            {status?.payoutsEnabled ? (
              <Button
                variant="outline"
                onClick={() => dashboard.mutate()}
                disabled={dashboard.isPending}
              >
                {t.payouts.stripeDashboard}
              </Button>
            ) : (
              <Button onClick={() => onboard.mutate()} disabled={onboard.isPending}>
                {status?.configured ? t.payouts.setupContinue : t.payouts.setupCta}
              </Button>
            )}
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-6">
          <h4 className="text-sm font-medium text-primary">{t.payouts.scheduleTitle}</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["weekly", "monthly", "instant"] as const).map((option) => {
              const locked = option === "instant" && !status?.instantEligible;
              return (
                <button
                  key={option}
                  type="button"
                  disabled={locked || !status?.configured || schedule.isPending}
                  onClick={() => schedule.mutate(option)}
                  className={`rounded-full border px-4 py-2 text-sm transition disabled:opacity-50 ${
                    activeSchedule === option
                      ? "border-accent bg-accent/10 text-accent-deep"
                      : "border-border text-muted-foreground hover:border-accent"
                  }`}
                >
                  {option === "weekly"
                    ? t.payouts.weekly
                    : option === "monthly"
                      ? t.payouts.monthly
                      : t.payouts.instant}
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">{t.payouts.holdingNote}</p>
        </div>
      </section>

      {/* Per-booking ledger */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display text-lg text-primary">{t.payouts.bookingsTitle}</h3>
        {rows.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">{t.payouts.bookingsEmpty}</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="pb-3">{t.payouts.colDate}</th>
                  <th className="pb-3">{t.payouts.colRoute}</th>
                  <th className="pb-3 text-right">{t.payouts.colFare}</th>
                  <th className="pb-3 text-right">{t.payouts.colCommission}</th>
                  <th className="pb-3 text-right">{t.payouts.colNet}</th>
                  <th className="pb-3 text-right">{t.payouts.colStatus}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((row: EarningWithBooking) => (
                  <tr key={row.id}>
                    <td className="py-3">
                      {new Date(row.booking?.pickup_at ?? row.created_at).toLocaleDateString(
                        dateLocale,
                      )}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {row.booking?.route_slug ?? row.booking_id.slice(0, 8)}
                    </td>
                    <td className="py-3 text-right">{formatEur(row.gross_cents / 100)}</td>
                    <td className="py-3 text-right text-muted-foreground">
                      −{formatEur(row.commission_cents / 100)}
                    </td>
                    <td className="py-3 text-right font-medium">
                      {formatEur(row.net_cents / 100)}
                    </td>
                    <td className="py-3 text-right">
                      <EarningStatus status={row.status} locale={locale} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Payout history */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display text-lg text-primary">{t.payouts.historyTitle}</h3>
        {(payouts.data ?? []).length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">{t.payouts.historyEmpty}</p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {(payouts.data ?? []).map((payout) => (
              <li key={payout.id} className="flex items-center justify-between py-3 text-sm">
                <span>{new Date(payout.created_at).toLocaleDateString(dateLocale)}</span>
                <span className="text-muted-foreground">
                  {payout.method === "instant" ? t.payouts.methodInstant : t.payouts.methodStandard}
                </span>
                <span className="font-medium">{formatEur(payout.amount_cents / 100)}</span>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  {payout.status === "paid" ? t.payouts.sPaid : payout.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Account ledger */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display text-lg text-primary">{t.driverAccount.ledgerTitle}</h3>
        {(ledger.data ?? []).length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">{t.driverAccount.ledgerEmpty}</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground">
                  <th className="pb-3">{t.driverAccount.colDate}</th>
                  <th className="pb-3">{t.driverAccount.colType}</th>
                  <th className="pb-3">{t.driverAccount.colDetails}</th>
                  <th className="pb-3 text-right">{t.driverAccount.colAmount}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(ledger.data ?? []).map((entry) => (
                  <tr key={entry.id}>
                    <td className="py-3">
                      {new Date(entry.created_at).toLocaleDateString(dateLocale)}
                    </td>
                    <td className="py-3">{entryTypeLabel(entry.entry_type, locale)}</td>
                    <td className="py-3 text-muted-foreground">{entry.reason ?? "—"}</td>
                    <td
                      className={`py-3 text-right font-medium ${
                        entry.amount_cents < 0 ? "text-destructive" : "text-primary"
                      }`}
                    >
                      {entry.amount_cents < 0 ? "−" : "+"}
                      {formatEur(Math.abs(entry.amount_cents) / 100)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function entryTypeLabel(type: AccountEntry["entry_type"], locale: Parameters<typeof getDict>[0]) {
  const t = getDict(locale);
  const map: Record<string, string> = {
    earning: t.driverAccount.typeEarning,
    commission: t.driverAccount.typeCommission,
    penalty: t.driverAccount.typePenalty,
    incentive: t.driverAccount.typeIncentive,
    payout: t.driverAccount.typePayout,
    adjustment: t.driverAccount.typeAdjustment,
  };
  return map[type] ?? type;
}

function MiniStat({
  label,
  value,
  tone = "muted",
}: {
  label: string;
  value: string;
  tone?: "muted" | "negative";
}) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div
        className={`mt-1 font-display text-2xl ${
          tone === "negative" ? "text-destructive" : "text-primary"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

export function EarningStatus({
  status,
  locale,
}: {
  status: string;
  locale: Parameters<typeof getDict>[0];
}) {
  const t = getDict(locale);
  const map: Record<string, { label: string; className: string }> = {
    pending: { label: t.payouts.sPending, className: "bg-muted text-muted-foreground" },
    held: { label: t.payouts.sHeld, className: "bg-muted text-muted-foreground" },
    available: { label: t.payouts.sAvailable, className: "bg-accent/15 text-accent-deep" },
    paid: { label: t.payouts.sPaid, className: "bg-primary/10 text-primary" },
    voided: { label: t.payouts.sVoided, className: "bg-destructive/10 text-destructive" },
    disputed: { label: t.payouts.sDisputed, className: "bg-destructive/10 text-destructive" },
  };
  const entry = map[status] ?? { label: status, className: "bg-muted text-muted-foreground" };
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs uppercase tracking-widest ${entry.className}`}
    >
      {entry.label}
    </span>
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
