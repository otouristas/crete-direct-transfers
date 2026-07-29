import type { Locale } from "@/i18n";
import { MARKETS } from "@/data/markets";
import { getCountryName } from "@/i18n/markets";

const FLAGS: Record<string, string> = {
  greece: "🇬🇷",
  spain: "🇪🇸",
  italy: "🇮🇹",
  portugal: "🇵🇹",
  cyprus: "🇨🇾",
  turkey: "🇹🇷",
};

export function getMarketNavigation(locale: Locale) {
  return MARKETS.map((market) => ({
    slug: market.slug,
    name: getCountryName(locale, market.slug),
    flag: FLAGS[market.slug] ?? "•",
    mode: market.bookableDefault,
    published: market.publicationStatus === "published" && market.live,
  }));
}
