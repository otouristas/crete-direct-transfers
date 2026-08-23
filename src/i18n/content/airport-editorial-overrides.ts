import type { AirportData } from "@/data/airports";
import type { Locale } from "@/i18n";
import { getCountryName } from "@/i18n/markets";

const CHILD_SEAT_ANSWER: Record<Exclude<Locale, "en">, string> = {
  el: "Ναι. Ζητήστε το σωστό κάθισμα δηλώνοντας την ηλικία του επιβάτη κατά την κράτηση. Τυχόν χρέωση για το κάθισμα εμφανίζεται πριν από την επιβεβαίωση.",
  de: "Ja. Bestellen Sie den passenden Sitz bei der Buchung und geben Sie das Alter des Kindes an. Eine mögliche Sitzgebühr wird vor der Bestätigung angezeigt.",
  fr: "Oui. Demandez le siège adapté lors de la réservation en indiquant l’âge de l’enfant. Les éventuels frais de siège sont affichés avant la confirmation.",
  it: "Sì. Richiedi il seggiolino adatto durante la prenotazione e indica l’età del passeggero. L’eventuale supplemento viene mostrato prima della conferma.",
  nl: "Ja. Vraag bij het boeken het juiste zitje aan en vermeld de leeftijd van het kind. Eventuele kosten voor het zitje worden vóór de bevestiging getoond.",
  es: "Sí. Solicita la silla adecuada al reservar e indica la edad del menor. Cualquier coste aplicable se muestra antes de confirmar.",
};

function fallbackIntro(locale: Exclude<Locale, "en">, airport: AirportData): string {
  const country = getCountryName(locale, airport.countrySlug ?? airport.country.toLowerCase());
  const instant = airport.bookable === "instant";
  switch (locale) {
    case "el":
      return instant
        ? `Κλείστε ιδιωτική μεταφορά σταθερής τιμής από το ${airport.name} (${airport.iata}) προς ${airport.cityName}, ${country}. Η διαδρομή, το όχημα και το σύνολο εμφανίζονται πριν από την επιβεβαίωση.`
        : `Ζητήστε ιδιωτική μεταφορά από το ${airport.name} (${airport.iata}) προς ${airport.cityName}, ${country}. Η διαθεσιμότητα, το όχημα και το σύνολο επιβεβαιώνονται πριν από την πληρωμή.`;
    case "de":
      return instant
        ? `Buchen Sie einen Privattransfer zum Festpreis ab ${airport.name} (${airport.iata}) nach ${airport.cityName}, ${country}. Strecke, Fahrzeug und Gesamtpreis stehen vor der Bestätigung fest.`
        : `Fragen Sie einen Privattransfer ab ${airport.name} (${airport.iata}) nach ${airport.cityName}, ${country} an. Verfügbarkeit, Fahrzeug und Gesamtpreis werden vor der Zahlung bestätigt.`;
    case "fr":
      return instant
        ? `Réservez un transfert privé à prix fixe depuis ${airport.name} (${airport.iata}) vers ${airport.cityName}, ${country}. Le trajet, le véhicule et le total sont affichés avant confirmation.`
        : `Demandez un transfert privé depuis ${airport.name} (${airport.iata}) vers ${airport.cityName}, ${country}. La disponibilité, le véhicule et le total sont confirmés avant le paiement.`;
    case "it":
      return instant
        ? `Prenota un transfer privato a prezzo fisso da ${airport.name} (${airport.iata}) a ${airport.cityName}, ${country}. Tratta, veicolo e totale sono mostrati prima della conferma.`
        : `Richiedi un transfer privato da ${airport.name} (${airport.iata}) a ${airport.cityName}, ${country}. Disponibilità, veicolo e totale vengono confermati prima del pagamento.`;
    case "nl":
      return instant
        ? `Boek een privétransfer voor een vaste prijs vanaf ${airport.name} (${airport.iata}) naar ${airport.cityName}, ${country}. Route, voertuig en totaal worden vóór bevestiging getoond.`
        : `Vraag een privétransfer aan vanaf ${airport.name} (${airport.iata}) naar ${airport.cityName}, ${country}. Beschikbaarheid, voertuig en totaal worden vóór betaling bevestigd.`;
    case "es":
      return instant
        ? `Reserva un traslado privado a precio fijo desde ${airport.name} (${airport.iata}) hasta ${airport.cityName}, ${country}. La ruta, el vehículo y el total se muestran antes de confirmar.`
        : `Solicita un traslado privado desde ${airport.name} (${airport.iata}) hasta ${airport.cityName}, ${country}. La disponibilidad, el vehículo y el total se confirman antes del pago.`;
  }
}

/** Keeps localized airport policy copy aligned with the current booking flow. */
export function applyAirportEditorialOverrides(
  locale: Locale,
  source: AirportData,
  localized: AirportData,
): AirportData {
  if (locale === "en") return localized;
  const childSeatIndex = source.faqs.findIndex((faq) =>
    faq.q.startsWith("Are child car seats available"),
  );
  if (childSeatIndex < 0) return localized;

  return {
    ...localized,
    intro: localized.intro === source.intro ? fallbackIntro(locale, source) : localized.intro,
    faqs: localized.faqs.map((faq, index) =>
      index === childSeatIndex ? { ...faq, a: CHILD_SEAT_ANSWER[locale] } : faq,
    ),
  };
}
