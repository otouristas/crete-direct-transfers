export type Market = {
  slug: string;
  name: string;
  countryCode: string;
  bookableDefault: "instant" | "quote";
  currency: "EUR";
  heroTitle: string;
  heroBody: string;
  metaTitle: string;
  metaDescription: string;
  searchIntents: string[];
  /** Featured airport slugs from AIRPORTS / future catalogs */
  featuredAirportSlugs: string[];
  /** Featured city destination slugs */
  featuredCitySlugs: string[];
  live: boolean;
};

export const MARKETS: Market[] = [
  {
    slug: "greece",
    name: "Greece",
    countryCode: "GR",
    bookableDefault: "instant",
    currency: "EUR",
    heroTitle: "Private transportation in Greece",
    heroBody:
      "Airport pickups, island resorts and mainland cities — fixed prices with licensed local chauffeurs. Instant booking on Crete; quote confirmation elsewhere in Greece.",
    metaTitle: "Private Transfers in Greece | Airports & Cities · TransferAround",
    metaDescription:
      "Fixed-price private transfers across Greece — Athens, Crete, Cyclades, Ionian and Dodecanese airports. Licensed local drivers, meet & greet, flight tracking.",
    searchIntents: [
      "Private airport transfer in Greece",
      "Taxi service in Greece",
      "City-to-city rides across Greece",
      "Chauffeur service in Greece",
      "Island airport transfers",
      "Ferry port transfers",
    ],
    featuredAirportSlugs: [],
    featuredCitySlugs: [],
    live: true,
  },
  {
    slug: "spain",
    name: "Spain",
    countryCode: "ES",
    bookableDefault: "quote",
    currency: "EUR",
    heroTitle: "Private transfers in Spain",
    heroBody:
      "Airport and city transfers across Spain — quote confirmation with licensed local partners. Expanding coverage in Madrid, Barcelona, Málaga and the islands.",
    metaTitle: "Private Transfers in Spain | Airports & Cities · TransferAround",
    metaDescription:
      "Request a fixed-price private transfer in Spain. Madrid, Barcelona, Málaga and island airports — licensed chauffeurs, meet & greet.",
    searchIntents: [
      "Private airport transfer in Spain",
      "Madrid airport transfer",
      "Barcelona private chauffeur",
      "Málaga airport to Costa del Sol",
      "Ibiza airport transfer",
      "City-to-city rides in Spain",
    ],
    featuredAirportSlugs: ["madrid-barajas-airport-transfers-mad", "barcelona-el-prat-airport-transfers-bcn", "malaga-airport-transfers-agp"],
    featuredCitySlugs: ["madrid", "barcelona", "malaga"],
    live: true,
  },
  {
    slug: "italy",
    name: "Italy",
    countryCode: "IT",
    bookableDefault: "quote",
    currency: "EUR",
    heroTitle: "Private transfers in Italy",
    heroBody:
      "Airport, station and city transfers across Italy — quote-based booking with vetted local chauffeurs. Rome, Milan, Venice and Amalfi corridors first.",
    metaTitle: "Private Transfers in Italy | Airports & Cities · TransferAround",
    metaDescription:
      "Request a fixed-price private transfer in Italy. Rome, Milan, Venice and coastal resorts — licensed drivers, meet & greet.",
    searchIntents: [
      "Private airport transfer in Italy",
      "Rome Fiumicino transfer",
      "Milan Malpensa chauffeur",
      "Venice airport transfer",
      "Amalfi coast private transfer",
      "City-to-city rides in Italy",
    ],
    featuredAirportSlugs: ["rome-fiumicino-airport-transfers-fco", "milan-malpensa-airport-transfers-mxp", "venice-marco-polo-airport-transfers-vce"],
    featuredCitySlugs: ["rome", "milan", "venice"],
    live: true,
  },
];

export function getMarket(slug: string): Market | undefined {
  return MARKETS.find((m) => m.slug === slug);
}

export function listLiveMarkets(): Market[] {
  return MARKETS.filter((m) => m.live);
}
