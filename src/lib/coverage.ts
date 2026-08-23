/**
 * Single source of truth for the coverage numbers shown to visitors.
 *
 * Every figure is derived from the data we actually ship, so a homepage claim
 * can never drift from the catalog. Deliberately conservative: `airportPages`
 * counts airports with a dedicated indexable page, not the ~8,900 IATA airports
 * the booking widget can resolve — we only advertise what we have supply for.
 */
import { AIRPORTS } from "@/data/airports";
import { AIRPORT_ROUTES } from "@/data/airport-routes";
import { MARKET_HUB_AIRPORTS, MARKET_HUB_CITIES } from "@/data/market-hubs";
import { ROUTES } from "@/data/routes";
import { listCityDestinations } from "@/data/destinations";
import { listLiveMarkets } from "@/data/markets";

const liveMarkets = listLiveMarkets();

export const COVERAGE = {
  countries: liveMarkets.length,
  airportPages: AIRPORTS.length + MARKET_HUB_AIRPORTS.length,
  cityPages: listCityDestinations().length + MARKET_HUB_CITIES.length,
  fixedPriceRoutes: ROUTES.length + AIRPORT_ROUTES.length,
} as const;

/** Airports with a dedicated page in a given market. */
export function airportsInMarket(marketSlug: string): number {
  if (marketSlug === "greece") return AIRPORTS.length;
  return MARKET_HUB_AIRPORTS.filter((a) => a.countrySlug === marketSlug).length;
}
