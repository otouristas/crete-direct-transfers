export type Review = {
  quote: string;
  author: string;
  route: string;
  rating: 5 | 4;
  source: "Google" | "Tripadvisor" | "Direct";
  month: string;
};

export const REVIEWS: Review[] = [
  {
    quote:
      "Driver was waiting at arrivals with a sign, spotless Mercedes, exactly the price on the website. No surprises.",
    author: "Sarah M.",
    route: "Heraklion Airport → Elounda",
    rating: 5,
    source: "Google",
    month: "May 2026",
  },
  {
    quote:
      "Ferry from Piraeus was 40 minutes late at Souda. Driver was there anyway, no extra charge. That's the difference.",
    author: "Andreas K.",
    route: "Souda Port → Chania",
    rating: 5,
    source: "Tripadvisor",
    month: "May 2026",
  },
  {
    quote:
      "Booked a minivan for six of us. Got the driver's WhatsApp the night before. Felt like a friend picking us up.",
    author: "The Whelan family",
    route: "Chania Airport → Rethymno",
    rating: 5,
    source: "Google",
    month: "April 2026",
  },
  {
    quote:
      "Used another platform on my last trip, spent 20 minutes on WhatsApp confirming a price. This time: two clicks.",
    author: "Marcus B.",
    route: "Heraklion Airport → Agios Nikolaos",
    rating: 5,
    source: "Direct",
    month: "April 2026",
  },
  {
    quote:
      "The driver knew exactly which gate at the Domes Elounda to pull into. Local knowledge you don't get elsewhere.",
    author: "Priya S.",
    route: "Heraklion Airport → Elounda",
    rating: 5,
    source: "Google",
    month: "March 2026",
  },
  {
    quote:
      "Late-night arrival, sleeping kids. Driver had a booster seat ready as requested. Worth every euro.",
    author: "Jonas H.",
    route: "Chania Airport → Chania Old Town",
    rating: 5,
    source: "Tripadvisor",
    month: "March 2026",
  },
  {
    quote: "The Vito was newer than most rentals we've had. Ice-cold AC in July.",
    author: "Emma L.",
    route: "Chania Airport → Kissamos",
    rating: 5,
    source: "Google",
    month: "July 2025",
  },
  {
    quote:
      "We booked a private day tour with the driver — Knossos, Archanes, back for dinner. Perfect.",
    author: "David & Nina",
    route: "Heraklion — Private Tour",
    rating: 5,
    source: "Direct",
    month: "September 2025",
  },
  {
    quote:
      "Cross-island to Chania was long but the driver stopped for coffee at a great taverna halfway. Made the trip.",
    author: "Robert F.",
    route: "Heraklion Airport → Chania",
    rating: 5,
    source: "Tripadvisor",
    month: "June 2025",
  },
  {
    quote:
      "Booked the luxury class for my parents' 50th anniversary. Chauffeur in a proper suit. Made them feel special.",
    author: "Alexia P.",
    route: "Heraklion Airport → Elounda",
    rating: 5,
    source: "Google",
    month: "August 2025",
  },
  {
    quote:
      "Straightforward, on time, exactly the price quoted. Not much more to say — which is exactly what you want.",
    author: "Tom R.",
    route: "Heraklion Airport → Hersonissos",
    rating: 5,
    source: "Google",
    month: "May 2025",
  },
  {
    quote:
      "My flight was delayed 3 hours. Driver texted to say no worries, was there when I landed. Fixed price.",
    author: "Chiara D.",
    route: "Chania Airport → Rethymno",
    rating: 5,
    source: "Direct",
    month: "October 2025",
  },
  {
    quote:
      "Perfect service to Falasarna. Driver even suggested the best time to leave the beach to catch the sunset back.",
    author: "Nikolai V.",
    route: "Chania Airport → Falasarna",
    rating: 5,
    source: "Tripadvisor",
    month: "July 2025",
  },
  {
    quote: "Booked the round trip. Same driver both ways. Rare touch.",
    author: "Sophie R.",
    route: "Heraklion Airport → Matala",
    rating: 5,
    source: "Google",
    month: "June 2025",
  },
  {
    quote:
      "Would have paid double what they charged for the quality of car and service. Will definitely rebook.",
    author: "James T.",
    route: "Heraklion Airport → Chania",
    rating: 5,
    source: "Tripadvisor",
    month: "August 2025",
  },
  {
    quote: "The best part: no bidding, no comparing offers. See the price, book it, done.",
    author: "Anna K.",
    route: "Agios Nikolaos → Elounda",
    rating: 5,
    source: "Direct",
    month: "September 2025",
  },
  {
    quote:
      "Group of 12 for a wedding at Elounda. Three vehicles, all on time, all coordinated. Exceptional.",
    author: "The Kowalski wedding",
    route: "Heraklion Airport → Elounda",
    rating: 5,
    source: "Direct",
    month: "September 2025",
  },
  {
    quote: "Booked at 11pm the night before. Confirmed within an hour. Impressive.",
    author: "Lena B.",
    route: "Chania Airport → Platanias",
    rating: 4,
    source: "Google",
    month: "May 2025",
  },
  {
    quote: "Clean van, quiet driver, on time. All you can ask for after a red-eye.",
    author: "Mark H.",
    route: "Heraklion Port → Chania",
    rating: 5,
    source: "Tripadvisor",
    month: "April 2025",
  },
  {
    quote:
      "Recommend to any first-time Crete visitors. Removes the one stressful part of the trip.",
    author: "Ines G.",
    route: "Heraklion Airport → Rethymno",
    rating: 5,
    source: "Google",
    month: "August 2025",
  },
];

export const AVG_RATING = 4.95;
