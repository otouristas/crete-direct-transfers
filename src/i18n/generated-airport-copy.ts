import type { AirportData } from "@/data/airports";
import type { Locale } from "@/i18n";
import { getCountryName } from "@/i18n/markets";

type Values = Pick<AirportData, "name" | "cityName" | "country" | "iata">;
type GeneratedCopy = Pick<
  AirportData,
  | "terminals"
  | "pickupPoint"
  | "cityDriveMin"
  | "tollsNote"
  | "intro"
  | "knowBefore"
  | "insights"
  | "comparison"
  | "faqs"
>;

/**
 * Localize the generic copy used only for global, non-curated IATA airports.
 * Airport identity and facts stay untouched, while quote-only inventory never
 * gains a public starting price or instant-booking semantics.
 */
export function localizeGeneratedAirport(airport: AirportData, locale: Locale): AirportData {
  const localizedAirport = {
    ...airport,
    country: getCountryName(locale, airport.country.toLowerCase()),
  };
  const values: Values = localizedAirport;
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

  return {
    ...localizedAirport,
    ...copy,
    fromPriceEur: 0,
    bookable: "quote",
  };
}

function en(v: Values): GeneratedCopy {
  return {
    terminals: "Terminal details are confirmed after the flight and route are reviewed.",
    pickupPoint: "The meeting point is provided only after the transfer is confirmed.",
    cityDriveMin: "Journey time varies by destination and traffic conditions.",
    tollsNote: "Any applicable tolls and airport fees are stated in the confirmed total.",
    intro: `Request a fixed-price private transfer from ${v.name} (${v.iata}) in ${v.cityName}, ${v.country}. Share your destination, flight and passenger details so availability, the vehicle, meeting point and total fare can be confirmed before payment.`,
    knowBefore: [
      {
        title: "Add the flight and terminal details",
        body: `${v.name} may have more than one arrivals area. Include the airline and flight number so the correct pickup instructions can be confirmed.`,
      },
      {
        title: "Review one route-specific total",
        body: "The quote states the route, vehicle class and applicable airport or road fees. Nothing is booked until you accept the confirmed details.",
      },
      {
        title: "Pay only after confirmation",
        body: "Availability and the full fare are confirmed before payment. A quote request is not an instant booking.",
      },
    ],
    insights: [
      `${v.name} (${v.iata}) serves ${v.cityName}, ${v.country}. A confirmed private-transfer quote records the route, vehicle class, pickup instructions and total fare before the journey.`,
      "Include passenger numbers, luggage, flight details and any equipment requests so the local partner can confirm availability and the suitable vehicle.",
    ],
    comparison: [
      {
        mode: "Airport taxi rank",
        time: "On demand plus possible queue",
        cost: "Metered or variable",
        pros: "Can be available after arrival",
        cons: "Queue and final fare may vary",
      },
      {
        mode: "Public transport",
        time: "Route and timetable dependent",
        cost: "Usually lower",
        pros: "Budget option",
        cons: "Not door-to-door; less convenient with luggage",
      },
      {
        mode: "TransferAround private transfer",
        time: "Direct after confirmation",
        cost: "Confirmed fixed quote",
        pros: "Route, vehicle and total agreed before payment",
        cons: "Advance request and confirmation required",
        recommended: true,
      },
    ],
    faqs: [
      {
        q: `How do I request a transfer from ${v.name} (${v.iata})?`,
        a: "Enter the pickup, destination, date, flight, passenger and luggage details. Availability and the fixed total are confirmed before payment.",
      },
      {
        q: `Where will the driver meet me at ${v.name}?`,
        a: "The exact terminal meeting point is provided in the confirmed transfer details after the flight information has been reviewed.",
      },
      {
        q: "Is the transfer price fixed?",
        a: "The accepted quote fixes the total for the confirmed route, vehicle and declared requirements. Any later change is reviewed and reconfirmed first.",
      },
      {
        q: "Can I request child seats or a larger vehicle?",
        a: "Add passenger ages, luggage and equipment requests to the quote. Availability and the appropriate vehicle are confirmed before payment.",
      },
    ],
  };
}

function el(v: Values): GeneratedCopy {
  return {
    terminals:
      "Οι λεπτομέρειες του τερματικού επιβεβαιώνονται αφού ελεγχθούν η πτήση και η διαδρομή.",
    pickupPoint: "Το σημείο συνάντησης γνωστοποιείται μόνο μετά την επιβεβαίωση της μεταφοράς.",
    cityDriveMin: "Ο χρόνος διαδρομής εξαρτάται από τον προορισμό και την κίνηση.",
    tollsNote: "Τυχόν διόδια και τέλη αεροδρομίου αναγράφονται στο επιβεβαιωμένο συνολικό ποσό.",
    intro: `Ζητήστε ιδιωτική μεταφορά με σταθερή τιμή από το αεροδρόμιο ${v.name} (${v.iata}) στην περιοχή ${v.cityName}, ${v.country}. Δηλώστε προορισμό, πτήση και στοιχεία επιβατών, ώστε να επιβεβαιωθούν η διαθεσιμότητα, το όχημα, το σημείο συνάντησης και η συνολική τιμή πριν από την πληρωμή.`,
    knowBefore: [
      {
        title: "Προσθέστε στοιχεία πτήσης και τερματικού",
        body: `Το αεροδρόμιο ${v.name} μπορεί να διαθέτει περισσότερους από έναν χώρους αφίξεων. Συμπληρώστε αεροπορική εταιρεία και αριθμό πτήσης, ώστε να επιβεβαιωθούν οι σωστές οδηγίες παραλαβής.`,
      },
      {
        title: "Ελέγξτε το συνολικό ποσό της διαδρομής",
        body: "Η προσφορά αναφέρει τη διαδρομή, την κατηγορία οχήματος και τυχόν τέλη αεροδρομίου ή δρόμου. Η κράτηση ολοκληρώνεται μόνο αφού αποδεχτείτε τα επιβεβαιωμένα στοιχεία.",
      },
      {
        title: "Πληρωμή μόνο μετά την επιβεβαίωση",
        body: "Η διαθεσιμότητα και η πλήρης τιμή επιβεβαιώνονται πριν από την πληρωμή. Το αίτημα προσφοράς δεν αποτελεί άμεση κράτηση.",
      },
    ],
    insights: [
      `Το αεροδρόμιο ${v.name} (${v.iata}) εξυπηρετεί την περιοχή ${v.cityName}, ${v.country}. Η επιβεβαιωμένη προσφορά ιδιωτικής μεταφοράς καταγράφει τη διαδρομή, την κατηγορία οχήματος, τις οδηγίες παραλαβής και τη συνολική τιμή πριν από το ταξίδι.`,
      "Δηλώστε αριθμό επιβατών, αποσκευές, στοιχεία πτήσης και τυχόν αιτήματα εξοπλισμού, ώστε ο τοπικός συνεργάτης να επιβεβαιώσει διαθεσιμότητα και κατάλληλο όχημα.",
    ],
    comparison: [
      {
        mode: "Πιάτσα ταξί αεροδρομίου",
        time: "Κατά την άφιξη, με πιθανή αναμονή",
        cost: "Με ταξίμετρο ή μεταβλητή τιμή",
        pros: "Μπορεί να είναι διαθέσιμο μετά την άφιξη",
        cons: "Η ουρά και η τελική τιμή ενδέχεται να διαφέρουν",
      },
      {
        mode: "Δημόσια συγκοινωνία",
        time: "Ανάλογα με διαδρομή και ωράριο",
        cost: "Συνήθως χαμηλότερο",
        pros: "Οικονομική επιλογή",
        cons: "Όχι πόρτα-πόρτα· λιγότερο πρακτική με αποσκευές",
      },
      {
        mode: "Ιδιωτική μεταφορά TransferAround",
        time: "Απευθείας μετά την επιβεβαίωση",
        cost: "Επιβεβαιωμένη σταθερή προσφορά",
        pros: "Διαδρομή, όχημα και σύνολο συμφωνούνται πριν από την πληρωμή",
        cons: "Απαιτούνται έγκαιρο αίτημα και επιβεβαίωση",
        recommended: true,
      },
    ],
    faqs: [
      {
        q: `Πώς ζητώ μεταφορά από το αεροδρόμιο ${v.name} (${v.iata});`,
        a: "Συμπληρώστε παραλαβή, προορισμό, ημερομηνία, πτήση, επιβάτες και αποσκευές. Η διαθεσιμότητα και το σταθερό συνολικό ποσό επιβεβαιώνονται πριν από την πληρωμή.",
      },
      {
        q: `Πού θα συναντήσω τον οδηγό στο αεροδρόμιο ${v.name};`,
        a: "Το ακριβές σημείο συνάντησης στον τερματικό περιλαμβάνεται στα επιβεβαιωμένα στοιχεία μεταφοράς, αφού ελεγχθούν τα στοιχεία πτήσης.",
      },
      {
        q: "Είναι σταθερή η τιμή της μεταφοράς;",
        a: "Η αποδεκτή προσφορά καθορίζει το σύνολο για την επιβεβαιωμένη διαδρομή, το όχημα και τις δηλωμένες απαιτήσεις. Κάθε μεταγενέστερη αλλαγή ελέγχεται και επιβεβαιώνεται ξανά.",
      },
      {
        q: "Μπορώ να ζητήσω παιδικό κάθισμα ή μεγαλύτερο όχημα;",
        a: "Προσθέστε ηλικίες επιβατών, αποσκευές και αιτήματα εξοπλισμού στην προσφορά. Η διαθεσιμότητα και το κατάλληλο όχημα επιβεβαιώνονται πριν από την πληρωμή.",
      },
    ],
  };
}

function de(v: Values): GeneratedCopy {
  return {
    terminals: "Terminalangaben werden nach Prüfung von Flug und Strecke bestätigt.",
    pickupPoint: "Der Treffpunkt wird erst nach Bestätigung des Transfers mitgeteilt.",
    cityDriveMin: "Die Fahrzeit hängt von Ziel und Verkehrslage ab.",
    tollsNote:
      "Anfallende Maut- und Flughafengebühren werden im bestätigten Gesamtpreis ausgewiesen.",
    intro: `Fragen Sie einen privaten Transfer zum Festpreis ab ${v.name} (${v.iata}) in ${v.cityName}, ${v.country} an. Geben Sie Ziel, Flug- und Passagierdaten an, damit Verfügbarkeit, Fahrzeug, Treffpunkt und Gesamtpreis vor der Zahlung bestätigt werden können.`,
    knowBefore: [
      {
        title: "Flug- und Terminaldaten angeben",
        body: `${v.name} kann mehrere Ankunftsbereiche haben. Geben Sie Fluggesellschaft und Flugnummer an, damit die richtigen Abholhinweise bestätigt werden können.`,
      },
      {
        title: "Streckenbezogenen Gesamtpreis prüfen",
        body: "Das Angebot nennt Strecke, Fahrzeugklasse und anfallende Flughafen- oder Straßengebühren. Gebucht wird erst, wenn Sie die bestätigten Angaben annehmen.",
      },
      {
        title: "Erst nach Bestätigung zahlen",
        body: "Verfügbarkeit und Gesamtpreis werden vor der Zahlung bestätigt. Eine Angebotsanfrage ist keine Sofortbuchung.",
      },
    ],
    insights: [
      `${v.name} (${v.iata}) bedient ${v.cityName}, ${v.country}. Ein bestätigtes Angebot für einen Privattransfer hält Strecke, Fahrzeugklasse, Abholhinweise und Gesamtpreis vor der Fahrt fest.`,
      "Geben Sie Personenzahl, Gepäck, Flugdaten und Ausstattungswünsche an, damit der lokale Partner Verfügbarkeit und ein passendes Fahrzeug bestätigen kann.",
    ],
    comparison: [
      {
        mode: "Taxistand am Flughafen",
        time: "Nach Ankunft, mögliche Wartezeit",
        cost: "Taxameter oder variabel",
        pros: "Kann nach der Ankunft verfügbar sein",
        cons: "Wartezeit und Endpreis können variieren",
      },
      {
        mode: "Öffentlicher Verkehr",
        time: "Strecken- und fahrplanabhängig",
        cost: "Meist günstiger",
        pros: "Preiswerte Option",
        cons: "Nicht Tür zu Tür; mit Gepäck weniger bequem",
      },
      {
        mode: "TransferAround Privattransfer",
        time: "Direkt nach Bestätigung",
        cost: "Bestätigtes Festpreisangebot",
        pros: "Strecke, Fahrzeug und Gesamtpreis vor Zahlung vereinbart",
        cons: "Vorherige Anfrage und Bestätigung erforderlich",
        recommended: true,
      },
    ],
    faqs: [
      {
        q: `Wie frage ich einen Transfer ab ${v.name} (${v.iata}) an?`,
        a: "Geben Sie Abholung, Ziel, Datum, Flug, Personen und Gepäck ein. Verfügbarkeit und fester Gesamtpreis werden vor der Zahlung bestätigt.",
      },
      {
        q: `Wo treffe ich den Fahrer am ${v.name}?`,
        a: "Der genaue Treffpunkt im Terminal steht nach Prüfung der Flugdaten in den bestätigten Transferangaben.",
      },
      {
        q: "Ist der Transferpreis fest?",
        a: "Das angenommene Angebot fixiert den Gesamtpreis für die bestätigte Strecke, das Fahrzeug und die angegebenen Anforderungen. Spätere Änderungen werden zuerst erneut geprüft und bestätigt.",
      },
      {
        q: "Kann ich Kindersitze oder ein größeres Fahrzeug anfragen?",
        a: "Geben Sie Alter, Gepäck und Ausstattungswünsche in der Anfrage an. Verfügbarkeit und das passende Fahrzeug werden vor der Zahlung bestätigt.",
      },
    ],
  };
}

function fr(v: Values): GeneratedCopy {
  return {
    terminals:
      "Les informations sur le terminal sont confirmées après vérification du vol et du trajet.",
    pickupPoint:
      "Le point de rendez-vous est communiqué uniquement après confirmation du transfert.",
    cityDriveMin: "La durée dépend de la destination et de la circulation.",
    tollsNote: "Les éventuels péages et frais d’aéroport figurent dans le montant total confirmé.",
    intro: `Demandez un transfert privé à prix fixe depuis l’aéroport ${v.name} (${v.iata}), à ${v.cityName}, ${v.country}. Indiquez la destination ainsi que les informations sur le vol et les passagers afin que la disponibilité, le véhicule, le point de rendez-vous et le tarif total soient confirmés avant le paiement.`,
    knowBefore: [
      {
        title: "Ajouter le vol et le terminal",
        body: `L’aéroport ${v.name} peut comporter plusieurs zones d’arrivée. Indiquez la compagnie et le numéro de vol afin que les bonnes instructions de prise en charge puissent être confirmées.`,
      },
      {
        title: "Vérifier le total propre au trajet",
        body: "Le devis précise le trajet, la catégorie de véhicule et les éventuels frais d’aéroport ou de route. La réservation n’est effectuée qu’après votre acceptation des éléments confirmés.",
      },
      {
        title: "Payer uniquement après confirmation",
        body: "La disponibilité et le tarif complet sont confirmés avant le paiement. Une demande de devis n’est pas une réservation instantanée.",
      },
    ],
    insights: [
      `L’aéroport ${v.name} (${v.iata}) dessert ${v.cityName}, ${v.country}. Un devis confirmé pour un transfert privé consigne le trajet, la catégorie de véhicule, les instructions de prise en charge et le tarif total avant le voyage.`,
      "Indiquez le nombre de passagers, les bagages, le vol et les éventuelles demandes d’équipement afin que le partenaire local confirme la disponibilité et le véhicule adapté.",
    ],
    comparison: [
      {
        mode: "Station de taxis de l’aéroport",
        time: "À la demande avec attente possible",
        cost: "Compteur ou tarif variable",
        pros: "Peut être disponible après l’arrivée",
        cons: "L’attente et le tarif final peuvent varier",
      },
      {
        mode: "Transports publics",
        time: "Selon le trajet et les horaires",
        cost: "Généralement moins cher",
        pros: "Option économique",
        cons: "Pas de porte-à-porte; moins pratique avec des bagages",
      },
      {
        mode: "Transfert privé TransferAround",
        time: "Direct après confirmation",
        cost: "Devis fixe confirmé",
        pros: "Trajet, véhicule et total convenus avant paiement",
        cons: "Demande préalable et confirmation nécessaires",
        recommended: true,
      },
    ],
    faqs: [
      {
        q: `Comment demander un transfert depuis l’aéroport ${v.name} (${v.iata}) ?`,
        a: "Indiquez le lieu de prise en charge, la destination, la date, le vol, les passagers et les bagages. La disponibilité et le montant fixe sont confirmés avant le paiement.",
      },
      {
        q: `Où retrouver le chauffeur à l’aéroport ${v.name} ?`,
        a: "Le point de rendez-vous exact dans le terminal figure dans les informations confirmées du transfert après vérification du vol.",
      },
      {
        q: "Le prix du transfert est-il fixe ?",
        a: "Le devis accepté fixe le montant pour le trajet, le véhicule et les besoins confirmés. Toute modification ultérieure est d’abord vérifiée et reconfirmée.",
      },
      {
        q: "Puis-je demander un siège enfant ou un véhicule plus grand ?",
        a: "Ajoutez l’âge des passagers, les bagages et les demandes d’équipement au devis. La disponibilité et le véhicule adapté sont confirmés avant le paiement.",
      },
    ],
  };
}

function it(v: Values): GeneratedCopy {
  return {
    terminals:
      "I dettagli del terminal vengono confermati dopo la verifica del volo e del percorso.",
    pickupPoint: "Il punto d’incontro viene comunicato solo dopo la conferma del trasferimento.",
    cityDriveMin: "La durata del viaggio varia in base alla destinazione e al traffico.",
    tollsNote: "Eventuali pedaggi e supplementi aeroportuali sono indicati nel totale confermato.",
    intro: `Richiedi un trasferimento privato a prezzo fisso dall’aeroporto ${v.name} (${v.iata}) a ${v.cityName}, ${v.country}. Indica destinazione, volo e dati dei passeggeri affinché disponibilità, veicolo, punto d’incontro e tariffa totale possano essere confermati prima del pagamento.`,
    knowBefore: [
      {
        title: "Aggiungi i dettagli di volo e terminal",
        body: `L’aeroporto ${v.name} può avere più aree arrivi. Indica compagnia aerea e numero del volo affinché vengano confermate le istruzioni corrette per il prelievo.`,
      },
      {
        title: "Controlla il totale specifico del percorso",
        body: "Il preventivo indica percorso, categoria del veicolo ed eventuali costi aeroportuali o stradali. La prenotazione avviene solo dopo l’accettazione dei dettagli confermati.",
      },
      {
        title: "Paga solo dopo la conferma",
        body: "Disponibilità e tariffa completa vengono confermate prima del pagamento. La richiesta di preventivo non è una prenotazione immediata.",
      },
    ],
    insights: [
      `L’aeroporto ${v.name} (${v.iata}) serve ${v.cityName}, ${v.country}. Un preventivo confermato per il trasferimento privato registra percorso, categoria del veicolo, istruzioni per il prelievo e tariffa totale prima del viaggio.`,
      "Indica numero di passeggeri, bagagli, dettagli del volo ed eventuali richieste di attrezzature affinché il partner locale possa confermare disponibilità e veicolo adatto.",
    ],
    comparison: [
      {
        mode: "Posteggio taxi aeroportuale",
        time: "Su richiesta con possibile attesa",
        cost: "A tassametro o variabile",
        pros: "Può essere disponibile dopo l’arrivo",
        cons: "Attesa e tariffa finale possono variare",
      },
      {
        mode: "Trasporto pubblico",
        time: "Dipende da percorso e orari",
        cost: "Generalmente inferiore",
        pros: "Opzione economica",
        cons: "Non porta a porta; meno pratico con i bagagli",
      },
      {
        mode: "Trasferimento privato TransferAround",
        time: "Diretto dopo la conferma",
        cost: "Preventivo fisso confermato",
        pros: "Percorso, veicolo e totale concordati prima del pagamento",
        cons: "Richiesta anticipata e conferma necessarie",
        recommended: true,
      },
    ],
    faqs: [
      {
        q: `Come richiedo un trasferimento dall’aeroporto ${v.name} (${v.iata})?`,
        a: "Inserisci luogo di prelievo, destinazione, data, volo, passeggeri e bagagli. Disponibilità e totale fisso vengono confermati prima del pagamento.",
      },
      {
        q: `Dove incontrerò l’autista all’aeroporto ${v.name}?`,
        a: "Il punto d’incontro esatto nel terminal è indicato nei dettagli confermati del trasferimento dopo la verifica dei dati del volo.",
      },
      {
        q: "Il prezzo del trasferimento è fisso?",
        a: "Il preventivo accettato fissa il totale per percorso, veicolo e requisiti confermati. Ogni modifica successiva viene prima verificata e riconfermata.",
      },
      {
        q: "Posso richiedere seggiolini o un veicolo più grande?",
        a: "Aggiungi età dei passeggeri, bagagli e richieste di attrezzature al preventivo. Disponibilità e veicolo adatto vengono confermati prima del pagamento.",
      },
    ],
  };
}

function nl(v: Values): GeneratedCopy {
  return {
    terminals: "Terminalgegevens worden bevestigd nadat de vlucht en route zijn gecontroleerd.",
    pickupPoint: "Het ontmoetingspunt wordt pas na bevestiging van de transfer doorgegeven.",
    cityDriveMin: "De reistijd hangt af van de bestemming en de verkeerssituatie.",
    tollsNote: "Eventuele tol- en luchthavenkosten worden in het bevestigde totaalbedrag vermeld.",
    intro: `Vraag een privétransfer met vaste prijs aan vanaf luchthaven ${v.name} (${v.iata}) in ${v.cityName}, ${v.country}. Geef de bestemming, vlucht- en passagiersgegevens door, zodat beschikbaarheid, voertuig, ontmoetingspunt en totaalprijs vóór betaling kunnen worden bevestigd.`,
    knowBefore: [
      {
        title: "Voeg vlucht- en terminalgegevens toe",
        body: `Luchthaven ${v.name} kan meerdere aankomstzones hebben. Vermeld de luchtvaartmaatschappij en het vluchtnummer, zodat de juiste ophaalinstructies kunnen worden bevestigd.`,
      },
      {
        title: "Controleer het routespecifieke totaal",
        body: "De offerte vermeldt de route, voertuigklasse en eventuele luchthaven- of wegkosten. Er wordt pas geboekt nadat u de bevestigde gegevens hebt geaccepteerd.",
      },
      {
        title: "Betaal pas na bevestiging",
        body: "Beschikbaarheid en de volledige prijs worden vóór betaling bevestigd. Een offerteaanvraag is geen directe boeking.",
      },
    ],
    insights: [
      `Luchthaven ${v.name} (${v.iata}) bedient ${v.cityName}, ${v.country}. Een bevestigde offerte voor een privétransfer legt de route, voertuigklasse, ophaalinstructies en totaalprijs vóór de reis vast.`,
      "Vermeld het aantal passagiers, bagage, vluchtgegevens en eventuele materiaalverzoeken, zodat de lokale partner beschikbaarheid en een passend voertuig kan bevestigen.",
    ],
    comparison: [
      {
        mode: "Taxistandplaats op de luchthaven",
        time: "Op aanvraag met mogelijke wachtrij",
        cost: "Meterprijs of variabel",
        pros: "Kan na aankomst beschikbaar zijn",
        cons: "Wachttijd en eindprijs kunnen variëren",
      },
      {
        mode: "Openbaar vervoer",
        time: "Afhankelijk van route en dienstregeling",
        cost: "Meestal lager",
        pros: "Voordelige optie",
        cons: "Niet van deur tot deur; minder handig met bagage",
      },
      {
        mode: "Privétransfer van TransferAround",
        time: "Rechtstreeks na bevestiging",
        cost: "Bevestigde vaste offerte",
        pros: "Route, voertuig en totaal vóór betaling overeengekomen",
        cons: "Vooraf aanvragen en bevestigen is vereist",
        recommended: true,
      },
    ],
    faqs: [
      {
        q: `Hoe vraag ik een transfer aan vanaf luchthaven ${v.name} (${v.iata})?`,
        a: "Vul ophaallocatie, bestemming, datum, vlucht, passagiers en bagage in. Beschikbaarheid en het vaste totaalbedrag worden vóór betaling bevestigd.",
      },
      {
        q: `Waar ontmoet ik de chauffeur op luchthaven ${v.name}?`,
        a: "Het exacte ontmoetingspunt in de terminal staat na controle van de vluchtgegevens in de bevestigde transferinformatie.",
      },
      {
        q: "Is de transferprijs vast?",
        a: "De geaccepteerde offerte legt het totaal vast voor de bevestigde route, het voertuig en de opgegeven vereisten. Latere wijzigingen worden eerst opnieuw gecontroleerd en bevestigd.",
      },
      {
        q: "Kan ik kinderzitjes of een groter voertuig aanvragen?",
        a: "Voeg leeftijden, bagage en materiaalverzoeken toe aan de offerteaanvraag. Beschikbaarheid en het geschikte voertuig worden vóór betaling bevestigd.",
      },
    ],
  };
}

function es(v: Values): GeneratedCopy {
  return {
    terminals: "Los datos de la terminal se confirman tras revisar el vuelo y la ruta.",
    pickupPoint: "El punto de encuentro se comunica únicamente después de confirmar el traslado.",
    cityDriveMin: "La duración del trayecto depende del destino y del tráfico.",
    tollsNote:
      "Los posibles peajes y cargos aeroportuarios figuran en el importe total confirmado.",
    intro: `Solicita un traslado privado con precio fijo desde el aeropuerto ${v.name} (${v.iata}), en ${v.cityName}, ${v.country}. Indica el destino y los datos del vuelo y los pasajeros para que la disponibilidad, el vehículo, el punto de encuentro y la tarifa total se confirmen antes del pago.`,
    knowBefore: [
      {
        title: "Añade los datos del vuelo y la terminal",
        body: `El aeropuerto ${v.name} puede tener varias zonas de llegadas. Indica la aerolínea y el número de vuelo para que se confirmen las instrucciones correctas de recogida.`,
      },
      {
        title: "Revisa el total específico de la ruta",
        body: "El presupuesto indica la ruta, la categoría del vehículo y los posibles cargos aeroportuarios o de carretera. La reserva solo se realiza cuando aceptas los datos confirmados.",
      },
      {
        title: "Paga únicamente tras la confirmación",
        body: "La disponibilidad y la tarifa completa se confirman antes del pago. Una solicitud de presupuesto no es una reserva inmediata.",
      },
    ],
    insights: [
      `El aeropuerto ${v.name} (${v.iata}) presta servicio a ${v.cityName}, ${v.country}. Un presupuesto confirmado de traslado privado deja establecidos la ruta, la categoría del vehículo, las instrucciones de recogida y la tarifa total antes del viaje.`,
      "Indica el número de pasajeros, el equipaje, los datos del vuelo y cualquier solicitud de equipamiento para que el colaborador local confirme la disponibilidad y el vehículo adecuado.",
    ],
    comparison: [
      {
        mode: "Parada de taxis del aeropuerto",
        time: "Bajo demanda con posible espera",
        cost: "Taxímetro o precio variable",
        pros: "Puede estar disponible después de la llegada",
        cons: "La espera y la tarifa final pueden variar",
      },
      {
        mode: "Transporte público",
        time: "Depende de la ruta y los horarios",
        cost: "Normalmente más bajo",
        pros: "Opción económica",
        cons: "No es puerta a puerta; menos práctico con equipaje",
      },
      {
        mode: "Traslado privado TransferAround",
        time: "Directo tras la confirmación",
        cost: "Presupuesto fijo confirmado",
        pros: "Ruta, vehículo y total acordados antes del pago",
        cons: "Se requiere solicitud previa y confirmación",
        recommended: true,
      },
    ],
    faqs: [
      {
        q: `¿Cómo solicito un traslado desde el aeropuerto ${v.name} (${v.iata})?`,
        a: "Indica la recogida, el destino, la fecha, el vuelo, los pasajeros y el equipaje. La disponibilidad y el importe fijo se confirman antes del pago.",
      },
      {
        q: `¿Dónde me encontraré con el conductor en el aeropuerto ${v.name}?`,
        a: "El punto de encuentro exacto en la terminal figura en los datos confirmados del traslado tras revisar la información del vuelo.",
      },
      {
        q: "¿El precio del traslado es fijo?",
        a: "El presupuesto aceptado fija el total para la ruta, el vehículo y los requisitos confirmados. Cualquier cambio posterior se revisa y vuelve a confirmar primero.",
      },
      {
        q: "¿Puedo solicitar sillas infantiles o un vehículo más grande?",
        a: "Añade las edades, el equipaje y las solicitudes de equipamiento al presupuesto. La disponibilidad y el vehículo adecuado se confirman antes del pago.",
      },
    ],
  };
}
