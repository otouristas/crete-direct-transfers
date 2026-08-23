/**
 * Which airport pages we let search engines index.
 *
 * `airports.$slug` renders a page for any of the ~8,900 IATA airports via
 * `getAirportResolved`, but most of those pages are templated: only the airport
 * name, city and country differ. Publishing all of them would be a doorway-page
 * pattern, so indexing is opt-in and gated here.
 *
 * The tier is:
 *   1. Curated airports  — hand-written content (`src/data/airports.ts`).
 *   2. Market hubs       — per-airport intro + market supply (`src/data/market-hubs.ts`).
 *   3. In-market airports — every IATA airport inside a live market. We have a
 *      licensed local partner in these countries, so the page is honest even
 *      though its copy is generated. Airports outside a live market stay
 *      `noindex` until we either have supply or hand-written content.
 *
 * Widening the tier is a one-line change to LIVE_MARKET_COUNTRY_CODES; narrowing
 * it back is the same. Nothing else in the app needs to know.
 */
import { AIRPORTS } from "@/data/airports";
import { MARKET_HUB_AIRPORTS } from "@/data/market-hubs";
import { IATA_AIRPORTS, getIataAirport } from "@/data/iata-airports";
import { listLiveMarkets } from "@/data/markets";
import { airportSlug, iataFromSlug } from "./airport-slug";

/** ISO-3166 alpha-2 codes of the markets we actually operate in. */
const LIVE_MARKET_COUNTRY_CODES = new Set(
  listLiveMarkets().map((market) => market.countryCode.toUpperCase()),
);

/** Airports with hand-written or hub-level content, keyed by IATA. */
const AUTHORED_SLUG_BY_IATA = new Map<string, string>(
  [...AIRPORTS, ...MARKET_HUB_AIRPORTS].map((a) => [a.iata.toUpperCase(), a.slug]),
);

export type IndexableAirport = { slug: string; iata: string; countryCode: string };

let cache: IndexableAirport[] | null = null;

/**
 * Every airport page that belongs in the sitemap, canonical slug first: an
 * authored slug wins over the generated one so we never index two URLs for the
 * same airport.
 */
export function listIndexableAirports(): IndexableAirport[] {
  if (cache) return cache;
  const seen = new Set<string>();
  const out: IndexableAirport[] = [];

  for (const a of [...AIRPORTS, ...MARKET_HUB_AIRPORTS]) {
    const iata = a.iata.toUpperCase();
    if (seen.has(iata)) continue;
    seen.add(iata);
    out.push({
      slug: a.slug,
      iata,
      countryCode: getIataAirport(iata)?.countryCode ?? "",
    });
  }

  for (const [iata, , , countryCode] of IATA_AIRPORTS) {
    const cc = countryCode.toUpperCase();
    if (!LIVE_MARKET_COUNTRY_CODES.has(cc)) continue;
    if (seen.has(iata)) continue;
    const ia = getIataAirport(iata);
    if (!ia) continue;
    seen.add(iata);
    out.push({ slug: airportSlug(ia), iata, countryCode: cc });
  }

  cache = out;
  return out;
}

/** True when this airport slug may be indexed and served in every public locale. */
export function isIndexableAirport(slug: string): boolean {
  const iata = iataFromSlug(slug);
  if (!iata) return false;

  const authored = AUTHORED_SLUG_BY_IATA.get(iata);
  // An authored airport is indexable only at its canonical slug — the generated
  // slug for the same IATA code must not become a second indexable URL.
  if (authored) return authored === slug;

  const ia = getIataAirport(iata);
  if (!ia) return false;
  if (!LIVE_MARKET_COUNTRY_CODES.has(ia.countryCode.toUpperCase())) return false;
  return airportSlug(ia) === slug;
}

export type IndexableAirportEntry = {
  slug: string;
  iata: string;
  name: string;
  city: string;
  /** True for airports with hand-written or hub-level content. */
  authored: boolean;
};

export type AirportCountryGroup = {
  countryCode: string;
  countryName: string;
  airports: IndexableAirportEntry[];
};

/**
 * Every indexable airport grouped by country, largest group first. Used by the
 * airports directory so no indexable page is orphaned — a URL in the sitemap
 * with no internal link is a page search engines discover but never trust.
 */
export function listIndexableAirportsByCountry(): AirportCountryGroup[] {
  const groups = new Map<string, AirportCountryGroup>();

  for (const a of listIndexableAirports()) {
    const ia = getIataAirport(a.iata);
    if (!ia || !a.countryCode) continue;
    let group = groups.get(a.countryCode);
    if (!group) {
      group = { countryCode: a.countryCode, countryName: ia.countryName, airports: [] };
      groups.set(a.countryCode, group);
    }
    group.airports.push({
      slug: a.slug,
      iata: a.iata,
      name: ia.name,
      city: ia.city || ia.name,
      authored: AUTHORED_SLUG_BY_IATA.get(a.iata) === a.slug,
    });
  }

  for (const group of groups.values()) {
    group.airports.sort((x, y) =>
      x.authored === y.authored ? x.name.localeCompare(y.name) : x.authored ? -1 : 1,
    );
  }

  return [...groups.values()].sort((x, y) => y.airports.length - x.airports.length);
}
