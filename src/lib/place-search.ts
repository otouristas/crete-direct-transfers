import { DESTINATIONS } from "@/data/destinations";
import { ROUTES } from "@/data/routes";
import { POPULAR_PLACES, WORLD_HUBS } from "@/data/world-hubs";
import {
  airportsInCountry,
  featuredAirports,
  getCountryName,
  getIataAirport,
  searchIataAirports,
  type IataAirport,
} from "@/data/iata-airports";

export type PlaceKind = "airport" | "port" | "destination" | "route-end" | "address";

export type PlaceResult = {
  id: string;
  label: string;
  kind: PlaceKind;
  lat?: number;
  lng?: number;
  routeEndKey?: string;
  iata?: string;
  /** ISO 3166-1 alpha-2 when known */
  countryCode?: string;
  countryName?: string;
};

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreMatch(label: string, query: string, aliases: string[] = []): number {
  const texts = [label, ...aliases];
  let best = 0;
  const q = normalize(query);
  if (!q) return 0;
  for (const text of texts) {
    const n = normalize(text);
    if (!n) continue;
    if (n === q) best = Math.max(best, 100);
    else if (n.startsWith(q)) best = Math.max(best, 80);
    else if (n.includes(q)) best = Math.max(best, 50);
    else {
      const tokens = q.split(" ");
      if (tokens.every((t) => n.includes(t))) best = Math.max(best, 40);
    }
  }
  return best;
}

export function routeEndKey(label: string): string {
  return normalize(label)
    .replace(/\bairport\b/g, "")
    .replace(/\bport\b/g, "")
    .replace(/\bher\b|\bchq\b|\bath\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function iataToPlace(a: IataAirport): PlaceResult {
  return {
    id: `airport:${a.iata}`,
    label: a.label,
    kind: "airport",
    lat: a.lat,
    lng: a.lng,
    iata: a.iata,
    countryCode: a.countryCode,
    countryName: a.countryName,
    routeEndKey: routeEndKey(`${a.name} ${a.iata} ${a.city}`),
  };
}

/** Non-airport curated catalog (ports, destinations, route ends). */
let localCache: PlaceResult[] | null = null;
let aliasMap: Map<string, string[]> | null = null;

function buildLocalCatalog(): PlaceResult[] {
  if (localCache) return localCache;

  const seen = new Set<string>();
  const out: PlaceResult[] = [];
  const aliases = new Map<string, string[]>();

  const push = (p: PlaceResult, extraAliases: string[] = []) => {
    const key = normalize(p.label);
    if (seen.has(key)) return;
    seen.add(key);
    out.push(p);
    if (extraAliases.length) aliases.set(p.id, extraAliases);
  };

  for (const h of WORLD_HUBS) {
    if (h.kind === "airport") continue; // full IATA catalog covers airports
    push(
      {
        id: h.id,
        label: h.label,
        kind: h.kind,
        lat: h.lat,
        lng: h.lng,
        iata: h.iata,
        countryCode: h.countryCode,
        countryName: h.countryCode ? getCountryName(h.countryCode) : undefined,
        routeEndKey: routeEndKey(h.label),
      },
      [...h.aliases, ...(h.iata ? [h.iata] : [])],
    );
  }

  for (const p of POPULAR_PLACES) {
    push(
      {
        id: p.id,
        label: p.label,
        kind: "destination",
        lat: p.lat,
        lng: p.lng,
        countryCode: p.countryCode,
        countryName: getCountryName(p.countryCode),
        routeEndKey: routeEndKey(p.label),
      },
      p.aliases ?? [],
    );
  }

  for (const d of DESTINATIONS) {
    if (d.type === "port") continue;
    if (out.some((p) => normalize(p.label) === normalize(d.name))) continue;
    push({
      id: `dest:${d.slug}`,
      label: d.name,
      kind: "destination",
      countryCode: d.island === "Crete" || d.region ? "GR" : undefined,
      countryName: "Greece",
      routeEndKey: routeEndKey(d.name),
    });
  }

  for (const r of ROUTES) {
    push({
      id: `end:from:${r.slug}`,
      label: r.from,
      kind: "route-end",
      countryCode: "GR",
      countryName: "Greece",
      routeEndKey: routeEndKey(r.from),
    });
    push({
      id: `end:to:${r.slug}`,
      label: r.to,
      kind: "route-end",
      countryCode: "GR",
      countryName: "Greece",
      routeEndKey: routeEndKey(r.to),
    });
  }

  localCache = out;
  aliasMap = aliases;
  return out;
}

function getAliases(id: string): string[] {
  if (!aliasMap) buildLocalCatalog();
  return aliasMap?.get(id) ?? [];
}

export type PlaceGroup = {
  kind: PlaceKind | "popular" | "in-country";
  label: string;
  places: PlaceResult[];
};

const DEFAULT_GROUP_LABELS: Record<PlaceGroup["kind"], string> = {
  airport: "Airports",
  port: "Ports",
  destination: "Places",
  "route-end": "Routes",
  address: "Addresses",
  popular: "Popular",
  "in-country": "In this country",
};

/** Resolve country from a selected place (airport IATA lookup as fallback). */
export function placeCountry(place: PlaceResult | null | undefined): string | undefined {
  if (!place) return undefined;
  if (place.countryCode) return place.countryCode;
  if (place.iata) return getIataAirport(place.iata)?.countryCode;
  if (place.id.startsWith("airport:")) {
    return getIataAirport(place.id.slice("airport:".length))?.countryCode;
  }
  return undefined;
}

/** Ports + cities + other airports in the same country as the partner end. */
export function suggestForCountry(
  countryCode: string,
  opts?: { excludeId?: string; limit?: number },
): PlaceResult[] {
  const cc = countryCode.toUpperCase();
  const limit = opts?.limit ?? 14;
  const local = buildLocalCatalog();
  const out: PlaceResult[] = [];
  const seen = new Set<string>();

  const push = (p: PlaceResult) => {
    if (opts?.excludeId && p.id === opts.excludeId) return;
    if (seen.has(p.id)) return;
    seen.add(p.id);
    out.push(p);
  };

  // Ports first (transfer hubs)
  for (const p of local) {
    if (p.kind === "port" && p.countryCode === cc) push(p);
  }
  // Popular / destination cities
  for (const p of local) {
    if ((p.kind === "destination" || p.kind === "route-end") && p.countryCode === cc) push(p);
  }
  // Other airports in country
  for (const a of airportsInCountry(cc, 8)) {
    push(iataToPlace(a));
  }

  return out.slice(0, limit);
}

/**
 * Empty-state groups.
 * When `contextPlace` is an airport (or has a country), propose same-country ports/cities.
 */
export function getQuickPickGroups(
  limitPerGroup = 6,
  groupLabels: Partial<Record<PlaceGroup["kind"], string>> = {},
  contextPlace?: PlaceResult | null,
): PlaceGroup[] {
  const labels = { ...DEFAULT_GROUP_LABELS, ...groupLabels };
  const cc = placeCountry(contextPlace);

  if (cc) {
    const countryName = getCountryName(cc);
    const inCountry = suggestForCountry(cc, {
      excludeId: contextPlace?.id,
      limit: limitPerGroup * 3,
    });
    const ports = inCountry.filter((p) => p.kind === "port").slice(0, limitPerGroup);
    const places = inCountry
      .filter((p) => p.kind === "destination" || p.kind === "route-end")
      .slice(0, limitPerGroup);
    const airports = inCountry.filter((p) => p.kind === "airport").slice(0, limitPerGroup);

    return [
      {
        kind: "in-country" as const,
        label: (labels["in-country"] ?? "In {country}").replace("{country}", countryName),
        places: inCountry.slice(0, limitPerGroup),
      },
      { kind: "port" as const, label: labels.port, places: ports },
      { kind: "destination" as const, label: labels.destination, places: places },
      { kind: "airport" as const, label: labels.airport, places: airports },
    ].filter((g) => g.places.length > 0);
  }

  const airports = featuredAirports(Math.max(limitPerGroup, 10)).map(iataToPlace);
  const ports = WORLD_HUBS.filter((h) => h.kind === "port")
    .slice(0, Math.max(limitPerGroup, 8))
    .map((h) => buildLocalCatalog().find((p) => p.id === h.id)!)
    .filter(Boolean);
  const popular = [
    ...POPULAR_PLACES.map((p) => buildLocalCatalog().find((c) => c.id === p.id)!).filter(Boolean),
    ...WORLD_HUBS.filter((h) => h.kind === "port" && h.popular)
      .map((h) => buildLocalCatalog().find((p) => p.id === h.id)!)
      .filter(Boolean),
  ].slice(0, limitPerGroup);

  return [
    { kind: "airport" as const, label: labels.airport, places: airports },
    { kind: "port" as const, label: labels.port, places: ports },
    { kind: "popular" as const, label: labels.popular, places: popular },
  ].filter((g) => g.places.length > 0);
}

/** Local curated + IATA airport search. */
export function searchLocalPlaces(
  query: string,
  limit = 12,
  contextPlace?: PlaceResult | null,
): PlaceResult[] {
  const q = query.trim();
  const cc = placeCountry(contextPlace);

  if (!q) {
    if (cc) return suggestForCountry(cc, { excludeId: contextPlace?.id, limit });
    const groups = getQuickPickGroups(4, {}, contextPlace);
    const flat: PlaceResult[] = [];
    for (const g of groups) {
      for (const p of g.places) {
        if (flat.length >= limit) break;
        if (!flat.some((x) => x.id === p.id)) flat.push(p);
      }
    }
    return flat;
  }

  const local = buildLocalCatalog();
  const localHits = local
    .map((p) => ({
      p,
      score:
        scoreMatch(p.label, q, [...getAliases(p.id), ...(p.iata ? [p.iata] : [])]) +
        (cc && p.countryCode === cc ? 12 : 0),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);

  const airportHits = searchIataAirports(q, limit).map(iataToPlace);

  const seen = new Set<string>();
  const merged: PlaceResult[] = [];
  for (const p of [...localHits, ...airportHits]) {
    if (seen.has(p.id) || seen.has(normalize(p.label))) continue;
    seen.add(p.id);
    seen.add(normalize(p.label));
    merged.push(p);
    if (merged.length >= limit) break;
  }

  // Same-country boost: move matching country to front when context set
  if (cc) {
    merged.sort((a, b) => {
      const ac = a.countryCode === cc ? 1 : 0;
      const bc = b.countryCode === cc ? 1 : 0;
      return bc - ac;
    });
  }

  return merged;
}

type PhotonFeature = {
  properties: {
    osm_id?: number;
    name?: string;
    street?: string;
    housenumber?: string;
    city?: string;
    town?: string;
    village?: string;
    country?: string;
    countrycode?: string;
    osm_value?: string;
    osm_key?: string;
    type?: string;
  };
  geometry: { coordinates: [number, number] };
};

function photonLabel(f: PhotonFeature): string {
  const p = f.properties;
  const parts = [
    [p.name, p.housenumber, p.street].filter(Boolean).join(" ").trim() || p.name,
    p.city || p.town || p.village,
    p.country,
  ].filter(Boolean);
  return parts.join(", ");
}

function photonKind(f: PhotonFeature): PlaceKind {
  const v =
    `${f.properties.osm_value || ""} ${f.properties.osm_key || ""} ${f.properties.type || ""}`.toLowerCase();
  if (v.includes("aerodrome") || v.includes("airport")) return "airport";
  if (v.includes("ferry") || v.includes("harbour") || v.includes("harbor") || v.includes("port"))
    return "port";
  if (v.includes("hotel") || v.includes("hostel") || v.includes("motel")) return "destination";
  return "address";
}

/** Worldwide autocomplete via Photon — bias to partner coords / country when known. */
export async function searchPhoton(
  query: string,
  limit = 5,
  bias?: { lat: number; lng: number; countryCode?: string },
): Promise<PlaceResult[]> {
  const q = query.trim();
  if (q.length < 3) return [];

  const params = new URLSearchParams({
    q,
    limit: String(limit),
    lang: "en",
  });
  if (bias) {
    params.set("lat", String(bias.lat));
    params.set("lon", String(bias.lng));
  }

  const res = await fetch(`https://photon.komoot.io/api/?${params}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return [];

  const data = (await res.json()) as { features?: PhotonFeature[] };
  let features = data.features ?? [];
  if (bias?.countryCode) {
    const cc = bias.countryCode.toLowerCase();
    const preferred = features.filter((f) => (f.properties.countrycode || "").toLowerCase() === cc);
    if (preferred.length)
      features = [...preferred, ...features.filter((f) => !preferred.includes(f))];
  }

  return features.slice(0, limit).map((f, i) => {
    const [lng, lat] = f.geometry.coordinates;
    const label = photonLabel(f) || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    const cc = f.properties.countrycode?.toUpperCase();
    return {
      id: `photon:${f.properties.osm_id ?? i}:${lat.toFixed(4)}:${lng.toFixed(4)}`,
      label,
      kind: photonKind(f),
      lat,
      lng,
      countryCode: cc,
      countryName: cc ? getCountryName(cc) : f.properties.country,
      routeEndKey: routeEndKey(label),
    };
  });
}

/** Combined search: local hubs + full IATA + Photon (hotels/addresses worldwide). */
export async function searchPlaces(
  query: string,
  limit = 10,
  contextPlace?: PlaceResult | null,
): Promise<PlaceResult[]> {
  const local = searchLocalPlaces(query, limit, contextPlace);
  if (query.trim().length < 3) return local;

  try {
    const bias =
      contextPlace?.lat != null && contextPlace?.lng != null
        ? {
            lat: contextPlace.lat,
            lng: contextPlace.lng,
            countryCode: placeCountry(contextPlace),
          }
        : undefined;
    const remote = await searchPhoton(query, 5, bias);
    const seen = new Set(local.map((p) => normalize(p.label)));
    const merged = [...local];
    for (const r of remote) {
      if (seen.has(normalize(r.label))) continue;
      seen.add(normalize(r.label));
      merged.push(r);
      if (merged.length >= limit) break;
    }
    return merged;
  } catch {
    return local;
  }
}

export function matchRouteSlug(
  from: PlaceResult | null,
  to: PlaceResult | null,
): string | undefined {
  if (!from || !to) return undefined;

  const fromKeys = new Set([from.routeEndKey, routeEndKey(from.label)].filter(Boolean) as string[]);
  const toKeys = new Set([to.routeEndKey, routeEndKey(to.label)].filter(Boolean) as string[]);

  const matches = (a: string, keys: Set<string>) => {
    const k = routeEndKey(a);
    if (keys.has(k)) return true;
    for (const key of keys) {
      if (key.length < 3) continue;
      if (k.includes(key) || key.includes(k)) return true;
    }
    return false;
  };

  for (const r of ROUTES) {
    if (matches(r.from, fromKeys) && matches(r.to, toKeys)) return r.slug;
    if (matches(r.from, toKeys) && matches(r.to, fromKeys)) return r.slug;
  }
  return undefined;
}
