import { useMemo, useState } from "react";
import { BookingWidget } from "@/components/booking-widget";
import { ResumeQuoteBanner } from "@/components/booking/resume-quote-banner";
import { CreteRouteCanvas, type CanvasPoint } from "@/components/sections/crete-route-canvas";
import { haversineEstimate } from "@/lib/trip-route";
import { useT, type Locale } from "@/i18n";
import type { PlaceResult } from "@/lib/place-search";

function toPoint(place: PlaceResult | null): CanvasPoint | null {
  if (!place || place.lat == null || place.lng == null) return null;
  return { lat: place.lat, lng: place.lng, label: place.label };
}

/** Hero stage: animated island map with the quote card floating over it. */
export function HeroRouteStage({ locale }: { locale: Locale }) {
  const t = useT();
  const [selection, setSelection] = useState<{
    from: PlaceResult | null;
    to: PlaceResult | null;
  }>({ from: null, to: null });

  const pickup = toPoint(selection.from);
  const dropoff = toPoint(selection.to);

  const estimate = useMemo(
    () => (pickup && dropoff ? haversineEstimate(pickup, dropoff) : null),
    [pickup?.lat, pickup?.lng, dropoff?.lat, dropoff?.lng],
  );

  return (
    <section className="relative z-30 -mt-16 bg-background md:-mt-24">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="relative overflow-hidden rounded-[28px] border border-border bg-card shadow-[0_30px_80px_-40px_rgba(11,37,69,0.45)]">
          <div className="pointer-events-none absolute inset-0">
            <CreteRouteCanvas
              title={t.home.mapTitle}
              pickup={pickup}
              dropoff={dropoff}
              className="tfr-route-canvas h-full w-full opacity-90"
            />
          </div>

          <div className="relative px-5 pb-6 pt-7 md:px-8 md:pb-8 md:pt-9">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-deep">
                {t.home.mapEyebrow}
              </p>
              <p className="text-sm text-muted-foreground">
                {estimate
                  ? t.home.mapDistance(estimate.distanceKm, estimate.durationMin)
                  : t.home.mapHint}
              </p>
            </div>

            <div className="mt-5">
              <BookingWidget variant="hbar" onSelectionChange={setSelection} />
              <ResumeQuoteBanner locale={locale} className="mt-4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
