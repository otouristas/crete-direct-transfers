/**
 * Territory engine.
 *
 * A "territory" is one operating area we sell in — an island (Crete, Santorini),
 * a metro (Athens), or a coastal strip (Costa del Sol). Every piece of bookable
 * or editorial content is owned by exactly one territory, so rolling out a new
 * destination is a data job: drop a dataset in `src/data/territories/<slug>/`,
 * register it, and every hub, sitemap entry, quote and SEO page picks it up.
 *
 * Nothing here is Crete-specific. Crete is simply the first dataset.
 */
import type { RouteData } from "@/data/routes";
import type { RegionData } from "@/data/regions";

export type TerritoryKind = "island" | "metro" | "coast" | "region";

/** How mature a territory is — drives what we publish and what we sell. */
export type TerritoryStatus =
  /** Fixed prices, contracted drivers, instant confirmation. */
  | "live"
  /** Published pages, quote-on-request instead of instant booking. */
  | "beta"
  /** Data exists, pages stay out of the sitemap until drivers are signed. */
  | "planned";

export type TerritoryGateway = {
  kind: "airport" | "port" | "rail";
  name: string;
  /** IATA for airports, UN/LOCODE-ish label for ports. */
  code?: string;
  /** Slug in the global AIRPORTS / port catalogs, when one exists. */
  catalogSlug?: string;
};

/** Per-territory fare parameters used when no fixed route matches. */
export type TerritoryPricing = {
  currency: "EUR";
  /** Minimum fare for the economy class. */
  floorEur: number;
  /** Economy rate per kilometre. */
  perKmEur: number;
  /** Night surcharge window multiplier, as a percentage of the base. */
  nightSurchargePct: number;
};

export type Territory = {
  slug: string;
  name: string;
  kind: TerritoryKind;
  /** Country market this territory rolls up to (see `src/data/markets.ts`). */
  marketSlug: string;
  countryCode: string;
  countryName: string;
  timezone: string;
  status: TerritoryStatus;
  /** One-line positioning used on hubs and cards. */
  tagline: string;
  heroTitle: string;
  heroBody: string;
  metaTitle: string;
  metaDescription: string;
  /** Map centre for the hero canvas and coverage maps. */
  center: { lat: number; lng: number };
  /** Rough map extent [west, south, east, north] for auto-fitting. */
  bbox: [number, number, number, number];
  gateways: TerritoryGateway[];
  pricing: TerritoryPricing;
  /** Locales we have human-checked copy for. Falls back to `en`. */
  locales: string[];
  /** Territory this one is usually combined with, for cross-sell. */
  neighbours: string[];
};

export type TerritoryDataset = {
  territory: Territory;
  routes: RouteData[];
  regions: RegionData[];
};

/** Stamps every record with its owning territory so merged lists stay filterable. */
export function tagTerritory<T extends { territory?: string }>(
  records: T[],
  territorySlug: string,
): T[] {
  return records.map((record) => ({ ...record, territory: territorySlug }));
}

export function isBookable(territory: Territory): boolean {
  return territory.status === "live";
}

export function isPublished(territory: Territory): boolean {
  return territory.status !== "planned";
}
