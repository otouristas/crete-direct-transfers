import type { Territory, TerritoryDataset } from "@/data/territory";
import { tagTerritory } from "@/data/territory";
import { buildRegions, type RegionRecord } from "@/data/region-record";
import type { RouteData } from "@/data/routes";
import { getCityImage, imageUrl } from "@/lib/place-image";

export const SANTORINI: Territory = {
  slug: "santorini",
  name: "Santorini",
  kind: "island",
  marketSlug: "greece",
  countryCode: "GR",
  countryName: "Greece",
  timezone: "Europe/Athens",
  status: "beta",
  tagline: "Caldera hotels, cliff steps and ferry ramps — handled.",
  heroTitle: "Private transfers on Santorini",
  heroBody:
    "From the airport or Athinios port to Oia, Imerovigli and Fira, with drivers who know exactly how far a car can get before the cliff steps begin.",
  metaTitle: "Santorini Private Transfers | Airport & Athinios Port",
  metaDescription:
    "Fixed-price Santorini transfers — JTR airport and Athinios ferry port to Oia, Fira, Imerovigli, Perissa and Akrotiri. Luggage porters and caldera drop-off advice.",
  center: { lat: 36.4, lng: 25.44 },
  bbox: [25.32, 36.32, 25.52, 36.49],
  gateways: [
    { kind: "airport", name: "Santorini Airport", code: "JTR" },
    { kind: "port", name: "Athinios Port" },
  ],
  pricing: { currency: "EUR", floorEur: 30, perKmEur: 2.2, nightSurchargePct: 20 },
  locales: ["en", "el", "de", "fr", "it", "nl", "es"],
  neighbours: ["crete", "athens"],
};

const IMG = {
  caldera: imageUrl(getCityImage("santorini"), { width: 1600 }),
  town: imageUrl(getCityImage("fira"), { width: 1600 }),
};

const REGION_RECORDS: RegionRecord[] = [
  {
    slug: "caldera-north",
    name: "Caldera North",
    headline: "Oia, Imerovigli and Firostefani above the cliff.",
    intro: "The sunset side — cave suites, stepped lanes and almost no vehicle access.",
    body: "Nearly every caldera-edge property ends in steps. Drivers stop at the nearest vehicle point and arrange a porter where the hotel does not send one, which matters most in Oia where the last stretch can be two hundred steps down.",
    hotels: ["Oia", "Imerovigli", "Firostefani"],
    gateway: "Santorini Airport (JTR) & Athinios Port",
  },
  {
    slug: "fira-and-inland",
    name: "Fira & Inland",
    headline: "The island's centre, and the villages behind it.",
    intro: "Fira, Karterados, Messaria and Pyrgos — the practical base for a first visit.",
    body: "Fira sits fifteen minutes from the airport and twenty from Athinios, with car access to most hotel doors. The inland villages are the quiet alternative and are just as quick to reach from either gateway.",
    hotels: ["Fira", "Karterados", "Messaria", "Pyrgos", "Megalochori"],
    gateway: "Santorini Airport (JTR)",
  },
  {
    slug: "south-beaches",
    name: "South Beaches",
    headline: "Perissa, Kamari, Perivolos and Akrotiri.",
    intro: "Black-sand beach resorts on the flat side of the island, easy for luggage.",
    body: "The south coast is where families and longer stays land: level ground, hotel car access, and a short run from the airport. Akrotiri adds the excavation site and the red beach at the island's tip.",
    hotels: ["Perissa", "Perivolos", "Kamari", "Akrotiri"],
    gateway: "Santorini Airport (JTR) & Athinios Port",
  },
];

const ROUTES: RouteData[] = [
  {
    slug: "santorini-airport-to-oia",
    from: "Santorini Airport (JTR)",
    to: "Oia",
    distanceKm: 18,
    durationMin: 35,
    basePriceEur: 55,
    heroImage: IMG.caldera,
    blurb: "Across the island to the caldera's northern tip and the sunset village.",
    notes:
      "Oia is pedestrianised. We stop at the closest vehicle point to your hotel and arrange a porter for the steps.",
    region: "Caldera North",
    service: "airport",
  },
  {
    slug: "santorini-airport-to-fira",
    from: "Santorini Airport (JTR)",
    to: "Fira",
    distanceKm: 6,
    durationMin: 15,
    basePriceEur: 30,
    heroImage: IMG.town,
    blurb: "The short run into the island capital.",
    notes: "Most Fira hotels have car access; caldera-edge ones may need a short walk.",
    region: "Fira & Inland",
    service: "airport",
  },
  {
    slug: "santorini-airport-to-imerovigli",
    from: "Santorini Airport (JTR)",
    to: "Imerovigli",
    distanceKm: 10,
    durationMin: 22,
    basePriceEur: 40,
    heroImage: IMG.caldera,
    blurb: "To the highest point of the caldera rim.",
    notes: "Steep stepped access at most suites — tell us your property and we plan the stop.",
    region: "Caldera North",
    service: "airport",
  },
  {
    slug: "santorini-airport-to-perissa",
    from: "Santorini Airport (JTR)",
    to: "Perissa",
    distanceKm: 9,
    durationMin: 18,
    basePriceEur: 35,
    heroImage: IMG.town,
    blurb: "Down to the black-sand south coast.",
    notes: "Flat, car-accessible hotels — the easiest arrival on the island with luggage.",
    region: "South Beaches",
    service: "airport",
  },
  {
    slug: "athinios-port-to-oia",
    from: "Athinios Port",
    to: "Oia",
    distanceKm: 21,
    durationMin: 40,
    basePriceEur: 60,
    heroImage: IMG.caldera,
    blurb: "Off the ferry ramp and up the switchbacks to Oia.",
    notes:
      "Athinios empties fast and chaotically after a big sailing; your driver waits above the ramp with a sign.",
    region: "Caldera North",
    service: "port",
  },
  {
    slug: "athinios-port-to-fira",
    from: "Athinios Port",
    to: "Fira",
    distanceKm: 10,
    durationMin: 20,
    basePriceEur: 40,
    heroImage: IMG.town,
    blurb: "The standard ferry arrival into the capital.",
    notes: "Eight hairpins up from the port — twenty minutes unless a cruise tender has just landed.",
    region: "Fira & Inland",
    service: "port",
  },
  {
    slug: "fira-to-akrotiri",
    from: "Fira",
    to: "Akrotiri",
    distanceKm: 14,
    durationMin: 25,
    basePriceEur: 45,
    heroImage: IMG.caldera,
    blurb: "To the excavation site, the lighthouse and the red beach.",
    notes: "Waiting time can be added if you want the site and the lighthouse in one trip.",
    region: "South Beaches",
    service: "cross-island",
  },
];

export const SANTORINI_DATASET: TerritoryDataset = {
  territory: SANTORINI,
  routes: tagTerritory(ROUTES, SANTORINI.slug),
  regions: buildRegions(REGION_RECORDS, SANTORINI.slug),
};
