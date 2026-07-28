import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BadgeCheck,
  Check,
  CircleAlert,
  FileCheck2,
  LoaderCircle,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { translate, type MessageKey } from "@transferaround/i18n";
import { useLocale } from "@/i18n";
import { useProfile } from "@/queries/profile";
import {
  driverOnboardingQuery,
  saveDriverIdentity,
  saveDriverVehicle,
  saveOnboardingStep,
  submitDriverOnboarding,
  uploadDriverDocument,
  type DriverDocument,
  type DriverDocumentType,
} from "@/queries/onboarding";
import { VEHICLE_CLASSES } from "@/data/routes";
import { Field, InputStyles } from "@/components/form/field";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const CONSENT_VERSION = "driver-kyc-2026-07";
const documentDefinitions: Array<{
  type: DriverDocumentType;
  label: MessageKey;
}> = [
  { type: "driving_licence", label: "onboarding.document.drivingLicence" },
  { type: "identity", label: "onboarding.document.identity" },
  { type: "insurance", label: "onboarding.document.insurance" },
  { type: "vehicle_registration", label: "onboarding.document.registration" },
];

export function DriverOnboarding() {
  const locale = useLocale();
  const tr = (key: MessageKey) => translate(locale, key);
  const profile = useProfile();
  const queryClient = useQueryClient();
  const driverId = profile.data?.id ?? "";
  const onboarding = useQuery(driverOnboardingQuery(driverId));
  const [step, setStep] = useState(1);
  const [consent, setConsent] = useState(false);
  const [expiry, setExpiry] = useState<Partial<Record<DriverDocumentType, string>>>({});
  const [identity, setIdentity] = useState({ full_name: "", phone: "" });
  const [vehicle, setVehicle] = useState({
    vehicle_class: "comfort",
    vehicle_make_model: "",
    vehicle_plate: "",
  });

  useEffect(() => {
    if (!profile.data) return;
    setIdentity({
      full_name: profile.data.full_name ?? "",
      phone: profile.data.phone ?? "",
    });
    setVehicle({
      vehicle_class: profile.data.driver_profiles?.vehicle_class ?? "comfort",
      vehicle_make_model: profile.data.driver_profiles?.vehicle_make_model ?? "",
      vehicle_plate: profile.data.driver_profiles?.vehicle_plate ?? "",
    });
  }, [profile.data]);

  useEffect(() => {
    if (onboarding.data?.submission.current_step) {
      setStep(onboarding.data.submission.current_step);
    }
  }, [onboarding.data?.submission.current_step]);

  const documents = useMemo(() => onboarding.data?.documents ?? [], [onboarding.data?.documents]);
  const documentMap = useMemo(
    () => new Map(documents.map((document) => [document.document_type, document])),
    [documents],
  );
  const status = onboarding.data?.submission.status;
  const editable = status === "draft" || status === "needs_changes";

  const saveStep = useMutation({
    mutationFn: async () => {
      if (!profile.data) throw new Error("profile_missing");
      if (step === 1) {
        if (identity.full_name.trim().length < 2) throw new Error("identity_invalid");
        if (identity.phone.trim().length < 5) throw new Error("identity_invalid");
        await saveDriverIdentity(profile.data.id, {
          full_name: identity.full_name.trim(),
          phone: identity.phone.trim(),
          preferred_locale: locale,
        });
      }
      if (step === 2) {
        if (
          vehicle.vehicle_make_model.trim().length < 2 ||
          vehicle.vehicle_plate.trim().length < 2
        ) {
          throw new Error("vehicle_invalid");
        }
        await saveDriverVehicle(profile.data.id, {
          ...vehicle,
          vehicle_make_model: vehicle.vehicle_make_model.trim(),
          vehicle_plate: vehicle.vehicle_plate.trim(),
        });
      }
      const next = Math.min(5, step + 1);
      await saveOnboardingStep(profile.data.id, next);
      return next;
    },
    onSuccess: (next) => {
      setStep(next);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["driver-onboarding"] });
      toast.success(tr("onboarding.saved"));
    },
    onError: () => toast.error(tr("common.error")),
  });

  const upload = useMutation({
    mutationFn: ({
      type,
      file,
      current,
      expiresOn,
    }: {
      type: DriverDocumentType;
      file: File;
      current?: DriverDocument;
      expiresOn?: string;
    }) => uploadDriverDocument(driverId, type, file, current, expiresOn),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver-onboarding"] });
      toast.success(tr("onboarding.saved"));
    },
    onError: () => toast.error(tr("common.error")),
  });

  const submit = useMutation({
    mutationFn: () => submitDriverOnboarding(CONSENT_VERSION),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["driver-onboarding"] });
      toast.success(tr("onboarding.submitted"));
    },
    onError: () => toast.error(tr("common.error")),
  });

  if (profile.isPending || onboarding.isPending) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 px-6 py-14">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    );
  }

  if (onboarding.isError || !onboarding.data) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <CircleAlert className="mx-auto h-12 w-12 text-destructive" />
        <p className="mt-4 text-muted-foreground">{tr("common.error")}</p>
        <button
          type="button"
          className="mt-6 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold"
          onClick={() => onboarding.refetch()}
        >
          {tr("common.retry")}
        </button>
      </div>
    );
  }

  if (!editable) {
    const message: MessageKey =
      status === "approved"
        ? "onboarding.approved"
        : status === "rejected"
          ? "onboarding.rejected"
          : status === "suspended"
            ? "onboarding.suspended"
            : "onboarding.submitted";
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <BadgeCheck className="mx-auto h-14 w-14 text-accent" strokeWidth={1.5} />
        <h1 className="mt-5 text-3xl font-display text-primary">{tr("onboarding.title")}</h1>
        <p className="mt-3 text-muted-foreground">{tr(message)}</p>
        {onboarding.data.submission.reviewer_notes ? (
          <div className="mt-6 rounded-2xl border border-border bg-card p-5 text-left text-sm">
            {onboarding.data.submission.reviewer_notes}
          </div>
        ) : null}
      </div>
    );
  }

  const steps: Array<{ number: number; key: MessageKey }> = [
    { number: 1, key: "onboarding.step.identity" },
    { number: 2, key: "onboarding.step.vehicle" },
    { number: 3, key: "onboarding.step.documents" },
    { number: 4, key: "onboarding.step.consent" },
    { number: 5, key: "onboarding.step.review" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-deep">
          TransferAround
        </p>
        <h1 className="mt-3 text-4xl font-display text-primary">{tr("onboarding.title")}</h1>
        <p className="mt-3 text-muted-foreground">{tr("onboarding.subtitle")}</p>
      </div>

      {status === "needs_changes" ? (
        <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-950">
          <p className="font-semibold">{tr("onboarding.needsChanges")}</p>
          {onboarding.data.submission.reviewer_notes ? (
            <p className="mt-1">{onboarding.data.submission.reviewer_notes}</p>
          ) : null}
        </div>
      ) : null}

      <ol className="mt-8 grid grid-cols-5 gap-2" aria-label={tr("onboarding.title")}>
        {steps.map((item) => (
          <li key={item.number}>
            <button
              type="button"
              onClick={() => setStep(item.number)}
              className={cn(
                "w-full rounded-xl border px-2 py-3 text-center text-xs font-semibold transition",
                step === item.number
                  ? "border-accent bg-accent/10 text-primary"
                  : item.number < step
                    ? "border-accent/30 bg-card text-accent-deep"
                    : "border-border bg-card text-muted-foreground",
              )}
            >
              <span className="mx-auto mb-1 grid h-6 w-6 place-items-center rounded-full bg-background">
                {item.number < step ? <Check className="h-3.5 w-3.5" /> : item.number}
              </span>
              <span className="hidden sm:block">{tr(item.key)}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
        {step === 1 ? (
          <div className="space-y-5">
            <Field label={tr("profile.fullName")}>
              <input
                className="input"
                autoComplete="name"
                value={identity.full_name}
                onChange={(event) =>
                  setIdentity((current) => ({ ...current, full_name: event.target.value }))
                }
              />
            </Field>
            <Field label={tr("profile.phone")}>
              <input
                className="input"
                autoComplete="tel"
                value={identity.phone}
                onChange={(event) =>
                  setIdentity((current) => ({ ...current, phone: event.target.value }))
                }
              />
            </Field>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label={tr("onboarding.vehicleClass")}>
              <select
                className="input"
                value={vehicle.vehicle_class}
                onChange={(event) =>
                  setVehicle((current) => ({
                    ...current,
                    vehicle_class: event.target.value,
                  }))
                }
              >
                {VEHICLE_CLASSES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={tr("onboarding.vehicleModel")}>
              <input
                className="input"
                value={vehicle.vehicle_make_model}
                onChange={(event) =>
                  setVehicle((current) => ({
                    ...current,
                    vehicle_make_model: event.target.value,
                  }))
                }
              />
            </Field>
            <Field label={tr("onboarding.vehiclePlate")}>
              <input
                className="input"
                value={vehicle.vehicle_plate}
                onChange={(event) =>
                  setVehicle((current) => ({
                    ...current,
                    vehicle_plate: event.target.value,
                  }))
                }
              />
            </Field>
          </div>
        ) : null}

        {step === 3 ? (
          <div>
            <p className="text-sm text-muted-foreground">{tr("onboarding.documentsHelp")}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {documentDefinitions.map((definition) => {
                const current = documentMap.get(definition.type);
                return (
                  <div key={definition.type} className="rounded-2xl border border-border p-5">
                    <div className="flex items-start justify-between gap-3">
                      <FileCheck2
                        className={cn(
                          "h-6 w-6",
                          current ? "text-accent-deep" : "text-muted-foreground",
                        )}
                      />
                      {current ? (
                        <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold">
                          {current.status}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-4 font-semibold text-primary">{tr(definition.label)}</p>
                    {current ? (
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {current.original_filename}
                      </p>
                    ) : null}
                    <Field label={tr("onboarding.expiry")}>
                      <input
                        type="date"
                        className="input"
                        value={expiry[definition.type] ?? current?.expires_on ?? ""}
                        onChange={(event) =>
                          setExpiry((values) => ({
                            ...values,
                            [definition.type]: event.target.value,
                          }))
                        }
                      />
                    </Field>
                    <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border px-4 py-2 text-xs font-semibold hover:bg-muted">
                      {upload.isPending ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      {tr(current ? "onboarding.replace" : "onboarding.upload")}
                      <input
                        type="file"
                        className="sr-only"
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        disabled={upload.isPending}
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) {
                            upload.mutate({
                              type: definition.type,
                              file,
                              current,
                              expiresOn:
                                expiry[definition.type] ?? current?.expires_on ?? undefined,
                            });
                          }
                          event.currentTarget.value = "";
                        }}
                      />
                    </label>
                    {current?.rejection_reason ? (
                      <p className="mt-3 text-xs text-destructive">{current.rejection_reason}</p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {step === 4 ? (
          <label className="flex cursor-pointer gap-4 rounded-2xl border border-border bg-muted/30 p-5">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-[hsl(var(--accent))]"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
            />
            <span className="text-sm leading-6 text-foreground">{tr("onboarding.consent")}</span>
          </label>
        ) : null}

        {step === 5 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-accent-deep" />
              <div>
                <p className="font-semibold text-primary">{tr("onboarding.step.review")}</p>
                <p className="text-sm text-muted-foreground">
                  {documents.length}/4 {tr("onboarding.step.documents").toLowerCase()}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="w-full rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground disabled:opacity-50"
              disabled={!consent || documents.length !== 4 || submit.isPending}
              onClick={() => submit.mutate()}
            >
              {submit.isPending ? tr("common.loading") : tr("onboarding.submit")}
            </button>
          </div>
        ) : null}

        {step < 5 ? (
          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              type="button"
              className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold disabled:opacity-40"
              disabled={step === 1 || saveStep.isPending}
              onClick={() => setStep((current) => Math.max(1, current - 1))}
            >
              {tr("common.back")}
            </button>
            <button
              type="button"
              className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground disabled:opacity-50"
              disabled={saveStep.isPending || (step === 3 && documents.length !== 4)}
              onClick={() => saveStep.mutate()}
            >
              {saveStep.isPending ? tr("common.saving") : tr("common.continue")}
            </button>
          </div>
        ) : null}
      </div>
      <InputStyles />
    </div>
  );
}
