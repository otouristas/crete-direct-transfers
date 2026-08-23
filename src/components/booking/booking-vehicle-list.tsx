import { Users, Briefcase } from "lucide-react";
import { FLEET_IMAGE_HEIGHT, FLEET_IMAGE_WIDTH, fleetSrcSet } from "@/lib/fleet-image";
import type { VehicleClass } from "@/data/routes";
import { formatEur, type TripQuote } from "@/lib/pricing";
import { useLocale, useT } from "@/i18n";
import { getLocalizedVehicles } from "@/i18n/content";
import { cn } from "@/lib/utils";

const BADGES: Partial<Record<VehicleClass, { className: string }>> = {
  economy: { className: "bg-emerald-50 text-emerald-700" },
  comfort: { className: "bg-rose-50 text-rose-700" },
  luxury: { className: "bg-slate-100 text-slate-600" },
  "van-first": { className: "bg-slate-100 text-slate-600" },
};

function paxMax(capacity: string): string {
  const m = capacity.match(/(\d+)\s*$/);
  return m ? m[1] : capacity;
}

function bagsMax(bags: string): string {
  const m = bags.match(/(\d+)/);
  return m ? m[1] : bags;
}

export function BookingVehicleList({
  quotes,
  selected,
  onSelect,
  loading,
  labels,
}: {
  quotes: { vehicleClass: VehicleClass; quote: TripQuote }[];
  selected: VehicleClass;
  onSelect: (id: VehicleClass) => void;
  loading?: boolean;
  labels: {
    totalPrice: string;
    upTo: string;
    bestValue: string;
    mostPopular: string;
    topClass: string;
  };
}) {
  const t = useT();
  const vehicles = getLocalizedVehicles(useLocale());
  const badgeLabel = (id: VehicleClass) => {
    if (id === "economy") return labels.bestValue;
    if (id === "comfort") return labels.mostPopular;
    if (id === "luxury" || id === "van-first") return labels.topClass;
    return undefined;
  };

  return (
    <fieldset className="w-full space-y-2.5">
      <legend className="sr-only">{t.widget.vehicleClass}</legend>
      {vehicles.map((vc) => {
        const row = quotes.find((q) => q.vehicleClass === vc.id);
        const price = row?.quote.totalEur;
        const badge = BADGES[vc.id];
        const isOn = selected === vc.id;
        return (
          <label
            key={vc.id}
            className={cn(
              "group flex cursor-pointer rounded-xl border-2 bg-card transition-all",
              isOn ? "border-accent bg-accent/5 shadow-sm" : "border-border/60 hover:border-border",
            )}
          >
            <input
              type="radio"
              name="vehicle"
              className="sr-only"
              checked={isOn}
              onChange={() => onSelect(vc.id)}
            />
            <div className="flex w-full min-w-0 items-center gap-3 p-3.5 sm:gap-4 sm:p-4">
              <figure className="h-14 w-20 shrink-0 sm:h-16 sm:w-28">
                <img
                  src={vc.image}
                  srcSet={fleetSrcSet(vc.image)}
                  sizes="112px"
                  width={FLEET_IMAGE_WIDTH}
                  height={FLEET_IMAGE_HEIGHT}
                  alt=""
                  className="h-full w-full object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-base font-semibold text-foreground sm:text-lg">
                    {vc.label}
                  </h3>
                  {badge && (
                    <span
                      className={cn(
                        "hidden rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide min-[490px]:inline-block",
                        badge.className,
                      )}
                    >
                      {badgeLabel(vc.id)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <span className="hidden sm:inline">{labels.upTo}</span>
                    {paxMax(vc.capacity)}
                    <Users className="h-3.5 w-3.5" />
                  </span>
                  <span className="inline-flex items-center gap-1">
                    {bagsMax(vc.bags)}
                    <Briefcase className="h-3.5 w-3.5" />
                  </span>
                </div>
                <p className="hidden truncate text-xs text-muted-foreground lg:block">
                  {vc.description}
                </p>
              </div>
              <div className="shrink-0 self-center text-end">
                {loading && price == null ? (
                  <div className="ml-auto h-7 w-16 animate-pulse rounded bg-muted" />
                ) : price != null ? (
                  <>
                    <p className="text-lg font-semibold tabular-nums text-foreground sm:text-xl">
                      <span className="me-1 text-sm font-medium text-muted-foreground">EUR</span>
                      {price.toLocaleString("en-IE", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </p>
                    <span className="text-xs font-light text-muted-foreground">
                      {labels.totalPrice}
                    </span>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">—</p>
                )}
              </div>
            </div>
          </label>
        );
      })}
    </fieldset>
  );
}

export function formatPriceLabel(amount: number): string {
  return formatEur(amount);
}
