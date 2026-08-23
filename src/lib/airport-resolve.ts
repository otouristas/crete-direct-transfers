// Resolve an airport slug to full page data. Curated airports (src/data/airports.ts)
// win and keep their hand-written content; any other real IATA airport (of the
// 8,927 in iata-airports) is synthesised into the same AirportData shape with
// generic-but-true content, so `airports.$slug` renders every airport worldwide
// instead of 404-ing. Generated airports are "quote" (no curated supply).
import { type AirportData, AIRPORTS, getAirport } from "@/data/airports";
import { getIataAirport, airportsInCountry, type IataAirport } from "@/data/iata-airports";
import { airportSlug, iataFromSlug, kebab } from "./airport-slug";
import { MARKET_HUB_AIRPORTS } from "@/data/market-hubs";

import { getAirportImage, imageUrl } from "./place-image";

/** IATA → curated slug, so related-airport links prefer the rich page when one exists. */
const curatedSlugByIata = new Map<string, string>(
  [...AIRPORTS, ...MARKET_HUB_AIRPORTS].map((a) => [a.iata.toUpperCase(), a.slug]),
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
    // Best available: the hub's own photo, else its city, else its country.
    heroImage: imageUrl(
      getAirportImage({ iata: ia.iata, citySlug: kebab(city), countryCode: ia.countryCode }),
      { width: 1600 },
    ),
    // No public "from" price is shown until a route-specific quote exists.
    fromPriceEur: 0,
    bookable: "quote",
    terminals: "Terminal and meeting instructions are confirmed with your route quote.",
    pickupPoint: "Confirmed after the pickup terminal and route are reviewed",
    cityDriveMin: "Varies by destination",
    tollsNote:
      "Any tolls or airport fees are included in your fixed quote — no surprises on arrival.",
    updatedAt: "2026-08-23",
    intro: `Request a fixed-price private transfer from ${ia.name} (${ia.iata}) in ${where}. Share the destination, flight and passenger details so TransferAround can confirm a licensed local driver, the meeting point and the total fare before payment.`,
    knowBefore: [
      {
        title: "Confirm the arrival terminal",
        body: `${ia.name} may use more than one arrivals area. Add the airline and flight number so the quote can include the correct meeting instructions.`,
      },
      {
        title: "One fixed price, agreed up front",
        body: "You approve the route-specific total before you travel. The confirmation states what is included, the vehicle class and any route or airport fees.",
      },
      {
        title: "Pay after the quote is confirmed",
        body: `For ${ia.countryName} we confirm your quote before payment, so you always know the exact fare for your route before committing.`,
      },
    ],
    insights: [
      `${ia.name} (${ia.iata}) serves ${where}. A confirmed private-transfer quote records the route, vehicle class, meeting point and total fare before the journey.`,
      "For families, groups or late arrivals, include passenger ages, luggage and flight details in the request so availability and the correct vehicle can be confirmed.",
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
        pros: "Route and total confirmed before travel",
        cons: "Book in advance",
        recommended: true,
      },
    ],
    faqs: [
      {
        q: `How do I book a transfer from ${ia.name} (${ia.iata})?`,
        a: `Enter ${ia.name} as the pickup and provide the destination, date, flight and passenger details. TransferAround will confirm availability and the fixed total before payment.`,
      },
      {
        q: `Where does the driver meet me at ${ia.name}?`,
        a: "The exact terminal meeting point is included in the confirmed quote and booking details after the flight information is reviewed.",
      },
      {
        q: "Is the price fixed?",
        a: "Yes. Your quote is agreed before you travel and includes the vehicle, luggage, tolls and taxes. There's no meter and no surge pricing.",
      },
      {
        q: "Can I request child seats or a larger vehicle?",
        a: "Add passenger ages, luggage and any child-seat request to the quote. Availability and the appropriate vehicle are confirmed before payment.",
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
