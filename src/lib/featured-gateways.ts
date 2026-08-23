/**
 * The gateways featured on the homepage.
 *
 * Deliberately spans every live market instead of slicing the Crete-only ROUTES
 * array: the homepage is the one page that has to prove we operate in more than
 * one country. Greek entries carry a real fixed price from AIRPORT_ROUTES; the
 * quote markets carry their hub's `fromPriceEur` where we have one, and fall
 * back to a quote badge where we don't — never an invented number.
 */
import type { Locale } from "@/i18n";
import {
  getLocalizedAirportRoutes,
  getLocalizedAirports,
  getLocalizedMarketHubAirports,
  getLocalizedMarketHubCities,
} from "@/i18n/content";
import { getCountryName } from "@/i18n/markets";

export type FeaturedGateway = {
  key: string;
  from: string;
  to: string;
  countrySlug: string;
  countryName: string;
  /** Fixed price in EUR, or null when the market is quote-confirmed. */
  priceEur: number | null;
  distanceKm?: number;
  durationMin?: number;
  /** Link target — an airport route page when we have one, else the airport hub. */
  link:
    | { kind: "airportRoute"; airportSlug: string; routeSlug: string }
    | { kind: "airport"; airportSlug: string };
};

/** Greek airport routes to feature, in order. Both are high-volume arrivals. */
const GREEK_ROUTE_SLUGS = [
  "transfer-from-heraklion-airport-to-elounda",
  "transfer-from-chania-airport-to-chania-old-town",
] as const;

/** One hub per remaining market, in display order. */
const HUB_SLUGS = [
  "rome-fiumicino-airport-transfers-fco",
  "barcelona-el-prat-airport-transfers-bcn",
  "lisbon-airport-transfers-lis",
  "antalya-airport-transfers-ayt",
] as const;

export function getFeaturedGateways(locale: Locale): FeaturedGateway[] {
  const out: FeaturedGateway[] = [];

  const airports = getLocalizedAirports(locale);
  const airportRoutes = getLocalizedAirportRoutes(locale);
  for (const routeSlug of GREEK_ROUTE_SLUGS) {
    const route = airportRoutes.find((r) => r.routeSlug === routeSlug);
    if (!route) continue;
    const airport = airports.find((a) => a.slug === route.airportSlug);
    out.push({
      key: routeSlug,
      from: airport?.alias ?? route.fromName,
      to: route.toName,
      countrySlug: "greece",
      countryName: getCountryName(locale, "greece"),
      priceEur: route.basePriceEur,
      distanceKm: route.distanceKm,
      durationMin: route.durationMin,
      link: { kind: "airportRoute", airportSlug: route.airportSlug, routeSlug: route.routeSlug },
    });
  }

  const hubs = getLocalizedMarketHubAirports(locale);
  for (const slug of HUB_SLUGS) {
    const hub = hubs.find((a) => a.slug === slug);
    if (!hub) continue;
    const city = getLocalizedMarketHubCities(locale, hub.countrySlug).find((c) =>
      hub.cityName.toLowerCase().startsWith(c.slug.split("-")[0]!),
    );
    out.push({
      key: slug,
      from: hub.name,
      to: city?.name ?? hub.cityName,
      countrySlug: hub.countrySlug,
      countryName: getCountryName(locale, hub.countrySlug),
      priceEur: hub.fromPriceEur > 0 ? hub.fromPriceEur : null,
      link: { kind: "airport", airportSlug: hub.slug },
    });
  }

  return out;
}
