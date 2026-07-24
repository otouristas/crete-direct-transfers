import type { IconName } from "@transferaround/mobile-shared/ui";
import type { ImageSourcePropType } from "react-native";

/**
 * Uber-style vehicle classes. `priceMultiplier` scales the base preset fare
 * (which is priced for economy). `vehicleClass` is what we send to Supabase.
 */
export type VehicleOption = {
  id: string;
  vehicleClass: string;
  name: string;
  tagline: string;
  seats: number;
  icon: IconName;
  image: ImageSourcePropType;
  priceMultiplier: number;
};

export const VEHICLE_OPTIONS: VehicleOption[] = [
  {
    id: "economy",
    vehicleClass: "economy",
    name: "Economy",
    tagline: "Everyday sedan",
    seats: 3,
    icon: "car-outline",
    image: require("../assets/fleet/economy.jpg"),
    priceMultiplier: 1,
  },
  {
    id: "comfort",
    vehicleClass: "comfort",
    name: "Comfort",
    tagline: "Newer, roomier ride",
    seats: 3,
    icon: "car-sport-outline",
    image: require("../assets/fleet/comfort.jpg"),
    priceMultiplier: 1.35,
  },
  {
    id: "luxury",
    vehicleClass: "luxury",
    name: "Luxury",
    tagline: "Premium Mercedes-class",
    seats: 3,
    icon: "diamond-outline",
    image: require("../assets/fleet/luxury.jpg"),
    priceMultiplier: 1.9,
  },
  {
    id: "minivan",
    vehicleClass: "minivan",
    name: "Van",
    tagline: "Up to 6 · extra luggage",
    seats: 6,
    icon: "bus-outline",
    image: require("../assets/fleet/minivan.jpg"),
    priceMultiplier: 1.6,
  },
];

/** Fare (in cents) for a vehicle class given the route's economy base price. */
export function priceForClass(baseCents: number, option: VehicleOption): number {
  return Math.round((baseCents * option.priceMultiplier) / 100) * 100;
}
