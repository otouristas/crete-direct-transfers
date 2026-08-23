import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Globe, X } from "lucide-react";
import { getDict, isLocale, PUBLIC_LOCALES, useLocale, useT, type Locale } from "@/i18n";
import { cn } from "@/lib/utils";

/**
 * Accept-Language aware suggestion — NOT a redirect. If the visitor's browser
 * prefers a language we support that differs from the current URL locale, we
 * show a dismissible bar offering to switch. We never auto-redirect: forced
 * redirects harm crawling and can pin users/bots to the wrong locale. The
 * suggestion is client-only (reads navigator), so it renders nothing on the
 * server and appears after hydration.
 */

const DISMISS_KEY = "ta-lang-suggestion-dismissed";

export function LanguageSuggestionBanner() {
  const locale = useLocale();
  const t = useT();
  const navigate = useNavigate();
  const [suggested, setSuggested] = useState<Locale | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISS_KEY)) return;
    } catch {
      // localStorage unavailable (private mode) — just skip persistence.
    }
    const prefs =
      navigator.languages && navigator.languages.length
        ? navigator.languages
        : [navigator.language];
    for (const pref of prefs) {
      const primary = pref.split("-")[0]?.toLowerCase() ?? "";
      if (isLocale(primary) && (PUBLIC_LOCALES as readonly Locale[]).includes(primary)) {
        // Stop at the first public preference; suggest only if it differs.
        if (primary !== locale) setSuggested(primary);
        return;
      }
    }
  }, [locale]);

  if (!suggested) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore
    }
    setSuggested(null);
  };

  const switchTo = () => {
    dismiss();
    navigate({
      to: ".",
      params: (prev: Record<string, string | undefined>) => ({
        ...prev,
        locale: suggested === "en" ? undefined : suggested,
      }),
      search: true,
    });
  };

  return (
    <div className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2">
        <button
          type="button"
          onClick={switchTo}
          className={cn(
            "inline-flex items-center gap-2 text-sm font-medium",
            "transition-opacity hover:opacity-90",
          )}
        >
          <Globe className="h-4 w-4 shrink-0" />
          <span>
            {getDict(suggested).settings.viewSiteIn}
            <span aria-hidden="true"> →</span>
          </span>
        </button>
        <button
          type="button"
          onClick={dismiss}
          aria-label={t.ui.dismiss}
          className="rounded-full p-1 transition-colors hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
