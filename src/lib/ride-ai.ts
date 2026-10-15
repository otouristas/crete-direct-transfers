import { VEHICLE_CLASSES, type VehicleClass } from "../data/routes.ts";
import { z } from "zod";
import type { PlaceResult } from "./place-search";

export const rideIntentSchema = z
  .object({
    reply: z.string().max(600),
    pickupQuery: z.string().max(180).nullable(),
    destinationQuery: z.string().max(180).nullable(),
    pickupDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .nullable(),
    pickupTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
      .nullable(),
    passengers: z.number().int().min(1).max(16).nullable(),
    bags: z.number().int().min(0).max(20).nullable(),
    flightNumber: z.string().max(20).nullable(),
    specialRequirements: z.string().max(300).nullable(),
    vehiclePreference: z
      .enum([
        "economy",
        "comfort",
        "luxury",
        "suv",
        "minivan",
        "van-first",
        "minibus-12",
        "minibus-16",
      ])
      .nullable(),
    useCurrentLocation: z.boolean(),
  })
  .strict();
export type RideIntent = z.infer<typeof rideIntentSchema>;
export type RideMessage = { role: "user" | "assistant"; content: string };
export type RideAIResult = {
  reply: string;
  questions: string[];
  intent: RideIntent;
  from: PlaceResult | null;
  to: PlaceResult | null;
  pickupOptions: PlaceResult[];
  destinationOptions: PlaceResult[];
  recommendation: null | {
    vehicleClass: VehicleClass;
    title: string;
    priceCents: number;
    distanceKm: number | null;
    durationMin: number | null;
    routeSource: "road" | "estimated" | null;
    pickupAt: string;
    timeZone: string;
    bookPath: string;
  };
};

export function matchingVehicle(
  passengers: number,
  bags: number,
  preference: RideIntent["vehiclePreference"],
) {
  const fits = (vehicle: (typeof VEHICLE_CLASSES)[number]) =>
    passengers <= Number(vehicle.capacity.match(/\d+/g)?.at(-1)) &&
    bags <= parseInt(vehicle.bags, 10);
  const requested = preference && VEHICLE_CLASSES.find((v) => v.id === preference);
  if (requested && fits(requested)) return requested.id;
  return (
    [...VEHICLE_CLASSES].filter(fits).sort((a, b) => a.multiplier - b.multiplier)[0]?.id ?? null
  );
}
