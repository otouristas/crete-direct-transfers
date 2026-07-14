import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { MailCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getDict, localePath, type Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { Field, InputStyles } from "@/components/form/field";

export const Route = createFileRoute("/{-$locale}/signup")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/signup",
      title: `${t.auth.signupTitle} | TransferAround`,
      description: t.auth.signupSubtitle,
      noindex: true,
    });
  },
  component: SignupPage,
});

const schema = z.object({
  full_name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  password: z.string().min(8, "At least 8 characters").max(72),
});

function SignupPage() {
  const { locale } = Route.useRouteContext();
  const t = getDict(locale);

  const [values, setValues] = useState({ full_name: "", email: "", phone: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const i of parsed.error.issues) errs[i.path.join(".")] = i.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setError(null);
    setSubmitting(true);
    const { data, error: err } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: { full_name: parsed.data.full_name, phone: parsed.data.phone || "" },
        emailRedirectTo: `${window.location.origin}${localePath(locale, "/account")}`,
      },
    });
    setSubmitting(false);
    if (err) {
      setError(/already registered/i.test(err.message) ? t.auth.alreadyRegistered : err.message);
      return;
    }
    // With email confirmation ON there is no session yet — show the check-email
    // panel. (If confirmation is OFF, a session exists and /account works right away.)
    if (data.session) {
      window.location.assign(localePath(locale, "/account"));
      return;
    }
    setSentTo(parsed.data.email);
  };

  if (sentTo) {
    return (
      <div className="mx-auto max-w-md px-6 py-16">
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <MailCheck className="mx-auto h-12 w-12 text-accent" strokeWidth={1.5} />
          <h1 className="mt-4 text-2xl font-display text-primary">{t.auth.checkEmailTitle}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t.auth.checkEmailBody(sentTo)}</p>
          <Link
            to="/{-$locale}/login"
            className="mt-6 inline-flex rounded-xl border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
          >
            {t.auth.signIn}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <div className="rounded-2xl border border-border bg-card p-8">
        <h1 className="text-3xl font-display text-primary">{t.auth.signupTitle}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t.auth.signupSubtitle}</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Field label={t.bookPage.fullName} error={errors.full_name}>
            <input
              className="input"
              autoComplete="name"
              value={values.full_name}
              onChange={(e) => setValues({ ...values, full_name: e.target.value })}
            />
          </Field>
          <Field label={t.auth.email} error={errors.email}>
            <input
              type="email"
              className="input"
              autoComplete="email"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
          </Field>
          <Field label={`${t.bookPage.phoneLabel} (${t.common.optional})`} error={errors.phone}>
            <input
              className="input"
              autoComplete="tel"
              placeholder="+44 …"
              value={values.phone}
              onChange={(e) => setValues({ ...values, phone: e.target.value })}
            />
          </Field>
          <Field label={t.auth.password} error={errors.password}>
            <input
              type="password"
              className="input"
              autoComplete="new-password"
              value={values.password}
              onChange={(e) => setValues({ ...values, password: e.target.value })}
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
            {submitting ? t.auth.creating : t.auth.signUp}
          </button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          {t.auth.haveAccount}{" "}
          <Link to="/{-$locale}/login" className="font-medium text-accent-deep hover:underline">
            {t.auth.signIn}
          </Link>
        </p>
      </div>
      <InputStyles />
    </div>
  );
}
