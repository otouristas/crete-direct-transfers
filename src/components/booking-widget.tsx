import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ROUTES, VEHICLE_CLASSES, type VehicleClass } from "@/data/routes";
import { quote, formatEur } from "@/lib/pricing";
import { ArrowRight } from "lucide-react";

export function BookingWidget({
  defaultRoute,
  defaultClass = "economy",
  compact = false,
}: {
  defaultRoute?: string;
  defaultClass?: VehicleClass;
  compact?: boolean;
}) {
  const navigate = useNavigate();
  const [routeSlug, setRouteSlug] = useState(defaultRoute ?? ROUTES[0].slug);
  const [vehicleClass, setVehicleClass] = useState<VehicleClass>(defaultClass);
  const [date, setDate] = useState("");
  const [pax, setPax] = useState(2);

  const selected = ROUTES.find((r) => r.slug === routeSlug)!;
  const q = useMemo(
    () => quote({ routeSlug, vehicleClass }),
    [routeSlug, vehicleClass],
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/book",
      search: { route: routeSlug, class: vehicleClass, date, pax },
    });
  };

  return (
    <form
      onSubmit={submit}
      className={`rounded-2xl bg-background text-foreground shadow-2xl ${
        compact ? "p-5" : "p-6 md:p-7"
      }`}
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_100px_120px_auto] items-end">
        <Field label="Route">
          <select
            value={routeSlug}
            onChange={(e) => setRouteSlug(e.target.value)}
            className="widget-input"
          >
            {ROUTES.map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.from} → {r.to}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Pickup">
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="widget-input"
          />
        </Field>
        <Field label="Pax">
          <input
            type="number"
            min={1}
            max={8}
            value={pax}
            onChange={(e) => setPax(Number(e.target.value))}
            className="widget-input"
          />
        </Field>
        <Field label="Class">
          <select
            value={vehicleClass}
            onChange={(e) => setVehicleClass(e.target.value as VehicleClass)}
            className="widget-input"
          >
            {VEHICLE_CLASSES.map((v) => (
              <option key={v.id} value={v.id}>{v.label}</option>
            ))}
          </select>
        </Field>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 h-[46px] text-accent-foreground text-sm font-medium hover:opacity-90"
        >
          Get price <ArrowRight className="w-4 h-4" />
        </button>
      </div>
      <div className="mt-5 pt-5 border-t border-border flex flex-wrap items-baseline justify-between gap-3">
        <div className="text-sm text-muted-foreground">
          {selected.distanceKm} km · {selected.durationMin} min · Fixed price
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">from</span>
          <span className="font-serif text-3xl text-primary">
            {q ? formatEur(q.totalEur) : "—"}
          </span>
        </div>
      </div>

      <style>{`
        .widget-input {
          width: 100%;
          background: transparent;
          border: 1px solid oklch(0.88 0.01 85);
          border-radius: 10px;
          padding: 11px 12px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s;
        }
        .widget-input:focus { border-color: oklch(0.58 0.14 42); }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
        {label}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
