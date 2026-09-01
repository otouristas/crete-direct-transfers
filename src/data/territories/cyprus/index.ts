import type { Territory, TerritoryDataset } from "@/data/territory";
import { tagTerritory } from "@/data/territory";
import { buildRegions, type RegionRecord } from "@/data/region-record";
import type { RouteData } from "@/data/routes";
import { getCityImage, imageUrl } from "@/lib/place-image";

export const CYPRUS: Territory = {
  slug: "cyprus",
  name: "Cyprus",
  kind: "island",
  marketSlug: "cyprus",
  countryCode: "CY",
  countryName: "Cyprus",
  timezone: "Asia/Nicosia",
  status: "planned",
  tagline: "Larnaca and Paphos arrivals, island-wide fixed prices.",
  heroTitle: "Private transfers across Cyprus",
  heroBody:
    "Larnaca and Paphos airports to Ayia Napa, Limassol, Protaras and the Troodos villages — one price agreed before the wheels move.",
  metaTitle: "Cyprus Private Transfers | Larnaca & Paphos Airports",
  metaDescription:
    "Fixed-price private transfers in Cyprus — LCA and PFO airports to Ayia Napa, Protaras, Limassol, Paphos and Nicosia. Licensed drivers and flight tracking.",
  center: { lat: 34.92, lng: 33.15 },
  bbox: [32.27, 34.55, 34.6, 35.7],
  gateways: [
    { kind: "airport", name: "Larnaca International Airport", code: "LCA" },
    { kind: "airport", name: "Paphos International Airport", code: "PFO" },
    { kind: "port", name: "Limassol Port" },
  ],
  pricing: { currency: "EUR", floorEur: 32, perKmEur: 1.05, nightSurchargePct: 15 },
  locales: ["en", "el", "de", "fr", "it", "nl", "es"],
  neighbours: ["crete", "athens"],
};

const IMG = {
  coast: imageUrl(getCityImage("limassol"), { width: 1600 }),
  town: imageUrl(getCityImage("paphos"), { width: 1600 }),
};

const REGION_RECORDS: RegionRecord[] = [
  {
    slug: "famagusta-coast",
    name: "Famagusta Coast",
    headline: "Ayia Napa, Protaras and Cape Greco.",
    intro: "The southeast beach belt — the busiest arrival corridor out of Larnaca.",
    body: "Ayia Napa and Protaras sit forty to fifty minutes from Larnaca on the A3. Summer nights turn the resort strips one-way in places, so drivers approach from the ring road rather than through the centre.",
    hotels: ["Ayia Napa", "Protaras", "Pernera", "Cape Greco"],
    gateway: "Larnaca Airport (LCA)",
  },
  {
    slug: "limassol-district",
    name: "Limassol District",
    headline: "Marina, seafront hotels and the wine villages behind.",
    intro: "The business and cruise capital, halfway between both airports.",
    body: "Limassol is the natural midpoint of the island: forty-five minutes from Larnaca, fifty from Paphos. The marina and the old port district have restricted access at peak evenings, and the Troodos wine villages sit an hour uphill.",
    hotels: ["Limassol Marina", "Amathus", "Germasogeia", "Pissouri"],
    gateway: "Larnaca (LCA) & Paphos (PFO) Airports",
  },
  {
    slug: "paphos-district",
    name: "Paphos District",
    headline: "Coral Bay, Kato Paphos and the Akamas edge.",
    intro: "The western resorts, with their own airport and the island's quietest coast.",
    body: "Paphos airport is fifteen minutes from Kato Paphos and thirty from Coral Bay. Beyond Latchi the Akamas peninsula turns to dirt track, so we drop at the trailhead rather than pretending otherwise.",
    hotels: ["Kato Paphos", "Coral Bay", "Latchi", "Polis"],
    gateway: "Paphos Airport (PFO)",
  },
];

const ROUTES: RouteData[] = [
  {
    slug: "larnaca-airport-to-ayia-napa",
    from: "Larnaca Airport (LCA)",
    to: "Ayia Napa",
    distanceKm: 48,
    durationMin: 45,
    basePriceEur: 60,
    heroImage: IMG.coast,
    blurb: "The classic southeast run down the A3 to the resort strip.",
    notes: "Peak-season evenings slow the last kilometre; drivers use the ring road into the hotels.",
    region: "Famagusta Coast",
    service: "airport",
  },
  {
    slug: "larnaca-airport-to-protaras",
    from: "Larnaca Airport (LCA)",
    to: "Protaras",
    distanceKm: 60,
    durationMin: 55,
    basePriceEur: 70,
    heroImage: IMG.coast,
    blurb: "Past Ayia Napa to the quieter Fig Tree Bay side.",
    notes: "Motorway then coastal road — under an hour outside August weekends.",
    region: "Famagusta Coast",
    service: "airport",
  },
  {
    slug: "larnaca-airport-to-limassol",
    from: "Larnaca Airport (LCA)",
    to: "Limassol",
    distanceKm: 65,
    durationMin: 50,
    basePriceEur: 75,
    heroImage: IMG.coast,
    blurb: "West on the A5 to the marina and the seafront hotels.",
    notes: "Cruise turnaround days congest the old port district — we allow for it.",
    region: "Limassol District",
    service: "airport",
  },
  {
    slug: "paphos-airport-to-coral-bay",
    from: "Paphos Airport (PFO)",
    to: "Coral Bay",
    distanceKm: 30,
    durationMin: 35,
    basePriceEur: 55,
    heroImage: IMG.town,
    blurb: "Through Paphos and up the coast road to Coral Bay.",
    notes: "Villa drop-offs need the plot number — the hillside lanes repeat street names.",
    region: "Paphos District",
    service: "airport",
  },
  {
    slug: "paphos-airport-to-kato-paphos",
    from: "Paphos Airport (PFO)",
    to: "Kato Paphos",
    distanceKm: 14,
    durationMin: 18,
    basePriceEur: 35,
    heroImage: IMG.town,
    blurb: "The short hop to the harbour and the archaeological park hotels.",
    notes: "Harbour promenade is pedestrianised in the evenings; we drop at the hotel entrance side.",
    region: "Paphos District",
    service: "airport",
  },
  {
    slug: "limassol-to-paphos",
    from: "Limassol",
    to: "Paphos",
    distanceKm: 68,
    durationMin: 55,
    basePriceEur: 85,
    heroImage: IMG.coast,
    blurb: "Coast-to-coast on the A6, with the Aphrodite rock on the way.",
    notes: "A photo stop at Petra tou Romiou adds ten minutes and costs nothing extra.",
    region: "Limassol District",
    service: "cross-island",
  },
];

export const CYPRUS_DATASET: TerritoryDataset = {
  territory: CYPRUS,
  routes: tagTerritory(ROUTES, CYPRUS.slug),
  regions: buildRegions(REGION_RECORDS, CYPRUS.slug),
};
