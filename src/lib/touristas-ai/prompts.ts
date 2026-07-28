import type { TouristasPageContext, TouristasPageType } from "./types";

const GLOBAL_RULES = `You are Touristas AI, the booking assistant for TransferAround (private fixed-price transfers).
Rules:
- Never invent EUR prices. Only use tool results for prices.
- Prefer calling resolve_trip then quote_vehicles then build_book_url for scheduled booking requests.
- If the user needs a transfer NOW / ASAP / immediately on Crete, call request_asap_transfer (needs name, email, phone). Do not invent a driver. Tell them you are searching live. Include dispatch in the JSON when ASAP is created.
- Never invent a driver name or ETA. Only use get_dispatch_status or request_asap_transfer results.
- Never use em dashes or en dashes in replies. Use commas, periods, or a hyphen if needed.
- Be concise. Reply in the user's language when clear.
- Instant book on Crete corridors. Quote mode elsewhere.
- For driver no-show or refund disputes, explain policy and tell the user to open Report a problem on their booking page. Never promise an automatic refund.
- After quoting, suggest short follow-up chips.
- When page context provides a pickup or corridor, prefer those places unless the user clearly names different ones.
- Final answer MUST be a single JSON object only (no markdown fences) with keys: reply, quotes?, bookPath?, followUps?, tripSummary?, dispatch?.`;

export function pagePromptExtras(ctx: TouristasPageContext): string {
  const parts = [
    `Locale: ${ctx.locale}.`,
    `Current path: ${ctx.path}.`,
    `Page type: ${ctx.pageType}.`,
  ];
  if (ctx.market) {
    parts.push(`Market: ${ctx.market}.`);
  }
  if (ctx.entityLabel || ctx.entitySlug) {
    const role =
      ctx.pageType === "city"
        ? "Prefer this as drop-off (or pickup if the user is departing from the city)"
        : "Prefer this as pickup unless the user says otherwise";
    parts.push(`Page entity: ${ctx.entityLabel ?? ctx.entitySlug}. ${role}.`);
  }
  if (ctx.secondaryLabel || ctx.secondarySlug) {
    parts.push(
      `Page destination: ${ctx.secondaryLabel ?? ctx.secondarySlug}. Prefer this as drop-off on corridor/route pages.`,
    );
  }
  return parts.join(" ");
}

export function buildSystemPrompt(ctx: TouristasPageContext): string {
  return `${GLOBAL_RULES}\n\n${pagePromptExtras(ctx)}`;
}

const CHIP_COPY = {
  en: {
    quote: "Get a transfer quote",
    now: "I need a transfer now",
    waiting: "What is the free waiting time?",
    cancellation: "Cancellation policy",
    returnTrip: "Add a return trip",
    hourly: "Hourly chauffeur for 4 hours",
  },
  el: {
    quote: "Λάβετε προσφορά μεταφοράς",
    now: "Χρειάζομαι μεταφορά τώρα",
    waiting: "Πόσος είναι ο δωρεάν χρόνος αναμονής;",
    cancellation: "Πολιτική ακύρωσης",
    returnTrip: "Προσθήκη επιστροφής",
    hourly: "Οδηγός ανά ώρα για 4 ώρες",
  },
  de: {
    quote: "Transferangebot erhalten",
    now: "Ich brauche jetzt einen Transfer",
    waiting: "Wie lang ist die kostenlose Wartezeit?",
    cancellation: "Stornierungsbedingungen",
    returnTrip: "Rückfahrt hinzufügen",
    hourly: "Chauffeur für 4 Stunden",
  },
  fr: {
    quote: "Obtenir un devis de transfert",
    now: "J’ai besoin d’un transfert maintenant",
    waiting: "Quelle est la durée d’attente gratuite ?",
    cancellation: "Politique d’annulation",
    returnTrip: "Ajouter un retour",
    hourly: "Chauffeur à l’heure pendant 4 heures",
  },
  it: {
    quote: "Richiedi un preventivo",
    now: "Mi serve un transfer adesso",
    waiting: "Quanto dura l’attesa gratuita?",
    cancellation: "Politica di cancellazione",
    returnTrip: "Aggiungi il ritorno",
    hourly: "Autista a ore per 4 ore",
  },
  nl: {
    quote: "Vraag een transferofferte aan",
    now: "Ik heb nu een transfer nodig",
    waiting: "Hoe lang is de gratis wachttijd?",
    cancellation: "Annuleringsbeleid",
    returnTrip: "Terugrit toevoegen",
    hourly: "Chauffeur voor 4 uur",
  },
  es: {
    quote: "Solicitar presupuesto de traslado",
    now: "Necesito un traslado ahora",
    waiting: "¿Cuánto dura la espera gratuita?",
    cancellation: "Política de cancelación",
    returnTrip: "Añadir un trayecto de vuelta",
    hourly: "Chófer por horas durante 4 horas",
  },
} as const;

export function starterChips(
  pageType: TouristasPageType,
  entityLabel?: string,
  ctx?: TouristasPageContext,
): string[] {
  const copy = CHIP_COPY[(ctx?.locale as keyof typeof CHIP_COPY) ?? "en"] ?? CHIP_COPY.en;
  const place = entityLabel ?? ctx?.entityLabel;
  const dest = ctx?.secondaryLabel;
  const corridor = [place, dest].filter(Boolean).join(" → ");

  switch (pageType) {
    case "airport":
      return [`${copy.quote}: ${place ?? "HER"} → Elounda`, copy.now, copy.waiting];
    case "corridor":
      return [corridor ? `${copy.quote}: ${corridor}` : copy.quote, copy.now, copy.waiting];
    case "city":
      return [place ? `${copy.quote}: ${place}` : copy.quote, copy.now, copy.cancellation];
    case "book":
      return [copy.quote, copy.returnTrip, copy.waiting];
    case "country":
      return [place ? `${copy.quote}: ${place}` : copy.quote, copy.now, copy.waiting];
    case "routes":
      return [place ? `${copy.quote}: ${place}` : copy.quote, copy.now, copy.waiting];
    case "home":
    default:
      return [`${copy.quote}: HER → Elounda`, copy.now, copy.hourly];
  }
}
