/**
 * Leaf module for region authoring, kept separate from the `regions.ts` barrel
 * so territory datasets can build regions without importing the merged registry.
 */
import { getRegionImage, imageUrl } from "@/lib/place-image";

export type RegionData = {
  slug: string;
  /** Display name. Also what `RouteData.region` references. */
  name: string;
  headline: string;
  intro: string;
  body: string;
  heroImage: string;
  hotels: string[];
  gateway: string;
  /** Owning territory slug — stamped by the dataset. */
  territory?: string;
};

export type RegionRecord = Omit<RegionData, "heroImage" | "territory">;

/** Hero imagery comes from the Pexels manifest — see scripts/fetch-pexels-images.mjs. */
export function buildRegions(records: RegionRecord[], territory: string): RegionData[] {
  return records.map((region) => ({
    ...region,
    territory,
    heroImage: imageUrl(getRegionImage(region.slug), { width: 2000 }),
  }));
}
