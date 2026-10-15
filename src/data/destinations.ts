export type DestinationType = "city" | "resort" | "port" | "poi" | "beach";

export type Destination = {
  slug: string;
  name: string;
  type: DestinationType;
  island?: string;
  region?: string;
  blurb?: string;
};

export const DESTINATIONS: Destination[] = [
  // Crete
  { slug: "heraklion", name: "Heraklion", type: "city", island: "Crete", region: "Heraklion" },
  {
    slug: "heraklion-city-center",
    name: "Heraklion City Center",
    type: "city",
    island: "Crete",
    region: "Heraklion",
  },
  { slug: "chania", name: "Chania", type: "city", island: "Crete", region: "Chania" },
  {
    slug: "chania-old-town",
    name: "Chania Old Town",
    type: "city",
    island: "Crete",
    region: "Chania",
  },
  { slug: "rethymno", name: "Rethymno", type: "city", island: "Crete", region: "Rethymno" },
  {
    slug: "agios-nikolaos",
    name: "Agios Nikolaos",
    type: "city",
    island: "Crete",
    region: "Lasithi",
  },
  { slug: "elounda", name: "Elounda", type: "resort", island: "Crete", region: "Lasithi" },
  {
    slug: "hersonissos",
    name: "Hersonissos",
    type: "resort",
    island: "Crete",
    region: "Heraklion",
  },
  { slug: "malia", name: "Malia", type: "resort", island: "Crete", region: "Heraklion" },
  { slug: "stalis", name: "Stalis", type: "resort", island: "Crete", region: "Heraklion" },
  { slug: "anissaras", name: "Anissaras", type: "resort", island: "Crete", region: "Heraklion" },
  { slug: "analipsi", name: "Analipsi", type: "resort", island: "Crete", region: "Heraklion" },
  { slug: "bali", name: "Bali", type: "resort", island: "Crete", region: "Rethymno" },
  { slug: "matala", name: "Matala", type: "beach", island: "Crete", region: "Heraklion" },
  { slug: "ierapetra", name: "Ierapetra", type: "city", island: "Crete", region: "Lasithi" },
  { slug: "kissamos", name: "Kissamos", type: "city", island: "Crete", region: "Chania" },
  { slug: "platanias", name: "Platanias", type: "resort", island: "Crete", region: "Chania" },
  { slug: "georgioupoli", name: "Georgioupoli", type: "resort", island: "Crete", region: "Chania" },
  { slug: "kolymbari", name: "Kolymbari", type: "resort", island: "Crete", region: "Chania" },
  { slug: "almyrida", name: "Almyrida", type: "resort", island: "Crete", region: "Chania" },
  { slug: "falasarna", name: "Falasarna", type: "beach", island: "Crete", region: "Chania" },
  { slug: "sougia", name: "Sougia", type: "beach", island: "Crete", region: "Chania" },
  { slug: "paleochora", name: "Paleochora", type: "resort", island: "Crete", region: "Chania" },
  { slug: "sitia", name: "Sitia", type: "city", island: "Crete", region: "Lasithi" },

  // Mainland
  { slug: "athens", name: "Athens", type: "city", region: "Attica" },
  { slug: "athens-city-center", name: "Athens city center", type: "city", region: "Attica" },
  { slug: "piraeus", name: "Piraeus", type: "port", region: "Attica" },
  { slug: "glyfada", name: "Glyfada", type: "city", region: "Attica" },
  { slug: "acropolis", name: "Acropolis", type: "poi", region: "Attica" },
  { slug: "lavrio", name: "Lavrio", type: "port", region: "Attica" },
  { slug: "rafina", name: "Rafina", type: "port", region: "Attica" },
  { slug: "alimos-marina", name: "Alimos Marina", type: "port", region: "Attica" },
  { slug: "thessaloniki", name: "Thessaloniki", type: "city", region: "Central Macedonia" },
  { slug: "kalamata", name: "Kalamata", type: "city", region: "Peloponnese" },
  { slug: "nafplio", name: "Nafplio", type: "city", region: "Peloponnese" },
  { slug: "sparta", name: "Sparta", type: "city", region: "Peloponnese" },
  { slug: "patras", name: "Patras", type: "city", region: "Peloponnese" },
  { slug: "koroni", name: "Koroni", type: "city", region: "Peloponnese" },
  { slug: "voidokilia-beach", name: "Voidokilia Beach", type: "beach", region: "Peloponnese" },
  { slug: "lefkada", name: "Lefkada Town", type: "city", island: "Lefkada" },
  { slug: "nikiana", name: "Nikiana", type: "resort", island: "Lefkada" },
  { slug: "vassiliki", name: "Vassiliki", type: "resort", island: "Lefkada" },

  // Islands
  { slug: "mykonos-town", name: "Mykonos Town", type: "city", island: "Mykonos" },
  { slug: "ornos", name: "Ornos", type: "beach", island: "Mykonos" },
  { slug: "halkidiki", name: "Halkidiki", type: "resort", region: "Central Macedonia" },
  { slug: "platys-yialos", name: "Platys Yialos", type: "beach", island: "Mykonos" },
  { slug: "psarou", name: "Psarou", type: "beach", island: "Mykonos" },
  { slug: "fira", name: "Fira", type: "city", island: "Santorini" },
  { slug: "oia", name: "Oia", type: "resort", island: "Santorini" },
  { slug: "perissa", name: "Perissa", type: "beach", island: "Santorini" },
  { slug: "kamari", name: "Kamari", type: "resort", island: "Santorini" },
  { slug: "imerovigli", name: "Imerovigli", type: "resort", island: "Santorini" },
  { slug: "corfu-town", name: "Corfu Town", type: "city", island: "Corfu" },
  { slug: "dassia", name: "Dassia", type: "resort", island: "Corfu" },
  { slug: "kavos", name: "Kavos", type: "resort", island: "Corfu" },
  { slug: "paleokastritsa", name: "Paleokastritsa", type: "resort", island: "Corfu" },
  { slug: "rhodes-town", name: "Rhodes Town", type: "city", island: "Rhodes" },
  { slug: "lindos", name: "Lindos", type: "resort", island: "Rhodes" },
  { slug: "faliraki", name: "Faliraki", type: "resort", island: "Rhodes" },
  { slug: "ialysos", name: "Ialysos", type: "resort", island: "Rhodes" },
  { slug: "zakynthos-town", name: "Zakynthos Town", type: "city", island: "Zakynthos" },
  { slug: "laganas", name: "Laganas", type: "resort", island: "Zakynthos" },
  { slug: "tsilivi", name: "Tsilivi", type: "resort", island: "Zakynthos" },
  { slug: "argostoli", name: "Argostoli", type: "city", island: "Kefalonia" },
  { slug: "lixouri", name: "Lixouri", type: "city", island: "Kefalonia" },
  { slug: "skala-kefalonia", name: "Skala", type: "resort", island: "Kefalonia" },
  { slug: "kos-town", name: "Kos Town", type: "city", island: "Kos" },
  { slug: "kardamena", name: "Kardamena", type: "resort", island: "Kos" },
  { slug: "mastichari", name: "Mastichari", type: "resort", island: "Kos" },
  { slug: "parikia", name: "Parikia", type: "city", island: "Paros" },
  { slug: "naoussa", name: "Naoussa", type: "resort", island: "Paros" },
  { slug: "naxos-town", name: "Naxos Town (Chora)", type: "city", island: "Naxos" },
  { slug: "agia-anna-naxos", name: "Agia Anna", type: "beach", island: "Naxos" },
  { slug: "adamas", name: "Adamas", type: "port", island: "Milos" },
  { slug: "plaka-milos", name: "Plaka", type: "city", island: "Milos" },
  { slug: "mytilene", name: "Mytilene", type: "city", island: "Lesbos" },
  { slug: "molyvos", name: "Molyvos", type: "resort", island: "Lesbos" },
];

export function getDestination(slug: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.slug === slug);
}

export function listCityDestinations(): Destination[] {
  return DESTINATIONS.filter((d) => d.type === "city");
}
