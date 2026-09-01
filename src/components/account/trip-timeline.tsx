import { Check, CarFront, CircleDot, Navigation, XCircle } from "lucide-react";
import { getDict, type Locale } from "@/i18n";
import { cn } from "@/lib/utils";

type Step = { key: string; label: string; done: boolean; current: boolean; icon: typeof Check };

/** Booking lifecycle rendered as a vertical timeline, localized. */
export function TripTimeline({
  status,
  locale,
  className,
}: {
  status: string;
  locale: Locale;
  className?: string;
}) {
  const t = getDict(locale);
  const cancelled = status === "cancelled";
  const order = ["pending", "claimed", "en_route", "completed"];
  const idx = order.indexOf(status === "no_show" ? "en_route" : status);

  const steps: Step[] = cancelled
    ? [
        {
          key: "booked",
          label: t.account.timelineBooked,
          done: true,
          current: false,
          icon: Check,
        },
        {
          key: "cancelled",
          label: t.account.timelineCancelled,
          done: true,
          current: true,
          icon: XCircle,
        },
      ]
    : [
        { key: "booked", label: t.account.timelineBooked, icon: Check },
        { key: "claimed", label: t.account.timelineDriverAssigned, icon: CarFront },
        { key: "en_route", label: t.account.timelineEnRoute, icon: Navigation },
        { key: "completed", label: t.account.timelineCompleted, icon: CircleDot },
      ].map((s, i) => ({
        ...s,
        done: idx >= i,
        current: idx === i,
      }));

  return (
    <section className={cn("rounded-2xl border border-border bg-card p-8", className)}>
      <h3 className="font-display text-lg text-primary">{t.account.timelineTitle}</h3>
      <ol className="mt-5 space-y-0">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const last = i === steps.length - 1;
          return (
            <li key={s.key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                    cancelled && s.key === "cancelled"
                      ? "border-transparent bg-destructive/10 text-destructive"
                      : s.done
                        ? "border-transparent bg-accent text-accent-foreground"
                        : "border-border bg-muted text-muted-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                {!last && (
                  <span
                    className={cn("w-px flex-1", s.done ? "bg-accent/50" : "bg-border")}
                    style={{ minHeight: "1.75rem" }}
                  />
                )}
              </div>
              <div className={cn("pb-6", last && "pb-0")}>
                <p
                  className={cn(
                    "text-sm",
                    s.current ? "font-semibold text-primary" : "text-muted-foreground",
                  )}
                >
                  {s.label}
                </p>
                {s.current && !s.done && (
                  <p className="text-xs text-muted-foreground">{t.account.timelinePending}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
