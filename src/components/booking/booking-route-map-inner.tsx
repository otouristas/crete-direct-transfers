import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import { divIcon, latLngBounds, type Marker as LMarker } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { TripGeometry } from "@/lib/trip-route";
import type { MapEndpoint, MapDriver } from "./booking-route-map";
import { cn } from "@/lib/utils";

const PICKUP_ICON = divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;border-radius:3px;background:#101114;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const DROPOFF_ICON = divIcon({
  className: "",
  html: `<div style="width:16px;height:16px;border-radius:3px;background:#245BEB;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function FitBounds({
  pickup,
  dropoff,
  geometry,
  followDriver,
}: {
  pickup?: MapEndpoint | null;
  dropoff?: MapEndpoint | null;
  geometry?: TripGeometry;
  followDriver?: boolean;
}) {
  const map = useMap();
  useEffect(() => {
    if (followDriver) return;
    const pts: [number, number][] = [];
    if (geometry && geometry.length > 1) pts.push(...geometry);
    if (pickup) pts.push([pickup.lat, pickup.lng]);
    if (dropoff) pts.push([dropoff.lat, dropoff.lng]);
    if (pts.length === 0) {
      map.setView([35.3, 25.1], 8);
      return;
    }
    if (pts.length === 1) {
      map.setView(pts[0], 12);
      return;
    }
    map.fitBounds(latLngBounds(pts), { padding: [48, 48], maxZoom: 13 });
  }, [map, pickup, dropoff, geometry, followDriver]);
  return null;
}

function Callout({ endpoint }: { endpoint: MapEndpoint }) {
  const isPickup = endpoint.kind === "pickup";
  return (
    <div className="pointer-events-none flex max-w-[220px] items-stretch overflow-hidden rounded-md shadow-md">
      <div className="min-w-0 bg-white px-2.5 py-1.5">
        <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          {isPickup ? "Pick up" : "Drop-off"}
        </div>
        <div className="truncate text-[12px] font-semibold text-slate-900">{endpoint.label}</div>
      </div>
      {endpoint.timeLabel && (
        <div
          className={cn(
            "flex shrink-0 flex-col items-center justify-center px-2.5 py-1.5 text-[12px] font-semibold text-white",
            isPickup ? "bg-primary" : "bg-accent",
          )}
        >
          {endpoint.timeLabel}
        </div>
      )}
    </div>
  );
}

function OpenPopupMarker({
  position,
  icon,
  children,
}: {
  position: [number, number];
  icon: ReturnType<typeof divIcon>;
  children: React.ReactNode;
}) {
  const ref = useRef<LMarker | null>(null);
  useEffect(() => {
    const t = window.setTimeout(() => ref.current?.openPopup(), 200);
    return () => window.clearTimeout(t);
  }, [position[0], position[1]]);
  return (
    <Marker ref={ref} position={position} icon={icon}>
      {children}
    </Marker>
  );
}

export default function BookingRouteMapInner({
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
  return (
    <div
      className={cn(
        // isolate + z-0 keeps Leaflet pane z-indexes (200–700) under the sticky header
        "relative z-0 isolate w-full overflow-hidden md:h-[340px] md:rounded-xl md:border-[3px] md:border-white md:shadow-sm lg:h-[400px]",
        className ?? "h-[42vh]",
      )}
    >
      <MapContainer
        center={[35.3, 25.1]}
        zoom={8}
        className="h-full w-full"
        scrollWheelZoom={false}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url={
            import.meta.env.VITE_MAP_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        />
        <FitBounds
          pickup={pickup}
          dropoff={dropoff}
          geometry={geometry}
          followDriver={followDriver}
        />
        {driver && <DriverMarker position={driver} follow={Boolean(followDriver)} />}
        {geometry && geometry.length > 1 && (
          <Polyline
            positions={geometry}
            pathOptions={{ color: "#245BEB", weight: 5, opacity: 0.9 }}
          />
        )}
        {pickup && (
          <OpenPopupMarker position={[pickup.lat, pickup.lng]} icon={PICKUP_ICON}>
            <Popup
              className="booking-map-popup"
              closeButton={false}
              autoClose={false}
              closeOnClick={false}
            >
              <Callout endpoint={pickup} />
            </Popup>
          </OpenPopupMarker>
        )}
        {dropoff && (
          <OpenPopupMarker position={[dropoff.lat, dropoff.lng]} icon={DROPOFF_ICON}>
            <Popup
              className="booking-map-popup"
              closeButton={false}
              autoClose={false}
              closeOnClick={false}
            >
              <Callout endpoint={dropoff} />
            </Popup>
          </OpenPopupMarker>
        )}
      </MapContainer>
    </div>
  );
}

function DriverMarker({ position, follow }: { position: MapDriver; follow: boolean }) {
  const map = useMap();
  const marker = useRef<LMarker | null>(null);
  const last = useRef<[number, number]>([position.lat, position.lng]);
  const heading = Number.isFinite(position.heading) ? (position.heading ?? 0) : 0;
  const icon = divIcon({
    className: "",
    iconSize: [72, 72],
    iconAnchor: [36, 36],
    html: `<img src="/vehicles/car-marker-v2.png" alt="" style="width:72px;height:72px;object-fit:contain;transform:rotate(${heading}deg);opacity:${position.fresh ? 1 : 0.45};filter:drop-shadow(0 2px 3px #10111455)" />`,
  });
  useEffect(() => {
    const from = last.current;
    const to: [number, number] = [position.lat, position.lng];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const started = performance.now();
    let frame = 0;
    const tick = (time: number) => {
      const t = reduce ? 1 : Math.min(1, (time - started) / 900);
      const point: [number, number] = [
        from[0] + (to[0] - from[0]) * t,
        from[1] + (to[1] - from[1]) * t,
      ];
      last.current = point;
      marker.current?.setLatLng(point);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    if (follow) map.panTo(to, { animate: !reduce, duration: 0.8 });
    return () => cancelAnimationFrame(frame);
  }, [map, position.lat, position.lng, follow]);
  return <Marker ref={marker} position={last.current} icon={icon} keyboard={false} />;
}
