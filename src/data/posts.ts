export type PostSection = {
  id: string;
  heading: string;
  body: string[];
};

export type Post = {
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  category: "guides" | "tips" | "airports";
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  author: { name: string; role: string };
  sections: PostSection[];
  faq?: { q: string; a: string }[];
  related: string[];
};

const AUTHOR_NIKOS = { name: "Nikos Papadakis", role: "Head of Dispatch, Heraklion" };
const AUTHOR_MARIA = { name: "Maria Vlachaki", role: "Operations, Chania" };

export const POSTS: Post[] = [
  {
    slug: "heraklion-airport-to-chania-options",
    title: "Heraklion Airport to Chania: Every Way to Cross the Island",
    description:
      "Bus, rental car, taxi or pre-booked transfer — a local's honest comparison of every way to get from Heraklion Airport (HER) to Chania, with real prices and times.",
    heroImage:
      "https://images.unsplash.com/photo-1601161221525-6b3e0f0e13db?auto=format&fit=crop&w=1600&q=70",
    category: "guides",
    publishedAt: "2026-06-12",
    readingMinutes: 7,
    author: AUTHOR_NIKOS,
    sections: [
      {
        id: "why-this-route",
        heading: "Why so many people land in Heraklion but stay in Chania",
        body: [
          "Heraklion (HER) gets roughly three times more flights than Chania (CHQ), and they're usually cheaper. So every summer, thousands of travellers land on the east side of the island with a hotel booked 140 km to the west. The good news: the north-coast highway (E75/VOAK) makes this one of the easiest long drives in Greece.",
          "Budget around 2 hours and 10 minutes door to door in normal traffic. In August, add 20–30 minutes for the stretch around Rethymno.",
        ],
      },
      {
        id: "ktel-bus",
        heading: "Option 1: The KTEL bus (cheapest, slowest)",
        body: [
          "The intercity KTEL bus runs from Heraklion's main station — not the airport — to Chania roughly every hour in season, for about €15 per person. Factor in the local bus or taxi from the airport to the station, a possible wait, and the stop in Rethymno, and the real travel time is 3.5 to 4 hours.",
          "It's a fine option for solo backpackers with time. For families with luggage after a 3am start, it's the hard way to begin a holiday.",
        ],
      },
      {
        id: "rental-car",
        heading: "Option 2: Rental car (flexible, but think it through)",
        body: [
          "If you were going to rent a car for your whole stay anyway, picking it up at HER and driving west works well. The catch: one-way rentals between cities often carry a relocation fee, August pickup queues at the airport desks can run past an hour, and Chania's old town is pedestrianised — your hotel may have no parking at all.",
          "Rough cost for the drive itself: €25–35 in fuel plus the rental day.",
        ],
      },
      {
        id: "taxi-vs-transfer",
        heading: "Option 3: Taxi rank vs pre-booked transfer",
        body: [
          "A metered taxi from the HER rank to Chania will quote anywhere from €180 to €250 depending on the driver, the hour and your negotiation stamina. It's legal, but the price is whatever the meter (or the driver) says at the end.",
          "A pre-booked private transfer fixes the price before you fly — €165 for an economy sedan on our Heraklion Airport to Chania route, per vehicle, not per person. Your driver tracks the flight, waits at arrivals with a name sign, and the car fits four people with bags for the same fixed number. For two or more travellers it's almost always cheaper than the rank, and it's door-to-door to your hotel's nearest access point.",
        ],
      },
      {
        id: "verdict",
        heading: "The local verdict",
        body: [
          "Travelling alone on a budget with daylight to spare: take the bus. Staying somewhere remote and planning day trips daily: rent the car. Everyone else — couples, families, groups with luggage, anyone landing after 20:00 — pre-book the transfer and sleep in the back seat. The two-hour drive along the coast is genuinely beautiful; let someone who drives it every week do the driving.",
        ],
      },
    ],
    faq: [
      {
        q: "How long is the transfer from Heraklion Airport to Chania?",
        a: "Around 2 hours 10 minutes for the 140 km drive, motorway almost the whole way.",
      },
      {
        q: "How much does a private transfer cost?",
        a: "From €165 fixed, per vehicle (up to 3 passengers in Economy; minivans for up to 7 available).",
      },
    ],
    related: ["taxi-vs-prebooked-transfer-crete", "night-arrivals-heraklion-airport"],
  },
  {
    slug: "taxi-vs-prebooked-transfer-crete",
    title: "Taxi vs Pre-Booked Transfer in Crete: What Locals Actually Recommend",
    description:
      "Airport taxi ranks, ride apps and pre-booked transfers in Crete compared — pricing transparency, night surcharges, luggage, and when each option makes sense.",
    heroImage:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1600&q=70",
    category: "tips",
    publishedAt: "2026-06-02",
    readingMinutes: 5,
    author: AUTHOR_MARIA,
    sections: [
      {
        id: "the-rank",
        heading: "How the airport taxi rank really works",
        body: [
          "Both Cretan airports have official taxi ranks with posted zone prices — in theory. In practice, the posted price sheet covers a handful of destinations, night and luggage surcharges get added verbally, and in peak season the queue after a delayed evening arrival can be 40 minutes long.",
          "Cretan taxi drivers are overwhelmingly honest professionals. But the structure — negotiate after landing, pay what's quoted — puts all the uncertainty on the traveller.",
        ],
      },
      {
        id: "ride-apps",
        heading: "Why ride-hailing apps don't really work here",
        body: [
          "Uber and Bolt operate in Athens, but on Crete app coverage is thin to nonexistent outside Heraklion city, and what exists is regular taxis on the app's meter. For an airport-to-resort run of 30–80 km, drivers routinely decline app requests in favour of rank work. Don't build your arrival plan around an app pin.",
        ],
      },
      {
        id: "prebooked",
        heading: "What pre-booking changes",
        body: [
          "A pre-booked transfer inverts the model: the price is fixed when you book, not when you land. You know the number before you fly, the driver is assigned to you by name, the flight is tracked so delays cost nothing, and a child seat is in the car before you ask.",
          "The night surcharge is the honest test. Ours is published — +15% between 22:00 and 06:00, shown in the price breakdown before you confirm. At a rank, the night rate is whatever appears on the meter tariff you can't read from the back seat.",
        ],
      },
      {
        id: "when-taxi-wins",
        heading: "When the taxi rank is the right call",
        body: [
          "Short hops with no luggage — Chania airport to a city hotel at 2pm on a Tuesday — the rank is quick and fair, and pre-booking gains you little. Spontaneous trips around town: hail away. The pre-booked transfer earns its keep on airport arrivals, night landings, long routes, families with gear, and any day when a delay would otherwise cascade into chaos.",
        ],
      },
    ],
    related: ["heraklion-airport-to-chania-options", "crete-with-kids-child-seats"],
  },
  {
    slug: "souda-port-cruise-ferry-arrivals",
    title: "Arriving at Souda Port: A Local's Guide for Ferry and Cruise Passengers",
    description:
      "The overnight ferry from Piraeus docks at Souda at 6am. Here's exactly what happens next — port layout, taxis, transfers to Chania old town and beyond.",
    heroImage:
      "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=1600&q=70",
    category: "guides",
    publishedAt: "2026-05-20",
    readingMinutes: 6,
    author: AUTHOR_MARIA,
    sections: [
      {
        id: "the-dock",
        heading: "What 06:00 at Souda actually looks like",
        body: [
          "The ANEK and Minoan overnight ferries from Piraeus arrive at Souda between 05:45 and 06:30. You walk (or drive) off the vehicle deck into a working commercial port — not a cruise terminal with cafés. There's a small terminal building, a taxi rank that empties fast, and that's about it.",
          "Chania old town is only 8 km away, but at that hour the city bus hasn't started its full schedule and half the ferry is heading the same direction you are.",
        ],
      },
      {
        id: "options",
        heading: "Your three options off the boat",
        body: [
          "The public bus into Chania costs about €2.50 and runs from outside the port gate — fine if you're travelling light and your accommodation opens early. The taxi rank works on zone fares; expect €15–20 into town, more with bags, and a queue that can outlast your patience after 300 passengers disembark at once.",
          "A pre-booked transfer costs €25 fixed to Chania old town — the driver tracks the ferry (they're often late in winter, early in summer), meets you at the terminal exit with a sign, and drops you at the closest vehicle access point to your hotel, since most of the old town is pedestrianised.",
        ],
      },
      {
        id: "cruise",
        heading: "Cruise passengers: the day-trip math",
        body: [
          "Cruise ships calling at Souda give you 8–10 hours. The shuttle to Chania covers the old town, but the best of western Crete — Balos lagoon, Falasarna, the Akrotiri monasteries — needs wheels. A private driver for a fixed day rate beats the ship excursion on both price and flexibility for groups of three or more. Tell the driver your all-aboard time; getting you back with margin is their job, and they do it daily.",
        ],
      },
      {
        id: "onward",
        heading: "Heading further than Chania?",
        body: [
          "Souda to Rethymno, Kissamos or the south coast is where pre-booking really matters — those are 45-to-90-minute drives with no direct bus at dawn. Fixed prices from Souda are on our port transfer pages, and the same ferry-tracking rule applies: if the boat is late, we're late with it, at no charge.",
        ],
      },
    ],
    faq: [
      {
        q: "How far is Souda Port from Chania old town?",
        a: "About 8 km — a 15-minute drive. Fixed transfer price €25 per vehicle.",
      },
    ],
    related: ["chania-old-town-arrival-tips", "heraklion-airport-to-chania-options"],
  },
  {
    slug: "crete-with-kids-child-seats",
    title: "Crete with Kids: Car Seats, Transfers and the Logistics Nobody Warns You About",
    description:
      "Greek car seat law, why taxi ranks can't help you, and how to plan family transfers in Crete without dragging three car seats through an airport.",
    heroImage:
      "https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=1600&q=70",
    category: "tips",
    publishedAt: "2026-05-05",
    readingMinutes: 5,
    author: AUTHOR_NIKOS,
    sections: [
      {
        id: "the-law",
        heading: "What Greek law says about kids in cars",
        body: [
          "Children under 135 cm must ride in an appropriate child restraint in private vehicles. Licensed taxis are technically exempt — which is precisely the problem. The rank taxi that picks you up owes your toddler nothing more than a lap. Most parents discover this at the arrivals curb, jet-lagged, with no good options.",
        ],
      },
      {
        id: "bring-or-book",
        heading: "Bring your own seat, or book the car that has one?",
        body: [
          "Airlines usually check car seats free, but you're then carrying a bulky seat through two airports for a pair of 40-minute rides. Renting seats with a hire car works if you're driving yourself all week — inspect the seat before you accept it.",
          "The middle path: book a transfer with the seat requested up front. We fit forward-facing seats and boosters (+€10, requested at booking with your child's age), installed before the driver leaves the garage. Tell us ages, not just 'a child seat' — a 10-month-old and a 6-year-old need different hardware.",
        ],
      },
      {
        id: "minivan-math",
        heading: "The minivan math for families",
        body: [
          "Two adults, three kids, a buggy, five cases and a snorkel bag do not fit in a sedan, whatever the booking site said. Our minivan class (up to 7 passengers, 7 bags) costs 1.6× the sedan price — on the Heraklion Airport to Hersonissos run that's the difference between €42 and €67. Split across a family, the upgrade costs less than the airport sandwiches.",
        ],
      },
      {
        id: "timing",
        heading: "Timing tips from a thousand family pickups",
        body: [
          "Book the pickup for actual-landing-plus-45-minutes if you have checked bags and small children — rushing a family through baggage claim saves nobody. If your return flight leaves before 08:00, ask dispatch about the night surcharge window and build in the 22:00–06:00 +15% honestly rather than being surprised. And put the hotel's name and your kid's seat needs in the booking notes; the driver reads them the night before.",
        ],
      },
    ],
    related: ["taxi-vs-prebooked-transfer-crete", "night-arrivals-heraklion-airport"],
  },
  {
    slug: "night-arrivals-heraklion-airport",
    title: "Landing at Heraklion Airport After Midnight: What to Expect",
    description:
      "HER is one of Greece's busiest night airports in summer. How late arrivals work, what's open, night transfer surcharges, and how not to get stranded.",
    heroImage:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=70",
    category: "airports",
    publishedAt: "2026-04-18",
    readingMinutes: 5,
    author: AUTHOR_NIKOS,
    sections: [
      {
        id: "night-rush",
        heading: "The 01:00 rush is real",
        body: [
          "Charter and low-cost schedules stack late arrivals into Heraklion all summer — it's routinely among the busiest Greek airports between midnight and 03:00. Passport control moves fast for EU flights, but baggage delivery at that hour runs 20–40 minutes. The terminal food options will be closed; the vending machines will not inspire.",
        ],
      },
      {
        id: "whats-outside",
        heading: "What's waiting outside at 2am",
        body: [
          "The taxi rank does operate through the night, but supply is whatever it is — after three simultaneous arrivals, the queue can be an hour, and night tariff applies. The KTEL bus does not run overnight. Hotel shuttles mostly stop by midnight. This is the single situation where pre-booking changes your night most dramatically: a named driver, already inside the car park, watching your flight number.",
        ],
      },
      {
        id: "surcharge",
        heading: "About night surcharges (ours and everyone's)",
        body: [
          "Any honest operator charges more at night — drivers are working at 3am. The difference is whether you learn the number before or after the ride. Our surcharge is +15% for pickups between 22:00 and 06:00, calculated on the fixed route price and displayed in the breakdown before you confirm. A €42 Hersonissos run becomes €48. No meter maths at the curb.",
        ],
      },
      {
        id: "checklist",
        heading: "The late-arrival checklist",
        body: [
          "Put your flight number on the booking — tracking is what makes 'delayed to 02:40' a non-event. Screenshot your driver's name and the dispatch number before you board, in case your roaming eSIM sulks. Tell your hotel you're arriving at 3am so the night porter expects you. And book the car before you fly: at 01:30 in August, arrivals hall optimism is not a transport strategy.",
        ],
      },
    ],
    faq: [
      {
        q: "Is there a night surcharge on transfers?",
        a: "Yes — +15% for pickups between 22:00 and 06:00, shown in your price breakdown before you book.",
      },
      {
        q: "What if my flight lands at 3am late?",
        a: "We track the flight number. The driver adjusts automatically and waiting is free for flight delays.",
      },
    ],
    related: ["heraklion-airport-to-chania-options", "crete-with-kids-child-seats"],
  },
  {
    slug: "chania-old-town-arrival-tips",
    title: "Getting Into Chania Old Town: Why Your Car Can't Reach Your Hotel",
    description:
      "Chania's Venetian old town is largely car-free. Where transfers and taxis actually drop you, how far you'll walk, and how to make arrival painless.",
    heroImage:
      "https://images.unsplash.com/photo-1601161221525-6b3e0f0e13db?auto=format&fit=crop&w=1600&q=70",
    category: "guides",
    publishedAt: "2026-04-02",
    readingMinutes: 4,
    author: AUTHOR_MARIA,
    sections: [
      {
        id: "car-free",
        heading: "The beautiful problem",
        body: [
          "The lanes around Chania's Venetian harbour are what you came for — and they're too narrow, too stepped or simply closed to traffic. If your boutique hotel's address says Zambeliou or Theotokopoulou, no vehicle is pulling up to the door. Every arrival ends with a short walk, and knowing which drop-off point minimises it is genuinely useful local knowledge.",
        ],
      },
      {
        id: "drop-points",
        heading: "Where drivers actually drop you",
        body: [
          "The main access points are the harbour edge near the Yali Tzamisi mosque for northern old-town hotels, Talos Square on the west side, and the market hall (Agora) for the southern lanes. A driver who works Chania daily will pick the right one for your exact hotel — ours will also walk you to the door if the bags outnumber the hands, and our Chania Airport to Old Town route notes exactly this.",
        ],
      },
      {
        id: "luggage",
        heading: "Cobbles and luggage: a warning",
        body: [
          "Whatever suitcase wheels you own, Venetian cobbles disagree with them. If mobility is a concern, say so in the booking notes — the drop point can often be chosen to trade a scenic 300-metre walk for a flat 80-metre one. Several old-town hotels also offer porter service if warned; we pass your arrival time to them on request.",
        ],
      },
      {
        id: "timing",
        heading: "One last tip: arrive before the evening volta",
        body: [
          "From about 19:00 in season, the old town fills for the evening stroll and waterfront dinner service. A 20:30 arrival means threading a rolling suitcase through crowds at golden hour. If your flight allows it, aim to reach the old town before 18:00 — or embrace it, hand the bags to the porter, and join the volta immediately. You're on Crete now.",
        ],
      },
    ],
    related: ["souda-port-cruise-ferry-arrivals", "heraklion-airport-to-chania-options"],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
