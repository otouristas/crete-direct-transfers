import { ArrowLeftRight, BadgeCheck, Check, Plane, UserRound, Users } from "lucide-react";
import { formatEur } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export function BookingSummary({
  tripLabel,
  passengers,
  dateLabel,
  fromLabel,
  toLabel,
  fromTime,
  toTime,
  distanceKm,
  durationMin,
  totalEur,
  vehicleLabel,
  onEdit,
  onAddReturn,
  showAddReturn,
  onContinue,
  continueDisabled,
  continueLabel,
  className,
  forceActions,
  labels,
}: {
  tripLabel: string;
  passengers: number;
  dateLabel: string;
  fromLabel: string;
  toLabel: string;
  fromTime?: string;
  toTime?: string;
  distanceKm?: number;
  durationMin?: number;
  totalEur?: number;
  vehicleLabel?: string;
  onEdit?: () => void;
  onAddReturn?: () => void;
  showAddReturn?: boolean;
  onContinue: () => void;
  continueDisabled?: boolean;
  continueLabel: string;
  className?: string;
  /** Show trust chips + continue even below lg (e.g. mobile drawer). */
  forceActions?: boolean;
  labels: {
    yourBooking: string;
    passengers: string;
    outward: string;
    edit: string;
    addReturn: string;
    priceDetails: string;
    total: string;
    freeCancel: string;
    doorToDoor: string;
    meetGreet: string;
    flightTracking: string;
    licensed: string;
    yourChoice: string;
  };
}) {
  return (
    <aside className={cn("rounded-xl border border-border bg-card p-5 shadow-lg", className)}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-foreground">{labels.yourBooking}</h2>
      </div>

      <div className="flex items-center justify-between text-sm font-semibold text-foreground">
        <span>{tripLabel}</span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          {passengers} {labels.passengers}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between gap-2 text-[13px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-foreground">{labels.outward}</span>
            {dateLabel && <span>· {dateLabel}</span>}
          </div>
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              {labels.edit}
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <div className="flex flex-col items-center py-1">
            <div className="h-2 w-2 rounded-sm bg-primary" />
            <div className="my-0.5 w-0.5 grow rounded-full bg-border" />
            <div className="h-2 w-2 rounded-sm bg-accent" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="flex justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[15px] font-medium">{fromLabel || "—"}</p>
              </div>
              {fromTime && (
                <span className="shrink-0 text-[13px] text-muted-foreground">{fromTime}</span>
              )}
            </div>
            {(distanceKm != null || durationMin != null) && (
              <div className="flex flex-wrap gap-1.5">
                {durationMin != null && (
                  <span className="rounded-sm ring-1 ring-border px-1.5 py-0.5 text-xs text-foreground">
                    ~ {durationMin} min
                  </span>
                )}
                {distanceKm != null && (
                  <span className="rounded-sm ring-1 ring-border px-1.5 py-0.5 text-xs text-foreground">
                    ~ {distanceKm} km
                  </span>
                )}
              </div>
            )}
            <div className="flex justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-[15px] font-medium">{toLabel || "—"}</p>
              </div>
              {toTime && (
                <span className="shrink-0 text-[13px] text-muted-foreground">{toTime}</span>
              )}
            </div>
          </div>
        </div>

        {showAddReturn && onAddReturn && (
          <button
            type="button"
            onClick={onAddReturn}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-2 text-[13px] text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
          >
            <ArrowLeftRight className="h-4 w-4 text-accent" />
            {labels.addReturn}
          </button>
        )}
      </div>

      <div className="mt-4 space-y-3 border-t border-border pt-4">
        <div className="text-sm font-semibold text-muted-foreground">{labels.priceDetails}</div>
        <div className="flex items-center justify-between text-[15px]">
          <span>{labels.total}</span>
          <p className="text-xl font-semibold tabular-nums text-foreground">
            {totalEur != null ? formatEur(totalEur) : "—"}
          </p>
        </div>
      </div>

      <div className={cn("mt-4 flex-wrap gap-2", forceActions ? "flex" : "hidden lg:flex")}>
        <TrustChip icon={<BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />} label={labels.freeCancel} green />
        <TrustChip icon={<Check className="h-3.5 w-3.5" />} label={labels.doorToDoor} />
        <TrustChip icon={<Check className="h-3.5 w-3.5" />} label={labels.meetGreet} />
        <TrustChip icon={<Plane className="h-3.5 w-3.5" />} label={labels.flightTracking} />
        <TrustChip icon={<UserRound className="h-3.5 w-3.5" />} label={labels.licensed} />
      </div>

      <div className={cn("mt-5 gap-3", forceActions ? "flex" : "hidden lg:flex")}>
        {vehicleLabel && (
          <p className="flex flex-1 items-center gap-1.5 self-center text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{labels.yourChoice}:</span> {vehicleLabel}
          </p>
        )}
        <button
          type="button"
          disabled={continueDisabled}
          onClick={onContinue}
          className="flex-1 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          {continueLabel}
        </button>
      </div>
    </aside>
  );
}

function TrustChip({
  icon,
  label,
  green,
}: {
  icon: React.ReactNode;
  label: string;
  green?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] text-muted-foreground",
        green ? "border-emerald-500 text-emerald-600" : "border-border",
      )}
    >
      {icon}
      {label}
    </span>
  );
}

export function FreeCancelBanner({
  title,
  body,
}: {
  title: string;
  body: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-50/40 p-4 sm:gap-4 sm:p-5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
        <BadgeCheck className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold leading-snug text-emerald-900">{title}</h3>
          <span className="inline-flex items-center rounded-full bg-emerald-100/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
            24h
          </span>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-emerald-800/90">{body}</p>
      </div>
    </div>
  );
}
