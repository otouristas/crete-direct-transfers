/** Curated worldwide airports & ports with coordinates for booking From/To. */

export type HubKind = "airport" | "port";

export type WorldHub = {
  id: string;
  kind: HubKind;
  label: string;
  aliases: string[];
  lat: number;
  lng: number;
  iata?: string;
  /** ISO 3166-1 alpha-2 */
  countryCode?: string;
  /** Prefer in empty-state quick picks */
  popular?: boolean;
};

export const WORLD_HUBS: WorldHub[] = [
  // —— Greece airports ——
  { id: "airport:HER", kind: "airport", label: "Heraklion Airport (HER)", aliases: ["Crete Heraklion", "Nikos Kazantzakis", "HER"], lat: 35.3397, lng: 25.1803, iata: "HER", popular: true },
  { id: "airport:CHQ", kind: "airport", label: "Chania Airport (CHQ)", aliases: ["Crete Chania", "Ioannis Daskalogiannis", "CHQ"], lat: 35.5317, lng: 24.1497, iata: "CHQ", popular: true },
  { id: "airport:JSH", kind: "airport", label: "Sitia Airport (JSH)", aliases: ["Sitia", "JSH"], lat: 35.2161, lng: 26.1014, iata: "JSH" },
  { id: "airport:ATH", kind: "airport", label: "Athens Airport (ATH)", aliases: ["Eleftherios Venizelos", "Athens International", "ATH"], lat: 37.9364, lng: 23.9445, iata: "ATH", popular: true },
  { id: "airport:SKG", kind: "airport", label: "Thessaloniki Airport (SKG)", aliases: ["Macedonia Airport", "SKG"], lat: 40.5197, lng: 22.9709, iata: "SKG" },
  { id: "airport:RHO", kind: "airport", label: "Rhodes Airport (RHO)", aliases: ["Diagoras", "RHO"], lat: 36.4054, lng: 28.0862, iata: "RHO" },
  { id: "airport:CFU", kind: "airport", label: "Corfu Airport (CFU)", aliases: ["Ioannis Kapodistrias", "CFU"], lat: 39.6019, lng: 19.9117, iata: "CFU" },
  { id: "airport:JTR", kind: "airport", label: "Santorini Airport (JTR)", aliases: ["Thira", "JTR"], lat: 36.3992, lng: 25.4793, iata: "JTR" },
  { id: "airport:JMK", kind: "airport", label: "Mykonos Airport (JMK)", aliases: ["JMK"], lat: 37.4351, lng: 25.3481, iata: "JMK" },
  { id: "airport:ZTH", kind: "airport", label: "Zakynthos Airport (ZTH)", aliases: ["Dionysios Solomos", "ZTH"], lat: 37.7509, lng: 20.8843, iata: "ZTH" },
  { id: "airport:KGS", kind: "airport", label: "Kos Airport (KGS)", aliases: ["Hippocrates", "KGS"], lat: 36.7933, lng: 27.0917, iata: "KGS" },
  { id: "airport:EFL", kind: "airport", label: "Kefalonia Airport (EFL)", aliases: ["EFL"], lat: 38.1201, lng: 20.5005, iata: "EFL" },
  { id: "airport:PVK", kind: "airport", label: "Preveza Airport (PVK)", aliases: ["Aktion", "Lefkada", "PVK"], lat: 38.9255, lng: 20.7653, iata: "PVK" },
  { id: "airport:KLX", kind: "airport", label: "Kalamata Airport (KLX)", aliases: ["KLX"], lat: 37.0683, lng: 22.0255, iata: "KLX" },
  { id: "airport:MJT", kind: "airport", label: "Mytilene Airport (MJT)", aliases: ["Lesbos", "MJT"], lat: 39.0567, lng: 26.5983, iata: "MJT" },
  { id: "airport:PAS", kind: "airport", label: "Paros Airport (PAS)", aliases: ["PAS"], lat: 37.0103, lng: 25.1278, iata: "PAS" },
  { id: "airport:JNX", kind: "airport", label: "Naxos Airport (JNX)", aliases: ["JNX"], lat: 37.0811, lng: 25.3681, iata: "JNX" },
  { id: "airport:MLO", kind: "airport", label: "Milos Airport (MLO)", aliases: ["MLO"], lat: 36.6969, lng: 24.4769, iata: "MLO" },

  // —— Europe airports ——
  { id: "airport:LHR", kind: "airport", label: "London Heathrow (LHR)", aliases: ["Heathrow", "LHR"], lat: 51.47, lng: -0.4543, iata: "LHR", popular: true },
  { id: "airport:LGW", kind: "airport", label: "London Gatwick (LGW)", aliases: ["Gatwick", "LGW"], lat: 51.1537, lng: -0.1821, iata: "LGW" },
  { id: "airport:STN", kind: "airport", label: "London Stansted (STN)", aliases: ["Stansted", "STN"], lat: 51.885, lng: 0.235, iata: "STN" },
  { id: "airport:CDG", kind: "airport", label: "Paris Charles de Gaulle (CDG)", aliases: ["CDG", "Roissy"], lat: 49.0097, lng: 2.5479, iata: "CDG", popular: true },
  { id: "airport:ORY", kind: "airport", label: "Paris Orly (ORY)", aliases: ["Orly", "ORY"], lat: 48.7233, lng: 2.3794, iata: "ORY" },
  { id: "airport:AMS", kind: "airport", label: "Amsterdam Schiphol (AMS)", aliases: ["Schiphol", "AMS"], lat: 52.3105, lng: 4.7683, iata: "AMS", popular: true },
  { id: "airport:FRA", kind: "airport", label: "Frankfurt Airport (FRA)", aliases: ["FRA"], lat: 50.0379, lng: 8.5622, iata: "FRA" },
  { id: "airport:MUC", kind: "airport", label: "Munich Airport (MUC)", aliases: ["MUC"], lat: 48.3537, lng: 11.775, iata: "MUC" },
  { id: "airport:BER", kind: "airport", label: "Berlin Brandenburg (BER)", aliases: ["BER"], lat: 52.3667, lng: 13.5033, iata: "BER" },
  { id: "airport:FCO", kind: "airport", label: "Rome Fiumicino (FCO)", aliases: ["Leonardo da Vinci", "FCO"], lat: 41.8003, lng: 12.2389, iata: "FCO", popular: true },
  { id: "airport:MXP", kind: "airport", label: "Milan Malpensa (MXP)", aliases: ["Malpensa", "MXP"], lat: 45.6306, lng: 8.7281, iata: "MXP" },
  { id: "airport:LIN", kind: "airport", label: "Milan Linate (LIN)", aliases: ["Linate", "LIN"], lat: 45.4451, lng: 9.2767, iata: "LIN" },
  { id: "airport:BCN", kind: "airport", label: "Barcelona Airport (BCN)", aliases: ["El Prat", "BCN"], lat: 41.2971, lng: 2.0785, iata: "BCN" },
  { id: "airport:MAD", kind: "airport", label: "Madrid Barajas (MAD)", aliases: ["Adolfo Suárez", "MAD"], lat: 40.4983, lng: -3.5676, iata: "MAD" },
  { id: "airport:LIS", kind: "airport", label: "Lisbon Airport (LIS)", aliases: ["Humberto Delgado", "LIS"], lat: 38.7742, lng: -9.1342, iata: "LIS" },
  { id: "airport:VIE", kind: "airport", label: "Vienna Airport (VIE)", aliases: ["Schwechat", "VIE"], lat: 48.1103, lng: 16.5697, iata: "VIE" },
  { id: "airport:ZRH", kind: "airport", label: "Zurich Airport (ZRH)", aliases: ["ZRH"], lat: 47.4647, lng: 8.5492, iata: "ZRH" },
  { id: "airport:GVA", kind: "airport", label: "Geneva Airport (GVA)", aliases: ["GVA"], lat: 46.2381, lng: 6.1089, iata: "GVA" },
  { id: "airport:BRU", kind: "airport", label: "Brussels Airport (BRU)", aliases: ["Zaventem", "BRU"], lat: 50.9014, lng: 4.4844, iata: "BRU" },
  { id: "airport:CPH", kind: "airport", label: "Copenhagen Airport (CPH)", aliases: ["Kastrup", "CPH"], lat: 55.618, lng: 12.656, iata: "CPH" },
  { id: "airport:OSL", kind: "airport", label: "Oslo Airport (OSL)", aliases: ["Gardermoen", "OSL"], lat: 60.1939, lng: 11.1004, iata: "OSL" },
  { id: "airport:ARN", kind: "airport", label: "Stockholm Arlanda (ARN)", aliases: ["Arlanda", "ARN"], lat: 59.6519, lng: 17.9186, iata: "ARN" },
  { id: "airport:HEL", kind: "airport", label: "Helsinki Airport (HEL)", aliases: ["Vantaa", "HEL"], lat: 60.3172, lng: 24.9633, iata: "HEL" },
  { id: "airport:DUB", kind: "airport", label: "Dublin Airport (DUB)", aliases: ["DUB"], lat: 53.4213, lng: -6.2701, iata: "DUB" },
  { id: "airport:MAN", kind: "airport", label: "Manchester Airport (MAN)", aliases: ["MAN"], lat: 53.3537, lng: -2.27495, iata: "MAN" },
  { id: "airport:EDI", kind: "airport", label: "Edinburgh Airport (EDI)", aliases: ["EDI"], lat: 55.95, lng: -3.3725, iata: "EDI" },
  { id: "airport:IST", kind: "airport", label: "Istanbul Airport (IST)", aliases: ["IST"], lat: 41.2753, lng: 28.7519, iata: "IST", popular: true },
  { id: "airport:SAW", kind: "airport", label: "Istanbul Sabiha Gökçen (SAW)", aliases: ["SAW"], lat: 40.8986, lng: 29.3092, iata: "SAW" },
  { id: "airport:PRG", kind: "airport", label: "Prague Airport (PRG)", aliases: ["Václav Havel", "PRG"], lat: 50.1008, lng: 14.26, iata: "PRG" },
  { id: "airport:BUD", kind: "airport", label: "Budapest Airport (BUD)", aliases: ["Ferenc Liszt", "BUD"], lat: 47.4394, lng: 19.2618, iata: "BUD" },
  { id: "airport:WAW", kind: "airport", label: "Warsaw Chopin (WAW)", aliases: ["WAW"], lat: 52.1657, lng: 20.9671, iata: "WAW" },
  { id: "airport:OTP", kind: "airport", label: "Bucharest Otopeni (OTP)", aliases: ["Henri Coandă", "OTP"], lat: 44.5711, lng: 26.085, iata: "OTP" },
  { id: "airport:SOF", kind: "airport", label: "Sofia Airport (SOF)", aliases: ["SOF"], lat: 42.6955, lng: 23.4062, iata: "SOF" },
  { id: "airport:ZAG", kind: "airport", label: "Zagreb Airport (ZAG)", aliases: ["ZAG"], lat: 45.7429, lng: 16.0688, iata: "ZAG" },
  { id: "airport:DBV", kind: "airport", label: "Dubrovnik Airport (DBV)", aliases: ["DBV"], lat: 42.5614, lng: 18.2682, iata: "DBV" },
  { id: "airport:SPU", kind: "airport", label: "Split Airport (SPU)", aliases: ["SPU"], lat: 43.5389, lng: 16.298, iata: "SPU" },
  { id: "airport:TIA", kind: "airport", label: "Tirana Airport (TIA)", aliases: ["Nënë Tereza", "TIA"], lat: 41.4147, lng: 19.7206, iata: "TIA" },
  { id: "airport:MLA", kind: "airport", label: "Malta Airport (MLA)", aliases: ["MLA"], lat: 35.8575, lng: 14.4775, iata: "MLA" },
  { id: "airport:LCA", kind: "airport", label: "Larnaca Airport (LCA)", aliases: ["LCA"], lat: 34.8751, lng: 33.6249, iata: "LCA" },
  { id: "airport:TLV", kind: "airport", label: "Tel Aviv Ben Gurion (TLV)", aliases: ["Ben Gurion", "TLV"], lat: 32.0114, lng: 34.8867, iata: "TLV" },
  { id: "airport:CAI", kind: "airport", label: "Cairo Airport (CAI)", aliases: ["CAI"], lat: 30.1219, lng: 31.4056, iata: "CAI" },

  // —— Middle East / Asia / Americas / Oceania ——
  { id: "airport:DXB", kind: "airport", label: "Dubai International (DXB)", aliases: ["DXB"], lat: 25.2532, lng: 55.3657, iata: "DXB", popular: true },
  { id: "airport:AUH", kind: "airport", label: "Abu Dhabi Airport (AUH)", aliases: ["AUH"], lat: 24.433, lng: 54.6511, iata: "AUH" },
  { id: "airport:DOH", kind: "airport", label: "Doha Hamad (DOH)", aliases: ["Hamad", "DOH"], lat: 25.2731, lng: 51.6081, iata: "DOH" },
  { id: "airport:SIN", kind: "airport", label: "Singapore Changi (SIN)", aliases: ["Changi", "SIN"], lat: 1.3644, lng: 103.9915, iata: "SIN", popular: true },
  { id: "airport:HKG", kind: "airport", label: "Hong Kong International (HKG)", aliases: ["HKG"], lat: 22.308, lng: 113.9185, iata: "HKG" },
  { id: "airport:NRT", kind: "airport", label: "Tokyo Narita (NRT)", aliases: ["Narita", "NRT"], lat: 35.7647, lng: 140.3863, iata: "NRT" },
  { id: "airport:HND", kind: "airport", label: "Tokyo Haneda (HND)", aliases: ["Haneda", "HND"], lat: 35.5494, lng: 139.7798, iata: "HND" },
  { id: "airport:ICN", kind: "airport", label: "Seoul Incheon (ICN)", aliases: ["Incheon", "ICN"], lat: 37.4602, lng: 126.4407, iata: "ICN" },
  { id: "airport:BKK", kind: "airport", label: "Bangkok Suvarnabhumi (BKK)", aliases: ["Suvarnabhumi", "BKK"], lat: 13.69, lng: 100.7501, iata: "BKK" },
  { id: "airport:KUL", kind: "airport", label: "Kuala Lumpur Airport (KUL)", aliases: ["KUL"], lat: 2.7456, lng: 101.7099, iata: "KUL" },
  { id: "airport:DEL", kind: "airport", label: "Delhi Indira Gandhi (DEL)", aliases: ["DEL"], lat: 28.5562, lng: 77.1, iata: "DEL" },
  { id: "airport:BOM", kind: "airport", label: "Mumbai Airport (BOM)", aliases: ["Chhatrapati Shivaji", "BOM"], lat: 19.0896, lng: 72.8656, iata: "BOM" },
  { id: "airport:SYD", kind: "airport", label: "Sydney Airport (SYD)", aliases: ["Kingsford Smith", "SYD"], lat: -33.9399, lng: 151.1753, iata: "SYD" },
  { id: "airport:MEL", kind: "airport", label: "Melbourne Airport (MEL)", aliases: ["Tullamarine", "MEL"], lat: -37.669, lng: 144.841, iata: "MEL" },
  { id: "airport:JFK", kind: "airport", label: "New York JFK (JFK)", aliases: ["John F Kennedy", "JFK"], lat: 40.6413, lng: -73.7781, iata: "JFK", popular: true },
  { id: "airport:EWR", kind: "airport", label: "Newark Liberty (EWR)", aliases: ["EWR"], lat: 40.6895, lng: -74.1745, iata: "EWR" },
  { id: "airport:LGA", kind: "airport", label: "New York LaGuardia (LGA)", aliases: ["LaGuardia", "LGA"], lat: 40.7769, lng: -73.874, iata: "LGA" },
  { id: "airport:LAX", kind: "airport", label: "Los Angeles Airport (LAX)", aliases: ["LAX"], lat: 33.9425, lng: -118.4081, iata: "LAX", popular: true },
  { id: "airport:SFO", kind: "airport", label: "San Francisco Airport (SFO)", aliases: ["SFO"], lat: 37.6213, lng: -122.379, iata: "SFO" },
  { id: "airport:ORD", kind: "airport", label: "Chicago O'Hare (ORD)", aliases: ["OHare", "ORD"], lat: 41.9742, lng: -87.9073, iata: "ORD" },
  { id: "airport:MIA", kind: "airport", label: "Miami Airport (MIA)", aliases: ["MIA"], lat: 25.7959, lng: -80.287, iata: "MIA" },
  { id: "airport:YYZ", kind: "airport", label: "Toronto Pearson (YYZ)", aliases: ["Pearson", "YYZ"], lat: 43.6777, lng: -79.6248, iata: "YYZ" },
  { id: "airport:YVR", kind: "airport", label: "Vancouver Airport (YVR)", aliases: ["YVR"], lat: 49.1967, lng: -123.1815, iata: "YVR" },
  { id: "airport:GRU", kind: "airport", label: "São Paulo Guarulhos (GRU)", aliases: ["Guarulhos", "GRU"], lat: -23.4356, lng: -46.4731, iata: "GRU" },
  { id: "airport:EZE", kind: "airport", label: "Buenos Aires Ezeiza (EZE)", aliases: ["Ezeiza", "EZE"], lat: -34.8222, lng: -58.5358, iata: "EZE" },
  { id: "airport:JNB", kind: "airport", label: "Johannesburg OR Tambo (JNB)", aliases: ["OR Tambo", "JNB"], lat: -26.1392, lng: 28.246, iata: "JNB" },
  { id: "airport:CPT", kind: "airport", label: "Cape Town Airport (CPT)", aliases: ["CPT"], lat: -33.9648, lng: 18.6017, iata: "CPT" },

  // —— Greece / Med ports ——
  { id: "port:piraeus", kind: "port", label: "Piraeus Port", aliases: ["Piraeus", "Πειραιάς"], lat: 37.942, lng: 23.6465, popular: true, countryCode: "GR" },
  { id: "port:rafina", kind: "port", label: "Rafina Port", aliases: ["Rafina"], lat: 38.023, lng: 24.01, countryCode: "GR" },
  { id: "port:lavrio", kind: "port", label: "Lavrio Port", aliases: ["Lavrio", "Lavrion"], lat: 37.7144, lng: 24.0631, countryCode: "GR" },
  { id: "port:alimos", kind: "port", label: "Alimos Marina", aliases: ["Alimos"], lat: 37.911, lng: 23.702, countryCode: "GR" },
  { id: "port:souda", kind: "port", label: "Souda Port (Chania)", aliases: ["Souda", "Chania Port", "Σούδα"], lat: 35.488, lng: 24.07, popular: true, countryCode: "GR" },
  { id: "port:heraklion", kind: "port", label: "Heraklion Port", aliases: ["Heraklion Ferry", "Ηράκλειο λιμάνι"], lat: 35.341, lng: 25.143, popular: true, countryCode: "GR" },
  { id: "port:rethymno", kind: "port", label: "Rethymno Port", aliases: ["Rethymno"], lat: 35.368, lng: 24.482, countryCode: "GR" },
  { id: "port:agios-nikolaos", kind: "port", label: "Agios Nikolaos Port", aliases: ["Agios Nikolaos"], lat: 35.19, lng: 25.717, countryCode: "GR" },
  { id: "port:kissamos", kind: "port", label: "Kissamos Port", aliases: ["Kissamos", "Kastelli"], lat: 35.494, lng: 23.654, countryCode: "GR" },
  { id: "port:mykonos-new", kind: "port", label: "Mykonos New Port", aliases: ["Tourlos", "Mykonos Port"], lat: 37.464, lng: 25.325, countryCode: "GR" },
  { id: "port:athinios", kind: "port", label: "Santorini Athinios Port", aliases: ["Athinios", "Santorini Port"], lat: 36.386, lng: 25.428, countryCode: "GR" },
  { id: "port:rhodes", kind: "port", label: "Rhodes Mandraki Port", aliases: ["Mandraki", "Rhodes Port"], lat: 36.451, lng: 28.227, countryCode: "GR" },
  { id: "port:corfu", kind: "port", label: "Corfu Port", aliases: ["Corfu New Port"], lat: 39.629, lng: 19.905, countryCode: "GR" },
  { id: "port:parikia", kind: "port", label: "Parikia Port (Paros)", aliases: ["Parikia"], lat: 37.085, lng: 25.15, countryCode: "GR" },
  { id: "port:naxos", kind: "port", label: "Naxos Port", aliases: ["Naxos Chora"], lat: 37.105, lng: 25.377, countryCode: "GR" },
  { id: "port:adamas", kind: "port", label: "Adamas Port (Milos)", aliases: ["Adamas"], lat: 36.725, lng: 24.447, countryCode: "GR" },
  { id: "port:kos", kind: "port", label: "Kos Port", aliases: ["Kos Town Port"], lat: 36.893, lng: 27.288, countryCode: "GR" },
  { id: "port:zakynthos", kind: "port", label: "Zakynthos Port", aliases: ["Zante Port"], lat: 37.783, lng: 20.899, countryCode: "GR" },
  { id: "port:igoumenitsa", kind: "port", label: "Igoumenitsa Port", aliases: ["Igoumenitsa"], lat: 39.503, lng: 20.266, countryCode: "GR" },
  { id: "port:patras", kind: "port", label: "Patras Port", aliases: ["Patras"], lat: 38.25, lng: 21.735, countryCode: "GR" },
  { id: "port:volos", kind: "port", label: "Volos Port", aliases: ["Volos"], lat: 39.358, lng: 22.943, countryCode: "GR" },

  // —— World ports ——
  { id: "port:barcelona", kind: "port", label: "Barcelona Cruise Port", aliases: ["Port of Barcelona"], lat: 41.354, lng: 2.17, countryCode: "ES" },
  { id: "port:civita", kind: "port", label: "Civitavecchia Port (Rome)", aliases: ["Civitavecchia"], lat: 42.094, lng: 11.79, countryCode: "IT" },
  { id: "port:naples", kind: "port", label: "Naples Port", aliases: ["Napoli"], lat: 40.842, lng: 14.26, countryCode: "IT" },
  { id: "port:genoa", kind: "port", label: "Genoa Port", aliases: ["Genova"], lat: 44.404, lng: 8.917, countryCode: "IT" },
  { id: "port:venice", kind: "port", label: "Venice Cruise Terminal", aliases: ["Venezia", "Marittima"], lat: 45.44, lng: 12.31, countryCode: "IT" },
  { id: "port:marseille", kind: "port", label: "Marseille Port", aliases: ["Marseille"], lat: 43.34, lng: 5.34, countryCode: "FR" },
  { id: "port:nice", kind: "port", label: "Nice Port", aliases: ["Port Lympia"], lat: 43.695, lng: 7.285, countryCode: "FR" },
  { id: "port:southampton", kind: "port", label: "Southampton Cruise Port", aliases: ["Southampton"], lat: 50.897, lng: -1.405, countryCode: "GB" },
  { id: "port:dover", kind: "port", label: "Dover Port", aliases: ["Dover"], lat: 51.127, lng: 1.327, countryCode: "GB" },
  { id: "port:rotterdam", kind: "port", label: "Rotterdam Cruise Port", aliases: ["Rotterdam"], lat: 51.904, lng: 4.482, countryCode: "NL" },
  { id: "port:hamburg", kind: "port", label: "Hamburg Cruise Center", aliases: ["Hamburg"], lat: 53.54, lng: 9.98, countryCode: "DE" },
  { id: "port:istanbul", kind: "port", label: "Istanbul Galataport", aliases: ["Galataport", "Karaköy"], lat: 41.026, lng: 28.984, countryCode: "TR" },
  { id: "port:dubai", kind: "port", label: "Dubai Cruise Terminal", aliases: ["Port Rashid"], lat: 25.267, lng: 55.277, countryCode: "AE" },
  { id: "port:miami", kind: "port", label: "Port of Miami", aliases: ["Miami Cruise"], lat: 25.779, lng: -80.17, countryCode: "US" },
  { id: "port:barcelona-ferry", kind: "port", label: "Barcelona Ferry Terminal", aliases: [], lat: 41.345, lng: 2.165, countryCode: "ES" },
  { id: "port:split", kind: "port", label: "Split Port", aliases: ["Split"], lat: 43.504, lng: 16.44, countryCode: "HR" },
  { id: "port:dubrovnik", kind: "port", label: "Dubrovnik Port (Gruž)", aliases: ["Gruž"], lat: 42.659, lng: 18.085, countryCode: "HR" },
  { id: "port:valletta", kind: "port", label: "Valletta Cruise Port", aliases: ["Valletta"], lat: 35.893, lng: 14.511, countryCode: "MT" },
  { id: "port:limassol", kind: "port", label: "Limassol Port", aliases: ["Limassol"], lat: 34.65, lng: 33.02, countryCode: "CY" },
];

/** Destination-style popular places with approximate coords (Crete + Attica). */
export const POPULAR_PLACES: {
  id: string;
  label: string;
  lat: number;
  lng: number;
  countryCode: string;
  aliases?: string[];
}[] = [
  { id: "place:heraklion", label: "Heraklion", lat: 35.3387, lng: 25.1442, countryCode: "GR", aliases: ["Iraklio"] },
  { id: "place:chania", label: "Chania", lat: 35.5138, lng: 24.018, countryCode: "GR" },
  { id: "place:rethymno", label: "Rethymno", lat: 35.3656, lng: 24.4823, countryCode: "GR" },
  { id: "place:agios-nikolaos", label: "Agios Nikolaos", lat: 35.1911, lng: 25.7152, countryCode: "GR" },
  { id: "place:elounda", label: "Elounda", lat: 35.257, lng: 25.728, countryCode: "GR" },
  { id: "place:hersonissos", label: "Hersonissos", lat: 35.312, lng: 25.391, countryCode: "GR" },
  { id: "place:platanias", label: "Platanias", lat: 35.516, lng: 23.867, countryCode: "GR" },
  { id: "place:athens", label: "Athens city center", lat: 37.9838, lng: 23.7275, countryCode: "GR" },
  { id: "place:glyfada", label: "Glyfada", lat: 37.865, lng: 23.753, countryCode: "GR" },
];

export function getHub(id: string): WorldHub | undefined {
  return WORLD_HUBS.find((h) => h.id === id);
}
