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
  publicationStatus: "draft" | "published";
  lastModified: string;
  supportedLocales: readonly ["en", "el", "de", "fr", "it", "nl", "es"];
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
    publicationStatus: "published",
    lastModified: "2026-07-28",
    supportedLocales: ["en", "el", "de", "fr", "it", "nl", "es"],
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
    featuredAirportSlugs: [
      "madrid-barajas-airport-transfers-mad",
      "barcelona-el-prat-airport-transfers-bcn",
      "malaga-airport-transfers-agp",
    ],
    featuredCitySlugs: ["madrid", "barcelona", "malaga"],
    publicationStatus: "published",
    lastModified: "2026-07-28",
    supportedLocales: ["en", "el", "de", "fr", "it", "nl", "es"],
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
    featuredAirportSlugs: [
      "rome-fiumicino-airport-transfers-fco",
      "milan-malpensa-airport-transfers-mxp",
      "venice-marco-polo-airport-transfers-vce",
    ],
    featuredCitySlugs: ["rome", "milan", "venice"],
    publicationStatus: "published",
    lastModified: "2026-07-28",
    supportedLocales: ["en", "el", "de", "fr", "it", "nl", "es"],
    live: true,
  },
  {
    slug: "portugal",
    name: "Portugal",
    countryCode: "PT",
    bookableDefault: "quote",
    currency: "EUR",
    heroTitle: "Private transfers in Portugal",
    heroBody: "Quote-confirmed airport, island and city transfers with licensed local partners.",
    metaTitle: "Private Transfers in Portugal | TransferAround",
    metaDescription:
      "Request private transfers in Portugal for Lisbon, Porto, Algarve, Madeira and the Azores.",
    searchIntents: [],
    featuredAirportSlugs: [
      "lisbon-airport-transfers-lis",
      "porto-airport-transfers-opo",
      "faro-airport-transfers-fao",
      "funchal-airport-transfers-fnc",
      "ponta-delgada-airport-transfers-pdl",
    ],
    featuredCitySlugs: ["lisbon", "porto", "algarve", "funchal", "ponta-delgada"],
    publicationStatus: "published",
    lastModified: "2026-07-28",
    supportedLocales: ["en", "el", "de", "fr", "it", "nl", "es"],
    live: true,
  },
  {
    slug: "cyprus",
    name: "Cyprus",
    countryCode: "CY",
    bookableDefault: "quote",
    currency: "EUR",
    heroTitle: "Private transfers in Cyprus",
    heroBody: "Quote-confirmed airport, resort and city transfers with licensed local partners.",
    metaTitle: "Private Transfers in Cyprus | TransferAround",
    metaDescription:
      "Request private transfers in Cyprus for Larnaca, Paphos, Limassol, Nicosia and the eastern resorts.",
    searchIntents: [],
    featuredAirportSlugs: ["larnaca-airport-transfers-lca", "paphos-airport-transfers-pfo"],
    featuredCitySlugs: ["larnaca", "paphos", "limassol", "nicosia", "ayia-napa", "protaras"],
    publicationStatus: "published",
    lastModified: "2026-07-28",
    supportedLocales: ["en", "el", "de", "fr", "it", "nl", "es"],
    live: true,
  },
  {
    slug: "turkey",
    name: "Turkey",
    countryCode: "TR",
    bookableDefault: "quote",
    currency: "EUR",
    heroTitle: "Private transfers in Turkey",
    heroBody:
      "Quote-confirmed airport, coastal resort and city transfers with licensed local partners.",
    metaTitle: "Private Transfers in Turkey | TransferAround",
    metaDescription:
      "Request private transfers in Turkey for Istanbul, Antalya, Izmir, Bodrum, Dalaman and Cappadocia.",
    searchIntents: [],
    featuredAirportSlugs: [
      "istanbul-airport-transfers-ist",
      "istanbul-sabiha-airport-transfers-saw",
      "antalya-airport-transfers-ayt",
      "izmir-airport-transfers-adb",
      "bodrum-airport-transfers-bjv",
      "dalaman-airport-transfers-dlm",
      "kayseri-airport-transfers-asr",
    ],
    featuredCitySlugs: ["istanbul", "antalya", "izmir", "bodrum", "dalaman", "cappadocia"],
    publicationStatus: "published",
    lastModified: "2026-07-28",
    supportedLocales: ["en", "el", "de", "fr", "it", "nl", "es"],
    live: true,
  },
];

export function getMarket(slug: string): Market | undefined {
  return MARKETS.find((m) => m.slug === slug);
}

export function listLiveMarkets(): Market[] {
  return MARKETS.filter((m) => m.live && m.publicationStatus === "published");
}
