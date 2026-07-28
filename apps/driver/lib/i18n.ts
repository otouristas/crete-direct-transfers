import { useCallback } from "react";
import { getLocales } from "expo-localization";
import { resolveLocale, translate, type Locale, type MessageKey } from "@transferaround/i18n";

export function getDeviceLocale(): Locale {
  return resolveLocale(getLocales()[0]?.languageCode);
}

export function useI18n() {
  const locale = getDeviceLocale();
  const t = useCallback((key: MessageKey) => translate(locale, key), [locale]);
  return { locale, t };
}

export function localizedAuthError(error: unknown): MessageKey {
  const code =
    typeof error === "object" && error && "code" in error
      ? String((error as { code?: unknown }).code)
      : "";
  if (code === "invalid_credentials") return "auth.invalidCredentials";
  if (code === "email_not_confirmed") return "auth.emailNotConfirmed";
  return "common.error";
}
