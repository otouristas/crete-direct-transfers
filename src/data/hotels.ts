/**
 * Hotel and resort landing pages.
 *
 * High-intent long-tail: people search "<hotel name> transfer from Heraklion
 * airport" far more than they search a route slug. Each entry carries the
 * arrival facts a guest actually needs — nearest airport, drive time, gate
 * quirks, check-in time — plus the bookable route slug behind it.
 */
import { getCityImage, imageUrl } from "@/lib/place-image";

export type HotelArea = {
  slug: string;
  /** Resort or hotel area name — we publish areas, not brand names we do not represent. */
  name: string;
  region: string;
  /** Nearest airport display name and IATA. */
  airport: string;
  airportIata: string;
  /** Bookable ROUTES slug for the main airport transfer. */
  routeSlug: string;
  driveMin: number;
  distanceKm: number;
  fromPriceEur: number;
  heroImage: string;
  /** One-line summary for cards. */
  summary: string;
  /** Editorial description, 2 paragraphs. */
  description: string[];
  /** The arrival logistics that go wrong without local knowledge. */
  arrivalNotes: string[];
  /** Typical property styles in the area. */
  propertyTypes: string[];
  /** Nearby alternatives for cross-linking. */
  nearby: string[];
};

const img = (slug: string) => imageUrl(getCityImage(slug), { width: 1800 });

export const HOTEL_AREAS: HotelArea[] = [
  {
    slug: "elounda",
    name: "Elounda resorts",
    region: "Lasithi",
    airport: "Heraklion Airport",
    airportIata: "HER",
    routeSlug: "heraklion-airport-to-elounda",
    driveMin: 70,
    distanceKm: 72,
    fromPriceEur: 95,
    heroImage: img("elounda"),
    summary: "Crete's luxury bay — long private driveways, gated arrivals, late check-ins.",
    description: [
      "Elounda holds the densest concentration of five-star resorts in Greece, strung along one coastal road around the Mirabello Gulf. Most properties sit well below the road on private switchbacks with their own gatehouses.",
      "Transfers here are the reason the meet-and-greet detail matters: a resort gate is often a kilometre and several hairpins from the reception canopy, and a driver who stops at the barrier has not finished the job.",
    ],
    arrivalNotes: [
      "Give the property name at booking — several Elounda gates are unmarked from the road.",
      "Reception is staffed overnight at most resorts; night arrivals are routine and covered by our night rotation.",
      "Rooms typically release at 15:00. If you land in the morning, add an Agios Nikolaos or Plaka stop instead of waiting in the lobby.",
    ],
    propertyTypes: ["Five-star resorts", "Private-pool villas", "Bungalow suites"],
    nearby: ["agios-nikolaos", "plaka"],
  },
  {
    slug: "hersonissos",
    name: "Hersonissos hotels",
    region: "Heraklion",
    airport: "Heraklion Airport",
    airportIata: "HER",
    routeSlug: "heraklion-airport-to-hersonissos",
    driveMin: 25,
    distanceKm: 25,
    fromPriceEur: 45,
    heroImage: img("hersonissos"),
    summary: "The closest big resort to HER — three districts that share one name.",
    description: [
      "Hersonissos is really three places: the seafront strip, the hillside villages of Koutouloufari and Piskopiano above it, and the quieter hotel belt at Anissaras to the west.",
      "At 25 minutes from the terminal it is the shortest mainstream transfer on Crete, which makes a wrong drop-off proportionally more annoying — a taxi correction can cost more than the transfer itself.",
    ],
    arrivalNotes: [
      "The seafront is one-way in summer with heavy pedestrian flow; drop-off is at the nearest legal point.",
      "Hill villages involve a steep climb — worth the van class if you have heavy cases.",
      "Anissaras uses a different motorway exit; naming the hotel avoids a fifteen-minute backtrack.",
    ],
    propertyTypes: ["All-inclusive resorts", "Aparthotels", "Boutique village stays"],
    nearby: ["malia", "anissaras"],
  },
  {
    slug: "platanias",
    name: "Platanias and Agia Marina",
    region: "Chania",
    airport: "Chania Airport",
    airportIata: "CHQ",
    routeSlug: "chania-airport-to-platanias",
    driveMin: 40,
    distanceKm: 33,
    fromPriceEur: 55,
    heroImage: img("platanias"),
    summary: "Western Crete's hotel belt, 25 minutes past Chania town.",
    description: [
      "The continuous resort strip west of Chania — Agia Marina, Platanias, Gerani — sits on a long sand-and-shingle beach with the old town twenty minutes behind it.",
      "The transfer crosses Chania, so evening arrivals inherit the town's traffic. Budget forty minutes rather than the thirty a map suggests.",
    ],
    arrivalNotes: [
      "Beachside properties often sit on service lanes off the main road; the hotel name routes the driver correctly.",
      "Villas above the strip frequently end on unsurfaced track — book the SUV class if yours does.",
      "Late-night arrivals pass through Chania after the harbour crowd; add ten minutes in July and August.",
    ],
    propertyTypes: ["Beach resorts", "Apartment complexes", "Hillside villas"],
    nearby: ["chania-old-town", "kolymbari"],
  },
  {
    slug: "georgioupoli",
    name: "Georgioupoli",
    region: "Chania",
    airport: "Chania Airport",
    airportIata: "CHQ",
    routeSlug: "chania-airport-to-georgioupoli",
    driveMin: 45,
    distanceKm: 45,
    fromPriceEur: 60,
    heroImage: img("georgioupoli"),
    summary: "River mouth, eucalyptus square, and the longest beach on the north coast.",
    description: [
      "Georgioupoli sits halfway between Chania and Rethymno at the point where the Almyros river meets a nine-kilometre beach. It is quieter than the Platanias strip and popular with families returning yearly.",
      "Hotels here spread along the beach road in both directions, and the eastern end is genuinely far from the square — a fact worth knowing before you plan to walk to dinner.",
    ],
    arrivalNotes: [
      "Confirm which end of the beach road your hotel is on; the strip runs several kilometres.",
      "Kournas lake is ten minutes inland and makes a good stop when rooms are not ready.",
      "Equidistant from both airports — compare CHQ and HER before booking flights.",
    ],
    propertyTypes: ["Family beach hotels", "Studios and apartments", "All-inclusive complexes"],
    nearby: ["almyrida", "rethymno"],
  },
  {
    slug: "bali",
    name: "Bali coves",
    region: "Rethymno",
    airport: "Heraklion Airport",
    airportIata: "HER",
    routeSlug: "heraklion-airport-to-bali",
    driveMin: 55,
    distanceKm: 55,
    fromPriceEur: 75,
    heroImage: img("bali"),
    summary: "Four small bays stacked down a hillside between the two big towns.",
    description: [
      "Bali is built into a steep slope above four separate coves, which is exactly why guests love it and exactly why arrivals need care. The walk between the top of the village and the lowest bay is a serious hill.",
      "Half the hotels are near the motorway exit and half are at sea level, and the difference is about eight minutes of switchbacks.",
    ],
    arrivalNotes: [
      "Name the cove — Livadi, Varkotopo, Limani or Karavostasi — as well as the hotel.",
      "Steep approaches: request help with bags in advance if you are on the upper terraces.",
      "There is no realistic bus alternative; the village sits well below the national road.",
    ],
    propertyTypes: ["Cove-side hotels", "Terraced apartments", "Small boutique stays"],
    nearby: ["panormo", "rethymno"],
  },
  {
    slug: "malia",
    name: "Malia",
    region: "Heraklion",
    airport: "Heraklion Airport",
    airportIata: "HER",
    routeSlug: "heraklion-airport-to-malia",
    driveMin: 35,
    distanceKm: 34,
    fromPriceEur: 50,
    heroImage: img("malia"),
    summary: "Old town above, beach hotels below, Minoan palace at the eastern edge.",
    description: [
      "Malia splits cleanly between the old village on the inland side of the main road and the beach quarter below it. The two have completely different characters and about a kilometre between them.",
      "The beach road is closed to through traffic in parts of high summer, which changes drop-off points week to week — a local driver simply knows.",
    ],
    arrivalNotes: [
      "Beach-quarter hotels may require a perimeter drop in peak weeks.",
      "The Minoan palace is a five-minute detour on the way in and rarely busy in the morning.",
      "Sitting on the motorway makes this one of the fastest and cheapest airport transfers on the island.",
    ],
    propertyTypes: ["Beach hotels", "Studios", "Village guesthouses"],
    nearby: ["stalis", "hersonissos"],
  },
  {
    slug: "agios-nikolaos",
    name: "Agios Nikolaos",
    region: "Lasithi",
    airport: "Heraklion Airport",
    airportIata: "HER",
    routeSlug: "heraklion-airport-to-agios-nikolaos",
    driveMin: 60,
    distanceKm: 65,
    fromPriceEur: 85,
    heroImage: img("agios-nikolaos"),
    summary: "A working town around a bottomless lake, with resorts on both headlands.",
    description: [
      "Agios Nikolaos is the capital of Lasithi and the rare Cretan resort town that functions year round. Hotels ring the harbour and spread onto the headlands north and south.",
      "It is the natural base for guests who want Elounda's scenery without Elounda's gated seclusion, and it is fifteen minutes from Elounda anyway.",
    ],
    arrivalNotes: [
      "Harbour-area streets are narrow and partly one-way; drop-off is at the nearest access point.",
      "Headland resorts have long private drives — the driver takes you to reception.",
      "Good early-arrival town: Lake Voulismeni cafés open from breakfast.",
    ],
    propertyTypes: ["Harbour hotels", "Headland resorts", "Town apartments"],
    nearby: ["elounda", "sitia"],
  },
  {
    slug: "chania-old-town",
    name: "Chania Old Town",
    region: "Chania",
    airport: "Chania Airport",
    airportIata: "CHQ",
    routeSlug: "chania-airport-to-chania-old-town",
    driveMin: 20,
    distanceKm: 15,
    fromPriceEur: 35,
    heroImage: img("chania"),
    summary: "Venetian lanes, boutique conversions, and no cars past the bollards.",
    description: [
      "The old town's hotels are mostly Venetian and Ottoman houses converted room by room, reached through lanes too narrow for a vehicle. It is the most atmospheric place to stay on Crete and the most awkward to arrive at.",
      "Four perimeter access points serve the whole quarter. Which one is right depends entirely on your address, and camera enforcement in summer means getting it wrong is not a small thing.",
    ],
    arrivalNotes: [
      "Send the accommodation name; drivers route to the correct perimeter gate.",
      "Expect two to four minutes on foot over cobbles — drivers help with bags.",
      "Souda port arrivals use a different pickup zone; book the port route instead.",
    ],
    propertyTypes: ["Boutique conversions", "Design hotels", "Harbour-front suites"],
    nearby: ["platanias", "kolymbari"],
  },
];

export function getHotelArea(slug: string): HotelArea | undefined {
  return HOTEL_AREAS.find((h) => h.slug === slug);
}

export function hotelAreasByRegion(): { region: string; areas: HotelArea[] }[] {
  const map = new Map<string, HotelArea[]>();
  for (const area of HOTEL_AREAS) {
    const list = map.get(area.region) ?? [];
    list.push(area);
    map.set(area.region, list);
  }
  return [...map.entries()].map(([region, areas]) => ({ region, areas }));
}
