import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getDict } from "@/i18n";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/queries/profile";
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

  if (profile.isPending) {
    return <Skeleton className="h-72 w-full rounded-2xl" />;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-8">
        <h2 className="font-display text-lg text-primary">{t.account.profileTitle}</h2>
        <form
          className="mt-6 max-w-md space-y-4"
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
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {t.account.saveChanges}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-border bg-card p-8">
        <h2 className="font-display text-lg text-primary">{t.account.changePasswordTitle}</h2>
        <form
          className="mt-6 max-w-md space-y-4"
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
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {t.auth.updatePassword}
          </button>
        </form>
      </div>
      <InputStyles />
    </div>
  );
}
