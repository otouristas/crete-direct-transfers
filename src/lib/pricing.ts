import { getRoute, VEHICLE_CLASSES, type VehicleClass } from "@/data/routes";

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
