import { useId, useState } from "react";
import { z } from "zod";
import { Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLocale, useT } from "@/i18n";
import { cn } from "@/lib/utils";
import { trackAnalyticsEvent } from "@/lib/cookie-consent";

type State = "idle" | "sending" | "sent" | "error";

/**
 * Homepage email capture.
 *
 * Writes to `newsletter_subscribers`, which grants anon INSERT only — the list
 * can never be read back from the browser. A repeat address hits the unique
 * index on lower(email); that is treated as success, because from the visitor's
 * side re-subscribing worked.
 */
export function NewsletterBand() {
  const t = useT();
  const locale = useLocale();
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = z.string().trim().email().max(255).safeParse(email);
    if (!parsed.success) {
      setError(t.home.newsletterInvalid);
      setState("error");
      return;
    }

    setError(null);
    setState("sending");

    const { error: insertError } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: parsed.data, locale, source: "homepage" });

    // 23505 = unique violation: already subscribed, which is not a failure here.
    if (insertError && insertError.code !== "23505") {
      setError(t.home.newsletterError);
      setState("error");
      return;
    }

    setState("sent");
    setEmail("");
    trackAnalyticsEvent("Newsletter Signup", { locale, source: "homepage" });
  };

  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 md:py-16 lg:grid-cols-[1fr_minmax(0,28rem)] lg:items-center lg:gap-16">
        <div>
          <h2 className="max-w-md text-3xl font-display leading-tight text-primary md:text-4xl">
            {t.home.newsletterTitle}
          </h2>
          <p className="mt-3 max-w-md text-muted-foreground">{t.home.newsletterBody}</p>
        </div>

        <div>
          {state === "sent" ? (
            <p
              role="status"
              className="inline-flex items-center gap-2.5 rounded-xl bg-accent/10 px-5 py-4 text-sm font-semibold text-accent-deep"
            >
              <Check className="h-4 w-4 shrink-0" aria-hidden />
              {t.home.newsletterSuccess}
            </p>
          ) : (
            <form onSubmit={submit} noValidate className="flex flex-col gap-2.5">
              <div className="flex flex-col gap-2.5 sm:flex-row">
                <label htmlFor={inputId} className="sr-only">
                  {t.home.newsletterPlaceholder}
                </label>
                <input
                  id={inputId}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (state === "error") setState("idle");
                  }}
                  placeholder={t.home.newsletterPlaceholder}
                  aria-invalid={state === "error"}
                  aria-describedby={error ? `${inputId}-error` : undefined}
                  className={cn(
                    "min-w-0 flex-1 rounded-xl border bg-background px-4 py-3.5 text-sm text-foreground",
                    "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent",
                    state === "error" ? "border-destructive" : "border-border",
                  )}
                />
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
                >
                  {state === "sending" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                  {t.home.newsletterCta}
                </button>
              </div>
              {error && (
                <p id={`${inputId}-error`} role="alert" className="text-xs text-destructive">
                  {error}
                </p>
              )}
              <p className="text-xs text-muted-foreground">{t.home.newsletterConsent}</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
