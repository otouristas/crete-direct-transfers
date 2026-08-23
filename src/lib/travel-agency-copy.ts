import type { Locale } from "@/i18n";

export type TravelAgencyCopy = {
  nav: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  benefitsTitle: string;
  benefits: string[];
  noteTitle: string;
  note: string;
  formTitle: string;
  metaTitle: string;
  metaDescription: string;
};

export const TRAVEL_AGENCY_COPY: Record<Locale, TravelAgencyCopy> = {
  en: {
    nav: "Travel agencies",
    eyebrow: "Partner with us",
    title: "Transfers built for travel agencies.",
    subtitle:
      "Reliable airport, port and city transfers for FIT, group and VIP clients — with one accountable operations contact.",
    benefitsTitle: "What agency partners get",
    benefits: [
      "Clear, quote-based pricing before client confirmation",
      "Airport, port, hotel and multi-stop itinerary support",
      "Group, family and VIP vehicle planning",
      "Local licensed-driver coordination",
      "Booking references and status updates for every trip",
      "One contact for changes, delays and special requests",
    ],
    noteTitle: "Built for repeat business",
    note: "Tell us where you operate and your expected booking volume. We will confirm coverage, workflow and commercial terms before accepting live reservations.",
    formTitle: "Tell us about your agency",
    metaTitle: "Travel Agency Transfer Partnerships | TransferAround",
    metaDescription:
      "Partner with TransferAround for airport, port and city transfers for FIT, group and VIP travel clients.",
  },
  el: {
    nav: "Ταξιδιωτικά γραφεία",
    eyebrow: "Συνεργαστείτε μαζί μας",
    title: "Μεταφορές για ταξιδιωτικά γραφεία.",
    subtitle:
      "Αξιόπιστες μεταφορές από αεροδρόμια, λιμάνια και πόλεις για μεμονωμένους ταξιδιώτες, γκρουπ και VIP πελάτες.",
    benefitsTitle: "Τι προσφέρουμε στα συνεργαζόμενα γραφεία",
    benefits: [
      "Σαφείς τιμές κατόπιν προσφοράς πριν από την επιβεβαίωση",
      "Υποστήριξη αεροδρομίων, λιμανιών, ξενοδοχείων και πολλαπλών στάσεων",
      "Σχεδιασμός οχημάτων για γκρουπ, οικογένειες και VIP",
      "Συντονισμός αδειοδοτημένων τοπικών οδηγών",
      "Κωδικοί κράτησης και ενημερώσεις κατάστασης",
      "Ένα σημείο επικοινωνίας για αλλαγές, καθυστερήσεις και ειδικά αιτήματα",
    ],
    noteTitle: "Σχεδιασμένο για σταθερές συνεργασίες",
    note: "Πείτε μας πού δραστηριοποιείστε και τον αναμενόμενο όγκο κρατήσεων. Επιβεβαιώνουμε κάλυψη, ροή εργασίας και εμπορικούς όρους πριν δεχτούμε κρατήσεις.",
    formTitle: "Πείτε μας για το γραφείο σας",
    metaTitle: "Συνεργασίες μεταφοράς για ταξιδιωτικά γραφεία | TransferAround",
    metaDescription:
      "Συνεργαστείτε με το TransferAround για μεταφορές αεροδρομίου, λιμανιού και πόλης για ιδιώτες, γκρουπ και VIP.",
  },
  de: {
    nav: "Reisebüros",
    eyebrow: "Partner werden",
    title: "Transfers für Reisebüros.",
    subtitle:
      "Zuverlässige Flughafen-, Hafen- und Stadttransfers für Einzelreisende, Gruppen und VIP-Kunden — mit einem festen Ansprechpartner.",
    benefitsTitle: "Vorteile für Agenturpartner",
    benefits: [
      "Klare Angebotspreise vor der Kundenbestätigung",
      "Flughafen-, Hafen-, Hotel- und Mehrstopp-Transfers",
      "Fahrzeugplanung für Gruppen, Familien und VIPs",
      "Koordination lizenzierter Fahrer vor Ort",
      "Buchungsreferenzen und Statusupdates für jede Fahrt",
      "Ein Kontakt für Änderungen, Verspätungen und Sonderwünsche",
    ],
    noteTitle: "Für wiederkehrendes Geschäft",
    note: "Nennen Sie uns Ihre Märkte und das erwartete Volumen. Wir bestätigen Abdeckung, Ablauf und Konditionen vor der ersten Live-Buchung.",
    formTitle: "Erzählen Sie uns von Ihrem Reisebüro",
    metaTitle: "Transferpartnerschaften für Reisebüros | TransferAround",
    metaDescription:
      "TransferAround organisiert Flughafen-, Hafen- und Stadttransfers für Kunden von Reisebüros, Gruppen und VIPs.",
  },
  fr: {
    nav: "Agences de voyages",
    eyebrow: "Devenez partenaire",
    title: "Des transferts conçus pour les agences.",
    subtitle:
      "Transferts fiables depuis les aéroports, ports et villes pour les clients individuels, groupes et VIP — avec un contact opérationnel unique.",
    benefitsTitle: "Les avantages pour votre agence",
    benefits: [
      "Tarification claire sur devis avant confirmation",
      "Prise en charge des aéroports, ports, hôtels et trajets multi-arrêts",
      "Planification des véhicules pour groupes, familles et VIP",
      "Coordination de chauffeurs locaux agréés",
      "Références de réservation et suivi de chaque trajet",
      "Un seul contact pour les changements, retards et demandes spéciales",
    ],
    noteTitle: "Pensé pour les partenariats durables",
    note: "Indiquez-nous vos marchés et votre volume prévu. Nous confirmons la couverture, le processus et les conditions commerciales avant les réservations.",
    formTitle: "Présentez-nous votre agence",
    metaTitle: "Partenariats transferts pour agences de voyages | TransferAround",
    metaDescription:
      "TransferAround organise les transferts aéroport, port et ville des clients individuels, groupes et VIP des agences de voyages.",
  },
  it: {
    nav: "Agenzie di viaggio",
    eyebrow: "Collabora con noi",
    title: "Transfer per agenzie di viaggio.",
    subtitle:
      "Transfer affidabili da aeroporti, porti e città per clienti individuali, gruppi e VIP, con un unico contatto operativo.",
    benefitsTitle: "Vantaggi per le agenzie",
    benefits: [
      "Prezzi chiari su preventivo",
      "Aeroporti, porti, hotel e itinerari con più fermate",
      "Pianificazione veicoli per gruppi, famiglie e VIP",
      "Coordinamento di autisti locali autorizzati",
      "Riferimenti e aggiornamenti per ogni corsa",
      "Un contatto per modifiche, ritardi e richieste speciali",
    ],
    noteTitle: "Per collaborazioni continuative",
    note: "Indicaci mercati e volume previsto. Confermeremo copertura, processo e condizioni prima delle prenotazioni.",
    formTitle: "Parlaci della tua agenzia",
    metaTitle: "Partnership transfer per agenzie | TransferAround",
    metaDescription:
      "Transfer aeroportuali, portuali e urbani per clienti individuali, gruppi e VIP delle agenzie di viaggio.",
  },
  nl: {
    nav: "Reisbureaus",
    eyebrow: "Word partner",
    title: "Transfers voor reisbureaus.",
    subtitle:
      "Betrouwbare luchthaven-, haven- en stadstransfers voor individuele reizigers, groepen en VIP-klanten, met één operationeel contact.",
    benefitsTitle: "Voordelen voor reisbureaus",
    benefits: [
      "Duidelijke offerteprijzen vóór bevestiging",
      "Luchthaven-, haven-, hotel- en meerstoproutes",
      "Voertuigplanning voor groepen, families en VIPs",
      "Coördinatie van lokale vergunde chauffeurs",
      "Boekingsreferenties en statusupdates",
      "Eén contact voor wijzigingen, vertragingen en speciale verzoeken",
    ],
    noteTitle: "Voor terugkerende samenwerking",
    note: "Vertel ons uw markten en verwacht volume. We bevestigen dekking, werkwijze en voorwaarden vóór live boekingen.",
    formTitle: "Vertel ons over uw reisbureau",
    metaTitle: "Transferpartners voor reisbureaus | TransferAround",
    metaDescription:
      "TransferAround regelt luchthaven-, haven- en stadstransfers voor reisbureauklanten, groepen en VIPs.",
  },
  es: {
    nav: "Agencias de viajes",
    eyebrow: "Colabora con nosotros",
    title: "Traslados para agencias de viajes.",
    subtitle:
      "Traslados fiables desde aeropuertos, puertos y ciudades para clientes individuales, grupos y VIP, con un único contacto operativo.",
    benefitsTitle: "Ventajas para agencias",
    benefits: [
      "Precios claros bajo presupuesto antes de confirmar",
      "Aeropuertos, puertos, hoteles e itinerarios con varias paradas",
      "Planificación de vehículos para grupos, familias y VIP",
      "Coordinación de conductores locales autorizados",
      "Referencias y actualizaciones para cada servicio",
      "Un contacto para cambios, retrasos y solicitudes especiales",
    ],
    noteTitle: "Pensado para colaboraciones recurrentes",
    note: "Indíquenos mercados y volumen previsto. Confirmaremos cobertura, proceso y condiciones antes de aceptar reservas.",
    formTitle: "Háblenos de su agencia",
    metaTitle: "Colaboración de traslados para agencias | TransferAround",
    metaDescription:
      "TransferAround coordina traslados de aeropuerto, puerto y ciudad para clientes, grupos y VIP de agencias de viajes.",
  },
};
