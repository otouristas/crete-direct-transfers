import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { getDict, type Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { Field, InputStyles } from "@/components/form/field";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/{-$locale}/reset-password")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/reset-password",
      title: `${t.auth.newPasswordTitle} | TransferAround`,
      description: t.auth.resetSubtitle,
      noindex: true,
    });
  },
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { locale } = Route.useRouteContext();
  const t = getDict(locale);
  const navigate = useNavigate();
  // The recovery link lands here with hash tokens; supabase-js picks them up
  // (detectSessionInUrl) and the provider receives the recovery session.
  const { session, ready } = useAuth();

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError(t.auth.passwordMin);
      return;
    }
    setError(null);
    setSubmitting(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (err) {
      setError(err.message);
      return;
    }
    toast.success(t.auth.passwordUpdated);
    navigate({ to: "/{-$locale}/account", replace: true });
  };

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <div className="rounded-2xl border border-border bg-card p-8">
        {!ready ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>
        ) : !session ? (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">{t.auth.resetInvalid}</p>
            <Link
              to="/{-$locale}/forgot-password"
              className="mt-6 inline-flex rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
            >
              {t.auth.sendResetLink}
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-display text-primary">{t.auth.newPasswordTitle}</h1>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <Field label={t.auth.newPassword} error={error ?? undefined}>
                <input
                  type="password"
                  className="input"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? t.auth.updating : t.auth.updatePassword}
              </button>
            </form>
          </>
        )}
      </div>
      <InputStyles />
    </div>
  );
}
