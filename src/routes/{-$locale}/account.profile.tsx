import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getDict } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/queries/profile";
import {
  createSavedTraveler,
  deleteSavedTraveler,
  savedTravelersQuery,
} from "@/queries/travelers";
import { Field, InputStyles } from "@/components/form/field";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/{-$locale}/account/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { locale } = Route.useRouteContext();
  const t = getDict(locale);
  const { user } = useAuth();
  const profile = useProfile();
  const queryClient = useQueryClient();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
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
    }
  }, [profile.data]);

  const saveProfile = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName.trim() || null, phone: phone.trim() || null })
        .eq("id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success(t.account.saved);
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

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-primary">{t.account.tabProfile}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.account.profileTitle}</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-semibold text-foreground">{t.account.profileTitle}</h2>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            saveProfile.mutate();
          }}
        >
          <Field label={t.bookPage.fullName}>
            <input
              className="input"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </Field>
          <Field label={t.bookPage.phoneLabel}>
            <input
              className="input"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Field>
          <Field label={t.auth.email}>
            <input className="input opacity-60" value={user?.email ?? ""} disabled readOnly />
          </Field>
          <p className="text-xs text-muted-foreground">{t.account.emailReadonlyHint}</p>
          <button
            type="submit"
            disabled={saveProfile.isPending}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {t.account.saveChanges}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-semibold text-foreground">Saved travelers</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Store passengers and child-seat needs for faster checkout.
        </p>
        <ul className="mt-4 space-y-2">
          {(travelers.data ?? []).map((tr) => (
            <li
              key={tr.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2 text-sm"
            >
              <span>
                {tr.full_name}
                {tr.phone ? ` · ${tr.phone}` : ""}
                {tr.child_seat_needed ? " · child seat" : ""}
              </span>
              <button
                type="button"
                className="text-xs text-destructive hover:underline"
                onClick={() => removeTraveler.mutate(tr.id)}
              >
                Remove
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
            Child seat needed
          </label>
          <button
            type="submit"
            disabled={addTraveler.isPending}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted disabled:opacity-50"
          >
            Add traveler
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <h2 className="text-lg font-semibold text-foreground">{t.account.changePasswordTitle}</h2>
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
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {t.auth.updatePassword}
          </button>
        </form>
      </div>
      <InputStyles />
    </div>
  );
}
