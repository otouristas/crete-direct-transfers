import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import { divIcon, latLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { TripGeometry } from "@/lib/trip-route";

export type LiveMapPoint = { lat: number; lng: number };

const STOP_ICON = (color: string) =>
  divIcon({
    className: "",
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:3px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,.35)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });

const PICKUP_ICON = STOP_ICON("#0B2545");
const DROPOFF_ICON = STOP_ICON("#14B8A6");

function carIcon(heading: number | null) {
  const rotate = heading == null ? 0 : heading;
  return divIcon({
    className: "",
    html: `<div class="tfr-live-car" style="transform:rotate(${rotate}deg)">
      <span class="tfr-live-car-pulse"></span>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="#fff" aria-hidden="true">
        <path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11v6a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H8v1a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-6zm2.2-.5h9.6l-1-3a.5.5 0 0 0-.5-.4H8.7a.5.5 0 0 0-.5.4l-1 3zM7.5 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm9 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
      </svg>
    </div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

function Fit({ points }: { points: [number, number][] }) {
  const map = useMap();
  const key = points.map((p) => p.join()).join("|");
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView(points[0], 13);
      return;
    }
    map.fitBounds(latLngBounds(points), { padding: [50, 50], maxZoom: 14 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, key]);
  return null;
}

export default function LiveTripMapInner({
  driver,
  heading,
  pickup,
  dropoff,
  geometry,
}: {
  driver?: LiveMapPoint | null;
  heading?: number | null;
  pickup?: LiveMapPoint | null;
  dropoff?: LiveMapPoint | null;
  geometry?: TripGeometry;
}) {
  const points: [number, number][] = [];
  if (driver) points.push([driver.lat, driver.lng]);
  if (pickup) points.push([pickup.lat, pickup.lng]);
  if (dropoff) points.push([dropoff.lat, dropoff.lng]);

  return (
    <div className="relative z-0 isolate h-[280px] w-full overflow-hidden rounded-xl border border-border sm:h-[320px]">
      <MapContainer
        center={[35.3, 25.1]}
        zoom={9}
        className="h-full w-full"
        scrollWheelZoom={false}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <Fit points={points} />
        {geometry && geometry.length > 1 && (
          <Polyline
            positions={geometry}
            pathOptions={{ color: "#14B8A6", weight: 4, opacity: 0.9 }}
          />
        )}
        {pickup && <Marker position={[pickup.lat, pickup.lng]} icon={PICKUP_ICON} />}
        {dropoff && <Marker position={[dropoff.lat, dropoff.lng]} icon={DROPOFF_ICON} />}
        {driver && (
          <Marker position={[driver.lat, driver.lng]} icon={carIcon(heading ?? null)} zIndexOffset={500} />
        )}
      </MapContainer>
    </div>
  );
}
