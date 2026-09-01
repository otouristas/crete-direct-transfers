import type { Territory, TerritoryDataset } from "@/data/territory";
import { tagTerritory } from "@/data/territory";
import { buildRegions, type RegionRecord } from "@/data/region-record";
import type { RouteData } from "@/data/routes";
import { getCityImage, imageUrl } from "@/lib/place-image";

export const COSTA_DEL_SOL: Territory = {
  slug: "costa-del-sol",
  name: "Costa del Sol",
  kind: "coast",
  marketSlug: "spain",
  countryCode: "ES",
  countryName: "Spain",
  timezone: "Europe/Madrid",
  status: "planned",
  tagline: "Málaga arrivals, Marbella and the western strip.",
  heroTitle: "Private transfers on the Costa del Sol",
  heroBody:
    "Málaga airport to Marbella, Puerto Banús, Estepona and Gibraltar — fixed prices, English-speaking drivers, no meter.",
  metaTitle: "Costa del Sol Private Transfers | Málaga Airport & Marbella",
  metaDescription:
    "Fixed-price transfers from Málaga Airport (AGP) to Marbella, Puerto Banús, Estepona, Fuengirola and Gibraltar. Licensed drivers, flight tracking, no surge pricing.",
  center: { lat: 36.55, lng: -4.8 },
  bbox: [-5.5, 36.3, -4.3, 36.85],
  gateways: [
    { kind: "airport", name: "Málaga-Costa del Sol Airport", code: "AGP" },
    { kind: "airport", name: "Gibraltar International Airport", code: "GIB" },
    { kind: "port", name: "Málaga Cruise Port" },
  ],
  pricing: { currency: "EUR", floorEur: 40, perKmEur: 1.1, nightSurchargePct: 15 },
  locales: ["en", "es", "de", "fr", "it", "nl", "el"],
  neighbours: [],
};

const IMG = {
  coast: imageUrl(getCityImage("marbella"), { width: 1600 }),
  city: imageUrl(getCityImage("malaga"), { width: 1600 }),
};

const REGION_RECORDS: RegionRecord[] = [
  {
    slug: "marbella-strip",
    name: "Marbella & Puerto Banús",
    headline: "The western strip, from Golden Mile to Banús.",
    intro: "Resort hotels, gated urbanisations and marina addresses that GPS rarely finds.",
    body: "Marbella addresses are usually an urbanisation plus a block, not a street number. Drivers ask for both up front so the arrival is a gate code away rather than a lap of the hill.",
    hotels: ["Golden Mile", "Puerto Banús", "Nueva Andalucía", "San Pedro"],
    gateway: "Málaga Airport (AGP)",
  },
  {
    slug: "malaga-city",
    name: "Málaga City",
    headline: "Old town, port and the museums.",
    intro: "Fifteen minutes from the terminal, with a low-emission core.",
    body: "The historic centre restricts traffic, so hotel access depends on the street. We confirm the nearest permitted entrance instead of circling the ring road.",
    hotels: ["Centro Histórico", "Malagueta", "Muelle Uno", "Soho"],
    gateway: "Málaga Airport (AGP) & Cruise Port",
  },
  {
    slug: "western-costa",
    name: "Estepona to Gibraltar",
    headline: "The quieter far west and the border run.",
    intro: "Estepona, Sotogrande, La Línea and the Gibraltar frontier.",
    body: "Beyond Estepona the coast empties out. Gibraltar transfers stop at the frontier by default; a Spanish-plated car crossing the border adds an unpredictable queue, so we hand over on the La Línea side unless you ask otherwise.",
    hotels: ["Estepona", "Sotogrande", "La Línea", "Gibraltar"],
    gateway: "Málaga (AGP) & Gibraltar (GIB) Airports",
  },
];

const ROUTES: RouteData[] = [
  {
    slug: "malaga-airport-to-marbella",
    from: "Málaga Airport (AGP)",
    to: "Marbella",
    distanceKm: 47,
    durationMin: 45,
    basePriceEur: 65,
    heroImage: IMG.coast,
    blurb: "The busiest corridor on the coast — AP-7 straight to the Golden Mile.",
    notes: "Give us the urbanisation name as well as the hotel; the hillside blocks repeat.",
    region: "Marbella & Puerto Banús",
    service: "airport",
  },
  {
    slug: "malaga-airport-to-puerto-banus",
    from: "Málaga Airport (AGP)",
    to: "Puerto Banús",
    distanceKm: 54,
    durationMin: 50,
    basePriceEur: 70,
    heroImage: IMG.coast,
    blurb: "To the marina, its hotels and the Nueva Andalucía villas.",
    notes: "Marina access closes to traffic on summer nights; drop-off is at the ramp entrance.",
    region: "Marbella & Puerto Banús",
    service: "airport",
  },
  {
    slug: "malaga-airport-to-malaga-city",
    from: "Málaga Airport (AGP)",
    to: "Málaga City Centre",
    distanceKm: 9,
    durationMin: 15,
    basePriceEur: 40,
    heroImage: IMG.city,
    blurb: "The short run into the old town and the port district.",
    notes: "The historic core is a low-emission zone — we drop at the nearest permitted street.",
    region: "Málaga City",
    service: "airport",
  },
  {
    slug: "malaga-airport-to-fuengirola",
    from: "Málaga Airport (AGP)",
    to: "Fuengirola",
    distanceKm: 27,
    durationMin: 30,
    basePriceEur: 50,
    heroImage: IMG.coast,
    blurb: "Mid-coast resorts and the Los Boliches seafront.",
    notes: "Coastal road in summer is slower than the toll motorway; the fixed price covers either.",
    region: "Málaga City",
    service: "airport",
  },
  {
    slug: "malaga-airport-to-estepona",
    from: "Málaga Airport (AGP)",
    to: "Estepona",
    distanceKm: 78,
    durationMin: 65,
    basePriceEur: 90,
    heroImage: IMG.coast,
    blurb: "Past Marbella to the quieter western end.",
    notes: "Tolls included in the quoted price.",
    region: "Estepona to Gibraltar",
    service: "airport",
  },
  {
    slug: "malaga-airport-to-gibraltar",
    from: "Málaga Airport (AGP)",
    to: "Gibraltar frontier",
    distanceKm: 128,
    durationMin: 100,
    basePriceEur: 145,
    heroImage: IMG.coast,
    blurb: "Coast run west to the La Línea border crossing.",
    notes:
      "We drop at the frontier; border queues are unpredictable and a Spanish car crossing adds time.",
    region: "Estepona to Gibraltar",
    service: "cross-island",
  },
];

export const COSTA_DEL_SOL_DATASET: TerritoryDataset = {
  territory: COSTA_DEL_SOL,
  routes: tagTerritory(ROUTES, COSTA_DEL_SOL.slug),
  regions: buildRegions(REGION_RECORDS, COSTA_DEL_SOL.slug),
};
