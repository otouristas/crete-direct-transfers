import { useEffect } from "react";
import { trackAnalyticsEvent } from "@/lib/cookie-consent";

function eventForLink(link: HTMLAnchorElement): string | undefined {
  const explicit = link.dataset.analyticsEvent;
  if (explicit) return explicit;

  const href = link.getAttribute("href") ?? "";
  if (href.startsWith("tel:")) return "Phone Click";
  if (href.startsWith("mailto:")) return "Email Click";
  if (href.includes("wa.me/")) return "WhatsApp Click";

  try {
    const url = new URL(href, window.location.origin);
    if (url.origin === window.location.origin && /(^|\/)book(?:\/|$)/.test(url.pathname)) {
      return "Booking CTA Click";
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function safeDestination(link: HTMLAnchorElement): string {
  const href = link.getAttribute("href") ?? "";
  if (href.startsWith("tel:")) return "tel";
  if (href.startsWith("mailto:")) return "mailto";
  if (href.includes("wa.me/")) return "whatsapp";
  try {
    const url = new URL(href, window.location.origin);
    return url.origin === window.location.origin ? url.pathname : url.origin;
  } catch {
    return "unknown";
  }
}

/** Consent-aware delegated tracking for conversion links rendered anywhere in the app. */
export function ConversionTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest("a");
      if (!(link instanceof HTMLAnchorElement)) return;
      const analyticsEvent = eventForLink(link);
      if (!analyticsEvent) return;

      trackAnalyticsEvent(analyticsEvent, {
        page: window.location.pathname,
        destination: safeDestination(link),
        label: link.textContent?.trim().slice(0, 120) || "unlabelled",
      });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
