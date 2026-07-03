import { getRoute, VEHICLE_CLASSES, type VehicleClass } from "@/data/routes";

export type Extras = {
  childSeat?: boolean;
  extraStop?: boolean;
  meetAndGreet?: boolean;
};

export type Quote = {
  routeSlug: string;
  vehicleClass: VehicleClass;
  currency: "EUR";
  breakdown: { label: string; amountEur: number }[];
  totalEur: number;
};

const EXTRA_PRICES = {
  childSeat: 10,
  extraStop: 15,
  meetAndGreet: 10,
};

export function quote(input: {
  routeSlug: string;
  vehicleClass: VehicleClass;
  pickupAt?: Date;
  extras?: Extras;
}): Quote | null {
  const route = getRoute(input.routeSlug);
  const vc = VEHICLE_CLASSES.find((c) => c.id === input.vehicleClass);
  if (!route || !vc) return null;

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

  let subtotal = breakdown.reduce((s, b) => s + b.amountEur, 0);

  // Night surcharge 22:00–06:00 (+15%)
  if (input.pickupAt) {
    const h = input.pickupAt.getHours();
    if (h >= 22 || h < 6) {
      const surcharge = Math.round(subtotal * 0.15);
      breakdown.push({ label: "Night surcharge (22:00–06:00)", amountEur: surcharge });
      subtotal += surcharge;
    }
  }

  return {
    routeSlug: input.routeSlug,
    vehicleClass: input.vehicleClass,
    currency: "EUR",
    breakdown,
    totalEur: subtotal,
  };
}

export function formatEur(amount: number): string {
  return `€${amount.toLocaleString("en-IE", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
