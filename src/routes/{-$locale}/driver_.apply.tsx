import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { MailCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { VEHICLE_CLASSES } from "@/data/routes";
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

const schema = z.object({
  full_name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().min(5, "Please enter your phone").max(30),
  password: z.string().min(8, "At least 8 characters").max(72),
  vehicle_class: z.enum(["economy", "comfort", "minivan", "luxury"]),
  vehicle_make_model: z.string().trim().min(2, "Please enter your vehicle").max(100),
  vehicle_plate: z.string().trim().min(2, "Please enter your plate").max(20),
  license_number: z.string().trim().min(2, "Please enter your driving licence number").max(50),
  insurance_number: z.string().trim().min(2, "Please enter your insurance policy number").max(50),
  id_document_number: z
    .string()
    .trim()
    .min(2, "Please enter your ID / passport / EOT number")
    .max(50),
  vehicle_registration_number: z
    .string()
    .trim()
    .min(2, "Please enter your vehicle registration number")
    .max(50),
});

function DriverApplyPage() {
  const { locale } = Route.useRouteContext();
  const t = getDict(locale);

  const [values, setValues] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    vehicle_class: "comfort",
    vehicle_make_model: "",
    vehicle_plate: "",
    license_number: "",
    insurance_number: "",
    id_document_number: "",
    vehicle_registration_number: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues({ ...values, [key]: e.target.value });

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
    // The DB trigger reads signup_role + vehicle metadata and creates the
    // profile + pending driver_profiles rows — works before email confirmation.
    const { error: err } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: {
          signup_role: "driver",
          full_name: parsed.data.full_name,
          phone: parsed.data.phone,
          vehicle_class: parsed.data.vehicle_class,
          vehicle_make_model: parsed.data.vehicle_make_model,
          vehicle_plate: parsed.data.vehicle_plate,
          license_number: parsed.data.license_number,
          insurance_number: parsed.data.insurance_number,
          id_document_number: parsed.data.id_document_number,
          vehicle_registration_number: parsed.data.vehicle_registration_number,
        },
        emailRedirectTo: `${window.location.origin}${localePath(locale, "/driver")}`,
      },
    });
    setSubmitting(false);
    if (err) {
      setError(/already registered/i.test(err.message) ? t.auth.alreadyRegistered : err.message);
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="mx-auto max-w-md px-6 py-16">
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <MailCheck className="mx-auto h-12 w-12 text-accent" strokeWidth={1.5} />
          <h1 className="mt-4 text-2xl font-display text-primary">{t.driver.applySuccessTitle}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t.driver.applySuccessBody}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <div className="rounded-2xl border border-border bg-card p-8">
        <h1 className="text-3xl font-display text-primary">{t.driver.applyTitle}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t.driver.applySubtitle}</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Field label={t.bookPage.fullName} error={errors.full_name}>
            <input
              className="input"
              autoComplete="name"
              value={values.full_name}
              onChange={set("full_name")}
            />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label={t.auth.email} error={errors.email}>
              <input
                type="email"
                className="input"
                autoComplete="email"
                value={values.email}
                onChange={set("email")}
              />
            </Field>
            <Field label={t.bookPage.phoneLabel} error={errors.phone}>
              <input
                className="input"
                autoComplete="tel"
                placeholder="+30 …"
                value={values.phone}
                onChange={set("phone")}
              />
            </Field>
          </div>
          <Field label={t.auth.password} error={errors.password}>
            <input
              type="password"
              className="input"
              autoComplete="new-password"
              value={values.password}
              onChange={set("password")}
            />
          </Field>
          <Field label={t.driver.vehicleClass} error={errors.vehicle_class}>
            <select
              className="input"
              value={values.vehicle_class}
              onChange={(e) => setValues({ ...values, vehicle_class: e.target.value })}
            >
              {VEHICLE_CLASSES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label} — {v.capacity}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label={t.driver.vehicleMakeModel} error={errors.vehicle_make_model}>
              <input
                className="input"
                placeholder="Mercedes E-Class"
                value={values.vehicle_make_model}
                onChange={set("vehicle_make_model")}
              />
            </Field>
            <Field label={t.driver.vehiclePlate} error={errors.vehicle_plate}>
              <input
                className="input"
                placeholder="HKA-1234"
                value={values.vehicle_plate}
                onChange={set("vehicle_plate")}
              />
            </Field>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label={t.driver.licenseNumber} error={errors.license_number}>
              <input
                className="input"
                value={values.license_number}
                onChange={set("license_number")}
              />
            </Field>
            <Field label={t.driver.insuranceNumber} error={errors.insurance_number}>
              <input
                className="input"
                value={values.insurance_number}
                onChange={set("insurance_number")}
              />
            </Field>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label={t.driver.idDocumentNumber} error={errors.id_document_number}>
              <input
                className="input"
                value={values.id_document_number}
                onChange={set("id_document_number")}
              />
            </Field>
            <Field
              label={t.driver.vehicleRegistrationNumber}
              error={errors.vehicle_registration_number}
            >
              <input
                className="input"
                value={values.vehicle_registration_number}
                onChange={set("vehicle_registration_number")}
              />
            </Field>
          </div>
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? t.auth.sending : t.driver.submitApplication}
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
