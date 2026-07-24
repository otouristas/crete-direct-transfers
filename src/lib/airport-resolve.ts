// Resolve an airport slug to full page data. Curated airports (src/data/airports.ts)
// win and keep their hand-written content; any other real IATA airport (of the
// 8,927 in iata-airports) is synthesised into the same AirportData shape with
// generic-but-true content, so `airports.$slug` renders every airport worldwide
// instead of 404-ing. Generated airports are "quote" (no curated supply).
import { type AirportData, AIRPORTS, getAirport } from "@/data/airports";
import { getIataAirport, airportsInCountry, type IataAirport } from "@/data/iata-airports";
import { airportSlug, iataFromSlug, kebab } from "./airport-slug";

/** Neutral hero for generated airports until per-airport imagery is self-hosted (Phase 5). */
const GENERIC_AIRPORT_HERO =
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=70";

/** IATA → curated slug, so related-airport links prefer the rich page when one exists. */
const curatedSlugByIata = new Map<string, string>(
  AIRPORTS.map((a) => [a.iata.toUpperCase(), a.slug]),
);

/** Build a full AirportData for a global (non-curated) IATA airport. */
export function airportFromIata(ia: IataAirport): AirportData {
  const city = ia.city || ia.name;
  const where = ia.city ? `${ia.city}, ${ia.countryName}` : ia.countryName;
  return {
    iata: ia.iata,
    slug: airportSlug(ia),
    name: ia.name,
    officialName: ia.name,
    alias: ia.city ? `${ia.city} Airport` : ia.name,
    address: where,
    citySlug: kebab(city),
    cityName: city,
    zip: "",
    country: ia.countryName,
    heroImage: GENERIC_AIRPORT_HERO,
    fromPriceEur: 45,
    bookable: "quote",
    terminals: "Your driver meets you inside the arrivals hall with a name sign.",
    pickupPoint: "Arrivals hall — look for your name on the sign",
    cityDriveMin: "Varies by destination",
    tollsNote: "Any tolls or airport fees are included in your fixed quote — no surprises on arrival.",
    updatedAt: "2026-07-24",
    intro: `Book a fixed-price private transfer from ${ia.name} (${ia.iata}) in ${where}. A licensed local driver tracks your flight, meets you in arrivals with a name sign, and takes you door-to-door for an agreed price — no meters, no surge, no bidding. Enter your destination for an instant quote confirmed before you pay.`,
    knowBefore: [
      {
        title: "Meet & greet in arrivals",
        body: `Your driver waits inside the ${ia.name} arrivals hall holding a sign with your name. Free wait time is included if your flight is delayed — we track it automatically.`,
      },
      {
        title: "One fixed price, agreed up front",
        body: "You approve the total before you travel. It covers the vehicle, luggage, tolls and taxes — the price you see is the price you pay.",
      },
      {
        title: "Pay after the quote is confirmed",
        body: `For ${ia.countryName} we confirm your quote before payment, so you always know the exact fare for your route before committing.`,
      },
    ],
    insights: [
      `${ia.name} (${ia.iata}) serves ${where}. Pre-booking a private transfer removes the airport taxi-rank lottery: your fare is fixed in advance, your driver is licensed, and pickup is timed to your actual landing.`,
      "Private transfers suit families, groups and late arrivals — door-to-door with child seats on request, no luggage limits within your vehicle class, and no waiting for scheduled public transport.",
    ],
    comparison: [
      {
        mode: "Airport taxi rank",
        time: "On demand + queue",
        cost: "Metered / variable",
        pros: "Available on arrival",
        cons: "Queues; fare varies; no flight tracking",
      },
      {
        mode: "Public transport",
        time: "Slower, with changes",
        cost: "Low",
        pros: "Cheapest option",
        cons: "Limited hours; awkward with luggage; not door-to-door",
      },
      {
        mode: "TransferAround private transfer",
        time: "Direct, door-to-door",
        cost: "Fixed quote",
        pros: "Fixed price, meet & greet, flight tracking, child seats on request",
        cons: "Book in advance",
        recommended: true,
      },
    ],
    faqs: [
      {
        q: `How do I book a transfer from ${ia.name} (${ia.iata})?`,
        a: `Enter ${ia.name} as your pickup and your destination to get an instant quote. Confirm it and you'll receive your driver's details before pickup.`,
      },
      {
        q: `Where does the driver meet me at ${ia.name}?`,
        a: "In the arrivals hall, holding a sign with your name. If your flight is delayed we track it and adjust the pickup automatically.",
      },
      {
        q: "Is the price fixed?",
        a: "Yes. Your quote is agreed before you travel and includes the vehicle, luggage, tolls and taxes. There's no meter and no surge pricing.",
      },
      {
        q: "Can I request child seats or a larger vehicle?",
        a: "Yes — choose a vehicle class that fits your group and add child seats when you book. We'll match the right vehicle to your party and luggage.",
      },
    ],
  };
}

/** Curated first, else synthesise from the global IATA catalog. */
export function getAirportResolved(slug: string): AirportData | undefined {
  const curated = getAirport(slug);
  if (curated) return curated;
  const iata = iataFromSlug(slug);
  if (!iata) return undefined;
  const ia = getIataAirport(iata);
  return ia ? airportFromIata(ia) : undefined;
}

/** Other airports in the same country, preferring curated slugs where they exist. */
export function relatedAirportsByCountry(
  currentIata: string,
  limit = 9,
): { slug: string; name: string; iata: string }[] {
  const ia = getIataAirport(currentIata);
  if (!ia) return [];
  const out: { slug: string; name: string; iata: string }[] = [];
  for (const a of airportsInCountry(ia.countryCode, limit + 4)) {
    if (a.iata === ia.iata) continue;
    out.push({
      slug: curatedSlugByIata.get(a.iata) ?? airportSlug(a),
      name: a.name,
      iata: a.iata,
    });
    if (out.length >= limit) break;
  }
  return out;
}
