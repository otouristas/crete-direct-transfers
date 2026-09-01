import { getRoute, VEHICLE_CLASSES, type VehicleClass } from "@/data/routes";
import { getAirport, type AirportData } from "@/data/airports";
import { getAirportRoute, type AirportRouteData } from "@/data/airport-routes";
import { formatMoney } from "@/lib/currency";
import { getTerritory } from "@/data/territories";

export type Extras = {
  childSeat?: boolean;
  extraStop?: boolean;
  meetAndGreet?: boolean;
};

export type TripType = "oneway" | "return";

/** Stable, language-independent identifiers for fare lines. */
export type PriceLineCode =
  | "vehicle"
  | "hourly"
  | "childSeat"
  | "extraStop"
  | "meetAndGreet"
  | "nightSurcharge"
  | "returnTrip"
  | "returnDiscount";

export type PriceLine = {
  /** Language-independent code — render via `priceLineLabel()`. */
  code: PriceLineCode;
  /** Interpolation values (vehicle label, hours). */
  params?: { vehicle?: string; hours?: number };
  /** English fallback, also what gets persisted with the quote. */
  label: string;
  amountEur: number;
};

export type Quote = {
  routeSlug: string;
  vehicleClass: VehicleClass;
  tripType: TripType;
  currency: "EUR";
  breakdown: PriceLine[];
  totalEur: number;
};

const EN_LINE_LABELS: Record<PriceLineCode, string> = {
  vehicle: "vehicle",
  hourly: "hourly",
  childSeat: "Child seat",
  extraStop: "Extra stop",
  meetAndGreet: "Meet & greet with sign",
  nightSurcharge: "Night surcharge (22:00–06:00)",
  returnTrip: "Return trip",
  returnDiscount: "Return discount (−5%)",
};

function line(
  code: PriceLineCode,
  amountEur: number,
  params?: { vehicle?: string; hours?: number },
): PriceLine {
  const label =
    code === "vehicle"
      ? `${params?.vehicle ?? ""} vehicle`.trim()
      : code === "hourly"
        ? `${params?.vehicle ?? ""} · ${params?.hours ?? 0}h`
        : EN_LINE_LABELS[code];
  return params ? { code, params, label, amountEur } : { code, label, amountEur };
}

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
  const breakdown: PriceLine[] = [line("vehicle", base, { vehicle: vc.label })];

  if (input.extras?.childSeat) {
    breakdown.push(line("childSeat", EXTRA_PRICES.childSeat));
  }
  if (input.extras?.extraStop) {
    breakdown.push(line("extraStop", EXTRA_PRICES.extraStop));
  }
  if (input.extras?.meetAndGreet) {
    breakdown.push(line("meetAndGreet", EXTRA_PRICES.meetAndGreet));
  }

  let outboundSubtotal = breakdown.reduce((s, b) => s + b.amountEur, 0);

  // Night surcharge 22:00–06:00 (+15%) per leg, based on that leg's pickup time
  if (input.pickupAt && isNight(input.pickupAt)) {
    const surcharge = Math.round(outboundSubtotal * 0.15);
    breakdown.push(line("nightSurcharge", surcharge));
    outboundSubtotal += surcharge;
  }

  let total = outboundSubtotal;

  if (tripType === "return") {
    // Return leg: same base + extras, its own night-surcharge check
    let returnSubtotal = breakdown
      .filter((b) => b.code !== "nightSurcharge")
      .reduce((s, b) => s + b.amountEur, 0);
    if (input.returnAt && isNight(input.returnAt)) {
      returnSubtotal += Math.round(returnSubtotal * 0.15);
    }
    breakdown.push(line("returnTrip", returnSubtotal));
    total += returnSubtotal;

    const discount = -Math.round(total * RETURN_DISCOUNT);
    breakdown.push(line("returnDiscount", discount));
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
  breakdown: PriceLine[];
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
  const breakdown: PriceLine[] = [line("hourly", base, { vehicle: vc.label, hours })];

  let total = base;
  if (input.pickupAt && isNight(input.pickupAt)) {
    const surcharge = Math.round(total * 0.15);
    breakdown.push(line("nightSurcharge", surcharge));
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
  return formatMoney(amount);
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
}): {
  totalEur: number;
  baseEur: number;
  vehicleClass: VehicleClass;
  bookable: "instant" | "quote";
} | null {
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
): {
  id: VehicleClass;
  label: string;
  capacity: string;
  bags: string;
  example: string;
  fromEur: number;
}[] {
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

/**
 * Distance-based economy base. Defaults match the launch territory (Crete:
 * ~EUR 1.15/km, EUR 35 floor); pass a territory slug and the registered
 * per-territory fare parameters are used instead.
 */
const DISTANCE_FLOOR_EUR = 35;
const DISTANCE_RATE_PER_KM = 1.15;

export function distanceBaseEur(distanceKm: number, territorySlug?: string): number {
  const pricing = territorySlug ? getTerritory(territorySlug)?.pricing : undefined;
  const floor = pricing?.floorEur ?? DISTANCE_FLOOR_EUR;
  const perKm = pricing?.perKmEur ?? DISTANCE_RATE_PER_KM;
  return Math.max(floor, Math.round(distanceKm * perKm));
}

export type TripQuote = Quote & {
  source: "fixed" | "distance";
  distanceKm?: number;
  durationMin?: number;
};

/** Build quote from a known Crete route slug OR a distance-based base. */
export function quoteFromBase(input: {
  routeSlug: string;
  baseEur: number;
  vehicleClass: VehicleClass;
  pickupAt?: Date;
  extras?: Extras;
  tripType?: TripType;
  returnAt?: Date;
  source: "fixed" | "distance";
  distanceKm?: number;
  durationMin?: number;
}): TripQuote | null {
  const vc = VEHICLE_CLASSES.find((c) => c.id === input.vehicleClass);
  if (!vc) return null;

  const tripType: TripType = input.tripType ?? "oneway";
  const base = Math.round(input.baseEur * vc.multiplier);
  const breakdown: PriceLine[] = [line("vehicle", base, { vehicle: vc.label })];

  if (input.extras?.childSeat) {
    breakdown.push(line("childSeat", EXTRA_PRICES.childSeat));
  }
  if (input.extras?.extraStop) {
    breakdown.push(line("extraStop", EXTRA_PRICES.extraStop));
  }
  if (input.extras?.meetAndGreet) {
    breakdown.push(line("meetAndGreet", EXTRA_PRICES.meetAndGreet));
  }

  let outboundSubtotal = breakdown.reduce((s, b) => s + b.amountEur, 0);

  if (input.pickupAt && isNight(input.pickupAt)) {
    const surcharge = Math.round(outboundSubtotal * 0.15);
    breakdown.push(line("nightSurcharge", surcharge));
    outboundSubtotal += surcharge;
  }

  let total = outboundSubtotal;

  if (tripType === "return") {
    let returnSubtotal = breakdown
      .filter((b) => b.code !== "nightSurcharge")
      .reduce((s, b) => s + b.amountEur, 0);
    if (input.returnAt && isNight(input.returnAt)) {
      returnSubtotal += Math.round(returnSubtotal * 0.15);
    }
    breakdown.push(line("returnTrip", returnSubtotal));
    total += returnSubtotal;

    const discount = -Math.round(total * RETURN_DISCOUNT);
    breakdown.push(line("returnDiscount", discount));
    total += discount;
  }

  return {
    routeSlug: input.routeSlug,
    vehicleClass: input.vehicleClass,
    tripType,
    currency: "EUR",
    breakdown,
    totalEur: total,
    source: input.source,
    distanceKm: input.distanceKm,
    durationMin: input.durationMin,
  };
}

/** Quote a trip: prefer fixed Crete ROUTES, else distance-based. */
export function quoteTrip(input: {
  routeSlug?: string;
  distanceKm?: number;
  durationMin?: number;
  vehicleClass: VehicleClass;
  pickupAt?: Date;
  extras?: Extras;
  tripType?: TripType;
  returnAt?: Date;
}): TripQuote | null {
  if (input.routeSlug) {
    const fixed = quote({
      routeSlug: input.routeSlug,
      vehicleClass: input.vehicleClass,
      pickupAt: input.pickupAt,
      extras: input.extras,
      tripType: input.tripType,
      returnAt: input.returnAt,
    });
    if (fixed) {
      const route = getRoute(input.routeSlug);
      return {
        ...fixed,
        source: "fixed",
        distanceKm: route?.distanceKm ?? input.distanceKm,
        durationMin: route?.durationMin ?? input.durationMin,
      };
    }
  }

  if (input.distanceKm == null || input.distanceKm <= 0) return null;

  return quoteFromBase({
    routeSlug: input.routeSlug ?? `distance-${Math.round(input.distanceKm)}km`,
    baseEur: distanceBaseEur(input.distanceKm),
    vehicleClass: input.vehicleClass,
    pickupAt: input.pickupAt,
    extras: input.extras,
    tripType: input.tripType,
    returnAt: input.returnAt,
    source: "distance",
    distanceKm: input.distanceKm,
    durationMin: input.durationMin,
  });
}

/** Quotes for every vehicle class (vehicle picker list). */
export function quoteAllClasses(input: {
  routeSlug?: string;
  distanceKm?: number;
  durationMin?: number;
  pickupAt?: Date;
  extras?: Extras;
  tripType?: TripType;
  returnAt?: Date;
}): { vehicleClass: VehicleClass; quote: TripQuote }[] {
  return VEHICLE_CLASSES.map((vc) => {
    const q = quoteTrip({ ...input, vehicleClass: vc.id });
    return q ? { vehicleClass: vc.id, quote: q } : null;
  }).filter((x): x is { vehicleClass: VehicleClass; quote: TripQuote } => x != null);
}
