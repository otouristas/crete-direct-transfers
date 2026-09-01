/**
 * Regions barrel — merged across every registered territory.
 *
 * Authoring lives in `src/data/territories/<slug>/`; this file only exposes the
 * merged view plus lookups.
 */
import { ALL_REGIONS, regionsInTerritory } from "@/data/territories";

export type { RegionData, RegionRecord } from "@/data/region-record";
export { buildRegions } from "@/data/region-record";
import type { RegionData } from "@/data/region-record";

export const REGIONS: RegionData[] = ALL_REGIONS;

export function getRegion(slug: string): RegionData | undefined {
  return REGIONS.find((r) => r.slug === slug);
}

export function getRegionByName(name: string): RegionData | undefined {
  return REGIONS.find((r) => r.name === name);
}

export function regionsByTerritory(territory: string): RegionData[] {
  return regionsInTerritory(territory);
}
