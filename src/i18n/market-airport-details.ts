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
          : locale === "it"
            ? it(values)
            : locale === "nl"
              ? nl(values)
              : locale === "es"
                ? es(values)
                : en(values);
  return { countrySlug: hub.countrySlug, address: `${cityName}, ${country}`, ...copy };
}

export function getMarketAirportIntro(
  locale: Locale,
  hub: MarketHubAirport,
  airportName: string,
): string {
  const country = getCountryName(locale, hub.countrySlug);
  switch (locale) {
    case "el":
      return `Τα αιτήματα ιδιωτικής μεταφοράς από το ${airportName} προς την περιοχή ${country} ελέγχονται από αδειούχο τοπικό συνεργάτη. Η διαθεσιμότητα, το όχημα και το συνολικό ποσό επιβεβαιώνονται πριν από την πληρωμή.`;
    case "de":
      return `Anfragen für Privattransfers ab ${airportName} in ${country} werden von einem lizenzierten lokalen Partner geprüft. Verfügbarkeit, Fahrzeug und Gesamtpreis werden vor der Zahlung bestätigt.`;
    case "fr":
      return `Les demandes de transfert privé depuis ${airportName}, en ${country}, sont vérifiées par un partenaire local agréé. La disponibilité, le véhicule et le montant total sont confirmés avant le paiement.`;
    case "it":
      return `Le richieste di transfer privato da ${airportName}, in ${country}, vengono verificate da un partner locale autorizzato. Disponibilità, veicolo e importo totale sono confermati prima del pagamento.`;
    case "nl":
      return `Aanvragen voor een privétransfer vanaf ${airportName} in ${country} worden door een erkende lokale partner beoordeeld. Beschikbaarheid, voertuig en totaalprijs worden vóór betaling bevestigd.`;
    case "es":
      return `Las solicitudes de traslado privado desde ${airportName}, en ${country}, las revisa un colaborador local autorizado. La disponibilidad, el vehículo y el importe total se confirman antes del pago.`;
    default:
      return `${airportName} private-transfer requests in ${country} are reviewed by a licensed local partner. Availability, vehicle and total price are confirmed before payment.`;
  }
}

function en(v: Values): Copy {
  return {
    cityDriveMin: "Journey time varies by destination and traffic conditions.",
    terminals: "Your confirmed pickup instructions include the correct arrivals terminal.",
    pickupPoint: "Terminal meeting point provided in the confirmed transfer details",
    tollsNote: "Any tolls and airport fees are included in the confirmed quote.",
    knowBefore: [
      {
        title: "Confirmed arrival instructions",
        body: `Add the flight for ${v.airport} so the local operator can confirm the terminal, meeting point and contact method.`,
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
        pros: "Confirmed pickup, flight details and selected vehicle",
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
        a: "Your confirmation contains the exact terminal meeting point and states whether a physical name sign is included or selected.",
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
    pickupPoint: "Το σημείο συνάντησης στον τερματικό αναγράφεται στην επιβεβαίωση",
    tollsNote: "Τυχόν διόδια και τέλη αεροδρομίου περιλαμβάνονται στην επιβεβαιωμένη προσφορά.",
    knowBefore: [
      {
        title: "Επιβεβαιωμένες οδηγίες άφιξης",
        body: `Προσθέστε την πτήση προς ${v.airport}, ώστε ο τοπικός συνεργάτης να επιβεβαιώσει τερματικό, σημείο συνάντησης και τρόπο επικοινωνίας.`,
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
        pros: "Επιβεβαιωμένη παραλαβή, στοιχεία πτήσης και επιλεγμένο όχημα",
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
        a: "Η επιβεβαίωση περιέχει το ακριβές σημείο στον τερματικό και αναφέρει αν περιλαμβάνεται ή επιλέχθηκε φυσική πινακίδα ονόματος.",
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
    pickupPoint: "Treffpunkt im Terminal laut bestätigten Transferangaben",
    tollsNote: "Maut- und Flughafengebühren sind im bestätigten Angebot enthalten.",
    knowBefore: [
      {
        title: "Bestätigte Ankunftshinweise",
        body: `Geben Sie den Flug nach ${v.airport} an, damit der lokale Betreiber Terminal, Treffpunkt und Kontaktweg bestätigen kann.`,
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
        pros: "Bestätigte Abholung, Flugdaten und gewähltes Fahrzeug",
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
        a: "Die Bestätigung enthält den genauen Treffpunkt im Terminal und nennt, ob ein physisches Namensschild enthalten oder ausgewählt ist.",
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
    pickupPoint: "Point de rendez-vous dans le terminal indiqué dans la confirmation",
    tollsNote: "Les péages et frais d’aéroport éventuels sont inclus dans le devis confirmé.",
    knowBefore: [
      {
        title: "Instructions d’arrivée confirmées",
        body: `Ajoutez le vol vers ${v.airport} afin que l’opérateur local confirme le terminal, le point de rendez-vous et le mode de contact.`,
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
        pros: "Prise en charge confirmée, vol et véhicule choisi",
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
        a: "La confirmation précise le point de rendez-vous dans le terminal et indique si une pancarte nominative est incluse ou sélectionnée.",
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

function it(v: Values): Copy {
  return {
    cityDriveMin: "La durata dipende dalla destinazione e dal traffico.",
    terminals: "Le istruzioni confermate indicano il terminal arrivi corretto.",
    pickupPoint: "Punto d’incontro nel terminal indicato nella conferma",
    tollsNote: "Gli eventuali pedaggi e costi aeroportuali figurano nel preventivo confermato.",
    knowBefore: [
      {
        title: "Istruzioni di arrivo confermate",
        body: `Aggiungi il volo per ${v.airport}, così il partner locale può confermare il terminal, il punto d’incontro e le modalità di contatto.`,
      },
      {
        title: "Un prezzo confermato prima del viaggio",
        body: "Ricevi e approvi il prezzo totale per la tratta e il veicolo prima della conferma della prenotazione.",
      },
      {
        title: "Un veicolo adatto al gruppo",
        body: "Indica passeggeri e bagagli. Seggiolini e veicoli più grandi possono essere richiesti in anticipo.",
      },
    ],
    insights: [
      `${v.airport} (${v.iata}) serve ${v.city}, ${v.country}. Un preventivo confermato registra tratta, veicolo, istruzioni di prelievo e totale prima del viaggio.`,
      "Il transfer privato è utile per famiglie, gruppi, arrivi serali e tragitti porta a porta. Disponibilità e prezzo vengono confermati prima del pagamento.",
    ],
    comparison: [
      {
        mode: "Posteggio taxi aeroportuale",
        time: "Su richiesta con possibile coda",
        cost: "Tassametro o variabile",
        pros: "Può essere disponibile all’arrivo",
        cons: "Attesa e tariffa finale possono variare",
      },
      {
        mode: "Trasporto pubblico",
        time: "Dipende da linea e orari",
        cost: "Di solito inferiore",
        pros: "Opzione economica",
        cons: "Non porta a porta; meno pratico con bagagli",
      },
      {
        mode: "Transfer privato TransferAround",
        time: "Diretto dopo la conferma",
        cost: "Preventivo confermato",
        pros: "Tratta, veicolo e totale concordati prima del pagamento",
        cons: "Richiesta anticipata necessaria",
        recommended: true,
      },
    ],
    faqs: [
      {
        q: `Come richiedo un transfer da ${v.airport} (${v.iata})?`,
        a: "Inserisci partenza, destinazione, data, volo, passeggeri e bagagli. Disponibilità e prezzo totale vengono confermati prima del pagamento.",
      },
      {
        q: `Dove incontro l’autista a ${v.airport}?`,
        a: "Il punto d’incontro esatto nel terminal è indicato nei dettagli confermati dopo la verifica del volo.",
      },
      {
        q: "Il prezzo del transfer è fisso?",
        a: "Sì. Il preventivo accettato fissa il totale per la tratta, il veicolo e le richieste dichiarate.",
      },
      {
        q: "Posso richiedere un seggiolino o un veicolo più grande?",
        a: "Sì. Indica età, passeggeri e bagagli per confermare l’attrezzatura e il veicolo adatti.",
      },
    ],
  };
}

function nl(v: Values): Copy {
  return {
    cityDriveMin: "De reistijd hangt af van de bestemming en het verkeer.",
    terminals: "De bevestigde ophaalinstructies vermelden de juiste aankomstterminal.",
    pickupPoint: "Ontmoetingspunt in de terminal staat in de bevestiging",
    tollsNote: "Eventuele tol- en luchthavenkosten staan in de bevestigde offerte.",
    knowBefore: [
      {
        title: "Bevestigde aankomstinstructies",
        body: `Voeg de vlucht naar ${v.airport} toe, zodat de lokale vervoerder terminal, ontmoetingspunt en contactwijze kan bevestigen.`,
      },
      {
        title: "Eén prijs vóór de reis bevestigd",
        body: "U ontvangt en aanvaardt de totale prijs voor route en voertuig voordat de boeking wordt bevestigd.",
      },
      {
        title: "Een voertuig voor uw gezelschap",
        body: "Vermeld passagiers en bagage. Kinderzitjes en grotere voertuigen kunt u vooraf aanvragen.",
      },
    ],
    insights: [
      `${v.airport} (${v.iata}) bedient ${v.city}, ${v.country}. Een bevestigde offerte legt route, voertuig, ophaalinstructies en totaal vóór de reis vast.`,
      "Een privétransfer is geschikt voor gezinnen, groepen, late aankomsten en ritten van deur tot deur. Beschikbaarheid en prijs worden vóór betaling bevestigd.",
    ],
    comparison: [
      {
        mode: "Taxistandplaats op de luchthaven",
        time: "Op aanvraag met mogelijke wachtrij",
        cost: "Meter of variabel",
        pros: "Kan na aankomst beschikbaar zijn",
        cons: "Wachttijd en eindtarief kunnen verschillen",
      },
      {
        mode: "Openbaar vervoer",
        time: "Afhankelijk van route en dienstregeling",
        cost: "Meestal lager",
        pros: "Budgetoptie",
        cons: "Niet van deur tot deur; minder handig met bagage",
      },
      {
        mode: "Privétransfer van TransferAround",
        time: "Rechtstreeks na bevestiging",
        cost: "Bevestigde offerte",
        pros: "Route, voertuig en totaal vóór betaling afgesproken",
        cons: "Vooraf aanvragen is nodig",
        recommended: true,
      },
    ],
    faqs: [
      {
        q: `Hoe vraag ik een transfer aan vanaf ${v.airport} (${v.iata})?`,
        a: "Vul vertrek, bestemming, datum, vlucht, passagiers en bagage in. Beschikbaarheid en totaalprijs worden vóór betaling bevestigd.",
      },
      {
        q: `Waar ontmoet ik de chauffeur op ${v.airport}?`,
        a: "Het exacte ontmoetingspunt in de terminal staat in de bevestigde ritgegevens nadat de vlucht is gecontroleerd.",
      },
      {
        q: "Staat de transferprijs vast?",
        a: "Ja. De aanvaarde offerte legt het totaal vast voor de bevestigde route, het voertuig en de opgegeven wensen.",
      },
      {
        q: "Kan ik kinderzitjes of een groter voertuig aanvragen?",
        a: "Ja. Vermeld leeftijden, passagiers en bagage, zodat de juiste uitrusting en het voertuig kunnen worden bevestigd.",
      },
    ],
  };
}

function es(v: Values): Copy {
  return {
    cityDriveMin: "La duración depende del destino y del tráfico.",
    terminals: "Las instrucciones confirmadas indican la terminal de llegadas correcta.",
    pickupPoint: "Punto de encuentro en la terminal indicado en la confirmación",
    tollsNote: "Los posibles peajes y cargos aeroportuarios figuran en el presupuesto confirmado.",
    knowBefore: [
      {
        title: "Instrucciones de llegada confirmadas",
        body: `Añade el vuelo a ${v.airport} para que el operador local confirme la terminal, el punto de encuentro y el método de contacto.`,
      },
      {
        title: "Un precio confirmado antes del viaje",
        body: "Recibes y aceptas el precio total de la ruta y el vehículo antes de confirmar la reserva.",
      },
      {
        title: "Un vehículo adecuado para el grupo",
        body: "Indica los pasajeros y el equipaje. Las sillas infantiles y los vehículos mayores se solicitan con antelación.",
      },
    ],
    insights: [
      `${v.airport} (${v.iata}) presta servicio a ${v.city}, ${v.country}. Un presupuesto confirmado registra la ruta, el vehículo, las instrucciones de recogida y el total antes del viaje.`,
      "El traslado privado resulta útil para familias, grupos, llegadas nocturnas y trayectos puerta a puerta. La disponibilidad y el precio se confirman antes del pago.",
    ],
    comparison: [
      {
        mode: "Parada de taxis del aeropuerto",
        time: "Bajo demanda con posible cola",
        cost: "Taxímetro o variable",
        pros: "Puede estar disponible al llegar",
        cons: "La espera y la tarifa final pueden variar",
      },
      {
        mode: "Transporte público",
        time: "Depende de la ruta y el horario",
        cost: "Normalmente menor",
        pros: "Opción económica",
        cons: "No es puerta a puerta; menos práctico con equipaje",
      },
      {
        mode: "Traslado privado TransferAround",
        time: "Directo tras la confirmación",
        cost: "Presupuesto confirmado",
        pros: "Ruta, vehículo y total acordados antes del pago",
        cons: "Requiere solicitud previa",
        recommended: true,
      },
    ],
    faqs: [
      {
        q: `¿Cómo solicito un traslado desde ${v.airport} (${v.iata})?`,
        a: "Indica origen, destino, fecha, vuelo, pasajeros y equipaje. La disponibilidad y el precio total se confirman antes del pago.",
      },
      {
        q: `¿Dónde encontraré al conductor en ${v.airport}?`,
        a: "El punto de encuentro exacto en la terminal aparece en los datos confirmados después de revisar el vuelo.",
      },
      {
        q: "¿El precio del traslado es fijo?",
        a: "Sí. El presupuesto aceptado fija el total para la ruta, el vehículo y los requisitos declarados.",
      },
      {
        q: "¿Puedo solicitar una silla infantil o un vehículo más grande?",
        a: "Sí. Indica edades, pasajeros y equipaje para confirmar el equipo y el vehículo adecuados.",
      },
    ],
  };
}
