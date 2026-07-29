import type { Locale } from "@transferaround/i18n";
import type { Market } from "@/data/markets";

const countryNames: Record<Locale, Record<string, string>> = {
  en: {
    greece: "Greece",
    spain: "Spain",
    italy: "Italy",
    portugal: "Portugal",
    cyprus: "Cyprus",
    turkey: "Turkey",
  },
  el: {
    greece: "Ελλάδα",
    spain: "Ισπανία",
    italy: "Ιταλία",
    portugal: "Πορτογαλία",
    cyprus: "Κύπρος",
    turkey: "Τουρκία",
  },
  de: {
    greece: "Griechenland",
    spain: "Spanien",
    italy: "Italien",
    portugal: "Portugal",
    cyprus: "Zypern",
    turkey: "Türkei",
  },
  fr: {
    greece: "Grèce",
    spain: "Espagne",
    italy: "Italie",
    portugal: "Portugal",
    cyprus: "Chypre",
    turkey: "Turquie",
  },
  it: {
    greece: "Grecia",
    spain: "Spagna",
    italy: "Italia",
    portugal: "Portogallo",
    cyprus: "Cipro",
    turkey: "Turchia",
  },
  nl: {
    greece: "Griekenland",
    spain: "Spanje",
    italy: "Italië",
    portugal: "Portugal",
    cyprus: "Cyprus",
    turkey: "Turkije",
  },
  es: {
    greece: "Grecia",
    spain: "España",
    italy: "Italia",
    portugal: "Portugal",
    cyprus: "Chipre",
    turkey: "Turquía",
  },
};

export function getCountryName(locale: Locale, slug: string): string {
  return countryNames[locale][slug] ?? slug;
}

const templates: Record<
  Locale,
  {
    title: string;
    greeceBody: string;
    quoteBody: string;
    metaTitle: string;
    metaDescription: string;
    intents: string[];
  }
> = {
  en: {
    title: "Private transfers in {country}",
    greeceBody:
      "Licensed airport, port and resort transfers. Book Crete instantly and request confirmed quotes across the rest of Greece.",
    quoteBody:
      "Airport, port and city transfers with licensed local partners. Request a clear quote before travel.",
    metaTitle: "Private Transfers in {country} | Airports & Cities · TransferAround",
    metaDescription:
      "Request a private transfer in {country} with licensed local partners, meet and greet, and clear confirmation before travel.",
    intents: [
      "Private airport transfer in {country}",
      "City transfer in {country}",
      "Licensed chauffeur in {country}",
      "Port and resort transfer in {country}",
    ],
  },
  el: {
    title: "Ιδιωτικές μεταφορές στην {country}",
    greeceBody:
      "Αδειοδοτημένες μεταφορές από αεροδρόμια, λιμάνια και θέρετρα. Άμεση κράτηση στην Κρήτη και επιβεβαιωμένες προσφορές στην υπόλοιπη Ελλάδα.",
    quoteBody:
      "Μεταφορές από αεροδρόμια, λιμάνια και πόλεις με αδειοδοτημένους τοπικούς συνεργάτες και σαφή προσφορά πριν το ταξίδι.",
    metaTitle: "Ιδιωτικές μεταφορές στην {country} | TransferAround",
    metaDescription:
      "Ζητήστε ιδιωτική μεταφορά στην {country} με αδειοδοτημένους συνεργάτες και επιβεβαίωση πριν το ταξίδι.",
    intents: [
      "Ιδιωτική μεταφορά αεροδρομίου στην {country}",
      "Αστική μεταφορά στην {country}",
      "Αδειοδοτημένος οδηγός στην {country}",
      "Μεταφορά λιμανιού και θερέτρου στην {country}",
    ],
  },
  de: {
    title: "Private Transfers in {country}",
    greeceBody:
      "Lizenzierte Flughafen-, Hafen- und Resorttransfers. Kreta sofort buchen und für das übrige Griechenland bestätigte Angebote anfragen.",
    quoteBody:
      "Flughafen-, Hafen- und Stadttransfers mit lizenzierten Partnern und einem klaren Angebot vor der Reise.",
    metaTitle: "Private Transfers in {country} | TransferAround",
    metaDescription:
      "Fordern Sie einen privaten Transfer in {country} mit lizenzierten Partnern und Bestätigung vor der Reise an.",
    intents: [
      "Privater Flughafentransfer in {country}",
      "Stadttransfer in {country}",
      "Lizenzierter Chauffeur in {country}",
      "Hafen- und Resorttransfer in {country}",
    ],
  },
  fr: {
    title: "Transferts privés en {country}",
    greeceBody:
      "Transferts agréés depuis les aéroports, ports et hôtels. Réservation instantanée en Crète et devis confirmé dans le reste de la Grèce.",
    quoteBody:
      "Transferts aéroport, port et ville avec des partenaires locaux agréés et un devis clair avant le voyage.",
    metaTitle: "Transferts privés en {country} | TransferAround",
    metaDescription:
      "Demandez un transfert privé en {country} avec des partenaires agréés et une confirmation avant le voyage.",
    intents: [
      "Transfert aéroport privé en {country}",
      "Transfert urbain en {country}",
      "Chauffeur agréé en {country}",
      "Transfert port et hôtel en {country}",
    ],
  },
  it: {
    title: "Transfer privati in {country}",
    greeceBody:
      "Transfer autorizzati da aeroporti, porti e località turistiche. Prenotazione immediata a Creta e preventivi confermati nel resto della Grecia.",
    quoteBody:
      "Transfer da aeroporti, porti e città con partner locali autorizzati e preventivo chiaro prima del viaggio.",
    metaTitle: "Transfer privati in {country} | TransferAround",
    metaDescription:
      "Richiedi un transfer privato in {country} con partner autorizzati e conferma prima del viaggio.",
    intents: [
      "Transfer aeroportuale privato in {country}",
      "Transfer urbano in {country}",
      "Autista autorizzato in {country}",
      "Transfer per porti e località turistiche in {country}",
    ],
  },
  nl: {
    title: "Privétransfers in {country}",
    greeceBody:
      "Erkende luchthaven-, haven- en resorttransfers. Boek Kreta direct en vraag bevestigde offertes aan voor de rest van Griekenland.",
    quoteBody:
      "Luchthaven-, haven- en stadstransfers met erkende lokale partners en een duidelijke offerte vooraf.",
    metaTitle: "Privétransfers in {country} | TransferAround",
    metaDescription:
      "Vraag een privétransfer in {country} aan met erkende partners en bevestiging vóór de reis.",
    intents: [
      "Privéluchthaventransfer in {country}",
      "Stadstransfer in {country}",
      "Erkende chauffeur in {country}",
      "Haven- en resorttransfer in {country}",
    ],
  },
  es: {
    title: "Traslados privados en {country}",
    greeceBody:
      "Traslados autorizados desde aeropuertos, puertos y complejos turísticos. Reserva inmediata en Creta y presupuestos confirmados en el resto de Grecia.",
    quoteBody:
      "Traslados de aeropuerto, puerto y ciudad con colaboradores locales autorizados y un presupuesto claro antes del viaje.",
    metaTitle: "Traslados privados en {country} | TransferAround",
    metaDescription:
      "Solicita un traslado privado en {country} con colaboradores autorizados y confirmación antes del viaje.",
    intents: [
      "Traslado privado de aeropuerto en {country}",
      "Traslado urbano en {country}",
      "Conductor autorizado en {country}",
      "Traslado de puerto y complejo turístico en {country}",
    ],
  },
};

function fill(template: string, country: string) {
  return template.replaceAll("{country}", country);
}

export function localizeMarket(market: Market, locale: Locale): Market {
  const country = getCountryName(locale, market.slug);
  const copy = templates[locale];
  return {
    ...market,
    name: country,
    heroTitle: fill(copy.title, country),
    heroBody: market.slug === "greece" ? copy.greeceBody : copy.quoteBody,
    metaTitle: fill(copy.metaTitle, country),
    metaDescription: fill(copy.metaDescription, country),
    searchIntents: copy.intents.map((intent) => fill(intent, country)),
  };
}
