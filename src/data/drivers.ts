/**
 * Named driver profiles.
 *
 * The core promise is "you know who is picking you up". These are the partner
 * drivers we publish: base, languages, years driving, vehicle, and the routes
 * they run most. Photography is intentionally not faked — profiles render an
 * initials monogram until a driver supplies a real portrait through the partner
 * dashboard, at which point `photo` is populated.
 */
export type DriverProfile = {
  slug: string;
  name: string;
  /** Home base town. */
  base: string;
  region: string;
  /** Years driving professionally. */
  years: number;
  languages: string[];
  vehicle: string;
  vehicleClass: string;
  seats: number;
  /** Editorial bio, 2 paragraphs. */
  bio: string[];
  /** Short pull-quote in the driver's own voice. */
  quote: string;
  specialties: string[];
  /** ROUTES slugs this driver covers most. */
  routeSlugs: string[];
  rating: number;
  transfers: number;
  photo?: string;
};

export const DRIVERS: DriverProfile[] = [
  {
    slug: "giorgos-manousakis",
    name: "Giorgos Manousakis",
    base: "Heraklion",
    region: "Heraklion",
    years: 18,
    languages: ["Greek", "English", "German"],
    vehicle: "Mercedes E-Class",
    vehicleClass: "Standard Class",
    seats: 3,
    bio: [
      "Giorgos has driven the Heraklion–Lasithi corridor since 2008, first for a hotel group in Elounda and, since 2016, on his own plates. He is the driver most often requested by returning guests on the airport-to-Elounda run.",
      "He keeps water and phone cables in the door pockets, knows which Selinari coffee stop is open at 06:00, and will tell you honestly whether a Spinalonga boat is worth it on a windy afternoon.",
    ],
    quote: "If the flight is three hours late, I am still there. That is the whole job.",
    specialties: ["Night arrivals", "Elounda resort gates", "Child seats"],
    routeSlugs: [
      "heraklion-airport-to-elounda",
      "heraklion-airport-to-agios-nikolaos",
      "agios-nikolaos-to-elounda",
    ],
    rating: 4.9,
    transfers: 4200,
  },
  {
    slug: "maria-koutsaki",
    name: "Maria Koutsaki",
    base: "Chania",
    region: "Chania",
    years: 11,
    languages: ["Greek", "English", "French"],
    vehicle: "Mercedes V-Class",
    vehicleClass: "Van Standard",
    seats: 7,
    bio: [
      "Maria runs the west of the island: Chania airport and Souda port out to Kissamos, Falasarna and the Paleochora road. She drives the seven-seat V-Class, which makes her the default for families landing at Chania with three children and a pushchair.",
      "She is the driver we send when a group has an early Balos boat or a Samaria Gorge start, because she has done the 05:30 pickup enough times to make it painless.",
    ],
    quote: "West Crete roads look simple on a map. They are not. That is what I am for.",
    specialties: ["Family groups", "Samaria Gorge starts", "Balos and Elafonissi days"],
    routeSlugs: [
      "chania-airport-to-chania-old-town",
      "chania-airport-to-kissamos",
      "chania-airport-to-falasarna",
    ],
    rating: 5.0,
    transfers: 2600,
  },
  {
    slug: "nikos-stavrakakis",
    name: "Nikos Stavrakakis",
    base: "Rethymno",
    region: "Rethymno",
    years: 22,
    languages: ["Greek", "English", "Italian"],
    vehicle: "Skoda Superb",
    vehicleClass: "Economy",
    seats: 3,
    bio: [
      "Twenty-two years on the north coast road, most of them between the two airports. Nikos covers the Rethymno middle ground — the stretch where guests from both Heraklion and Chania converge.",
      "He grew up in a village behind Arkadi and is the person to ask about the monastery, the mountain tavernas, and where to buy olive oil that is not sold in a gift box.",
    ],
    quote: "Twenty-two years and I still take the Panormo exit for coffee. Some things work.",
    specialties: ["Airport-to-airport", "Arkadi and inland stops", "Long-distance comfort"],
    routeSlugs: [
      "heraklion-airport-to-rethymno",
      "chania-airport-to-rethymno",
      "rethymno-to-bali",
    ],
    rating: 4.9,
    transfers: 5100,
  },
  {
    slug: "eleni-papadaki",
    name: "Eleni Papadaki",
    base: "Agios Nikolaos",
    region: "Lasithi",
    years: 9,
    languages: ["Greek", "English", "Russian"],
    vehicle: "Mercedes E-Class",
    vehicleClass: "Standard Class",
    seats: 3,
    bio: [
      "Eleni covers eastern Crete out to Sitia and Vai, the longest routes we sell and the ones where a comfortable car matters most. She was a hotel concierge in Elounda before she started driving, which shows in how she handles arrivals.",
      "If your resort check-in is at 15:00 and you land at 09:00, she is the driver who will have already worked out where you should spend the gap.",
    ],
    quote: "Nobody wants to sit in a lobby for five hours. There is always a better option.",
    specialties: ["East Crete long-distance", "Concierge-style arrivals", "Solo travellers"],
    routeSlugs: [
      "agios-nikolaos-to-sitia",
      "agios-nikolaos-to-vai",
      "heraklion-airport-to-ierapetra",
    ],
    rating: 4.8,
    transfers: 1900,
  },
  {
    slug: "manolis-vardakis",
    name: "Manolis Vardakis",
    base: "Heraklion",
    region: "Heraklion",
    years: 14,
    languages: ["Greek", "English"],
    vehicle: "Mercedes Sprinter",
    vehicleClass: "Minibus 16",
    seats: 16,
    bio: [
      "Manolis drives the sixteen-seater, which means weddings, dive groups, conference arrivals and the occasional football team. He handles the pickups where the luggage is the actual logistics problem.",
      "He has run the Heraklion port shuttle for two hotel groups and knows exactly how long the Anek and Minoan ramps take to clear on a Monday morning.",
    ],
    quote: "Sixteen people, thirty bags, one ferry. That is a normal Tuesday.",
    specialties: ["Groups and weddings", "Ferry arrivals", "Oversize luggage"],
    routeSlugs: [
      "heraklion-port-to-chania",
      "heraklion-port-to-matala",
      "heraklion-airport-to-malia",
    ],
    rating: 4.8,
    transfers: 3300,
  },
  {
    slug: "sofia-daskalaki",
    name: "Sofia Daskalaki",
    base: "Platanias",
    region: "Chania",
    years: 7,
    languages: ["Greek", "English", "German"],
    vehicle: "Skoda Kodiaq",
    vehicleClass: "SUV",
    seats: 6,
    bio: [
      "Sofia works the Platanias–Georgioupoli resort belt, the busiest hotel strip in western Crete, and drives the SUV that copes with the unsurfaced final hundred metres a surprising number of villas have.",
      "She is a fluent German speaker and takes most of our Munich and Düsseldorf charter arrivals at Chania.",
    ],
    quote: "Villa driveways in Crete are an extreme sport. I have the right car for it.",
    specialties: ["Villa drop-offs", "German-speaking guests", "Resort belt transfers"],
    routeSlugs: [
      "chania-airport-to-platanias",
      "chania-airport-to-georgioupoli",
      "chania-airport-to-almyrida",
    ],
    rating: 4.9,
    transfers: 1400,
  },
];

export function getDriver(slug: string): DriverProfile | undefined {
  return DRIVERS.find((d) => d.slug === slug);
}

export function driversForRegion(region: string): DriverProfile[] {
  return DRIVERS.filter((d) => d.region.toLowerCase() === region.toLowerCase());
}

export function driversForRoute(routeSlug: string): DriverProfile[] {
  return DRIVERS.filter((d) => d.routeSlugs.includes(routeSlug));
}

export function driverInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
