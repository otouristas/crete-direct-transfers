import type { Locale } from "@/i18n";
import { FAQ_GROUPS, type FaqGroup } from "@/data/faqs";
import { SERVICES, type ServiceData } from "@/data/services";
import { REGIONS, type RegionData } from "@/data/regions";
import { ROUTES, VEHICLE_CLASSES } from "@/data/routes";
import { MARKETS, type Market } from "@/data/markets";
import { MARKET_HUB_AIRPORTS, MARKET_HUB_CITIES } from "@/data/market-hubs";
import { AIRPORTS, type AirportData } from "@/data/airports";
import { getAirportResolved } from "@/lib/airport-resolve";
import { AIRPORT_ROUTES, type AirportRouteData } from "@/data/airport-routes";
import { POSTS, type Post } from "@/data/posts";
import type {
  AirportOverlay,
  AirportRouteOverlay,
  ContentOverlays,
  FaqOverlay,
  MarketHubOverlay,
  MarketOverlay,
  PostOverlay,
  RegionOverlay,
  RouteOverlay,
  ServiceOverlay,
  VehicleOverlay,
} from "./types";

type OverlayModule = Partial<ContentOverlays>;

const overlayLoaders: Record<Exclude<Locale, "en">, () => Promise<OverlayModule>> = {
  el: () => import("./overlays/el").then((m) => m.default),
  de: () => import("./overlays/de").then((m) => m.default),
  fr: () => import("./overlays/fr").then((m) => m.default),
  it: () => import("./overlays/it").then((m) => m.default),
  nl: () => import("./overlays/nl").then((m) => m.default),
  es: () => import("./overlays/es").then((m) => m.default),
};

const cache = new Map<Locale, OverlayModule>();

async function loadOverlay(locale: Locale): Promise<OverlayModule> {
  if (locale === "en") return {};
  const cached = cache.get(locale);
  if (cached) return cached;
  const data = await overlayLoaders[locale]();
  cache.set(locale, data);
  return data;
}

/** Sync access after warm — overlays are imported eagerly for SSR/head. */
import elOverlay from "./overlays/el";
import deOverlay from "./overlays/de";
import frOverlay from "./overlays/fr";
import itOverlay from "./overlays/it";
import nlOverlay from "./overlays/nl";
import esOverlay from "./overlays/es";

const SYNC: Record<Locale, OverlayModule> = {
  en: {},
  el: elOverlay,
  de: deOverlay,
  fr: frOverlay,
  it: itOverlay,
  nl: nlOverlay,
  es: esOverlay,
};

function overlay(locale: Locale): OverlayModule {
  return SYNC[locale] ?? {};
}

export function getLocalizedFaqs(locale: Locale): FaqGroup[] {
  const o = overlay(locale).faqs as FaqOverlay | undefined;
  return o?.length ? o : FAQ_GROUPS;
}

export function getLocalizedServices(locale: Locale): ServiceData[] {
  const o = overlay(locale).services as ServiceOverlay | undefined;
  if (!o) return SERVICES;
  return SERVICES.map((s) => (o[s.slug] ? { ...s, ...o[s.slug] } : s));
}

export function getLocalizedService(locale: Locale, slug: string): ServiceData | undefined {
  return getLocalizedServices(locale).find((s) => s.slug === slug);
}

export function getLocalizedRegions(locale: Locale): RegionData[] {
  const o = overlay(locale).regions as RegionOverlay | undefined;
  if (!o) return REGIONS;
  return REGIONS.map((r) => (o[r.slug] ? { ...r, ...o[r.slug] } : r));
}

export function getLocalizedRegion(locale: Locale, slug: string): RegionData | undefined {
  return getLocalizedRegions(locale).find((r) => r.slug === slug);
}

export function getLocalizedVehicles(locale: Locale) {
  const o = overlay(locale).vehicles as VehicleOverlay | undefined;
  if (!o) return VEHICLE_CLASSES;
  return VEHICLE_CLASSES.map((v) => (o[v.id] ? { ...v, ...o[v.id] } : v));
}

export function getLocalizedRoutes(locale: Locale) {
  const o = overlay(locale).routes as RouteOverlay | undefined;
  if (!o) return ROUTES;
  return ROUTES.map((r) => (o[r.slug] ? { ...r, ...o[r.slug] } : r));
}

export function getLocalizedRoute(locale: Locale, slug: string) {
  return getLocalizedRoutes(locale).find((r) => r.slug === slug);
}

export function getLocalizedMarkets(locale: Locale): Market[] {
  const o = overlay(locale).markets as MarketOverlay | undefined;
  if (!o) return MARKETS;
  return MARKETS.map((m) => (o[m.slug] ? { ...m, ...o[m.slug] } : m));
}

export function getLocalizedMarket(locale: Locale, slug: string): Market | undefined {
  return getLocalizedMarkets(locale).find((m) => m.slug === slug);
}

export function getLocalizedMarketHubAirports(locale: Locale, countrySlug?: string) {
  const o = overlay(locale).marketHubs as MarketHubOverlay | undefined;
  const list = countrySlug
    ? MARKET_HUB_AIRPORTS.filter((a) => a.countrySlug === countrySlug)
    : MARKET_HUB_AIRPORTS;
  if (!o) return list;
  return list.map((a) => {
    const patch = o[a.slug];
    return patch ? { ...a, intro: patch.intro, ...(patch.name ? { name: patch.name } : {}) } : a;
  });
}

export function getLocalizedMarketHubCities(locale: Locale, countrySlug?: string) {
  const o = overlay(locale).marketHubs as MarketHubOverlay | undefined;
  const list = countrySlug
    ? MARKET_HUB_CITIES.filter((c) => c.countrySlug === countrySlug)
    : MARKET_HUB_CITIES;
  if (!o) return list;
  return list.map((c) => {
    const patch = o[c.slug];
    return patch ? { ...c, intro: patch.intro, ...(patch.name ? { name: patch.name } : {}) } : c;
  });
}

export function getLocalizedAirports(locale: Locale): AirportData[] {
  const o = overlay(locale).airports as AirportOverlay | undefined;
  if (!o) return AIRPORTS;
  return AIRPORTS.map((a) => {
    const patch = o[a.slug];
    if (!patch) return a;
    return {
      ...a,
      ...patch,
      comparison: patch.comparison.map((c, i) => ({
        ...c,
        recommended: a.comparison[i]?.recommended,
      })),
    };
  });
}

export function getLocalizedAirport(locale: Locale, slug: string): AirportData | undefined {
  const curated = getLocalizedAirports(locale).find((a) => a.slug === slug);
  if (curated) return curated;
  // Global fallback: any of the 8,927 IATA airports renders with generated
  // (English) content so no real airport 404s. Not locale-overlaid yet.
  return getAirportResolved(slug);
}

export function airportRouteKey(airportSlug: string, routeSlug: string) {
  return `${airportSlug}::${routeSlug}`;
}

export function getLocalizedAirportRoutes(locale: Locale): AirportRouteData[] {
  const o = overlay(locale).airportRoutes as AirportRouteOverlay | undefined;
  if (!o) return AIRPORT_ROUTES;
  return AIRPORT_ROUTES.map((r) => {
    const patch = o[airportRouteKey(r.airportSlug, r.routeSlug)];
    return patch ? { ...r, ...patch } : r;
  });
}

export function getLocalizedAirportRoute(
  locale: Locale,
  airportSlug: string,
  routeSlug: string,
): AirportRouteData | undefined {
  return getLocalizedAirportRoutes(locale).find(
    (r) => r.airportSlug === airportSlug && r.routeSlug === routeSlug,
  );
}

export function getLocalizedPosts(locale: Locale): Post[] {
  const o = overlay(locale).posts as PostOverlay | undefined;
  if (!o) return POSTS;
  return POSTS.map((p) => {
    const patch = o[p.slug];
    if (!patch) return p;
    return {
      ...p,
      title: patch.title,
      description: patch.description,
      author: patch.authorRole ? { ...p.author, role: patch.authorRole } : p.author,
      sections: p.sections.map((s, i) => ({
        ...s,
        heading: patch.sections[i]?.heading ?? s.heading,
        body: patch.sections[i]?.body ?? s.body,
      })),
      faq: patch.faq ?? p.faq,
    };
  });
}

export function getLocalizedPost(locale: Locale, slug: string): Post | undefined {
  return getLocalizedPosts(locale).find((p) => p.slug === slug);
}

// Keep async loader available for future lazy splitting
export { loadOverlay };
