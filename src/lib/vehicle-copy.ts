import type { Dict } from "@/i18n";
import { VEHICLE_CLASSES, type VehicleClass } from "@/data/routes";

type VehicleLike = {
  id: VehicleClass | string;
  capacity: string;
  bags: string;
  description: string;
};

function firstNumber(value: string): number {
  const match = value.match(/(\d+)(?!.*\d)/);
  return match ? Number(match[1]) : 0;
}

/** "1–7 passengers" in the active language. */
export function vehicleCapacity(t: Dict, vehicle: VehicleLike): string {
  return t.vehicles.capacity(firstNumber(vehicle.capacity));
}

/** "7 bags" in the active language. */
export function vehicleBags(t: Dict, vehicle: VehicleLike): string {
  return t.vehicles.bags(firstNumber(vehicle.bags));
}

/** Localized marketing description for a fleet class. */
export function vehicleDescription(t: Dict, vehicle: VehicleLike): string {
  const map = t.vehicles.descriptions as Record<string, string | undefined>;
  return map[vehicle.id] ?? vehicle.description;
}

/** Capacity + bags line, e.g. "1–7 passengers · 7 bags". */
export function vehicleSpecs(t: Dict, vehicle: VehicleLike): string {
  return `${vehicleCapacity(t, vehicle)} · ${vehicleBags(t, vehicle)}`;
}

export function getVehicleClass(id: string) {
  return VEHICLE_CLASSES.find((v) => v.id === id);
}
