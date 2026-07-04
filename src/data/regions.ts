export type RegionData = {
  slug: string;
  name: "Chania" | "Rethymno" | "Heraklion" | "Lasithi";
  headline: string;
  intro: string;
  body: string;
  heroImage: string;
  hotels: string[];
  gateway: string;
};

export const REGIONS: RegionData[] = [
  {
    slug: "chania",
    name: "Chania",
    headline: "The western capital, Venetian harbour, White Mountains.",
    intro:
      "The most photographed corner of Crete — Chania Old Town, the Samaria Gorge, Balos and Falasarna beaches all reach from here.",
    body:
      "Chania is where the Venetian harbour still frames every sunset, where the White Mountains rise straight from the sea, and where the ferries from Piraeus dock at Souda before dawn. Our drivers cover Chania International Airport (CHQ), Souda Port, and every resort strip from Kissamos in the west to Georgioupoli in the east.",
    heroImage: "https://images.unsplash.com/photo-1601161221525-6b3e0f0e13db?auto=format&fit=crop&w=2000&q=70",
    hotels: ["Domes Zeen", "Domes Noruz", "Minoa Palace", "Avra Imperial", "Casa Delfino"],
    gateway: "Chania Airport (CHQ) & Souda Port",
  },
  {
    slug: "rethymno",
    name: "Rethymno",
    headline: "Venetian old town, long sand beaches, gorge country.",
    intro:
      "The middle prefecture — old-town charm to the north, wild south-coast gorges, and Bali's turquoise coves in between.",
    body:
      "Rethymno's Venetian old town is compact enough to walk in an afternoon, but the region reaches from Bali on the north coast to Plakias on the south, cut through by the Kourtaliotiko gorge. We serve every hotel from Panormo to Agia Galini.",
    heroImage: "https://images.unsplash.com/photo-1571498664957-fde285d79857?auto=format&fit=crop&w=2000&q=70",
    hotels: ["Grecotel Amirandes", "Creta Palace", "Rimondi Boutique", "Atlantica Caldera Palace"],
    gateway: "Reached from Chania (CHQ) or Heraklion (HER) airports",
  },
  {
    slug: "heraklion",
    name: "Heraklion",
    headline: "The main gateway, Knossos, the north-coast resort strip.",
    intro:
      "Crete's biggest airport, the busiest port, and the Minoan palace of Knossos — plus 40 kilometres of resort coastline.",
    body:
      "Heraklion International (HER) is where four in five holidaymakers land in Crete. The city itself is the island's cultural capital — Knossos, the Archaeological Museum, the harbour fortress. East of the city, the resort strip runs from Anissaras through Hersonissos, Stalis and Malia. South, the Messara plain leads to Matala and the Libyan Sea.",
    heroImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=2000&q=70",
    hotels: ["Out of the Blue Capsis", "Nana Princess", "Aldemar Knossos Royal", "GDM Megaron"],
    gateway: "Heraklion Airport (HER) & Heraklion Port",
  },
  {
    slug: "lasithi",
    name: "Lasithi",
    headline: "The luxury east — Elounda, Mirabello Bay, Vai palms.",
    intro:
      "Home of Crete's flagship luxury hotels, the Mirabello Bay, and the far-eastern palm beach of Vai.",
    body:
      "Lasithi is the quietest, most easterly prefecture — and the one with the highest concentration of five-star hotels. Elounda, on the Mirabello Bay peninsula, hosts Blue Palace, Domes of Elounda, Elounda Beach and Elounda Bay Palace. Beyond Agios Nikolaos, the coast runs empty all the way to Sitia and Vai.",
    heroImage: "https://images.unsplash.com/photo-1601581875039-e899893d520c?auto=format&fit=crop&w=2000&q=70",
    hotels: ["Blue Palace Elounda", "Domes of Elounda", "Elounda Beach", "Daios Cove", "Minos Beach"],
    gateway: "Reached from Heraklion Airport (HER)",
  },
];

export function getRegion(slug: string): RegionData | undefined {
  return REGIONS.find((r) => r.slug === slug);
}
