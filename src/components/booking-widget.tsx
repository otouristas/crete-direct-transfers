import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, Info } from "lucide-react";
import { ROUTES, VEHICLE_CLASSES, type VehicleClass } from "@/data/routes";
import { quote, formatEur, bagCapacity, type TripType } from "@/lib/pricing";
import { CounterInput } from "@/components/counter-input";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";

export function BookingWidget({
  defaultRoute,
  defaultClass = "economy",
  compact = false,
}: {
  defaultRoute?: string;
  defaultClass?: VehicleClass;
  compact?: boolean;
}) {
  const t = useT();
  const navigate = useNavigate();
  const [tripType, setTripType] = useState<TripType>("oneway");
  const [routeSlug, setRouteSlug] = useState(defaultRoute ?? ROUTES[0].slug);
  const [vehicleClass, setVehicleClass] = useState<VehicleClass>(defaultClass);
  const [date, setDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [pax, setPax] = useState(2);
  const [bagsChecked, setBagsChecked] = useState(2);
  const [bagsCabin, setBagsCabin] = useState(2);
  const [flight, setFlight] = useState("");
  const [showBreakdown, setShowBreakdown] = useState(false);

  const selected = ROUTES.find((r) => r.slug === routeSlug)!;
  const q = useMemo(
    () =>
      quote({
        routeSlug,
        vehicleClass,
        tripType,
        pickupAt: date ? new Date(date) : undefined,
        returnAt: returnDate ? new Date(returnDate) : undefined,
      }),
    [routeSlug, vehicleClass, tripType, date, returnDate],
  );

  const overCapacity = bagsChecked > bagCapacity(vehicleClass);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/{-$locale}/book",
      search: {
        route: routeSlug,
        class: vehicleClass,
        date,
        pax,
        trip: tripType,
        returnDate: tripType === "return" ? returnDate : undefined,
        flight: flight || undefined,
        bagsChecked,
        bagsCabin,
      },
    });
  };

  return (
    <form
      onSubmit={submit}
      className={cn(
        "rounded-2xl border border-border bg-card text-foreground shadow-2xl",
        compact ? "p-5" : "p-6",
      )}
    >
      {/* Trip type toggle */}
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
        {(["oneway", "return"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setTripType(type)}
            className={cn(
              "rounded-lg py-2 text-sm font-semibold transition",
              tripType === type
                ? "bg-card text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {type === "oneway" ? t.widget.oneWay : t.widget.return}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3.5">
        <Field label={t.widget.route}>
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

        <div className={cn("grid gap-3.5", tripType === "return" && "sm:grid-cols-2")}>
          <Field label={t.widget.pickupDate}>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="widget-input"
            />
          </Field>
          {tripType === "return" && (
            <Field label={t.widget.returnDate}>
              <input
                type="datetime-local"
                value={returnDate}
                min={date || undefined}
                onChange={(e) => setReturnDate(e.target.value)}
                className="widget-input"
              />
            </Field>
          )}
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2">
          <Field label={t.widget.vehicleClass}>
            <select
              value={vehicleClass}
              onChange={(e) => setVehicleClass(e.target.value as VehicleClass)}
              className="widget-input"
            >
              {VEHICLE_CLASSES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label} · {v.capacity}
                </option>
              ))}
            </select>
          </Field>
          <Field label={`${t.widget.flightNumber} (${t.common.optional})`}>
            <input
              value={flight}
              onChange={(e) => setFlight(e.target.value)}
              placeholder={t.widget.flightPlaceholder}
              className="widget-input"
            />
          </Field>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-3">
          <CounterInput label={t.widget.passengers} value={pax} onChange={setPax} min={1} max={8} />
          <CounterInput
            label={t.widget.checkedBags}
            value={bagsChecked}
            onChange={setBagsChecked}
            max={8}
          />
          <CounterInput
            label={t.widget.cabinBags}
            value={bagsCabin}
            onChange={setBagsCabin}
            max={8}
          />
        </div>

        {overCapacity && (
          <p className="flex items-start gap-2 rounded-lg bg-highlight/10 px-3 py-2 text-xs text-foreground/80">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-highlight" />
            {t.widget.minivanHint}
          </p>
        )}
      </div>

      {/* Price */}
      <div className="mt-5 border-t border-border pt-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="text-xs text-muted-foreground">
            {t.widget.distance(selected.distanceKm, selected.durationMin)}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              {t.common.from}
            </span>
            <span className="text-3xl font-display text-primary">
              {q ? formatEur(q.totalEur) : "—"}
            </span>
          </div>
        </div>

        {q && q.breakdown.length > 1 && (
          <button
            type="button"
            onClick={() => setShowBreakdown((v) => !v)}
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent-deep hover:opacity-80"
          >
            {t.widget.breakdown}
            <ChevronDown
              className={cn("h-3 w-3 transition-transform", showBreakdown && "rotate-180")}
            />
          </button>
        )}
        {q && showBreakdown && (
          <dl className="mt-2 space-y-1.5 rounded-lg bg-muted p-3 text-xs">
            {q.breakdown.map((b, i) => (
              <div key={i} className="flex justify-between">
                <dt className="text-muted-foreground">{b.label}</dt>
                <dd
                  className={cn("tabular-nums", b.amountEur < 0 && "text-accent-deep font-medium")}
                >
                  {formatEur(b.amountEur)}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      <button
        type="submit"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
      >
        {t.widget.getPrice} <ArrowRight className="h-4 w-4" />
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        {t.widget.guaranteed} · {t.widget.payOnBoard}
      </p>

      <style>{`
        .widget-input {
          width: 100%;
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s;
        }
        .widget-input:focus { border-color: var(--accent); }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
