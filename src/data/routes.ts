export type VehicleClass = "economy" | "comfort" | "minivan" | "luxury";

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
    description: "Skoda Octavia or similar. Air-conditioned, clean, punctual.",
    example: "Skoda Octavia",
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "comfort",
    label: "Comfort",
    capacity: "1–3 passengers",
    bags: "3 bags",
    multiplier: 1.25,
    description: "Mercedes E-Class or similar. Extra legroom, water on board.",
    example: "Mercedes E-Class",
    image:
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "minivan",
    label: "Minivan",
    capacity: "1–7 passengers",
    bags: "7 bags",
    multiplier: 1.6,
    description: "Mercedes Vito or Ford Tourneo. The right pick for families and groups.",
    example: "Mercedes Vito",
    image:
      "https://images.unsplash.com/photo-1609520778763-ed4a1d1f8f81?auto=format&fit=crop&w=1200&q=70",
  },
  {
    id: "luxury",
    label: "Luxury",
    capacity: "1–3 passengers",
    bags: "3 bags",
    multiplier: 2.1,
    description: "Mercedes S-Class or BMW 7-Series. Chauffeur in suit, still fixed price.",
    example: "Mercedes S-Class",
    image:
      "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1200&q=70",
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

const IMG = {
  road: "https://images.unsplash.com/photo-1601581875039-e899893d520c?auto=format&fit=crop&w=1600&q=70",
  chania: "https://images.unsplash.com/photo-1601161221525-6b3e0f0e13db?auto=format&fit=crop&w=1600&q=70",
  harbour: "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=1600&q=70",
  coast: "https://images.unsplash.com/photo-1571498664957-fde285d79857?auto=format&fit=crop&w=1600&q=70",
  village: "https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=1600&q=70",
  beach: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=70",
  cove: "https://images.unsplash.com/photo-1595079676601-f1adf5be5dee?auto=format&fit=crop&w=1600&q=70",
  hills: "https://images.unsplash.com/photo-1591019479261-1a103585c559?auto=format&fit=crop&w=1600&q=70",
};

export const ROUTES: RouteData[] = [
  // Heraklion Airport
  { slug: "heraklion-airport-to-elounda", from: "Heraklion Airport (HER)", to: "Elounda", distanceKm: 71, durationMin: 75, basePriceEur: 85, heroImage: IMG.road, blurb: "The classic transfer from Heraklion airport up the northeast coast to Elounda's boutique hotels and Mirabello Bay.", notes: "Route follows the E75 coastal motorway to Agios Nikolaos, then the winding hill road to Elounda. Drivers know the private hotel entrances at Blue Palace, Domes, and Elounda Beach.", region: "Lasithi", service: "airport" },
  { slug: "heraklion-airport-to-agios-nikolaos", from: "Heraklion Airport (HER)", to: "Agios Nikolaos", distanceKm: 65, durationMin: 65, basePriceEur: 75, heroImage: IMG.village, blurb: "Straight down the E75 motorway to Agios Nikolaos and Lake Voulismeni — Crete's most Instagrammed town square.", notes: "Motorway the whole way. Roughly one hour outside of peak August afternoons.", region: "Lasithi", service: "airport" },
  { slug: "heraklion-airport-to-hersonissos", from: "Heraklion Airport (HER)", to: "Hersonissos", distanceKm: 26, durationMin: 30, basePriceEur: 42, heroImage: IMG.beach, blurb: "Short hop east to the resort strip — Stalis, Malia and Hersonissos hotels.", notes: "Traffic can slow the last 3km in peak summer evenings; we build a buffer in.", region: "Heraklion", service: "airport" },
  { slug: "heraklion-airport-to-malia", from: "Heraklion Airport (HER)", to: "Malia", distanceKm: 34, durationMin: 35, basePriceEur: 48, heroImage: IMG.beach, blurb: "Direct east to Malia's resort strip and the Minoan palace ruins.", notes: "E75 the entire way, drop-off at any hotel gate.", region: "Heraklion", service: "airport" },
  { slug: "heraklion-airport-to-stalis", from: "Heraklion Airport (HER)", to: "Stalis", distanceKm: 30, durationMin: 32, basePriceEur: 45, heroImage: IMG.beach, blurb: "The quiet middle sister between Hersonissos and Malia.", notes: "Straight E75 run — under 35 minutes off-peak.", region: "Heraklion", service: "airport" },
  { slug: "heraklion-airport-to-rethymno", from: "Heraklion Airport (HER)", to: "Rethymno", distanceKm: 80, durationMin: 75, basePriceEur: 95, heroImage: IMG.coast, blurb: "West on the E75 with the Sea of Crete on your right the whole way. Old Venetian harbour drop-off available.", notes: "Old town of Rethymno is pedestrianised — we drop at the harbour or nearest hotel access point.", region: "Rethymno", service: "cross-island" },
  { slug: "heraklion-airport-to-chania", from: "Heraklion Airport (HER)", to: "Chania", distanceKm: 140, durationMin: 130, basePriceEur: 165, heroImage: IMG.coast, blurb: "The full north-coast run. Two-hour drive, one clear price.", notes: "Fewer flights land at Chania, so this cross-island transfer is popular. We stop for a coffee if you want.", region: "Chania", service: "cross-island" },
  { slug: "heraklion-airport-to-matala", from: "Heraklion Airport (HER)", to: "Matala", distanceKm: 75, durationMin: 90, basePriceEur: 105, heroImage: IMG.hills, blurb: "South through the Messara plain to the hippie-era caves of Matala's red-sand bay.", notes: "Route crosses the mountain pass at Agia Varvara — spectacular in the morning light.", region: "Heraklion", service: "airport" },
  { slug: "heraklion-airport-to-bali", from: "Heraklion Airport (HER)", to: "Bali", distanceKm: 45, durationMin: 45, basePriceEur: 62, heroImage: IMG.cove, blurb: "The four-cove fishing village halfway to Rethymno.", notes: "Steep final descent into Bali village — our drivers know the hotel access roads.", region: "Rethymno", service: "airport" },
  { slug: "heraklion-airport-to-anissaras", from: "Heraklion Airport (HER)", to: "Anissaras", distanceKm: 24, durationMin: 28, basePriceEur: 40, heroImage: IMG.beach, blurb: "The upscale strip just before Hersonissos — home to the big resort brands.", notes: "Fastest transfer in our catalogue. Under 30 minutes any time of day.", region: "Heraklion", service: "airport" },
  { slug: "heraklion-airport-to-analipsi", from: "Heraklion Airport (HER)", to: "Analipsi", distanceKm: 22, durationMin: 26, basePriceEur: 38, heroImage: IMG.beach, blurb: "The Nana Beach hotel cluster and quiet family beaches.", notes: "Exit at the Analipsi junction, five minutes off the motorway.", region: "Heraklion", service: "airport" },
  { slug: "heraklion-airport-to-ierapetra", from: "Heraklion Airport (HER)", to: "Ierapetra", distanceKm: 100, durationMin: 105, basePriceEur: 130, heroImage: IMG.hills, blurb: "South-east to the southernmost city in Europe. A long, worthwhile drive.", notes: "Route crosses the Selinari pass and drops down through the Ierapetra plain.", region: "Lasithi", service: "cross-island" },
  // Heraklion Port
  { slug: "heraklion-port-to-matala", from: "Heraklion Port (Ferry)", to: "Matala", distanceKm: 75, durationMin: 90, basePriceEur: 105, heroImage: IMG.hills, blurb: "Straight off the overnight ferry from Piraeus to Matala's beach.", notes: "We track ANEK and Minoan schedules; delayed arrival is no charge.", region: "Heraklion", service: "port" },
  { slug: "heraklion-port-to-chania", from: "Heraklion Port (Ferry)", to: "Chania", distanceKm: 145, durationMin: 135, basePriceEur: 170, heroImage: IMG.coast, blurb: "Off the ferry, straight west across the island.", notes: "Two-hour-plus drive; we'll stop halfway for coffee if you want.", region: "Chania", service: "port" },
  // Chania Airport
  { slug: "chania-airport-to-chania-old-town", from: "Chania Airport (CHQ)", to: "Chania Old Town", distanceKm: 15, durationMin: 20, basePriceEur: 32, heroImage: IMG.chania, blurb: "Straight into the Venetian harbour. Meet-and-greet at arrivals gate, sign with your name.", notes: "Old town access is restricted to residents — we drop at the harbour edge, 3 minutes on foot to most hotels.", region: "Chania", service: "airport" },
  { slug: "chania-airport-to-rethymno", from: "Chania Airport (CHQ)", to: "Rethymno", distanceKm: 75, durationMin: 65, basePriceEur: 85, heroImage: IMG.coast, blurb: "East on the E75 along the north coast, past Georgioupoli beach.", notes: "One of our smoothest routes — motorway all the way.", region: "Rethymno", service: "cross-island" },
  { slug: "chania-airport-to-kissamos", from: "Chania Airport (CHQ)", to: "Kissamos", distanceKm: 55, durationMin: 55, basePriceEur: 78, heroImage: IMG.beach, blurb: "The gateway to Balos and Falasarna. West through Chania and out toward the Rodopou peninsula.", notes: "Heading to Balos boat departures the next morning? Tell us — we'll advise on pickup time.", region: "Chania", service: "airport" },
  { slug: "chania-airport-to-platanias", from: "Chania Airport (CHQ)", to: "Platanias", distanceKm: 25, durationMin: 30, basePriceEur: 42, heroImage: IMG.beach, blurb: "The lively beach strip just west of Chania town.", notes: "Coastal road, sea views most of the way.", region: "Chania", service: "airport" },
  { slug: "chania-airport-to-georgioupoli", from: "Chania Airport (CHQ)", to: "Georgioupoli", distanceKm: 45, durationMin: 40, basePriceEur: 60, heroImage: IMG.coast, blurb: "The river-mouth resort town halfway to Rethymno.", notes: "Direct motorway, then a short spur.", region: "Chania", service: "airport" },
  { slug: "chania-airport-to-kolymbari", from: "Chania Airport (CHQ)", to: "Kolymbari", distanceKm: 35, durationMin: 35, basePriceEur: 55, heroImage: IMG.cove, blurb: "The quieter west coast — home to the Grecotel Amirandes and Domes Zeen.", notes: "Coastal road with panoramic views over Souda Bay.", region: "Chania", service: "airport" },
  { slug: "chania-airport-to-almyrida", from: "Chania Airport (CHQ)", to: "Almyrida", distanceKm: 30, durationMin: 30, basePriceEur: 48, heroImage: IMG.beach, blurb: "The Apokoronas peninsula — quiet coves and family-run tavernas.", notes: "Short scenic drive through Kalyves and along the coast.", region: "Chania", service: "airport" },
  { slug: "chania-airport-to-falasarna", from: "Chania Airport (CHQ)", to: "Falasarna", distanceKm: 75, durationMin: 80, basePriceEur: 105, heroImage: IMG.beach, blurb: "The far west — Falasarna's sunset beach and ancient ruins.", notes: "Motorway then mountain road through olive country.", region: "Chania", service: "airport" },
  { slug: "chania-airport-to-sougia", from: "Chania Airport (CHQ)", to: "Sougia", distanceKm: 75, durationMin: 90, basePriceEur: 115, heroImage: IMG.hills, blurb: "Cross the White Mountains to the quiet south coast.", notes: "Winding mountain route — spectacular, allow the full 90 minutes.", region: "Chania", service: "cross-island" },
  { slug: "chania-airport-to-paleochora", from: "Chania Airport (CHQ)", to: "Paleochora", distanceKm: 85, durationMin: 100, basePriceEur: 125, heroImage: IMG.hills, blurb: "The hippie town on the far south-west coast.", notes: "Long drive through the mountains — we build in a scenic stop if you'd like.", region: "Chania", service: "cross-island" },
  // Souda Port
  { slug: "souda-port-to-chania-old-town", from: "Souda Port (Ferry)", to: "Chania Old Town", distanceKm: 8, durationMin: 15, basePriceEur: 25, heroImage: IMG.harbour, blurb: "The morning ferry from Piraeus arrives at 06:00 — we're there, coffee in hand.", notes: "We track ANEK and Minoan schedules. Delayed arrival, no charge.", region: "Chania", service: "port" },
  // Rethymno
  { slug: "rethymno-to-bali", from: "Rethymno", to: "Bali", distanceKm: 30, durationMin: 30, basePriceEur: 48, heroImage: IMG.cove, blurb: "East along the coast to the four coves of Bali village.", notes: "Simple motorway hop, ten-minute descent into the village.", region: "Rethymno", service: "hotel" },
  { slug: "rethymno-to-panormo", from: "Rethymno", to: "Panormo", distanceKm: 22, durationMin: 22, basePriceEur: 40, heroImage: IMG.cove, blurb: "The pretty fishing village east of Rethymno.", notes: "Coastal road all the way, sea on your left.", region: "Rethymno", service: "hotel" },
  { slug: "rethymno-to-plakias", from: "Rethymno", to: "Plakias", distanceKm: 40, durationMin: 55, basePriceEur: 65, heroImage: IMG.hills, blurb: "Cross to the south coast through the Kourtaliotiko gorge.", notes: "Winding gorge road — one of the most beautiful drives on the island.", region: "Rethymno", service: "cross-island" },
  { slug: "rethymno-to-agia-galini", from: "Rethymno", to: "Agia Galini", distanceKm: 55, durationMin: 60, basePriceEur: 78, heroImage: IMG.hills, blurb: "South to the amphitheatre-shaped harbour of Agia Galini.", notes: "Through the Amari valley and Mount Ida foothills.", region: "Rethymno", service: "cross-island" },
  // Lasithi
  { slug: "agios-nikolaos-to-elounda", from: "Agios Nikolaos", to: "Elounda", distanceKm: 11, durationMin: 20, basePriceEur: 28, heroImage: IMG.village, blurb: "The short scenic hop to Elounda's luxury peninsula.", notes: "Cliff-side road with sweeping Mirabello Bay views.", region: "Lasithi", service: "hotel" },
  { slug: "agios-nikolaos-to-sitia", from: "Agios Nikolaos", to: "Sitia", distanceKm: 70, durationMin: 80, basePriceEur: 95, heroImage: IMG.coast, blurb: "The far east — coastline, monasteries and quiet fishing towns.", notes: "New national road most of the way, then coastal spur.", region: "Lasithi", service: "cross-island" },
  { slug: "agios-nikolaos-to-vai", from: "Agios Nikolaos", to: "Vai Beach", distanceKm: 95, durationMin: 105, basePriceEur: 125, heroImage: IMG.beach, blurb: "To the palm forest of Vai — the only natural palm grove in Europe.", notes: "Long day-trip drive; we can wait and return.", region: "Lasithi", service: "cross-island" },
];

export function getRoute(slug: string): RouteData | undefined {
  return ROUTES.find((r) => r.slug === slug);
}

export function routesByRegion(region: Region): RouteData[] {
  return ROUTES.filter((r) => r.region === region);
}

export function routesByService(service: RouteData["service"]): RouteData[] {
  return ROUTES.filter((r) => r.service === service);
}
