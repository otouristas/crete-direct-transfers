import type { Territory, TerritoryDataset } from "@/data/territory";
import { tagTerritory } from "@/data/territory";
import { CRETE_ROUTES } from "./routes";
import { CRETE_REGION_RECORDS } from "./regions";
import { buildRegions } from "@/data/region-record";

export const CRETE: Territory = {
  slug: "crete",
  name: "Crete",
  kind: "island",
  marketSlug: "greece",
  countryCode: "GR",
  countryName: "Greece",
  timezone: "Europe/Athens",
  status: "live",
  tagline: "Fixed price. Local drivers. No bidding.",
  heroTitle: "Private transfers across Crete",
  heroBody:
    "Every corridor on the island priced up front, driven by licensed Cretan drivers who know the hotel gates, the gorge roads and the ferry ramps.",
  metaTitle: "Crete Private Transfers | Fixed Prices, Local Drivers",
  metaDescription:
    "Book a fixed-price private transfer anywhere in Crete — Heraklion and Chania airports, Souda and Heraklion ports, every resort. Flight tracking, meet & greet.",
  center: { lat: 35.24, lng: 24.81 },
  bbox: [23.45, 34.8, 26.35, 35.72],
  gateways: [
    { kind: "airport", name: "Heraklion Airport", code: "HER" },
    { kind: "airport", name: "Chania International Airport", code: "CHQ" },
    { kind: "airport", name: "Sitia Airport", code: "JSH" },
    { kind: "port", name: "Heraklion Port" },
    { kind: "port", name: "Souda Port (Chania)" },
  ],
  pricing: { currency: "EUR", floorEur: 35, perKmEur: 1.15, nightSurchargePct: 15 },
  locales: ["en", "el", "de", "fr", "it", "nl", "es"],
  neighbours: ["santorini", "athens"],
};

export const CRETE_DATASET: TerritoryDataset = {
  territory: CRETE,
  routes: tagTerritory(CRETE_ROUTES, CRETE.slug),
  regions: buildRegions(CRETE_REGION_RECORDS, CRETE.slug),
};
