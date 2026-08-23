/**
 * Cookie consent state and the one thing it actually gates.
 *
 * Only analytics is optional here — everything else the site sets is required
 * to run it (session, locale, currency). So "decline" has exactly one effect,
 * and it is a real one: the Plausible script is never injected. Consent is
 * stored locally rather than in a cookie, which keeps the choice itself out of
 * what we ask permission for.
 */

export type ConsentValue = "accepted" | "declined";

const STORAGE_KEY = "ta.cookie-consent";

/** Fired on the window whenever the choice changes, so listeners can react. */
export const CONSENT_EVENT = "ta:cookie-consent";

export function readConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw === "accepted" || raw === "declined" ? raw : null;
  } catch {
    // Private mode / blocked storage: treat as undecided rather than throwing.
    return null;
  }
}

export function writeConsent(value: ConsentValue): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Choice won't persist, but honour it for this page view.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
  if (value === "accepted") loadAnalytics();
}

const PLAUSIBLE_ID = "plausible-analytics";

/**
 * Injects Plausible, once, if a domain is configured. Called on acceptance and
 * on boot when consent was already given — never otherwise.
 */
export function loadAnalytics(): void {
  if (typeof document === "undefined") return;
  const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN?.trim();
  if (!domain || document.getElementById(PLAUSIBLE_ID)) return;

  const script = document.createElement("script");
  script.id = PLAUSIBLE_ID;
  script.src = "https://plausible.io/js/script.js";
  script.defer = true;
  script.setAttribute("data-domain", domain);
  document.head.appendChild(script);
}

/** Boot-time application of a previously stored choice. */
export function applyStoredConsent(): void {
  if (readConsent() === "accepted") loadAnalytics();
}
