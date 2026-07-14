import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MailCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getDict, localePath, type Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { Field, InputStyles } from "@/components/form/field";

export const Route = createFileRoute("/{-$locale}/forgot-password")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/forgot-password",
      title: `${t.auth.resetTitle} | TransferAround`,
      description: t.auth.resetSubtitle,
      noindex: true,
    });
  },
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { locale } = Route.useRouteContext();
  const t = getDict(locale);

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}${localePath(locale, "/reset-password")}`,
    });
    setSubmitting(false);
    // Always show success — don't leak which emails have accounts.
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <div className="rounded-2xl border border-border bg-card p-8">
        {sent ? (
          <div className="text-center">
            <MailCheck className="mx-auto h-12 w-12 text-accent" strokeWidth={1.5} />
            <p className="mt-4 text-sm text-muted-foreground">{t.auth.resetSent}</p>
            <Link
              to="/{-$locale}/login"
              className="mt-6 inline-flex rounded-xl border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
            >
              {t.auth.signIn}
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-display text-primary">{t.auth.resetTitle}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t.auth.resetSubtitle}</p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <Field label={t.auth.email}>
                <input
                  type="email"
                  className="input"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? t.auth.sending : t.auth.sendResetLink}
              </button>
            </form>
          </>
        )}
      </div>
      <InputStyles />
    </div>
  );
}
