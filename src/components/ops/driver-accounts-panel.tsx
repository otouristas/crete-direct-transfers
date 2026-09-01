import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getDict, type Locale } from "@/i18n";
import { Skeleton } from "@/components/ui/skeleton";
import { formatEur } from "@/lib/pricing";
import {
  adjustDriverAccountAdmin,
  opsDriverAccountsQuery,
  opsPenaltiesQuery,
  setDriverSuspensionAdmin,
  waivePenaltyAdmin,
} from "@/queries/driver-account";

const SUSPEND_DAYS = 14;

/** Admin panel: driver balances, reliability, penalties and suspensions. */
export function DriverAccountsPanel({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const queryClient = useQueryClient();
  const accounts = useQuery(opsDriverAccountsQuery);
  const penalties = useQuery(opsPenaltiesQuery);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["ops-driver-accounts"] });
    queryClient.invalidateQueries({ queryKey: ["ops-penalties"] });
  };

  const waive = useMutation({
    mutationFn: waivePenaltyAdmin,
    onSuccess: () => {
      refresh();
      toast.success(t.driverAccount.opsWaived);
    },
    onError: () => toast.error(t.driverAccount.opsFailed),
  });

  const adjust = useMutation({
    mutationFn: adjustDriverAccountAdmin,
    onSuccess: () => {
      refresh();
      toast.success(t.driverAccount.opsAdjusted);
    },
    onError: () => toast.error(t.driverAccount.opsFailed),
  });

  const suspend = useMutation({
    mutationFn: setDriverSuspensionAdmin,
    onSuccess: () => {
      refresh();
      toast.success(t.driverAccount.opsSuspensionUpdated);
    },
    onError: () => toast.error(t.driverAccount.opsFailed),
  });

  const onAdjust = (driverId: string) => {
    const amount = window.prompt(t.driverAccount.opsAdjustAmountPrompt);
    if (!amount) return;
    const euros = Number(amount.replace(",", "."));
    if (!Number.isFinite(euros) || euros === 0) return;
    const reason = window.prompt(t.driverAccount.opsAdjustReasonPrompt);
    if (!reason) return;
    adjust.mutate({ driverId, amountCents: Math.round(euros * 100), reason });
  };

  const onWaive = (entryId: string) => {
    const reason = window.prompt(t.driverAccount.opsWaivePrompt);
    if (!reason) return;
    waive.mutate({ entryId, reason });
  };

  const onSuspend = (driverId: string, suspended: boolean) => {
    const until = suspended
      ? null
      : new Date(Date.now() + SUSPEND_DAYS * 86_400_000).toISOString();
    suspend.mutate({ driverId, until });
  };

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-display text-xl text-primary">{t.driverAccount.opsTitle}</h2>
        {accounts.isPending ? (
          <Skeleton className="mt-4 h-40 w-full rounded-2xl" />
        ) : (accounts.data ?? []).length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">{t.driverAccount.opsEmpty}</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="p-3">{t.driverAccount.opsDriver}</th>
                  <th className="p-3 text-right">{t.driverAccount.availableBalance}</th>
                  <th className="p-3 text-right">{t.driverAccount.negativeBalance}</th>
                  <th className="p-3 text-right">{t.driverAccount.opsScore}</th>
                  <th className="p-3 text-right" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {(accounts.data ?? []).map((row) => {
                  const suspended =
                    !!row.suspended_until && new Date(row.suspended_until).getTime() > Date.now();
                  return (
                    <tr key={row.driver_id ?? ""}>
                      <td className="p-3">
                        {row.full_name ?? row.driver_id?.slice(0, 8)}
                        {suspended && (
                          <span className="ml-2 rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                            {t.driverAccount.suspendedUntil}{" "}
                            {new Date(row.suspended_until!).toLocaleDateString()}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        {formatEur((row.available_cents ?? 0) / 100)}
                      </td>
                      <td className="p-3 text-right text-destructive">
                        {(row.negative_cents ?? 0) > 0
                          ? `−${formatEur((row.negative_cents ?? 0) / 100)}`
                          : "—"}
                      </td>
                      <td className="p-3 text-right">{row.score ?? 100}</td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-3 text-xs">
                          <button
                            type="button"
                            className="text-accent-deep underline"
                            onClick={() => onAdjust(row.driver_id ?? "")}
                          >
                            {t.driverAccount.opsAdjust}
                          </button>
                          <button
                            type="button"
                            className="text-destructive underline"
                            onClick={() => onSuspend(row.driver_id ?? "", suspended)}
                          >
                            {suspended
                              ? t.driverAccount.opsReinstate
                              : t.driverAccount.opsSuspend}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="font-display text-xl text-primary">
          {t.driverAccount.opsPenaltiesTitle}
        </h2>
        {penalties.isPending ? (
          <Skeleton className="mt-4 h-24 w-full rounded-2xl" />
        ) : (penalties.data ?? []).length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">{t.driverAccount.opsNoPenalties}</p>
        ) : (
          <ul className="mt-4 divide-y divide-border rounded-2xl border border-border">
            {(penalties.data ?? []).map((entry) => (
              <li key={entry.id} className="flex flex-wrap items-center gap-3 p-3 text-sm">
                <span className="text-muted-foreground">
                  {new Date(entry.created_at).toLocaleDateString()}
                </span>
                <span className="font-medium text-destructive">
                  −{formatEur(Math.abs(entry.amount_cents) / 100)}
                </span>
                <span className="flex-1 text-muted-foreground">{entry.reason ?? "—"}</span>
                {entry.status !== "voided" && (
                  <button
                    type="button"
                    className="text-xs text-accent-deep underline"
                    onClick={() => onWaive(entry.id)}
                  >
                    {t.driverAccount.opsWaive}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
