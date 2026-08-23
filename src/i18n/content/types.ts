import type { FaqGroup } from "@/data/faqs";
import type { ServiceData } from "@/data/services";
import type { RegionData } from "@/data/regions";
import type { VehicleClass } from "@/data/routes";
import type { Market } from "@/data/markets";
import type { AirportData, AirportTip, AirportFaq, TransportOption } from "@/data/airports";
import type { AirportRouteData, AirportRouteTip, AirportRouteFaq } from "@/data/airport-routes";
import type { Post, PostSection } from "@/data/posts";
import type { CountryGuide } from "@/data/country-guides";

export type FaqOverlay = FaqGroup[];

export type ServiceOverlay = Record<
  string,
  Pick<ServiceData, "name" | "tagline" | "intro" | "body" | "whatsIncluded" | "bestFor">
>;

export type RegionOverlay = Record<
  string,
  Pick<RegionData, "headline" | "intro" | "body" | "gateway">
>;

export type VehicleOverlay = Record<
  string,
  { label: string; capacity: string; bags: string; description: string; example: string }
>;

export type RouteOverlay = Record<string, { blurb: string; notes?: string }>;

export type MarketOverlay = Record<
  string,
  Pick<Market, "heroTitle" | "heroBody" | "metaTitle" | "metaDescription" | "searchIntents">
>;

export type MarketHubOverlay = Record<string, { intro: string; name?: string }>;

export type AirportOverlay = Record<
  string,
  {
    name?: string;
    alias?: string;
    intro: string;
    terminals: string;
    pickupPoint: string;
    cityDriveMin: string;
    tollsNote: string;
    knowBefore: AirportTip[];
    insights: string[];
    comparison: Omit<TransportOption, "recommended">[];
    faqs: AirportFaq[];
  }
>;

export type AirportRouteOverlay = Record<
  string,
  {
    body: string;
    tips: AirportRouteTip[];
    faqs: AirportRouteFaq[];
  }
>;

export type PostOverlay = Record<
  string,
  {
    title: string;
    description: string;
    authorRole?: string;
    sections: Pick<PostSection, "heading" | "body">[];
    faq?: { q: string; a: string }[];
  }
>;

/** Per-country guide copy. Locales without an entry fall back to English. */
export type CountryGuideOverlay = Record<
  string,
  Partial<
    Pick<
      CountryGuide,
      | "tagline"
      | "intro"
      | "facts"
      | "highlights"
      | "seasons"
      | "gettingAroundTitle"
      | "gettingAround"
      | "knowBefore"
      | "faqs"
    >
  >
>;

export type ContentOverlays = {
  faqs: FaqOverlay;
  services: ServiceOverlay;
  regions: RegionOverlay;
  vehicles: VehicleOverlay;
  routes: RouteOverlay;
  markets: MarketOverlay;
  marketHubs: MarketHubOverlay;
  airports: AirportOverlay;
  airportRoutes: AirportRouteOverlay;
  posts: PostOverlay;
  /** Optional: the generated overlay files predate this key, and English is a
      valid fallback until a locale's guide copy is translated. */
  countryGuides?: CountryGuideOverlay;
};

export type VehicleClassId = VehicleClass;
