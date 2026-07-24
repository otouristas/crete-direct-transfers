import { getIataAirport } from "@/data/iata-airports";
import { VEHICLE_CLASSES, type VehicleClass, getRoute } from "@/data/routes";
import { getAirport } from "@/data/airports";
import { getDestination, listCityDestinations } from "@/data/destinations";
import { computeQuotePrice } from "@/lib/quote-engine";
import { explainPolicy } from "@/lib/booking-policy";
import {
  matchRouteSlug,
  searchLocalPlaces,
  type PlaceResult,
} from "@/lib/place-search";
import type {
  AssistantResponse,
  QuoteCard,
  TouristasPageContext,
  TripSummary,
} from "./types";
import { stripEmDashes } from "./types";

const PLACE_ALIASES: Record<string, string> = {
  her: "HER",
  "her airport": "HER",
  "heraklion airport": "HER",
  "heraklion international": "HER",
  chq: "CHQ",
  "chania airport": "CHQ",
  "souda port": "Chania Port",
  "chania port": "Chania Port",
  "domotel rethymno": "Rethymno",
  "domotel rethimno": "Rethymno",
  "hotel domotel": "Rethymno",
  "domotel": "Rethymno",
};

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(x)) * 1.35 * 10) / 10;
}

function resolvePlaceQuery(raw: string): PlaceResult | null {
  const q = raw.trim();
  if (!q) return null;

  const aliasKey = q.toLowerCase().replace(/\s+/g, " ").trim();
  const aliased = PLACE_ALIASES[aliasKey];
  const lookup = aliased ?? q;

  const iata = lookup.toUpperCase().match(/^[A-Z]{3}$/)?.[0];
  if (iata) {
    const a = getIataAirport(iata);
    if (a) {
      return {
        id: `airport:${a.iata}`,
        label: a.label,
        kind: "airport",
        lat: a.lat,
        lng: a.lng,
        iata: a.iata,
        countryCode: a.countryCode,
        countryName: a.countryName,
      };
    }
  }

  const hits = searchLocalPlaces(lookup, 5);
  if (!hits.length) return null;
  if (aliased) {
    const dest = hits.find((h) => h.kind === "destination" || h.kind === "city");
    if (dest) return dest;
  }
  return hits[0];
}

/** Split natural language trip text into from/to and optional when/pax. */
export function resolveTrip(text: string): {
  from: PlaceResult | null;
  to: PlaceResult | null;
  when?: string;
  pax?: number;
  date?: string;
  time?: string;
  rawFrom?: string;
  rawTo?: string;
  asap?: boolean;
} {
  let working = text.trim();
  const asap = detectAsapFromText(working);
  if (asap) {
    working = working
      .replace(/\b(right now|as soon as possible|asap|immediately|urgent|now|jetzt|τώρα|transfert maintenant)\b/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  let pax: number | undefined;
  const paxMatch = working.match(/\b(\d+)\s*(?:pax|passengers?|people|persons?)\b/i);
  if (paxMatch) {
    pax = Number(paxMatch[1]);
    working = working.replace(paxMatch[0], " ").trim();
  }

  let when: string | undefined;
  let date: string | undefined;
  let time: string | undefined;

  const timeMatch = working.match(
    /\b(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/i,
  );
  if (timeMatch) {
    let h = Number(timeMatch[1]);
    const m = timeMatch[2] ? Number(timeMatch[2]) : 0;
    const ap = timeMatch[3]?.toLowerCase();
    if (ap === "pm" && h < 12) h += 12;
    if (ap === "am" && h === 12) h = 0;
    time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    when = (when ? `${when} ` : "") + time;
    working = working.replace(timeMatch[0], " ").trim();
  }

  const tomorrow = /\btomorrow\b/i.test(working);
  const today = /\btoday\b/i.test(working);
  if (tomorrow || today) {
    const d = new Date();
    if (tomorrow) d.setDate(d.getDate() + 1);
    date = d.toISOString().slice(0, 10);
    when = `${date}${time ? ` ${time}` : ""}`;
    working = working.replace(/\b(tomorrow|today)\b/gi, " ").trim();
  }

  working = working
    .replace(/\b(i\s+need|i\s+want|i'?d\s+like|please|book|a\s+transfer|transfer|private\s+transfer)\b/gi, " ")
    .replace(/\bfrom\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  const split = working.split(/\s+(?:to|→|->)\s+/i);
  let rawFrom = "";
  let rawTo = "";
  if (split.length >= 2) {
    rawFrom = split[0].trim();
    rawTo = split.slice(1).join(" to ").trim();
  } else {
    // Leading "to Elounda" (destination-only) when pickup comes from page context
    const toOnly = working.match(/^\s*to\s+(.+)$/i);
    if (toOnly) {
      rawTo = toOnly[1].trim();
    } else {
      // "A - B" light split
      const dash = working.split(/\s+-\s+/);
      if (dash.length >= 2) {
        rawFrom = dash[0].trim();
        rawTo = dash.slice(1).join(" - ").trim();
      }
    }
  }

  const from = rawFrom ? resolvePlaceQuery(rawFrom) : null;
  const to = rawTo ? resolvePlaceQuery(rawTo) : null;

  return { from, to, when, pax, date, time, rawFrom, rawTo, asap };
}

function detectAsapFromText(text: string): boolean {
  return /\b(now|asap|immediately|right now|urgent|as soon as possible|transfert maintenant|jetzt|τώρα)\b/i.test(
    text,
  );
}

/** Soft defaults from the current pillar page (airport pickup, corridor ends, etc.). */
export function placesFromPageContext(ctx?: TouristasPageContext): {
  from: PlaceResult | null;
  to: PlaceResult | null;
} {
  if (!ctx) return { from: null, to: null };

  if (ctx.pageType === "airport" && ctx.entitySlug) {
    const airport = getAirport(ctx.entitySlug);
    const from = airport
      ? resolvePlaceQuery(airport.iata)
      : resolvePlaceQuery(ctx.entityLabel ?? "");
    return { from, to: null };
  }

  if (ctx.pageType === "corridor" && ctx.entitySlug) {
    const airport = getAirport(ctx.entitySlug);
    const from = airport
      ? resolvePlaceQuery(airport.iata)
      : resolvePlaceQuery(ctx.entityLabel ?? "");
    const to = resolvePlaceQuery(ctx.secondaryLabel ?? ctx.secondarySlug ?? "");
    return { from, to };
  }

  if (ctx.pageType === "city") {
    const to = resolvePlaceQuery(ctx.entityLabel ?? ctx.entitySlug ?? "");
    return { from: null, to };
  }

  if (ctx.pageType === "routes" && ctx.entitySlug) {
    const route = getRoute(ctx.entitySlug);
    if (route) {
      return {
        from: resolvePlaceQuery(route.from),
        to: resolvePlaceQuery(route.to),
      };
    }
  }

  return { from: null, to: null };
}

export function seedTripFromPageContext(
  trip: ReturnType<typeof resolveTrip>,
  ctx?: TouristasPageContext,
): ReturnType<typeof resolveTrip> {
  const defaults = placesFromPageContext(ctx);
  let from = trip.from ?? null;
  let to = trip.to ?? null;

  if (!from && defaults.from) from = defaults.from;
  if (!to && defaults.to) to = defaults.to;

  // Corridor / route pages: fill both ends when the user did not name places
  if (
    defaults.from &&
    defaults.to &&
    !trip.rawFrom &&
    !trip.rawTo &&
    (ctx?.pageType === "corridor" || ctx?.pageType === "routes")
  ) {
    from = defaults.from;
    to = defaults.to;
  }

  return { ...trip, from, to };
}

export function resolveTripWithContext(text: string, ctx?: TouristasPageContext) {
  return seedTripFromPageContext(resolveTrip(text), ctx);
}

export function toolSearchPlaces(query: string, limit = 8) {
  const iata = query.trim().toUpperCase();
  if (/^[A-Z]{3}$/.test(iata)) {
    const a = getIataAirport(iata);
    if (a) {
      return [
        {
          id: `airport:${a.iata}`,
          label: a.label,
          kind: "airport" as const,
          lat: a.lat,
          lng: a.lng,
          iata: a.iata,
        },
      ];
    }
  }
  return searchLocalPlaces(query, limit).map((p) => ({
    id: p.id,
    label: p.label,
    kind: p.kind,
    lat: p.lat,
    lng: p.lng,
    iata: p.iata,
  }));
}

export function toolQuoteVehicles(input: {
  from: PlaceResult;
  to: PlaceResult;
  pickupAt?: string | null;
  pax?: number;
}): { quotes: QuoteCard[]; routeSlug: string; distanceKm?: number } {
  const routeSlug =
    matchRouteSlug(input.from, input.to) ??
    `distance-${Math.round(
      input.from.lat != null &&
        input.to.lat != null &&
        input.from.lng != null &&
        input.to.lng != null
        ? haversineKm(
            { lat: input.from.lat, lng: input.from.lng },
            { lat: input.to.lat, lng: input.to.lng },
          )
        : 40,
    )}km`;

  const distanceKm =
    input.from.lat != null &&
    input.to.lat != null &&
    input.from.lng != null &&
    input.to.lng != null
      ? haversineKm(
          { lat: input.from.lat, lng: input.from.lng },
          { lat: input.to.lat, lng: input.to.lng },
        )
      : undefined;

  const quotes: QuoteCard[] = [];
  for (const vc of VEHICLE_CLASSES) {
    const computed = computeQuotePrice({
      routeSlug,
      vehicleClass: vc.id as VehicleClass,
      pickupAt: input.pickupAt,
      distanceKm: distanceKm ?? null,
      tripType: "oneway",
    });
    if (!computed) continue;
    quotes.push({
      id: vc.id,
      label: vc.label,
      capacity: vc.capacity,
      bags: vc.bags,
      totalEur: computed.priceCents / 100,
    });
  }

  return { quotes, routeSlug, distanceKm };
}

export function toolBuildBookUrl(input: {
  locale?: string;
  fromLabel: string;
  toLabel: string;
  fromLat?: number;
  fromLng?: number;
  toLat?: number;
  toLng?: number;
  routeSlug?: string;
  vehicleClass?: string;
  pax?: number;
  date?: string;
  time?: string;
}): string {
  const prefix = input.locale && input.locale !== "en" ? `/${input.locale}` : "";
  const params = new URLSearchParams();
  if (input.routeSlug && !input.routeSlug.startsWith("distance-")) {
    params.set("route", input.routeSlug);
  }
  params.set("from", input.fromLabel);
  params.set("to", input.toLabel);
  if (input.fromLat != null) params.set("pickupLat", String(input.fromLat));
  if (input.fromLng != null) params.set("pickupLng", String(input.fromLng));
  if (input.toLat != null) params.set("dropoffLat", String(input.toLat));
  if (input.toLng != null) params.set("dropoffLng", String(input.toLng));
  params.set("pickupAddress", input.fromLabel);
  params.set("dropoffAddress", input.toLabel);
  if (input.vehicleClass) params.set("class", input.vehicleClass);
  if (input.pax) params.set("pax", String(input.pax));
  if (input.date) {
    const iso =
      input.time != null
        ? `${input.date}T${input.time}:00`
        : `${input.date}T12:00:00`;
    params.set("date", iso);
  }
  return `${prefix}/book?${params.toString()}`;
}

export function toolExplainPolicy() {
  const p = explainPolicy();
  return {
    ...p,
    summary: stripEmDashes(p.summary),
  };
}

export function enrichEntityLabel(slug?: string): string | undefined {
  if (!slug) return undefined;
  if (slug === "greece" || slug === "spain" || slug === "italy") {
    return slug[0].toUpperCase() + slug.slice(1);
  }
  const airport = getAirport(slug);
  if (airport) return `${airport.name} (${airport.iata})`;
  const dest = getDestination(slug);
  if (dest) return dest.name;
  const city = listCityDestinations().find((c) => c.slug === slug);
  if (city) return city.name;
  return slug.replace(/-/g, " ");
}

/** Offline / no-key path: resolve + quote when possible. */
export async function offlineAssist(
  userText: string,
  locale?: string,
  pageContext?: TouristasPageContext,
): Promise<{
  reply: string;
  quotes?: QuoteCard[];
  bookPath?: string;
  followUps?: string[];
  tripSummary?: TripSummary;
  dispatch?: AssistantResponse["dispatch"];
  configured: boolean;
}> {
  const trip = resolveTripWithContext(userText, pageContext);

  if (trip.asap && trip.from && trip.to && trip.from.lat != null && trip.to.lat != null) {
    const { canRequestAsap, createAsapBooking } = await import("@/lib/asap-dispatch");
    if (!canRequestAsap(trip.from, trip.to)) {
      return {
        configured: false,
        reply: stripEmDashes(
          "Live NOW dispatch is available on Crete corridors only. I can still quote a scheduled transfer.",
        ),
        followUps: ["HER to Elounda tomorrow 3pm", "What is free waiting?"],
      };
    }

    const email = userText.match(/[\w.+-]+@[\w.-]+\.\w{2,}/)?.[0];
    const phone = userText.match(/(\+?\d[\d\s()-]{7,}\d)/)?.[0]?.replace(/\s+/g, "");
    const nameMatch = userText.match(/\b(?:name|i am|i'm)\s*[:\s]+([A-Za-z][A-Za-z\s'-]{1,40})/i);
    if (!email || !phone) {
      return {
        configured: false,
        reply: stripEmDashes(
          `Got it: ${trip.from.label} to ${trip.to.label} ASAP. Reply with your full name, email, and mobile so I can request a live driver now.`,
        ),
        followUps: ["Name Jane Doe, email jane@example.com, phone +306900000000"],
        tripSummary: {
          from: trip.from.label,
          to: trip.to.label,
          when: "ASAP",
          pax: trip.pax,
        },
      };
    }

    try {
      const created = await createAsapBooking({
        from: trip.from,
        to: trip.to,
        customerName: nameMatch?.[1]?.trim() || "ASAP guest",
        customerEmail: email,
        customerPhone: phone,
        pax: trip.pax ?? 2,
      });
      return {
        configured: false,
        reply: stripEmDashes(
          `Request sent live to available drivers: ${trip.from.label} to ${trip.to.label} (${created.priceCents / 100} EUR). Searching now. I will update when a driver accepts.`,
        ),
        dispatch: {
          bookingId: created.bookingId,
          status: "searching",
          from: trip.from.label,
          to: trip.to.label,
          priceEur: created.priceCents / 100,
          etaMinutes: created.etaHintMinutes,
          expiresAt: created.expiresAt,
        },
        tripSummary: {
          from: trip.from.label,
          to: trip.to.label,
          when: "ASAP",
          pax: trip.pax ?? 2,
        },
        followUps: ["Any update?", "Cancel and book scheduled instead"],
      };
    } catch (e) {
      return {
        configured: false,
        reply: stripEmDashes(
          `Could not start live dispatch (${e instanceof Error ? e.message : "error"}). Apply the ASAP migration, or book a scheduled transfer.`,
        ),
        followUps: ["HER to Elounda tomorrow 3pm"],
      };
    }
  }

  if (trip.from && trip.to && trip.from.lat != null && trip.to.lat != null) {
    const pickupAt =
      trip.date != null
        ? `${trip.date}T${trip.time ?? "12:00"}:00`
        : undefined;
    const { quotes, routeSlug } = toolQuoteVehicles({
      from: trip.from,
      to: trip.to,
      pickupAt,
      pax: trip.pax,
    });
    const bookPath = toolBuildBookUrl({
      locale,
      fromLabel: trip.from.label,
      toLabel: trip.to.label,
      fromLat: trip.from.lat,
      fromLng: trip.from.lng,
      toLat: trip.to.lat,
      toLng: trip.to.lng,
      routeSlug,
      vehicleClass: quotes[0]?.id,
      pax: trip.pax ?? 2,
      date: trip.date,
      time: trip.time,
    });
    return {
      configured: false,
      reply: stripEmDashes(
        `Got it: ${trip.from.label} to ${trip.to.label}${trip.when ? ` (${trip.when})` : ""}. Here are fixed-price vehicle options. Confirm on the booking form.`,
      ),
      quotes,
      bookPath,
      followUps: ["Switch to a minivan", "Add a return trip", "What is free waiting?"],
      tripSummary: {
        from: trip.from.label,
        to: trip.to.label,
        when: trip.when,
        pax: trip.pax,
      },
    };
  }

  if (/cancel|refund|no.?show|wait/i.test(userText)) {
    return {
      configured: false,
      reply: stripEmDashes(toolExplainPolicy().summary),
      followUps: ["HER to Elounda tomorrow", "Book a minivan"],
    };
  }

  const hint =
    pageContext?.entityLabel != null
      ? ` You are on ${pageContext.entityLabel}${pageContext.secondaryLabel ? ` to ${pageContext.secondaryLabel}` : ""}.`
      : "";

  return {
    configured: false,
    reply: stripEmDashes(
      `Tell me pickup and drop-off like HER to Elounda tomorrow at 3pm, or say NOW for live dispatch on Crete.${hint}`,
    ),
    followUps: pageContext
      ? starterFollowUps(pageContext)
      : ["HER to Elounda tomorrow 3pm", "I need a transfer NOW from HER to Domotel Rethymno"],
  };
}

function starterFollowUps(ctx: TouristasPageContext): string[] {
  if (ctx.pageType === "corridor" && ctx.entityLabel && ctx.secondaryLabel) {
    return [
      `Book ${ctx.entityLabel} to ${ctx.secondaryLabel} tomorrow`,
      "Minivan for 6",
      "What is free waiting?",
    ];
  }
  if (ctx.pageType === "airport" && ctx.entityLabel) {
    return [`Transfer from ${ctx.entityLabel} to Elounda`, "What is free waiting?"];
  }
  return ["HER to Elounda tomorrow 3pm", "Heraklion airport to Chania port"];
}

export const OPENAI_TOOLS = [
  {
    type: "function" as const,
    function: {
      name: "resolve_trip",
      description: "Parse a natural language transfer request into from/to places, date, time, pax.",
      parameters: {
        type: "object",
        properties: { text: { type: "string" } },
        required: ["text"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "search_places",
      description: "Search airports, ports, and destinations. Supports IATA codes like HER.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string" },
          limit: { type: "number" },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "quote_vehicles",
      description: "Get fixed-price quotes for a from/to place pair.",
      parameters: {
        type: "object",
        properties: {
          fromQuery: { type: "string" },
          toQuery: { type: "string" },
          date: { type: "string" },
          time: { type: "string" },
          pax: { type: "number" },
        },
        required: ["fromQuery", "toQuery"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "build_book_url",
      description: "Build a /book deep link for the resolved trip.",
      parameters: {
        type: "object",
        properties: {
          fromQuery: { type: "string" },
          toQuery: { type: "string" },
          date: { type: "string" },
          time: { type: "string" },
          pax: { type: "number" },
          vehicleClass: { type: "string" },
          locale: { type: "string" },
        },
        required: ["fromQuery", "toQuery"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "request_asap_transfer",
      description:
        "Request a live NOW/ASAP transfer on Crete. Broadcasts to available drivers. Requires passenger contact details.",
      parameters: {
        type: "object",
        properties: {
          fromQuery: { type: "string" },
          toQuery: { type: "string" },
          customerName: { type: "string" },
          customerEmail: { type: "string" },
          customerPhone: { type: "string" },
          pax: { type: "number" },
          vehicleClass: { type: "string" },
          notes: { type: "string" },
        },
        required: ["fromQuery", "toQuery", "customerName", "customerEmail", "customerPhone"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_dispatch_status",
      description: "Check ASAP booking status: searching, claimed (with ETA), expired, cancelled.",
      parameters: {
        type: "object",
        properties: { bookingId: { type: "string" } },
        required: ["bookingId"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "explain_policy",
      description: "Return cancellation, waiting, and refund policy facts.",
      parameters: { type: "object", properties: {} },
    },
  },
];

export async function executeTool(
  name: string,
  argsJson: string,
  locale?: string,
  pageContext?: TouristasPageContext,
): Promise<unknown> {
  let args: Record<string, unknown> = {};
  try {
    args = JSON.parse(argsJson || "{}") as Record<string, unknown>;
  } catch {
    args = {};
  }

  if (name === "resolve_trip") {
    const trip = resolveTripWithContext(String(args.text ?? ""), pageContext);
    return {
      from: trip.from
        ? { id: trip.from.id, label: trip.from.label, lat: trip.from.lat, lng: trip.from.lng, iata: trip.from.iata }
        : null,
      to: trip.to
        ? { id: trip.to.id, label: trip.to.label, lat: trip.to.lat, lng: trip.to.lng, iata: trip.to.iata }
        : null,
      when: trip.when,
      date: trip.date,
      time: trip.time,
      pax: trip.pax,
      rawFrom: trip.rawFrom,
      rawTo: trip.rawTo,
      asap: trip.asap === true,
      pageDefaults: placesFromPageContext(pageContext),
    };
  }

  if (name === "search_places") {
    return toolSearchPlaces(String(args.query ?? ""), Number(args.limit ?? 8));
  }

  if (name === "request_asap_transfer") {
    const { canRequestAsap, createAsapBooking } = await import("@/lib/asap-dispatch");
    let from = resolvePlaceQuery(String(args.fromQuery ?? ""));
    let to = resolvePlaceQuery(String(args.toQuery ?? ""));
    const defaults = placesFromPageContext(pageContext);
    if (!from && defaults.from) from = defaults.from;
    if (!to && defaults.to) to = defaults.to;
    if (!from || !to) return { error: "places_not_found", from, to };
    if (!canRequestAsap(from, to)) {
      return {
        error: "asap_not_available",
        message:
          "ASAP live dispatch is available on Crete corridors only. Offer a scheduled quote instead.",
      };
    }
    const email = String(args.customerEmail ?? "").trim();
    const phone = String(args.customerPhone ?? "").trim();
    if (!email.includes("@") || phone.length < 6) {
      return {
        error: "contact_required",
        message: "Ask for the passenger name, email, and phone before requesting ASAP.",
      };
    }
    try {
      const created = await createAsapBooking({
        from,
        to,
        customerName: String(args.customerName ?? "ASAP guest"),
        customerEmail: email,
        customerPhone: phone,
        pax: args.pax as number | undefined,
        vehicleClass: args.vehicleClass as string | undefined,
        notes: args.notes as string | undefined,
      });
      return {
        ok: true,
        bookingId: created.bookingId,
        priceEur: created.priceCents / 100,
        etaHintMinutes: created.etaHintMinutes,
        expiresAt: created.expiresAt,
        from: from.label,
        to: to.label,
        status: "searching",
      };
    } catch (e) {
      return { error: "asap_create_failed", message: e instanceof Error ? e.message : "failed" };
    }
  }

  if (name === "get_dispatch_status") {
    const { getAsapDispatchStatus } = await import("@/lib/asap-dispatch");
    const bookingId = String(args.bookingId ?? "");
    if (!bookingId) return { error: "booking_id_required" };
    try {
      const status = await getAsapDispatchStatus(bookingId);
      if (!status) return { error: "not_found" };
      return status;
    } catch (e) {
      return { error: "status_failed", message: e instanceof Error ? e.message : "failed" };
    }
  }

  if (name === "quote_vehicles") {
    let from = resolvePlaceQuery(String(args.fromQuery ?? ""));
    let to = resolvePlaceQuery(String(args.toQuery ?? ""));
    const defaults = placesFromPageContext(pageContext);
    if (!from && defaults.from) from = defaults.from;
    if (!to && defaults.to) to = defaults.to;
    if (!from || !to) return { error: "places_not_found", from, to };
    const pickupAt =
      args.date != null
        ? `${String(args.date)}T${String(args.time ?? "12:00")}:00`
        : undefined;
    return toolQuoteVehicles({ from, to, pickupAt, pax: args.pax as number | undefined });
  }

  if (name === "build_book_url") {
    let from = resolvePlaceQuery(String(args.fromQuery ?? ""));
    let to = resolvePlaceQuery(String(args.toQuery ?? ""));
    const defaults = placesFromPageContext(pageContext);
    if (!from && defaults.from) from = defaults.from;
    if (!to && defaults.to) to = defaults.to;
    if (!from || !to) return { error: "places_not_found" };
    const routeSlug = matchRouteSlug(from, to);
    return {
      bookPath: toolBuildBookUrl({
        locale: (args.locale as string) ?? locale,
        fromLabel: from.label,
        toLabel: to.label,
        fromLat: from.lat,
        fromLng: from.lng,
        toLat: to.lat,
        toLng: to.lng,
        routeSlug,
        vehicleClass: args.vehicleClass as string | undefined,
        pax: (args.pax as number) ?? 2,
        date: args.date as string | undefined,
        time: args.time as string | undefined,
      }),
    };
  }

  if (name === "explain_policy") {
    return toolExplainPolicy();
  }

  return { error: "unknown_tool" };
}
