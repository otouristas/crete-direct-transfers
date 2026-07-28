import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MailCheck, ShieldCheck } from "lucide-react";
import { translate } from "@transferaround/i18n";
import { supabase } from "@/integrations/supabase/client";
import { getDict, localePath, type Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { Field, InputStyles } from "@/components/form/field";

export const Route = createFileRoute("/{-$locale}/driver_/apply")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/driver/apply",
      title: `${t.driver.applyTitle} | TransferAround`,
      description: t.driver.applySubtitle,
      noindex: true,
    });
  },
  component: DriverApplyPage,
});

function DriverApplyPage() {
  const { locale } = Route.useRouteContext();
  const t = getDict(locale);
  const tr = (key: Parameters<typeof translate>[1]) => translate(locale, key);
  const [values, setValues] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (values.full_name.trim().length < 2) nextErrors.full_name = tr("validation.name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      nextErrors.email = tr("validation.email");
    }
    if (values.phone.trim().length < 5) nextErrors.phone = tr("validation.phone");
    if (values.password.length < 8) nextErrors.password = tr("validation.password");
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    setError(null);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: values.email.trim(),
      password: values.password,
      options: {
        data: {
          signup_role: "driver",
          full_name: values.full_name.trim(),
          phone: values.phone.trim(),
          locale,
        },
        emailRedirectTo: `${window.location.origin}${localePath(locale, "/driver")}`,
      },
    });
    setSubmitting(false);

    if (signUpError) {
      setError(
        signUpError.code === "user_already_exists" ? t.auth.alreadyRegistered : tr("common.error"),
      );
      return;
    }

    if (data.session) {
      window.location.assign(localePath(locale, "/driver"));
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="mx-auto max-w-md px-6 py-16">
        <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <MailCheck className="mx-auto h-12 w-12 text-accent" strokeWidth={1.5} />
          <h1 className="mt-4 text-2xl font-display text-primary">{t.driver.applySuccessTitle}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t.driver.applySuccessBody}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-6 py-14 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="rounded-3xl bg-primary p-8 text-primary-foreground lg:p-10">
        <ShieldCheck className="h-10 w-10 text-accent" strokeWidth={1.5} />
        <h1 className="mt-6 text-4xl font-display">{t.driver.applyTitle}</h1>
        <p className="mt-4 leading-7 text-primary-foreground/75">{t.driver.applySubtitle}</p>
        <ol className="mt-8 space-y-4 text-sm text-primary-foreground/80">
          {[
            tr("onboarding.step.identity"),
            tr("onboarding.step.vehicle"),
            tr("onboarding.step.documents"),
            tr("onboarding.step.review"),
          ].map((label, index) => (
            <li key={label} className="flex items-center gap-3">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 font-semibold">
                {index + 1}
              </span>
              {label}
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm lg:p-10">
        <form onSubmit={submit} className="space-y-5">
          <Field label={t.bookPage.fullName} error={errors.full_name}>
            <input
              className="input"
              autoComplete="name"
              value={values.full_name}
              onChange={(event) =>
                setValues((current) => ({ ...current, full_name: event.target.value }))
              }
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={t.auth.email} error={errors.email}>
              <input
                type="email"
                className="input"
                autoComplete="email"
                value={values.email}
                onChange={(event) =>
                  setValues((current) => ({ ...current, email: event.target.value }))
                }
              />
            </Field>
            <Field label={t.bookPage.phoneLabel} error={errors.phone}>
              <input
                className="input"
                autoComplete="tel"
                value={values.phone}
                onChange={(event) =>
                  setValues((current) => ({ ...current, phone: event.target.value }))
                }
              />
            </Field>
          </div>
          <Field label={t.auth.password} error={errors.password}>
            <input
              type="password"
              className="input"
              autoComplete="new-password"
              value={values.password}
              onChange={(event) =>
                setValues((current) => ({ ...current, password: event.target.value }))
              }
            />
          </Field>
          {error ? (
            <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{error}</div>
          ) : null}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? t.auth.creating : tr("auth.createAccount")}
          </button>
        </form>
        <p className="mt-5 text-sm text-muted-foreground">
          {t.auth.haveAccount}{" "}
          <Link
            to="/{-$locale}/login"
            search={{ role: "driver" }}
            className="font-semibold text-accent-deep hover:underline"
          >
            {t.auth.signIn}
          </Link>
        </p>
      </div>
      <InputStyles />
    </div>
  );
}
