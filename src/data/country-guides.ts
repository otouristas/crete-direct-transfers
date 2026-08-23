/**
 * Editorial guide content for the country landing pages.
 *
 * These pages do double duty: a travel guide someone actually reads, and the
 * commercial hub for that market. Everything here is the reader-facing half —
 * airports, cities and prices come from the coverage data and are merged in by
 * <CountryHubPage>.
 *
 * English is the source. Translations live in src/i18n/content/overlays/<locale>.ts
 * under `countryGuides` and are merged by getLocalizedCountryGuide(); until a
 * locale supplies one, that locale falls back to this copy while the surrounding
 * page chrome still renders in the reader's language.
 */

export type GuideHighlight = {
  title: string;
  body: string;
  /** Matches a slug in the Pexels manifest, so the card gets a real photo. */
  citySlug?: string;
};

export type GuideSeason = {
  season: string;
  months: string;
  body: string;
};

export type GuideTip = {
  title: string;
  body: string;
};

export type GuideFact = {
  label: string;
  value: string;
};

export type CountryGuide = {
  slug: string;
  /** One line under the h1 — the promise of the place. */
  tagline: string;
  intro: string;
  facts: GuideFact[];
  highlights: GuideHighlight[];
  seasons: GuideSeason[];
  gettingAroundTitle: string;
  gettingAround: string[];
  knowBefore: GuideTip[];
  faqs: { q: string; a: string }[];
};

export const COUNTRY_GUIDES: CountryGuide[] = [
  // ------------------------------------------------------------------ GREECE
  {
    slug: "greece",
    tagline: "Six thousand islands, 227 inhabited, and a mainland most visitors never reach.",
    intro:
      "Greece is not one destination but several that happen to share a flag. The Cyclades sell whitewash and caldera sunsets; Crete is large enough to be its own country, with mountains that hold snow into May; the Ionian is green and Venetian; and the mainland — Athens, the Peloponnese, Meteora, Thessaloniki — carries most of the archaeology and almost none of the crowds. What connects them is a transport system built around ferries and a summer that runs long.",
    facts: [
      { label: "Currency", value: "Euro (€)" },
      { label: "Driving", value: "Right-hand side" },
      { label: "Language", value: "Greek — English widely spoken" },
      { label: "Peak season", value: "July to August" },
      { label: "Best value", value: "May, June, September" },
    ],
    highlights: [
      {
        title: "Crete",
        body: "The largest island and the only one that works as a standalone trip. Venetian harbours at Chania and Rethymno, the Samaria Gorge, Knossos outside Heraklion, and a south coast reachable only by boat or switchback road. Two international airports, so you can fly into one and out of the other.",
        citySlug: "chania",
      },
      {
        title: "Santorini",
        body: "The caldera is genuinely as advertised, and genuinely as busy. Fira and Oia take the crowds; Pyrgos, Megalochori and the eastern beaches at Perissa and Kamari do not. The airport sits in the middle of the island, twenty minutes from almost anywhere.",
        citySlug: "oia",
      },
      {
        title: "Athens",
        body: "Worth two days rather than the half-day most itineraries give it. The Acropolis Museum, the Sunday flea market at Monastiraki, and a restaurant scene that has quietly become one of Europe's best. It is also the ferry gateway — Piraeus is the largest passenger port in Europe.",
        citySlug: "athens",
      },
      {
        title: "The Ionian",
        body: "Corfu, Kefalonia, Zakynthos and Lefkada are greener, wetter and more Italian-influenced than the Aegean. Shorter season, softer landscape, and beaches — Myrtos, Porto Katsiki, Navagio — that photograph better than they swim.",
        citySlug: "corfu-town",
      },
      {
        title: "Rhodes and the Dodecanese",
        body: "The medieval old town at Rhodes is the largest inhabited one in Europe and a UNESCO site. Lindos sits an hour south under an acropolis. Kos, Symi and Patmos are a short hop by ferry.",
        citySlug: "lindos",
      },
      {
        title: "Thessaloniki and the north",
        body: "Greece's second city has the better food scene and a fraction of the visitors. It is the base for Halkidiki's three peninsulas and for Meteora, three hours inland, where monasteries sit on sandstone pillars.",
        citySlug: "thessaloniki",
      },
    ],
    seasons: [
      {
        season: "Spring",
        months: "April – June",
        body: "Wildflowers, open archaeological sites without queues, and sea warm enough to swim from mid-June. Ferry schedules thin until late May, so island-hopping needs more planning.",
      },
      {
        season: "High summer",
        months: "July – August",
        body: "Hot, busy and expensive. The meltemi wind cools the Cyclades but cancels ferries. Book accommodation and transfers well ahead; August is when availability actually runs out.",
      },
      {
        season: "Early autumn",
        months: "September – October",
        body: "The sweet spot. Sea at its warmest, crowds gone after the first week of September, prices down. Most island infrastructure stays open into mid-October.",
      },
      {
        season: "Winter",
        months: "November – March",
        body: "Athens, Thessaloniki and Crete stay fully open. Smaller islands largely close — limited ferries, most hotels shut. Good for cities and mountains, not for beaches.",
      },
    ],
    gettingAroundTitle: "Getting around Greece",
    gettingAround: [
      "Distances mislead. Greek roads are mountainous and rarely direct — a 90 km drive across Crete takes well over two hours, and the map will tell you one. Anything crossing a mountain range takes longer than it looks.",
      "Ferries are transport, not a day trip. Piraeus, Rafina and Lavrio serve the Cyclades; Patras serves Italy; Souda and Heraklion serve Crete. High-speed and conventional boats run the same routes at very different prices and durations, and the meltemi can cancel either in August.",
      "Island airports are small and seasonal. Santorini, Mykonos and Zakynthos handle enormous summer volumes through terminals built for a fraction of it. Arrivals halls get crowded; a driver waiting with a name sign is worth more here than almost anywhere.",
      "Taxi ranks at Greek airports are metered but subject to fixed airport surcharges, night rates and luggage fees that are not always posted. A price agreed in advance is the only way to know the total before you land.",
    ],
    knowBefore: [
      {
        title: "Crete books instantly, the rest is quote-confirmed",
        body: "We hold our own licensed fleet on Crete, so those transfers confirm immediately at a fixed price. Everywhere else in Greece we confirm your quote with a local partner before you pay — same fixed price, one extra step.",
      },
      {
        title: "Ferry ports are not near airports",
        body: "Piraeus is roughly an hour from Athens Airport in traffic, and the port is large enough that the wrong gate costs you the boat. Tell us your ferry and gate number and the driver will time the pickup to it.",
      },
      {
        title: "Cash still matters outside the cities",
        body: "Cards are accepted almost everywhere now, but village tavernas, small ferries and some rural fuel stations are cash-only. Draw euros before you leave the main towns.",
      },
      {
        title: "Sunday and afternoon closures",
        body: "Many shops outside tourist areas close Sunday and take a long afternoon break. Archaeological sites usually close by 15:00 in winter and stay open later in summer — check the day you go.",
      },
    ],
    faqs: [
      {
        q: "Is a private transfer worth it over a taxi in Greece?",
        a: "At the big airports the taxi rank works, but the fare is not fixed and surcharges apply for luggage, night pickups and the airport itself. On the islands the ranks are small and empty out fast in peak season. A pre-booked transfer fixes the price, guarantees a vehicle sized for your luggage, and puts a driver in arrivals with your name.",
      },
      {
        q: "How far ahead should I book for August?",
        a: "A week for the islands, longer for large groups or minibuses. August is the one month where availability genuinely runs out, particularly for vehicles carrying more than six passengers.",
      },
      {
        q: "Can you meet a ferry rather than a flight?",
        a: "Yes. Give us the boat and the port and we will time the pickup to the arrival, including at Piraeus, Rafina, Souda and Heraklion. Ferries run late more often than planes, and waiting time for a tracked arrival is included.",
      },
      {
        q: "Do you cover the smaller islands?",
        a: "We cover every island with a commercial airport or a significant ferry port, on a quote-confirmed basis outside Crete. If you are heading somewhere very small, send us the route and we will tell you honestly whether we have a licensed driver there.",
      },
    ],
  },

  // ------------------------------------------------------------------- SPAIN
  {
    slug: "spain",
    tagline: "Two archipelagos, a Mediterranean coast, and cities that eat at ten.",
    intro:
      "Spain absorbs more visitors than almost anywhere on earth and still manages to feel regional rather than generic. The Balearics and Canaries run on different rhythms and, in the Canaries' case, a different climate entirely. Andalusia is Moorish and hot; the Basque country is green and rainy; Madrid sits high on a plateau with brutal summers and cold winters. Distances are real, but the road and rail network is among Europe's best.",
    facts: [
      { label: "Currency", value: "Euro (€)" },
      { label: "Driving", value: "Right-hand side" },
      { label: "Language", value: "Spanish, plus Catalan, Basque and Galician" },
      { label: "Peak season", value: "July to August" },
      { label: "Best value", value: "April, May, October" },
    ],
    highlights: [
      {
        title: "Barcelona",
        body: "Gaudí, the Gothic Quarter and a city beach within walking distance of the old town. El Prat airport is fifteen minutes out, which is unusually close for a city this size — and the reason airport transfers here are cheap relative to the rest of Europe.",
        citySlug: "barcelona",
      },
      {
        title: "Madrid",
        body: "The Prado, the Reina Sofía and the Thyssen sit within a few hundred metres of each other. Barajas is a long, spread-out airport with four terminals; T4 and T4S are a shuttle ride apart, so confirm which one you land at.",
        citySlug: "madrid",
      },
      {
        title: "Andalusia",
        body: "Seville, Granada and Córdoba form a triangle you can drive in a week. The Alhambra needs tickets months ahead. Málaga airport serves the whole region and the Costa del Sol beyond it.",
        citySlug: "seville",
      },
      {
        title: "The Balearics",
        body: "Mallorca is far more than its reputation — the Serra de Tramuntana is a UNESCO landscape and the island is big enough to hide in. Ibiza has a quiet north that has nothing to do with the clubs.",
        citySlug: "mallorca",
      },
      {
        title: "The Canaries",
        body: "Subtropical and year-round: 22°C in January is normal. Tenerife and Gran Canaria have the flight connections; the volcanic interiors are the reason to leave the coast.",
        citySlug: "tenerife",
      },
      {
        title: "Valencia and the east",
        body: "The City of Arts and Sciences, the original paella, and a beach the city actually uses. Quieter than Barcelona and considerably cheaper.",
        citySlug: "valencia",
      },
    ],
    seasons: [
      {
        season: "Spring",
        months: "April – June",
        body: "The best time for Andalusia before the heat arrives. Semana Santa and the Feria de Abril fill Seville — spectacular, but book everything far ahead.",
      },
      {
        season: "High summer",
        months: "July – August",
        body: "Coastal and island Spain is at capacity; inland cities can pass 40°C. Madrid empties in August as locals leave. The Canaries stay mild.",
      },
      {
        season: "Autumn",
        months: "September – October",
        body: "Warm sea, thinner crowds, and the interior finally comfortable. Arguably the best all-round month is September.",
      },
      {
        season: "Winter",
        months: "November – March",
        body: "Cities stay busy and cheap. The Canaries are a genuine winter beach destination; the Balearics largely close down.",
      },
    ],
    gettingAroundTitle: "Getting around Spain",
    gettingAround: [
      "The AVE high-speed rail network is fast and genuinely competitive with flying between major cities — Madrid to Barcelona takes under three hours centre to centre. Transfers to and from stations matter as much as airport runs here.",
      "Spanish airports are large and spread out. Madrid-Barajas has four terminals connected by shuttle; Barcelona's T1 and T2 are a bus ride apart. Knowing your terminal changes where your driver meets you.",
      "Island airports spike hard in summer. Palma, Ibiza and Alicante handle huge seasonal charter volumes, and the taxi ranks reflect it — queues of an hour are normal in August.",
      "Coastal resorts are often a long way from the airport they are sold under. Some Costa del Sol hotels are ninety minutes from Málaga; parts of the Costa Blanca are an hour from Alicante. Check the drive time before you assume it is short.",
    ],
    knowBefore: [
      {
        title: "Transfers here are quote-confirmed",
        body: "We work with licensed local partners across Spain. You send the route, we come back with a fixed price confirmed by a specific operator, and you pay once you accept it — no meter, no surge.",
      },
      {
        title: "Dinner starts late",
        body: "Kitchens in most of Spain open around 20:30 and fill after 22:00. Booking an early transfer to a restaurant will usually get you there before it opens.",
      },
      {
        title: "Tolls on the AP motorways",
        body: "Many coastal motorways are tolled and the free alternatives are much slower. Any tolls on your route are included in the quoted price — we do not add them afterwards.",
      },
      {
        title: "August is a national holiday month",
        body: "Much of the country takes August off. City restaurants close, and resort areas run at full capacity. Book vehicles early, especially anything over six seats.",
      },
    ],
    faqs: [
      {
        q: "How far is Málaga airport from the Costa del Sol resorts?",
        a: "Torremolinos is fifteen minutes, Marbella around forty-five, and Estepona or Sotogrande closer to ninety. The 'Costa del Sol' label covers well over a hundred kilometres of coast, so check your hotel's actual location before assuming a short hop.",
      },
      {
        q: "Which Madrid terminal will my driver meet me at?",
        a: "Whichever one you land at — tell us your flight number and we track it. T4 and T4S are a shuttle apart from T1–T3, so this matters more at Barajas than at most airports.",
      },
      {
        q: "Do you serve the Canary Islands?",
        a: "Yes, through Tenerife South and Gran Canaria, on a quote-confirmed basis. Send the resort and we will price the transfer including any island-specific surcharges up front.",
      },
      {
        q: "Can you handle golf clubs, skis or surfboards?",
        a: "Yes, but tell us when you book. Outsized luggage changes the vehicle class, and turning up with four sets of clubs for a saloon car is the one thing that genuinely cannot be fixed on the day.",
      },
    ],
  },

  // ------------------------------------------------------------------- ITALY
  {
    slug: "italy",
    tagline: "Twenty regions that argue about food, and two islands that argue with the mainland.",
    intro:
      "Italy rewards going slowly and punishes trying to see it all. The north is Alpine and industrial; Tuscany and Umbria are the postcard; Rome is layered on itself to a depth of thirty metres; the south and the islands are hotter, poorer, and for many visitors the most memorable part. Rail links the cities well, but the countryside — the part most people come for — needs a car or a driver.",
    facts: [
      { label: "Currency", value: "Euro (€)" },
      { label: "Driving", value: "Right-hand side" },
      { label: "Language", value: "Italian — English varies sharply by region" },
      { label: "Peak season", value: "June to August" },
      { label: "Best value", value: "April, May, September, October" },
    ],
    highlights: [
      {
        title: "Rome",
        body: "The Forum, the Vatican and the Pantheon are the headline, but the city is best in the gaps between them. Fiumicino is forty-five minutes out; Ciampino serves low-cost carriers and is closer but smaller.",
        citySlug: "rome",
      },
      {
        title: "The Amalfi Coast",
        body: "Positano, Amalfi and Ravello sit on a road carved into a cliff, and that road is the whole problem — it is narrow, busy and slow, and larger vehicles are restricted in summer. Naples airport is the gateway; the drive is around ninety minutes and worth doing with someone who knows it.",
        citySlug: "naples-amalfi",
      },
      {
        title: "Florence and Tuscany",
        body: "The city is small enough to walk and has a ZTL that fines you for driving into it. The countryside — Chianti, Val d'Orcia, San Gimignano — is the reason to have a driver rather than a rental you cannot park.",
        citySlug: "florence",
      },
      {
        title: "Venice",
        body: "No cars, at all. Vehicles stop at Piazzale Roma or Tronchetto and everything beyond is on foot or by water. Marco Polo airport connects by road to Piazzale Roma or directly by water taxi.",
        citySlug: "venice",
      },
      {
        title: "Sicily",
        body: "Big, hot and layered with Greek, Arab and Norman history. Palermo and Catania are three hours apart by motorway and feel like different countries. Etna is active and visitable.",
        citySlug: "palermo",
      },
      {
        title: "Puglia",
        body: "The heel: trulli at Alberobello, baroque Lecce, and a coastline that is only recently busy. Bari and Brindisi are the airports, and distances between towns are longer than they look.",
        citySlug: "bari-puglia",
      },
    ],
    seasons: [
      {
        season: "Spring",
        months: "April – May",
        body: "Ideal for cities and hill towns. Easter fills Rome and Florence. The Amalfi Coast starts opening in April and is not fully awake until May.",
      },
      {
        season: "High summer",
        months: "June – August",
        body: "Hot and crowded everywhere. August sees Italians take their own holidays — cities empty, coasts fill, and many urban restaurants close for two weeks around Ferragosto.",
      },
      {
        season: "Autumn",
        months: "September – October",
        body: "The best compromise: warm, harvest season in Tuscany and Piedmont, and the coasts still swimmable into early October.",
      },
      {
        season: "Winter",
        months: "November – March",
        body: "Cities are at their cheapest and quietest. The Alps and Dolomites open for skiing. Coastal resorts and the Amalfi road largely shut.",
      },
    ],
    gettingAroundTitle: "Getting around Italy",
    gettingAround: [
      "ZTL zones will fine you. Almost every historic centre restricts traffic, cameras enforce it automatically, and fines arrive months later via your rental company. Licensed drivers hold the permits that private cars do not.",
      "The Amalfi and Sorrento roads restrict large vehicles in summer. Minibuses face seasonal limits on the SS163, which affects group transfers directly — we will tell you at quote time if your group needs splitting across two vehicles.",
      "Trains are excellent between cities and useless to the countryside. Rome–Florence–Milan is faster by rail than by air. Everything off that spine is road.",
      "Airport distances vary wildly. Fiumicino is 45 minutes from central Rome, Milan Malpensa closer to an hour, and Venice Marco Polo needs a boat for the last leg. None of them are as close as the booking site implies.",
    ],
    knowBefore: [
      {
        title: "Transfers here are quote-confirmed",
        body: "We price your route with a licensed Italian operator and confirm the total before you pay. That matters more in Italy than most markets, because ZTL permits and coastal vehicle restrictions have to be checked per route.",
      },
      {
        title: "Venice ends where the water starts",
        body: "Your driver can reach Piazzale Roma and no further. If your hotel is deep in the city, plan the last leg by vaporetto or water taxi and pack accordingly — there are a lot of bridges and no wheels.",
      },
      {
        title: "Ferragosto closes things",
        body: "Around 15 August much of the country shuts. Restaurants, shops and small businesses close for a fortnight. Transport still runs, but book it earlier than you would otherwise.",
      },
      {
        title: "Coperto is not a tip",
        body: "The per-person cover charge on your restaurant bill is standard and not service. Rounding up is normal; the fifteen to twenty percent expected in the US is not.",
      },
    ],
    faqs: [
      {
        q: "Can you drive me into a ZTL zone?",
        a: "Licensed transfer vehicles can access most restricted centres where private cars cannot, but rules differ by city and some addresses are genuinely unreachable. Give us the exact hotel address at quote time and we will confirm how close we can get.",
      },
      {
        q: "How long is Naples airport to Positano?",
        a: "Around ninety minutes in normal conditions and considerably more in July and August, when the coastal road backs up. Booking a fixed price means the traffic is our problem rather than a meter running.",
      },
      {
        q: "Is a transfer better than the train from Rome airport?",
        a: "The Leonardo Express is fast and cheap if your hotel is near Termini. If it is not — or you have luggage, children, or an early flight — a door-to-door transfer usually wins on both time and stress.",
      },
      {
        q: "Do you cover Sardinia and Sicily?",
        a: "Yes, through Cagliari, Palermo and Catania. Island transfers are quote-confirmed like the mainland, and cross-island routes are priced as long-distance rather than airport runs.",
      },
    ],
  },

  // ---------------------------------------------------------------- PORTUGAL
  {
    slug: "portugal",
    tagline: "Atlantic rather than Mediterranean — cooler water, bigger waves, longer light.",
    intro:
      "Portugal is small enough to cross in a day and varied enough that you should not. Lisbon and Porto are hill cities built on rivers; the Alentejo between them is empty, flat and hot; the Algarve is the beach country everyone knows. Then there are the Atlantic islands — Madeira, subtropical and volcanic, and the Azores, nine islands most visitors have never considered. The water is colder than the Mediterranean everywhere. That is the trade for the surf.",
    facts: [
      { label: "Currency", value: "Euro (€)" },
      { label: "Driving", value: "Right-hand side" },
      { label: "Language", value: "Portuguese — English widely spoken" },
      { label: "Peak season", value: "July to August" },
      { label: "Best value", value: "May, June, September" },
    ],
    highlights: [
      {
        title: "Lisbon",
        body: "Seven hills, tiled facades and trams that are genuinely public transport rather than a ride. Sintra is forty minutes out and worth a full day. Humberto Delgado airport sits inside the city, which is rare and convenient.",
        citySlug: "lisbon",
      },
      {
        title: "Porto and the Douro",
        body: "The port lodges are in Vila Nova de Gaia across the river. Upstream, the Douro valley is terraced vineyard for a hundred kilometres and one of the most beautiful drives in Europe.",
        citySlug: "porto",
      },
      {
        title: "The Algarve",
        body: "Faro is the airport; the coast runs a long way either side of it. The west near Sagres is wild and windy, the centre around Lagos and Albufeira is developed, and the east towards Tavira is quieter and flatter.",
        citySlug: "algarve",
      },
      {
        title: "Madeira",
        body: "Subtropical, mountainous and green year-round, with levada walks cut into the hillsides. Funchal's airport has a famously short runway on stilts; the drive to most hotels is short but steep.",
        citySlug: "funchal",
      },
      {
        title: "The Azores",
        body: "Nine volcanic islands in the mid-Atlantic. São Miguel has the crater lakes and most of the flights; the others are progressively quieter. Weather changes hourly and the whale watching is world-class.",
        citySlug: "ponta-delgada",
      },
    ],
    seasons: [
      {
        season: "Spring",
        months: "April – June",
        body: "Wildflowers in the Alentejo, comfortable city walking, and the Algarve warming up without the crowds. The Atlantic is still cold.",
      },
      {
        season: "High summer",
        months: "July – August",
        body: "The Algarve fills with European holidaymakers and Lisbon gets hot. Madeira stays moderate. Book Algarve transfers early — the resort strip generates enormous simultaneous demand.",
      },
      {
        season: "Autumn",
        months: "September – October",
        body: "The best time overall. Sea at its warmest, the Douro harvest in September, and cities comfortable again.",
      },
      {
        season: "Winter",
        months: "November – March",
        body: "Lisbon and Porto stay lively and cheap. Madeira is a genuine winter destination at around 19°C. The Algarve is quiet and many resorts scale back.",
      },
    ],
    gettingAroundTitle: "Getting around Portugal",
    gettingAround: [
      "Lisbon's airport is inside the city, which makes transfers short but the surrounding traffic dense. Getting to Cascais or Sintra takes far longer than the distance suggests at rush hour.",
      "The Algarve is longer than it looks. Faro to Sagres is roughly ninety minutes; Faro to Tavira is thirty. Resorts are marketed as 'the Algarve' across more than 150 km of coast.",
      "Motorway tolls are electronic. Many Portuguese motorways use automatic tolling with no booths, which catches out rental drivers regularly. Tolls are included in any price we quote.",
      "Madeira and the Azores are steep. Roads are narrow, gradients severe, and hotel access can require a small vehicle. Tell us your accommodation and we will send something that can actually reach it.",
    ],
    knowBefore: [
      {
        title: "Transfers here are quote-confirmed",
        body: "We confirm your route and price with a licensed Portuguese operator before payment. Island routes on Madeira and the Azores are priced individually because access varies so much by property.",
      },
      {
        title: "The Atlantic is cold",
        body: "Sea temperature on the west coast rarely passes 19°C even in August. The south-facing Algarve is a few degrees warmer. Wetsuits are normal for surfing year-round.",
      },
      {
        title: "Card payments are near-universal",
        body: "Portugal adopted contactless early and it works almost everywhere, including small cafés and taxis. Carrying large amounts of cash is unnecessary.",
      },
      {
        title: "Sintra needs an early start",
        body: "Pena Palace and Quinta da Regaleira sell out and the road up is a bottleneck by mid-morning. A driver who leaves Lisbon before 08:00 changes the whole day.",
      },
    ],
    faqs: [
      {
        q: "How far is Faro airport from the resorts?",
        a: "Albufeira is around forty minutes, Lagos an hour, Vilamoura twenty-five minutes and Sagres closer to ninety. Give us the hotel name and we will quote the actual drive rather than a regional average.",
      },
      {
        q: "Is a transfer worth it from Lisbon airport?",
        a: "The metro reaches the centre cheaply if you travel light. With luggage, children, or a hotel in the Alfama's stair-heavy streets, a door-to-door car is a different experience for a modest difference in cost.",
      },
      {
        q: "Do you cover Madeira and the Azores?",
        a: "Yes — Funchal and Ponta Delgada, quote-confirmed. Both islands have properties that larger vehicles physically cannot reach, so we match the vehicle to the address rather than the passenger count alone.",
      },
      {
        q: "Can you do a Douro valley day with a driver?",
        a: "Yes, as an hourly or day hire out of Porto. It works better than self-driving because the valley roads are winding and the quintas pour generously.",
      },
    ],
  },

  // ------------------------------------------------------------------ CYPRUS
  {
    slug: "cyprus",
    tagline: "The Mediterranean's warmest corner, with a swimming season that runs into November.",
    intro:
      "Cyprus is the third-largest Mediterranean island and the one with the longest summer — the sea holds above 22°C well into November. It is compact enough that any two points are within a three-hour drive, and divided in a way that shapes travel: the Republic in the south, the Turkish-administered north, and a UN buffer zone between them. Most visitors stay south, where the airports, resorts and archaeology are.",
    facts: [
      { label: "Currency", value: "Euro (€)" },
      { label: "Driving", value: "Left-hand side" },
      { label: "Language", value: "Greek and Turkish — English very widely spoken" },
      { label: "Peak season", value: "July to August" },
      { label: "Best value", value: "April, May, October" },
    ],
    highlights: [
      {
        title: "Paphos",
        body: "A UNESCO-listed archaeological park with Roman mosaics that are among the best preserved anywhere, plus the Tombs of the Kings and a harbour front. The airport is fifteen minutes away.",
        citySlug: "paphos",
      },
      {
        title: "Limassol",
        body: "The island's business and nightlife centre, with a long promenade, a marina, and the best restaurant range in Cyprus. It sits roughly halfway between the two airports.",
        citySlug: "limassol",
      },
      {
        title: "Ayia Napa and Protaras",
        body: "The south-east beaches — Nissi, Fig Tree Bay, Konnos — are the best sand on the island. Ayia Napa is the party end, Protaras the family one, and they are ten minutes apart.",
        citySlug: "ayia-napa",
      },
      {
        title: "The Troodos mountains",
        body: "Painted Byzantine churches, mountain villages and, briefly in winter, enough snow to ski. An hour from the coast and fifteen degrees cooler in August.",
      },
      {
        title: "Nicosia",
        body: "The last divided capital in Europe. The Venetian walls, the Cyprus Museum and a crossing point at Ledra Street into the northern half.",
        citySlug: "nicosia",
      },
      {
        title: "Akamas and Lara Bay",
        body: "The wild north-west peninsula, unpaved and undeveloped, where loggerhead turtles nest between June and August. Reachable only by four-wheel drive or on foot.",
      },
    ],
    seasons: [
      {
        season: "Spring",
        months: "March – May",
        body: "Wildflowers, comfortable hiking in the Troodos and sea warm enough to swim from May. The quietest good-weather window.",
      },
      {
        season: "High summer",
        months: "June – August",
        body: "Hot — inland Nicosia routinely passes 40°C — with the coast a few degrees cooler. Busy, but Cyprus absorbs crowds better than the smaller Greek islands.",
      },
      {
        season: "Autumn",
        months: "September – November",
        body: "The island's best season. Sea at its warmest in September and still swimmable in November, with everything open and prices falling.",
      },
      {
        season: "Winter",
        months: "December – February",
        body: "Mild and green, around 17°C on the coast, with occasional snow in the Troodos. Resorts quieten but Limassol and Paphos stay open.",
      },
    ],
    gettingAroundTitle: "Getting around Cyprus",
    gettingAround: [
      "Driving is on the left, a legacy of British administration. It surprises visitors arriving from mainland Europe and is a good reason to be driven rather than to drive on the first day.",
      "Two airports, both in the south. Larnaca handles most traffic and sits centrally; Paphos serves the west. Larnaca to Paphos is around ninety minutes, so flying into the wrong one is an expensive mistake.",
      "Public transport is limited. Buses connect the main towns but run infrequently and barely serve the mountains or the beaches outside the resort strips. Distances are short but you need a vehicle.",
      "Crossing to the north is possible but not with every vehicle. Rental and transfer insurance often does not extend across the buffer zone. Tell us in advance if your route crosses and we will confirm what is possible.",
    ],
    knowBefore: [
      {
        title: "Transfers here are quote-confirmed",
        body: "We price your route with a licensed Cypriot operator and confirm before payment. Both airports are covered, including cross-island runs between them.",
      },
      {
        title: "Larnaca and Paphos are ninety minutes apart",
        body: "Check which airport your return flight leaves from. Arriving into one and departing the other is common with low-cost carriers and needs planning into your transfer.",
      },
      {
        title: "The swimming season is genuinely long",
        body: "October and early November are reliably warm enough to swim, which is not true of Greece or Spain. Late-season Cyprus is one of the Mediterranean's better-kept secrets.",
      },
      {
        title: "Meze is a commitment",
        body: "A full Cypriot meze runs to twenty or more dishes and takes hours. Order it for the evening, not before a flight.",
      },
    ],
    faqs: [
      {
        q: "Which airport should I fly into?",
        a: "Larnaca for Ayia Napa, Protaras, Nicosia and Limassol. Paphos for Paphos, Coral Bay and the west. Limassol is roughly equidistant, so let the flight price decide.",
      },
      {
        q: "How long is Larnaca airport to Ayia Napa?",
        a: "Around forty-five minutes on the motorway. Protaras is about an hour. Both are straightforward runs and priced as fixed-rate airport transfers.",
      },
      {
        q: "Can you take me across to the northern side?",
        a: "Sometimes, depending on the operator's insurance and the crossing point. Ask before you book rather than on the day — it is a licensing question, not a willingness one.",
      },
      {
        q: "Is Cyprus good outside summer?",
        a: "Very. October is arguably the best month of the year, and winter on the coast is mild enough for walking, archaeology and golf while northern Europe freezes.",
      },
    ],
  },

  // ------------------------------------------------------------------ TURKEY
  {
    slug: "turkey",
    tagline: "Two continents, a coastline longer than Italy's, and a lira that stretches.",
    intro:
      "Turkey spans Europe and Asia and prices like neither. Istanbul alone justifies a trip — a city of sixteen million straddling the Bosphorus, layered with Roman, Byzantine and Ottoman building. Beyond it, the Aegean and Mediterranean coasts hold classical ruins and turquoise water in the same frame, and Cappadocia's volcanic valleys look like nowhere else on earth. Distances are continental: this is a country the size of France plus Germany.",
    facts: [
      { label: "Currency", value: "Turkish lira (₺)" },
      { label: "Driving", value: "Right-hand side" },
      { label: "Language", value: "Turkish — English common in tourist areas" },
      { label: "Peak season", value: "June to September" },
      { label: "Best value", value: "April, May, October" },
    ],
    highlights: [
      {
        title: "Istanbul",
        body: "Hagia Sophia, the Blue Mosque, Topkapı and the Grand Bazaar sit within a walkable core, but the city sprawls across two continents. Istanbul Airport is on the European side and a long way out — an hour or more to Sultanahmet. Sabiha Gökçen is on the Asian side and further still from the old city.",
        citySlug: "istanbul",
      },
      {
        title: "Cappadocia",
        body: "Fairy chimneys, rock-cut churches and underground cities, best seen from a balloon at dawn. Kayseri and Nevşehir are the airports; the drive to Göreme is around an hour.",
        citySlug: "cappadocia",
      },
      {
        title: "The Turquoise Coast",
        body: "Between Dalaman and Antalya the coast is a run of bays, Lycian ruins and pine-backed water — Ölüdeniz, Kaş, Kalkan, Kaputaş. The road is spectacular and slow.",
        citySlug: "dalaman",
      },
      {
        title: "Antalya",
        body: "A large resort region with a genuine old town at Kaleiçi and Roman ruins at Perge and Aspendos nearby. The airport is busy and the resort strip stretches an hour either side of it.",
        citySlug: "antalya",
      },
      {
        title: "Bodrum and the Aegean",
        body: "Whitewashed, bougainvillea-heavy and more upmarket than the Mediterranean resorts. The peninsula has a dozen distinct bays, and the airport is around forty minutes from most of them.",
        citySlug: "bodrum",
      },
      {
        title: "Ephesus and İzmir",
        body: "One of the best-preserved classical cities in the Mediterranean, an hour from İzmir airport. Şirince and the Çeşme peninsula are close enough to combine.",
        citySlug: "izmir",
      },
    ],
    seasons: [
      {
        season: "Spring",
        months: "April – May",
        body: "Ideal for Istanbul, Cappadocia and the ruins — warm days, no crowds, and the tulips in Istanbul in April. Sea still cool.",
      },
      {
        season: "High summer",
        months: "June – August",
        body: "The coasts are hot and full; inland Cappadocia is hot and dry; Istanbul is humid. Resort transfers should be booked well ahead, especially around Antalya.",
      },
      {
        season: "Autumn",
        months: "September – October",
        body: "The best months on the coast — sea at its warmest, crowds thinning, and balloon flights in Cappadocia at their most reliable.",
      },
      {
        season: "Winter",
        months: "November – March",
        body: "Istanbul is atmospheric and cheap; Cappadocia gets snow and is stunning under it. Coastal resorts largely close.",
      },
    ],
    gettingAroundTitle: "Getting around Turkey",
    gettingAround: [
      "Istanbul's airports are far out and on opposite sides of the Bosphorus. Istanbul Airport to Sultanahmet is 45–90 minutes depending on traffic; Sabiha Gökçen can take well over an hour and crosses a bridge that regularly jams. Which airport you land at genuinely changes your day.",
      "Domestic flights are cheap and frequent. For Istanbul to Cappadocia or the southern coast, flying beats driving by a wide margin — the distances are continental.",
      "Resort strips are long. The Antalya region runs from Kemer in the west to Side and Alanya in the east, spanning well over two hours of coast under one airport name. Confirm your hotel's actual position.",
      "Traffic in Istanbul is severe and unpredictable. A fixed-price transfer moves that risk to us; a meter in Istanbul traffic moves it to you.",
    ],
    knowBefore: [
      {
        title: "Transfers here are quote-confirmed",
        body: "We price with a licensed Turkish operator and confirm the total before payment, in euros. That removes lira exchange-rate movement between booking and travel, which can be significant.",
      },
      {
        title: "Check which Istanbul airport",
        body: "IST and SAW are more than sixty kilometres apart with the Bosphorus between them. Booking a transfer to the wrong one is the single most common mistake in this market.",
      },
      {
        title: "Balloon flights are weather-dependent",
        body: "Cappadocia flights are cancelled for wind more often than operators advertise, most frequently in winter and mid-summer. Build a spare morning into the itinerary.",
      },
      {
        title: "Modest dress at mosques",
        body: "Working mosques ask for covered shoulders and knees, and a headscarf for women. Most major sites lend coverings at the door, and all close to visitors during prayer.",
      },
    ],
    faqs: [
      {
        q: "How long from Istanbul Airport to Sultanahmet?",
        a: "Typically 45 to 60 minutes, and up to 90 in rush hour. From Sabiha Gökçen on the Asian side, budget 60 to 100 minutes because the route crosses the Bosphorus.",
      },
      {
        q: "Is it cheaper to take a taxi in Turkey?",
        a: "The headline rate can look lower, but Istanbul taxi disputes over meters and routes are a well-known problem for visitors. A fixed price agreed in euros before travel removes the negotiation entirely.",
      },
      {
        q: "Do you cover Cappadocia?",
        a: "Yes, from Kayseri and Nevşehir airports to Göreme, Ürgüp and Uçhisar. Cave hotels often sit on streets that larger vehicles cannot enter, so give us the hotel name when you request the quote.",
      },
      {
        q: "Which airport for the Turquoise Coast?",
        a: "Dalaman for Fethiye, Ölüdeniz, Kalkan and Kaş. Antalya for Kemer, Side and Alanya. Bodrum for the Aegean peninsula. The coast is long enough that the wrong airport can add three hours.",
      },
    ],
  },
];

export function getCountryGuide(slug: string): CountryGuide | undefined {
  return COUNTRY_GUIDES.find((guide) => guide.slug === slug);
}
