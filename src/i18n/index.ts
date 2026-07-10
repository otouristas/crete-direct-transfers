import { useParams } from "@tanstack/react-router";
import { en, type Dict } from "./en";
import { el } from "./el";
import { de } from "./de";

export type { Dict };

export const LOCALES = ["en", "el", "de"] as const;
export type Locale = (typeof LOCALES)[number];

/** Locales that appear as a URL prefix — English lives at the root. */
export const PREFIX_LOCALES = ["el", "de"] as const;

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  el: "Ελληνικά",
  de: "Deutsch",
};

const dicts: Record<Locale, Dict> = { en, el, de };

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

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
