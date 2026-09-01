import { useMemo } from "react";
import { Download } from "lucide-react";
import { format, startOfWeek, subWeeks } from "date-fns";
import { dateFnsLocale } from "@/lib/date-locale";
import { getDict, type Locale } from "@/i18n";
import { formatEur } from "@/lib/pricing";
import type { DriverEarning } from "@/queries/earnings";

const WEEKS = 8;

function toCsv(rows: DriverEarning[]): string {
  const head = ["created_at", "booking_id", "status", "gross_eur", "commission_eur", "net_eur"];
  const body = rows.map((r) =>
    [
      r.created_at,
      r.booking_id ?? "",
      r.status,
      (r.gross_cents / 100).toFixed(2),
      (r.commission_cents / 100).toFixed(2),
      (r.net_cents / 100).toFixed(2),
    ].join(","),
  );
  return [head.join(","), ...body].join("\n");
}

export function EarningsSparkline({
  rows,
  locale,
}: {
  rows: DriverEarning[];
  locale: Locale;
}) {
  const t = getDict(locale);

  const buckets = useMemo(() => {
    const start = startOfWeek(subWeeks(new Date(), WEEKS - 1), { weekStartsOn: 1 });
    const out = Array.from({ length: WEEKS }, (_, i) => {
      const from = startOfWeek(subWeeks(new Date(), WEEKS - 1 - i), { weekStartsOn: 1 });
      return { from, cents: 0 };
    });
    for (const r of rows) {
      const d = new Date(r.created_at);
      if (d < start) continue;
      const idx = out.findIndex((b, i) => {
        const next = out[i + 1]?.from;
        return d >= b.from && (!next || d < next);
      });
      if (idx >= 0) out[idx]!.cents += r.net_cents;
    }
    return out;
  }, [rows]);

  const max = Math.max(1, ...buckets.map((b) => b.cents));

  const download = () => {
    const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `earnings-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <h3 className="truncate font-display text-lg text-primary">{t.payouts.last8Weeks}</h3>
        <button
          type="button"
          onClick={download}
          disabled={rows.length === 0}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-medium transition hover:bg-muted disabled:opacity-40"
        >
          <Download className="h-3.5 w-3.5" />
          {t.payouts.exportCsv}
        </button>
      </div>

      <div className="mt-6 flex h-32 items-end gap-2">
        {buckets.map((b) => (
          <div key={b.from.toISOString()} className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <div
              className="w-full rounded-t-md bg-accent/70 transition-all hover:bg-accent"
              style={{ height: `${Math.max(3, (b.cents / max) * 100)}%` }}
              title={formatEur(b.cents / 100)}
            />
            <span className="truncate text-[10px] text-muted-foreground">
              {format(b.from, "d MMM", { locale: dateFnsLocale(locale) })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
