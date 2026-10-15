import { lazy, Suspense, useEffect, useState } from "react";
import type { TripGeometry } from "@/lib/trip-route";

export type MapEndpoint = {
  lat: number;
  lng: number;
  label: string;
  timeLabel?: string;
  kind: "pickup" | "dropoff";
};

export type MapDriver = { lat: number; lng: number; heading?: number | null; fresh: boolean };

const BookingRouteMapInner = lazy(() => import("./booking-route-map-inner"));

function MapSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-muted ${className ?? "h-[42vh] md:h-[340px] lg:h-[400px]"}`}
    />
  );
}

/** Client-only dual-marker route map with optional polyline. */
export function BookingRouteMap({
  pickup,
  dropoff,
  geometry,
  driver,
  followDriver,
  className,
}: {
  pickup?: MapEndpoint | null;
  dropoff?: MapEndpoint | null;
  geometry?: TripGeometry;
  driver?: MapDriver | null;
  followDriver?: boolean;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <MapSkeleton className={className} />;
  return (
    <Suspense fallback={<MapSkeleton className={className} />}>
      <BookingRouteMapInner
        pickup={pickup}
        dropoff={dropoff}
        geometry={geometry}
        driver={driver}
        followDriver={followDriver}
        className={className}
      />
    </Suspense>
  );
}
