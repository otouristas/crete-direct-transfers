/**
 * Territory registry.
 *
 * Adding a destination = create `src/data/territories/<slug>/index.ts` exporting
 * a `TerritoryDataset`, then add it to `DATASETS` below. Routes, regions, hubs,
 * quotes, sitemap entries and coverage maps all read from here.
 */
import type { Territory, TerritoryDataset, TerritoryStatus } from "@/data/territory";
import { isBookable, isPublished } from "@/data/territory";
import type { RouteData } from "@/data/routes";
import type { RegionData } from "@/data/regions";
import { CRETE_DATASET } from "./crete";
import { ATHENS_DATASET } from "./athens";
import { SANTORINI_DATASET } from "./santorini";
import { CYPRUS_DATASET } from "./cyprus";
import { COSTA_DEL_SOL_DATASET } from "./costa-del-sol";

export const DATASETS: TerritoryDataset[] = [
  CRETE_DATASET,
  ATHENS_DATASET,
  SANTORINI_DATASET,
  CYPRUS_DATASET,
  COSTA_DEL_SOL_DATASET,
];

export const TERRITORIES: Territory[] = DATASETS.map((d) => d.territory);

/** The territory the platform launched in — used as the default context. */
export const DEFAULT_TERRITORY = "crete";

export function getTerritory(slug: string): Territory | undefined {
  return TERRITORIES.find((t) => t.slug === slug);
}

export function listTerritories(status?: TerritoryStatus): Territory[] {
  return status ? TERRITORIES.filter((t) => t.status === status) : TERRITORIES;
}

export function bookableTerritories(): Territory[] {
  return TERRITORIES.filter(isBookable);
}

export function publishedTerritories(): Territory[] {
  return TERRITORIES.filter(isPublished);
}

export function territoriesInMarket(marketSlug: string): Territory[] {
  return TERRITORIES.filter((t) => t.marketSlug === marketSlug);
}

function datasetsFor(opts?: { publishedOnly?: boolean }): TerritoryDataset[] {
  return opts?.publishedOnly ? DATASETS.filter((d) => isPublished(d.territory)) : DATASETS;
}

/** All routes across every registered territory, tagged with `territory`. */
export const ALL_ROUTES: RouteData[] = DATASETS.flatMap((d) => d.routes);

/** All regions across every registered territory, tagged with `territory`. */
export const ALL_REGIONS: RegionData[] = DATASETS.flatMap((d) => d.regions);

/** Routes we actually publish pages for (excludes `planned` territories). */
export const PUBLISHED_ROUTES: RouteData[] = datasetsFor({ publishedOnly: true }).flatMap(
  (d) => d.routes,
);

export function routesInTerritory(slug: string): RouteData[] {
  return ALL_ROUTES.filter((r) => r.territory === slug);
}

export function regionsInTerritory(slug: string): RegionData[] {
  return ALL_REGIONS.filter((r) => r.territory === slug);
}

export function territoryForRoute(routeSlug: string): Territory | undefined {
  const route = ALL_ROUTES.find((r) => r.slug === routeSlug);
  return route?.territory ? getTerritory(route.territory) : undefined;
}

export function territoryForRegion(regionSlugOrName: string): Territory | undefined {
  const region = ALL_REGIONS.find(
    (r) => r.slug === regionSlugOrName || r.name === regionSlugOrName,
  );
  return region?.territory ? getTerritory(region.territory) : undefined;
}

/** Group any territory-tagged collection for rendering hubs. */
export function groupByTerritory<T extends { territory?: string }>(
  records: T[],
): { territory: Territory; items: T[] }[] {
  return TERRITORIES.map((territory) => ({
    territory,
    items: records.filter((r) => (r.territory ?? DEFAULT_TERRITORY) === territory.slug),
  })).filter((group) => group.items.length > 0);
}

export type { Territory, TerritoryDataset, TerritoryStatus };
