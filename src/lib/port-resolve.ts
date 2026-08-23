/**
 * Ferry and cruise ports as a page family.
 *
 * We already index 40 ports for booking search but gave none of them a landing
 * page, so high-intent queries — "Piraeus port transfer", "Civitavecchia to Rome"
 * — had nothing to rank. This resolves a port slug to page data built from the
 * coordinates we already ship, and applies the same market-gated indexing policy
 * as airports: ports inside a live market are indexable, the rest are not.
 */
import { WORLD_HUBS, type WorldHub } from "@/data/world-hubs";
import { getIataAirport, IATA_COUNTRY_NAMES, airportsInCountry } from "@/data/iata-airports";
import { listLiveMarkets } from "@/data/markets";
import { haversineEstimate } from "@/lib/trip-route";
import { distanceBaseEur } from "@/lib/pricing";
import { airportSlug, kebab } from "./airport-slug";

const LIVE_MARKET_COUNTRY_CODES = new Set(
  listLiveMarkets().map((market) => market.countryCode.toUpperCase()),
);

export type PortData = {
  slug: string;
  id: string;
  /** Display name with the "Port" suffix intact, e.g. "Piraeus Port". */
  name: string;
  /** Bare place name for prose, e.g. "Piraeus". */
  placeName: string;
  aliases: string[];
  lat: number;
  lng: number;
  countryCode: string;
  countryName: string;
  popular: boolean;
  /** Cheapest realistic transfer from this port, derived from the nearest airport. */
  fromPriceEur: number;
  nearestAirport?: { iata: string; name: string; slug: string; distanceKm: number };
};

/**
 * Slug from the display name, not the internal id — the id is abbreviated
 * ("port:civita") and would produce URLs nobody searches for. "Civitavecchia
 * Port (Rome)" → `civitavecchia-port-transfers`.
 */
export function portSlug(label: string): string {
  const base = kebab(
    label
      .replace(/\s*\([^)]*\)\s*$/, "")
      // Strip only the final generic noun so any qualifier survives: "Barcelona
      // Cruise Port" and "Barcelona Ferry Terminal" must not collapse to one slug.
      .replace(/\s+(Port|Terminal|Center|Centre)$/i, "")
      .trim(),
  );
  if (/port$/.test(base) || /marina$/.test(base) || /^port-/.test(base)) {
    return `${base}-transfers`;
  }
  return `${base}-port-transfers`;
}

function placeNameFrom(label: string): string {
  return label
    .replace(/\s*\((?:[^)]*)\)\s*$/, "")
    .replace(
      /\s+(Cruise\s+)?(Port|Terminal|Marina|Ferry Terminal|Cruise Center|Cruise Terminal)$/i,
      "",
    )
    .trim();
}

const PORT_HUBS: WorldHub[] = WORLD_HUBS.filter((h) => h.kind === "port");

function toPortData(hub: WorldHub): PortData {
  const cc = (hub.countryCode ?? "").toUpperCase();
  const nearest = nearestAirportTo(hub.lat, hub.lng, cc);
  return {
    slug: portSlug(hub.label),
    id: hub.id,
    name: hub.label,
    placeName: placeNameFrom(hub.label),
    aliases: hub.aliases,
    lat: hub.lat,
    lng: hub.lng,
    countryCode: cc,
    countryName: IATA_COUNTRY_NAMES[cc] ?? cc,
    popular: Boolean(hub.popular),
    fromPriceEur: nearest ? distanceBaseEur(nearest.distanceKm) : distanceBaseEur(0),
    nearestAirport: nearest,
  };
}

function nearestAirportTo(lat: number, lng: number, countryCode: string) {
  if (!countryCode) return undefined;
  let best: { iata: string; name: string; slug: string; distanceKm: number } | undefined;
  for (const a of airportsInCountry(countryCode, 40)) {
    const { distanceKm } = haversineEstimate({ lat, lng }, { lat: a.lat, lng: a.lng });
    if (!best || distanceKm < best.distanceKm) {
      best = { iata: a.iata, name: a.name, slug: airportSlug(a), distanceKm };
    }
  }
  return best;
}

let cache: PortData[] | null = null;

export function listPorts(): PortData[] {
  if (!cache) {
    const built = PORT_HUBS.map(toPortData);
    // Two ports resolving to one slug would silently shadow each other and put
    // a dead URL in the sitemap, so make the collision loud at first read.
    const seen = new Set<string>();
    for (const port of built) {
      if (seen.has(port.slug)) {
        throw new Error(`Duplicate port slug "${port.slug}" (${port.id})`);
      }
      seen.add(port.slug);
    }
    cache = built;
  }
  return cache;
}

export function getPort(slug: string): PortData | undefined {
  return listPorts().find((p) => p.slug === slug);
}

/** Ports we let search engines index — same market gate as airports. */
export function listIndexablePorts(): PortData[] {
  return listPorts().filter((p) => LIVE_MARKET_COUNTRY_CODES.has(p.countryCode));
}

export function isIndexablePort(slug: string): boolean {
  const port = getPort(slug);
  return Boolean(port && LIVE_MARKET_COUNTRY_CODES.has(port.countryCode));
}

/** Other ports in the same country, nearest first. */
export function relatedPorts(port: PortData, limit = 8): PortData[] {
  return listPorts()
    .filter((p) => p.countryCode === port.countryCode && p.slug !== port.slug)
    .map((p) => ({
      port: p,
      km: haversineEstimate({ lat: port.lat, lng: port.lng }, { lat: p.lat, lng: p.lng })
        .distanceKm,
    }))
    .sort((a, b) => a.km - b.km)
    .slice(0, limit)
    .map((x) => x.port);
}

export type PortCountryGroup = { countryCode: string; countryName: string; ports: PortData[] };

export function listIndexablePortsByCountry(): PortCountryGroup[] {
  const groups = new Map<string, PortCountryGroup>();
  for (const port of listIndexablePorts()) {
    let group = groups.get(port.countryCode);
    if (!group) {
      group = { countryCode: port.countryCode, countryName: port.countryName, ports: [] };
      groups.set(port.countryCode, group);
    }
    group.ports.push(port);
  }
  for (const group of groups.values()) {
    group.ports.sort((a, b) =>
      a.popular === b.popular ? a.name.localeCompare(b.name) : a.popular ? -1 : 1,
    );
  }
  return [...groups.values()].sort((a, b) => b.ports.length - a.ports.length);
}

/** Airports near a port, for the "get to your ship" cross-links. */
export function airportsNearPort(port: PortData, limit = 6) {
  if (!port.countryCode) return [];
  return airportsInCountry(port.countryCode, 30)
    .map((a) => ({
      iata: a.iata,
      name: a.name,
      slug: airportSlug(a),
      distanceKm: haversineEstimate({ lat: port.lat, lng: port.lng }, { lat: a.lat, lng: a.lng })
        .distanceKm,
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}

/** Resolve an IATA code to a display name, used by the page copy. */
export function airportName(iata: string): string | undefined {
  return getIataAirport(iata)?.name;
}
