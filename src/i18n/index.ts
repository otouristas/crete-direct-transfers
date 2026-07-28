import { useParams } from "@tanstack/react-router";
import { en, type Dict } from "./en";
import { el } from "./el";
import { de } from "./de";
import { fr } from "./fr";
import { it } from "./it";
import { nl } from "./nl";
import { es } from "./es";
import { LOCALES, LOCALE_LABELS, isLocale, type Locale } from "@transferaround/i18n";

export type { Dict };
export { LOCALES, LOCALE_LABELS, isLocale };
export type { Locale };

/** Locales that appear as a URL prefix — English lives at the root. */
export const PREFIX_LOCALES = ["el", "de", "fr", "it", "nl", "es"] as const;

const dicts: Record<Locale, Dict> = { en, el, de, fr, it, nl, es };

export function getDict(locale: Locale): Dict {
  return dicts[locale];
}

/** Absolute path for a locale: localePath("el", "/about") → "/el/about". */
export function localePath(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path;
  return locale === "en" ? clean || "/" : `/${locale}${clean}`;
}

/** Current locale from the optional {-$locale} URL param; "en" at the root. */
export function useLocale(): Locale {
  const params = useParams({ strict: false }) as { locale?: string };
  return params.locale && isLocale(params.locale) ? params.locale : "en";
}

/** Typed dictionary for the current locale — access via t.nav.routes etc. */
export function useT(): Dict {
  return getDict(useLocale());
}
