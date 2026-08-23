import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cookie } from "lucide-react";
import { useT } from "@/i18n";
import { applyStoredConsent, readConsent, writeConsent } from "@/lib/cookie-consent";

/** Let the hero paint before the notice slides in. */
const APPEAR_DELAY_MS = 900;

/**
 * Cookie notice, bottom-left.
 *
 * Renders nothing until mounted so the server markup matches the client's, and
 * nothing at all once a choice exists. Sits opposite the Touristas AI launcher
 * (fixed bottom-right) so the two corners never collide, and is kept
 * deliberately short — on the homepage a taller card overlaps the booking bar.
 */
export function CookieBanner() {
  const t = useT();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    applyStoredConsent();
    if (readConsent() !== null) return;
    const timer = setTimeout(() => setVisible(true), APPEAR_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const choose = (value: "accepted" | "declined") => {
    writeConsent(value);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label={t.common.cookieAria}
      className="fixed bottom-4 left-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500 motion-reduce:animate-none sm:bottom-5 sm:left-5 sm:right-auto sm:max-w-[21rem]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="rounded-2xl border border-border bg-card/95 p-4 shadow-[0_16px_48px_-16px_rgb(0_0_0/0.35)] backdrop-blur-md">
        <div className="flex gap-3">
          <span
            aria-hidden
            className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent-deep"
          >
            <Cookie className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-sm text-primary">{t.common.cookieTitle}</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {t.common.cookieBody}
            </p>
          </div>
        </div>

        <div className="mt-3.5 flex gap-2">
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="flex-1 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            {t.common.cookieAccept}
          </button>
          <button
            type="button"
            onClick={() => choose("declined")}
            className="flex-1 rounded-lg border border-border px-4 py-2 text-xs font-semibold text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            {t.common.cookieDecline}
          </button>
        </div>

        <div className="mt-2.5 flex items-center gap-2.5 text-[11px] text-muted-foreground">
          <Link
            to="/{-$locale}/legal/cookies"
            className="transition hover:text-accent-deep hover:underline"
          >
            {t.common.cookiePolicy}
          </Link>
          <span aria-hidden className="text-border">
            |
          </span>
          <Link
            to="/{-$locale}/legal/privacy"
            className="transition hover:text-accent-deep hover:underline"
          >
            {t.common.cookiePrivacy}
          </Link>
        </div>
      </div>
    </div>
  );
}
