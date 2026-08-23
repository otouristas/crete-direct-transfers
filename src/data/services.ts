import { getServiceImage, imageUrl } from "@/lib/place-image";

export type ServiceData = {
  slug: string;
  name: string;
  tagline: string;
  intro: string;
  body: string;
  heroImage: string;
  whatsIncluded: string[];
  bestFor: string[];
};

const SERVICE_RECORDS: Omit<ServiceData, "heroImage">[] = [
  {
    slug: "airport-transfers",
    name: "Airport Transfers",
    tagline: "Meet-and-greet from Heraklion (HER) and Chania (CHQ) airports.",
    intro:
      "Fixed-price transfers from both Crete airports to every resort and villa on the island. Flight tracked, name-sign at arrivals.",
    body: "Your driver arrives 15 minutes before your flight lands, tracks the airline feed, and waits at the arrivals gate with a sign carrying your name. No hunting for taxi ranks, no negotiating fares. The price you saw when you booked is the price you pay.",
    whatsIncluded: [
      "Flight tracking",
      "Meet-and-greet at gate",
      "Free 60-min waiting time",
      "Direct driver WhatsApp",
    ],
    bestFor: [
      "Arrivals into HER or CHQ",
      "Late-night flights",
      "Family transfers with kids and bags",
    ],
  },
  {
    slug: "port-transfers",
    name: "Port Transfers",
    tagline: "From Heraklion Port and Souda Port straight to your hotel.",
    intro: "Overnight ferries from Piraeus dock before dawn. We're there — regardless of a delay.",
    body: "The ANEK, Minoan and Sea Jets schedules land you in Crete between 05:30 and 06:00. Our drivers time their arrival to your specific ferry, and if the boat is late we wait for free. Fixed price, no early-morning surcharge.",
    whatsIncluded: [
      "Ferry schedule tracking",
      "Meet at car deck exit",
      "Free waiting for delayed ferries",
      "Any hour of the day",
    ],
    bestFor: ["Piraeus overnight arrivals", "Inter-island ferry hops", "Cruise ship excursions"],
  },
  {
    slug: "hotel-transfers",
    name: "Hotel Transfers",
    tagline: "Point-to-point between hotels and towns, anywhere in Crete.",
    intro:
      "Change hotels mid-holiday. Head to a wedding at the Domes. Get to the ferry the next morning.",
    body: "Not every transfer starts at an airport. Our fixed-price matrix covers hotel-to-hotel, hotel-to-town and hotel-to-port on every popular route — Elounda to Chania, Rethymno to Matala, Agios Nikolaos to Vai.",
    whatsIncluded: [
      "Hotel-gate pickup",
      "Luggage assistance",
      "Local driver knowledge",
      "Any Crete route",
    ],
    bestFor: ["Multi-hotel itineraries", "Weddings & events", "Onward ferry connections"],
  },
  {
    slug: "private-tours",
    name: "Private Day Tours",
    tagline: "Your driver for the day, your itinerary.",
    intro:
      "Knossos, Elafonissi, Samaria, the Lasithi Plateau — with a driver who knows the shortcuts and the good tavernas.",
    body: "Book a driver for 6, 8 or 10 hours. Design your own itinerary or use one of our suggested routes: the Knossos + Heraklion museum + Archanes wineries loop, the west-coast beach day (Balos + Falasarna), or the Lasithi Plateau + Dikteon cave tour.",
    whatsIncluded: [
      "Local licensed guide-driver",
      "Full-day vehicle",
      "Water on board",
      "Suggested itineraries",
    ],
    bestFor: ["Culture-first travellers", "Families with kids", "First-time Crete visitors"],
  },
  {
    slug: "long-distance",
    name: "Long-Distance Transfers",
    tagline: "Cross the whole island — one fixed price.",
    intro: "Heraklion to Chania, Chania to Elounda, Rethymno to Sitia. The long routes done right.",
    body: "Two-hour drives on Cretan roads are their own experience. We use Standard Class and above on cross-island runs — extra legroom, water on board, a driver who knows where to stop for the best coffee halfway.",
    whatsIncluded: [
      "Standard Class or higher",
      "Free coffee stop",
      "Water on board",
      "Fixed price, no per-km surcharge",
    ],
    bestFor: ["Cross-island itineraries", "Cruise ship day trips", "Groups moving between regions"],
  },
  {
    slug: "group-transfers",
    name: "Group Transfers",
    tagline: "Minivans, minibuses, or a fleet of cars for weddings and events.",
    intro: "Six friends or sixty guests — we have the vehicles and the coordination.",
    body: "Our Van Standard class carries up to 7 passengers with 7 bags. For larger groups we have 12- and 16-seat minibuses, or coordinate multiple vehicles on the same pickup. Weddings in Elounda, corporate offsites in Chania, family reunions in Rethymno — one contact, one fixed price.",
    whatsIncluded: [
      "Multi-vehicle coordination",
      "Lead driver contact",
      "Group booking discount over 3 vehicles",
      "Wedding & event experience",
    ],
    bestFor: ["Groups over 4 passengers", "Weddings & events", "Corporate travel"],
  },
];

/** Hero imagery comes from the Pexels manifest — see scripts/fetch-pexels-images.mjs. */
export const SERVICES: ServiceData[] = SERVICE_RECORDS.map((service) => ({
  ...service,
  heroImage: imageUrl(getServiceImage(service.slug), { width: 2000 }),
}));

export function getService(slug: string): ServiceData | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
