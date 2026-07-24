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
    fromPriceEur: 45,
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
    fromPriceEur: 40,
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
    fromPriceEur: 55,
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
    fromPriceEur: 70,
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
    fromPriceEur: 50,
    bookable: "quote",
    intro:
      "Venice Marco Polo (VCE) transfers to Piazzale Roma, Mestre and nearby islands — quote-based private cars.",
  },
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
