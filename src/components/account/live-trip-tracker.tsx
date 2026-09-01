import { lazy, Suspense, useEffect, useState } from "react";
import { Navigation, Phone, MessageCircle, Radio } from "lucide-react";
import { getDict, type Locale } from "@/i18n";
import { fetchTripRoute, type TripGeometry } from "@/lib/trip-route";
import { minutesSince, useLiveTripLocation } from "@/queries/trip-tracking";
import type { Booking, DriverInfo } from "@/queries/bookings";
import { searchLocalPlaces } from "@/lib/place-search";
import { getRoute } from "@/data/routes";
import { Skeleton } from "@/components/ui/skeleton";

const LiveTripMapInner = lazy(() => import("./live-trip-map-inner"));

type Coords = { lat: number; lng: number };

function pointOf(value: unknown): Coords | null {
  const p = value as Coords | null;
  if (p && typeof p.lat === "number" && typeof p.lng === "number") return { lat: p.lat, lng: p.lng };
  return null;
}

function coordsFromLabel(label?: string | null): Coords | null {
  if (!label) return null;
  const hit = searchLocalPlaces(label, 1)[0];
  if (hit?.lat != null && hit?.lng != null) return { lat: hit.lat, lng: hit.lng };
  return null;
}

/** Resolve pickup / dropoff coordinates from the booking, then its route. */
export function tripEndpoints(b: Booking): { pickup: Coords | null; dropoff: Coords | null } {
  const route = getRoute(b.route_slug);
  return {
    pickup: pointOf(b.pickup_point) ?? coordsFromLabel(b.pickup_address ?? route?.from),
    dropoff: pointOf(b.dropoff_point) ?? coordsFromLabel(b.dropoff_address ?? route?.to),
  };
}

/** Live driver position, ETA and one-tap contact for an active transfer. */
export function LiveTripTracker({
  booking,
  driver,
  locale,
}: {
  booking: Booking;
  driver?: DriverInfo | null;
  locale: Locale;
}) {
  const t = getDict(locale);
  const lt = t.account.liveTrip;
  const { pickup, dropoff } = tripEndpoints(booking);

  const { location, isDemo, connected } = useLiveTripLocation(booking.id, {
    enabled: true,
    approachFrom: dropoff,
    approachTo: pickup,
  });

  const stage = location?.stage ?? (booking.status === "en_route" ? "to_pickup" : "to_pickup");
  const target = stage === "on_trip" ? dropoff : pickup;

  const [geometry, setGeometry] = useState<TripGeometry>([]);
  const [fallbackEta, setFallbackEta] = useState<number | null>(null);

  useEffect(() => {
    if (!location || !target) {
      setGeometry([]);
      setFallbackEta(null);
      return;
    }
    let cancelled = false;
    fetchTripRoute({ lat: location.lat, lng: location.lng }, target).then((trip) => {
      if (cancelled) return;
      setGeometry(trip.geometry);
      setFallbackEta(trip.durationMin);
    });
    return () => {
      cancelled = true;
    };
  }, [location?.lat, location?.lng, target?.lat, target?.lng]);

  const eta = location?.eta_minutes ?? fallbackEta;
  const phone = driver?.phone?.replace(/[^\d+]/g, "") ?? "";
  const stale = location ? minutesSince(location.updated_at) >= 5 : false;

  const stageLabel =
    stage === "on_trip" ? lt.stageOnTrip : stage === "waiting" ? lt.stageWaiting : lt.stageToPickup;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4 sm:px-8">
        <div className="flex items-center gap-2">
          <Radio className={`h-4 w-4 ${location && !stale ? "text-accent" : "text-muted-foreground"}`} />
          <h3 className="font-display text-lg text-primary">{lt.title}</h3>
          {location && !stale && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent-deep">
              <span className="tfr-live-dot" />
              {lt.liveNow}
            </span>
          )}
        </div>
        {eta != null && location && !stale && (
          <div className="text-right">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              {stage === "on_trip" ? lt.etaDropoff : lt.etaPickup}
            </div>
            <div className="font-display text-2xl text-primary">{lt.minutes(eta)}</div>
          </div>
        )}
      </div>

      <div className="px-6 py-5 sm:px-8">
        {location ? (
          <Suspense fallback={<Skeleton className="h-[280px] w-full rounded-xl sm:h-[320px]" />}>
            <LiveTripMapInner
              driver={{ lat: location.lat, lng: location.lng }}
              heading={location.heading}
              pickup={pickup}
              dropoff={dropoff}
              geometry={geometry}
            />
          </Suspense>
        ) : (
          <div className="rounded-xl border border-dashed border-border px-5 py-8 text-center text-sm text-muted-foreground">
            {lt.waitingForSignal}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 font-medium text-primary">
            <Navigation className="h-3.5 w-3.5 text-accent" />
            {stageLabel}
          </span>
          {location?.distance_km != null && (
            <span className="text-muted-foreground">{lt.away(location.distance_km)}</span>
          )}
          {location && (
            <span className="text-xs text-muted-foreground">
              {stale ? lt.staleSignal : lt.updatedAgo(minutesSince(location.updated_at))}
            </span>
          )}
          {isDemo && <span className="text-xs text-muted-foreground">{lt.demoNotice}</span>}
          {!connected && !isDemo && (
            <span className="text-xs text-muted-foreground">{lt.reconnecting}</span>
          )}
        </div>

        {phone && (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <a
              href={`tel:${phone}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              <Phone className="h-4 w-4" />
              {lt.callDriver}
            </a>
            <a
              href={`https://wa.me/${phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-primary transition hover:bg-muted"
            >
              <MessageCircle className="h-4 w-4 text-accent" />
              {lt.whatsappDriver}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
