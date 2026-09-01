import { DEFAULT_TERRITORY } from "@/data/territories";
/**
 * Immersive route guides.
 *
 * A route page answers "what does this cost and how long does it take". A guide
 * answers everything a first-time visitor actually wonders about on the drive:
 * what the road looks like, where the driver can stop, when the traffic bites,
 * what to do on arrival. Keyed by an existing ROUTES slug so every guide can
 * deep-link to a bookable fixed price.
 */
import { getRoute } from "@/data/routes";
import { getCityImage, getRegionImage, imageUrl } from "@/lib/place-image";

export type GuideStop = {
  /** Minutes into the drive when this comes up. */
  atMin: number;
  title: string;
  body: string;
};

export type RouteGuide = {
  /** Owning territory slug. Defaults to the launch territory. */
  territory?: string;
  slug: string;
  /** Slug in ROUTES this guide is attached to. */
  routeSlug: string;
  title: string;
  subtitle: string;
  heroImage: string;
  /** 2–3 paragraph editorial opener. */
  intro: string[];
  /** The drive, minute by minute. */
  drive: GuideStop[];
  /** Worth asking the driver to pull over for. */
  detours: { name: string; addMin: number; body: string }[];
  /** Practical, non-obvious local knowledge. */
  tips: string[];
  /** When this road is busy and what that does to the transfer. */
  timing: string;
  /** What the arrival itself is like. */
  arrival: string;
  faqs: { q: string; a: string }[];
};

const IMG = {
  elounda: imageUrl(getCityImage("elounda"), { width: 1800 }),
  chania: imageUrl(getRegionImage("chania"), { width: 1800 }),
  rethymno: imageUrl(getRegionImage("rethymno"), { width: 1800 }),
  matala: imageUrl(getCityImage("matala"), { width: 1800 }),
  hersonissos: imageUrl(getCityImage("hersonissos"), { width: 1800 }),
  lasithi: imageUrl(getRegionImage("lasithi"), { width: 1800 }),
  heraklion: imageUrl(getCityImage("heraklion"), { width: 1800 }),
  malia: imageUrl(getCityImage("malia"), { width: 1800 }),
};

export const ROUTE_GUIDES: RouteGuide[] = [
  {
    slug: "heraklion-airport-to-elounda",
    routeSlug: "heraklion-airport-to-elounda",
    title: "Heraklion Airport to Elounda: the drive, the detours, the arrival",
    subtitle:
      "An hour of coastal motorway that ends in the quietest luxury bay on Crete. Here is exactly what happens between the terminal door and your hotel gate.",
    heroImage: IMG.elounda,
    intro: [
      "Elounda is the reason a lot of people fly to Heraklion in the first place, and yet almost nobody arrives knowing what the transfer actually looks like. It is the E75 north-coast motorway for roughly fifty minutes, then a short, twisting descent into the Mirabello Gulf that most passengers photograph through the window.",
      "The road is genuinely good — two lanes each way for the bulk of it, resurfaced past Malia, and quiet outside the July and August changeover hours. What catches people out is the last ten minutes: the climb over the Agios Nikolaos ridge and the hairpin drop into Elounda are slow by design, and no driver worth booking will rush them.",
      "Budget 70 minutes door to door in normal conditions, 85 on a Saturday in August, and remember that Elounda hotel driveways are long. A gate is not a lobby.",
    ],
    drive: [
      {
        atMin: 0,
        title: "Arrivals hall, Heraklion (HER)",
        body: "Your driver waits landside with a name board, tracks the flight, and carries your bags to a car parked in the short-stay lot two minutes from the door. No shuttle bus, no meeting point in a car park.",
      },
      {
        atMin: 6,
        title: "Joining the E75 eastbound",
        body: "The airport sits on the edge of the city, so you are on the motorway before you have finished settling in. Heraklion's rooftops and the Venetian sprawl fall away on the right.",
      },
      {
        atMin: 18,
        title: "Gouves and Anissaras",
        body: "The first resort strip. If your flight was delayed and everyone is hungry, this is the last easy place for a fast, non-touristy bakery stop.",
      },
      {
        atMin: 28,
        title: "Malia bypass",
        body: "The motorway lifts above the old town. Watch left for the Malia plain and the archaeological site of the Minoan palace, which is visible from the road as a low grid of stone.",
      },
      {
        atMin: 40,
        title: "Selinari gorge",
        body: "The most dramatic stretch: the road threads a limestone gorge past the tiny chapel of Agios Georgios, where Cretan drivers still tap the horn for luck. Ask yours — most will.",
      },
      {
        atMin: 52,
        title: "First view of the Mirabello Gulf",
        body: "The descent towards Agios Nikolaos opens onto the largest bay on the island. On a clear afternoon you can see Spinalonga from the road.",
      },
      {
        atMin: 62,
        title: "Over the ridge into Elounda",
        body: "A short, tight coastal road with the water on your right the entire way. Slow, beautiful, and the reason the last ten kilometres take fifteen minutes.",
      },
      {
        atMin: 70,
        title: "Hotel gate",
        body: "Most Elounda resorts sit below the road on private switchbacks. Your driver takes you to the reception canopy, not the entrance barrier.",
      },
    ],
    detours: [
      {
        name: "Agios Nikolaos harbour",
        addMin: 20,
        body: "Coffee beside Lake Voulismeni before you check in. Useful when your room is not ready until 15:00.",
      },
      {
        name: "Plaka viewpoint",
        addMin: 15,
        body: "The village opposite Spinalonga island. Ten minutes past Elounda and worth it for the first-evening photograph.",
      },
      {
        name: "Neapoli",
        addMin: 12,
        body: "An entirely un-touristed mountain town off the motorway for a proper bougatsa and a supermarket run before the resort mark-ups begin.",
      },
    ],
    tips: [
      "Elounda has no airport of its own and no train — a private transfer or a taxi from Agios Nikolaos are the only realistic arrivals.",
      "Public bus involves Heraklion bus station plus a change at Agios Nikolaos: roughly three hours with luggage, against seventy minutes door to door.",
      "Ask for a child seat when you book, not on the day. Greek law requires them and roadside availability is nil.",
      "Late arrivals are normal here: most Elounda resorts staff reception overnight, and our night driver rotation covers every flight until the last landing.",
    ],
    timing:
      "The E75 is busiest between 10:00 and 13:00 in July and August, when charter departures and hotel changeovers overlap. A 45-minute drive becomes 60. Evening arrivals after 20:00 are the fastest of the day.",
    arrival:
      "Elounda's resorts are strung along a single coastal road around the bay, and several share unmarked turnings. Give your hotel name at booking rather than a street address — our drivers know the gates by sight and will not leave you at the wrong one.",
    faqs: [
      {
        q: "How long is the transfer from Heraklion Airport to Elounda?",
        a: "Around 70 minutes door to door for the 72 km drive, extending to roughly 85 minutes during the August midday changeover.",
      },
      {
        q: "Is there a cheaper way than a private transfer?",
        a: "The bus via Heraklion and Agios Nikolaos is cheaper per person but takes close to three hours with two changes. For two or more passengers with luggage the fixed-price transfer is usually comparable in cost and far faster.",
      },
      {
        q: "Will the driver wait if my flight is late?",
        a: "Yes. We track the flight number and include 60 minutes of free waiting after landing on airport pickups.",
      },
    ],
  },
  {
    slug: "chania-airport-to-chania-old-town",
    routeSlug: "chania-airport-to-chania-old-town",
    title: "Chania Airport to the Old Town: twenty minutes across the Akrotiri",
    subtitle:
      "Short, scenic, and deceptively fiddly at the end — the Venetian quarter is pedestrianised and your drop-off point matters more than the drive.",
    heroImage: IMG.chania,
    intro: [
      "Chania's airport sits on the Akrotiri peninsula, a scrubby limestone headland with monasteries, war cemeteries and one of the best swimming coves on the island. The drive into town is barely twenty minutes and almost entirely downhill.",
      "The complication is the destination, not the road. The Venetian old town is a maze of pedestrian lanes where the widest street is a car's width and delivery vans reverse for a living. Cars are excluded from most of it.",
      "A good driver already knows which of the four permitted vehicle drop-off points is closest to your door, and will walk your bags the last fifty metres rather than leave you guessing at a bollard.",
    ],
    drive: [
      {
        atMin: 0,
        title: "Terminal forecourt",
        body: "Chania is a small airport — you are outside within minutes of the carousel, and your driver is standing at the arrivals door with a board.",
      },
      {
        atMin: 5,
        title: "Across the Akrotiri plateau",
        body: "Open, dry, and unexpectedly empty for somewhere five minutes from an international terminal.",
      },
      {
        atMin: 9,
        title: "Souda Bay overlook",
        body: "The road drops towards one of the deepest natural harbours in the Mediterranean, with the Allied war cemetery visible on the left.",
      },
      {
        atMin: 14,
        title: "Chania's eastern approach",
        body: "Modern city, ordinary traffic, occasional queue at the Koum Kapi lights in the evening.",
      },
      {
        atMin: 20,
        title: "Old town perimeter",
        body: "Drop-off at the nearest permitted point to your accommodation — usually Sifaka, Minoos, the Splantzia edge, or the Firka end by the lighthouse.",
      },
    ],
    detours: [
      {
        name: "Stavros beach",
        addMin: 25,
        body: "The Zorba the Greek cove, ten minutes from the airport. A genuinely good first swim if you land early and cannot check in yet.",
      },
      {
        name: "Agia Triada Monastery",
        addMin: 20,
        body: "A working Venetian-era monastery in olive groves on the Akrotiri, with its own oil and wine.",
      },
    ],
    tips: [
      "Tell us your accommodation name in the old town — not just 'Chania' — so the driver picks the right drop-off gate.",
      "Luggage on cobbles is the real workload here. Ask for help with the last stretch; drivers expect it.",
      "Souda ferry passengers should book the Souda Port route instead; it is a different pickup zone entirely.",
      "Evening arrivals in high season hit the harbour-front traffic between 20:00 and 22:00. Add ten minutes.",
    ],
    timing:
      "Traffic is only an issue on the final two kilometres, and only in the evening. The Akrotiri stretch is fast year round.",
    arrival:
      "The old town's four vehicle access points are enforced by camera in summer. Your driver stops legally, unloads, and points you the shortest way in — usually two or three minutes on foot.",
    faqs: [
      {
        q: "Can a taxi drive into Chania Old Town?",
        a: "Only partially. Most of the Venetian quarter is pedestrianised; vehicles stop at designated perimeter points and the final approach is on foot.",
      },
      {
        q: "How much is a transfer from Chania Airport to the old town?",
        a: "A fixed price of around €35 for up to three passengers, quoted in full before you book with no meter and no surcharges.",
      },
    ],
  },
  {
    slug: "heraklion-airport-to-rethymno",
    routeSlug: "heraklion-airport-to-rethymno",
    title: "Heraklion Airport to Rethymno: the north-coast run",
    subtitle:
      "An hour of sea on your right and mountains on your left, ending at a Venetian harbour that most people wish they had booked longer in.",
    heroImage: IMG.rethymno,
    intro: [
      "This is the classic Crete transfer: 80 kilometres of the E75 westbound, with the Cretan Sea alongside for almost the whole distance and the White Mountains building on the horizon.",
      "It is also the route where the difference between a fixed price and a meter is most obvious. Traffic through the Heraklion western bypass can add fifteen minutes in the morning, and on a meter you pay for that. On a fixed transfer you do not.",
      "Rethymno itself splits into three: the old town inside the fortress walls, the long hotel beach east of it, and the villages climbing behind. Which one you are staying in changes the last ten minutes considerably.",
    ],
    drive: [
      {
        atMin: 0,
        title: "Heraklion Airport",
        body: "Meet and greet inside arrivals, bags loaded, on the road within ten minutes of clearing customs.",
      },
      {
        atMin: 12,
        title: "Heraklion western bypass",
        body: "The one reliably slow section. Past the port, the Venetian walls and the Giofyros interchange.",
      },
      {
        atMin: 25,
        title: "Agia Pelagia headland",
        body: "The road climbs to a viewpoint over a horseshoe bay — the best photo stop of the drive if you have time.",
      },
      {
        atMin: 40,
        title: "Fodele and Bali turnoffs",
        body: "El Greco's birthplace and a cluster of coves respectively, both signed from the motorway.",
      },
      {
        atMin: 55,
        title: "Panormo",
        body: "The last village before Rethymno and a favourite driver stop for coffee if you are ahead of check-in.",
      },
      {
        atMin: 65,
        title: "Rethymno",
        body: "Exit onto the old road for the beach hotels, or continue to the harbour end for the fortress and old town.",
      },
    ],
    detours: [
      {
        name: "Fodele village",
        addMin: 25,
        body: "Orange groves, a Byzantine church and the El Greco museum, five minutes off the motorway.",
      },
      {
        name: "Bali coves",
        addMin: 20,
        body: "Three small bays stacked along a hillside — a swim stop that turns a transfer into an afternoon.",
      },
      {
        name: "Arkadi Monastery",
        addMin: 45,
        body: "The most significant monument in Cretan history, inland from Rethymno. Better as a booked hourly extension than a quick detour.",
      },
    ],
    tips: [
      "Ask whether your hotel is old-town or beach-strip; the two are 4 km apart and taxis between them are not cheap in season.",
      "For old-town accommodation, expect the same pedestrian-zone rules as Chania.",
      "Groups of six or more should book the van class — the luggage volume on this route is consistently underestimated.",
    ],
    timing:
      "Leave-side airport traffic peaks 09:00–12:00. The motorway itself rarely queues outside the Heraklion bypass.",
    arrival:
      "Rethymno's seafront road is one-way in stretches, so the driver may loop. That is normal and costs you nothing on a fixed price.",
    faqs: [
      {
        q: "How far is Rethymno from Heraklion Airport?",
        a: "About 80 km, roughly 65–75 minutes by private transfer on the E75 motorway.",
      },
      {
        q: "Is Chania Airport closer to Rethymno?",
        a: "Slightly — around 60 km and 55 minutes. If you have not booked flights yet, compare both airports before deciding.",
      },
    ],
  },
  {
    slug: "heraklion-airport-to-matala",
    routeSlug: "heraklion-airport-to-matala",
    title: "Heraklion Airport to Matala: across the island to the south coast",
    subtitle:
      "The only transfer on Crete that crosses the mountain spine, drops into the Messara plain, and ends at a beach full of Roman caves.",
    heroImage: IMG.matala,
    intro: [
      "Matala sits on the south coast, which on Crete means crossing the island rather than following it. The drive climbs out of Heraklion, runs the length of the Messara — the largest agricultural plain on the island, wall-to-wall olive and greenhouse — and finishes with a descent to a bay of sandstone caves.",
      "It takes about 75 minutes and feels like three separate countries. Almost nobody makes this drive on a bus, because the connection through Mires is slow and infrequent.",
      "It is also the transfer where a knowledgeable driver earns their fee: Phaistos, Gortyna and Agios Titos are all within a few minutes of the road, and a fifteen-minute stop at the right one changes the day.",
    ],
    drive: [
      {
        atMin: 0,
        title: "Heraklion Airport",
        body: "Straight onto the southbound national road rather than the coastal motorway.",
      },
      {
        atMin: 20,
        title: "The Agia Varvara climb",
        body: "Up through vineyards to the geographic centre of Crete, marked by a chapel on a rock.",
      },
      {
        atMin: 35,
        title: "Messara plain",
        body: "The road drops onto a flat green plain that supplies most of Greece with winter vegetables. The Asterousia mountains wall it off to the south.",
      },
      {
        atMin: 50,
        title: "Gortyna and Phaistos",
        body: "Two of the most important archaeological sites on Crete, both signed from the road within ten minutes of each other.",
      },
      {
        atMin: 68,
        title: "Descent to the coast",
        body: "A final ridge, then the Libyan Sea appears — a noticeably different blue from the north coast.",
      },
      {
        atMin: 75,
        title: "Matala",
        body: "Village parking is tight; drivers drop at the square, two minutes from every guesthouse in town.",
      },
    ],
    detours: [
      {
        name: "Phaistos palace",
        addMin: 40,
        body: "The second Minoan palace, on a hilltop with a view over the whole plain. Quieter than Knossos and, to many, better.",
      },
      {
        name: "Zaros",
        addMin: 30,
        body: "Spring water, a lake and trout tavernas in the foothills of Psiloritis.",
      },
      {
        name: "Kommos beach",
        addMin: 10,
        body: "A long, wild beach with a Minoan harbour site at one end, five minutes before Matala.",
      },
    ],
    tips: [
      "The south coast is warmer and windier than the north — pack accordingly for early and late season.",
      "Matala's caves close at dusk; if you land late, plan them for the morning.",
      "Ask your driver about the Sunday market at Mires if you are self-catering.",
    ],
    timing:
      "No meaningful rush hour on this route. The one delay risk is agricultural traffic on the Messara section in harvest months.",
    arrival:
      "Matala is small enough that everything is walkable from the square. Drivers can go closer for guests with mobility needs — say so when booking.",
    faqs: [
      {
        q: "How long does it take to get from Heraklion Airport to Matala?",
        a: "Around 75 minutes for the 70 km crossing of the island via the Messara plain.",
      },
      {
        q: "Can I add a stop at Phaistos on the way?",
        a: "Yes. Add it as a stop when booking, or book an hourly service if you want time at more than one site.",
      },
    ],
  },
  {
    slug: "heraklion-airport-to-hersonissos",
    routeSlug: "heraklion-airport-to-hersonissos",
    title: "Heraklion Airport to Hersonissos: twenty-five minutes, and why the last five matter",
    subtitle:
      "The shortest popular transfer on Crete — and the one where hotel addresses are most often wrong.",
    heroImage: IMG.hersonissos,
    intro: [
      "Hersonissos is the closest large resort to Heraklion Airport: a straight run east on the E75 that takes about 25 minutes even in traffic.",
      "The difficulty is that 'Hersonissos' covers three distinct places — the seafront strip, the older village of Koutouloufari on the hill above, and Analipsi/Anissaras to the west. Booking platforms flatten them into one name, and guests regularly get dropped in the wrong one.",
      "We route by hotel name, and the drivers on this rotation live in the area. That is the entire difference on a route this short.",
    ],
    drive: [
      {
        atMin: 0,
        title: "Heraklion Airport",
        body: "Meet and greet in arrivals, bags loaded, straight onto the motorway.",
      },
      {
        atMin: 8,
        title: "Gournes and the aquarium",
        body: "The old US airbase site, now Crete's aquarium and a water park — both useful rainy-day knowledge.",
      },
      {
        atMin: 15,
        title: "Anissaras",
        body: "The quiet, hotel-heavy western edge. Different exit from the main strip.",
      },
      {
        atMin: 22,
        title: "Hersonissos exit",
        body: "Down to the seafront, or up the hill to Koutouloufari and Piskopiano.",
      },
      {
        atMin: 25,
        title: "Hotel door",
        body: "Including the one-way loops that the seafront road forces on every driver in season.",
      },
    ],
    detours: [
      {
        name: "Koutouloufari",
        addMin: 10,
        body: "The old village above the resort — stone lanes and tavernas with actual Cretan cooking.",
      },
      {
        name: "Cretaquarium",
        addMin: 15,
        body: "Ten minutes from the airport and a genuinely good stop with children after a long flight.",
      },
    ],
    tips: [
      "Give the hotel name, not the resort name — 'Hersonissos' alone covers three separate districts.",
      "Night flights are common on this corridor and our night rotation is priced identically apart from the standard late surcharge, which is shown before you pay.",
      "Twenty-five minutes means you can eat at the airport or at the hotel; there is nothing worth stopping for in between.",
    ],
    timing:
      "Consistently quick. Even the August changeover rarely pushes this beyond 35 minutes.",
    arrival:
      "The seafront is one-way in high season with heavy pedestrian flow after dark. Drop-off is at the nearest legal point to your entrance.",
    faqs: [
      {
        q: "How far is Hersonissos from Heraklion Airport?",
        a: "About 25 km — a 25 minute transfer on the E75.",
      },
      {
        q: "Is Hersonissos the same as Anissaras?",
        a: "No. Anissaras is a quieter hotel area a few kilometres west with its own motorway exit. Give the hotel name when booking so the driver takes the right one.",
      },
    ],
  },
  {
    slug: "agios-nikolaos-to-elounda",
    routeSlug: "agios-nikolaos-to-elounda",
    title: "Agios Nikolaos to Elounda: fifteen minutes above the Mirabello",
    subtitle: "A short coastal hop that is one of the best short drives in Greece.",
    heroImage: IMG.lasithi,
    intro: [
      "Eleven kilometres, fifteen minutes, and a view for almost all of it. The road leaves Agios Nikolaos climbing north, curls over a headland and drops into Elounda with the whole Mirabello Gulf laid out below.",
      "It is a common evening trip in both directions — Elounda guests going into town for dinner, Agios Nikolaos guests heading out to Plaka for the Spinalonga boats.",
      "Because the road is narrow and unlit in places, this is one route where the local knowledge premium is real after dark.",
    ],
    drive: [
      {
        atMin: 0,
        title: "Agios Nikolaos",
        body: "Pickup at your hotel or at Lake Voulismeni in the centre.",
      },
      {
        atMin: 5,
        title: "The climb out of town",
        body: "Switchbacks past the Minos beach hotels with the gulf opening behind you.",
      },
      {
        atMin: 9,
        title: "The overlook",
        body: "The postcard view: Spinalonga, the salt pans and the Elounda peninsula in one frame.",
      },
      {
        atMin: 15,
        title: "Elounda village square",
        body: "Or onwards to the resort gates around the bay.",
      },
    ],
    detours: [
      {
        name: "Plaka",
        addMin: 12,
        body: "Where the Spinalonga boats leave from — a few tavernas and a pebble beach opposite the island.",
      },
      {
        name: "Elounda salt pans and windmills",
        addMin: 8,
        body: "The causeway to the Kolokytha peninsula, with the remains of the sunken city of Olous underwater beside it.",
      },
    ],
    tips: [
      "Book the return in advance for dinner trips: Elounda taxis vanish after 23:00 in August.",
      "The road is narrow with tour-bus traffic in the afternoon; morning transfers are calmer.",
    ],
    timing: "Slowest 17:00–19:00 when the day-trip coaches return from Spinalonga.",
    arrival:
      "Elounda's resort gates all sit off a single coastal road; give the hotel name for a door drop-off.",
    faqs: [
      {
        q: "How far is Elounda from Agios Nikolaos?",
        a: "Around 11 km — a 15 minute drive along the coastal road.",
      },
      {
        q: "Can I book a transfer for an evening out and a return later?",
        a: "Yes. Book both legs as a round trip and the driver returns at your chosen time.",
      },
    ],
  },
];

export function getRouteGuide(slug: string): RouteGuide | undefined {
  return ROUTE_GUIDES.find((g) => g.slug === slug);
}

export function guideForRoute(routeSlug: string): RouteGuide | undefined {
  return ROUTE_GUIDES.find((g) => g.routeSlug === routeSlug);
}

/** Guides with a resolvable bookable route, which is all of them by construction. */
export function listRouteGuides(): { guide: RouteGuide; priceEur: number | null }[] {
  return ROUTE_GUIDES.map((guide) => {
    const route = getRoute(guide.routeSlug);
    return { guide, priceEur: route ? route.basePriceEur : null };
  });
}

/** Records default to the launch territory until an entry names its own. */
export function routeGuidesInTerritory(territory: string): RouteGuide[] {
  return ROUTE_GUIDES.filter((r) => (r.territory ?? DEFAULT_TERRITORY) === territory);
}
