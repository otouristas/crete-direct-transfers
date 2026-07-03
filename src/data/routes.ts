export type VehicleClass = "economy" | "comfort" | "minivan" | "luxury";

export const VEHICLE_CLASSES: {
  id: VehicleClass;
  label: string;
  capacity: string;
  bags: string;
  multiplier: number;
  description: string;
  example: string;
}[] = [
  {
    id: "economy",
    label: "Economy",
    capacity: "1–3 passengers",
    bags: "3 bags",
    multiplier: 1.0,
    description: "Skoda Octavia or similar. Air-conditioned, clean, punctual.",
    example: "Skoda Octavia",
  },
  {
    id: "comfort",
    label: "Comfort",
    capacity: "1–3 passengers",
    bags: "3 bags",
    multiplier: 1.25,
    description: "Mercedes E-Class or similar. Extra legroom, water on board.",
    example: "Mercedes E-Class",
  },
  {
    id: "minivan",
    label: "Minivan",
    capacity: "1–7 passengers",
    bags: "7 bags",
    multiplier: 1.6,
    description: "Mercedes Vito or Ford Tourneo. The right pick for families and groups.",
    example: "Mercedes Vito",
  },
  {
    id: "luxury",
    label: "Luxury",
    capacity: "1–3 passengers",
    bags: "3 bags",
    multiplier: 2.1,
    description: "Mercedes S-Class or BMW 7-Series. Chauffeur in suit, still fixed price.",
    example: "Mercedes S-Class",
  },
];

export type RouteData = {
  slug: string;
  from: string;
  to: string;
  distanceKm: number;
  durationMin: number;
  basePriceEur: number; // economy base
  heroImage: string;
  blurb: string;
  notes: string;
  region: "Chania" | "Rethymno" | "Heraklion" | "Lasithi";
};

export const ROUTES: RouteData[] = [
  {
    slug: "heraklion-airport-to-elounda",
    from: "Heraklion Airport (HER)",
    to: "Elounda",
    distanceKm: 71,
    durationMin: 75,
    basePriceEur: 85,
    heroImage:
      "https://images.unsplash.com/photo-1601581875039-e899893d520c?auto=format&fit=crop&w=1600&q=70",
    blurb:
      "The classic transfer from Heraklion airport up the northeast coast to Elounda's boutique hotels and Mirabello Bay.",
    notes:
      "Route follows the E75 coastal motorway to Agios Nikolaos, then the winding hill road to Elounda. Drivers know the private hotel entrances at Blue Palace, Domes, and Elounda Beach.",
    region: "Lasithi",
  },
  {
    slug: "heraklion-airport-to-agios-nikolaos",
    from: "Heraklion Airport (HER)",
    to: "Agios Nikolaos",
    distanceKm: 65,
    durationMin: 65,
    basePriceEur: 75,
    heroImage:
      "https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=1600&q=70",
    blurb:
      "Straight down the E75 motorway to Agios Nikolaos and Lake Voulismeni — Crete's most Instagrammed town square.",
    notes: "Motorway the whole way. Roughly one hour outside of peak August afternoons.",
    region: "Lasithi",
  },
  {
    slug: "heraklion-airport-to-hersonissos",
    from: "Heraklion Airport (HER)",
    to: "Hersonissos",
    distanceKm: 26,
    durationMin: 30,
    basePriceEur: 42,
    heroImage:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=70",
    blurb: "Short hop east to the resort strip — Stalis, Malia and Hersonissos hotels.",
    notes: "Traffic can slow the last 3km in peak summer evenings; we build a buffer in.",
    region: "Heraklion",
  },
  {
    slug: "heraklion-airport-to-rethymno",
    from: "Heraklion Airport (HER)",
    to: "Rethymno",
    distanceKm: 80,
    durationMin: 75,
    basePriceEur: 95,
    heroImage:
      "https://images.unsplash.com/photo-1571498664957-fde285d79857?auto=format&fit=crop&w=1600&q=70",
    blurb:
      "West on the E75 with the Sea of Crete on your right the whole way. Old Venetian harbour drop-off available.",
    notes: "Old town of Rethymno is pedestrianised — we drop at the harbour or nearest hotel access point.",
    region: "Rethymno",
  },
  {
    slug: "chania-airport-to-chania-old-town",
    from: "Chania Airport (CHQ)",
    to: "Chania Old Town",
    distanceKm: 15,
    durationMin: 20,
    basePriceEur: 32,
    heroImage:
      "https://images.unsplash.com/photo-1601161221525-6b3e0f0e13db?auto=format&fit=crop&w=1600&q=70",
    blurb: "Straight into the Venetian harbour. Meet-and-greet at arrivals gate, sign with your name.",
    notes: "Old town access restricted to residents — we drop at the harbour edge, 3 minutes on foot to most hotels.",
    region: "Chania",
  },
  {
    slug: "chania-airport-to-rethymno",
    from: "Chania Airport (CHQ)",
    to: "Rethymno",
    distanceKm: 75,
    durationMin: 65,
    basePriceEur: 85,
    heroImage:
      "https://images.unsplash.com/photo-1595079676601-f1adf5be5dee?auto=format&fit=crop&w=1600&q=70",
    blurb: "East on the E75 along the north coast, past Georgioupoli beach.",
    notes: "One of our smoothest routes — motorway all the way, no seasonal complications.",
    region: "Rethymno",
  },
  {
    slug: "chania-airport-to-kissamos",
    from: "Chania Airport (CHQ)",
    to: "Kissamos",
    distanceKm: 55,
    durationMin: 55,
    basePriceEur: 78,
    heroImage:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=70",
    blurb: "The gateway to Balos and Falasarna. West through Chania and out toward the Rodopou peninsula.",
    notes: "If you're heading to Balos boat departures the next morning, tell us — we can advise on best pickup time.",
    region: "Chania",
  },
  {
    slug: "souda-port-to-chania-old-town",
    from: "Souda Port (Ferry)",
    to: "Chania Old Town",
    distanceKm: 8,
    durationMin: 15,
    basePriceEur: 25,
    heroImage:
      "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=1600&q=70",
    blurb: "The morning ferry from Piraeus arrives at 06:00 — we're there, coffee in hand.",
    notes: "We track the ANEK and Minoan ferry schedules. Delayed arrival? No charge.",
    region: "Chania",
  },
  {
    slug: "heraklion-port-to-matala",
    from: "Heraklion Port (Ferry)",
    to: "Matala",
    distanceKm: 75,
    durationMin: 90,
    basePriceEur: 105,
    heroImage:
      "https://images.unsplash.com/photo-1601581875039-e899893d520c?auto=format&fit=crop&w=1600&q=70",
    blurb: "South through the Messara plain to the hippie-era caves of Matala's red-sand bay.",
    notes: "Route crosses the mountain pass at Agia Varvara — spectacular in the morning light.",
    region: "Heraklion",
  },
  {
    slug: "heraklion-airport-to-chania",
    from: "Heraklion Airport (HER)",
    to: "Chania",
    distanceKm: 140,
    durationMin: 130,
    basePriceEur: 165,
    heroImage:
      "https://images.unsplash.com/photo-1571498664957-fde285d79857?auto=format&fit=crop&w=1600&q=70",
    blurb: "The full north-coast run. Two-hour drive, one clear price.",
    notes: "Fewer flights land at Chania, so this cross-island transfer is popular. We stop for a coffee if you want.",
    region: "Chania",
  },
];

export function getRoute(slug: string): RouteData | undefined {
  return ROUTES.find((r) => r.slug === slug);
}
