import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Car, Clock, Loader2, Phone, Radio } from "lucide-react";
import { formatEur } from "@/lib/pricing";
import { localePath, type Locale } from "@/i18n";
import { mapAsapStatusToUi, watchAsapBooking } from "@/lib/asap-dispatch";
import type { AssistantResponse } from "@/lib/touristas-ai/types";
import { cn } from "@/lib/utils";

export type DispatchCardState = NonNullable<AssistantResponse["dispatch"]>;

export function DispatchLiveCard({
  initial,
  locale,
  labels,
  onStatusChange,
}: {
  initial: DispatchCardState;
  locale: Locale;
  labels: {
    searching: string;
    claimed: string;
    enRoute: string;
    expired: string;
    failed: string;
    cancelled: string;
    eta: string;
    viewBooking: string;
    supportHint: string;
    price: string;
  };
  onStatusChange?: (next: DispatchCardState, assistantLine?: string) => void;
}) {
  const [state, setState] = useState(initial);

  useEffect(() => {
    setState(initial);
  }, [initial]);

  useEffect(() => {
    if (
      state.status === "claimed" ||
      state.status === "en_route" ||
      state.status === "expired" ||
      state.status === "failed" ||
      state.status === "cancelled"
    ) {
      return;
    }

    return watchAsapBooking(state.bookingId, (status) => {
      const mapped = mapAsapStatusToUi(status);
      setState((prev) => {
        if (prev.status === mapped.status && prev.etaMinutes === mapped.etaMinutes) {
          return prev;
        }
        const next: DispatchCardState = {
          ...prev,
          status: mapped.status,
          etaMinutes: mapped.etaMinutes ?? prev.etaMinutes,
          driverName: mapped.driverName ?? prev.driverName,
          priceEur: status.priceCents != null ? status.priceCents / 100 : prev.priceEur,
          expiresAt: status.expiresAt ?? prev.expiresAt,
        };

        let line: string | undefined;
        if (
          (mapped.status === "claimed" || mapped.status === "en_route") &&
          prev.status === "searching"
        ) {
          const name = mapped.driverName ?? "Your driver";
          const eta = mapped.etaMinutes ?? prev.etaMinutes;
          line =
            eta != null
              ? `Confirmed. ${name} accepted. Driver is coming in about ${eta} minutes.`
              : `Confirmed. ${name} accepted and is on the way.`;
        } else if (mapped.status === "expired" && prev.status === "searching") {
          line =
            "No driver was free in time. Book a scheduled transfer or message WhatsApp dispatch.";
        }

        onStatusChange?.(next, line);
        return next;
      });
    });
  }, [state.bookingId, state.status, onStatusChange]);

  const title =
    state.status === "searching"
      ? labels.searching
      : state.status === "claimed"
        ? labels.claimed
        : state.status === "en_route"
          ? labels.enRoute
          : state.status === "expired"
            ? labels.expired
            : state.status === "cancelled"
              ? labels.cancelled
              : labels.failed;

  const live = state.status === "searching";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border shadow-sm",
        live
          ? "border-accent/40 bg-gradient-to-br from-accent/10 via-card to-card"
          : "border-border bg-card",
      )}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <span
          className={cn(
            "mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl",
            live ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground",
          )}
        >
          {live ? (
            <Radio className="h-4 w-4 animate-pulse" />
          ) : state.status === "claimed" || state.status === "en_route" ? (
            <Car className="h-4 w-4" />
          ) : (
            <Clock className="h-4 w-4" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-deep">
            {live ? (
              <span className="inline-flex items-center gap-1.5">
                <Loader2 className="h-3 w-3 animate-spin" />
                {title}
              </span>
            ) : (
              title
            )}
          </p>
          <p className="mt-1 font-display text-base text-primary">
            {state.from}
            <span className="mx-2 font-accent text-accent">→</span>
            {state.to}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
            {state.priceEur != null && (
              <span>
                {labels.price}: {formatEur(state.priceEur)}
              </span>
            )}
            {(state.status === "claimed" || state.status === "en_route") &&
              state.etaMinutes != null && (
                <span className="font-medium text-primary">
                  {labels.eta.replace("{min}", String(state.etaMinutes))}
                </span>
              )}
            {state.driverName && (
              <span className="font-medium text-primary">{state.driverName}</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-border/60 px-4 py-3">
        <Link
          to="/{-$locale}/account"
          className="inline-flex items-center rounded-xl bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground"
        >
          {labels.viewBooking}
        </Link>
        {(state.status === "expired" || state.status === "failed") && (
          <a
            href={localePath(locale, "/contact")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-medium"
          >
            <Phone className="h-3.5 w-3.5" />
            {labels.supportHint}
          </a>
        )}
      </div>
    </div>
  );
}
