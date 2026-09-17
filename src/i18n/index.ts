import { useParams } from "@tanstack/react-router";
import { en, type Dict } from "./en";
import { LOCALES, LOCALE_LABELS, isLocale, type Locale } from "@transferaround/i18n";

export type { Dict };
export { LOCALES, LOCALE_LABELS, isLocale };
export type { Locale };

/** Locales that appear as a URL prefix — English lives at the root. */
export const PREFIX_LOCALES = ["el", "de", "fr", "it", "nl", "es"] as const;

/**
 * Locales with complete long-form content overlays and approved for search/public navigation.
 *
 * `it` joins en/el/de/fr: both its UI dictionary and its content overlay are fully
 * translated. `nl` and `es` stay out — their UI dictionaries are translated but
 * `src/i18n/content/overlays/{nl,es}.ts` are byte-identical English stubs, so
 * publishing them would put duplicate English long-form content on two more
 * hreflang clusters. Add them here once those overlays are actually translated.
 */
export const PUBLIC_LOCALES = ["en", "el", "de", "fr", "it"] as const satisfies readonly Locale[];

/**
 * Dictionary registry.
 *
 * English is always bundled (it is the fallback for everything). The other six
 * dictionaries are ~75–110 KB of source each, so the browser only downloads
 * the one it renders: `getRouter()` awaits `loadLocale()` for the URL's locale
 * before hydration, and the language switcher awaits it before navigating. The
 * server registers every dictionary at startup (see `register-all.server.ts`),
 * so SSR can render any locale on any request.
 */
const dicts: Partial<Record<Locale, Dict>> = { en };

const DICT_LOADERS: Record<Exclude<Locale, "en">, () => Promise<Dict>> = {
  el: () => import("./el").then((m) => m.el),
  de: () => import("./de").then((m) => m.de),
  fr: () => import("./fr").then((m) => m.fr),
  it: () => import("./it").then((m) => m.it),
  nl: () => import("./nl").then((m) => m.nl),
  es: () => import("./es").then((m) => m.es),
};

const pending: Partial<Record<Locale, Promise<void>>> = {};

/** Synchronous registration — used by the server to preload every locale. */
export function registerDict(locale: Locale, dict: Dict): void {
  dicts[locale] = dict;
}

export function isDictLoaded(locale: Locale): boolean {
  return dicts[locale] !== undefined;
}

/** Ensures `getDict(locale)` returns the real dictionary rather than the English fallback. */
export function loadDict(locale: Locale): Promise<void> {
  if (dicts[locale]) return Promise.resolve();
  const existing = pending[locale];
  if (existing) return existing;
  const loader = DICT_LOADERS[locale as Exclude<Locale, "en">];
  const task = loader()
    .then((dict) => {
      dicts[locale] = dict;
    })
    .finally(() => {
      delete pending[locale];
    });
  pending[locale] = task;
  return task;
}

/**
 * Typed dictionary for a locale. Falls back to English when a locale has not
 * been loaded yet — SSR output is always complete because the server preloads
 * every locale, and the client preloads the active one before hydration.
 */
export function getDict(locale: Locale): Dict {
  return dicts[locale] ?? en;
}

/** Locale implied by a pathname: "/el/about" → "el", "/about" → "en". */
export function localeFromPathname(pathname: string): Locale {
  const first = pathname.split("/")[1];
  return first && (PREFIX_LOCALES as readonly string[]).includes(first) ? (first as Locale) : "en";
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
