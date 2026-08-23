import type { Locale } from "@/i18n";
import { FAQ_GROUPS, type FaqGroup } from "@/data/faqs";
import { SERVICES, type ServiceData } from "@/data/services";
import { REGIONS, type RegionData } from "@/data/regions";
import { ROUTES, VEHICLE_CLASSES } from "@/data/routes";
import { MARKETS, type Market } from "@/data/markets";
import { MARKET_HUB_AIRPORTS, MARKET_HUB_CITIES, getMarketHubAirport } from "@/data/market-hubs";
import { AIRPORTS, type AirportData } from "@/data/airports";
import { getAirportResolved } from "@/lib/airport-resolve";
import { localizeMarket } from "@/i18n/markets";
import { getMarketAirportDetails, getMarketAirportIntro } from "@/i18n/market-airport-details";
import { localizeGeneratedAirport } from "@/i18n/generated-airport-copy";
import { AIRPORT_ROUTES, type AirportRouteData } from "@/data/airport-routes";
import { POSTS, type Post } from "@/data/posts";
import { COUNTRY_GUIDES, type CountryGuide } from "@/data/country-guides";
import type {
  AirportOverlay,
  CountryGuideOverlay,
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
import { applyEditorialOverrides } from "./editorial-overrides";
import { applyAirportEditorialOverrides } from "./airport-editorial-overrides";

type OverlayModule = Partial<ContentOverlays>;

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
  return MARKETS.map((market) =>
    localizeMarket(o?.[market.slug] ? { ...market, ...o[market.slug] } : market, locale),
  );
}

export function getLocalizedMarket(locale: Locale, slug: string): Market | undefined {
  return getLocalizedMarkets(locale).find((m) => m.slug === slug);
}

export function getLocalizedMarketHubAirports(locale: Locale, countrySlug?: string) {
  const o = overlay(locale).marketHubs as MarketHubOverlay | undefined;
  const list = countrySlug
    ? MARKET_HUB_AIRPORTS.filter((a) => a.countrySlug === countrySlug)
    : MARKET_HUB_AIRPORTS;
  return list.map((a) => {
    const patch = o?.[a.slug];
    const name = patch?.name ?? a.name;
    return {
      ...a,
      name,
      intro: getMarketAirportIntro(locale, a, name),
    };
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
  return AIRPORTS.map((a) => {
    const patch = o?.[a.slug];
    const localized = patch
      ? {
          ...a,
          ...patch,
          comparison: patch.comparison.map((c, i) => ({
            ...c,
            recommended: a.comparison[i]?.recommended,
          })),
        }
      : a;
    return applyAirportEditorialOverrides(locale, a, localized);
  });
}

export function getLocalizedAirport(locale: Locale, slug: string): AirportData | undefined {
  const curated = getLocalizedAirports(locale).find((a) => a.slug === slug);
  if (curated) return curated;
  const hub = getMarketHubAirport(slug);
  if (hub) {
    const resolved = getAirportResolved(slug);
    const localizedHub = getLocalizedMarketHubAirports(locale).find((a) => a.slug === slug) ?? hub;
    if (!resolved) return undefined;
    return {
      ...resolved,
      ...getMarketAirportDetails(locale, hub, localizedHub.name, localizedHub.cityName),
      slug: localizedHub.slug,
      name: localizedHub.name,
      officialName: localizedHub.name,
      alias: localizedHub.name,
      cityName: localizedHub.cityName,
      citySlug: localizedHub.cityName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      // Quote-mode hubs still carry a real starting price: it comes from the same
      // distance engine that prices the booking (airport → nearest city), so the
      // facts card can show "from €X" instead of nothing. The quote step is where
      // the exact fare is confirmed, and the page copy says so.
      fromPriceEur: localizedHub.fromPriceEur || resolved.fromPriceEur,
      bookable: localizedHub.bookable,
      intro: getMarketAirportIntro(locale, hub, localizedHub.name),
    };
  }
  // Global fallback: any of the 8,927 IATA airports renders with native
  // quote-safe generated copy, while airport facts and identifiers stay intact.
  const generated = getAirportResolved(slug);
  return generated ? localizeGeneratedAirport(generated, locale) : undefined;
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
  if (!o) return POSTS.map((post) => applyEditorialOverrides(locale, post));
  return POSTS.map((p) => {
    const patch = o[p.slug];
    if (!patch) return applyEditorialOverrides(locale, p);
    const localized = {
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
    return applyEditorialOverrides(locale, localized);
  });
}

export function getLocalizedPost(locale: Locale, slug: string): Post | undefined {
  return getLocalizedPosts(locale).find((p) => p.slug === slug);
}

// Keep async loader available for future lazy splitting

/**
 * Country guides never fall back to English on a non-English route. A missing
 * overlay hides the optional guide sections until native copy is available.
 */
export function getLocalizedCountryGuide(locale: Locale, slug: string): CountryGuide | undefined {
  const base = COUNTRY_GUIDES.find((guide) => guide.slug === slug);
  if (!base) return undefined;
  if (locale === "en") return base;
  const o = overlay(locale).countryGuides as CountryGuideOverlay | undefined;
  return o?.[slug] ? { ...base, ...o[slug] } : undefined;
}
