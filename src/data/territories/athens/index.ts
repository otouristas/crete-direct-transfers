import type { Territory, TerritoryDataset } from "@/data/territory";
import { tagTerritory } from "@/data/territory";
import { buildRegions, type RegionRecord } from "@/data/region-record";
import type { RouteData } from "@/data/routes";
import { getCityImage, getRegionImage, imageUrl } from "@/lib/place-image";

export const ATHENS: Territory = {
  slug: "athens",
  name: "Athens & Attica",
  kind: "metro",
  marketSlug: "greece",
  countryCode: "GR",
  countryName: "Greece",
  timezone: "Europe/Athens",
  status: "beta",
  tagline: "Airport, Piraeus and the Riviera — one fixed price.",
  heroTitle: "Private transfers in Athens and Attica",
  heroBody:
    "Athens Airport to the centre, Piraeus ferry gates timed to your sailing, and Riviera hotels from Glyfada to Sounio — priced before you book.",
  metaTitle: "Athens Private Transfers | Airport, Piraeus & Riviera",
  metaDescription:
    "Fixed-price private transfers in Athens — ATH airport to Syntagma, Plaka, Piraeus ferry gates and the Athens Riviera. Licensed drivers, flight and sailing tracking.",
  center: { lat: 37.98, lng: 23.73 },
  bbox: [23.4, 37.7, 24.2, 38.2],
  gateways: [
    { kind: "airport", name: "Athens International Airport", code: "ATH" },
    { kind: "port", name: "Piraeus Port" },
    { kind: "port", name: "Rafina Port" },
    { kind: "port", name: "Lavrio Port" },
  ],
  pricing: { currency: "EUR", floorEur: 38, perKmEur: 1.25, nightSurchargePct: 20 },
  locales: ["en", "el", "de", "fr", "it", "nl", "es"],
  neighbours: ["crete", "santorini"],
};

const IMG = {
  city: imageUrl(getCityImage("athens"), { width: 1600 }),
  coast: imageUrl(getRegionImage("attica"), { width: 1600 }),
};

const REGION_RECORDS: RegionRecord[] = [
  {
    slug: "athens-centre",
    name: "Athens Centre",
    headline: "Acropolis, Plaka, Syntagma — the walkable core.",
    intro:
      "Almost every first-time arrival ends up here: Plaka's lanes, the Acropolis Museum, and the hotel rooftops looking straight at the rock.",
    body: "The historic centre is a maze of pedestrianised streets and controlled-access zones. Drivers know which corners a car is actually allowed to reach and where the last legal stop is for Plaka, Anafiotika and Koukaki addresses, so nobody drags a suitcase uphill by accident.",
    hotels: ["Plaka", "Syntagma", "Koukaki", "Monastiraki", "Kolonaki"],
    gateway: "Athens Airport (ATH) & Piraeus Port",
  },
  {
    slug: "athens-riviera",
    name: "Athens Riviera",
    headline: "Glyfada to Sounio along the coastal road.",
    intro:
      "The southern coast strip — marinas, beach clubs and resort hotels running out to the Temple of Poseidon.",
    body: "From the airport the Riviera is reached on the Attiki Odos and the coastal Poseidonos avenue rather than through the city, which keeps Vouliagmeni and Varkiza under an hour even in evening traffic. Sounio adds another forty minutes of cliff road worth doing in daylight.",
    hotels: ["Glyfada", "Voula", "Vouliagmeni", "Varkiza", "Lagonisi", "Sounio"],
    gateway: "Athens Airport (ATH)",
  },
  {
    slug: "piraeus-ports",
    name: "Piraeus & Ferry Ports",
    headline: "Gate-accurate ferry connections for the islands.",
    intro:
      "Piraeus, Rafina and Lavrio — three ports, dozens of gates, and sailings that do not wait.",
    body: "Piraeus alone has gates spread over three kilometres of quay, and the gate depends on the operator and the island. We match the drop-off to the sailing on your ticket, and on the return we meet at the ramp rather than at a generic car park.",
    hotels: ["Piraeus", "Rafina", "Lavrio"],
    gateway: "Piraeus, Rafina & Lavrio Ports",
  },
];

const ROUTES: RouteData[] = [
  {
    slug: "athens-airport-to-athens-centre",
    from: "Athens Airport (ATH)",
    to: "Athens City Centre",
    distanceKm: 38,
    durationMin: 45,
    basePriceEur: 55,
    heroImage: IMG.city,
    blurb: "The standard arrival run — Attiki Odos into Syntagma, Plaka or Koukaki.",
    notes:
      "Plaka and Anafiotika are pedestrianised; we drop at the closest legal access point and walk your bags in.",
    region: "Athens Centre",
    service: "airport",
  },
  {
    slug: "athens-airport-to-piraeus-port",
    from: "Athens Airport (ATH)",
    to: "Piraeus Port",
    distanceKm: 52,
    durationMin: 55,
    basePriceEur: 65,
    heroImage: IMG.coast,
    blurb: "Airport to the exact ferry gate for your sailing, not just 'the port'.",
    notes:
      "Tell us the operator and island on your ticket and we drop at that gate. Blue Star, Seajets and Fast Ferries all board from different quays.",
    region: "Piraeus & Ferry Ports",
    service: "port",
  },
  {
    slug: "athens-airport-to-glyfada",
    from: "Athens Airport (ATH)",
    to: "Glyfada",
    distanceKm: 32,
    durationMin: 40,
    basePriceEur: 55,
    heroImage: IMG.coast,
    blurb: "Straight down to the Riviera without touching city traffic.",
    notes: "Vari-Koropi road then the coastal avenue — reliable even at rush hour.",
    region: "Athens Riviera",
    service: "airport",
  },
  {
    slug: "athens-airport-to-vouliagmeni",
    from: "Athens Airport (ATH)",
    to: "Vouliagmeni",
    distanceKm: 40,
    durationMin: 45,
    basePriceEur: 65,
    heroImage: IMG.coast,
    blurb: "To the Riviera's resort peninsula and its private hotel gates.",
    notes: "Drop-off at hotel reception; several properties require a name on the gate list.",
    region: "Athens Riviera",
    service: "hotel",
  },
  {
    slug: "athens-airport-to-rafina-port",
    from: "Athens Airport (ATH)",
    to: "Rafina Port",
    distanceKm: 23,
    durationMin: 25,
    basePriceEur: 45,
    heroImage: IMG.coast,
    blurb: "The short hop for Andros, Tinos and Mykonos sailings.",
    notes: "Rafina is closer than Piraeus but the early sailings fill the ramp — we build in a buffer.",
    region: "Piraeus & Ferry Ports",
    service: "port",
  },
  {
    slug: "athens-centre-to-piraeus-port",
    from: "Athens City Centre",
    to: "Piraeus Port",
    distanceKm: 12,
    durationMin: 30,
    basePriceEur: 40,
    heroImage: IMG.city,
    blurb: "Hotel door to ferry gate, timed backwards from your sailing.",
    notes: "Morning departures leave in heavy traffic; we quote pickup from your boarding time.",
    region: "Piraeus & Ferry Ports",
    service: "port",
  },
  {
    slug: "athens-centre-to-sounio",
    from: "Athens City Centre",
    to: "Cape Sounio",
    distanceKm: 70,
    durationMin: 80,
    basePriceEur: 130,
    heroImage: IMG.coast,
    blurb: "The coastal road to the Temple of Poseidon, best at sunset.",
    notes: "Waiting time for the temple visit can be included — ask when you book.",
    region: "Athens Riviera",
    service: "cross-island",
  },
  {
    slug: "athens-airport-to-corinth",
    from: "Athens Airport (ATH)",
    to: "Corinth",
    distanceKm: 105,
    durationMin: 90,
    basePriceEur: 155,
    heroImage: IMG.city,
    blurb: "Onward to the Peloponnese gateway and the canal.",
    notes: "Motorway the whole way; a canal photo stop adds about fifteen minutes.",
    region: "Athens Centre",
    service: "cross-island",
  },
];

export const ATHENS_DATASET: TerritoryDataset = {
  territory: ATHENS,
  routes: tagTerritory(ROUTES, ATHENS.slug),
  regions: buildRegions(REGION_RECORDS, ATHENS.slug),
};
