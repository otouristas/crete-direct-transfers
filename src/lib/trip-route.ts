/** Driving distance / duration via public OSRM demo server. */

export type TripGeometry = [number, number][]; // [lat, lng][]

export type TripRouteResult = {
  distanceKm: number;
  durationMin: number;
  geometry: TripGeometry;
};

const cache = new Map<string, TripRouteResult>();

function cacheKey(from: { lat: number; lng: number }, to: { lat: number; lng: number }): string {
  const r = (n: number) => n.toFixed(4);
  return `${r(from.lat)},${r(from.lng)}>${r(to.lat)},${r(to.lng)}`;
}

/** Haversine fallback when OSRM is unavailable (road factor ~1.35). */
export function haversineEstimate(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
): TripRouteResult {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) * Math.sin(dLng / 2) ** 2;
  const straight = 2 * R * Math.asin(Math.sqrt(a));
  const distanceKm = Math.round(straight * 1.35 * 10) / 10;
  const durationMin = Math.max(5, Math.round((distanceKm / 55) * 60));
  return {
    distanceKm,
    durationMin,
    geometry: [
      [from.lat, from.lng],
      [to.lat, to.lng],
    ],
  };
}

/**
 * Fetch driving route. Returns cached result when available.
 * Falls back to haversine if OSRM fails.
 *
 * Production: set VITE_OSRM_URL to a self-hosted or paid OSRM endpoint
 * (same /route/v1/driving/... path). Defaults to the public demo server.
 */
export async function fetchTripRoute(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
): Promise<TripRouteResult> {
  const key = cacheKey(from, to);
  const hit = cache.get(key);
  if (hit) return hit;

  const osrmBase =
    (import.meta.env.VITE_OSRM_URL as string | undefined)?.replace(/\/$/, "") ??
    "https://router.project-osrm.org";

  try {
    const url =
      `${osrmBase}/route/v1/driving/` +
      `${from.lng},${from.lat};${to.lng},${to.lat}` +
      `?overview=full&geometries=geojson`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);

    if (!res.ok) throw new Error(`OSRM ${res.status}`);
    const data = (await res.json()) as {
      code?: string;
      routes?: {
        distance: number;
        duration: number;
        geometry?: { coordinates: [number, number][] };
      }[];
    };

    const route = data.routes?.[0];
    if (!route || data.code !== "Ok") throw new Error("No route");

    const geometry: TripGeometry = (route.geometry?.coordinates ?? []).map(([lng, lat]) => [
      lat,
      lng,
    ]);
    if (geometry.length < 2) {
      geometry.push([from.lat, from.lng], [to.lat, to.lng]);
    }

    const result: TripRouteResult = {
      distanceKm: Math.round((route.distance / 1000) * 10) / 10,
      durationMin: Math.max(1, Math.round(route.duration / 60)),
      geometry,
    };
    cache.set(key, result);
    return result;
  } catch {
    const fallback = haversineEstimate(from, to);
    cache.set(key, fallback);
    return fallback;
  }
}
