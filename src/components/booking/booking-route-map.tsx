import { lazy, Suspense, useEffect, useState } from "react";
import type { TripGeometry } from "@/lib/trip-route";

export type MapEndpoint = {
  lat: number;
  lng: number;
  label: string;
  timeLabel?: string;
  kind: "pickup" | "dropoff";
};

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
  className,
}: {
  pickup?: MapEndpoint | null;
  dropoff?: MapEndpoint | null;
  geometry?: TripGeometry;
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
        className={className}
      />
    </Suspense>
  );
}
