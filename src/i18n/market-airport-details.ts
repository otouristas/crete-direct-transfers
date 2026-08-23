import type { AirportData } from "@/data/airports";
import type { MarketHubAirport } from "@/data/market-hubs";
import type { Locale } from "@/i18n";
import { getCountryName } from "@/i18n/markets";

type Details = Pick<
  AirportData,
  | "address"
  | "countrySlug"
  | "terminals"
  | "pickupPoint"
  | "cityDriveMin"
  | "tollsNote"
  | "knowBefore"
  | "insights"
  | "comparison"
  | "faqs"
>;
type Values = { airport: string; city: string; country: string; iata: string };
type Copy = Omit<Details, "address" | "countrySlug">;

export function getMarketAirportDetails(
  locale: Locale,
  hub: MarketHubAirport,
  airportName: string,
  cityName: string,
): Details {
  const country = getCountryName(locale, hub.countrySlug);
  const values = { airport: airportName, city: cityName, country, iata: hub.iata };
  const copy =
    locale === "el"
      ? el(values)
      : locale === "de"
        ? de(values)
        : locale === "fr"
          ? fr(values)
          : en(values);
  return { countrySlug: hub.countrySlug, address: `${cityName}, ${country}`, ...copy };
}

function en(v: Values): Copy {
  return {
    cityDriveMin: "Journey time varies by destination and traffic conditions.",
    terminals: "Your confirmed pickup instructions include the correct arrivals terminal.",
    pickupPoint: "Arrivals hall — look for a sign with your name",
    tollsNote: "Any tolls and airport fees are included in the confirmed quote.",
    knowBefore: [
      {
        title: "Meet and greet in arrivals",
        body: `Your licensed driver waits inside ${v.airport} arrivals with your name. Flight tracking keeps pickup aligned with delays.`,
      },
      {
        title: "One price confirmed before travel",
        body: "You receive and approve the full transfer price before the booking is confirmed, including the selected vehicle and declared route.",
      },
      {
        title: "Vehicle matched to your group",
        body: "Share passenger and luggage numbers when requesting the quote. Child seats and larger vehicles can be requested in advance.",
      },
    ],
    insights: [
      `${v.airport} (${v.iata}) serves ${v.city}, ${v.country}. A pre-arranged pickup avoids taxi-rank uncertainty and gives you a named, licensed local driver.`,
      "Private transfers are especially useful for families, groups, late arrivals and door-to-door hotel journeys. Final availability and price are confirmed before travel.",
    ],
    comparison: [
      {
        mode: "Airport taxi rank",
        time: "On demand plus queue",
        cost: "Metered or variable",
        pros: "Available after arrival",
        cons: "Queues and variable fare",
      },
      {
        mode: "Public transport",
        time: "Route and timetable dependent",
        cost: "Usually lower",
        pros: "Budget option",
        cons: "Not door-to-door; difficult with luggage",
      },
      {
        mode: "TransferAround private transfer",
        time: "Direct and pre-arranged",
        cost: "Confirmed quote",
        pros: "Meet and greet, flight tracking and selected vehicle",
        cons: "Advance request required",
        recommended: true,
      },
    ],
    faqs: [
      {
        q: `How do I request a transfer from ${v.airport} (${v.iata})?`,
        a: "Enter your pickup, destination, date, passengers and luggage. We confirm availability and the full price before you commit.",
      },
      {
        q: `Where will my driver meet me at ${v.airport}?`,
        a: "Your confirmation contains the exact terminal meeting point. Airport pickups normally take place in arrivals with a name sign.",
      },
      {
        q: "Is the transfer price fixed?",
        a: "Yes. The accepted quote fixes the price for the declared route, vehicle and extras. Any requested itinerary change is reconfirmed first.",
      },
      {
        q: "Can I request child seats or a larger vehicle?",
        a: "Yes. Add ages, passenger numbers and luggage to the request so the local partner can confirm the correct equipment and vehicle.",
      },
    ],
  };
}

function el(v: Values): Copy {
  return {
    cityDriveMin: "Ο χρόνος διαδρομής εξαρτάται από τον προορισμό και την κίνηση.",
    terminals: "Οι επιβεβαιωμένες οδηγίες παραλαβής αναφέρουν τον σωστό τερματικό αφίξεων.",
    pickupPoint: "Αίθουσα αφίξεων — αναζητήστε πινακίδα με το όνομά σας",
    tollsNote: "Τυχόν διόδια και τέλη αεροδρομίου περιλαμβάνονται στην επιβεβαιωμένη προσφορά.",
    knowBefore: [
      {
        title: "Υποδοχή στις αφίξεις",
        body: `Ο αδειοδοτημένος οδηγός σας περιμένει στις αφίξεις του ${v.airport} με το όνομά σας. Η παρακολούθηση πτήσης προσαρμόζει την παραλαβή σε καθυστερήσεις.`,
      },
      {
        title: "Μία τιμή πριν από το ταξίδι",
        body: "Λαμβάνετε και εγκρίνετε την πλήρη τιμή πριν επιβεβαιωθεί η κράτηση, για το επιλεγμένο όχημα και τη δηλωμένη διαδρομή.",
      },
      {
        title: "Κατάλληλο όχημα για την ομάδα",
        body: "Δηλώστε επιβάτες και αποσκευές. Παιδικά καθίσματα και μεγαλύτερα οχήματα ζητούνται εκ των προτέρων.",
      },
    ],
    insights: [
      `Το ${v.airport} (${v.iata}) εξυπηρετεί την περιοχή ${v.city}, ${v.country}. Η προγραμματισμένη παραλαβή προσφέρει επώνυμο, αδειοδοτημένο τοπικό οδηγό χωρίς αβεβαιότητα στην πιάτσα ταξί.`,
      "Η ιδιωτική μεταφορά εξυπηρετεί οικογένειες, γκρουπ, βραδινές αφίξεις και διαδρομές πόρτα-πόρτα. Η διαθεσιμότητα και η τιμή επιβεβαιώνονται πριν το ταξίδι.",
    ],
    comparison: [
      {
        mode: "Πιάτσα ταξί αεροδρομίου",
        time: "Άμεσα και πιθανή ουρά",
        cost: "Με ταξίμετρο ή μεταβλητό",
        pros: "Διαθέσιμο μετά την άφιξη",
        cons: "Ουρές και μεταβλητή τιμή",
      },
      {
        mode: "Δημόσια συγκοινωνία",
        time: "Ανάλογα με δρομολόγιο",
        cost: "Συνήθως χαμηλότερο",
        pros: "Οικονομική επιλογή",
        cons: "Όχι πόρτα-πόρτα, δύσκολη με αποσκευές",
      },
      {
        mode: "Ιδιωτική μεταφορά TransferAround",
        time: "Απευθείας και προγραμματισμένη",
        cost: "Επιβεβαιωμένη προσφορά",
        pros: "Υποδοχή, παρακολούθηση πτήσης και επιλεγμένο όχημα",
        cons: "Απαιτείται έγκαιρο αίτημα",
        recommended: true,
      },
    ],
    faqs: [
      {
        q: `Πώς ζητώ μεταφορά από το ${v.airport} (${v.iata});`,
        a: "Συμπληρώστε παραλαβή, προορισμό, ημερομηνία, επιβάτες και αποσκευές. Επιβεβαιώνουμε διαθεσιμότητα και τελική τιμή πριν δεσμευτείτε.",
      },
      {
        q: `Πού θα με συναντήσει ο οδηγός στο ${v.airport};`,
        a: "Η επιβεβαίωση περιέχει το ακριβές σημείο στον τερματικό. Συνήθως η συνάντηση γίνεται στις αφίξεις με πινακίδα ονόματος.",
      },
      {
        q: "Είναι σταθερή η τιμή;",
        a: "Ναι. Η αποδεκτή προσφορά κλειδώνει την τιμή για τη δηλωμένη διαδρομή, όχημα και πρόσθετα.",
      },
      {
        q: "Μπορώ να ζητήσω παιδικό κάθισμα ή μεγαλύτερο όχημα;",
        a: "Ναι. Δηλώστε ηλικίες, επιβάτες και αποσκευές ώστε να επιβεβαιωθεί ο κατάλληλος εξοπλισμός.",
      },
    ],
  };
}

function de(v: Values): Copy {
  return {
    cityDriveMin: "Die Fahrzeit hängt von Ziel und Verkehrslage ab.",
    terminals: "Die bestätigte Abholanweisung nennt das richtige Ankunftsterminal.",
    pickupPoint: "Ankunftshalle — achten Sie auf ein Schild mit Ihrem Namen",
    tollsNote: "Maut- und Flughafengebühren sind im bestätigten Angebot enthalten.",
    knowBefore: [
      {
        title: "Begrüßung in der Ankunftshalle",
        body: `Ihr lizenzierter Fahrer wartet im Ankunftsbereich von ${v.airport} mit Ihrem Namen. Die Flugverfolgung berücksichtigt Verspätungen.`,
      },
      {
        title: "Ein bestätigter Preis vor der Reise",
        body: "Sie erhalten und genehmigen den Gesamtpreis für Route und Fahrzeug, bevor die Buchung bestätigt wird.",
      },
      {
        title: "Passendes Fahrzeug für Ihre Gruppe",
        body: "Geben Sie Personen und Gepäck an. Kindersitze und größere Fahrzeuge können vorab angefragt werden.",
      },
    ],
    insights: [
      `${v.airport} (${v.iata}) bedient ${v.city}, ${v.country}. Eine geplante Abholung bietet einen namentlich bekannten, lizenzierten Fahrer ohne Unsicherheit am Taxistand.`,
      "Private Transfers eignen sich für Familien, Gruppen, späte Ankünfte und direkte Hotelfahrten. Verfügbarkeit und Preis werden vor der Reise bestätigt.",
    ],
    comparison: [
      {
        mode: "Taxistand am Flughafen",
        time: "Direkt plus mögliche Wartezeit",
        cost: "Taxameter oder variabel",
        pros: "Nach Ankunft verfügbar",
        cons: "Warteschlangen und variabler Preis",
      },
      {
        mode: "Öffentlicher Verkehr",
        time: "Fahrplanabhängig",
        cost: "Meist günstiger",
        pros: "Preiswerte Option",
        cons: "Nicht Tür zu Tür; schwierig mit Gepäck",
      },
      {
        mode: "TransferAround Privattransfer",
        time: "Direkt und vorbestellt",
        cost: "Bestätigtes Angebot",
        pros: "Begrüßung, Flugverfolgung und gewähltes Fahrzeug",
        cons: "Vorherige Anfrage nötig",
        recommended: true,
      },
    ],
    faqs: [
      {
        q: `Wie frage ich einen Transfer ab ${v.airport} (${v.iata}) an?`,
        a: "Geben Sie Abholung, Ziel, Datum, Personen und Gepäck ein. Verfügbarkeit und Gesamtpreis werden vor Ihrer Zusage bestätigt.",
      },
      {
        q: `Wo treffe ich den Fahrer am ${v.airport}?`,
        a: "Die Bestätigung enthält den genauen Treffpunkt im Terminal. Üblicherweise wartet der Fahrer in der Ankunftshalle mit Namensschild.",
      },
      {
        q: "Ist der Transferpreis fest?",
        a: "Ja. Das angenommene Angebot fixiert den Preis für die angegebene Route, das Fahrzeug und Extras.",
      },
      {
        q: "Kann ich Kindersitze oder ein größeres Fahrzeug bestellen?",
        a: "Ja. Geben Sie Alter, Personenzahl und Gepäck an, damit die Ausstattung bestätigt werden kann.",
      },
    ],
  };
}

function fr(v: Values): Copy {
  return {
    cityDriveMin: "La durée dépend de la destination et de la circulation.",
    terminals: "Les instructions confirmées indiquent le bon terminal d’arrivée.",
    pickupPoint: "Hall des arrivées — cherchez une pancarte à votre nom",
    tollsNote: "Les péages et frais d’aéroport éventuels sont inclus dans le devis confirmé.",
    knowBefore: [
      {
        title: "Accueil dans le hall des arrivées",
        body: `Votre chauffeur agréé vous attend aux arrivées de ${v.airport} avec votre nom. Le suivi de vol permet d’adapter la prise en charge aux retards.`,
      },
      {
        title: "Un prix confirmé avant le voyage",
        body: "Vous recevez et acceptez le prix total correspondant au trajet et au véhicule avant confirmation de la réservation.",
      },
      {
        title: "Un véhicule adapté à votre groupe",
        body: "Indiquez le nombre de passagers et de bagages. Les sièges enfant et grands véhicules se demandent à l’avance.",
      },
    ],
    insights: [
      `${v.airport} (${v.iata}) dessert ${v.city}, ${v.country}. Une prise en charge planifiée vous assure un chauffeur local agréé et identifié, sans incertitude à la station de taxis.`,
      "Le transfert privé convient aux familles, groupes, arrivées tardives et trajets porte-à-porte. La disponibilité et le prix sont confirmés avant le voyage.",
    ],
    comparison: [
      {
        mode: "Station de taxis de l’aéroport",
        time: "Immédiat avec attente possible",
        cost: "Compteur ou variable",
        pros: "Disponible à l’arrivée",
        cons: "File d’attente et tarif variable",
      },
      {
        mode: "Transports publics",
        time: "Selon horaires et itinéraire",
        cost: "Généralement moins cher",
        pros: "Option économique",
        cons: "Pas de porte-à-porte; peu pratique avec bagages",
      },
      {
        mode: "Transfert privé TransferAround",
        time: "Direct et planifié",
        cost: "Devis confirmé",
        pros: "Accueil, suivi de vol et véhicule choisi",
        cons: "Demande préalable nécessaire",
        recommended: true,
      },
    ],
    faqs: [
      {
        q: `Comment demander un transfert depuis ${v.airport} (${v.iata}) ?`,
        a: "Indiquez le départ, la destination, la date, les passagers et les bagages. Nous confirmons disponibilité et prix total avant votre engagement.",
      },
      {
        q: `Où retrouver mon chauffeur à ${v.airport} ?`,
        a: "La confirmation précise le point de rendez-vous dans le terminal. Le chauffeur attend généralement aux arrivées avec une pancarte nominative.",
      },
      {
        q: "Le prix du transfert est-il fixe ?",
        a: "Oui. Le devis accepté fixe le prix pour le trajet, le véhicule et les options déclarés.",
      },
      {
        q: "Puis-je demander un siège enfant ou un véhicule plus grand ?",
        a: "Oui. Précisez les âges, le nombre de passagers et les bagages afin de confirmer l’équipement adapté.",
      },
    ],
  };
}
