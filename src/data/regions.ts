/**
 * Regions barrel — merged across every registered territory.
 *
 * Authoring lives in `src/data/territories/<slug>/`; this file only exposes the
 * merged view plus lookups.
 */
import { ALL_REGIONS, PUBLISHED_REGIONS, regionsInTerritory } from "@/data/territories";

export type { RegionData, RegionRecord } from "@/data/region-record";
export { buildRegions } from "@/data/region-record";
import type { RegionData } from "@/data/region-record";

export const REGIONS: RegionData[] = PUBLISHED_REGIONS;

/** Every region including `planned` territories — internal tooling only. */
export const REGION_CATALOG: RegionData[] = ALL_REGIONS;

export function getRegion(slug: string): RegionData | undefined {
  return REGIONS.find((r) => r.slug === slug);
}

export function getRegionByName(name: string): RegionData | undefined {
  return REGIONS.find((r) => r.name === name);
}

export function regionsByTerritory(territory: string): RegionData[] {
  return regionsInTerritory(territory);
}
