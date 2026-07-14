import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { getDict, type Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { Field, InputStyles } from "@/components/form/field";

const searchSchema = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/{-$locale}/login")({
  validateSearch: searchSchema,
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/login",
      title: `${t.auth.loginTitle} | TransferAround`,
      description: t.auth.loginSubtitle,
      noindex: true,
    });
  },
  component: LoginPage,
});

function LoginPage() {
  const { locale } = Route.useRouteContext();
  const t = getDict(locale);
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const { session, ready } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const goAfterLogin = () => {
    if (redirect && redirect.startsWith("/")) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      navigate({ to: redirect as any, replace: true });
    } else {
      navigate({ to: "/{-$locale}/account", replace: true });
    }
  };

  // Already signed in? Straight to the dashboard.
  useEffect(() => {
    if (ready && session) goAfterLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, !!session]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setSubmitting(false);
    if (err) {
      if (/invalid login credentials/i.test(err.message)) setError(t.auth.invalidCredentials);
      else if (/email not confirmed/i.test(err.message)) setError(t.auth.emailNotConfirmed);
      else setError(err.message);
      return;
    }
    goAfterLogin();
  };

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <div className="rounded-2xl border border-border bg-card p-8">
        <h1 className="text-3xl font-display text-primary">{t.auth.loginTitle}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t.auth.loginSubtitle}</p>
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
          <Field label={t.auth.password}>
            <input
              type="password"
              className="input"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? t.auth.signingIn : t.auth.signIn}
          </button>
        </form>
        <div className="mt-4 flex items-center justify-between text-sm">
          <Link
            to="/{-$locale}/forgot-password"
            className="font-medium text-accent-deep hover:underline"
          >
            {t.auth.forgotPassword}
          </Link>
          <Link to="/{-$locale}/signup" className="font-medium text-accent-deep hover:underline">
            {t.auth.noAccountCta}
          </Link>
        </div>
      </div>
      <InputStyles />
    </div>
  );
}
