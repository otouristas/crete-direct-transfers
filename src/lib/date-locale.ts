import { enGB, el, de, fr, it, nl, es } from "date-fns/locale";
import type { Locale as AppLocale } from "@/i18n";

const DATE_FNS_LOCALES = { en: enGB, el, de, fr, it, nl, es } as const;

/** date-fns locale object for the active app language (used by format() and <Calendar />). */
export function dateFnsLocale(locale: AppLocale) {
  return DATE_FNS_LOCALES[locale] ?? enGB;
}

/** BCP-47 tag for Intl.DateTimeFormat / toLocaleString. */
export function intlLocale(locale: AppLocale): string {
  return locale === "en" ? "en-GB" : locale;
}
