import { Link } from "@tanstack/react-router";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { divIcon, type LatLngBoundsExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

const CRETE_BOUNDS: LatLngBoundsExpression = [
  [34.75, 23.3],
  [35.75, 26.4],
];

type Hub = {
  name: string;
  lat: number;
  lng: number;
  kind: "airport" | "port" | "town";
  routeSlug?: string;
};

const HUBS: Hub[] = [
  {
    name: "Heraklion Airport (HER)",
    lat: 35.3397,
    lng: 25.1803,
    kind: "airport",
    routeSlug: "heraklion-airport-to-elounda",
  },
  {
    name: "Chania Airport (CHQ)",
    lat: 35.5317,
    lng: 24.1497,
    kind: "airport",
    routeSlug: "chania-airport-to-chania-old-town",
  },
  {
    name: "Heraklion Port",
    lat: 35.345,
    lng: 25.145,
    kind: "port",
    routeSlug: "heraklion-port-to-matala",
  },
  {
    name: "Souda Port",
    lat: 35.49,
    lng: 24.075,
    kind: "port",
    routeSlug: "souda-port-to-chania-old-town",
  },
  {
    name: "Chania Old Town",
    lat: 35.5175,
    lng: 24.0195,
    kind: "town",
    routeSlug: "chania-airport-to-chania-old-town",
  },
  {
    name: "Rethymno",
    lat: 35.366,
    lng: 24.482,
    kind: "town",
    routeSlug: "heraklion-airport-to-rethymno",
  },
  {
    name: "Hersonissos",
    lat: 35.3183,
    lng: 25.3927,
    kind: "town",
    routeSlug: "heraklion-airport-to-hersonissos",
  },
  {
    name: "Agios Nikolaos",
    lat: 35.1909,
    lng: 25.7162,
    kind: "town",
    routeSlug: "heraklion-airport-to-agios-nikolaos",
  },
  {
    name: "Elounda",
    lat: 35.2642,
    lng: 25.7217,
    kind: "town",
    routeSlug: "heraklion-airport-to-elounda",
  },
  {
    name: "Matala",
    lat: 34.995,
    lng: 24.7509,
    kind: "town",
    routeSlug: "heraklion-airport-to-matala",
  },
  {
    name: "Kissamos",
    lat: 35.4939,
    lng: 23.655,
    kind: "town",
    routeSlug: "chania-airport-to-kissamos",
  },
  {
    name: "Ierapetra",
    lat: 35.0111,
    lng: 25.7414,
    kind: "town",
    routeSlug: "heraklion-airport-to-ierapetra",
  },
];

const PLANE_SVG =
  '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>';
const ANCHOR_SVG =
  '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22V8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/><circle cx="12" cy="5" r="3"/></svg>';

function hubIcon(kind: Hub["kind"]) {
  if (kind === "town") {
    return divIcon({
      className: "",
      html: '<span style="display:block;width:14px;height:14px;border-radius:9999px;background:#14B8A6;border:2.5px solid #fff;box-shadow:0 1px 4px rgba(11,37,69,.4)"></span>',
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });
  }
  const glyph = kind === "airport" ? PLANE_SVG : ANCHOR_SVG;
  return divIcon({
    className: "",
    html: `<span style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:9999px;background:#0B2545;border:2.5px solid #fff;box-shadow:0 2px 6px rgba(11,37,69,.45)">${glyph}</span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

export default function CreteMapInner() {
  return (
    <MapContainer
      bounds={CRETE_BOUNDS}
      scrollWheelZoom={false}
      attributionControl={true}
      className="h-full w-full rounded-2xl"
      style={{ minHeight: 320 }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      {HUBS.map((hub) => (
        <Marker key={hub.name} position={[hub.lat, hub.lng]} icon={hubIcon(hub.kind)}>
          <Popup>
            <div style={{ fontFamily: "Inter, sans-serif" }}>
              <strong style={{ color: "#0B2545" }}>{hub.name}</strong>
              {hub.routeSlug && (
                <div style={{ marginTop: 4 }}>
                  <Link
                    to="/{-$locale}/routes/$slug"
                    params={{ slug: hub.routeSlug }}
                    style={{ color: "#0F766E", fontWeight: 600 }}
                  >
                    See transfers →
                  </Link>
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
