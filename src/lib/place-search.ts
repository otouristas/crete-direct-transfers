import { DESTINATIONS } from "@/data/destinations";
import { AIRPORTS } from "@/data/airports";
import { ROUTES } from "@/data/routes";

export type PlaceKind = "airport" | "destination" | "route-end" | "address";

export type PlaceResult = {
  id: string;
  label: string;
  kind: PlaceKind;
  /** Optional coords when known (airports / geocoded addresses). */
  lat?: number;
  lng?: number;
  /** Hint for matching a priced ROUTES slug when paired with the other end. */
  routeEndKey?: string;
};

const CRETE_VIEWBOX = "23.3,34.8,26.4,35.8"; // lonW,latS,lonE,latN

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreMatch(label: string, query: string): number {
  const n = normalize(label);
  const q = normalize(query);
  if (!q) return 0;
  if (n === q) return 100;
  if (n.startsWith(q)) return 80;
  if (n.includes(q)) return 50;
  const tokens = q.split(" ");
  if (tokens.every((t) => n.includes(t))) return 40;
  return 0;
}

/** Build a stable lookup key for route endpoint matching. */
export function routeEndKey(label: string): string {
  return normalize(label)
    .replace(/\bairport\b/g, "")
    .replace(/\bher\b|\bchq\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

let catalogCache: PlaceResult[] | null = null;

function buildCatalog(): PlaceResult[] {
  if (catalogCache) return catalogCache;

  const seen = new Set<string>();
  const out: PlaceResult[] = [];

  const push = (p: PlaceResult) => {
    const key = normalize(p.label);
    if (seen.has(key)) return;
    seen.add(key);
    out.push(p);
  };

  for (const a of AIRPORTS) {
    push({
      id: `airport:${a.iata}`,
      label: `${a.name} (${a.iata})`,
      kind: "airport",
      routeEndKey: routeEndKey(`${a.name} ${a.iata}`),
    });
  }

  for (const d of DESTINATIONS) {
    push({
      id: `dest:${d.slug}`,
      label: d.name,
      kind: "destination",
      routeEndKey: routeEndKey(d.name),
    });
  }

  for (const r of ROUTES) {
    push({
      id: `end:from:${r.slug}`,
      label: r.from,
      kind: "route-end",
      routeEndKey: routeEndKey(r.from),
    });
    push({
      id: `end:to:${r.slug}`,
      label: r.to,
      kind: "route-end",
      routeEndKey: routeEndKey(r.to),
    });
  }

  catalogCache = out;
  return out;
}

/** Local curated suggestions (destinations, airports, route endpoints). */
export function searchLocalPlaces(query: string, limit = 8): PlaceResult[] {
  const catalog = buildCatalog();
  const q = query.trim();
  if (!q) {
    // Default: Crete airports + popular destinations
    const preferred = catalog.filter(
      (p) =>
        p.id === "airport:HER" ||
        p.id === "airport:CHQ" ||
        p.id.startsWith("dest:heraklion") ||
        p.id.startsWith("dest:chania") ||
        p.id.startsWith("dest:elounda") ||
        p.id.startsWith("dest:rethymno") ||
        p.id.startsWith("dest:hersonissos"),
    );
    return preferred.slice(0, limit);
  }

  return catalog
    .map((p) => ({ p, score: scoreMatch(p.label, q) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => {
      // Boost Crete airports
      const boost = (id: string) => (id === "airport:HER" || id === "airport:CHQ" ? 10 : 0);
      return b.score + boost(b.p.id) - (a.score + boost(a.p.id));
    })
    .slice(0, limit)
    .map((x) => x.p);
}

type NominatimItem = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
};

/** Forward geocode via Nominatim, biased to Crete / Greece. */
export async function searchNominatim(query: string, limit = 5): Promise<PlaceResult[]> {
  const q = query.trim();
  if (q.length < 3) return [];

  const params = new URLSearchParams({
    format: "jsonv2",
    q,
    countrycodes: "gr",
    limit: String(limit),
    viewbox: CRETE_VIEWBOX,
    bounded: "0",
  });

  const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return [];

  const data = (await res.json()) as NominatimItem[];
  return data.map((item) => ({
    id: `osm:${item.place_id}`,
    label: item.display_name.split(",").slice(0, 3).join(",").trim(),
    kind: "address" as const,
    lat: Number(item.lat),
    lng: Number(item.lon),
  }));
}

/** Combined local + remote search. Local first; Nominatim fills gaps. */
export async function searchPlaces(query: string, limit = 8): Promise<PlaceResult[]> {
  const local = searchLocalPlaces(query, limit);
  if (query.trim().length < 3) return local;

  try {
    const remote = await searchNominatim(query, 4);
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

/** Find a priced route slug when both ends match ROUTES from/to (either direction). */
export function matchRouteSlug(
  from: PlaceResult | null,
  to: PlaceResult | null,
): string | undefined {
  if (!from || !to) return undefined;

  const fromKeys = new Set(
    [from.routeEndKey, routeEndKey(from.label)].filter(Boolean) as string[],
  );
  const toKeys = new Set([to.routeEndKey, routeEndKey(to.label)].filter(Boolean) as string[]);

  const matches = (a: string, keys: Set<string>) => {
    const k = routeEndKey(a);
    if (keys.has(k)) return true;
    for (const key of keys) {
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
