export type AirportRouteTip = { title: string; body: string };
export type AirportRouteFaq = { q: string; a: string };

export type AirportRouteData = {
  airportSlug: string;
  routeSlug: string;
  toSlug: string;
  toName: string;
  fromName: string;
  distanceKm: number;
  durationMin: number;
  basePriceEur: number;
  bookable: "instant" | "quote";
  legacyRouteSlug?: string;
  tips: AirportRouteTip[];
  body: string;
  faqs: AirportRouteFaq[];
};

export const AIRPORT_ROUTES: AirportRouteData[] = [
  {
    airportSlug: "crete-heraklion-airport-transfers-her",
    routeSlug: "transfer-from-heraklion-airport-to-elounda",
    toSlug: "elounda",
    toName: "Elounda",
    fromName: "Heraklion Airport",
    distanceKm: 71,
    durationMin: 75,
    basePriceEur: 85,
    bookable: "instant",
    legacyRouteSlug: "heraklion-airport-to-elounda",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Heraklion Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "71 km · about 75 minutes",
        body: "Typical door-to-door time from Heraklion Airport to Elounda under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Elounda. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Heraklion Airport** to **Elounda** covers approximately 71 km in about 75 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Heraklion Airport to Elounda?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Heraklion Airport to Elounda?",
        a: "Typically about 75 minutes for 71 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "crete-heraklion-airport-transfers-her",
    routeSlug: "transfer-from-heraklion-airport-to-agios-nikolaos",
    toSlug: "agios-nikolaos",
    toName: "Agios Nikolaos",
    fromName: "Heraklion Airport",
    distanceKm: 65,
    durationMin: 65,
    basePriceEur: 75,
    bookable: "instant",
    legacyRouteSlug: "heraklion-airport-to-agios-nikolaos",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Heraklion Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "65 km · about 65 minutes",
        body: "Typical door-to-door time from Heraklion Airport to Agios Nikolaos under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Agios Nikolaos. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Heraklion Airport** to **Agios Nikolaos** covers approximately 65 km in about 65 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Heraklion Airport to Agios Nikolaos?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Heraklion Airport to Agios Nikolaos?",
        a: "Typically about 65 minutes for 65 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "crete-heraklion-airport-transfers-her",
    routeSlug: "transfer-from-heraklion-airport-to-hersonissos",
    toSlug: "hersonissos",
    toName: "Hersonissos",
    fromName: "Heraklion Airport",
    distanceKm: 26,
    durationMin: 30,
    basePriceEur: 42,
    bookable: "instant",
    legacyRouteSlug: "heraklion-airport-to-hersonissos",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Heraklion Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "26 km · about 30 minutes",
        body: "Typical door-to-door time from Heraklion Airport to Hersonissos under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Hersonissos. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Heraklion Airport** to **Hersonissos** covers approximately 26 km in about 30 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Heraklion Airport to Hersonissos?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Heraklion Airport to Hersonissos?",
        a: "Typically about 30 minutes for 26 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "crete-heraklion-airport-transfers-her",
    routeSlug: "transfer-from-heraklion-airport-to-malia",
    toSlug: "malia",
    toName: "Malia",
    fromName: "Heraklion Airport",
    distanceKm: 34,
    durationMin: 35,
    basePriceEur: 48,
    bookable: "instant",
    legacyRouteSlug: "heraklion-airport-to-malia",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Heraklion Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "34 km · about 35 minutes",
        body: "Typical door-to-door time from Heraklion Airport to Malia under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Malia. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Heraklion Airport** to **Malia** covers approximately 34 km in about 35 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Heraklion Airport to Malia?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Heraklion Airport to Malia?",
        a: "Typically about 35 minutes for 34 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "crete-heraklion-airport-transfers-her",
    routeSlug: "transfer-from-heraklion-airport-to-stalis",
    toSlug: "stalis",
    toName: "Stalis",
    fromName: "Heraklion Airport",
    distanceKm: 30,
    durationMin: 32,
    basePriceEur: 45,
    bookable: "instant",
    legacyRouteSlug: "heraklion-airport-to-stalis",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Heraklion Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "30 km · about 32 minutes",
        body: "Typical door-to-door time from Heraklion Airport to Stalis under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Stalis. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Heraklion Airport** to **Stalis** covers approximately 30 km in about 32 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Heraklion Airport to Stalis?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Heraklion Airport to Stalis?",
        a: "Typically about 32 minutes for 30 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "crete-heraklion-airport-transfers-her",
    routeSlug: "transfer-from-heraklion-airport-to-rethymno",
    toSlug: "rethymno",
    toName: "Rethymno",
    fromName: "Heraklion Airport",
    distanceKm: 80,
    durationMin: 75,
    basePriceEur: 95,
    bookable: "instant",
    legacyRouteSlug: "heraklion-airport-to-rethymno",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Heraklion Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "80 km · about 75 minutes",
        body: "Typical door-to-door time from Heraklion Airport to Rethymno under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Rethymno. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Heraklion Airport** to **Rethymno** covers approximately 80 km in about 75 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Heraklion Airport to Rethymno?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Heraklion Airport to Rethymno?",
        a: "Typically about 75 minutes for 80 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "crete-heraklion-airport-transfers-her",
    routeSlug: "transfer-from-heraklion-airport-to-chania",
    toSlug: "chania",
    toName: "Chania",
    fromName: "Heraklion Airport",
    distanceKm: 140,
    durationMin: 130,
    basePriceEur: 165,
    bookable: "instant",
    legacyRouteSlug: "heraklion-airport-to-chania",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Heraklion Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "140 km · about 130 minutes",
        body: "Typical door-to-door time from Heraklion Airport to Chania under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Chania. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Heraklion Airport** to **Chania** covers approximately 140 km in about 130 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Heraklion Airport to Chania?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Heraklion Airport to Chania?",
        a: "Typically about 130 minutes for 140 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "crete-heraklion-airport-transfers-her",
    routeSlug: "transfer-from-heraklion-airport-to-matala",
    toSlug: "matala",
    toName: "Matala",
    fromName: "Heraklion Airport",
    distanceKm: 75,
    durationMin: 90,
    basePriceEur: 105,
    bookable: "instant",
    legacyRouteSlug: "heraklion-airport-to-matala",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Heraklion Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "75 km · about 90 minutes",
        body: "Typical door-to-door time from Heraklion Airport to Matala under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Matala. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Heraklion Airport** to **Matala** covers approximately 75 km in about 90 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Heraklion Airport to Matala?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Heraklion Airport to Matala?",
        a: "Typically about 90 minutes for 75 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "crete-heraklion-airport-transfers-her",
    routeSlug: "transfer-from-heraklion-airport-to-bali",
    toSlug: "bali",
    toName: "Bali",
    fromName: "Heraklion Airport",
    distanceKm: 45,
    durationMin: 45,
    basePriceEur: 62,
    bookable: "instant",
    legacyRouteSlug: "heraklion-airport-to-bali",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Heraklion Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "45 km · about 45 minutes",
        body: "Typical door-to-door time from Heraklion Airport to Bali under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Bali. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Heraklion Airport** to **Bali** covers approximately 45 km in about 45 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Heraklion Airport to Bali?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Heraklion Airport to Bali?",
        a: "Typically about 45 minutes for 45 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "crete-heraklion-airport-transfers-her",
    routeSlug: "transfer-from-heraklion-airport-to-anissaras",
    toSlug: "anissaras",
    toName: "Anissaras",
    fromName: "Heraklion Airport",
    distanceKm: 24,
    durationMin: 28,
    basePriceEur: 40,
    bookable: "instant",
    legacyRouteSlug: "heraklion-airport-to-anissaras",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Heraklion Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "24 km · about 28 minutes",
        body: "Typical door-to-door time from Heraklion Airport to Anissaras under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Anissaras. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Heraklion Airport** to **Anissaras** covers approximately 24 km in about 28 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Heraklion Airport to Anissaras?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Heraklion Airport to Anissaras?",
        a: "Typically about 28 minutes for 24 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "crete-heraklion-airport-transfers-her",
    routeSlug: "transfer-from-heraklion-airport-to-analipsi",
    toSlug: "analipsi",
    toName: "Analipsi",
    fromName: "Heraklion Airport",
    distanceKm: 22,
    durationMin: 26,
    basePriceEur: 38,
    bookable: "instant",
    legacyRouteSlug: "heraklion-airport-to-analipsi",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Heraklion Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "22 km · about 26 minutes",
        body: "Typical door-to-door time from Heraklion Airport to Analipsi under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Analipsi. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Heraklion Airport** to **Analipsi** covers approximately 22 km in about 26 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Heraklion Airport to Analipsi?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Heraklion Airport to Analipsi?",
        a: "Typically about 26 minutes for 22 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "crete-heraklion-airport-transfers-her",
    routeSlug: "transfer-from-heraklion-airport-to-ierapetra",
    toSlug: "ierapetra",
    toName: "Ierapetra",
    fromName: "Heraklion Airport",
    distanceKm: 105,
    durationMin: 100,
    basePriceEur: 120,
    bookable: "instant",
    legacyRouteSlug: "heraklion-airport-to-ierapetra",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Heraklion Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "105 km · about 100 minutes",
        body: "Typical door-to-door time from Heraklion Airport to Ierapetra under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Ierapetra. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Heraklion Airport** to **Ierapetra** covers approximately 105 km in about 100 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Heraklion Airport to Ierapetra?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Heraklion Airport to Ierapetra?",
        a: "Typically about 100 minutes for 105 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "crete-heraklion-airport-transfers-her",
    routeSlug: "transfer-from-heraklion-airport-to-heraklion-city-center",
    toSlug: "heraklion-city-center",
    toName: "Heraklion City Center",
    fromName: "Heraklion Airport",
    distanceKm: 6,
    durationMin: 15,
    basePriceEur: 40,
    bookable: "instant",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Heraklion Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "6 km · about 15 minutes",
        body: "Typical door-to-door time from Heraklion Airport to Heraklion City Center under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Heraklion City Center. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Heraklion Airport** to **Heraklion City Center** covers approximately 6 km in about 15 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Heraklion Airport to Heraklion City Center?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Heraklion Airport to Heraklion City Center?",
        a: "Typically about 15 minutes for 6 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "chania-international-airport-transfers-chq",
    routeSlug: "transfer-from-chania-airport-to-chania-old-town",
    toSlug: "chania-old-town",
    toName: "Chania Old Town",
    fromName: "Chania Airport",
    distanceKm: 14,
    durationMin: 25,
    basePriceEur: 35,
    bookable: "instant",
    legacyRouteSlug: "chania-airport-to-chania-old-town",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Chania Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "14 km · about 25 minutes",
        body: "Typical door-to-door time from Chania Airport to Chania Old Town under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Chania Old Town. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Chania Airport** to **Chania Old Town** covers approximately 14 km in about 25 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Chania Airport to Chania Old Town?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Chania Airport to Chania Old Town?",
        a: "Typically about 25 minutes for 14 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "chania-international-airport-transfers-chq",
    routeSlug: "transfer-from-chania-airport-to-rethymno",
    toSlug: "rethymno",
    toName: "Rethymno",
    fromName: "Chania Airport",
    distanceKm: 70,
    durationMin: 70,
    basePriceEur: 90,
    bookable: "instant",
    legacyRouteSlug: "chania-airport-to-rethymno",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Chania Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "70 km · about 70 minutes",
        body: "Typical door-to-door time from Chania Airport to Rethymno under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Rethymno. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Chania Airport** to **Rethymno** covers approximately 70 km in about 70 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Chania Airport to Rethymno?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Chania Airport to Rethymno?",
        a: "Typically about 70 minutes for 70 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "chania-international-airport-transfers-chq",
    routeSlug: "transfer-from-chania-airport-to-kissamos",
    toSlug: "kissamos",
    toName: "Kissamos",
    fromName: "Chania Airport",
    distanceKm: 40,
    durationMin: 45,
    basePriceEur: 55,
    bookable: "instant",
    legacyRouteSlug: "chania-airport-to-kissamos",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Chania Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "40 km · about 45 minutes",
        body: "Typical door-to-door time from Chania Airport to Kissamos under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Kissamos. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Chania Airport** to **Kissamos** covers approximately 40 km in about 45 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Chania Airport to Kissamos?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Chania Airport to Kissamos?",
        a: "Typically about 45 minutes for 40 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "chania-international-airport-transfers-chq",
    routeSlug: "transfer-from-chania-airport-to-platanias",
    toSlug: "platanias",
    toName: "Platanias",
    fromName: "Chania Airport",
    distanceKm: 18,
    durationMin: 25,
    basePriceEur: 38,
    bookable: "instant",
    legacyRouteSlug: "chania-airport-to-platanias",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Chania Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "18 km · about 25 minutes",
        body: "Typical door-to-door time from Chania Airport to Platanias under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Platanias. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Chania Airport** to **Platanias** covers approximately 18 km in about 25 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Chania Airport to Platanias?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Chania Airport to Platanias?",
        a: "Typically about 25 minutes for 18 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "chania-international-airport-transfers-chq",
    routeSlug: "transfer-from-chania-airport-to-georgioupoli",
    toSlug: "georgioupoli",
    toName: "Georgioupoli",
    fromName: "Chania Airport",
    distanceKm: 35,
    durationMin: 40,
    basePriceEur: 52,
    bookable: "instant",
    legacyRouteSlug: "chania-airport-to-georgioupoli",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Chania Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "35 km · about 40 minutes",
        body: "Typical door-to-door time from Chania Airport to Georgioupoli under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Georgioupoli. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Chania Airport** to **Georgioupoli** covers approximately 35 km in about 40 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Chania Airport to Georgioupoli?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Chania Airport to Georgioupoli?",
        a: "Typically about 40 minutes for 35 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "chania-international-airport-transfers-chq",
    routeSlug: "transfer-from-chania-airport-to-kolymbari",
    toSlug: "kolymbari",
    toName: "Kolymbari",
    fromName: "Chania Airport",
    distanceKm: 28,
    durationMin: 35,
    basePriceEur: 45,
    bookable: "instant",
    legacyRouteSlug: "chania-airport-to-kolymbari",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Chania Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "28 km · about 35 minutes",
        body: "Typical door-to-door time from Chania Airport to Kolymbari under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Kolymbari. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Chania Airport** to **Kolymbari** covers approximately 28 km in about 35 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Chania Airport to Kolymbari?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Chania Airport to Kolymbari?",
        a: "Typically about 35 minutes for 28 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "chania-international-airport-transfers-chq",
    routeSlug: "transfer-from-chania-airport-to-almyrida",
    toSlug: "almyrida",
    toName: "Almyrida",
    fromName: "Chania Airport",
    distanceKm: 30,
    durationMin: 40,
    basePriceEur: 48,
    bookable: "instant",
    legacyRouteSlug: "chania-airport-to-almyrida",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Chania Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "30 km · about 40 minutes",
        body: "Typical door-to-door time from Chania Airport to Almyrida under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Almyrida. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Chania Airport** to **Almyrida** covers approximately 30 km in about 40 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Chania Airport to Almyrida?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Chania Airport to Almyrida?",
        a: "Typically about 40 minutes for 30 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "chania-international-airport-transfers-chq",
    routeSlug: "transfer-from-chania-airport-to-falasarna",
    toSlug: "falasarna",
    toName: "Falasarna",
    fromName: "Chania Airport",
    distanceKm: 55,
    durationMin: 65,
    basePriceEur: 75,
    bookable: "instant",
    legacyRouteSlug: "chania-airport-to-falasarna",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Chania Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "55 km · about 65 minutes",
        body: "Typical door-to-door time from Chania Airport to Falasarna under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Falasarna. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Chania Airport** to **Falasarna** covers approximately 55 km in about 65 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Chania Airport to Falasarna?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Chania Airport to Falasarna?",
        a: "Typically about 65 minutes for 55 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "chania-international-airport-transfers-chq",
    routeSlug: "transfer-from-chania-airport-to-sougia",
    toSlug: "sougia",
    toName: "Sougia",
    fromName: "Chania Airport",
    distanceKm: 70,
    durationMin: 90,
    basePriceEur: 95,
    bookable: "instant",
    legacyRouteSlug: "chania-airport-to-sougia",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Chania Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "70 km · about 90 minutes",
        body: "Typical door-to-door time from Chania Airport to Sougia under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Sougia. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Chania Airport** to **Sougia** covers approximately 70 km in about 90 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Chania Airport to Sougia?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Chania Airport to Sougia?",
        a: "Typically about 90 minutes for 70 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "chania-international-airport-transfers-chq",
    routeSlug: "transfer-from-chania-airport-to-paleochora",
    toSlug: "paleochora",
    toName: "Paleochora",
    fromName: "Chania Airport",
    distanceKm: 75,
    durationMin: 100,
    basePriceEur: 105,
    bookable: "instant",
    legacyRouteSlug: "chania-airport-to-paleochora",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Chania Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "75 km · about 100 minutes",
        body: "Typical door-to-door time from Chania Airport to Paleochora under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Paleochora. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Chania Airport** to **Paleochora** covers approximately 75 km in about 100 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Chania Airport to Paleochora?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Chania Airport to Paleochora?",
        a: "Typically about 100 minutes for 75 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "athens-airport-transfers-ath",
    routeSlug: "transfer-from-athens-airport-to-athens-city-center",
    toSlug: "athens-city-center",
    toName: "Athens city center",
    fromName: "Athens Airport",
    distanceKm: 41,
    durationMin: 35,
    basePriceEur: 55,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Athens Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "41 km · about 35 minutes",
        body: "Typical door-to-door time from Athens Airport to Athens city center under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Athens city center. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Athens Airport** to **Athens city center** covers approximately 41 km in about 35 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Athens Airport to Athens city center?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Athens Airport to Athens city center?",
        a: "Typically about 35 minutes for 41 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "athens-airport-transfers-ath",
    routeSlug: "transfer-from-athens-airport-to-piraeus",
    toSlug: "piraeus",
    toName: "Piraeus",
    fromName: "Athens Airport",
    distanceKm: 48,
    durationMin: 40,
    basePriceEur: 60,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Athens Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "48 km · about 40 minutes",
        body: "Typical door-to-door time from Athens Airport to Piraeus under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Piraeus. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Athens Airport** to **Piraeus** covers approximately 48 km in about 40 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Athens Airport to Piraeus?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Athens Airport to Piraeus?",
        a: "Typically about 40 minutes for 48 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "athens-airport-transfers-ath",
    routeSlug: "transfer-from-athens-airport-to-glyfada",
    toSlug: "glyfada",
    toName: "Glyfada",
    fromName: "Athens Airport",
    distanceKm: 25,
    durationMin: 30,
    basePriceEur: 48,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Athens Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "25 km · about 30 minutes",
        body: "Typical door-to-door time from Athens Airport to Glyfada under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Glyfada. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Athens Airport** to **Glyfada** covers approximately 25 km in about 30 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Athens Airport to Glyfada?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Athens Airport to Glyfada?",
        a: "Typically about 30 minutes for 25 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "athens-airport-transfers-ath",
    routeSlug: "transfer-from-athens-airport-to-acropolis",
    toSlug: "acropolis",
    toName: "Acropolis",
    fromName: "Athens Airport",
    distanceKm: 33,
    durationMin: 35,
    basePriceEur: 52,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Athens Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "33 km · about 35 minutes",
        body: "Typical door-to-door time from Athens Airport to Acropolis under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Acropolis. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Athens Airport** to **Acropolis** covers approximately 33 km in about 35 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Athens Airport to Acropolis?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Athens Airport to Acropolis?",
        a: "Typically about 35 minutes for 33 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "athens-airport-transfers-ath",
    routeSlug: "transfer-from-athens-airport-to-lavrio",
    toSlug: "lavrio",
    toName: "Lavrio",
    fromName: "Athens Airport",
    distanceKm: 37,
    durationMin: 35,
    basePriceEur: 55,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Athens Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "37 km · about 35 minutes",
        body: "Typical door-to-door time from Athens Airport to Lavrio under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Lavrio. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Athens Airport** to **Lavrio** covers approximately 37 km in about 35 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Athens Airport to Lavrio?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Athens Airport to Lavrio?",
        a: "Typically about 35 minutes for 37 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "athens-airport-transfers-ath",
    routeSlug: "transfer-from-athens-airport-to-rafina",
    toSlug: "rafina",
    toName: "Rafina",
    fromName: "Athens Airport",
    distanceKm: 25,
    durationMin: 30,
    basePriceEur: 48,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Athens Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "25 km · about 30 minutes",
        body: "Typical door-to-door time from Athens Airport to Rafina under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Rafina. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Athens Airport** to **Rafina** covers approximately 25 km in about 30 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Athens Airport to Rafina?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Athens Airport to Rafina?",
        a: "Typically about 30 minutes for 25 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "athens-airport-transfers-ath",
    routeSlug: "transfer-from-athens-airport-to-alimos-marina",
    toSlug: "alimos-marina",
    toName: "Alimos Marina",
    fromName: "Athens Airport",
    distanceKm: 33,
    durationMin: 35,
    basePriceEur: 50,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Athens Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "33 km · about 35 minutes",
        body: "Typical door-to-door time from Athens Airport to Alimos Marina under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Alimos Marina. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Athens Airport** to **Alimos Marina** covers approximately 33 km in about 35 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Athens Airport to Alimos Marina?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Athens Airport to Alimos Marina?",
        a: "Typically about 35 minutes for 33 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "thessaloniki-airport-transfers-skg",
    routeSlug: "transfer-from-thessaloniki-airport-to-thessaloniki",
    toSlug: "thessaloniki",
    toName: "Thessaloniki",
    fromName: "Thessaloniki Airport",
    distanceKm: 15,
    durationMin: 30,
    basePriceEur: 35,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Thessaloniki Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "15 km · about 30 minutes",
        body: "Typical door-to-door time from Thessaloniki Airport to Thessaloniki under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Thessaloniki. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Thessaloniki Airport** to **Thessaloniki** covers approximately 15 km in about 30 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Thessaloniki Airport to Thessaloniki?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Thessaloniki Airport to Thessaloniki?",
        a: "Typically about 30 minutes for 15 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "mykonos-airport-transfers-jmk",
    routeSlug: "transfer-from-mykonos-airport-to-mykonos-town",
    toSlug: "mykonos-town",
    toName: "Mykonos Town",
    fromName: "Mykonos Airport",
    distanceKm: 4,
    durationMin: 15,
    basePriceEur: 35,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Mykonos Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "4 km · about 15 minutes",
        body: "Typical door-to-door time from Mykonos Airport to Mykonos Town under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Mykonos Town. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Mykonos Airport** to **Mykonos Town** covers approximately 4 km in about 15 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Mykonos Airport to Mykonos Town?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Mykonos Airport to Mykonos Town?",
        a: "Typically about 15 minutes for 4 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "mykonos-airport-transfers-jmk",
    routeSlug: "transfer-from-mykonos-airport-to-platys-yialos",
    toSlug: "platys-yialos",
    toName: "Platys Yialos",
    fromName: "Mykonos Airport",
    distanceKm: 8,
    durationMin: 20,
    basePriceEur: 38,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Mykonos Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "8 km · about 20 minutes",
        body: "Typical door-to-door time from Mykonos Airport to Platys Yialos under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Platys Yialos. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Mykonos Airport** to **Platys Yialos** covers approximately 8 km in about 20 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Mykonos Airport to Platys Yialos?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Mykonos Airport to Platys Yialos?",
        a: "Typically about 20 minutes for 8 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "mykonos-airport-transfers-jmk",
    routeSlug: "transfer-from-mykonos-airport-to-psarou",
    toSlug: "psarou",
    toName: "Psarou",
    fromName: "Mykonos Airport",
    distanceKm: 6,
    durationMin: 18,
    basePriceEur: 40,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Mykonos Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "6 km · about 18 minutes",
        body: "Typical door-to-door time from Mykonos Airport to Psarou under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Psarou. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Mykonos Airport** to **Psarou** covers approximately 6 km in about 18 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Mykonos Airport to Psarou?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Mykonos Airport to Psarou?",
        a: "Typically about 18 minutes for 6 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "mykonos-airport-transfers-jmk",
    routeSlug: "transfer-from-mykonos-airport-to-ornos",
    toSlug: "ornos",
    toName: "Ornos",
    fromName: "Mykonos Airport",
    distanceKm: 5,
    durationMin: 15,
    basePriceEur: 36,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Mykonos Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "5 km · about 15 minutes",
        body: "Typical door-to-door time from Mykonos Airport to Ornos under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Ornos. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Mykonos Airport** to **Ornos** covers approximately 5 km in about 15 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Mykonos Airport to Ornos?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Mykonos Airport to Ornos?",
        a: "Typically about 15 minutes for 5 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "santorini-airport-transfers-jtr",
    routeSlug: "transfer-from-santorini-airport-to-fira",
    toSlug: "fira",
    toName: "Fira",
    fromName: "Santorini Airport",
    distanceKm: 6,
    durationMin: 20,
    basePriceEur: 45,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Santorini Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "6 km · about 20 minutes",
        body: "Typical door-to-door time from Santorini Airport to Fira under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Fira. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Santorini Airport** to **Fira** covers approximately 6 km in about 20 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Santorini Airport to Fira?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Santorini Airport to Fira?",
        a: "Typically about 20 minutes for 6 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "santorini-airport-transfers-jtr",
    routeSlug: "transfer-from-santorini-airport-to-oia",
    toSlug: "oia",
    toName: "Oia",
    fromName: "Santorini Airport",
    distanceKm: 17,
    durationMin: 35,
    basePriceEur: 65,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Santorini Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "17 km · about 35 minutes",
        body: "Typical door-to-door time from Santorini Airport to Oia under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Oia. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Santorini Airport** to **Oia** covers approximately 17 km in about 35 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Santorini Airport to Oia?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Santorini Airport to Oia?",
        a: "Typically about 35 minutes for 17 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "santorini-airport-transfers-jtr",
    routeSlug: "transfer-from-santorini-airport-to-kamari",
    toSlug: "kamari",
    toName: "Kamari",
    fromName: "Santorini Airport",
    distanceKm: 6,
    durationMin: 15,
    basePriceEur: 42,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Santorini Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "6 km · about 15 minutes",
        body: "Typical door-to-door time from Santorini Airport to Kamari under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Kamari. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Santorini Airport** to **Kamari** covers approximately 6 km in about 15 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Santorini Airport to Kamari?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Santorini Airport to Kamari?",
        a: "Typically about 15 minutes for 6 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "santorini-airport-transfers-jtr",
    routeSlug: "transfer-from-santorini-airport-to-perissa",
    toSlug: "perissa",
    toName: "Perissa",
    fromName: "Santorini Airport",
    distanceKm: 12,
    durationMin: 25,
    basePriceEur: 50,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Santorini Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "12 km · about 25 minutes",
        body: "Typical door-to-door time from Santorini Airport to Perissa under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Perissa. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Santorini Airport** to **Perissa** covers approximately 12 km in about 25 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Santorini Airport to Perissa?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Santorini Airport to Perissa?",
        a: "Typically about 25 minutes for 12 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "santorini-airport-transfers-jtr",
    routeSlug: "transfer-from-santorini-airport-to-imerovigli",
    toSlug: "imerovigli",
    toName: "Imerovigli",
    fromName: "Santorini Airport",
    distanceKm: 8,
    durationMin: 22,
    basePriceEur: 48,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Santorini Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "8 km · about 22 minutes",
        body: "Typical door-to-door time from Santorini Airport to Imerovigli under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Imerovigli. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Santorini Airport** to **Imerovigli** covers approximately 8 km in about 22 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Santorini Airport to Imerovigli?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Santorini Airport to Imerovigli?",
        a: "Typically about 22 minutes for 8 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "corfu-international-airport-transfers-cfu",
    routeSlug: "transfer-from-corfu-airport-to-corfu-town",
    toSlug: "corfu-town",
    toName: "Corfu Town",
    fromName: "Corfu Airport",
    distanceKm: 3,
    durationMin: 12,
    basePriceEur: 30,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Corfu Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "3 km · about 12 minutes",
        body: "Typical door-to-door time from Corfu Airport to Corfu Town under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Corfu Town. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Corfu Airport** to **Corfu Town** covers approximately 3 km in about 12 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Corfu Airport to Corfu Town?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Corfu Airport to Corfu Town?",
        a: "Typically about 12 minutes for 3 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "corfu-international-airport-transfers-cfu",
    routeSlug: "transfer-from-corfu-airport-to-paleokastritsa",
    toSlug: "paleokastritsa",
    toName: "Paleokastritsa",
    fromName: "Corfu Airport",
    distanceKm: 25,
    durationMin: 40,
    basePriceEur: 55,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Corfu Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "25 km · about 40 minutes",
        body: "Typical door-to-door time from Corfu Airport to Paleokastritsa under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Paleokastritsa. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Corfu Airport** to **Paleokastritsa** covers approximately 25 km in about 40 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Corfu Airport to Paleokastritsa?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Corfu Airport to Paleokastritsa?",
        a: "Typically about 40 minutes for 25 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "corfu-international-airport-transfers-cfu",
    routeSlug: "transfer-from-corfu-airport-to-dassia",
    toSlug: "dassia",
    toName: "Dassia",
    fromName: "Corfu Airport",
    distanceKm: 12,
    durationMin: 25,
    basePriceEur: 40,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Corfu Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "12 km · about 25 minutes",
        body: "Typical door-to-door time from Corfu Airport to Dassia under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Dassia. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Corfu Airport** to **Dassia** covers approximately 12 km in about 25 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Corfu Airport to Dassia?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Corfu Airport to Dassia?",
        a: "Typically about 25 minutes for 12 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "corfu-international-airport-transfers-cfu",
    routeSlug: "transfer-from-corfu-airport-to-kavos",
    toSlug: "kavos",
    toName: "Kavos",
    fromName: "Corfu Airport",
    distanceKm: 45,
    durationMin: 55,
    basePriceEur: 75,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Corfu Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "45 km · about 55 minutes",
        body: "Typical door-to-door time from Corfu Airport to Kavos under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Kavos. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Corfu Airport** to **Kavos** covers approximately 45 km in about 55 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Corfu Airport to Kavos?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Corfu Airport to Kavos?",
        a: "Typically about 55 minutes for 45 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "rhodes-airport-transfers-rho",
    routeSlug: "transfer-from-rhodes-airport-to-rhodes-town",
    toSlug: "rhodes-town",
    toName: "Rhodes Town",
    fromName: "Rhodes Airport",
    distanceKm: 15,
    durationMin: 25,
    basePriceEur: 35,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Rhodes Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "15 km · about 25 minutes",
        body: "Typical door-to-door time from Rhodes Airport to Rhodes Town under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Rhodes Town. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Rhodes Airport** to **Rhodes Town** covers approximately 15 km in about 25 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Rhodes Airport to Rhodes Town?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Rhodes Airport to Rhodes Town?",
        a: "Typically about 25 minutes for 15 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "rhodes-airport-transfers-rho",
    routeSlug: "transfer-from-rhodes-airport-to-faliraki",
    toSlug: "faliraki",
    toName: "Faliraki",
    fromName: "Rhodes Airport",
    distanceKm: 20,
    durationMin: 30,
    basePriceEur: 40,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Rhodes Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "20 km · about 30 minutes",
        body: "Typical door-to-door time from Rhodes Airport to Faliraki under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Faliraki. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Rhodes Airport** to **Faliraki** covers approximately 20 km in about 30 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Rhodes Airport to Faliraki?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Rhodes Airport to Faliraki?",
        a: "Typically about 30 minutes for 20 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "rhodes-airport-transfers-rho",
    routeSlug: "transfer-from-rhodes-airport-to-lindos",
    toSlug: "lindos",
    toName: "Lindos",
    fromName: "Rhodes Airport",
    distanceKm: 50,
    durationMin: 55,
    basePriceEur: 75,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Rhodes Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "50 km · about 55 minutes",
        body: "Typical door-to-door time from Rhodes Airport to Lindos under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Lindos. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Rhodes Airport** to **Lindos** covers approximately 50 km in about 55 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Rhodes Airport to Lindos?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Rhodes Airport to Lindos?",
        a: "Typically about 55 minutes for 50 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "rhodes-airport-transfers-rho",
    routeSlug: "transfer-from-rhodes-airport-to-ialysos",
    toSlug: "ialysos",
    toName: "Ialysos",
    fromName: "Rhodes Airport",
    distanceKm: 10,
    durationMin: 20,
    basePriceEur: 32,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Rhodes Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "10 km · about 20 minutes",
        body: "Typical door-to-door time from Rhodes Airport to Ialysos under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Ialysos. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Rhodes Airport** to **Ialysos** covers approximately 10 km in about 20 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Rhodes Airport to Ialysos?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Rhodes Airport to Ialysos?",
        a: "Typically about 20 minutes for 10 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "zakynthos-airport-transfers-zth",
    routeSlug: "transfer-from-zakynthos-airport-to-zakynthos-town",
    toSlug: "zakynthos-town",
    toName: "Zakynthos Town",
    fromName: "Zakynthos Airport",
    distanceKm: 6,
    durationMin: 20,
    basePriceEur: 30,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Zakynthos Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "6 km · about 20 minutes",
        body: "Typical door-to-door time from Zakynthos Airport to Zakynthos Town under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Zakynthos Town. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Zakynthos Airport** to **Zakynthos Town** covers approximately 6 km in about 20 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Zakynthos Airport to Zakynthos Town?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Zakynthos Airport to Zakynthos Town?",
        a: "Typically about 20 minutes for 6 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "zakynthos-airport-transfers-zth",
    routeSlug: "transfer-from-zakynthos-airport-to-laganas",
    toSlug: "laganas",
    toName: "Laganas",
    fromName: "Zakynthos Airport",
    distanceKm: 8,
    durationMin: 18,
    basePriceEur: 32,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Zakynthos Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "8 km · about 18 minutes",
        body: "Typical door-to-door time from Zakynthos Airport to Laganas under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Laganas. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Zakynthos Airport** to **Laganas** covers approximately 8 km in about 18 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Zakynthos Airport to Laganas?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Zakynthos Airport to Laganas?",
        a: "Typically about 18 minutes for 8 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "zakynthos-airport-transfers-zth",
    routeSlug: "transfer-from-zakynthos-airport-to-tsilivi",
    toSlug: "tsilivi",
    toName: "Tsilivi",
    fromName: "Zakynthos Airport",
    distanceKm: 12,
    durationMin: 25,
    basePriceEur: 38,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Zakynthos Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "12 km · about 25 minutes",
        body: "Typical door-to-door time from Zakynthos Airport to Tsilivi under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Tsilivi. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Zakynthos Airport** to **Tsilivi** covers approximately 12 km in about 25 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Zakynthos Airport to Tsilivi?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Zakynthos Airport to Tsilivi?",
        a: "Typically about 25 minutes for 12 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "kalamata-international-airport-transfers-klx",
    routeSlug: "transfer-from-kalamata-airport-to-kalamata",
    toSlug: "kalamata",
    toName: "Kalamata",
    fromName: "Kalamata Airport",
    distanceKm: 10,
    durationMin: 20,
    basePriceEur: 35,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Kalamata Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "10 km · about 20 minutes",
        body: "Typical door-to-door time from Kalamata Airport to Kalamata under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Kalamata. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Kalamata Airport** to **Kalamata** covers approximately 10 km in about 20 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Kalamata Airport to Kalamata?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Kalamata Airport to Kalamata?",
        a: "Typically about 20 minutes for 10 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "kalamata-international-airport-transfers-klx",
    routeSlug: "transfer-from-kalamata-airport-to-athens",
    toSlug: "athens",
    toName: "Athens",
    fromName: "Kalamata Airport",
    distanceKm: 231,
    durationMin: 145,
    basePriceEur: 280,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Kalamata Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "231 km · about 145 minutes",
        body: "Typical door-to-door time from Kalamata Airport to Athens under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Athens. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Kalamata Airport** to **Athens** covers approximately 231 km in about 145 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Kalamata Airport to Athens?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Kalamata Airport to Athens?",
        a: "Typically about 145 minutes for 231 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "kalamata-international-airport-transfers-klx",
    routeSlug: "transfer-from-kalamata-airport-to-nafplio",
    toSlug: "nafplio",
    toName: "Nafplio",
    fromName: "Kalamata Airport",
    distanceKm: 138,
    durationMin: 95,
    basePriceEur: 180,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Kalamata Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "138 km · about 95 minutes",
        body: "Typical door-to-door time from Kalamata Airport to Nafplio under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Nafplio. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Kalamata Airport** to **Nafplio** covers approximately 138 km in about 95 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Kalamata Airport to Nafplio?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Kalamata Airport to Nafplio?",
        a: "Typically about 95 minutes for 138 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "kalamata-international-airport-transfers-klx",
    routeSlug: "transfer-from-kalamata-airport-to-sparta",
    toSlug: "sparta",
    toName: "Sparta",
    fromName: "Kalamata Airport",
    distanceKm: 91,
    durationMin: 70,
    basePriceEur: 130,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Kalamata Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "91 km · about 70 minutes",
        body: "Typical door-to-door time from Kalamata Airport to Sparta under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Sparta. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Kalamata Airport** to **Sparta** covers approximately 91 km in about 70 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Kalamata Airport to Sparta?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Kalamata Airport to Sparta?",
        a: "Typically about 70 minutes for 91 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "kalamata-international-airport-transfers-klx",
    routeSlug: "transfer-from-kalamata-airport-to-patras",
    toSlug: "patras",
    toName: "Patras",
    fromName: "Kalamata Airport",
    distanceKm: 277,
    durationMin: 170,
    basePriceEur: 320,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Kalamata Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "277 km · about 170 minutes",
        body: "Typical door-to-door time from Kalamata Airport to Patras under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Patras. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Kalamata Airport** to **Patras** covers approximately 277 km in about 170 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Kalamata Airport to Patras?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Kalamata Airport to Patras?",
        a: "Typically about 170 minutes for 277 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "kalamata-international-airport-transfers-klx",
    routeSlug: "transfer-from-kalamata-airport-to-koroni",
    toSlug: "koroni",
    toName: "Koroni",
    fromName: "Kalamata Airport",
    distanceKm: 43,
    durationMin: 55,
    basePriceEur: 75,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Kalamata Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "43 km · about 55 minutes",
        body: "Typical door-to-door time from Kalamata Airport to Koroni under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Koroni. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Kalamata Airport** to **Koroni** covers approximately 43 km in about 55 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Kalamata Airport to Koroni?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Kalamata Airport to Koroni?",
        a: "Typically about 55 minutes for 43 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "kalamata-international-airport-transfers-klx",
    routeSlug: "transfer-from-kalamata-airport-to-voidokilia-beach",
    toSlug: "voidokilia-beach",
    toName: "Voidokilia Beach",
    fromName: "Kalamata Airport",
    distanceKm: 46,
    durationMin: 60,
    basePriceEur: 80,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Kalamata Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "46 km · about 60 minutes",
        body: "Typical door-to-door time from Kalamata Airport to Voidokilia Beach under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Voidokilia Beach. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Kalamata Airport** to **Voidokilia Beach** covers approximately 46 km in about 60 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Kalamata Airport to Voidokilia Beach?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Kalamata Airport to Voidokilia Beach?",
        a: "Typically about 60 minutes for 46 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "kefalonia-airport-transfers-efl",
    routeSlug: "transfer-from-kefalonia-airport-to-argostoli",
    toSlug: "argostoli",
    toName: "Argostoli",
    fromName: "Kefalonia Airport",
    distanceKm: 10,
    durationMin: 20,
    basePriceEur: 40,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Kefalonia Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "10 km · about 20 minutes",
        body: "Typical door-to-door time from Kefalonia Airport to Argostoli under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Argostoli. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Kefalonia Airport** to **Argostoli** covers approximately 10 km in about 20 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Kefalonia Airport to Argostoli?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Kefalonia Airport to Argostoli?",
        a: "Typically about 20 minutes for 10 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "kefalonia-airport-transfers-efl",
    routeSlug: "transfer-from-kefalonia-airport-to-lixouri",
    toSlug: "lixouri",
    toName: "Lixouri",
    fromName: "Kefalonia Airport",
    distanceKm: 35,
    durationMin: 45,
    basePriceEur: 65,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Kefalonia Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "35 km · about 45 minutes",
        body: "Typical door-to-door time from Kefalonia Airport to Lixouri under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Lixouri. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Kefalonia Airport** to **Lixouri** covers approximately 35 km in about 45 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Kefalonia Airport to Lixouri?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Kefalonia Airport to Lixouri?",
        a: "Typically about 45 minutes for 35 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "kefalonia-airport-transfers-efl",
    routeSlug: "transfer-from-kefalonia-airport-to-skala-kefalonia",
    toSlug: "skala-kefalonia",
    toName: "Skala",
    fromName: "Kefalonia Airport",
    distanceKm: 35,
    durationMin: 45,
    basePriceEur: 70,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Kefalonia Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "35 km · about 45 minutes",
        body: "Typical door-to-door time from Kefalonia Airport to Skala under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Skala. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Kefalonia Airport** to **Skala** covers approximately 35 km in about 45 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Kefalonia Airport to Skala?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Kefalonia Airport to Skala?",
        a: "Typically about 45 minutes for 35 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "kos-airport-transfers-kgs",
    routeSlug: "transfer-from-kos-airport-to-kos-town",
    toSlug: "kos-town",
    toName: "Kos Town",
    fromName: "Kos Airport",
    distanceKm: 25,
    durationMin: 35,
    basePriceEur: 40,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Kos Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "25 km · about 35 minutes",
        body: "Typical door-to-door time from Kos Airport to Kos Town under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Kos Town. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Kos Airport** to **Kos Town** covers approximately 25 km in about 35 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Kos Airport to Kos Town?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Kos Airport to Kos Town?",
        a: "Typically about 35 minutes for 25 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "kos-airport-transfers-kgs",
    routeSlug: "transfer-from-kos-airport-to-kardamena",
    toSlug: "kardamena",
    toName: "Kardamena",
    fromName: "Kos Airport",
    distanceKm: 10,
    durationMin: 20,
    basePriceEur: 35,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Kos Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "10 km · about 20 minutes",
        body: "Typical door-to-door time from Kos Airport to Kardamena under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Kardamena. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Kos Airport** to **Kardamena** covers approximately 10 km in about 20 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Kos Airport to Kardamena?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Kos Airport to Kardamena?",
        a: "Typically about 20 minutes for 10 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "kos-airport-transfers-kgs",
    routeSlug: "transfer-from-kos-airport-to-mastichari",
    toSlug: "mastichari",
    toName: "Mastichari",
    fromName: "Kos Airport",
    distanceKm: 8,
    durationMin: 15,
    basePriceEur: 32,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Kos Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "8 km · about 15 minutes",
        body: "Typical door-to-door time from Kos Airport to Mastichari under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Mastichari. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Kos Airport** to **Mastichari** covers approximately 8 km in about 15 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Kos Airport to Mastichari?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Kos Airport to Mastichari?",
        a: "Typically about 15 minutes for 8 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "aktion-lefkada-airport-transfers-pvk",
    routeSlug: "transfer-from-aktion-airport-to-lefkada",
    toSlug: "lefkada",
    toName: "Lefkada Town",
    fromName: "Aktion Airport",
    distanceKm: 25,
    durationMin: 35,
    basePriceEur: 45,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Aktion Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "25 km · about 35 minutes",
        body: "Typical door-to-door time from Aktion Airport to Lefkada Town under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Lefkada Town. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Aktion Airport** to **Lefkada Town** covers approximately 25 km in about 35 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Aktion Airport to Lefkada Town?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Aktion Airport to Lefkada Town?",
        a: "Typically about 35 minutes for 25 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "aktion-lefkada-airport-transfers-pvk",
    routeSlug: "transfer-from-aktion-airport-to-nikiana",
    toSlug: "nikiana",
    toName: "Nikiana",
    fromName: "Aktion Airport",
    distanceKm: 35,
    durationMin: 45,
    basePriceEur: 55,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Aktion Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "35 km · about 45 minutes",
        body: "Typical door-to-door time from Aktion Airport to Nikiana under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Nikiana. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Aktion Airport** to **Nikiana** covers approximately 35 km in about 45 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Aktion Airport to Nikiana?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Aktion Airport to Nikiana?",
        a: "Typically about 45 minutes for 35 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "aktion-lefkada-airport-transfers-pvk",
    routeSlug: "transfer-from-aktion-airport-to-vassiliki",
    toSlug: "vassiliki",
    toName: "Vassiliki",
    fromName: "Aktion Airport",
    distanceKm: 50,
    durationMin: 60,
    basePriceEur: 75,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Aktion Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "50 km · about 60 minutes",
        body: "Typical door-to-door time from Aktion Airport to Vassiliki under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Vassiliki. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Aktion Airport** to **Vassiliki** covers approximately 50 km in about 60 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Aktion Airport to Vassiliki?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Aktion Airport to Vassiliki?",
        a: "Typically about 60 minutes for 50 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "paros-airport-transfers-pas",
    routeSlug: "transfer-from-paros-airport-to-parikia",
    toSlug: "parikia",
    toName: "Parikia",
    fromName: "Paros Airport",
    distanceKm: 8,
    durationMin: 15,
    basePriceEur: 35,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Paros Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "8 km · about 15 minutes",
        body: "Typical door-to-door time from Paros Airport to Parikia under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Parikia. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Paros Airport** to **Parikia** covers approximately 8 km in about 15 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Paros Airport to Parikia?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Paros Airport to Parikia?",
        a: "Typically about 15 minutes for 8 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "paros-airport-transfers-pas",
    routeSlug: "transfer-from-paros-airport-to-naoussa",
    toSlug: "naoussa",
    toName: "Naoussa",
    fromName: "Paros Airport",
    distanceKm: 15,
    durationMin: 25,
    basePriceEur: 42,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Paros Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "15 km · about 25 minutes",
        body: "Typical door-to-door time from Paros Airport to Naoussa under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Naoussa. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Paros Airport** to **Naoussa** covers approximately 15 km in about 25 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Paros Airport to Naoussa?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Paros Airport to Naoussa?",
        a: "Typically about 25 minutes for 15 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "naxos-airport-transfers-jnx",
    routeSlug: "transfer-from-naxos-airport-to-naxos-town",
    toSlug: "naxos-town",
    toName: "Naxos Town (Chora)",
    fromName: "Naxos Airport",
    distanceKm: 5,
    durationMin: 12,
    basePriceEur: 30,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Naxos Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "5 km · about 12 minutes",
        body: "Typical door-to-door time from Naxos Airport to Naxos Town (Chora) under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Naxos Town (Chora). Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Naxos Airport** to **Naxos Town (Chora)** covers approximately 5 km in about 12 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Naxos Airport to Naxos Town (Chora)?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Naxos Airport to Naxos Town (Chora)?",
        a: "Typically about 12 minutes for 5 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "naxos-airport-transfers-jnx",
    routeSlug: "transfer-from-naxos-airport-to-agia-anna-naxos",
    toSlug: "agia-anna-naxos",
    toName: "Agia Anna",
    fromName: "Naxos Airport",
    distanceKm: 8,
    durationMin: 18,
    basePriceEur: 35,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Naxos Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "8 km · about 18 minutes",
        body: "Typical door-to-door time from Naxos Airport to Agia Anna under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Agia Anna. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Naxos Airport** to **Agia Anna** covers approximately 8 km in about 18 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Naxos Airport to Agia Anna?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Naxos Airport to Agia Anna?",
        a: "Typically about 18 minutes for 8 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "milos-airport-transfers-mlo",
    routeSlug: "transfer-from-milos-airport-to-adamas",
    toSlug: "adamas",
    toName: "Adamas",
    fromName: "Milos Airport",
    distanceKm: 8,
    durationMin: 18,
    basePriceEur: 35,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Milos Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "8 km · about 18 minutes",
        body: "Typical door-to-door time from Milos Airport to Adamas under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Adamas. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Milos Airport** to **Adamas** covers approximately 8 km in about 18 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Milos Airport to Adamas?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Milos Airport to Adamas?",
        a: "Typically about 18 minutes for 8 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "milos-airport-transfers-mlo",
    routeSlug: "transfer-from-milos-airport-to-plaka-milos",
    toSlug: "plaka-milos",
    toName: "Plaka",
    fromName: "Milos Airport",
    distanceKm: 12,
    durationMin: 25,
    basePriceEur: 40,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Milos Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "12 km · about 25 minutes",
        body: "Typical door-to-door time from Milos Airport to Plaka under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Plaka. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Milos Airport** to **Plaka** covers approximately 12 km in about 25 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Milos Airport to Plaka?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Milos Airport to Plaka?",
        a: "Typically about 25 minutes for 12 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "mytilene-airport-transfers-mjt",
    routeSlug: "transfer-from-mytilene-airport-to-mytilene",
    toSlug: "mytilene",
    toName: "Mytilene",
    fromName: "Mytilene Airport",
    distanceKm: 8,
    durationMin: 15,
    basePriceEur: 35,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Mytilene Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "8 km · about 15 minutes",
        body: "Typical door-to-door time from Mytilene Airport to Mytilene under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Mytilene. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Mytilene Airport** to **Mytilene** covers approximately 8 km in about 15 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Mytilene Airport to Mytilene?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Mytilene Airport to Mytilene?",
        a: "Typically about 15 minutes for 8 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "mytilene-airport-transfers-mjt",
    routeSlug: "transfer-from-mytilene-airport-to-molyvos",
    toSlug: "molyvos",
    toName: "Molyvos",
    fromName: "Mytilene Airport",
    distanceKm: 55,
    durationMin: 70,
    basePriceEur: 90,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Mytilene Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "55 km · about 70 minutes",
        body: "Typical door-to-door time from Mytilene Airport to Molyvos under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Molyvos. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Mytilene Airport** to **Molyvos** covers approximately 55 km in about 70 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Mytilene Airport to Molyvos?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Mytilene Airport to Molyvos?",
        a: "Typically about 70 minutes for 55 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "sitia-airport-transfers-jsh",
    routeSlug: "transfer-from-sitia-airport-to-sitia",
    toSlug: "sitia",
    toName: "Sitia",
    fromName: "Sitia Airport",
    distanceKm: 6,
    durationMin: 12,
    basePriceEur: 40,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Sitia Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "6 km · about 12 minutes",
        body: "Typical door-to-door time from Sitia Airport to Sitia under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Sitia. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Sitia Airport** to **Sitia** covers approximately 6 km in about 12 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Sitia Airport to Sitia?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Sitia Airport to Sitia?",
        a: "Typically about 12 minutes for 6 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
  {
    airportSlug: "sitia-airport-transfers-jsh",
    routeSlug: "transfer-from-sitia-airport-to-ierapetra",
    toSlug: "ierapetra",
    toName: "Ierapetra",
    fromName: "Sitia Airport",
    distanceKm: 65,
    durationMin: 70,
    basePriceEur: 85,
    bookable: "quote",
    tips: [
      {
        title: "Fixed price includes waiting time",
        body: "Complimentary 60-minute wait at Sitia Airport arrivals. Flight tracking adjusts pickup automatically.",
      },
      {
        title: "65 km · about 70 minutes",
        body: "Typical door-to-door time from Sitia Airport to Ierapetra under normal traffic. Peak windows may add 5–15 minutes.",
      },
      {
        title: "Door-to-door drop-off",
        body: "We drop at your hotel or the nearest vehicle-accessible point if pedestrian zones apply in Ierapetra. Confirm the exact address when booking.",
      },
    ],
    body: "The private transfer from **Sitia Airport** to **Ierapetra** covers approximately 65 km in about 70 minutes under normal conditions. Your TransferAround driver meets you at arrivals with a name sign, monitors your flight in real time, and includes a free 60-minute wait for baggage and minor delays. The fare is fixed at booking — tolls and standard road charges included where they apply — so there are no surprises at drop-off.",
    faqs: [
      {
        q: "Where does the driver meet me for Sitia Airport to Ierapetra?",
        a: "At the arrivals baggage-hall / arrivals exit holding a name sign with your surname.",
      },
      {
        q: "How long is the drive from Sitia Airport to Ierapetra?",
        a: "Typically about 70 minutes for 65 km. Afternoon peaks can add a little time.",
      },
      {
        q: "What does the price include?",
        a: "Vehicle, licensed driver, meet & greet, flight monitoring, 60-minute free wait, and applicable tolls/road charges on this corridor.",
      },
      {
        q: "Can I cancel or change the booking?",
        a: "Yes — free cancellation up to 24 hours before pickup on standard terms. Flight-time changes are easy once you share the new details.",
      },
    ],
  },
];

export function getAirportRoutes(airportSlug: string): AirportRouteData[] {
  return AIRPORT_ROUTES.filter((r) => r.airportSlug === airportSlug);
}

export function getAirportRoute(
  airportSlug: string,
  routeSlug: string,
): AirportRouteData | undefined {
  return AIRPORT_ROUTES.find((r) => r.airportSlug === airportSlug && r.routeSlug === routeSlug);
}

export function getAirportRouteBySlugs(
  airportSlug: string,
  routeSlug: string,
): AirportRouteData | undefined {
  return getAirportRoute(airportSlug, routeSlug);
}
