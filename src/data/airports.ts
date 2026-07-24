export type BookableMode = "instant" | "quote";

export type AirportTip = { title: string; body: string };
export type AirportFaq = { q: string; a: string };
export type TransportOption = {
  mode: string;
  time: string;
  cost: string;
  pros: string;
  cons: string;
  recommended?: boolean;
};

export type AirportData = {
  iata: string;
  slug: string;
  name: string;
  officialName: string;
  alias: string;
  address: string;
  citySlug: string;
  cityName: string;
  zip: string;
  /** Country display name — "Greece" for curated airports, any country for global IATA airports. */
  country: string;
  island?: string;
  region?: string;
  heroImage: string;
  fromPriceEur: number;
  bookable: BookableMode;
  terminals: string;
  pickupPoint: string;
  cityDriveMin: string;
  tollsNote: string;
  updatedAt: string;
  intro: string;
  knowBefore: AirportTip[];
  insights: string[];
  comparison: TransportOption[];
  faqs: AirportFaq[];
};

export const AIRPORTS: AirportData[] = [
{
  "iata": "HER",
  "slug": "crete-heraklion-airport-transfers-her",
  "name": "Crete Heraklion Airport",
  "officialName": "Heraklion Nikos Kazantzakis International Airport",
  "alias": "Heraklion Airport",
  "address": "Λ. Ικάρου, 716 01",
  "citySlug": "heraklion",
  "cityName": "Heraklion",
  "zip": "716 01",
  "country": "Greece",
  "island": "Crete",
  "heroImage": "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=1600&q=70",
  "fromPriceEur": 40,
  "bookable": "instant",
  "terminals": "Single terminal for all arrivals and departures.",
  "pickupPoint": "Arrivals baggage-hall exit with name sign",
  "cityDriveMin": "15–20 min off-peak; up to 30 min at 08:00–09:00 and 17:00–19:00",
  "tollsNote": "No toll roads or LEZ fees on Crete routes from HER.",
  "updatedAt": "2026-07-24",
  "intro": "Crete Heraklion Airport sits just 4 km from the island’s largest city. Pre-booking a private TransferAround transfer guarantees a licensed local driver waiting at arrivals with your name — no taxi queues, no surge pricing.",
  "knowBefore": [
    {
      "title": "Single terminal, straightforward arrivals",
      "body": "One terminal handles all flights. After baggage claim, exit to the arrivals hall where your driver waits with a name sign. Free 60-minute wait included for delays and luggage."
    },
    {
      "title": "E75: 4 km, 15–20 minutes normally",
      "body": "The airport lies 4 km from Heraklion centre via the E75. Allow up to 30 minutes in peak commute windows; there is no useful alternate route."
    },
    {
      "title": "No tolls or hidden road charges",
      "body": "Crete has no toll roads or low-emission zones on this corridor. Your fixed TransferAround price is the price you pay."
    },
    {
      "title": "Licensed private-hire & 24/7",
      "body": "Drivers hold Greece’s Special Driving Licence for private hire. Transfers run around the clock — including when KTEL buses stop and taxi ranks stretch."
    }
  ],
  "insights": [
    "Crete Heraklion Airport operates a **single terminal**. Passengers walk or take a short apron bus to arrivals, clear immigration if needed, collect bags, then exit through the **arrivals baggage-hall exit** — the meeting point for TransferAround pickups. Short-term pickup parking is free and a minute’s walk from the exit.",
    "The journey to Heraklion city centre follows the **E75**, covering about 4 km. Door-to-door is typically 15–20 minutes; weekday peaks (08:00–09:00 and 17:00–19:00) can stretch to 30 minutes. All congestion sits on this corridor.",
    "KTEL city buses (lines 6, 11, 12) cost about €2 but run roughly 06:00–midnight and are awkward with luggage. The taxi rank often quotes €20–30 with queue risk. A **pre-booked private transfer** locks the fare, includes flight tracking and meet & greet, and removes the guesswork — especially for families and late arrivals."
  ],
  "comparison": [
    {
      "mode": "KTEL public bus (lines 6, 11, 12)",
      "time": "15 min",
      "cost": "EUR 2.00",
      "pros": "Cheap; direct toward the city",
      "cons": "Cash-focused; limited hours; luggage crowding"
    },
    {
      "mode": "Taxi from rank",
      "time": "10–15 min drive + queue",
      "cost": "EUR 20–30",
      "pros": "Direct; 24/7",
      "cons": "Queues; metered variance; no flight tracking"
    },
    {
      "mode": "TransferAround private transfer",
      "time": "15–20 min",
      "cost": "from EUR 40",
      "pros": "Fixed price, meet & greet, 60-min wait, child seats on request",
      "cons": "Book in advance",
      "recommended": true
    }
  ],
  "faqs": [
    {
      "q": "Where will the TransferAround driver meet me at Crete Heraklion Airport?",
      "a": "Your driver meets you at the arrivals baggage-hall exit holding a name sign. Walk out after luggage and look for your surname."
    },
    {
      "q": "Are tolls and road charges included in the TransferAround price?",
      "a": "Yes — fully included. Crete has no tolls or LEZ fees on HER–city routes; the booked fare is final."
    },
    {
      "q": "How long does the drive from Crete Heraklion Airport to Heraklion usually take?",
      "a": "Typically 15–20 minutes via the E75. Peak weekday windows can reach 30 minutes."
    },
    {
      "q": "How does TransferAround compare to taxis at Crete Heraklion Airport?",
      "a": "Rank taxis are convenient but queues and night rates add friction. TransferAround fixes price and timing with flight monitoring."
    },
    {
      "q": "What if my flight lands at a different terminal?",
      "a": "HER has one terminal — all flights arrive at the same building. Your driver is updated if schedules shift."
    },
    {
      "q": "Do TransferAround drivers hold Greek private-hire licences?",
      "a": "Yes. Partner drivers operating at Crete Heraklion Airport hold valid Greek licences for private-hire passenger transport, are fully insured, and authorised for airport transfers."
    },
    {
      "q": "Is TransferAround available for late-night arrivals at Crete Heraklion Airport?",
      "a": "Yes. Transfers run 24/7 at Crete Heraklion Airport. Book in advance with your flight number and the driver monitors arrival in real time."
    },
    {
      "q": "How do I pay, and is tipping expected?",
      "a": "Payment is arranged at booking (card online) or confirmed on quote. Tipping is not compulsory in Greece; 5–10% is appreciated for exceptional service."
    },
    {
      "q": "Are child car seats available from Crete Heraklion Airport?",
      "a": "Yes — free on request. State ages when booking and the correct seats will be installed before pickup."
    },
    {
      "q": "How long will the driver wait if my flight is delayed?",
      "a": "Complimentary 60-minute wait at airport arrivals is included. We track your flight so the driver adjusts automatically. Longer waits may incur a small charge."
    }
  ]
},
{
  "iata": "CHQ",
  "slug": "chania-international-airport-transfers-chq",
  "name": "Chania International Airport",
  "officialName": "Chania Ioannis Daskalogiannis Airport",
  "alias": "Chania Airport",
  "address": "Souda, 731 00",
  "citySlug": "chania",
  "cityName": "Chania",
  "zip": "731 00",
  "country": "Greece",
  "island": "Crete",
  "heroImage": "https://images.unsplash.com/photo-1571498664957-fde285d79857?auto=format&fit=crop&w=1600&q=70",
  "fromPriceEur": 35,
  "bookable": "instant",
  "terminals": "Single terminal.",
  "pickupPoint": "Arrivals hall exit with name sign",
  "cityDriveMin": "20–30 min to Chania Old Town",
  "tollsNote": "No tolls on Crete. Souda Port is nearby for ferry connections.",
  "updatedAt": "2026-07-24",
  "intro": "Chania Airport is the west-Crete gateway, about 14 km from the Venetian harbour. TransferAround drivers know Old Town drop-off limits and resort access roads from Platanias to Kissamos.",
  "knowBefore": [
    {
      "title": "Compact single-terminal arrivals",
      "body": "Collect bags and exit to the arrivals hall. Your driver waits with a name sign; 60 minutes free waiting time is included."
    },
    {
      "title": "14 km to Old Town via coastal roads",
      "body": "Expect 20–30 minutes depending on traffic through Souda and the Chania ring. Peak summer evenings add time."
    },
    {
      "title": "Old Town vehicle limits",
      "body": "Much of the harbour core is pedestrianised. We drop at the nearest legal access point for your hotel — confirm the address when booking."
    },
    {
      "title": "Ferry + airport same day",
      "body": "Souda Port is minutes from the airport road. We can connect ferry arrivals or departures on the same itinerary as a quote add-on."
    }
  ],
  "insights": [
    "Chania Airport (CHQ) is a single-terminal seasonal hub for west Crete. After baggage claim, exit to the arrivals hall for TransferAround meet & greet. The forecourt is compact; drivers stage nearby and message when you land.",
    "The drive into Chania follows the main coastal corridor past Souda Bay. Door-to-door to the Old Town is usually 20–30 minutes. Resort strips west (Platanias, Agia Marina) and east (Georgioupoli, Almyrida) add time but remain fixed-price corridors in our catalogue.",
    "KTEL buses exist but are infrequent relative to charter waves. Taxi ranks surge in July–August. **Private transfer** removes queue risk and locks the fare before you land — essential for late charters and villa drop-offs on narrow village roads."
  ],
  "comparison": [
    {
      "mode": "KTEL coach",
      "time": "30–40 min",
      "cost": "EUR 2–3",
      "pros": "Cheap",
      "cons": "Limited timetable; luggage hassle"
    },
    {
      "mode": "Taxi from rank",
      "time": "20–30 min",
      "cost": "EUR 25–35",
      "pros": "Direct",
      "cons": "Queue + variable fare"
    },
    {
      "mode": "TransferAround private transfer",
      "time": "20–30 min",
      "cost": "from EUR 35",
      "pros": "Fixed price, meet & greet, flight tracking",
      "cons": "Book ahead",
      "recommended": true
    }
  ],
  "faqs": [
    {
      "q": "Where will the TransferAround driver meet me at Chania International Airport?",
      "a": "Driver waits at the arrivals hall exit with your name sign after baggage claim."
    },
    {
      "q": "Are tolls and road charges included in the TransferAround price?",
      "a": "No Crete tolls. Your fixed price includes all road costs on standard CHQ routes."
    },
    {
      "q": "How long does the drive from Chania International Airport to Chania usually take?",
      "a": "About 20–30 minutes to Chania Old Town; resorts west or east take longer — see route pages for exact times."
    },
    {
      "q": "How does TransferAround compare to taxis at Chania International Airport?",
      "a": "Rank taxis work but summer queues are long. We fix the price and track your flight."
    },
    {
      "q": "What if my flight lands at a different terminal?",
      "a": "Single terminal — no terminal changes to worry about."
    },
    {
      "q": "Do TransferAround drivers hold Greek private-hire licences?",
      "a": "Yes. Partner drivers operating at Chania International Airport hold valid Greek licences for private-hire passenger transport, are fully insured, and authorised for airport transfers."
    },
    {
      "q": "Is TransferAround available for late-night arrivals at Chania International Airport?",
      "a": "Yes. Transfers run 24/7 at Chania International Airport. Book in advance with your flight number and the driver monitors arrival in real time."
    },
    {
      "q": "How do I pay, and is tipping expected?",
      "a": "Payment is arranged at booking (card online) or confirmed on quote. Tipping is not compulsory in Greece; 5–10% is appreciated for exceptional service."
    },
    {
      "q": "Are child car seats available from Chania International Airport?",
      "a": "Yes — free on request. State ages when booking and the correct seats will be installed before pickup."
    },
    {
      "q": "How long will the driver wait if my flight is delayed?",
      "a": "Complimentary 60-minute wait at airport arrivals is included. We track your flight so the driver adjusts automatically. Longer waits may incur a small charge."
    }
  ]
},
{
  "iata": "ATH",
  "slug": "athens-airport-transfers-ath",
  "name": "Athens Airport",
  "officialName": "Athens Eleftherios Venizelos Airport",
  "alias": "Athens International Airport",
  "address": "Attiki Odos, Spata Artemida",
  "citySlug": "athens",
  "cityName": "Athens",
  "zip": "190 04",
  "country": "Greece",
  "heroImage": "https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&w=1600&q=70",
  "fromPriceEur": 45,
  "bookable": "quote",
  "terminals": "Main Terminal and Satellite Terminal linked by underground passage.",
  "pickupPoint": "Arrivals baggage-hall exit (ground floor)",
  "cityDriveMin": "25–35 min off-peak; 45–60 min weekday peaks",
  "tollsNote": "Attiki Odos toll (~€2.55) and central LEZ costs included in fixed quotes.",
  "updatedAt": "2026-07-24",
  "intro": "Athens Airport handles 30M+ passengers a year across two terminals. TransferAround partners meet you at arrivals with a name sign, monitor your flight, and include motorway tolls in the fixed quote.",
  "knowBefore": [
    {
      "title": "Two terminals, one meeting pattern",
      "body": "Main and Satellite terminals connect underground. Your driver meets you at the ground-floor arrivals baggage-hall exit for the terminal you actually land at — no surcharge."
    },
    {
      "title": "Attiki Odos toll included",
      "body": "The A6 Attiki Odos toll and any Daktylios LEZ compliance costs for central Athens are built into your fixed TransferAround price."
    },
    {
      "title": "25–60 minutes to the centre",
      "body": "Off-peak city runs take 25–35 minutes. Weekday peaks (07:30–09:30, 17:00–19:30) often need 45–60 minutes."
    },
    {
      "title": "Piraeus & Rafina ready",
      "body": "Ferry connections to the islands are popular add-ons — Piraeus, Rafina and Lavrio are fixed-quote corridors from ATH."
    }
  ],
  "insights": [
    "**Athens Airport (ATH)** splits arrivals across Hall A (non-Schengen) and Hall B (Schengen/domestic) before a shared baggage-hall exit on the ground floor. TransferAround drivers wait there with a name sign and adjust if your aircraft uses the Satellite Terminal.",
    "The route into Athens uses the **A64** then **A6 Attiki Odos**. Tolls are included in your quote. Peak congestion on Attiki Odos is the main variable — not terminal choice.",
    "Metro Line 3 (~€9, ~40 min) and the X95 bus (~€5.50, ~60 min) are cheaper but painful with luggage. Official taxis use published flat day/night rates but queues form in waves. A **private transfer** is the reliable door-to-door option with flight tracking and a locked fare."
  ],
  "comparison": [
    {
      "mode": "Metro Line 3",
      "time": "~40 min",
      "cost": "EUR 9",
      "pros": "Frequent; affordable",
      "cons": "Crowds; station walks with bags"
    },
    {
      "mode": "X95 Express Bus",
      "time": "~60 min",
      "cost": "EUR 5.50",
      "pros": "24/7; cheap",
      "cons": "Slow; crowded mornings"
    },
    {
      "mode": "Taxi from rank",
      "time": "30–60 min",
      "cost": "EUR 40–55",
      "pros": "Door-to-door",
      "cons": "Queues; fixed-band but wait variance"
    },
    {
      "mode": "TransferAround private transfer",
      "time": "25–60 min",
      "cost": "from EUR 45",
      "pros": "Fixed quote, meet & greet, tolls included",
      "cons": "Book ahead",
      "recommended": true
    }
  ],
  "faqs": [
    {
      "q": "Where will the TransferAround driver meet me at Athens Airport?",
      "a": "Ground-floor arrivals baggage-hall exit with a name sign — Main or Satellite, no extra fee."
    },
    {
      "q": "Are tolls and road charges included in the TransferAround price?",
      "a": "Yes. Attiki Odos and relevant LEZ costs are included in the confirmed quote."
    },
    {
      "q": "How long does the drive from Athens Airport to Athens usually take?",
      "a": "25–35 minutes off-peak to central Athens; allow 45–60 minutes in weekday rush hours."
    },
    {
      "q": "How does TransferAround compare to taxis at Athens Airport?",
      "a": "Official taxis use day/night flat bands but queues can be long. We remove the wait and confirm price before you land."
    },
    {
      "q": "What if my flight lands at a different terminal?",
      "a": "No surcharge if you land at Satellite vs Main — the driver is updated from your flight data."
    },
    {
      "q": "Do TransferAround drivers hold Greek private-hire licences?",
      "a": "Yes. Partner drivers operating at Athens Airport hold valid Greek licences for private-hire passenger transport, are fully insured, and authorised for airport transfers."
    },
    {
      "q": "Is TransferAround available for late-night arrivals at Athens Airport?",
      "a": "Yes. Transfers run 24/7 at Athens Airport. Book in advance with your flight number and the driver monitors arrival in real time."
    },
    {
      "q": "How do I pay, and is tipping expected?",
      "a": "Payment is arranged at booking (card online) or confirmed on quote. Tipping is not compulsory in Greece; 5–10% is appreciated for exceptional service."
    },
    {
      "q": "Are child car seats available from Athens Airport?",
      "a": "Yes — free on request. State ages when booking and the correct seats will be installed before pickup."
    },
    {
      "q": "How long will the driver wait if my flight is delayed?",
      "a": "Complimentary 60-minute wait at airport arrivals is included. We track your flight so the driver adjusts automatically. Longer waits may incur a small charge."
    }
  ]
},
{
  "iata": "SKG",
  "slug": "thessaloniki-airport-transfers-skg",
  "name": "Thessaloniki Airport",
  "officialName": "Thessaloniki Airport Makedonia",
  "alias": "Macedonia Airport",
  "address": "P.O. Box 22605, 551 03",
  "citySlug": "thessaloniki",
  "cityName": "Thessaloniki",
  "zip": "551 03",
  "country": "Greece",
  "heroImage": "https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&w=1600&q=70",
  "fromPriceEur": 35,
  "bookable": "quote",
  "terminals": "T1 and T2 linked by internal corridor.",
  "pickupPoint": "Arrivals baggage-hall exit",
  "cityDriveMin": "25–35 min to city centre",
  "tollsNote": "No major tolls on the standard SKG–city run.",
  "updatedAt": "2026-07-24",
  "intro": "Thessaloniki Airport is Greece’s second busiest hub. TransferAround partners cover both terminals with meet & greet and fixed quotes into the city and Halkidiki resorts.",
  "knowBefore": [
    {
      "title": "Two terminals, one pickup logic",
      "body": "T1 and T2 connect indoors. Your driver meets you at the arrivals baggage-hall exit for your terminal."
    },
    {
      "title": "25–35 minutes to the centre",
      "body": "The coastal approach into Thessaloniki is usually under 35 minutes outside peak commute windows."
    },
    {
      "title": "Halkidiki corridors",
      "body": "Kassandra and Sithonia resorts are popular quote routes — longer fixed drives with luggage-friendly vehicles."
    },
    {
      "title": "Night arrivals covered",
      "body": "Charter and city breaks often land late. 24/7 coverage with flight monitoring is included in every quote."
    }
  ],
  "insights": [
    "SKG operates **T1 and T2** with a shared arrivals pattern. After immigration and bags, exit to the baggage-hall meeting point where TransferAround drivers hold your name sign.",
    "City transfers follow the main airport road into Thessaloniki. Door-to-door is typically 25–35 minutes. Halkidiki adds significant distance but remains a core use case.",
    "Buses exist but are awkward with luggage. Rank taxis are available with queue risk in peaks. **Private transfer** fixes price and timing for families and business travellers."
  ],
  "comparison": [
    {
      "mode": "Public bus",
      "time": "40–50 min",
      "cost": "EUR 2",
      "pros": "Cheap",
      "cons": "Transfers; luggage"
    },
    {
      "mode": "Taxi from rank",
      "time": "25–35 min",
      "cost": "EUR 25–35",
      "pros": "Direct",
      "cons": "Queue; variable"
    },
    {
      "mode": "TransferAround private transfer",
      "time": "25–35 min",
      "cost": "from EUR 35",
      "pros": "Fixed quote, meet & greet, flight tracking",
      "cons": "Book ahead",
      "recommended": true
    }
  ],
  "faqs": [
    {
      "q": "Where will the TransferAround driver meet me at Thessaloniki Airport?",
      "a": "Arrivals baggage-hall exit at T1 or T2 with a name sign."
    },
    {
      "q": "Are tolls and road charges included in the TransferAround price?",
      "a": "Standard city routes have no major tolls; any road charges on longer quotes are included."
    },
    {
      "q": "How long does the drive from Thessaloniki Airport to Thessaloniki usually take?",
      "a": "About 25–35 minutes to Thessaloniki centre under normal traffic."
    },
    {
      "q": "How does TransferAround compare to taxis at Thessaloniki Airport?",
      "a": "Taxis are available but peaks create queues. We confirm fare and monitor your flight."
    },
    {
      "q": "What if my flight lands at a different terminal?",
      "a": "Driver follows real-time terminal assignment between T1 and T2 at no extra cost."
    },
    {
      "q": "Do TransferAround drivers hold Greek private-hire licences?",
      "a": "Yes. Partner drivers operating at Thessaloniki Airport hold valid Greek licences for private-hire passenger transport, are fully insured, and authorised for airport transfers."
    },
    {
      "q": "Is TransferAround available for late-night arrivals at Thessaloniki Airport?",
      "a": "Yes. Transfers run 24/7 at Thessaloniki Airport. Book in advance with your flight number and the driver monitors arrival in real time."
    },
    {
      "q": "How do I pay, and is tipping expected?",
      "a": "Payment is arranged at booking (card online) or confirmed on quote. Tipping is not compulsory in Greece; 5–10% is appreciated for exceptional service."
    },
    {
      "q": "Are child car seats available from Thessaloniki Airport?",
      "a": "Yes — free on request. State ages when booking and the correct seats will be installed before pickup."
    },
    {
      "q": "How long will the driver wait if my flight is delayed?",
      "a": "Complimentary 60-minute wait at airport arrivals is included. We track your flight so the driver adjusts automatically. Longer waits may incur a small charge."
    }
  ]
},
{
  "iata": "JMK",
  "slug": "mykonos-airport-transfers-jmk",
  "name": "Mykonos Airport",
  "officialName": "Mykonos National Airport",
  "alias": "Mykonos Airport",
  "address": "Mykonos Town, Greece",
  "citySlug": "mykonos-town",
  "cityName": "Mykonos Town",
  "zip": "",
  "country": "Greece",
  "island": "Mykonos",
  "heroImage": "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=70",
  "fromPriceEur": 35,
  "bookable": "quote",
  "terminals": "Single compact terminal.",
  "pickupPoint": "Arrivals exit with name sign",
  "cityDriveMin": "10–20 min to Mykonos Town",
  "tollsNote": "No tolls on Mykonos.",
  "updatedAt": "2026-07-24",
  "intro": "Mykonos Airport (JMK) is minutes from Ornos and Platys Yialos. Summer queues at the taxi rank are notorious — pre-book a TransferAround private transfer for a fixed quote and meet & greet.",
  "knowBefore": [
    {
      "title": "Meet & greet at arrivals",
      "body": "Your TransferAround driver waits at arrivals exit with name sign. Free 60-minute wait covers delays and baggage."
    },
    {
      "title": "Drive time to Mykonos Town",
      "body": "10–20 min to Mykonos Town. Real-time traffic and flight monitoring adjust pickup timing."
    },
    {
      "title": "Local road & charges",
      "body": "No tolls on Mykonos."
    },
    {
      "title": "Licensed local chauffeurs",
      "body": "Partner drivers at Mykonos Airport hold valid Greek private-hire licences and know hotel access roads across Mykonos."
    }
  ],
  "insights": [
    "Mykonos Airport (JMK) serves Mykonos. Mykonos Airport (JMK) is minutes from Ornos and Platys Yialos. Summer queues at the taxi rank are notorious — pre-book a TransferAround private transfer for a fixed quote and meet & greet.",
    "Narrow island roads and resort drop-offs. Taxi ranks surge July–August.",
    "Alternatives include scarce public buses and taxi ranks that buses are limited and luggage-hostile. A **pre-booked TransferAround transfer** locks your fare, includes meet & greet and flight monitoring, and removes arrival stress — especially valuable with children or late landings."
  ],
  "comparison": [
    {
      "mode": "Public bus / KTEL",
      "time": "Varies",
      "cost": "EUR 2–5",
      "pros": "Cheapest",
      "cons": "Limited hours; luggage difficult"
    },
    {
      "mode": "Taxi from rank",
      "time": "10–20 min to Mykonos Town",
      "cost": "Metered / variable",
      "pros": "Direct if available",
      "cons": "Queues; price uncertainty"
    },
    {
      "mode": "TransferAround private transfer",
      "time": "10–20 min to Mykonos Town",
      "cost": "from EUR 35",
      "pros": "Fixed quote, meet & greet, 60-min wait, child seats",
      "cons": "Book in advance",
      "recommended": true
    }
  ],
  "faqs": [
    {
      "q": "Where will the TransferAround driver meet me at Mykonos Airport?",
      "a": "Your driver waits at the arrivals exit with name sign holding a name sign."
    },
    {
      "q": "Are tolls and road charges included in the TransferAround price?",
      "a": "No tolls on Mykonos. Confirmed in your quote — no surprise extras at the roadside."
    },
    {
      "q": "How long does the drive from Mykonos Airport to Mykonos Town usually take?",
      "a": "10–20 min to Mykonos Town to Mykonos Town."
    },
    {
      "q": "How does TransferAround compare to taxis at Mykonos Airport?",
      "a": "Rank taxis may be available but often queue in peaks. TransferAround fixes the price and monitors your flight."
    },
    {
      "q": "What if my flight lands at a different terminal?",
      "a": "Single compact terminal. Your driver follows live flight data if gates or timings change."
    },
    {
      "q": "Do TransferAround drivers hold Greek private-hire licences?",
      "a": "Yes. Partner drivers operating at Mykonos Airport hold valid Greek licences for private-hire passenger transport, are fully insured, and authorised for airport transfers."
    },
    {
      "q": "Is TransferAround available for late-night arrivals at Mykonos Airport?",
      "a": "Yes. Transfers run 24/7 at Mykonos Airport. Book in advance with your flight number and the driver monitors arrival in real time."
    },
    {
      "q": "How do I pay, and is tipping expected?",
      "a": "Payment is arranged at booking (card online) or confirmed on quote. Tipping is not compulsory in Greece; 5–10% is appreciated for exceptional service."
    },
    {
      "q": "Are child car seats available from Mykonos Airport?",
      "a": "Yes — free on request. State ages when booking and the correct seats will be installed before pickup."
    },
    {
      "q": "How long will the driver wait if my flight is delayed?",
      "a": "Complimentary 60-minute wait at airport arrivals is included. We track your flight so the driver adjusts automatically. Longer waits may incur a small charge."
    }
  ]
},
{
  "iata": "JTR",
  "slug": "santorini-airport-transfers-jtr",
  "name": "Santorini Airport",
  "officialName": "Santorini National Airport",
  "alias": "Santorini Airport",
  "address": "Fira, Greece",
  "citySlug": "fira",
  "cityName": "Fira",
  "zip": "",
  "country": "Greece",
  "island": "Santorini",
  "heroImage": "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=70",
  "fromPriceEur": 45,
  "bookable": "quote",
  "terminals": "Single terminal.",
  "pickupPoint": "Arrivals hall with name sign",
  "cityDriveMin": "15–25 min to Fira",
  "tollsNote": "No tolls; caldera hotels may need walking last metres.",
  "updatedAt": "2026-07-24",
  "intro": "Santorini Airport (JTR) feeds Fira, Oia, Kamari and Perissa. TransferAround quotes cover cliff-top hotels with clear drop-off notes for pedestrian zones.",
  "knowBefore": [
    {
      "title": "Meet & greet at arrivals",
      "body": "Your TransferAround driver waits at arrivals hall with name sign. Free 60-minute wait covers delays and baggage."
    },
    {
      "title": "Drive time to Fira",
      "body": "15–25 min to Fira. Real-time traffic and flight monitoring adjust pickup timing."
    },
    {
      "title": "Local road & charges",
      "body": "No tolls; caldera hotels may need walking last metres."
    },
    {
      "title": "Licensed local chauffeurs",
      "body": "Partner drivers at Santorini Airport hold valid Greek private-hire licences and know hotel access roads across Santorini."
    }
  ],
  "insights": [
    "Santorini Airport (JTR) serves Santorini. Santorini Airport (JTR) feeds Fira, Oia, Kamari and Perissa. TransferAround quotes cover cliff-top hotels with clear drop-off notes for pedestrian zones.",
    "Oia runs take longer in peak sunset traffic. Shared shuttles make multiple stops.",
    "Alternatives include scarce public buses and taxi ranks that ferry port athinios is a separate corridor. A **pre-booked TransferAround transfer** locks your fare, includes meet & greet and flight monitoring, and removes arrival stress — especially valuable with children or late landings."
  ],
  "comparison": [
    {
      "mode": "Public bus / KTEL",
      "time": "Varies",
      "cost": "EUR 2–5",
      "pros": "Cheapest",
      "cons": "Limited hours; luggage difficult"
    },
    {
      "mode": "Taxi from rank",
      "time": "15–25 min to Fira",
      "cost": "Metered / variable",
      "pros": "Direct if available",
      "cons": "Queues; price uncertainty"
    },
    {
      "mode": "TransferAround private transfer",
      "time": "15–25 min to Fira",
      "cost": "from EUR 45",
      "pros": "Fixed quote, meet & greet, 60-min wait, child seats",
      "cons": "Book in advance",
      "recommended": true
    }
  ],
  "faqs": [
    {
      "q": "Where will the TransferAround driver meet me at Santorini Airport?",
      "a": "Your driver waits at the arrivals hall with name sign holding a name sign."
    },
    {
      "q": "Are tolls and road charges included in the TransferAround price?",
      "a": "No tolls; caldera hotels may need walking last metres. Confirmed in your quote — no surprise extras at the roadside."
    },
    {
      "q": "How long does the drive from Santorini Airport to Fira usually take?",
      "a": "15–25 min to Fira to Fira."
    },
    {
      "q": "How does TransferAround compare to taxis at Santorini Airport?",
      "a": "Rank taxis may be available but often queue in peaks. TransferAround fixes the price and monitors your flight."
    },
    {
      "q": "What if my flight lands at a different terminal?",
      "a": "Single terminal. Your driver follows live flight data if gates or timings change."
    },
    {
      "q": "Do TransferAround drivers hold Greek private-hire licences?",
      "a": "Yes. Partner drivers operating at Santorini Airport hold valid Greek licences for private-hire passenger transport, are fully insured, and authorised for airport transfers."
    },
    {
      "q": "Is TransferAround available for late-night arrivals at Santorini Airport?",
      "a": "Yes. Transfers run 24/7 at Santorini Airport. Book in advance with your flight number and the driver monitors arrival in real time."
    },
    {
      "q": "How do I pay, and is tipping expected?",
      "a": "Payment is arranged at booking (card online) or confirmed on quote. Tipping is not compulsory in Greece; 5–10% is appreciated for exceptional service."
    },
    {
      "q": "Are child car seats available from Santorini Airport?",
      "a": "Yes — free on request. State ages when booking and the correct seats will be installed before pickup."
    },
    {
      "q": "How long will the driver wait if my flight is delayed?",
      "a": "Complimentary 60-minute wait at airport arrivals is included. We track your flight so the driver adjusts automatically. Longer waits may incur a small charge."
    }
  ]
},
{
  "iata": "CFU",
  "slug": "corfu-international-airport-transfers-cfu",
  "name": "Corfu Airport",
  "officialName": "Corfu Ioannis Kapodistrias Airport",
  "alias": "Corfu Airport",
  "address": "Corfu Town, Greece",
  "citySlug": "corfu-town",
  "cityName": "Corfu Town",
  "zip": "",
  "country": "Greece",
  "island": "Corfu",
  "heroImage": "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=1600&q=70",
  "fromPriceEur": 30,
  "bookable": "quote",
  "terminals": "Single terminal near town.",
  "pickupPoint": "Arrivals exit with name sign",
  "cityDriveMin": "10–15 min to Corfu Town",
  "tollsNote": "No tolls on Corfu.",
  "updatedAt": "2026-07-24",
  "intro": "Corfu Airport sits ~2 km from Corfu Town. TransferAround partners cover Paleokastritsa, Dassia, Kavos and the north coast on fixed quotes.",
  "knowBefore": [
    {
      "title": "Meet & greet at arrivals",
      "body": "Your TransferAround driver waits at arrivals exit with name sign. Free 60-minute wait covers delays and baggage."
    },
    {
      "title": "Drive time to Corfu Town",
      "body": "10–15 min to Corfu Town. Real-time traffic and flight monitoring adjust pickup timing."
    },
    {
      "title": "Local road & charges",
      "body": "No tolls on Corfu."
    },
    {
      "title": "Licensed local chauffeurs",
      "body": "Partner drivers at Corfu Airport hold valid Greek private-hire licences and know hotel access roads across Corfu."
    }
  ],
  "insights": [
    "Corfu Airport (CFU) serves Corfu. Corfu Airport sits ~2 km from Corfu Town. TransferAround partners cover Paleokastritsa, Dassia, Kavos and the north coast on fixed quotes.",
    "Extremely short city run. Resort south/north add 30–60 minutes.",
    "Alternatives include scarce public buses and taxi ranks that buses exist but miss many villa addresses. A **pre-booked TransferAround transfer** locks your fare, includes meet & greet and flight monitoring, and removes arrival stress — especially valuable with children or late landings."
  ],
  "comparison": [
    {
      "mode": "Public bus / KTEL",
      "time": "Varies",
      "cost": "EUR 2–5",
      "pros": "Cheapest",
      "cons": "Limited hours; luggage difficult"
    },
    {
      "mode": "Taxi from rank",
      "time": "10–15 min to Corfu Town",
      "cost": "Metered / variable",
      "pros": "Direct if available",
      "cons": "Queues; price uncertainty"
    },
    {
      "mode": "TransferAround private transfer",
      "time": "10–15 min to Corfu Town",
      "cost": "from EUR 30",
      "pros": "Fixed quote, meet & greet, 60-min wait, child seats",
      "cons": "Book in advance",
      "recommended": true
    }
  ],
  "faqs": [
    {
      "q": "Where will the TransferAround driver meet me at Corfu Airport?",
      "a": "Your driver waits at the arrivals exit with name sign holding a name sign."
    },
    {
      "q": "Are tolls and road charges included in the TransferAround price?",
      "a": "No tolls on Corfu. Confirmed in your quote — no surprise extras at the roadside."
    },
    {
      "q": "How long does the drive from Corfu Airport to Corfu Town usually take?",
      "a": "10–15 min to Corfu Town to Corfu Town."
    },
    {
      "q": "How does TransferAround compare to taxis at Corfu Airport?",
      "a": "Rank taxis may be available but often queue in peaks. TransferAround fixes the price and monitors your flight."
    },
    {
      "q": "What if my flight lands at a different terminal?",
      "a": "Single terminal near town. Your driver follows live flight data if gates or timings change."
    },
    {
      "q": "Do TransferAround drivers hold Greek private-hire licences?",
      "a": "Yes. Partner drivers operating at Corfu Airport hold valid Greek licences for private-hire passenger transport, are fully insured, and authorised for airport transfers."
    },
    {
      "q": "Is TransferAround available for late-night arrivals at Corfu Airport?",
      "a": "Yes. Transfers run 24/7 at Corfu Airport. Book in advance with your flight number and the driver monitors arrival in real time."
    },
    {
      "q": "How do I pay, and is tipping expected?",
      "a": "Payment is arranged at booking (card online) or confirmed on quote. Tipping is not compulsory in Greece; 5–10% is appreciated for exceptional service."
    },
    {
      "q": "Are child car seats available from Corfu Airport?",
      "a": "Yes — free on request. State ages when booking and the correct seats will be installed before pickup."
    },
    {
      "q": "How long will the driver wait if my flight is delayed?",
      "a": "Complimentary 60-minute wait at airport arrivals is included. We track your flight so the driver adjusts automatically. Longer waits may incur a small charge."
    }
  ]
},
{
  "iata": "RHO",
  "slug": "rhodes-airport-transfers-rho",
  "name": "Rhodes Airport",
  "officialName": "Rhodes Diagoras Airport",
  "alias": "Rhodes Airport",
  "address": "Rhodes Town, Greece",
  "citySlug": "rhodes-town",
  "cityName": "Rhodes Town",
  "zip": "",
  "country": "Greece",
  "island": "Rhodes",
  "heroImage": "https://images.unsplash.com/photo-1571498664957-fde285d79857?auto=format&fit=crop&w=1600&q=70",
  "fromPriceEur": 35,
  "bookable": "quote",
  "terminals": "Single terminal.",
  "pickupPoint": "Arrivals hall with name sign",
  "cityDriveMin": "20–30 min to Rhodes Town",
  "tollsNote": "No tolls on Rhodes.",
  "updatedAt": "2026-07-24",
  "intro": "Rhodes Airport (RHO) is the Dodecanese hub. TransferAround covers the medieval town, Faliraki, Lindos and west-coast resorts with fixed quotes.",
  "knowBefore": [
    {
      "title": "Meet & greet at arrivals",
      "body": "Your TransferAround driver waits at arrivals hall with name sign. Free 60-minute wait covers delays and baggage."
    },
    {
      "title": "Drive time to Rhodes Town",
      "body": "20–30 min to Rhodes Town. Real-time traffic and flight monitoring adjust pickup timing."
    },
    {
      "title": "Local road & charges",
      "body": "No tolls on Rhodes."
    },
    {
      "title": "Licensed local chauffeurs",
      "body": "Partner drivers at Rhodes Airport hold valid Greek private-hire licences and know hotel access roads across Rhodes."
    }
  ],
  "insights": [
    "Rhodes Airport (RHO) serves Rhodes. Rhodes Airport (RHO) is the Dodecanese hub. TransferAround covers the medieval town, Faliraki, Lindos and west-coast resorts with fixed quotes.",
    "Lindos is a longer scenic run. Taxi queues form on charter banks.",
    "Alternatives include scarce public buses and taxi ranks that ktel covers main resorts only. A **pre-booked TransferAround transfer** locks your fare, includes meet & greet and flight monitoring, and removes arrival stress — especially valuable with children or late landings."
  ],
  "comparison": [
    {
      "mode": "Public bus / KTEL",
      "time": "Varies",
      "cost": "EUR 2–5",
      "pros": "Cheapest",
      "cons": "Limited hours; luggage difficult"
    },
    {
      "mode": "Taxi from rank",
      "time": "20–30 min to Rhodes Town",
      "cost": "Metered / variable",
      "pros": "Direct if available",
      "cons": "Queues; price uncertainty"
    },
    {
      "mode": "TransferAround private transfer",
      "time": "20–30 min to Rhodes Town",
      "cost": "from EUR 35",
      "pros": "Fixed quote, meet & greet, 60-min wait, child seats",
      "cons": "Book in advance",
      "recommended": true
    }
  ],
  "faqs": [
    {
      "q": "Where will the TransferAround driver meet me at Rhodes Airport?",
      "a": "Your driver waits at the arrivals hall with name sign holding a name sign."
    },
    {
      "q": "Are tolls and road charges included in the TransferAround price?",
      "a": "No tolls on Rhodes. Confirmed in your quote — no surprise extras at the roadside."
    },
    {
      "q": "How long does the drive from Rhodes Airport to Rhodes Town usually take?",
      "a": "20–30 min to Rhodes Town to Rhodes Town."
    },
    {
      "q": "How does TransferAround compare to taxis at Rhodes Airport?",
      "a": "Rank taxis may be available but often queue in peaks. TransferAround fixes the price and monitors your flight."
    },
    {
      "q": "What if my flight lands at a different terminal?",
      "a": "Single terminal. Your driver follows live flight data if gates or timings change."
    },
    {
      "q": "Do TransferAround drivers hold Greek private-hire licences?",
      "a": "Yes. Partner drivers operating at Rhodes Airport hold valid Greek licences for private-hire passenger transport, are fully insured, and authorised for airport transfers."
    },
    {
      "q": "Is TransferAround available for late-night arrivals at Rhodes Airport?",
      "a": "Yes. Transfers run 24/7 at Rhodes Airport. Book in advance with your flight number and the driver monitors arrival in real time."
    },
    {
      "q": "How do I pay, and is tipping expected?",
      "a": "Payment is arranged at booking (card online) or confirmed on quote. Tipping is not compulsory in Greece; 5–10% is appreciated for exceptional service."
    },
    {
      "q": "Are child car seats available from Rhodes Airport?",
      "a": "Yes — free on request. State ages when booking and the correct seats will be installed before pickup."
    },
    {
      "q": "How long will the driver wait if my flight is delayed?",
      "a": "Complimentary 60-minute wait at airport arrivals is included. We track your flight so the driver adjusts automatically. Longer waits may incur a small charge."
    }
  ]
},
{
  "iata": "ZTH",
  "slug": "zakynthos-airport-transfers-zth",
  "name": "Zakynthos Airport",
  "officialName": "Zakynthos Dionysios Solomos Airport",
  "alias": "Zakynthos Airport",
  "address": "Zakynthos Town, Greece",
  "citySlug": "zakynthos-town",
  "cityName": "Zakynthos Town",
  "zip": "",
  "country": "Greece",
  "island": "Zakynthos",
  "heroImage": "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=70",
  "fromPriceEur": 30,
  "bookable": "quote",
  "terminals": "Single terminal.",
  "pickupPoint": "Arrivals exit with name sign",
  "cityDriveMin": "15–25 min to Zakynthos Town",
  "tollsNote": "No tolls.",
  "updatedAt": "2026-07-24",
  "intro": "Zakynthos Airport (ZTH) sits near Laganas. TransferAround quotes cover town, Tsilivi, and resort strips with flight monitoring for late charters.",
  "knowBefore": [
    {
      "title": "Meet & greet at arrivals",
      "body": "Your TransferAround driver waits at arrivals exit with name sign. Free 60-minute wait covers delays and baggage."
    },
    {
      "title": "Drive time to Zakynthos Town",
      "body": "15–25 min to Zakynthos Town. Real-time traffic and flight monitoring adjust pickup timing."
    },
    {
      "title": "Local road & charges",
      "body": "No tolls."
    },
    {
      "title": "Licensed local chauffeurs",
      "body": "Partner drivers at Zakynthos Airport hold valid Greek private-hire licences and know hotel access roads across Zakynthos."
    }
  ],
  "insights": [
    "Zakynthos Airport (ZTH) serves Zakynthos. Zakynthos Airport (ZTH) sits near Laganas. TransferAround quotes cover town, Tsilivi, and resort strips with flight monitoring for late charters.",
    "Laganas is closest. North resorts take longer.",
    "Alternatives include scarce public buses and taxi ranks that buses are infrequent overnight. A **pre-booked TransferAround transfer** locks your fare, includes meet & greet and flight monitoring, and removes arrival stress — especially valuable with children or late landings."
  ],
  "comparison": [
    {
      "mode": "Public bus / KTEL",
      "time": "Varies",
      "cost": "EUR 2–5",
      "pros": "Cheapest",
      "cons": "Limited hours; luggage difficult"
    },
    {
      "mode": "Taxi from rank",
      "time": "15–25 min to Zakynthos Town",
      "cost": "Metered / variable",
      "pros": "Direct if available",
      "cons": "Queues; price uncertainty"
    },
    {
      "mode": "TransferAround private transfer",
      "time": "15–25 min to Zakynthos Town",
      "cost": "from EUR 30",
      "pros": "Fixed quote, meet & greet, 60-min wait, child seats",
      "cons": "Book in advance",
      "recommended": true
    }
  ],
  "faqs": [
    {
      "q": "Where will the TransferAround driver meet me at Zakynthos Airport?",
      "a": "Your driver waits at the arrivals exit with name sign holding a name sign."
    },
    {
      "q": "Are tolls and road charges included in the TransferAround price?",
      "a": "No tolls. Confirmed in your quote — no surprise extras at the roadside."
    },
    {
      "q": "How long does the drive from Zakynthos Airport to Zakynthos Town usually take?",
      "a": "15–25 min to Zakynthos Town to Zakynthos Town."
    },
    {
      "q": "How does TransferAround compare to taxis at Zakynthos Airport?",
      "a": "Rank taxis may be available but often queue in peaks. TransferAround fixes the price and monitors your flight."
    },
    {
      "q": "What if my flight lands at a different terminal?",
      "a": "Single terminal. Your driver follows live flight data if gates or timings change."
    },
    {
      "q": "Do TransferAround drivers hold Greek private-hire licences?",
      "a": "Yes. Partner drivers operating at Zakynthos Airport hold valid Greek licences for private-hire passenger transport, are fully insured, and authorised for airport transfers."
    },
    {
      "q": "Is TransferAround available for late-night arrivals at Zakynthos Airport?",
      "a": "Yes. Transfers run 24/7 at Zakynthos Airport. Book in advance with your flight number and the driver monitors arrival in real time."
    },
    {
      "q": "How do I pay, and is tipping expected?",
      "a": "Payment is arranged at booking (card online) or confirmed on quote. Tipping is not compulsory in Greece; 5–10% is appreciated for exceptional service."
    },
    {
      "q": "Are child car seats available from Zakynthos Airport?",
      "a": "Yes — free on request. State ages when booking and the correct seats will be installed before pickup."
    },
    {
      "q": "How long will the driver wait if my flight is delayed?",
      "a": "Complimentary 60-minute wait at airport arrivals is included. We track your flight so the driver adjusts automatically. Longer waits may incur a small charge."
    }
  ]
},
{
  "iata": "EFL",
  "slug": "kefalonia-airport-transfers-efl",
  "name": "Kefalonia Airport",
  "officialName": "Kefalonia Airport",
  "alias": "Kefalonia Airport",
  "address": "Argostoli, Greece",
  "citySlug": "argostoli",
  "cityName": "Argostoli",
  "zip": "",
  "country": "Greece",
  "island": "Kefalonia",
  "heroImage": "https://images.unsplash.com/photo-1591019479261-1a103585c559?auto=format&fit=crop&w=1600&q=70",
  "fromPriceEur": 40,
  "bookable": "quote",
  "terminals": "Single terminal.",
  "pickupPoint": "Arrivals hall with name sign",
  "cityDriveMin": "15–25 min to Argostoli",
  "tollsNote": "No tolls; mountain roads to Skala/Lixouri.",
  "updatedAt": "2026-07-24",
  "intro": "Kefalonia Airport (EFL) is close to Argostoli. TransferAround covers Lixouri ferry connections and south-coast resorts on fixed quotes.",
  "knowBefore": [
    {
      "title": "Meet & greet at arrivals",
      "body": "Your TransferAround driver waits at arrivals hall with name sign. Free 60-minute wait covers delays and baggage."
    },
    {
      "title": "Drive time to Argostoli",
      "body": "15–25 min to Argostoli. Real-time traffic and flight monitoring adjust pickup timing."
    },
    {
      "title": "Local road & charges",
      "body": "No tolls; mountain roads to Skala/Lixouri."
    },
    {
      "title": "Licensed local chauffeurs",
      "body": "Partner drivers at Kefalonia Airport hold valid Greek private-hire licences and know hotel access roads across Kefalonia."
    }
  ],
  "insights": [
    "Kefalonia Airport (EFL) serves Kefalonia. Kefalonia Airport (EFL) is close to Argostoli. TransferAround covers Lixouri ferry connections and south-coast resorts on fixed quotes.",
    "Winding roads — allow buffer. Ferry to Lixouri is separate.",
    "Alternatives include scarce public buses and taxi ranks that taxis limited late night. A **pre-booked TransferAround transfer** locks your fare, includes meet & greet and flight monitoring, and removes arrival stress — especially valuable with children or late landings."
  ],
  "comparison": [
    {
      "mode": "Public bus / KTEL",
      "time": "Varies",
      "cost": "EUR 2–5",
      "pros": "Cheapest",
      "cons": "Limited hours; luggage difficult"
    },
    {
      "mode": "Taxi from rank",
      "time": "15–25 min to Argostoli",
      "cost": "Metered / variable",
      "pros": "Direct if available",
      "cons": "Queues; price uncertainty"
    },
    {
      "mode": "TransferAround private transfer",
      "time": "15–25 min to Argostoli",
      "cost": "from EUR 40",
      "pros": "Fixed quote, meet & greet, 60-min wait, child seats",
      "cons": "Book in advance",
      "recommended": true
    }
  ],
  "faqs": [
    {
      "q": "Where will the TransferAround driver meet me at Kefalonia Airport?",
      "a": "Your driver waits at the arrivals hall with name sign holding a name sign."
    },
    {
      "q": "Are tolls and road charges included in the TransferAround price?",
      "a": "No tolls; mountain roads to Skala/Lixouri. Confirmed in your quote — no surprise extras at the roadside."
    },
    {
      "q": "How long does the drive from Kefalonia Airport to Argostoli usually take?",
      "a": "15–25 min to Argostoli to Argostoli."
    },
    {
      "q": "How does TransferAround compare to taxis at Kefalonia Airport?",
      "a": "Rank taxis may be available but often queue in peaks. TransferAround fixes the price and monitors your flight."
    },
    {
      "q": "What if my flight lands at a different terminal?",
      "a": "Single terminal. Your driver follows live flight data if gates or timings change."
    },
    {
      "q": "Do TransferAround drivers hold Greek private-hire licences?",
      "a": "Yes. Partner drivers operating at Kefalonia Airport hold valid Greek licences for private-hire passenger transport, are fully insured, and authorised for airport transfers."
    },
    {
      "q": "Is TransferAround available for late-night arrivals at Kefalonia Airport?",
      "a": "Yes. Transfers run 24/7 at Kefalonia Airport. Book in advance with your flight number and the driver monitors arrival in real time."
    },
    {
      "q": "How do I pay, and is tipping expected?",
      "a": "Payment is arranged at booking (card online) or confirmed on quote. Tipping is not compulsory in Greece; 5–10% is appreciated for exceptional service."
    },
    {
      "q": "Are child car seats available from Kefalonia Airport?",
      "a": "Yes — free on request. State ages when booking and the correct seats will be installed before pickup."
    },
    {
      "q": "How long will the driver wait if my flight is delayed?",
      "a": "Complimentary 60-minute wait at airport arrivals is included. We track your flight so the driver adjusts automatically. Longer waits may incur a small charge."
    }
  ]
},
{
  "iata": "KGS",
  "slug": "kos-airport-transfers-kgs",
  "name": "Kos Airport",
  "officialName": "Kos Island International Airport",
  "alias": "Kos Airport",
  "address": "Kos Town, Greece",
  "citySlug": "kos-town",
  "cityName": "Kos Town",
  "zip": "",
  "country": "Greece",
  "island": "Kos",
  "heroImage": "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=70",
  "fromPriceEur": 35,
  "bookable": "quote",
  "terminals": "Single terminal.",
  "pickupPoint": "Arrivals exit with name sign",
  "cityDriveMin": "25–35 min to Kos Town",
  "tollsNote": "No tolls.",
  "updatedAt": "2026-07-24",
  "intro": "Kos Airport (KGS) is inland. TransferAround quotes cover Kos Town, Kardamena and Mastichari with meet & greet.",
  "knowBefore": [
    {
      "title": "Meet & greet at arrivals",
      "body": "Your TransferAround driver waits at arrivals exit with name sign. Free 60-minute wait covers delays and baggage."
    },
    {
      "title": "Drive time to Kos Town",
      "body": "25–35 min to Kos Town. Real-time traffic and flight monitoring adjust pickup timing."
    },
    {
      "title": "Local road & charges",
      "body": "No tolls."
    },
    {
      "title": "Licensed local chauffeurs",
      "body": "Partner drivers at Kos Airport hold valid Greek private-hire licences and know hotel access roads across Kos."
    }
  ],
  "insights": [
    "Kos Airport (KGS) serves Kos. Kos Airport (KGS) is inland. TransferAround quotes cover Kos Town, Kardamena and Mastichari with meet & greet.",
    "Town is not adjacent to the airport. Summer traffic on the main road.",
    "Alternatives include scarce public buses and taxi ranks that buses miss many hotels. A **pre-booked TransferAround transfer** locks your fare, includes meet & greet and flight monitoring, and removes arrival stress — especially valuable with children or late landings."
  ],
  "comparison": [
    {
      "mode": "Public bus / KTEL",
      "time": "Varies",
      "cost": "EUR 2–5",
      "pros": "Cheapest",
      "cons": "Limited hours; luggage difficult"
    },
    {
      "mode": "Taxi from rank",
      "time": "25–35 min to Kos Town",
      "cost": "Metered / variable",
      "pros": "Direct if available",
      "cons": "Queues; price uncertainty"
    },
    {
      "mode": "TransferAround private transfer",
      "time": "25–35 min to Kos Town",
      "cost": "from EUR 35",
      "pros": "Fixed quote, meet & greet, 60-min wait, child seats",
      "cons": "Book in advance",
      "recommended": true
    }
  ],
  "faqs": [
    {
      "q": "Where will the TransferAround driver meet me at Kos Airport?",
      "a": "Your driver waits at the arrivals exit with name sign holding a name sign."
    },
    {
      "q": "Are tolls and road charges included in the TransferAround price?",
      "a": "No tolls. Confirmed in your quote — no surprise extras at the roadside."
    },
    {
      "q": "How long does the drive from Kos Airport to Kos Town usually take?",
      "a": "25–35 min to Kos Town to Kos Town."
    },
    {
      "q": "How does TransferAround compare to taxis at Kos Airport?",
      "a": "Rank taxis may be available but often queue in peaks. TransferAround fixes the price and monitors your flight."
    },
    {
      "q": "What if my flight lands at a different terminal?",
      "a": "Single terminal. Your driver follows live flight data if gates or timings change."
    },
    {
      "q": "Do TransferAround drivers hold Greek private-hire licences?",
      "a": "Yes. Partner drivers operating at Kos Airport hold valid Greek licences for private-hire passenger transport, are fully insured, and authorised for airport transfers."
    },
    {
      "q": "Is TransferAround available for late-night arrivals at Kos Airport?",
      "a": "Yes. Transfers run 24/7 at Kos Airport. Book in advance with your flight number and the driver monitors arrival in real time."
    },
    {
      "q": "How do I pay, and is tipping expected?",
      "a": "Payment is arranged at booking (card online) or confirmed on quote. Tipping is not compulsory in Greece; 5–10% is appreciated for exceptional service."
    },
    {
      "q": "Are child car seats available from Kos Airport?",
      "a": "Yes — free on request. State ages when booking and the correct seats will be installed before pickup."
    },
    {
      "q": "How long will the driver wait if my flight is delayed?",
      "a": "Complimentary 60-minute wait at airport arrivals is included. We track your flight so the driver adjusts automatically. Longer waits may incur a small charge."
    }
  ]
},
{
  "iata": "PVK",
  "slug": "aktion-lefkada-airport-transfers-pvk",
  "name": "Aktion Lefkada Airport",
  "officialName": "Aktion National Airport",
  "alias": "Aktion Lefkada Airport",
  "address": "Lefkada Town, Greece",
  "citySlug": "lefkada",
  "cityName": "Lefkada Town",
  "zip": "",
  "country": "Greece",
  "island": "Lefkada",
  "heroImage": "https://images.unsplash.com/photo-1571498664957-fde285d79857?auto=format&fit=crop&w=1600&q=70",
  "fromPriceEur": 45,
  "bookable": "quote",
  "terminals": "Single terminal on mainland shore.",
  "pickupPoint": "Arrivals hall with name sign",
  "cityDriveMin": "30–40 min to Lefkada Town via causeway",
  "tollsNote": "Bridge/causeway — no surprise tolls in our quotes.",
  "updatedAt": "2026-07-24",
  "intro": "Aktion (PVK) serves Lefkada from the mainland. TransferAround drivers cross to Lefkada Town, Nikiana and Vassiliki on fixed quotes.",
  "knowBefore": [
    {
      "title": "Meet & greet at arrivals",
      "body": "Your TransferAround driver waits at arrivals hall with name sign. Free 60-minute wait covers delays and baggage."
    },
    {
      "title": "Drive time to Lefkada Town",
      "body": "30–40 min to Lefkada Town via causeway. Real-time traffic and flight monitoring adjust pickup timing."
    },
    {
      "title": "Local road & charges",
      "body": "Bridge/causeway — no surprise tolls in our quotes."
    },
    {
      "title": "Licensed local chauffeurs",
      "body": "Partner drivers at Aktion Lefkada Airport hold valid Greek private-hire licences and know hotel access roads across Lefkada."
    }
  ],
  "insights": [
    "Aktion Lefkada Airport (PVK) serves Lefkada. Aktion (PVK) serves Lefkada from the mainland. TransferAround drivers cross to Lefkada Town, Nikiana and Vassiliki on fixed quotes.",
    "You leave the terminal on the mainland side. Causeway traffic in peaks.",
    "Alternatives include scarce public buses and taxi ranks that ideal vs waiting for shared shuttles. A **pre-booked TransferAround transfer** locks your fare, includes meet & greet and flight monitoring, and removes arrival stress — especially valuable with children or late landings."
  ],
  "comparison": [
    {
      "mode": "Public bus / KTEL",
      "time": "Varies",
      "cost": "EUR 2–5",
      "pros": "Cheapest",
      "cons": "Limited hours; luggage difficult"
    },
    {
      "mode": "Taxi from rank",
      "time": "30–40 min to Lefkada Town via causeway",
      "cost": "Metered / variable",
      "pros": "Direct if available",
      "cons": "Queues; price uncertainty"
    },
    {
      "mode": "TransferAround private transfer",
      "time": "30–40 min to Lefkada Town via causeway",
      "cost": "from EUR 45",
      "pros": "Fixed quote, meet & greet, 60-min wait, child seats",
      "cons": "Book in advance",
      "recommended": true
    }
  ],
  "faqs": [
    {
      "q": "Where will the TransferAround driver meet me at Aktion Lefkada Airport?",
      "a": "Your driver waits at the arrivals hall with name sign holding a name sign."
    },
    {
      "q": "Are tolls and road charges included in the TransferAround price?",
      "a": "Bridge/causeway — no surprise tolls in our quotes. Confirmed in your quote — no surprise extras at the roadside."
    },
    {
      "q": "How long does the drive from Aktion Lefkada Airport to Lefkada Town usually take?",
      "a": "30–40 min to Lefkada Town via causeway to Lefkada Town."
    },
    {
      "q": "How does TransferAround compare to taxis at Aktion Lefkada Airport?",
      "a": "Rank taxis may be available but often queue in peaks. TransferAround fixes the price and monitors your flight."
    },
    {
      "q": "What if my flight lands at a different terminal?",
      "a": "Single terminal on mainland shore. Your driver follows live flight data if gates or timings change."
    },
    {
      "q": "Do TransferAround drivers hold Greek private-hire licences?",
      "a": "Yes. Partner drivers operating at Aktion Lefkada Airport hold valid Greek licences for private-hire passenger transport, are fully insured, and authorised for airport transfers."
    },
    {
      "q": "Is TransferAround available for late-night arrivals at Aktion Lefkada Airport?",
      "a": "Yes. Transfers run 24/7 at Aktion Lefkada Airport. Book in advance with your flight number and the driver monitors arrival in real time."
    },
    {
      "q": "How do I pay, and is tipping expected?",
      "a": "Payment is arranged at booking (card online) or confirmed on quote. Tipping is not compulsory in Greece; 5–10% is appreciated for exceptional service."
    },
    {
      "q": "Are child car seats available from Aktion Lefkada Airport?",
      "a": "Yes — free on request. State ages when booking and the correct seats will be installed before pickup."
    },
    {
      "q": "How long will the driver wait if my flight is delayed?",
      "a": "Complimentary 60-minute wait at airport arrivals is included. We track your flight so the driver adjusts automatically. Longer waits may incur a small charge."
    }
  ]
},
{
  "iata": "PAS",
  "slug": "paros-airport-transfers-pas",
  "name": "Paros Airport",
  "officialName": "Paros National Airport",
  "alias": "Paros Airport",
  "address": "Parikia, Greece",
  "citySlug": "parikia",
  "cityName": "Parikia",
  "zip": "",
  "country": "Greece",
  "island": "Paros",
  "heroImage": "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=70",
  "fromPriceEur": 35,
  "bookable": "quote",
  "terminals": "Small single terminal.",
  "pickupPoint": "Arrivals exit with name sign",
  "cityDriveMin": "10–15 min to Parikia",
  "tollsNote": "No tolls.",
  "updatedAt": "2026-07-24",
  "intro": "Paros Airport (PAS) is minutes from Parikia. TransferAround covers Naoussa and beach resorts with fixed quotes — better than hunting taxis after island hoppers.",
  "knowBefore": [
    {
      "title": "Meet & greet at arrivals",
      "body": "Your TransferAround driver waits at arrivals exit with name sign. Free 60-minute wait covers delays and baggage."
    },
    {
      "title": "Drive time to Parikia",
      "body": "10–15 min to Parikia. Real-time traffic and flight monitoring adjust pickup timing."
    },
    {
      "title": "Local road & charges",
      "body": "No tolls."
    },
    {
      "title": "Licensed local chauffeurs",
      "body": "Partner drivers at Paros Airport hold valid Greek private-hire licences and know hotel access roads across Paros."
    }
  ],
  "insights": [
    "Paros Airport (PAS) serves Paros. Paros Airport (PAS) is minutes from Parikia. TransferAround covers Naoussa and beach resorts with fixed quotes — better than hunting taxis after island hoppers.",
    "Tiny terminal, fast exit. Naoussa adds ~20 minutes.",
    "Alternatives include scarce public buses and taxi ranks that buses sparse evenings. A **pre-booked TransferAround transfer** locks your fare, includes meet & greet and flight monitoring, and removes arrival stress — especially valuable with children or late landings."
  ],
  "comparison": [
    {
      "mode": "Public bus / KTEL",
      "time": "Varies",
      "cost": "EUR 2–5",
      "pros": "Cheapest",
      "cons": "Limited hours; luggage difficult"
    },
    {
      "mode": "Taxi from rank",
      "time": "10–15 min to Parikia",
      "cost": "Metered / variable",
      "pros": "Direct if available",
      "cons": "Queues; price uncertainty"
    },
    {
      "mode": "TransferAround private transfer",
      "time": "10–15 min to Parikia",
      "cost": "from EUR 35",
      "pros": "Fixed quote, meet & greet, 60-min wait, child seats",
      "cons": "Book in advance",
      "recommended": true
    }
  ],
  "faqs": [
    {
      "q": "Where will the TransferAround driver meet me at Paros Airport?",
      "a": "Your driver waits at the arrivals exit with name sign holding a name sign."
    },
    {
      "q": "Are tolls and road charges included in the TransferAround price?",
      "a": "No tolls. Confirmed in your quote — no surprise extras at the roadside."
    },
    {
      "q": "How long does the drive from Paros Airport to Parikia usually take?",
      "a": "10–15 min to Parikia to Parikia."
    },
    {
      "q": "How does TransferAround compare to taxis at Paros Airport?",
      "a": "Rank taxis may be available but often queue in peaks. TransferAround fixes the price and monitors your flight."
    },
    {
      "q": "What if my flight lands at a different terminal?",
      "a": "Small single terminal. Your driver follows live flight data if gates or timings change."
    },
    {
      "q": "Do TransferAround drivers hold Greek private-hire licences?",
      "a": "Yes. Partner drivers operating at Paros Airport hold valid Greek licences for private-hire passenger transport, are fully insured, and authorised for airport transfers."
    },
    {
      "q": "Is TransferAround available for late-night arrivals at Paros Airport?",
      "a": "Yes. Transfers run 24/7 at Paros Airport. Book in advance with your flight number and the driver monitors arrival in real time."
    },
    {
      "q": "How do I pay, and is tipping expected?",
      "a": "Payment is arranged at booking (card online) or confirmed on quote. Tipping is not compulsory in Greece; 5–10% is appreciated for exceptional service."
    },
    {
      "q": "Are child car seats available from Paros Airport?",
      "a": "Yes — free on request. State ages when booking and the correct seats will be installed before pickup."
    },
    {
      "q": "How long will the driver wait if my flight is delayed?",
      "a": "Complimentary 60-minute wait at airport arrivals is included. We track your flight so the driver adjusts automatically. Longer waits may incur a small charge."
    }
  ]
},
{
  "iata": "JNX",
  "slug": "naxos-airport-transfers-jnx",
  "name": "Naxos Airport",
  "officialName": "Naxos Island National Airport",
  "alias": "Naxos Airport",
  "address": "Naxos Town (Chora), Greece",
  "citySlug": "naxos-town",
  "cityName": "Naxos Town (Chora)",
  "zip": "",
  "country": "Greece",
  "island": "Naxos",
  "heroImage": "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=70",
  "fromPriceEur": 30,
  "bookable": "quote",
  "terminals": "Small single terminal.",
  "pickupPoint": "Arrivals exit with name sign",
  "cityDriveMin": "10–15 min to Chora",
  "tollsNote": "No tolls.",
  "updatedAt": "2026-07-24",
  "intro": "Naxos Airport (JNX) sits by the west coast. TransferAround quotes cover Chora and Agia Anna with meet & greet for families and villa guests.",
  "knowBefore": [
    {
      "title": "Meet & greet at arrivals",
      "body": "Your TransferAround driver waits at arrivals exit with name sign. Free 60-minute wait covers delays and baggage."
    },
    {
      "title": "Drive time to Naxos Town (Chora)",
      "body": "10–15 min to Chora. Real-time traffic and flight monitoring adjust pickup timing."
    },
    {
      "title": "Local road & charges",
      "body": "No tolls."
    },
    {
      "title": "Licensed local chauffeurs",
      "body": "Partner drivers at Naxos Airport hold valid Greek private-hire licences and know hotel access roads across Naxos."
    }
  ],
  "insights": [
    "Naxos Airport (JNX) serves Naxos. Naxos Airport (JNX) sits by the west coast. TransferAround quotes cover Chora and Agia Anna with meet & greet for families and villa guests.",
    "Short runs to Chora. South beaches take longer.",
    "Alternatives include scarce public buses and taxi ranks that limited late taxis. A **pre-booked TransferAround transfer** locks your fare, includes meet & greet and flight monitoring, and removes arrival stress — especially valuable with children or late landings."
  ],
  "comparison": [
    {
      "mode": "Public bus / KTEL",
      "time": "Varies",
      "cost": "EUR 2–5",
      "pros": "Cheapest",
      "cons": "Limited hours; luggage difficult"
    },
    {
      "mode": "Taxi from rank",
      "time": "10–15 min to Chora",
      "cost": "Metered / variable",
      "pros": "Direct if available",
      "cons": "Queues; price uncertainty"
    },
    {
      "mode": "TransferAround private transfer",
      "time": "10–15 min to Chora",
      "cost": "from EUR 30",
      "pros": "Fixed quote, meet & greet, 60-min wait, child seats",
      "cons": "Book in advance",
      "recommended": true
    }
  ],
  "faqs": [
    {
      "q": "Where will the TransferAround driver meet me at Naxos Airport?",
      "a": "Your driver waits at the arrivals exit with name sign holding a name sign."
    },
    {
      "q": "Are tolls and road charges included in the TransferAround price?",
      "a": "No tolls. Confirmed in your quote — no surprise extras at the roadside."
    },
    {
      "q": "How long does the drive from Naxos Airport to Naxos Town (Chora) usually take?",
      "a": "10–15 min to Chora to Naxos Town (Chora)."
    },
    {
      "q": "How does TransferAround compare to taxis at Naxos Airport?",
      "a": "Rank taxis may be available but often queue in peaks. TransferAround fixes the price and monitors your flight."
    },
    {
      "q": "What if my flight lands at a different terminal?",
      "a": "Small single terminal. Your driver follows live flight data if gates or timings change."
    },
    {
      "q": "Do TransferAround drivers hold Greek private-hire licences?",
      "a": "Yes. Partner drivers operating at Naxos Airport hold valid Greek licences for private-hire passenger transport, are fully insured, and authorised for airport transfers."
    },
    {
      "q": "Is TransferAround available for late-night arrivals at Naxos Airport?",
      "a": "Yes. Transfers run 24/7 at Naxos Airport. Book in advance with your flight number and the driver monitors arrival in real time."
    },
    {
      "q": "How do I pay, and is tipping expected?",
      "a": "Payment is arranged at booking (card online) or confirmed on quote. Tipping is not compulsory in Greece; 5–10% is appreciated for exceptional service."
    },
    {
      "q": "Are child car seats available from Naxos Airport?",
      "a": "Yes — free on request. State ages when booking and the correct seats will be installed before pickup."
    },
    {
      "q": "How long will the driver wait if my flight is delayed?",
      "a": "Complimentary 60-minute wait at airport arrivals is included. We track your flight so the driver adjusts automatically. Longer waits may incur a small charge."
    }
  ]
},
{
  "iata": "MLO",
  "slug": "milos-airport-transfers-mlo",
  "name": "Milos Airport",
  "officialName": "Milos National Airport",
  "alias": "Milos Airport",
  "address": "Adamas, Greece",
  "citySlug": "adamas",
  "cityName": "Adamas",
  "zip": "",
  "country": "Greece",
  "island": "Milos",
  "heroImage": "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=70",
  "fromPriceEur": 35,
  "bookable": "quote",
  "terminals": "Small single terminal.",
  "pickupPoint": "Arrivals exit with name sign",
  "cityDriveMin": "15–20 min to Adamas",
  "tollsNote": "No tolls; village roads to Plaka.",
  "updatedAt": "2026-07-24",
  "intro": "Milos Airport (MLO) feeds Adamas port and Plaka. TransferAround fixed quotes beat waiting for scarce taxis after afternoon arrivals.",
  "knowBefore": [
    {
      "title": "Meet & greet at arrivals",
      "body": "Your TransferAround driver waits at arrivals exit with name sign. Free 60-minute wait covers delays and baggage."
    },
    {
      "title": "Drive time to Adamas",
      "body": "15–20 min to Adamas. Real-time traffic and flight monitoring adjust pickup timing."
    },
    {
      "title": "Local road & charges",
      "body": "No tolls; village roads to Plaka."
    },
    {
      "title": "Licensed local chauffeurs",
      "body": "Partner drivers at Milos Airport hold valid Greek private-hire licences and know hotel access roads across Milos."
    }
  ],
  "insights": [
    "Milos Airport (MLO) serves Milos. Milos Airport (MLO) feeds Adamas port and Plaka. TransferAround fixed quotes beat waiting for scarce taxis after afternoon arrivals.",
    "Compact island network. Plaka hill roads are narrow.",
    "Alternatives include scarce public buses and taxi ranks that ferry port connections available. A **pre-booked TransferAround transfer** locks your fare, includes meet & greet and flight monitoring, and removes arrival stress — especially valuable with children or late landings."
  ],
  "comparison": [
    {
      "mode": "Public bus / KTEL",
      "time": "Varies",
      "cost": "EUR 2–5",
      "pros": "Cheapest",
      "cons": "Limited hours; luggage difficult"
    },
    {
      "mode": "Taxi from rank",
      "time": "15–20 min to Adamas",
      "cost": "Metered / variable",
      "pros": "Direct if available",
      "cons": "Queues; price uncertainty"
    },
    {
      "mode": "TransferAround private transfer",
      "time": "15–20 min to Adamas",
      "cost": "from EUR 35",
      "pros": "Fixed quote, meet & greet, 60-min wait, child seats",
      "cons": "Book in advance",
      "recommended": true
    }
  ],
  "faqs": [
    {
      "q": "Where will the TransferAround driver meet me at Milos Airport?",
      "a": "Your driver waits at the arrivals exit with name sign holding a name sign."
    },
    {
      "q": "Are tolls and road charges included in the TransferAround price?",
      "a": "No tolls; village roads to Plaka. Confirmed in your quote — no surprise extras at the roadside."
    },
    {
      "q": "How long does the drive from Milos Airport to Adamas usually take?",
      "a": "15–20 min to Adamas to Adamas."
    },
    {
      "q": "How does TransferAround compare to taxis at Milos Airport?",
      "a": "Rank taxis may be available but often queue in peaks. TransferAround fixes the price and monitors your flight."
    },
    {
      "q": "What if my flight lands at a different terminal?",
      "a": "Small single terminal. Your driver follows live flight data if gates or timings change."
    },
    {
      "q": "Do TransferAround drivers hold Greek private-hire licences?",
      "a": "Yes. Partner drivers operating at Milos Airport hold valid Greek licences for private-hire passenger transport, are fully insured, and authorised for airport transfers."
    },
    {
      "q": "Is TransferAround available for late-night arrivals at Milos Airport?",
      "a": "Yes. Transfers run 24/7 at Milos Airport. Book in advance with your flight number and the driver monitors arrival in real time."
    },
    {
      "q": "How do I pay, and is tipping expected?",
      "a": "Payment is arranged at booking (card online) or confirmed on quote. Tipping is not compulsory in Greece; 5–10% is appreciated for exceptional service."
    },
    {
      "q": "Are child car seats available from Milos Airport?",
      "a": "Yes — free on request. State ages when booking and the correct seats will be installed before pickup."
    },
    {
      "q": "How long will the driver wait if my flight is delayed?",
      "a": "Complimentary 60-minute wait at airport arrivals is included. We track your flight so the driver adjusts automatically. Longer waits may incur a small charge."
    }
  ]
},
{
  "iata": "MJT",
  "slug": "mytilene-airport-transfers-mjt",
  "name": "Mytilene Airport",
  "officialName": "Mytilene International Airport",
  "alias": "Mytilene Airport",
  "address": "Mytilene, Greece",
  "citySlug": "mytilene",
  "cityName": "Mytilene",
  "zip": "",
  "country": "Greece",
  "island": "Lesbos",
  "heroImage": "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=1600&q=70",
  "fromPriceEur": 35,
  "bookable": "quote",
  "terminals": "Single terminal.",
  "pickupPoint": "Arrivals hall with name sign",
  "cityDriveMin": "10–15 min to Mytilene",
  "tollsNote": "No tolls; longer runs to Molyvos.",
  "updatedAt": "2026-07-24",
  "intro": "Mytilene Airport (MJT) is close to the capital of Lesbos. TransferAround quotes cover Mytilene and north-coast Molyvos.",
  "knowBefore": [
    {
      "title": "Meet & greet at arrivals",
      "body": "Your TransferAround driver waits at arrivals hall with name sign. Free 60-minute wait covers delays and baggage."
    },
    {
      "title": "Drive time to Mytilene",
      "body": "10–15 min to Mytilene. Real-time traffic and flight monitoring adjust pickup timing."
    },
    {
      "title": "Local road & charges",
      "body": "No tolls; longer runs to Molyvos."
    },
    {
      "title": "Licensed local chauffeurs",
      "body": "Partner drivers at Mytilene Airport hold valid Greek private-hire licences and know hotel access roads across Lesbos."
    }
  ],
  "insights": [
    "Mytilene Airport (MJT) serves Lesbos. Mytilene Airport (MJT) is close to the capital of Lesbos. TransferAround quotes cover Mytilene and north-coast Molyvos.",
    "Short city transfer. Molyvos is a scenic longer drive.",
    "Alternatives include scarce public buses and taxi ranks that buses limited for luggage. A **pre-booked TransferAround transfer** locks your fare, includes meet & greet and flight monitoring, and removes arrival stress — especially valuable with children or late landings."
  ],
  "comparison": [
    {
      "mode": "Public bus / KTEL",
      "time": "Varies",
      "cost": "EUR 2–5",
      "pros": "Cheapest",
      "cons": "Limited hours; luggage difficult"
    },
    {
      "mode": "Taxi from rank",
      "time": "10–15 min to Mytilene",
      "cost": "Metered / variable",
      "pros": "Direct if available",
      "cons": "Queues; price uncertainty"
    },
    {
      "mode": "TransferAround private transfer",
      "time": "10–15 min to Mytilene",
      "cost": "from EUR 35",
      "pros": "Fixed quote, meet & greet, 60-min wait, child seats",
      "cons": "Book in advance",
      "recommended": true
    }
  ],
  "faqs": [
    {
      "q": "Where will the TransferAround driver meet me at Mytilene Airport?",
      "a": "Your driver waits at the arrivals hall with name sign holding a name sign."
    },
    {
      "q": "Are tolls and road charges included in the TransferAround price?",
      "a": "No tolls; longer runs to Molyvos. Confirmed in your quote — no surprise extras at the roadside."
    },
    {
      "q": "How long does the drive from Mytilene Airport to Mytilene usually take?",
      "a": "10–15 min to Mytilene to Mytilene."
    },
    {
      "q": "How does TransferAround compare to taxis at Mytilene Airport?",
      "a": "Rank taxis may be available but often queue in peaks. TransferAround fixes the price and monitors your flight."
    },
    {
      "q": "What if my flight lands at a different terminal?",
      "a": "Single terminal. Your driver follows live flight data if gates or timings change."
    },
    {
      "q": "Do TransferAround drivers hold Greek private-hire licences?",
      "a": "Yes. Partner drivers operating at Mytilene Airport hold valid Greek licences for private-hire passenger transport, are fully insured, and authorised for airport transfers."
    },
    {
      "q": "Is TransferAround available for late-night arrivals at Mytilene Airport?",
      "a": "Yes. Transfers run 24/7 at Mytilene Airport. Book in advance with your flight number and the driver monitors arrival in real time."
    },
    {
      "q": "How do I pay, and is tipping expected?",
      "a": "Payment is arranged at booking (card online) or confirmed on quote. Tipping is not compulsory in Greece; 5–10% is appreciated for exceptional service."
    },
    {
      "q": "Are child car seats available from Mytilene Airport?",
      "a": "Yes — free on request. State ages when booking and the correct seats will be installed before pickup."
    },
    {
      "q": "How long will the driver wait if my flight is delayed?",
      "a": "Complimentary 60-minute wait at airport arrivals is included. We track your flight so the driver adjusts automatically. Longer waits may incur a small charge."
    }
  ]
},
{
  "iata": "JSH",
  "slug": "sitia-airport-transfers-jsh",
  "name": "Sitia Airport",
  "officialName": "Sitia Public Airport",
  "alias": "Sitia Airport",
  "address": "Sitia, Greece",
  "citySlug": "sitia",
  "cityName": "Sitia",
  "zip": "",
  "country": "Greece",
  "island": "Crete",
  "heroImage": "https://images.unsplash.com/photo-1571498664957-fde285d79857?auto=format&fit=crop&w=1600&q=70",
  "fromPriceEur": 40,
  "bookable": "quote",
  "terminals": "Small single terminal.",
  "pickupPoint": "Arrivals exit with name sign",
  "cityDriveMin": "10–15 min to Sitia town",
  "tollsNote": "No tolls on east Crete.",
  "updatedAt": "2026-07-24",
  "intro": "Sitia Airport (JSH) serves east Crete. TransferAround offers instant Crete pricing where catalogued and quotes for villa drop-offs toward Vai and the southeast coast.",
  "knowBefore": [
    {
      "title": "Meet & greet at arrivals",
      "body": "Your TransferAround driver waits at arrivals exit with name sign. Free 60-minute wait covers delays and baggage."
    },
    {
      "title": "Drive time to Sitia",
      "body": "10–15 min to Sitia town. Real-time traffic and flight monitoring adjust pickup timing."
    },
    {
      "title": "Local road & charges",
      "body": "No tolls on east Crete."
    },
    {
      "title": "Licensed local chauffeurs",
      "body": "Partner drivers at Sitia Airport hold valid Greek private-hire licences and know hotel access roads across Crete."
    }
  ],
  "insights": [
    "Sitia Airport (JSH) serves Crete. Sitia Airport (JSH) serves east Crete. TransferAround offers instant Crete pricing where catalogued and quotes for villa drop-offs toward Vai and the southeast coast.",
    "Quiet alternative to HER for east resorts. Fewer flights — book drivers early.",
    "Alternatives include scarce public buses and taxi ranks that links toward ierapetra available. A **pre-booked TransferAround transfer** locks your fare, includes meet & greet and flight monitoring, and removes arrival stress — especially valuable with children or late landings."
  ],
  "comparison": [
    {
      "mode": "Public bus / KTEL",
      "time": "Varies",
      "cost": "EUR 2–5",
      "pros": "Cheapest",
      "cons": "Limited hours; luggage difficult"
    },
    {
      "mode": "Taxi from rank",
      "time": "10–15 min to Sitia town",
      "cost": "Metered / variable",
      "pros": "Direct if available",
      "cons": "Queues; price uncertainty"
    },
    {
      "mode": "TransferAround private transfer",
      "time": "10–15 min to Sitia town",
      "cost": "from EUR 40",
      "pros": "Fixed quote, meet & greet, 60-min wait, child seats",
      "cons": "Book in advance",
      "recommended": true
    }
  ],
  "faqs": [
    {
      "q": "Where will the TransferAround driver meet me at Sitia Airport?",
      "a": "Your driver waits at the arrivals exit with name sign holding a name sign."
    },
    {
      "q": "Are tolls and road charges included in the TransferAround price?",
      "a": "No tolls on east Crete. Confirmed in your quote — no surprise extras at the roadside."
    },
    {
      "q": "How long does the drive from Sitia Airport to Sitia usually take?",
      "a": "10–15 min to Sitia town to Sitia."
    },
    {
      "q": "How does TransferAround compare to taxis at Sitia Airport?",
      "a": "Rank taxis may be available but often queue in peaks. TransferAround fixes the price and monitors your flight."
    },
    {
      "q": "What if my flight lands at a different terminal?",
      "a": "Small single terminal. Your driver follows live flight data if gates or timings change."
    },
    {
      "q": "Do TransferAround drivers hold Greek private-hire licences?",
      "a": "Yes. Partner drivers operating at Sitia Airport hold valid Greek licences for private-hire passenger transport, are fully insured, and authorised for airport transfers."
    },
    {
      "q": "Is TransferAround available for late-night arrivals at Sitia Airport?",
      "a": "Yes. Transfers run 24/7 at Sitia Airport. Book in advance with your flight number and the driver monitors arrival in real time."
    },
    {
      "q": "How do I pay, and is tipping expected?",
      "a": "Payment is arranged at booking (card online) or confirmed on quote. Tipping is not compulsory in Greece; 5–10% is appreciated for exceptional service."
    },
    {
      "q": "Are child car seats available from Sitia Airport?",
      "a": "Yes — free on request. State ages when booking and the correct seats will be installed before pickup."
    },
    {
      "q": "How long will the driver wait if my flight is delayed?",
      "a": "Complimentary 60-minute wait at airport arrivals is included. We track your flight so the driver adjusts automatically. Longer waits may incur a small charge."
    }
  ]
},
{
  "iata": "KLX",
  "slug": "kalamata-international-airport-transfers-klx",
  "name": "Kalamata International Airport",
  "officialName": "Kalamata-Captain Vassilis Constantakopoulos International Airport",
  "alias": "Kalamata International Airport",
  "address": "Kalamata, Greece",
  "citySlug": "kalamata",
  "cityName": "Kalamata",
  "zip": "",
  "country": "Greece",
  "region": "Peloponnese",
  "heroImage": "https://images.unsplash.com/photo-1591019479261-1a103585c559?auto=format&fit=crop&w=1600&q=70",
  "fromPriceEur": 35,
  "bookable": "quote",
  "terminals": "Single modern terminal.",
  "pickupPoint": "Arrivals baggage-hall exit with name sign",
  "cityDriveMin": "15–25 min via A7 to city centre",
  "tollsNote": "A7 Moreas Motorway tolls included in fixed quotes.",
  "updatedAt": "2026-07-24",
  "intro": "Kalamata International Airport (KLX) is the Peloponnese charter gateway. TransferAround partners include A7 tolls in your fixed quote and meet you at the baggage-hall exit.",
  "knowBefore": [
    {
      "title": "Meet & greet at arrivals",
      "body": "Your TransferAround driver waits at arrivals baggage-hall exit with name sign. Free 60-minute wait covers delays and baggage."
    },
    {
      "title": "Drive time to Kalamata",
      "body": "15–25 min via A7 to city centre. Real-time traffic and flight monitoring adjust pickup timing."
    },
    {
      "title": "Local road & charges",
      "body": "A7 Moreas Motorway tolls included in fixed quotes."
    },
    {
      "title": "Licensed local chauffeurs",
      "body": "Partner drivers at Kalamata International Airport hold valid Greek private-hire licences and know hotel access roads across Peloponnese."
    }
  ],
  "insights": [
    "Kalamata International Airport (KLX) serves Peloponnese. Kalamata International Airport (KLX) is the Peloponnese charter gateway. TransferAround partners include A7 tolls in your fixed quote and meet you at the baggage-hall exit.",
    "A7 is the primary corridor. Peak weekday afternoons add time.",
    "Alternatives include scarce public buses and taxi ranks that ktel messinias is limited for arrivals. A **pre-booked TransferAround transfer** locks your fare, includes meet & greet and flight monitoring, and removes arrival stress — especially valuable with children or late landings."
  ],
  "comparison": [
    {
      "mode": "Public bus / KTEL",
      "time": "Varies",
      "cost": "EUR 2–5",
      "pros": "Cheapest",
      "cons": "Limited hours; luggage difficult"
    },
    {
      "mode": "Taxi from rank",
      "time": "15–25 min via A7 to city centre",
      "cost": "Metered / variable",
      "pros": "Direct if available",
      "cons": "Queues; price uncertainty"
    },
    {
      "mode": "TransferAround private transfer",
      "time": "15–25 min via A7 to city centre",
      "cost": "from EUR 35",
      "pros": "Fixed quote, meet & greet, 60-min wait, child seats",
      "cons": "Book in advance",
      "recommended": true
    }
  ],
  "faqs": [
    {
      "q": "Where will the TransferAround driver meet me at Kalamata International Airport?",
      "a": "Your driver waits at the arrivals baggage-hall exit with name sign holding a name sign."
    },
    {
      "q": "Are tolls and road charges included in the TransferAround price?",
      "a": "A7 Moreas Motorway tolls included in fixed quotes. Confirmed in your quote — no surprise extras at the roadside."
    },
    {
      "q": "How long does the drive from Kalamata International Airport to Kalamata usually take?",
      "a": "15–25 min via A7 to city centre to Kalamata."
    },
    {
      "q": "How does TransferAround compare to taxis at Kalamata International Airport?",
      "a": "Rank taxis may be available but often queue in peaks. TransferAround fixes the price and monitors your flight."
    },
    {
      "q": "What if my flight lands at a different terminal?",
      "a": "Single modern terminal. Your driver follows live flight data if gates or timings change."
    },
    {
      "q": "Do TransferAround drivers hold Greek private-hire licences?",
      "a": "Yes. Partner drivers operating at Kalamata International Airport hold valid Greek licences for private-hire passenger transport, are fully insured, and authorised for airport transfers."
    },
    {
      "q": "Is TransferAround available for late-night arrivals at Kalamata International Airport?",
      "a": "Yes. Transfers run 24/7 at Kalamata International Airport. Book in advance with your flight number and the driver monitors arrival in real time."
    },
    {
      "q": "How do I pay, and is tipping expected?",
      "a": "Payment is arranged at booking (card online) or confirmed on quote. Tipping is not compulsory in Greece; 5–10% is appreciated for exceptional service."
    },
    {
      "q": "Are child car seats available from Kalamata International Airport?",
      "a": "Yes — free on request. State ages when booking and the correct seats will be installed before pickup."
    },
    {
      "q": "How long will the driver wait if my flight is delayed?",
      "a": "Complimentary 60-minute wait at airport arrivals is included. We track your flight so the driver adjusts automatically. Longer waits may incur a small charge."
    }
  ]
},
];

export function getAirport(slug: string): AirportData | undefined {
  return AIRPORTS.find((a) => a.slug === slug || a.iata.toLowerCase() === slug.toLowerCase());
}

export function getAirportByIata(iata: string): AirportData | undefined {
  return AIRPORTS.find((a) => a.iata.toUpperCase() === iata.toUpperCase());
}

export function listGreekAirports(): AirportData[] {
  return AIRPORTS;
}
