const interpolate = (template: string, values: string[]) =>
  values.reduce((result, value, index) => result.replace(`{${index}}`, value), template);

type Copy = {
  transfersTitle: string;
  heroDescription: string;
  heroTrustLine: string;
  aiPrompt: string;
  quoteNote: string;
  airportName: string;
  primaryCity: string;
  country: string;
  startingPrice: string;
  flightMonitoringValue: string;
  waitingTime: string;
  waitingTimeValue: string;
  factsTitle: string;
  updated: string;
  privateHire: string;
  arrivalCare: string;
  transparentFares: string;
  flexibility: string;
  trustHighlights: string;
  knowBeforeTitle: string;
  knowBeforeBody: string;
  insightsTitle: string;
  showLess: string;
  readMoreInsights: string;
  status: string;
  operating: string;
  officialName: string;
  iataCode: string;
  address: string;
  city: string;
  zipcode: string;
  alias: string;
  pickup: string;
  terminals: string;
  comparisonTitle: string;
  comparisonBody: string;
  mode: string;
  cost: string;
  pros: string;
  cons: string;
  recommended: string;
  comparisonNote: string;
  vehiclesTitle: string;
  vehiclesBody: string;
  popularRoutesTitle: string;
  popularRoutesBody: string;
  showFewer: string;
  viewMore: string;
  route: string;
  transferFromTo: string;
  compareFares: string;
  otherAirportsTitle: string;
  otherAirportsBody: string;
  viewAllAirports: string;
  routeDescription: string;
  areaServed: string;
  distanceSummary: string;
  routeAiPrompt: string;
  routeFactsTitle: string;
  averageTravelTime: string;
  routeFlightValue: string;
  routeWaitValue: string;
  routeKnowTitle: string;
  routeFaqTitle: string;
  routeFaqSubtitle: string;
  alternativesTitle: string;
  viewAllTransfers: string;
};

const copy: Record<"en" | "el" | "de" | "fr" | "it" | "nl" | "es", Copy> = {
  en: {
    transfersTitle: "{0} Transfers ({1})",
    heroDescription:
      "Fixed-price private transfers with licensed local chauffeurs. Meet & greet, real-time flight tracking and a free 60-minute wait.",
    heroTrustLine: "Fixed price · Free cancellation · Flight monitoring",
    aiPrompt: "Transfer from {0} ({1}) tomorrow for 2 passengers",
    quoteNote:
      "From {0} · quote confirmed before you pay. Instant checkout is live for Crete; elsewhere we confirm your fare shortly.",
    airportName: "Airport name",
    primaryCity: "Primary city served",
    country: "Country",
    startingPrice: "Starting price",
    flightMonitoringValue: "Real-time flight tracking — driver adjusts if delayed",
    waitingTime: "Waiting time",
    waitingTimeValue: "60 min free wait at arrivals, 15 min for other pickups",
    factsTitle: "Essential facts for transfers at {0} ({1})",
    updated: "Updated {0}",
    privateHire: "Licensed private hire",
    arrivalCare: "Arrival care",
    transparentFares: "Transparent fares",
    flexibility: "Flexibility",
    trustHighlights: "Trust highlights",
    knowBeforeTitle: "What to know before your transfer at {0} ({1})",
    knowBeforeBody:
      "Tolls, charges, terminal pickup zones and local rules that affect your private transfer at {0}.",
    insightsTitle: "Transfer insights for {0}",
    showLess: "Show less",
    readMoreInsights: "Read more insights",
    status: "Status",
    operating: "Operating",
    officialName: "Official name",
    iataCode: "IATA code",
    address: "Address",
    city: "City",
    zipcode: "Postcode",
    alias: "Alias",
    pickup: "Pickup",
    terminals: "Terminals",
    comparisonTitle: "Ways to get from {0} ({1}) to {2} — compared",
    comparisonBody:
      "Real time, real cost and real trade-offs across the practical transport options at this airport.",
    mode: "Mode",
    cost: "Cost",
    pros: "Pros",
    cons: "Cons",
    recommended: "Recommended",
    comparisonNote:
      "Times are typical door-to-door estimates including expected wait. Public-transport fares are indicative and may vary.",
    vehiclesTitle: "Vehicles available at {0} ({1})",
    vehiclesBody:
      "Choose the right vehicle for your group and comfort needs. All fares are fixed and include meet & greet.",
    popularRoutesTitle: "Popular transfer routes from {0} ({1})",
    popularRoutesBody: "Discover the most booked private transfers departing from this airport.",
    showFewer: "Show fewer destinations",
    viewMore: "View more destinations",
    route: "Route",
    transferFromTo: "Transfer from {0} to {1}",
    compareFares: "Compare fares",
    otherAirportsTitle: "Other airports in {0}",
    otherAirportsBody: "Discover more airport transfer options across {0}.",
    viewAllAirports: "View all airports",
    routeDescription:
      "Private transfer from {0} to {1}. {2} km in about {3} min. Fixed prices, flight tracking and free cancellation. From {4}.",
    areaServed: "{0}, {1}",
    distanceSummary: "{0} km · about {1} min · from {2}",
    routeAiPrompt: "Book {0} to {1} tomorrow for 2 passengers",
    routeFactsTitle: "Essential facts for transfers from {0} to {1}",
    averageTravelTime: "Average travel time",
    routeFlightValue: "Real-time — driver adjusts if delayed",
    routeWaitValue: "60 min free wait at arrivals",
    routeKnowTitle: "What to know about the {0} → {1} route",
    routeFaqTitle: "Book your transport from {0} to {1}",
    routeFaqSubtitle: "Answers about pickup, timing, pricing and drop-off for this route.",
    alternativesTitle: "Popular alternatives from {0}",
    viewAllTransfers: "View all {0} transfers",
  },
  el: {
    transfersTitle: "Μεταφορές {0} ({1})",
    heroDescription:
      "Ιδιωτικές μεταφορές σταθερής τιμής με αδειούχους τοπικούς οδηγούς, προσωπική υποδοχή, παρακολούθηση πτήσης και 60 λεπτά δωρεάν αναμονή.",
    heroTrustLine: "Σταθερή τιμή · Δωρεάν ακύρωση · Παρακολούθηση πτήσης",
    aiPrompt: "Μεταφορά από {0} ({1}) αύριο για 2 επιβάτες",
    quoteNote:
      "Από {0} · η προσφορά επιβεβαιώνεται πριν την πληρωμή. Άμεση κράτηση στην Κρήτη· στις άλλες περιοχές επιβεβαιώνουμε σύντομα την τιμή.",
    airportName: "Όνομα αεροδρομίου",
    primaryCity: "Κύρια πόλη εξυπηρέτησης",
    country: "Χώρα",
    startingPrice: "Τιμή από",
    flightMonitoringValue:
      "Παρακολούθηση πτήσης σε πραγματικό χρόνο — ο οδηγός προσαρμόζεται σε καθυστέρηση",
    waitingTime: "Χρόνος αναμονής",
    waitingTimeValue: "60 λεπτά δωρεάν στις αφίξεις, 15 λεπτά στις άλλες παραλαβές",
    factsTitle: "Βασικές πληροφορίες μεταφοράς για {0} ({1})",
    updated: "Ενημερώθηκε {0}",
    privateHire: "Αδειούχη ιδιωτική μεταφορά",
    arrivalCare: "Φροντίδα άφιξης",
    transparentFares: "Διαφανείς τιμές",
    flexibility: "Ευελιξία",
    trustHighlights: "Στοιχεία εμπιστοσύνης",
    knowBeforeTitle: "Τι να γνωρίζετε πριν τη μεταφορά σας από το {0} ({1})",
    knowBeforeBody:
      "Διόδια, χρεώσεις, σημεία παραλαβής και τοπικοί κανόνες που επηρεάζουν τη μεταφορά σας από το {0}.",
    insightsTitle: "Χρήσιμες πληροφορίες μεταφοράς για {0}",
    showLess: "Λιγότερα",
    readMoreInsights: "Περισσότερες πληροφορίες",
    status: "Κατάσταση",
    operating: "Σε λειτουργία",
    officialName: "Επίσημη ονομασία",
    iataCode: "Κωδικός IATA",
    address: "Διεύθυνση",
    city: "Πόλη",
    zipcode: "Ταχυδρομικός κώδικας",
    alias: "Εναλλακτική ονομασία",
    pickup: "Παραλαβή",
    terminals: "Τερματικοί σταθμοί",
    comparisonTitle: "Σύγκριση τρόπων μετάβασης από {0} ({1}) προς {2}",
    comparisonBody: "Πραγματικός χρόνος, κόστος και επιλογές μετάβασης από το αεροδρόμιο.",
    mode: "Μέσο",
    cost: "Κόστος",
    pros: "Πλεονεκτήματα",
    cons: "Μειονεκτήματα",
    recommended: "Προτεινόμενο",
    comparisonNote:
      "Οι χρόνοι είναι ενδεικτικοί από πόρτα σε πόρτα και περιλαμβάνουν την αναμονή. Οι τιμές δημόσιων συγκοινωνιών ενδέχεται να διαφέρουν.",
    vehiclesTitle: "Διαθέσιμα οχήματα στο {0} ({1})",
    vehiclesBody:
      "Επιλέξτε το κατάλληλο όχημα για την ομάδα σας. Όλες οι τιμές είναι σταθερές και περιλαμβάνουν προσωπική υποδοχή.",
    popularRoutesTitle: "Δημοφιλείς διαδρομές από {0} ({1})",
    popularRoutesBody: "Δείτε τις πιο δημοφιλείς ιδιωτικές μεταφορές από αυτό το αεροδρόμιο.",
    showFewer: "Λιγότεροι προορισμοί",
    viewMore: "Περισσότεροι προορισμοί",
    route: "Διαδρομή",
    transferFromTo: "Μεταφορά από {0} προς {1}",
    compareFares: "Σύγκριση τιμών",
    otherAirportsTitle: "Άλλα αεροδρόμια στην {0}",
    otherAirportsBody: "Ανακαλύψτε περισσότερες μεταφορές αεροδρομίου στην {0}.",
    viewAllAirports: "Όλα τα αεροδρόμια",
    routeDescription:
      "Ιδιωτική μεταφορά από {0} προς {1}. {2} χλμ. σε περίπου {3} λεπτά. Σταθερές τιμές, παρακολούθηση πτήσης και δωρεάν ακύρωση. Από {4}.",
    areaServed: "{0}, {1}",
    distanceSummary: "{0} χλμ. · περίπου {1} λεπτά · από {2}",
    routeAiPrompt: "Κράτηση από {0} προς {1} αύριο για 2 επιβάτες",
    routeFactsTitle: "Βασικές πληροφορίες μεταφοράς από {0} προς {1}",
    averageTravelTime: "Μέσος χρόνος διαδρομής",
    routeFlightValue: "Σε πραγματικό χρόνο — ο οδηγός προσαρμόζεται σε καθυστέρηση",
    routeWaitValue: "60 λεπτά δωρεάν αναμονή στις αφίξεις",
    routeKnowTitle: "Τι να γνωρίζετε για τη διαδρομή {0} → {1}",
    routeFaqTitle: "Κλείστε τη μεταφορά σας από {0} προς {1}",
    routeFaqSubtitle: "Απαντήσεις για την παραλαβή, τον χρόνο, την τιμή και την αποβίβαση.",
    alternativesTitle: "Δημοφιλείς εναλλακτικές από {0}",
    viewAllTransfers: "Όλες οι μεταφορές από {0}",
  },
  de: {
    transfersTitle: "Transfers am {0} ({1})",
    heroDescription:
      "Private Festpreis-Transfers mit lizenzierten lokalen Fahrern, Abholung, Flugverfolgung und 60 Minuten kostenloser Wartezeit.",
    heroTrustLine: "Festpreis · Kostenlose Stornierung · Flugverfolgung",
    aiPrompt: "Transfer ab {0} ({1}) morgen für 2 Personen",
    quoteNote:
      "Ab {0} · Bestätigung vor der Zahlung. Sofortbuchung auf Kreta; anderswo bestätigen wir den Preis kurzfristig.",
    airportName: "Flughafenname",
    primaryCity: "Hauptziel",
    country: "Land",
    startingPrice: "Preis ab",
    flightMonitoringValue: "Flugverfolgung in Echtzeit — der Fahrer passt sich Verspätungen an",
    waitingTime: "Wartezeit",
    waitingTimeValue: "60 Min. kostenlos bei Ankunft, 15 Min. bei anderen Abholungen",
    factsTitle: "Wichtige Transferinformationen für {0} ({1})",
    updated: "Aktualisiert {0}",
    privateHire: "Lizenzierter Privattransfer",
    arrivalCare: "Ankunftsservice",
    transparentFares: "Transparente Preise",
    flexibility: "Flexibilität",
    trustHighlights: "Vertrauensmerkmale",
    knowBeforeTitle: "Vor Ihrem Transfer am {0} ({1})",
    knowBeforeBody: "Maut, Gebühren, Abholzonen und lokale Regeln für Ihren Privattransfer am {0}.",
    insightsTitle: "Transferinformationen für {0}",
    showLess: "Weniger anzeigen",
    readMoreInsights: "Mehr erfahren",
    status: "Status",
    operating: "In Betrieb",
    officialName: "Offizieller Name",
    iataCode: "IATA-Code",
    address: "Adresse",
    city: "Stadt",
    zipcode: "Postleitzahl",
    alias: "Alternativname",
    pickup: "Abholung",
    terminals: "Terminals",
    comparisonTitle: "Verkehrsmittel von {0} ({1}) nach {2} im Vergleich",
    comparisonBody: "Zeit, Kosten und praktische Unterschiede der verfügbaren Verkehrsmittel.",
    mode: "Verkehrsmittel",
    cost: "Kosten",
    pros: "Vorteile",
    cons: "Nachteile",
    recommended: "Empfohlen",
    comparisonNote:
      "Die Zeiten sind typische Schätzungen von Tür zu Tür einschließlich Wartezeit. Fahrpreise des Nahverkehrs können abweichen.",
    vehiclesTitle: "Verfügbare Fahrzeuge am {0} ({1})",
    vehiclesBody:
      "Wählen Sie das passende Fahrzeug für Ihre Gruppe. Alle Preise sind fest und beinhalten den Abholservice.",
    popularRoutesTitle: "Beliebte Transfers ab {0} ({1})",
    popularRoutesBody: "Entdecken Sie die meistgebuchten Privattransfers ab diesem Flughafen.",
    showFewer: "Weniger Ziele anzeigen",
    viewMore: "Weitere Ziele anzeigen",
    route: "Route",
    transferFromTo: "Transfer von {0} nach {1}",
    compareFares: "Preise vergleichen",
    otherAirportsTitle: "Weitere Flughäfen in {0}",
    otherAirportsBody: "Entdecken Sie weitere Flughafentransfers in {0}.",
    viewAllAirports: "Alle Flughäfen",
    routeDescription:
      "Privattransfer von {0} nach {1}. {2} km in etwa {3} Min. Festpreise, Flugverfolgung und kostenlose Stornierung. Ab {4}.",
    areaServed: "{0}, {1}",
    distanceSummary: "{0} km · etwa {1} Min. · ab {2}",
    routeAiPrompt: "{0} nach {1} morgen für 2 Personen buchen",
    routeFactsTitle: "Wichtige Fakten für Transfers von {0} nach {1}",
    averageTravelTime: "Durchschnittliche Fahrzeit",
    routeFlightValue: "In Echtzeit — der Fahrer passt sich Verspätungen an",
    routeWaitValue: "60 Min. kostenlose Wartezeit bei Ankunft",
    routeKnowTitle: "Wissenswertes zur Route {0} → {1}",
    routeFaqTitle: "Transfer von {0} nach {1} buchen",
    routeFaqSubtitle: "Antworten zu Abholung, Fahrzeit, Preis und Zielort.",
    alternativesTitle: "Beliebte Alternativen ab {0}",
    viewAllTransfers: "Alle Transfers ab {0}",
  },
  fr: {
    transfersTitle: "Transferts à {0} ({1})",
    heroDescription:
      "Transferts privés à prix fixe avec chauffeurs locaux agréés, accueil, suivi du vol et 60 minutes d’attente gratuites.",
    heroTrustLine: "Prix fixe · Annulation gratuite · Suivi du vol",
    aiPrompt: "Transfert depuis {0} ({1}) demain pour 2 passagers",
    quoteNote:
      "À partir de {0} · devis confirmé avant paiement. Réservation immédiate en Crète ; ailleurs, nous confirmons rapidement le tarif.",
    airportName: "Nom de l’aéroport",
    primaryCity: "Ville principale desservie",
    country: "Pays",
    startingPrice: "Prix de départ",
    flightMonitoringValue: "Suivi du vol en temps réel — le chauffeur s’adapte aux retards",
    waitingTime: "Temps d’attente",
    waitingTimeValue: "60 min gratuites aux arrivées, 15 min pour les autres prises en charge",
    factsTitle: "Informations essentielles pour les transferts à {0} ({1})",
    updated: "Mis à jour le {0}",
    privateHire: "Transport privé agréé",
    arrivalCare: "Accueil à l’arrivée",
    transparentFares: "Tarifs transparents",
    flexibility: "Flexibilité",
    trustHighlights: "Garanties de confiance",
    knowBeforeTitle: "À savoir avant votre transfert à {0} ({1})",
    knowBeforeBody:
      "Péages, frais, zones de prise en charge et règles locales pour votre transfert privé à {0}.",
    insightsTitle: "Conseils de transfert pour {0}",
    showLess: "Afficher moins",
    readMoreInsights: "Lire plus de conseils",
    status: "Statut",
    operating: "En service",
    officialName: "Nom officiel",
    iataCode: "Code IATA",
    address: "Adresse",
    city: "Ville",
    zipcode: "Code postal",
    alias: "Autre nom",
    pickup: "Prise en charge",
    terminals: "Terminaux",
    comparisonTitle: "Comparer les trajets de {0} ({1}) à {2}",
    comparisonBody: "Temps, coût et compromis réels des moyens de transport disponibles.",
    mode: "Moyen",
    cost: "Coût",
    pros: "Avantages",
    cons: "Inconvénients",
    recommended: "Recommandé",
    comparisonNote:
      "Les durées sont des estimations porte à porte incluant l’attente. Les tarifs des transports publics peuvent varier.",
    vehiclesTitle: "Véhicules disponibles à {0} ({1})",
    vehiclesBody:
      "Choisissez le véhicule adapté à votre groupe. Tous les tarifs sont fixes et incluent l’accueil.",
    popularRoutesTitle: "Transferts populaires depuis {0} ({1})",
    popularRoutesBody: "Découvrez les transferts privés les plus réservés depuis cet aéroport.",
    showFewer: "Afficher moins de destinations",
    viewMore: "Afficher plus de destinations",
    route: "Trajet",
    transferFromTo: "Transfert de {0} à {1}",
    compareFares: "Comparer les tarifs",
    otherAirportsTitle: "Autres aéroports en {0}",
    otherAirportsBody: "Découvrez d’autres transferts aéroport en {0}.",
    viewAllAirports: "Voir tous les aéroports",
    routeDescription:
      "Transfert privé de {0} à {1}. {2} km en environ {3} min. Prix fixe, suivi du vol et annulation gratuite. À partir de {4}.",
    areaServed: "{0}, {1}",
    distanceSummary: "{0} km · environ {1} min · à partir de {2}",
    routeAiPrompt: "Réserver {0} à {1} demain pour 2 passagers",
    routeFactsTitle: "Informations essentielles pour les transferts de {0} à {1}",
    averageTravelTime: "Durée moyenne du trajet",
    routeFlightValue: "En temps réel — le chauffeur s’adapte aux retards",
    routeWaitValue: "60 min d’attente gratuite aux arrivées",
    routeKnowTitle: "À savoir sur le trajet {0} → {1}",
    routeFaqTitle: "Réserver votre transport de {0} à {1}",
    routeFaqSubtitle: "Réponses sur la prise en charge, les horaires, le prix et la destination.",
    alternativesTitle: "Alternatives populaires depuis {0}",
    viewAllTransfers: "Voir tous les transferts depuis {0}",
  },
  it: {
    transfersTitle: "Transfer da {0} ({1})",
    heroDescription:
      "Transfer privati a prezzo fisso con autisti locali autorizzati, accoglienza, monitoraggio del volo e 60 minuti di attesa gratuita.",
    heroTrustLine: "Prezzo fisso · Cancellazione gratuita · Monitoraggio del volo",
    aiPrompt: "Transfer da {0} ({1}) domani per 2 passeggeri",
    quoteNote:
      "Da {0} · preventivo confermato prima del pagamento. Prenotazione immediata a Creta; altrove confermiamo rapidamente la tariffa.",
    airportName: "Nome dell’aeroporto",
    primaryCity: "Città principale servita",
    country: "Paese",
    startingPrice: "Prezzo iniziale",
    flightMonitoringValue: "Monitoraggio del volo in tempo reale — l’autista si adatta ai ritardi",
    waitingTime: "Tempo di attesa",
    waitingTimeValue: "60 min gratuiti agli arrivi, 15 min per gli altri prelievi",
    factsTitle: "Informazioni essenziali per i transfer a {0} ({1})",
    updated: "Aggiornato il {0}",
    privateHire: "Noleggio privato autorizzato",
    arrivalCare: "Assistenza all’arrivo",
    transparentFares: "Tariffe trasparenti",
    flexibility: "Flessibilità",
    trustHighlights: "Garanzie di affidabilità",
    knowBeforeTitle: "Cosa sapere prima del transfer a {0} ({1})",
    knowBeforeBody:
      "Pedaggi, costi, zone di prelievo e regole locali per il transfer privato a {0}.",
    insightsTitle: "Consigli sui transfer per {0}",
    showLess: "Mostra meno",
    readMoreInsights: "Leggi altri consigli",
    status: "Stato",
    operating: "Operativo",
    officialName: "Nome ufficiale",
    iataCode: "Codice IATA",
    address: "Indirizzo",
    city: "Città",
    zipcode: "CAP",
    alias: "Altro nome",
    pickup: "Prelievo",
    terminals: "Terminal",
    comparisonTitle: "Confronto dei collegamenti da {0} ({1}) a {2}",
    comparisonBody: "Tempi, costi e differenze reali tra le opzioni di trasporto disponibili.",
    mode: "Mezzo",
    cost: "Costo",
    pros: "Vantaggi",
    cons: "Svantaggi",
    recommended: "Consigliato",
    comparisonNote:
      "I tempi sono stime tipiche porta a porta e includono l’attesa. Le tariffe dei trasporti pubblici possono variare.",
    vehiclesTitle: "Veicoli disponibili a {0} ({1})",
    vehiclesBody:
      "Scegliete il veicolo adatto al gruppo. Tutte le tariffe sono fisse e includono l’accoglienza.",
    popularRoutesTitle: "Transfer popolari da {0} ({1})",
    popularRoutesBody: "Scoprite i transfer privati più prenotati da questo aeroporto.",
    showFewer: "Mostra meno destinazioni",
    viewMore: "Mostra più destinazioni",
    route: "Percorso",
    transferFromTo: "Transfer da {0} a {1}",
    compareFares: "Confronta le tariffe",
    otherAirportsTitle: "Altri aeroporti in {0}",
    otherAirportsBody: "Scoprite altre opzioni di transfer aeroportuale in {0}.",
    viewAllAirports: "Vedi tutti gli aeroporti",
    routeDescription:
      "Transfer privato da {0} a {1}. {2} km in circa {3} min. Prezzo fisso, monitoraggio del volo e cancellazione gratuita. Da {4}.",
    areaServed: "{0}, {1}",
    distanceSummary: "{0} km · circa {1} min · da {2}",
    routeAiPrompt: "Prenota da {0} a {1} domani per 2 passeggeri",
    routeFactsTitle: "Informazioni essenziali per i transfer da {0} a {1}",
    averageTravelTime: "Tempo medio di viaggio",
    routeFlightValue: "In tempo reale — l’autista si adatta ai ritardi",
    routeWaitValue: "60 min di attesa gratuita agli arrivi",
    routeKnowTitle: "Cosa sapere sul percorso {0} → {1}",
    routeFaqTitle: "Prenota il trasporto da {0} a {1}",
    routeFaqSubtitle: "Risposte su prelievo, tempi, prezzo e destinazione.",
    alternativesTitle: "Alternative popolari da {0}",
    viewAllTransfers: "Vedi tutti i transfer da {0}",
  },
  nl: {
    transfersTitle: "Transfers vanaf {0} ({1})",
    heroDescription:
      "Privétransfers voor een vaste prijs met erkende lokale chauffeurs, ontvangst, vluchtbewaking en 60 minuten gratis wachttijd.",
    heroTrustLine: "Vaste prijs · Gratis annuleren · Vluchtbewaking",
    aiPrompt: "Transfer vanaf {0} ({1}) morgen voor 2 passagiers",
    quoteNote:
      "Vanaf {0} · offerte bevestigd vóór betaling. Direct boeken op Kreta; elders bevestigen we de ritprijs snel.",
    airportName: "Naam luchthaven",
    primaryCity: "Belangrijkste stad",
    country: "Land",
    startingPrice: "Prijs vanaf",
    flightMonitoringValue: "Realtime vluchtbewaking — de chauffeur past zich aan bij vertraging",
    waitingTime: "Wachttijd",
    waitingTimeValue: "60 min gratis bij aankomst, 15 min bij andere ophaalpunten",
    factsTitle: "Belangrijke transferinformatie voor {0} ({1})",
    updated: "Bijgewerkt {0}",
    privateHire: "Erkend privévervoer",
    arrivalCare: "Aankomstservice",
    transparentFares: "Transparante tarieven",
    flexibility: "Flexibiliteit",
    trustHighlights: "Betrouwbaarheid",
    knowBeforeTitle: "Wat u moet weten vóór uw transfer bij {0} ({1})",
    knowBeforeBody: "Tol, toeslagen, ophaalzones en lokale regels voor uw privétransfer bij {0}.",
    insightsTitle: "Transferinformatie voor {0}",
    showLess: "Minder tonen",
    readMoreInsights: "Meer informatie",
    status: "Status",
    operating: "Operationeel",
    officialName: "Officiële naam",
    iataCode: "IATA-code",
    address: "Adres",
    city: "Stad",
    zipcode: "Postcode",
    alias: "Andere naam",
    pickup: "Ophalen",
    terminals: "Terminals",
    comparisonTitle: "Vervoer van {0} ({1}) naar {2} vergeleken",
    comparisonBody: "Werkelijke reistijd, kosten en afwegingen van de beschikbare vervoersopties.",
    mode: "Vervoer",
    cost: "Kosten",
    pros: "Voordelen",
    cons: "Nadelen",
    recommended: "Aanbevolen",
    comparisonNote:
      "Tijden zijn gebruikelijke deur-tot-deurschattingen inclusief wachttijd. OV-tarieven kunnen variëren.",
    vehiclesTitle: "Beschikbare voertuigen bij {0} ({1})",
    vehiclesBody:
      "Kies het juiste voertuig voor uw groep. Alle tarieven zijn vast en inclusief ontvangst.",
    popularRoutesTitle: "Populaire transfers vanaf {0} ({1})",
    popularRoutesBody: "Bekijk de meest geboekte privétransfers vanaf deze luchthaven.",
    showFewer: "Minder bestemmingen tonen",
    viewMore: "Meer bestemmingen tonen",
    route: "Route",
    transferFromTo: "Transfer van {0} naar {1}",
    compareFares: "Tarieven vergelijken",
    otherAirportsTitle: "Andere luchthavens in {0}",
    otherAirportsBody: "Ontdek meer luchthaventransfers in {0}.",
    viewAllAirports: "Alle luchthavens bekijken",
    routeDescription:
      "Privétransfer van {0} naar {1}. {2} km in ongeveer {3} min. Vaste prijs, vluchtbewaking en gratis annuleren. Vanaf {4}.",
    areaServed: "{0}, {1}",
    distanceSummary: "{0} km · ongeveer {1} min. · vanaf {2}",
    routeAiPrompt: "Boek {0} naar {1} morgen voor 2 passagiers",
    routeFactsTitle: "Belangrijke feiten voor transfers van {0} naar {1}",
    averageTravelTime: "Gemiddelde reistijd",
    routeFlightValue: "Realtime — de chauffeur past zich aan bij vertraging",
    routeWaitValue: "60 min gratis wachttijd bij aankomst",
    routeKnowTitle: "Wat u moet weten over de route {0} → {1}",
    routeFaqTitle: "Boek uw vervoer van {0} naar {1}",
    routeFaqSubtitle: "Antwoorden over ophalen, reistijd, prijs en afzetten.",
    alternativesTitle: "Populaire alternatieven vanaf {0}",
    viewAllTransfers: "Alle transfers vanaf {0}",
  },
  es: {
    transfersTitle: "Traslados desde {0} ({1})",
    heroDescription:
      "Traslados privados a precio fijo con conductores locales autorizados, bienvenida, seguimiento del vuelo y 60 minutos de espera gratuita.",
    heroTrustLine: "Precio fijo · Cancelación gratuita · Seguimiento del vuelo",
    aiPrompt: "Traslado desde {0} ({1}) mañana para 2 pasajeros",
    quoteNote:
      "Desde {0} · presupuesto confirmado antes del pago. Reserva inmediata en Creta; en otros destinos confirmamos pronto la tarifa.",
    airportName: "Nombre del aeropuerto",
    primaryCity: "Ciudad principal",
    country: "País",
    startingPrice: "Precio desde",
    flightMonitoringValue:
      "Seguimiento del vuelo en tiempo real — el conductor se adapta a los retrasos",
    waitingTime: "Tiempo de espera",
    waitingTimeValue: "60 min gratis en llegadas, 15 min para otras recogidas",
    factsTitle: "Información esencial para traslados en {0} ({1})",
    updated: "Actualizado {0}",
    privateHire: "Transporte privado autorizado",
    arrivalCare: "Atención a la llegada",
    transparentFares: "Tarifas transparentes",
    flexibility: "Flexibilidad",
    trustHighlights: "Garantías de confianza",
    knowBeforeTitle: "Qué saber antes de su traslado en {0} ({1})",
    knowBeforeBody:
      "Peajes, cargos, zonas de recogida y normas locales para su traslado privado en {0}.",
    insightsTitle: "Consejos de traslado para {0}",
    showLess: "Mostrar menos",
    readMoreInsights: "Leer más consejos",
    status: "Estado",
    operating: "Operativo",
    officialName: "Nombre oficial",
    iataCode: "Código IATA",
    address: "Dirección",
    city: "Ciudad",
    zipcode: "Código postal",
    alias: "Otro nombre",
    pickup: "Recogida",
    terminals: "Terminales",
    comparisonTitle: "Comparativa para ir de {0} ({1}) a {2}",
    comparisonBody:
      "Tiempo, coste y diferencias reales entre las opciones de transporte disponibles.",
    mode: "Medio",
    cost: "Coste",
    pros: "Ventajas",
    cons: "Desventajas",
    recommended: "Recomendado",
    comparisonNote:
      "Los tiempos son estimaciones habituales puerta a puerta e incluyen la espera. Las tarifas del transporte público pueden variar.",
    vehiclesTitle: "Vehículos disponibles en {0} ({1})",
    vehiclesBody:
      "Elija el vehículo adecuado para su grupo. Todas las tarifas son fijas e incluyen la bienvenida.",
    popularRoutesTitle: "Traslados populares desde {0} ({1})",
    popularRoutesBody: "Descubra los traslados privados más reservados desde este aeropuerto.",
    showFewer: "Mostrar menos destinos",
    viewMore: "Mostrar más destinos",
    route: "Ruta",
    transferFromTo: "Traslado de {0} a {1}",
    compareFares: "Comparar tarifas",
    otherAirportsTitle: "Otros aeropuertos en {0}",
    otherAirportsBody: "Descubra más traslados de aeropuerto en {0}.",
    viewAllAirports: "Ver todos los aeropuertos",
    routeDescription:
      "Traslado privado de {0} a {1}. {2} km en unos {3} min. Precio fijo, seguimiento del vuelo y cancelación gratuita. Desde {4}.",
    areaServed: "{0}, {1}",
    distanceSummary: "{0} km · unos {1} min · desde {2}",
    routeAiPrompt: "Reservar de {0} a {1} mañana para 2 pasajeros",
    routeFactsTitle: "Información esencial para traslados de {0} a {1}",
    averageTravelTime: "Tiempo medio de viaje",
    routeFlightValue: "En tiempo real — el conductor se adapta a los retrasos",
    routeWaitValue: "60 min de espera gratuita en llegadas",
    routeKnowTitle: "Qué saber sobre la ruta {0} → {1}",
    routeFaqTitle: "Reserve su transporte de {0} a {1}",
    routeFaqSubtitle: "Respuestas sobre recogida, horarios, precio y destino.",
    alternativesTitle: "Alternativas populares desde {0}",
    viewAllTransfers: "Ver todos los traslados desde {0}",
  },
};

const makeAirportPages = (value: Copy) => ({
  ...value,
  transfersTitle: (name: string, iata: string) => interpolate(value.transfersTitle, [name, iata]),
  aiPrompt: (name: string, iata: string) => interpolate(value.aiPrompt, [name, iata]),
  quoteNote: (price: string) => interpolate(value.quoteNote, [price]),
  factsTitle: (name: string, iata: string) => interpolate(value.factsTitle, [name, iata]),
  updated: (date: string) => interpolate(value.updated, [date]),
  knowBeforeTitle: (name: string, iata: string) => interpolate(value.knowBeforeTitle, [name, iata]),
  knowBeforeBody: (name: string) => interpolate(value.knowBeforeBody, [name]),
  insightsTitle: (name: string) => interpolate(value.insightsTitle, [name]),
  comparisonTitle: (name: string, iata: string, city: string) =>
    interpolate(value.comparisonTitle, [name, iata, city]),
  vehiclesTitle: (name: string, iata: string) => interpolate(value.vehiclesTitle, [name, iata]),
  popularRoutesTitle: (name: string, iata: string) =>
    interpolate(value.popularRoutesTitle, [name, iata]),
  transferFromTo: (from: string, to: string) => interpolate(value.transferFromTo, [from, to]),
  otherAirportsTitle: (country: string) => interpolate(value.otherAirportsTitle, [country]),
  otherAirportsBody: (country: string) => interpolate(value.otherAirportsBody, [country]),
  routeDescription: (from: string, to: string, distance: string, duration: string, price: string) =>
    interpolate(value.routeDescription, [from, to, distance, duration, price]),
  areaServed: (city: string, country: string) => interpolate(value.areaServed, [city, country]),
  distanceSummary: (distance: string, duration: string, price: string) =>
    interpolate(value.distanceSummary, [distance, duration, price]),
  routeAiPrompt: (from: string, to: string) => interpolate(value.routeAiPrompt, [from, to]),
  routeFactsTitle: (from: string, to: string) => interpolate(value.routeFactsTitle, [from, to]),
  routeKnowTitle: (from: string, to: string) => interpolate(value.routeKnowTitle, [from, to]),
  routeFaqTitle: (from: string, to: string) => interpolate(value.routeFaqTitle, [from, to]),
  alternativesTitle: (name: string) => interpolate(value.alternativesTitle, [name]),
  viewAllTransfers: (name: string) => interpolate(value.viewAllTransfers, [name]),
});

export const airportPages = {
  en: makeAirportPages(copy.en),
  el: makeAirportPages(copy.el),
  de: makeAirportPages(copy.de),
  fr: makeAirportPages(copy.fr),
  it: makeAirportPages(copy.it),
  nl: makeAirportPages(copy.nl),
  es: makeAirportPages(copy.es),
};
