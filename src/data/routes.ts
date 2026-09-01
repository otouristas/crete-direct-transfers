import { getCityImage, getRegionImage, getServiceImage, imageUrl } from "@/lib/place-image";

export type VehicleClass =
  | "economy"
  | "comfort"
  | "luxury"
  | "suv"
  | "minivan"
  | "van-first"
  | "minibus-12"
  | "minibus-16";

export const VEHICLE_CLASSES: {
  id: VehicleClass;
  label: string;
  capacity: string;
  bags: string;
  multiplier: number;
  description: string;
  example: string;
  image: string;
}[] = [
  {
    id: "economy",
    label: "Economy",
    capacity: "1–3 passengers",
    bags: "3 bags",
    multiplier: 1.0,
    description: "Skoda Octavia, Toyota Prius or similar. Air-conditioned, clean, punctual.",
    example: "Skoda Octavia",
    image: "/fleet/economy.jpg",
  },
  {
    id: "comfort",
    label: "Standard Class",
    capacity: "1–3 passengers",
    bags: "3 bags",
    multiplier: 1.25,
    description: "Mercedes E-Class, BMW 5 Series or similar. Extra legroom, water on board.",
    example: "Mercedes E-Class",
    image: "/fleet/comfort.jpg",
  },
  {
    id: "luxury",
    label: "First Class",
    capacity: "1–3 passengers",
    bags: "3 bags",
    multiplier: 2.1,
    description:
      "Mercedes S-Class, BMW 7, Audi A8 or similar. Chauffeur service, still fixed price.",
    example: "Mercedes S-Class",
    image: "/fleet/luxury.jpg",
  },
  {
    id: "suv",
    label: "SUV",
    capacity: "1–6 passengers",
    bags: "6 bags",
    multiplier: 1.8,
    description:
      "Cadillac Escalade, Chevrolet Suburban or similar. Space and presence for families.",
    example: "Cadillac Escalade",
    image: "/fleet/suv.jpg",
  },
  {
    id: "minivan",
    label: "Van Standard",
    capacity: "1–7 passengers",
    bags: "7 bags",
    multiplier: 1.6,
    description: "Mercedes Vito, Ford Custom or similar. The right pick for families and groups.",
    example: "Mercedes Vito",
    image: "/fleet/minivan.jpg",
  },
  {
    id: "van-first",
    label: "Van First Class",
    capacity: "1–6 passengers",
    bags: "6 bags",
    multiplier: 2.0,
    description: "Mercedes V-Class or similar. Premium van comfort for small groups.",
    example: "Mercedes V-Class",
    image: "/fleet/van-first.jpg",
  },
  {
    id: "minibus-12",
    label: "Minibus (12 Pax)",
    capacity: "1–12 passengers",
    bags: "12 bags",
    multiplier: 2.4,
    description: "Mercedes Sprinter, Ford Transit or similar. Ideal for larger groups.",
    example: "Mercedes Sprinter",
    image: "/fleet/minibus-12.jpg",
  },
  {
    id: "minibus-16",
    label: "Minibus (16 Pax)",
    capacity: "1–16 passengers",
    bags: "16 bags",
    multiplier: 2.8,
    description:
      "Mercedes Sprinter, Ford Transit or similar. Maximum capacity for parties and teams.",
    example: "Mercedes Sprinter",
    image: "/fleet/minibus-16.jpg",
  },
];

export type Region = "Chania" | "Rethymno" | "Heraklion" | "Lasithi";

export type RouteData = {
  slug: string;
  from: string;
  to: string;
  distanceKm: number;
  durationMin: number;
  basePriceEur: number;
  heroImage: string;
  blurb: string;
  notes: string;
  region: Region;
  service: "airport" | "port" | "cross-island" | "hotel";
};


export function getRoute(slug: string): RouteData | undefined {
  return ROUTES.find((r) => r.slug === slug);
}

export function routesByRegion(region: Region): RouteData[] {
  return ROUTES.filter((r) => r.region === region);
}

export function routesByService(service: RouteData["service"]): RouteData[] {
  return ROUTES.filter((r) => r.service === service);
}
