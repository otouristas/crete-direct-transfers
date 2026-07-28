import { z } from "zod";
import { getAirport } from "@/data/airports";
import { getAirportRoute } from "@/data/airport-routes";
import { getDestination } from "@/data/destinations";
import { getMarket } from "@/data/markets";
import { getRoute } from "@/data/routes";

export type TouristasPageType =
  | "home"
  | "book"
  | "airport"
  | "city"
  | "country"
  | "routes"
  | "corridor"
  | "account"
  | "other";

export type TouristasMarketSlug = "greece" | "spain" | "italy" | "portugal" | "cyprus" | "turkey";

export type TouristasPageContext = {
  locale: string;
  path: string;
  pageType: TouristasPageType;
  entitySlug?: string;
  entityLabel?: string;
  secondarySlug?: string;
  secondaryLabel?: string;
  market?: TouristasMarketSlug;
};

export type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export type QuoteCard = {
  id: string;
  label: string;
  capacity: string;
  bags: string;
  totalEur: number;
};

export type TripSummary = {
  from: string;
  to: string;
  when?: string;
  pax?: number;
};

export const assistantResponseSchema = z.object({
  reply: z.string(),
  quotes: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        capacity: z.string(),
        bags: z.string(),
        totalEur: z.number(),
      }),
    )
    .optional(),
  bookPath: z.string().optional(),
  followUps: z.array(z.string()).optional(),
  tripSummary: z
    .object({
      from: z.string(),
      to: z.string(),
      when: z.string().optional(),
      pax: z.number().optional(),
    })
    .optional(),
  dispatch: z
    .object({
      bookingId: z.string(),
      status: z.enum(["searching", "claimed", "en_route", "expired", "failed", "cancelled"]),
      from: z.string(),
      to: z.string(),
      priceEur: z.number().optional(),
      etaMinutes: z.number().optional(),
      driverName: z.string().optional(),
      expiresAt: z.string().optional(),
    })
    .optional(),
});

export type AssistantResponse = z.infer<typeof assistantResponseSchema>;

/** Strip em dashes and en dashes from model/UI copy. */
export function stripEmDashes(text: string): string {
  return text
    .replace(/\u2014/g, "-")
    .replace(/\u2013/g, "-")
    .replace(/—/g, "-")
    .replace(/–/g, "-");
}

function stripLocalePrefix(pathname: string): string {
  return pathname.replace(/^\/(el|de|fr|it|nl|es)(?=\/|$)/, "") || "/";
}

export function derivePageType(pathname: string): TouristasPageType {
  const p = stripLocalePrefix(pathname);
  if (p === "/" || p === "") return "home";
  if (p.startsWith("/book")) return "book";
  // Airport corridor: /airports/:airport/:routeSlug
  if (/^\/airports\/[^/]+\/[^/]+/.test(p)) return "corridor";
  if (p.startsWith("/airports/")) return "airport";
  if (p.startsWith("/cities/")) return "city";
  if (/^\/(greece|spain|italy)\/?$/.test(p)) return "country";
  if (p.startsWith("/routes")) return "routes";
  if (p.startsWith("/account")) return "account";
  return "other";
}

function humanizeSlug(slug: string): string {
  return slug.replace(/-/g, " ");
}

function airportLabel(slug: string): string | undefined {
  const airport = getAirport(slug);
  if (!airport) return undefined;
  return `${airport.name} (${airport.iata})`;
}

function cityLabel(slug: string): string | undefined {
  return getDestination(slug)?.name;
}

/** Resolve entity slugs/labels (and corridor secondary / market) from the path. */
export function deriveEntityFromPath(pathname: string): {
  entitySlug?: string;
  entityLabel?: string;
  secondarySlug?: string;
  secondaryLabel?: string;
  market?: TouristasMarketSlug;
} {
  const p = stripLocalePrefix(pathname);

  const corridor = p.match(/^\/airports\/([^/]+)\/([^/]+)/);
  if (corridor) {
    const airportSlug = corridor[1];
    const routeSlug = corridor[2];
    const route = getAirportRoute(airportSlug, routeSlug);
    return {
      entitySlug: airportSlug,
      entityLabel: airportLabel(airportSlug) ?? route?.fromName ?? humanizeSlug(airportSlug),
      secondarySlug: route?.toSlug ?? routeSlug,
      secondaryLabel: route?.toName ?? humanizeSlug(routeSlug),
      market: "greece",
    };
  }

  const airport = p.match(/^\/airports\/([^/]+)/);
  if (airport) {
    return {
      entitySlug: airport[1],
      entityLabel: airportLabel(airport[1]),
      market: "greece",
    };
  }

  const city = p.match(/^\/cities\/([^/]+)/);
  if (city) {
    return {
      entitySlug: city[1],
      entityLabel: cityLabel(city[1]) ?? humanizeSlug(city[1]),
      market: "greece",
    };
  }

  const route = p.match(/^\/routes\/([^/]+)/);
  if (route) {
    const data = getRoute(route[1]);
    return {
      entitySlug: route[1],
      entityLabel: data ? `${data.from} to ${data.to}` : humanizeSlug(route[1]),
      secondaryLabel: data?.to,
      market: "greece",
    };
  }

  const country = p.match(/^\/(greece|spain|italy)\/?$/);
  if (country) {
    const slug = country[1] as TouristasMarketSlug;
    const market = getMarket(slug);
    return {
      entitySlug: slug,
      entityLabel: market?.name ?? slug[0].toUpperCase() + slug.slice(1),
      market: slug,
    };
  }

  return {};
}

/** Build full page context from pathname + locale. */
export function buildPageContext(pathname: string, locale: string): TouristasPageContext {
  const pageType = derivePageType(pathname);
  const derived = deriveEntityFromPath(pathname);
  return {
    locale,
    path: pathname,
    pageType,
    ...derived,
  };
}

/** Short human label for header / FAB (always defined for known page types). */
export function contextDisplayLabel(ctx: TouristasPageContext): string {
  if (ctx.pageType === "corridor" && ctx.entityLabel && ctx.secondaryLabel) {
    return `${ctx.entityLabel} → ${ctx.secondaryLabel}`;
  }
  if (ctx.entityLabel) return ctx.entityLabel;
  switch (ctx.pageType) {
    case "home":
      return "Home";
    case "book":
      return "Booking";
    case "routes":
      return "Routes";
    case "airport":
      return "Airport";
    case "city":
      return "City";
    case "country":
      return "Country";
    case "corridor":
      return "Corridor";
    default:
      return "TransferAround";
  }
}
