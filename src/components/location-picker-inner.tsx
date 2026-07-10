import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { divIcon, type LatLngBoundsExpression, type Marker as LeafletMarker } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { PickedLocation } from "./location-picker";

const CRETE_BOUNDS: LatLngBoundsExpression = [
  [34.75, 23.3],
  [35.75, 26.4],
];

const PIN_ICON = divIcon({
  className: "",
  html: '<svg viewBox="0 0 24 24" width="34" height="34" style="filter:drop-shadow(0 2px 3px rgba(11,37,69,.4))"><path d="M12 2C7.9 2 4.5 5.2 4.5 9.2c0 5.2 6.1 11.6 6.9 12.4a.8.8 0 0 0 1.2 0c.8-.8 6.9-7.2 6.9-12.4C19.5 5.2 16.1 2 12 2Z" fill="#0B2545"/><circle cx="12" cy="9.4" r="3" fill="#14B8A6"/></svg>',
  iconSize: [34, 34],
  iconAnchor: [17, 32],
});

async function reverseGeocode(point: PickedLocation): Promise<string> {
  const fallback = `${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}`;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${point.lat}&lon=${point.lng}&zoom=17`,
      { signal: controller.signal, headers: { Accept: "application/json" } },
    );
    clearTimeout(timer);
    if (!res.ok) return fallback;
    const data = (await res.json()) as { display_name?: string };
    return data.display_name ?? fallback;
  } catch {
    return fallback;
  }
}

function ClickHandler({ onSelect }: { onSelect: (p: PickedLocation) => void }) {
  useMapEvents({
    click: (e) => onSelect({ lat: e.latlng.lat, lng: e.latlng.lng }),
  });
  return null;
}

export default function LocationPickerInner({
  value,
  onPick,
}: {
  value?: PickedLocation | null;
  onPick: (point: PickedLocation, address: string) => void;
}) {
  const [point, setPoint] = useState<PickedLocation | null>(value ?? null);

  const select = async (p: PickedLocation) => {
    setPoint(p);
    onPick(p, await reverseGeocode(p));
  };

  return (
    <MapContainer
      bounds={CRETE_BOUNDS}
      scrollWheelZoom={true}
      className="h-64 w-full rounded-xl"
      style={{ minHeight: 256 }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <ClickHandler onSelect={select} />
      {point && (
        <Marker
          position={[point.lat, point.lng]}
          icon={PIN_ICON}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const ll = (e.target as LeafletMarker).getLatLng();
              select({ lat: ll.lat, lng: ll.lng });
            },
          }}
        />
      )}
    </MapContainer>
  );
}
