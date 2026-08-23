import type { Post } from "@/data/posts";
import type { Locale } from "@/i18n";

const CHILD_SEAT_COPY: Record<
  Exclude<Locale, "en">,
  { description: string; law: string; sourceLabel: string }
> = {
  el: {
    description:
      "Οι ισχύουσες οδηγίες για τα παιδικά καθίσματα στην Ελλάδα, πώς ζητάτε το σωστό κάθισμα και πώς οργανώνετε οικογενειακή μεταφορά στην Κρήτη.",
    law: "Το προφίλ οδικής ασφάλειας της Ευρωπαϊκής Επιτροπής για το 2024 καταγράφει υποχρέωση χρήσης παιδικού συστήματος συγκράτησης στην Ελλάδα έως τα 150 εκ. Το κατάλληλο κάθισμα εξαρτάται από το μέγεθος του παιδιού και το όχημα. Επιβεβαιώστε τον ισχύοντα κανόνα και ζητήστε τον ακριβή τύπο καθίσματος πριν από τη διαδρομή· μην θεωρείτε δεδομένο ότι ένα όχημα από την πιάτσα του αεροδρομίου διαθέτει κάθισμα.",
    sourceLabel: "Ευρωπαϊκή Επιτροπή — Προφίλ οδικής ασφάλειας: Ελλάδα (2024)",
  },
  de: {
    description:
      "Aktuelle Hinweise zu Kinderrückhaltesystemen in Griechenland, die richtige Sitzanfrage und die Planung eines Familientransfers auf Kreta.",
    law: "Das Straßenverkehrssicherheitsprofil der Europäischen Kommission von 2024 weist für Griechenland Kinderrückhaltesysteme bis zu einer Körpergröße von 150 cm aus. Welcher Sitz geeignet ist, hängt von Größe und Gewicht des Kindes sowie vom Fahrzeug ab. Prüfen Sie die aktuelle Regel und bestellen Sie den genauen Sitztyp vor der Fahrt; verlassen Sie sich nicht darauf, dass ein Fahrzeug am Flughafenstand einen passenden Sitz mitführt.",
    sourceLabel: "Europäische Kommission — Straßenverkehrssicherheitsprofil Griechenland (2024)",
  },
  fr: {
    description:
      "Règles actuelles sur les dispositifs de retenue pour enfants en Grèce, choix du siège adapté et organisation d’un transfert familial en Crète.",
    law: "Le profil 2024 de la Commission européenne sur la sécurité routière indique qu’en Grèce un dispositif de retenue pour enfant est requis jusqu’à 150 cm. Le siège adapté dépend de la taille de l’enfant et du véhicule. Vérifiez la règle en vigueur et demandez le type de siège précis avant le trajet ; ne supposez pas qu’un véhicule pris à la station de l’aéroport en possède un.",
    sourceLabel: "Commission européenne — Profil de sécurité routière de la Grèce (2024)",
  },
  it: {
    description:
      "Indicazioni aggiornate sui sistemi di ritenuta per bambini in Grecia, richiesta del seggiolino corretto e organizzazione dei transfer familiari a Creta.",
    law: "Il profilo 2024 della Commissione europea sulla sicurezza stradale indica per la Grecia l’obbligo di un sistema di ritenuta per bambini fino a 150 cm. Il seggiolino adatto dipende dalle dimensioni del bambino e dal veicolo. Verifica la regola in vigore e richiedi il tipo esatto di seggiolino prima del viaggio; non dare per scontato che un veicolo della stazione taxi aeroportuale ne abbia uno.",
    sourceLabel: "Commissione europea — Profilo della sicurezza stradale della Grecia (2024)",
  },
  nl: {
    description:
      "Actuele Griekse richtlijnen voor kinderzitjes, het juiste zitje aanvragen en een gezinsrit op Kreta goed voorbereiden.",
    law: "Het verkeersveiligheidsprofiel van de Europese Commissie uit 2024 vermeldt voor Griekenland een kinderbeveiligingssysteem tot een lengte van 150 cm. Welk zitje geschikt is, hangt af van de grootte van het kind en het voertuig. Controleer de actuele regel en vraag vóór de rit om het exacte type zitje; ga er niet van uit dat een voertuig bij de luchthavenstandplaats er een bij zich heeft.",
    sourceLabel: "Europese Commissie — Verkeersveiligheidsprofiel Griekenland (2024)",
  },
  es: {
    description:
      "Normativa actual sobre sistemas de retención infantil en Grecia, cómo pedir la silla adecuada y cómo organizar traslados familiares en Creta.",
    law: "El perfil de seguridad vial de la Comisión Europea de 2024 recoge en Grecia el uso de sistemas de retención infantil hasta los 150 cm. La silla adecuada depende del tamaño del menor y del vehículo. Comprueba la norma vigente y solicita el tipo exacto de silla antes del trayecto; no des por hecho que un vehículo de la parada del aeropuerto dispone de una.",
    sourceLabel: "Comisión Europea — Perfil de seguridad vial de Grecia (2024)",
  },
};

export function applyEditorialOverrides(locale: Locale, post: Post): Post {
  if (locale === "en" || post.slug !== "crete-with-kids-child-seats") return post;
  const copy = CHILD_SEAT_COPY[locale];
  return {
    ...post,
    description: copy.description,
    sections: post.sections.map((section) =>
      section.id === "the-law" ? { ...section, body: [copy.law] } : section,
    ),
    sources: post.sources?.map((source) => ({ ...source, label: copy.sourceLabel })),
  };
}
