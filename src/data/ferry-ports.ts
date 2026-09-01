import { DEFAULT_TERRITORY } from "@/data/territories";
/**
 * Ferry and cruise arrival pages for Crete.
 *
 * /ports/$slug is the global, generated port family. This file is the opposite:
 * a small, hand-written set of Cretan ports with the arrival detail that only
 * matters if you actually work them — which gate the overnight boat berths at,
 * how long the ramp takes to clear, where a car is allowed to wait.
 */
import { getCityImage, imageUrl } from "@/lib/place-image";

export type FerryPort = {
  /** Owning territory slug. Defaults to the launch territory. */
  territory?: string;
  slug: string;
  name: string;
  /** Town the port serves. */
  town: string;
  region: string;
  heroImage: string;
  summary: string;
  intro: string[];
  /** Operators and where they sail from. */
  lines: { operator: string; connects: string; frequency: string }[];
  /** Typical arrival times passengers deal with. */
  arrivalTimes: string;
  /** Where the driver meets you. */
  meetingPoint: string;
  /** Ramp-to-car reality. */
  disembarkNotes: string[];
  /** Bookable ROUTES slug if one exists for this port. */
  routeSlug?: string;
  fromPriceEur: number;
  faqs: { q: string; a: string }[];
};

const img = (slug: string) => imageUrl(getCityImage(slug), { width: 1800 });

export const FERRY_PORTS: FerryPort[] = [
  {
    slug: "heraklion-port",
    name: "Heraklion Port",
    town: "Heraklion",
    region: "Heraklion",
    heroImage: img("heraklion"),
    summary: "The island's main gateway — overnight boats from Piraeus, plus Cyclades fast ferries.",
    intro: [
      "Heraklion is the busiest passenger port on Crete and the arrival point for the overnight Piraeus boats that dock between 05:30 and 06:30. Several thousand people, most of them half-awake, come off the ramps inside twenty minutes.",
      "The terminal has taxis, but at 06:00 in August the rank empties in the time it takes the first two ramps to clear. A pre-booked driver waiting with a board is the difference between leaving at 06:15 and queueing until 07:00.",
    ],
    lines: [
      { operator: "Minoan Lines", connects: "Piraeus (Athens)", frequency: "Nightly, year round" },
      { operator: "ANEK / Attica", connects: "Piraeus (Athens)", frequency: "Nightly, year round" },
      {
        operator: "SeaJets",
        connects: "Santorini, Ios, Mykonos, Paros",
        frequency: "Daily, April–October",
      },
      { operator: "Cruise lines", connects: "Eastern Mediterranean itineraries", frequency: "Seasonal calls" },
    ],
    arrivalTimes:
      "Overnight arrivals 05:30–06:30. Cyclades fast ferries land mid-morning and late afternoon. Cruise calls typically berth 07:00–08:00 and sail again by 18:00.",
    meetingPoint:
      "Your driver waits at the passenger terminal exit with a name board. For cruise calls we meet at the designated shuttle drop-off inside the port gate.",
    disembarkNotes: [
      "Foot passengers clear the ramp in 10–20 minutes; vehicle decks take longer.",
      "Waiting time is free for 60 minutes from scheduled berthing on port pickups.",
      "The gate-to-motorway run is two minutes, so a Rethymno or Chania onward transfer can start immediately.",
    ],
    routeSlug: "heraklion-port-to-chania",
    fromPriceEur: 25,
    faqs: [
      {
        q: "What time do the Piraeus ferries arrive in Heraklion?",
        a: "The overnight boats from Piraeus typically berth between 05:30 and 06:30, year round.",
      },
      {
        q: "Are taxis available at Heraklion port early in the morning?",
        a: "There is a rank, but it empties quickly when two overnight boats dock together. Pre-booking a fixed-price transfer avoids the queue.",
      },
      {
        q: "Can you take me straight from the ferry to a beach or hotel across the island?",
        a: "Yes — Chania, Rethymno, Matala and Elounda are all common onward transfers directly from the ramp.",
      },
    ],
  },
  {
    slug: "souda-port",
    name: "Souda Port (Chania)",
    town: "Chania",
    region: "Chania",
    heroImage: img("chania"),
    summary: "Chania's ferry port, 7 km from the old town, with nightly Piraeus sailings.",
    intro: [
      "Souda serves Chania from a deep natural harbour east of the city. The overnight boats from Piraeus dock around 06:00, and the port is entirely separate from Chania airport on the other side of the Akrotiri.",
      "It is a short transfer — fifteen to twenty minutes into the old town — but a busy one, because the entire boat disembarks at once into a small forecourt.",
    ],
    lines: [
      { operator: "ANEK / Attica", connects: "Piraeus (Athens)", frequency: "Nightly, year round" },
      { operator: "Cruise lines", connects: "Mediterranean itineraries", frequency: "Seasonal calls" },
    ],
    arrivalTimes: "Overnight Piraeus arrivals around 06:00. Cruise calls berth from 07:00.",
    meetingPoint:
      "Meet and greet at the terminal building exit with a name board, car parked in the forecourt.",
    disembarkNotes: [
      "The forecourt fills fast — your driver holds a position rather than circling.",
      "Old town drop-off follows the same pedestrian-zone rules as an airport arrival.",
      "Direct onward runs to Platanias, Kissamos and Rethymno are all common from here.",
    ],
    routeSlug: "souda-port-to-chania-old-town",
    fromPriceEur: 25,
    faqs: [
      {
        q: "How far is Souda port from Chania old town?",
        a: "About 7 km — a 15 to 20 minute transfer depending on traffic through the city.",
      },
      {
        q: "Is Souda the same as Chania airport?",
        a: "No. The airport is on the Akrotiri peninsula, roughly 20 minutes from the port by road.",
      },
    ],
  },
  {
    slug: "rethymno-port",
    name: "Rethymno Port",
    town: "Rethymno",
    region: "Rethymno",
    heroImage: img("rethymno"),
    summary: "A small harbour beside the old town, used by seasonal sailings and cruise tenders.",
    intro: [
      "Rethymno's port sits right against the Venetian fortress, which means arrivals walk straight into the old town. Sailings are seasonal and less frequent than Heraklion or Souda.",
      "Most transfer demand here is onward: cruise passengers heading to Arkadi or Preveli for the day, and seasonal ferry arrivals continuing to beach hotels east and west.",
    ],
    lines: [
      { operator: "Seasonal operators", connects: "Piraeus and the Cyclades", frequency: "Selected summer sailings" },
      { operator: "Cruise lines", connects: "Small-ship Mediterranean itineraries", frequency: "Seasonal calls" },
    ],
    arrivalTimes: "Seasonal — morning berthing for most calls.",
    meetingPoint: "Name board at the port gate, a two-minute walk from the quay.",
    disembarkNotes: [
      "The old town is walkable from the quay; transfers here are usually for onward trips.",
      "Arkadi Monastery and Preveli are the two most requested shore excursions and both work as hourly bookings.",
      "Both airports are within 75 minutes.",
    ],
    fromPriceEur: 25,
    faqs: [
      {
        q: "Can I book a shore excursion from Rethymno port?",
        a: "Yes — book the hourly service with a driver and set your own itinerary, with a guaranteed return before the ship sails.",
      },
    ],
  },
  {
    slug: "kissamos-port",
    name: "Kissamos Port (Kastelli)",
    town: "Kissamos",
    region: "Chania",
    heroImage: img("kissamos"),
    summary: "The far west port — Balos and Gramvousa boats, plus Kythira and Peloponnese sailings.",
    intro: [
      "Kissamos, still widely called Kastelli, is the westernmost port on Crete. It is the departure point for the Balos and Gramvousa day boats and the terminal for the long, infrequent sailings north to Kythira, Antikythira and Gythio.",
      "The Balos boats leave early and sell out, which makes the morning transfer from Chania and the resort strip the busiest job of the day out here.",
    ],
    lines: [
      { operator: "Gramvousa Balos Cruises", connects: "Balos lagoon and Gramvousa island", frequency: "Daily, April–October" },
      { operator: "LANE / Triton", connects: "Kythira, Antikythira, Gythio", frequency: "Several sailings weekly" },
    ],
    arrivalTimes:
      "Day boats return between 18:00 and 19:30. Mainland sailings arrive irregularly, often late evening.",
    meetingPoint: "Name board at the harbour car park, directly opposite the boarding gate.",
    disembarkNotes: [
      "Early departures: most Balos passengers book a 08:15–08:45 pickup from Chania or Platanias.",
      "Return transfers are worth pre-booking — the harbour taxi supply is thin at 19:00.",
      "The final approach road is steep and narrow; larger vans take a slightly longer route.",
    ],
    routeSlug: "chania-airport-to-kissamos",
    fromPriceEur: 45,
    faqs: [
      {
        q: "How do I get to the Balos boat from Chania?",
        a: "A private transfer to Kissamos port takes about 45 minutes. Book the return leg at the same time — the boats land together and taxis are scarce.",
      },
      {
        q: "Is Kastelli the same port as Kissamos?",
        a: "Yes. Kastelli is the older local name for the same harbour.",
      },
    ],
  },
  {
    slug: "agios-nikolaos-port",
    name: "Agios Nikolaos Port",
    town: "Agios Nikolaos",
    region: "Lasithi",
    heroImage: img("agios-nikolaos"),
    summary: "A compact eastern port with Dodecanese links and regular cruise calls.",
    intro: [
      "Agios Nikolaos handles the eastern Crete sailings towards Kasos, Karpathos and Rhodes, alongside a steady summer cruise programme that tenders passengers into the harbour beside the lake.",
      "The port sits in the town itself, so arrivals are immediately somewhere rather than at an industrial gate.",
    ],
    lines: [
      { operator: "ANEK Lines", connects: "Kasos, Karpathos, Rhodes, Piraeus", frequency: "Weekly sailings" },
      { operator: "Cruise lines", connects: "Aegean itineraries", frequency: "Seasonal calls" },
    ],
    arrivalTimes: "Dodecanese sailings arrive at varied hours including overnight. Cruise tenders land from 08:00.",
    meetingPoint: "Name board at the quay entrance, one minute from the tender pontoon.",
    disembarkNotes: [
      "Elounda, Plaka and the Spinalonga boats are all within twenty minutes.",
      "Heraklion airport is roughly an hour by motorway for same-day onward flights.",
      "Cruise passengers should build in a 45-minute buffer before all-aboard time.",
    ],
    routeSlug: "agios-nikolaos-to-elounda",
    fromPriceEur: 30,
    faqs: [
      {
        q: "How long from Agios Nikolaos port to Heraklion airport?",
        a: "About 60 minutes on the E75 motorway, fixed price, with flight tracking on the return leg.",
      },
    ],
  },
  {
    slug: "sitia-port",
    name: "Sitia Port",
    town: "Sitia",
    region: "Lasithi",
    heroImage: img("sitia"),
    summary: "The far east — the Dodecanese line's first Cretan call, and a very quiet ramp.",
    intro: [
      "Sitia is the easternmost port on Crete and the first Cretan stop on the Piraeus–Dodecanese line. Arrivals here are small, infrequent and often at antisocial hours.",
      "There is effectively no on-demand transport at 03:00 in Sitia. Everything east of Agios Nikolaos needs to be booked ahead.",
    ],
    lines: [
      { operator: "ANEK Lines", connects: "Piraeus, Milos, Kasos, Karpathos, Rhodes", frequency: "Two to three sailings weekly" },
    ],
    arrivalTimes: "Highly variable, frequently between midnight and 05:00.",
    meetingPoint: "Name board at the quayside, directly at the ramp.",
    disembarkNotes: [
      "Night arrivals are the norm — confirm your sailing when you book so the driver tracks it.",
      "Vai, Zakros and Ierapetra are the usual onward destinations.",
      "Heraklion airport is roughly three hours; allow for it on departure day.",
    ],
    routeSlug: "agios-nikolaos-to-sitia",
    fromPriceEur: 40,
    faqs: [
      {
        q: "Is there a taxi at Sitia port at night?",
        a: "Rarely. Sailings arrive at unsociable hours and the local rank is small — pre-book a fixed-price transfer.",
      },
    ],
  },
];

export function getFerryPort(slug: string): FerryPort | undefined {
  return FERRY_PORTS.find((p) => p.slug === slug);
}

/** Records default to the launch territory until an entry names its own. */
export function ferryPortsInTerritory(territory: string): FerryPort[] {
  return FERRY_PORTS.filter((r) => (r.territory ?? DEFAULT_TERRITORY) === territory);
}
