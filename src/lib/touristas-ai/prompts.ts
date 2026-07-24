import { getMarket } from "@/data/markets";
import { MARKET_HUB_AIRPORTS } from "@/data/market-hubs";
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

function countryChips(ctx: TouristasPageContext): string[] {
  const market = ctx.market ?? (ctx.entitySlug as "greece" | "spain" | "italy" | undefined);
  if (market === "spain") {
    const hubs = MARKET_HUB_AIRPORTS.filter((a) => a.countrySlug === "spain");
    const a = hubs[0];
    const b = hubs[1];
    return [
      a ? `${a.iata} to ${a.cityName} tomorrow 3pm` : "MAD to Madrid tomorrow 3pm",
      b ? `${b.iata} to hotel` : "BCN airport to hotel",
      "How does quoting work?",
    ];
  }
  if (market === "italy") {
    const hubs = MARKET_HUB_AIRPORTS.filter((a) => a.countrySlug === "italy");
    const a = hubs[0];
    const b = hubs[1];
    return [
      a ? `${a.iata} to ${a.cityName} tomorrow 3pm` : "FCO to Rome tomorrow 3pm",
      b ? `${b.iata} to hotel` : "MXP airport to hotel",
      "How does quoting work?",
    ];
  }
  const name = getMarket("greece")?.name ?? "Greece";
  return [
    "HER to Chania Old Town tomorrow 3pm",
    "Athens airport to hotel",
    `How do transfers work in ${name}?`,
  ];
}

export function starterChips(
  pageType: TouristasPageType,
  entityLabel?: string,
  ctx?: TouristasPageContext,
): string[] {
  const place = entityLabel ?? ctx?.entityLabel ?? "this place";
  const dest = ctx?.secondaryLabel;

  switch (pageType) {
    case "airport":
      return [
        `Transfer from ${place} to Elounda`,
        `I need a transfer NOW from ${place}`,
        "What is the free waiting time?",
      ];
    case "corridor":
      return [
        dest ? `Book ${place} to ${dest} tomorrow` : "Book this corridor tomorrow",
        dest ? `I need ${place} to ${dest} NOW` : "I need this transfer NOW",
        "What is the free waiting time?",
      ];
    case "city":
      return [
        `Airport transfer to ${place}`,
        `Transfer NOW to ${place}`,
        "Cancellation policy",
      ];
    case "book":
      return ["Cheaper vehicle options", "Add a return trip", "Free waiting rules"];
    case "country":
      return countryChips(ctx ?? { locale: "en", path: "/", pageType: "country", entityLabel: place });
    case "routes":
      return [
        place && place !== "this place" ? `Book ${place} tomorrow` : "Book this corridor tomorrow",
        "I need this transfer NOW",
        "Waiting time at airports",
      ];
    case "home":
    default:
      return [
        "HER to Elounda tomorrow 3pm",
        "I need a transfer NOW from HER to Domotel Rethymno",
        "Hourly chauffeur 4 hours",
      ];
  }
}
