import { getRoute, VEHICLE_CLASSES, type VehicleClass } from "@/data/routes";
import { getAirport, type AirportData } from "@/data/airports";
import {
  getAirportRoute,
  type AirportRouteData,
} from "@/data/airport-routes";

export type Extras = {
  childSeat?: boolean;
  extraStop?: boolean;
  meetAndGreet?: boolean;
};

export type TripType = "oneway" | "return";

export type Quote = {
  routeSlug: string;
  vehicleClass: VehicleClass;
  tripType: TripType;
  currency: "EUR";
  breakdown: { label: string; amountEur: number }[];
  totalEur: number;
};

const EXTRA_PRICES = {
  childSeat: 10,
  extraStop: 15,
  meetAndGreet: 10,
};

const RETURN_DISCOUNT = 0.05;

function isNight(at: Date): boolean {
  const h = at.getHours();
  return h >= 22 || h < 6;
}

export function quote(input: {
  routeSlug: string;
  vehicleClass: VehicleClass;
  pickupAt?: Date;
  extras?: Extras;
  tripType?: TripType;
  returnAt?: Date;
}): Quote | null {
  const route = getRoute(input.routeSlug);
  const vc = VEHICLE_CLASSES.find((c) => c.id === input.vehicleClass);
  if (!route || !vc) return null;

  const tripType: TripType = input.tripType ?? "oneway";
  const base = Math.round(route.basePriceEur * vc.multiplier);
  const breakdown: { label: string; amountEur: number }[] = [
    { label: `${vc.label} vehicle`, amountEur: base },
  ];

  if (input.extras?.childSeat) {
    breakdown.push({ label: "Child seat", amountEur: EXTRA_PRICES.childSeat });
  }
  if (input.extras?.extraStop) {
    breakdown.push({ label: "Extra stop", amountEur: EXTRA_PRICES.extraStop });
  }
  if (input.extras?.meetAndGreet) {
    breakdown.push({ label: "Meet & greet with sign", amountEur: EXTRA_PRICES.meetAndGreet });
  }

  let outboundSubtotal = breakdown.reduce((s, b) => s + b.amountEur, 0);

  // Night surcharge 22:00–06:00 (+15%) per leg, based on that leg's pickup time
  if (input.pickupAt && isNight(input.pickupAt)) {
    const surcharge = Math.round(outboundSubtotal * 0.15);
    breakdown.push({ label: "Night surcharge (22:00–06:00)", amountEur: surcharge });
    outboundSubtotal += surcharge;
  }

  let total = outboundSubtotal;

  if (tripType === "return") {
    // Return leg: same base + extras, its own night-surcharge check
    let returnSubtotal = breakdown
      .filter((b) => !b.label.startsWith("Night surcharge"))
      .reduce((s, b) => s + b.amountEur, 0);
    if (input.returnAt && isNight(input.returnAt)) {
      returnSubtotal += Math.round(returnSubtotal * 0.15);
    }
    breakdown.push({ label: "Return trip", amountEur: returnSubtotal });
    total += returnSubtotal;

    const discount = -Math.round(total * RETURN_DISCOUNT);
    breakdown.push({ label: "Return discount (−5%)", amountEur: discount });
    total += discount;
  }

  return {
    routeSlug: input.routeSlug,
    vehicleClass: input.vehicleClass,
    tripType,
    currency: "EUR",
    breakdown,
    totalEur: total,
  };
}

/** Base EUR per hour for economy chauffeur (private day-tour style). */
const HOURLY_BASE_EUR = 45;

export type HourlyQuote = {
  hours: number;
  vehicleClass: VehicleClass;
  currency: "EUR";
  breakdown: { label: string; amountEur: number }[];
  totalEur: number;
};

export function quoteHourly(input: {
  hours: number;
  vehicleClass: VehicleClass;
  pickupAt?: Date;
}): HourlyQuote | null {
  const vc = VEHICLE_CLASSES.find((c) => c.id === input.vehicleClass);
  const hours = Math.max(2, Math.min(12, Math.round(input.hours)));
  if (!vc) return null;

  const base = Math.round(HOURLY_BASE_EUR * hours * vc.multiplier);
  const breakdown: { label: string; amountEur: number }[] = [
    { label: `${vc.label} · ${hours}h`, amountEur: base },
  ];

  let total = base;
  if (input.pickupAt && isNight(input.pickupAt)) {
    const surcharge = Math.round(total * 0.15);
    breakdown.push({ label: "Night surcharge (22:00–06:00)", amountEur: surcharge });
    total += surcharge;
  }

  return {
    hours,
    vehicleClass: input.vehicleClass,
    currency: "EUR",
    breakdown,
    totalEur: total,
  };
}

/** Numeric bag capacity for a vehicle class (parsed from the "7 bags" label). */
export function bagCapacity(vehicleClass: VehicleClass): number {
  const vc = VEHICLE_CLASSES.find((c) => c.id === vehicleClass);
  const n = vc ? parseInt(vc.bags, 10) : NaN;
  return Number.isNaN(n) ? 3 : n;
}

export function formatEur(amount: number): string {
  const sign = amount < 0 ? "−" : "";
  return `${sign}€${Math.abs(amount).toLocaleString("en-IE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/** Base EUR for an airport hub (city from-price) or a nested airport route. */
export function airportBasePriceEur(input: {
  airportSlug: string;
  routeSlug?: string;
}): number | null {
  if (input.routeSlug) {
    const ar = getAirportRoute(input.airportSlug, input.routeSlug);
    if (ar?.legacyRouteSlug) {
      const legacy = getRoute(ar.legacyRouteSlug);
      if (legacy) return legacy.basePriceEur;
    }
    if (ar) return ar.basePriceEur;
    return null;
  }
  const airport = getAirport(input.airportSlug);
  return airport?.fromPriceEur ?? null;
}

export function quoteAirportRoute(input: {
  airportSlug: string;
  routeSlug?: string;
  vehicleClass: VehicleClass;
}): { totalEur: number; baseEur: number; vehicleClass: VehicleClass; bookable: "instant" | "quote" } | null {
  const airport = getAirport(input.airportSlug);
  const vc = VEHICLE_CLASSES.find((c) => c.id === input.vehicleClass);
  if (!airport || !vc) return null;

  let baseEur = airport.fromPriceEur;
  let bookable = airport.bookable;
  let ar: AirportRouteData | undefined;

  if (input.routeSlug) {
    ar = getAirportRoute(input.airportSlug, input.routeSlug);
    if (!ar) return null;
    if (ar.legacyRouteSlug) {
      const legacy = getRoute(ar.legacyRouteSlug);
      if (legacy) baseEur = legacy.basePriceEur;
      else baseEur = ar.basePriceEur;
    } else {
      baseEur = ar.basePriceEur;
    }
    bookable = ar.bookable;
  }

  const totalEur = Math.round(baseEur * vc.multiplier);
  return { totalEur, baseEur, vehicleClass: input.vehicleClass, bookable };
}

export function vehicleFromPrices(
  airport: AirportData,
  route?: AirportRouteData,
): { id: VehicleClass; label: string; capacity: string; bags: string; example: string; fromEur: number }[] {
  const base = route
    ? route.legacyRouteSlug
      ? (getRoute(route.legacyRouteSlug)?.basePriceEur ?? route.basePriceEur)
      : route.basePriceEur
    : airport.fromPriceEur;

  return VEHICLE_CLASSES.map((vc) => ({
    id: vc.id,
    label: vc.label,
    capacity: vc.capacity,
    bags: vc.bags,
    example: vc.example,
    fromEur: Math.round(base * vc.multiplier),
  }));
}
