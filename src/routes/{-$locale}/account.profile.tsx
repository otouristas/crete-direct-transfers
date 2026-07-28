import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CheckCircle2, Settings2, ShieldCheck, UserRound, Users } from "lucide-react";
import {
  LOCALES,
  LOCALE_LABELS,
  translate,
  type Locale as SharedLocale,
} from "@transferaround/i18n";
import { getDict } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/queries/profile";
import { createSavedTraveler, deleteSavedTraveler, savedTravelersQuery } from "@/queries/travelers";
import { Field, InputStyles } from "@/components/form/field";
import { Skeleton } from "@/components/ui/skeleton";
import { CURRENCIES, type CurrencyCode } from "@/lib/currency";
import { useCurrency } from "@/hooks/use-currency";

export const Route = createFileRoute("/{-$locale}/account/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { locale } = Route.useRouteContext();
  const t = getDict(locale);
  const { user } = useAuth();
  const profile = useProfile();
  const queryClient = useQueryClient();
  const { setCurrency } = useCurrency();
  const tr = (key: Parameters<typeof translate>[1]) => translate(locale, key);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredLocale, setPreferredLocale] = useState<SharedLocale>(locale);
  const [preferredCurrency, setPreferredCurrencyState] = useState<CurrencyCode>("EUR");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [travelerName, setTravelerName] = useState("");
  const [travelerPhone, setTravelerPhone] = useState("");
  const [travelerChildSeat, setTravelerChildSeat] = useState(false);

  const travelers = useQuery({
    ...savedTravelersQuery(user?.id ?? ""),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (profile.data) {
      setFullName(profile.data.full_name ?? "");
      setPhone(profile.data.phone ?? "");
      setPreferredLocale(profile.data.preferred_locale);
      setPreferredCurrencyState(profile.data.preferred_currency as CurrencyCode);
    }
  }, [profile.data]);

  const saveProfile = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim() || null,
          phone: phone.trim() || null,
          preferred_locale: preferredLocale,
          preferred_currency: preferredCurrency,
        })
        .eq("id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setCurrency(preferredCurrency);
      toast.success(tr("profile.saved"));
    },
    onError: () => toast.error(t.account.saveFailed),
  });

  const savePassword = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
    },
    onSuccess: () => {
      setNewPassword("");
      toast.success(t.auth.passwordUpdated);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const addTraveler = useMutation({
    mutationFn: () =>
      createSavedTraveler({
        userId: user!.id,
        fullName: travelerName.trim(),
        phone: travelerPhone.trim() || undefined,
        childSeatNeeded: travelerChildSeat,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-travelers"] });
      setTravelerName("");
      setTravelerPhone("");
      setTravelerChildSeat(false);
      toast.success(t.account.saved);
    },
    onError: () => toast.error(t.account.saveFailed),
  });

  const removeTraveler = useMutation({
    mutationFn: (id: string) => deleteSavedTraveler(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-travelers"] });
      toast.success(t.account.saved);
    },
    onError: () => toast.error(t.account.saveFailed),
  });

  if (profile.isPending) {
    return <Skeleton className="h-72 w-full rounded-2xl" />;
  }

  const completedFields = [fullName.trim(), phone.trim(), user?.email].filter(Boolean).length;
  const completeness = Math.round((completedFields / 3) * 100);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="overflow-hidden rounded-3xl bg-primary text-primary-foreground shadow-sm">
        <div className="grid gap-6 p-7 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-9">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/10">
            <UserRound className="h-8 w-8 text-accent" />
          </div>
          <div>
            <p className="text-sm text-primary-foreground/65">{tr("profile.title")}</p>
            <h1 className="mt-1 text-3xl font-display">{fullName || user?.email?.split("@")[0]}</h1>
            <p className="mt-2 text-sm text-primary-foreground/70">{tr("profile.subtitle")}</p>
          </div>
          <div className="min-w-40 rounded-2xl bg-white/10 p-4">
            <div className="flex items-center justify-between text-xs">
              <span>{tr("profile.completeness")}</span>
              <span className="font-semibold">{completeness}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-accent transition-all"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10">
                <UserRound className="h-5 w-5 text-accent-deep" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">{tr("profile.contact")}</h2>
            </div>
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                saveProfile.mutate();
              }}
            >
              <Field label={tr("profile.fullName")}>
                <input
                  className="input"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </Field>
              <Field label={tr("profile.phone")}>
                <input
                  className="input"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Field>
              <Field label={tr("auth.email")}>
                <input className="input opacity-60" value={user?.email ?? ""} disabled readOnly />
              </Field>
              <p className="text-xs text-muted-foreground">{t.account.emailReadonlyHint}</p>
              <button
                type="submit"
                disabled={saveProfile.isPending}
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                {saveProfile.isPending ? tr("common.saving") : tr("common.save")}
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10">
                <Users className="h-5 w-5 text-accent-deep" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {tr("profile.savedTravelers")}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {tr("profile.savedTravelersHelp")}
                </p>
              </div>
            </div>
            <ul className="mt-4 space-y-2">
              {(travelers.data ?? []).map((tr) => (
                <li
                  key={tr.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2 text-sm"
                >
                  <span>
                    {tr.full_name}
                    {tr.phone ? ` · ${tr.phone}` : ""}
                    {tr.child_seat_needed ? ` · ${translate(locale, "profile.childSeat")}` : ""}
                  </span>
                  <button
                    type="button"
                    className="text-xs text-destructive hover:underline"
                    onClick={() => removeTraveler.mutate(tr.id)}
                  >
                    {translate(locale, "profile.remove")}
                  </button>
                </li>
              ))}
            </ul>
            <form
              className="mt-4 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (!travelerName.trim()) return;
                addTraveler.mutate();
              }}
            >
              <Field label={t.bookPage.fullName}>
                <input
                  className="input"
                  value={travelerName}
                  onChange={(e) => setTravelerName(e.target.value)}
                />
              </Field>
              <Field label={t.bookPage.phoneLabel}>
                <input
                  className="input"
                  value={travelerPhone}
                  onChange={(e) => setTravelerPhone(e.target.value)}
                />
              </Field>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={travelerChildSeat}
                  onChange={(e) => setTravelerChildSeat(e.target.checked)}
                />
                {tr("profile.childSeat")}
              </label>
              <button
                type="submit"
                disabled={addTraveler.isPending}
                className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted disabled:opacity-50"
              >
                {tr("profile.addTraveler")}
              </button>
            </form>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10">
                <Settings2 className="h-5 w-5 text-accent-deep" />
              </div>
              <h2 className="text-lg font-semibold">{tr("profile.preferences")}</h2>
            </div>
            <div className="mt-6 space-y-4">
              <Field label={tr("profile.language")}>
                <select
                  className="input"
                  value={preferredLocale}
                  onChange={(event) => setPreferredLocale(event.target.value as SharedLocale)}
                >
                  {LOCALES.map((code) => (
                    <option key={code} value={code}>
                      {LOCALE_LABELS[code]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={tr("profile.currency")}>
                <select
                  className="input"
                  value={preferredCurrency}
                  onChange={(event) =>
                    setPreferredCurrencyState(event.target.value as CurrencyCode)
                  }
                >
                  {CURRENCIES.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="flex items-center gap-2 rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-accent-deep" />
                {LOCALE_LABELS[preferredLocale]} · {preferredCurrency}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10">
                <ShieldCheck className="h-5 w-5 text-accent-deep" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                {t.account.changePasswordTitle}
              </h2>
            </div>
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (newPassword.length < 8) {
                  setPasswordError(t.auth.passwordMin);
                  return;
                }
                setPasswordError(null);
                savePassword.mutate();
              }}
            >
              <Field label={t.auth.newPassword} error={passwordError ?? undefined}>
                <input
                  type="password"
                  className="input"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Field>
              <button
                type="submit"
                disabled={savePassword.isPending}
                className="w-full rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                {t.auth.updatePassword}
              </button>
            </form>
          </section>
        </div>
      </div>
      <InputStyles />
    </div>
  );
}
