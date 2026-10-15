import { useEffect, useMemo, useState } from "react";
import { LocateFixed, Radio } from "lucide-react";
import { useLocale } from "@/i18n";
import type { Booking } from "@/queries/bookings";
import { useLiveTrip } from "@/hooks/use-live-trip";
import { BookingRouteMap, type MapEndpoint } from "@/components/booking/booking-route-map";
import { tripCopy } from "@/lib/trip-copy";
import { journeyPhase } from "../../../packages/mobile-shared/src/trip-state";
import { fetchTripRoute, type TripRouteResult } from "@/lib/trip-route";

function endpoint(
  value: unknown,
  kind: "pickup" | "dropoff",
  label: string | null,
): MapEndpoint | null {
  if (!value || typeof value !== "object") return null;
  const p = value as Record<string, unknown>;
  const lat = Number(p.lat ?? p.latitude),
    lng = Number(p.lng ?? p.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180)
    return null;
  return { lat, lng, kind, label: label ?? (kind === "pickup" ? "Pickup" : "Drop-off") };
}

export function LiveJourney({ booking }: { booking: Booking }) {
  const locale = useLocale();
  const copy = tripCopy(locale);
  const active = ["claimed", "en_route"].includes(booking.status);
  const live = useLiveTrip(booking.id, active);
  const [follow, setFollow] = useState(false);
  const pickup = useMemo(
    () => endpoint(booking.pickup_point, "pickup", booking.pickup_address),
    [booking.pickup_point, booking.pickup_address],
  );
  const dropoff = useMemo(
    () => endpoint(booking.dropoff_point, "dropoff", booking.dropoff_address),
    [booking.dropoff_point, booking.dropoff_address],
  );
  const closed = ["completed", "cancelled", "no_show"].includes(booking.status);
  const [route, setRoute] = useState<TripRouteResult | null>(null);
  useEffect(() => {
    let alive = true;
    setRoute(null);
    if (pickup && dropoff)
      void fetchTripRoute(pickup, dropoff).then((result) => {
        if (alive) setRoute(result);
      });
    return () => {
      alive = false;
    };
  }, [pickup, dropoff]);
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-white">
      <div className="flex flex-wrap items-start justify-between gap-3 p-5 md:p-7">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {copy.title}
          </p>
          <h2 className="mt-2 text-xl text-foreground md:text-2xl" aria-live="polite">
            {copy.phases[journeyPhase(booking)]}
          </h2>
        </div>
        {active && (
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-2 text-xs font-semibold text-accent-deep">
            <Radio className="h-3.5 w-3.5" />
            {live.position
              ? live.fresh
                ? copy.live
                : copy.stale.replace("{seconds}", String(live.ageSeconds ?? 0))
              : live.connection === "reconnecting"
                ? copy.reconnecting
                : copy.waiting}
          </span>
        )}
      </div>
      {(pickup || dropoff) && (
        <div className="relative">
          <BookingRouteMap
            pickup={pickup}
            dropoff={dropoff}
            geometry={route?.geometry}
            driver={
              live.position
                ? {
                    lat: live.position.latitude,
                    lng: live.position.longitude,
                    heading: live.position.heading,
                    fresh: live.fresh,
                  }
                : null
            }
            followDriver={follow}
            className="h-[300px] rounded-none border-0 md:h-[360px] md:rounded-none md:border-0 lg:h-[360px]"
          />
          {route && (
            <p className="absolute bottom-4 left-4 z-[800] rounded-full bg-white px-4 py-2 text-xs font-semibold shadow-md">
              ~{route.durationMin} min · {route.distanceKm} km
              {route.source === "estimated" ? " · estimated route" : ""}
            </p>
          )}
          {live.position && (
            <button
              type="button"
              aria-pressed={follow}
              onClick={() => setFollow(!follow)}
              className="absolute right-4 top-4 z-[800] inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-xs font-semibold shadow-md"
            >
              <LocateFixed className="h-4 w-4 text-accent" />
              {follow ? copy.overview : copy.follow}
            </button>
          )}
        </div>
      )}
      <p className="px-5 py-4 text-sm text-muted-foreground md:px-7">
        {closed
          ? copy.ended
          : active
            ? live.position
              ? live.position.accuracy != null && live.position.accuracy > 100
                ? copy.accuracy
                : copy.phases[journeyPhase(booking)]
              : copy.waitingBody
            : booking.payment_status === "unpaid"
              ? copy.paymentPending
              : copy.phases[journeyPhase(booking)]}
      </p>
    </section>
  );
}
