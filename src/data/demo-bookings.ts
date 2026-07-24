import type { Booking, DriverInfo } from "@/queries/bookings";

/** Fixed UUID-style ids so detail links stay stable across reloads. */
const DEMO_PREFIX = "demo-";

export function isDemoBookingId(id: string): boolean {
  return id.startsWith(DEMO_PREFIX);
}

function daysFromNow(days: number, hour = 12, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function base(partial: Partial<Booking> & Pick<Booking, "id" | "route_slug" | "status" | "pickup_at" | "price_cents" | "vehicle_class">): Booking {
  return {
    assigned_at: null,
    bags_cabin: 1,
    bags_checked: 2,
    created_at: daysFromNow(-14, 10, 0),
    currency: "EUR",
    customer_email: "demo@transferaround.com",
    customer_name: "Maria Papadakis",
    customer_phone: "+30 694 000 1122",
    driver_id: null,
    extras: {},
    flight_number: null,
    notes: null,
    passengers: 2,
    pickup_address: null,
    pickup_point: null,
    dropoff_address: null,
    dropoff_point: null,
    return_at: null,
    return_flight_number: null,
    trip_type: "oneway",
    updated_at: daysFromNow(-1, 9, 0),
    user_id: null,
    ...partial,
  };
}

/** Sample bookings spanning upcoming / completed / canceled + several routes. */
export const DEMO_BOOKINGS: Booking[] = [
  // —— Upcoming ——
  base({
    id: `${DEMO_PREFIX}upcoming-pending`,
    route_slug: "heraklion-airport-to-elounda",
    status: "pending",
    pickup_at: daysFromNow(5, 14, 30),
    price_cents: 8500,
    vehicle_class: "comfort",
    flight_number: "A3 123",
    bags_cabin: 2,
    bags_checked: 2,
    passengers: 2,
    extras: { meetAndGreet: true },
  }),
  base({
    id: `${DEMO_PREFIX}upcoming-claimed`,
    route_slug: "chania-airport-to-chania-old-town",
    status: "claimed",
    pickup_at: daysFromNow(2, 11, 15),
    price_cents: 3500,
    vehicle_class: "economy",
    flight_number: "FR 4567",
    assigned_at: daysFromNow(-1, 16, 0),
    driver_id: `${DEMO_PREFIX}driver-1`,
    passengers: 1,
    bags_checked: 1,
  }),
  base({
    id: `${DEMO_PREFIX}upcoming-en-route`,
    route_slug: "heraklion-airport-to-hersonissos",
    status: "en_route",
    pickup_at: daysFromNow(0, 23, 45),
    price_cents: 4500,
    vehicle_class: "minivan",
    flight_number: "W6 890",
    assigned_at: daysFromNow(0, 20, 0),
    driver_id: `${DEMO_PREFIX}driver-2`,
    passengers: 4,
    bags_cabin: 2,
    bags_checked: 4,
    extras: { childSeat: true },
  }),
  base({
    id: `${DEMO_PREFIX}upcoming-return`,
    route_slug: "heraklion-airport-to-rethymno",
    status: "pending",
    pickup_at: daysFromNow(12, 10, 0),
    return_at: daysFromNow(19, 16, 30),
    return_flight_number: "A3 456",
    trip_type: "return",
    price_cents: 16000,
    vehicle_class: "suv",
    flight_number: "A3 321",
    passengers: 3,
    bags_checked: 3,
  }),
  base({
    id: `${DEMO_PREFIX}upcoming-distance`,
    route_slug: "distance",
    status: "claimed",
    pickup_at: daysFromNow(8, 9, 0),
    price_cents: 7200,
    vehicle_class: "comfort",
    pickup_address: "Knossos Palace, Heraklion",
    dropoff_address: "Elafonissi Beach, Kissamos",
    assigned_at: daysFromNow(-2, 11, 0),
    driver_id: `${DEMO_PREFIX}driver-1`,
    passengers: 2,
    notes: "Scenic stop at Balos if traffic allows",
  }),
  base({
    id: `${DEMO_PREFIX}upcoming-hourly`,
    route_slug: "hourly-4h",
    status: "pending",
    pickup_at: daysFromNow(15, 9, 30),
    price_cents: 18000,
    vehicle_class: "luxury",
    pickup_address: "Hotel Porto Veneziano, Chania Old Town",
    dropoff_address: "Hourly chauffeur — 4 hours",
    passengers: 2,
    bags_cabin: 0,
    bags_checked: 0,
    notes: "Private sightseeing: Chania → Balos → Falasarna",
    extras: { extraStop: true },
  }),

  // —— Completed ——
  base({
    id: `${DEMO_PREFIX}completed-1`,
    route_slug: "heraklion-airport-to-agios-nikolaos",
    status: "completed",
    pickup_at: daysFromNow(-10, 13, 20),
    price_cents: 7800,
    vehicle_class: "comfort",
    flight_number: "OA 90",
    assigned_at: daysFromNow(-11, 8, 0),
    driver_id: `${DEMO_PREFIX}driver-1`,
    passengers: 2,
  }),
  base({
    id: `${DEMO_PREFIX}completed-2`,
    route_slug: "chania-airport-to-platanias",
    status: "completed",
    pickup_at: daysFromNow(-28, 16, 45),
    price_cents: 4200,
    vehicle_class: "economy",
    flight_number: "U2 6401",
    assigned_at: daysFromNow(-29, 10, 0),
    driver_id: `${DEMO_PREFIX}driver-2`,
    passengers: 2,
    bags_checked: 2,
  }),
  base({
    id: `${DEMO_PREFIX}completed-past-pending`,
    route_slug: "souda-port-to-chania-old-town",
    status: "claimed",
    pickup_at: daysFromNow(-3, 8, 0),
    price_cents: 2800,
    vehicle_class: "economy",
    assigned_at: daysFromNow(-4, 12, 0),
    driver_id: `${DEMO_PREFIX}driver-1`,
    passengers: 1,
    bags_checked: 1,
  }),
  base({
    id: `${DEMO_PREFIX}completed-no-show`,
    route_slug: "heraklion-airport-to-malia",
    status: "no_show",
    pickup_at: daysFromNow(-45, 1, 10),
    price_cents: 5200,
    vehicle_class: "minivan",
    flight_number: "GQ 250",
    assigned_at: daysFromNow(-46, 9, 0),
    driver_id: `${DEMO_PREFIX}driver-2`,
    passengers: 5,
  }),
  base({
    id: `${DEMO_PREFIX}completed-distance`,
    route_slug: "distance",
    status: "completed",
    pickup_at: daysFromNow(-18, 10, 30),
    price_cents: 9500,
    vehicle_class: "van-first",
    pickup_address: "Rethymno Old Town harbour",
    dropoff_address: "Matala Beach, Heraklion",
    assigned_at: daysFromNow(-19, 14, 0),
    driver_id: `${DEMO_PREFIX}driver-1`,
    passengers: 3,
  }),

  // —— Canceled ——
  base({
    id: `${DEMO_PREFIX}canceled-1`,
    route_slug: "heraklion-airport-to-chania",
    status: "cancelled",
    pickup_at: daysFromNow(20, 12, 0),
    price_cents: 14500,
    vehicle_class: "comfort",
    flight_number: "A3 600",
    passengers: 2,
    created_at: daysFromNow(-7, 11, 0),
    updated_at: daysFromNow(-5, 15, 0),
  }),
  base({
    id: `${DEMO_PREFIX}canceled-2`,
    route_slug: "rethymno-to-plakias",
    status: "cancelled",
    pickup_at: daysFromNow(-6, 9, 0),
    price_cents: 5500,
    vehicle_class: "economy",
    passengers: 2,
    created_at: daysFromNow(-20, 10, 0),
    updated_at: daysFromNow(-8, 18, 0),
  }),
  base({
    id: `${DEMO_PREFIX}canceled-hourly`,
    route_slug: "hourly-3h",
    status: "cancelled",
    pickup_at: daysFromNow(-12, 14, 0),
    price_cents: 13500,
    vehicle_class: "luxury",
    pickup_address: "Blue Palace Resort, Elounda",
    dropoff_address: "Hourly chauffeur — 3 hours",
    passengers: 2,
    bags_cabin: 0,
    bags_checked: 0,
  }),
];

export const DEMO_DRIVERS: Record<string, DriverInfo> = {
  [`${DEMO_PREFIX}upcoming-claimed`]: {
    full_name: "Nikos Stavrou",
    phone: "+30 694 111 2233",
    vehicle_make_model: "Skoda Octavia",
    vehicle_plate: "HKX-4521",
    vehicle_class: "economy",
  },
  [`${DEMO_PREFIX}upcoming-en-route`]: {
    full_name: "Elena Markou",
    phone: "+30 694 222 3344",
    vehicle_make_model: "Mercedes Vito",
    vehicle_plate: "XHK-8810",
    vehicle_class: "minivan",
  },
  [`${DEMO_PREFIX}upcoming-distance`]: {
    full_name: "Nikos Stavrou",
    phone: "+30 694 111 2233",
    vehicle_make_model: "Mercedes E-Class",
    vehicle_plate: "HKX-4521",
    vehicle_class: "comfort",
  },
  [`${DEMO_PREFIX}completed-1`]: {
    full_name: "Nikos Stavrou",
    phone: "+30 694 111 2233",
    vehicle_make_model: "Mercedes E-Class",
    vehicle_plate: "HKX-4521",
    vehicle_class: "comfort",
  },
  [`${DEMO_PREFIX}completed-2`]: {
    full_name: "Elena Markou",
    phone: "+30 694 222 3344",
    vehicle_make_model: "Toyota Prius",
    vehicle_plate: "XHK-8810",
    vehicle_class: "economy",
  },
  [`${DEMO_PREFIX}completed-past-pending`]: {
    full_name: "Nikos Stavrou",
    phone: "+30 694 111 2233",
    vehicle_make_model: "Skoda Octavia",
    vehicle_plate: "HKX-4521",
    vehicle_class: "economy",
  },
  [`${DEMO_PREFIX}completed-no-show`]: {
    full_name: "Elena Markou",
    phone: "+30 694 222 3344",
    vehicle_make_model: "Mercedes Vito",
    vehicle_plate: "XHK-8810",
    vehicle_class: "minivan",
  },
  [`${DEMO_PREFIX}completed-distance`]: {
    full_name: "Nikos Stavrou",
    phone: "+30 694 111 2233",
    vehicle_make_model: "Mercedes V-Class",
    vehicle_plate: "HKX-4521",
    vehicle_class: "van-first",
  },
};

export function getDemoBooking(id: string): Booking | null {
  return DEMO_BOOKINGS.find((b) => b.id === id) ?? null;
}

export function getDemoDriver(bookingId: string): DriverInfo | null {
  return DEMO_DRIVERS[bookingId] ?? null;
}

/** Demo mode: VITE_DEMO_BOOKINGS=true forces on; =false forces off; else DEV only. */
export function isDemoBookingsEnabled(): boolean {
  const flag = import.meta.env.VITE_DEMO_BOOKINGS;
  if (flag === "false" || flag === "0") return false;
  if (flag === "true" || flag === "1") return true;
  return Boolean(import.meta.env.DEV);
}
