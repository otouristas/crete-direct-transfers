/** Shell airport / city hubs for non-Greece markets (Tier B SEO). */
export type MarketHubAirport = {
  slug: string;
  iata: string;
  name: string;
  cityName: string;
  countrySlug: string;
  fromPriceEur: number;
  bookable: "instant" | "quote";
  intro: string;
};

export type MarketHubCity = {
  slug: string;
  name: string;
  countrySlug: string;
  intro: string;
};

export const MARKET_HUB_AIRPORTS: MarketHubAirport[] = [
  {
    slug: "madrid-barajas-airport-transfers-mad",
    iata: "MAD",
    name: "Madrid Barajas Airport",
    cityName: "Madrid",
    countrySlug: "spain",
    fromPriceEur: 35,
    bookable: "quote",
    intro:
      "Request a fixed-price private transfer from Madrid-Barajas (MAD) to the city centre, hotels and surrounding towns.",
  },
  {
    slug: "barcelona-el-prat-airport-transfers-bcn",
    iata: "BCN",
    name: "Barcelona El Prat Airport",
    cityName: "Barcelona",
    countrySlug: "spain",
    fromPriceEur: 35,
    bookable: "quote",
    intro:
      "Private transfers from Barcelona-El Prat (BCN) to the city, Sitges and Costa Brava — quote confirmation with licensed chauffeurs.",
  },
  {
    slug: "malaga-airport-transfers-agp",
    iata: "AGP",
    name: "Málaga Airport",
    cityName: "Málaga",
    countrySlug: "spain",
    fromPriceEur: 35,
    bookable: "quote",
    intro:
      "Costa del Sol airport transfers from Málaga (AGP) — Marbella, Torremolinos and beyond on a fixed quote.",
  },
  {
    slug: "rome-fiumicino-airport-transfers-fco",
    iata: "FCO",
    name: "Rome Fiumicino Airport",
    cityName: "Rome",
    countrySlug: "italy",
    fromPriceEur: 36,
    bookable: "quote",
    intro:
      "Private transfers from Rome Fiumicino (FCO) to the centro storico, Vatican area and Civitavecchia port.",
  },
  {
    slug: "milan-malpensa-airport-transfers-mxp",
    iata: "MXP",
    name: "Milan Malpensa Airport",
    cityName: "Milan",
    countrySlug: "italy",
    fromPriceEur: 56,
    bookable: "quote",
    intro:
      "Malpensa (MXP) private transfers into Milan, Como and Lake Maggiore — fixed quotes, licensed drivers.",
  },
  {
    slug: "venice-marco-polo-airport-transfers-vce",
    iata: "VCE",
    name: "Venice Marco Polo Airport",
    cityName: "Venice",
    countrySlug: "italy",
    fromPriceEur: 35,
    bookable: "quote",
    intro:
      "Venice Marco Polo (VCE) transfers to Piazzale Roma, Mestre and nearby islands — quote-based private cars.",
  },
  ...[
    ["valencia-airport-transfers-vlc", "VLC", "Valencia Airport", "Valencia", "spain", 35],
    ["seville-airport-transfers-svq", "SVQ", "Seville Airport", "Seville", "spain", 35],
    ["alicante-airport-transfers-alc", "ALC", "Alicante Airport", "Alicante", "spain", 35],
    ["mallorca-airport-transfers-pmi", "PMI", "Palma de Mallorca Airport", "Mallorca", "spain", 35],
    ["ibiza-airport-transfers-ibz", "IBZ", "Ibiza Airport", "Ibiza", "spain", 35],
    [
      "tenerife-south-airport-transfers-tfs",
      "TFS",
      "Tenerife South Airport",
      "Tenerife",
      "spain",
      35,
    ],
    [
      "gran-canaria-airport-transfers-lpa",
      "LPA",
      "Gran Canaria Airport",
      "Gran Canaria",
      "spain",
      35,
    ],
    ["florence-airport-transfers-flr", "FLR", "Florence Airport", "Florence", "italy", 35],
    ["bologna-airport-transfers-blq", "BLQ", "Bologna Airport", "Bologna", "italy", 35],
    ["naples-airport-transfers-nap", "NAP", "Naples Airport", "Naples", "italy", 35],
    ["bari-airport-transfers-bri", "BRI", "Bari Airport", "Bari", "italy", 35],
    ["palermo-airport-transfers-pmo", "PMO", "Palermo Airport", "Palermo", "italy", 42],
    ["catania-airport-transfers-cta", "CTA", "Catania Airport", "Catania", "italy", 35],
    ["cagliari-airport-transfers-cag", "CAG", "Cagliari Airport", "Sardinia", "italy", 35],
    ["lisbon-airport-transfers-lis", "LIS", "Lisbon Airport", "Lisbon", "portugal", 35],
    ["porto-airport-transfers-opo", "OPO", "Porto Airport", "Porto", "portugal", 35],
    ["faro-airport-transfers-fao", "FAO", "Faro Airport", "Algarve", "portugal", 35],
    ["funchal-airport-transfers-fnc", "FNC", "Madeira Airport", "Funchal", "portugal", 35],
    [
      "ponta-delgada-airport-transfers-pdl",
      "PDL",
      "Ponta Delgada Airport",
      "Azores",
      "portugal",
      35,
    ],
    ["larnaca-airport-transfers-lca", "LCA", "Larnaca Airport", "Larnaca", "cyprus", 35],
    ["paphos-airport-transfers-pfo", "PFO", "Paphos Airport", "Paphos", "cyprus", 35],
    ["istanbul-airport-transfers-ist", "IST", "Istanbul Airport", "Istanbul", "turkey", 56],
    [
      "istanbul-sabiha-airport-transfers-saw",
      "SAW",
      "Sabiha Gökçen Airport",
      "Istanbul",
      "turkey",
      47,
    ],
    ["antalya-airport-transfers-ayt", "AYT", "Antalya Airport", "Antalya", "turkey", 35],
    ["izmir-airport-transfers-adb", "ADB", "İzmir Adnan Menderes Airport", "İzmir", "turkey", 35],
    ["bodrum-airport-transfers-bjv", "BJV", "Milas–Bodrum Airport", "Bodrum", "turkey", 42],
    ["dalaman-airport-transfers-dlm", "DLM", "Dalaman Airport", "Dalaman", "turkey", 35],
    ["kayseri-airport-transfers-asr", "ASR", "Kayseri Airport", "Cappadocia", "turkey", 35],
  ].map(
    ([slug, iata, name, cityName, countrySlug, fromPriceEur]): MarketHubAirport => ({
      slug: slug as string,
      iata: iata as string,
      name: name as string,
      cityName: cityName as string,
      countrySlug: countrySlug as string,
      fromPriceEur: fromPriceEur as number,
      bookable: "quote",
      intro: `${name} private transfer requests are confirmed by a licensed local partner.`,
    }),
  ),
];

export const MARKET_HUB_CITIES: MarketHubCity[] = [
  {
    slug: "madrid",
    name: "Madrid",
    countrySlug: "spain",
    intro: "Private chauffeurs for Madrid hotels, stations and day trips.",
  },
  {
    slug: "barcelona",
    name: "Barcelona",
    countrySlug: "spain",
    intro: "Barcelona city and airport transfers on a fixed quote.",
  },
  {
    slug: "malaga",
    name: "Málaga",
    countrySlug: "spain",
    intro: "Málaga and Costa del Sol private transfers.",
  },
  {
    slug: "rome",
    name: "Rome",
    countrySlug: "italy",
    intro: "Rome city, airport and cruise-port private transfers.",
  },
  {
    slug: "milan",
    name: "Milan",
    countrySlug: "italy",
    intro: "Milan fashion district, airports and lake transfers.",
  },
  {
    slug: "venice",
    name: "Venice",
    countrySlug: "italy",
    intro: "Venice and Veneto private airport and hotel transfers.",
  },
  ...[
    ["valencia", "Valencia", "spain"],
    ["seville", "Seville", "spain"],
    ["alicante", "Alicante", "spain"],
    ["mallorca", "Mallorca", "spain"],
    ["ibiza", "Ibiza", "spain"],
    ["tenerife", "Tenerife", "spain"],
    ["gran-canaria", "Gran Canaria", "spain"],
    ["florence", "Florence", "italy"],
    ["bologna", "Bologna", "italy"],
    ["naples-amalfi", "Naples & Amalfi", "italy"],
    ["bari-puglia", "Bari & Puglia", "italy"],
    ["palermo", "Palermo", "italy"],
    ["catania", "Catania", "italy"],
    ["sardinia", "Sardinia", "italy"],
    ["lisbon", "Lisbon", "portugal"],
    ["porto", "Porto", "portugal"],
    ["algarve", "Algarve", "portugal"],
    ["funchal", "Funchal", "portugal"],
    ["ponta-delgada", "Ponta Delgada", "portugal"],
    ["larnaca", "Larnaca", "cyprus"],
    ["paphos", "Paphos", "cyprus"],
    ["limassol", "Limassol", "cyprus"],
    ["nicosia", "Nicosia", "cyprus"],
    ["ayia-napa", "Ayia Napa", "cyprus"],
    ["protaras", "Protaras", "cyprus"],
    ["istanbul", "Istanbul", "turkey"],
    ["antalya", "Antalya", "turkey"],
    ["izmir", "İzmir", "turkey"],
    ["bodrum", "Bodrum", "turkey"],
    ["dalaman", "Dalaman", "turkey"],
    ["cappadocia", "Cappadocia", "turkey"],
  ].map(
    ([slug, name, countrySlug]): MarketHubCity => ({
      slug,
      name,
      countrySlug,
      intro: `${name} private transfer requests are confirmed by a licensed local partner.`,
    }),
  ),
];

export function getMarketHubAirport(slug: string) {
  return MARKET_HUB_AIRPORTS.find((a) => a.slug === slug);
}

export function listMarketHubAirports(countrySlug: string) {
  return MARKET_HUB_AIRPORTS.filter((a) => a.countrySlug === countrySlug);
}

export function listMarketHubCities(countrySlug: string) {
  return MARKET_HUB_CITIES.filter((c) => c.countrySlug === countrySlug);
}
