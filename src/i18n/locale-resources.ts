import { loadDict, type Locale } from "@/i18n";
import { loadContentOverlay } from "@/i18n/content";

/**
 * Everything a locale needs before it can render synchronously: its UI
 * dictionary and its long-form content overlay. Called before hydration for
 * the URL's locale and before any client-side navigation into another locale.
 */
export function loadLocaleResources(locale: Locale): Promise<void> {
  return Promise.all([loadDict(locale), loadContentOverlay(locale)]).then(() => undefined);
}
