import { useT } from "@/i18n";
import { ROUTES, VEHICLE_CLASSES } from "@/data/routes";

export function StatsBand() {
  const t = useT();
  const stats = [
    { value: ROUTES.length, label: t.stats.routes, amber: false },
    { value: VEHICLE_CLASSES.length, label: t.nav.fleet, amber: false },
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
