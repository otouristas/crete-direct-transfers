import { useT } from "@/i18n";
import { BUSINESS_METRICS_VERIFIED, REVIEWS_VERIFIED } from "@/lib/site";

export function StatsBand() {
  const t = useT();
  const stats = [
    ...(BUSINESS_METRICS_VERIFIED
      ? [{ value: t.stats.transfersValue, label: t.stats.transfers }]
      : []),
    ...(REVIEWS_VERIFIED
      ? [{ value: t.stats.ratingValue, label: t.stats.rating, amber: true }]
      : []),
    { value: t.stats.routesValue, label: t.stats.routes },
    { value: t.stats.supportValue, label: t.stats.support },
  ];
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-10">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div
              className={`text-3xl md:text-4xl font-display ${s.amber ? "text-highlight" : "text-primary"}`}
            >
              {s.value}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
