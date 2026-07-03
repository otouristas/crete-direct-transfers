import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { ROUTES, VEHICLE_CLASSES, type VehicleClass } from "@/data/routes";
import { quote, formatEur, type Extras } from "@/lib/pricing";
import { supabase } from "@/integrations/supabase/client";

const searchSchema = z.object({
  route: z.string().optional(),
  class: z.enum(["economy", "comfort", "minivan", "luxury"]).optional(),
  date: z.string().optional(),
  pax: z.coerce.number().optional(),
});

export const Route = createFileRoute("/book")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Book a Transfer | CreteTransfers" },
      {
        name: "description",
        content: "Book your fixed-price Crete transfer in three quick steps.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BookPage,
});

const detailsSchema = z.object({
  customer_name: z.string().trim().min(2, "Please enter your name").max(100),
  customer_email: z.string().trim().email("Please enter a valid email").max(255),
  customer_phone: z.string().trim().min(5, "Please enter your phone").max(30),
  flight_number: z.string().trim().max(20).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

function BookPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [routeSlug, setRouteSlug] = useState(search.route ?? ROUTES[0].slug);
  const [vehicleClass, setVehicleClass] = useState<VehicleClass>(search.class ?? "economy");
  const [pickupAt, setPickupAt] = useState(search.date ?? "");
  const [passengers, setPassengers] = useState(search.pax ?? 2);
  const [extras, setExtras] = useState<Extras>({});

  const [details, setDetails] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    flight_number: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const currentRoute = ROUTES.find((r) => r.slug === routeSlug)!;
  const q = useMemo(
    () =>
      quote({
        routeSlug,
        vehicleClass,
        pickupAt: pickupAt ? new Date(pickupAt) : undefined,
        extras,
      })!,
    [routeSlug, vehicleClass, pickupAt, extras],
  );

  const proceed = () => {
    if (!pickupAt) {
      setErrors({ pickupAt: "Please pick a date and time" });
      return;
    }
    setErrors({});
    setStep(2);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = detailsSchema.safeParse(details);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errs[issue.path.join(".")] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    setSubmitError(null);

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        route_slug: routeSlug,
        vehicle_class: vehicleClass,
        passengers,
        pickup_at: new Date(pickupAt).toISOString(),
        customer_name: parsed.data.customer_name,
        customer_email: parsed.data.customer_email,
        customer_phone: parsed.data.customer_phone,
        flight_number: parsed.data.flight_number || null,
        notes: parsed.data.notes || null,
        extras: extras as never,
        price_cents: q.totalEur * 100,
        currency: "EUR",
        status: "pending",
      })
      .select("id")
      .single();

    setSubmitting(false);
    if (error || !data) {
      setSubmitError(error?.message ?? "Something went wrong. Please try again.");
      return;
    }
    navigate({ to: "/book/success", search: { id: data.id } });
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-8 flex items-center gap-3 text-sm text-muted-foreground">
        <span className={step >= 1 ? "text-accent font-medium" : ""}>1. Quote</span>
        <span>·</span>
        <span className={step >= 2 ? "text-accent font-medium" : ""}>2. Your details</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl bg-card border border-border/60 p-8">
          {step === 1 ? (
            <>
              <h1 className="font-serif text-3xl text-primary">Get your fixed price</h1>
              <div className="mt-6 space-y-5">
                <Field label="Route">
                  <select
                    value={routeSlug}
                    onChange={(e) => setRouteSlug(e.target.value)}
                    className="input"
                  >
                    {ROUTES.map((r) => (
                      <option key={r.slug} value={r.slug}>
                        {r.from} → {r.to}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Vehicle class">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {VEHICLE_CLASSES.map((v) => (
                      <button
                        type="button"
                        key={v.id}
                        onClick={() => setVehicleClass(v.id)}
                        className={`rounded-lg border px-3 py-3 text-left transition ${
                          vehicleClass === v.id
                            ? "border-accent bg-accent/5"
                            : "border-border hover:border-accent/50"
                        }`}
                      >
                        <div className="font-serif text-primary">{v.label}</div>
                        <div className="text-xs text-muted-foreground mt-1">{v.capacity}</div>
                      </button>
                    ))}
                  </div>
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Pickup date & time" error={errors.pickupAt}>
                    <input
                      type="datetime-local"
                      value={pickupAt}
                      onChange={(e) => setPickupAt(e.target.value)}
                      className="input"
                    />
                  </Field>
                  <Field label="Passengers">
                    <input
                      type="number"
                      min={1}
                      max={8}
                      value={passengers}
                      onChange={(e) => setPassengers(Number(e.target.value))}
                      className="input"
                    />
                  </Field>
                </div>
                <Field label="Extras">
                  <div className="space-y-2 text-sm">
                    {[
                      ["childSeat", "Child seat (+€10)"],
                      ["extraStop", "Extra stop en route (+€15)"],
                      ["meetAndGreet", "Meet & greet with sign (+€10)"],
                    ].map(([key, label]) => (
                      <label key={key} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!extras[key as keyof Extras]}
                          onChange={(e) =>
                            setExtras({ ...extras, [key]: e.target.checked })
                          }
                          className="accent-accent"
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </Field>
              </div>
              <button
                onClick={proceed}
                className="mt-8 w-full rounded-full bg-accent px-5 py-3 text-accent-foreground hover:opacity-90"
              >
                Continue
              </button>
            </>
          ) : (
            <form onSubmit={submit}>
              <h1 className="font-serif text-3xl text-primary">Your details</h1>
              <div className="mt-6 space-y-4">
                <Field label="Full name" error={errors.customer_name}>
                  <input
                    className="input"
                    value={details.customer_name}
                    onChange={(e) => setDetails({ ...details, customer_name: e.target.value })}
                  />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Email" error={errors.customer_email}>
                    <input
                      type="email"
                      className="input"
                      value={details.customer_email}
                      onChange={(e) => setDetails({ ...details, customer_email: e.target.value })}
                    />
                  </Field>
                  <Field label="Phone (with country code)" error={errors.customer_phone}>
                    <input
                      className="input"
                      placeholder="+44 …"
                      value={details.customer_phone}
                      onChange={(e) => setDetails({ ...details, customer_phone: e.target.value })}
                    />
                  </Field>
                </div>
                <Field label="Flight / ferry number (optional)">
                  <input
                    className="input"
                    placeholder="e.g. BA632"
                    value={details.flight_number}
                    onChange={(e) => setDetails({ ...details, flight_number: e.target.value })}
                  />
                </Field>
                <Field label="Notes for the driver (optional)" error={errors.notes}>
                  <textarea
                    className="input min-h-24"
                    placeholder="Hotel entrance, child seat details, etc."
                    value={details.notes}
                    onChange={(e) => setDetails({ ...details, notes: e.target.value })}
                  />
                </Field>
              </div>
              {submitError && (
                <div className="mt-4 rounded-lg bg-destructive/10 text-destructive text-sm p-3">
                  {submitError}
                </div>
              )}
              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-full border border-border px-5 py-3 text-sm hover:bg-muted"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-full bg-accent px-5 py-3 text-accent-foreground hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? "Reserving…" : `Confirm reservation · ${formatEur(q.totalEur)}`}
                </button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                You'll receive email confirmation with your driver's name and WhatsApp the day before
                pickup. Pay on arrival — online payment coming soon.
              </p>
            </form>
          )}
        </div>

        <aside className="rounded-2xl bg-primary text-primary-foreground p-6 h-fit lg:sticky lg:top-24">
          <div className="text-xs uppercase tracking-widest text-accent">Your quote</div>
          <div className="mt-2 font-serif text-lg">{currentRoute.from}</div>
          <div className="text-primary-foreground/70 text-sm">→ {currentRoute.to}</div>
          <div className="mt-4 text-sm text-primary-foreground/70">
            {currentRoute.distanceKm} km · {currentRoute.durationMin} min
          </div>
          <div className="mt-6 space-y-2 text-sm border-t border-primary-foreground/20 pt-4">
            {q.breakdown.map((b, i) => (
              <div key={i} className="flex justify-between">
                <span className="text-primary-foreground/80">{b.label}</span>
                <span>{formatEur(b.amountEur)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-primary-foreground/20 flex items-baseline justify-between">
            <span className="text-xs uppercase tracking-widest text-primary-foreground/60">
              Total
            </span>
            <span className="font-serif text-3xl">{formatEur(q.totalEur)}</span>
          </div>
        </aside>
      </div>

      <style>{`
        .input {
          width: 100%;
          background: transparent;
          border: 1px solid oklch(0.88 0.01 85);
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 15px;
          outline: none;
        }
        .input:focus { border-color: oklch(0.58 0.14 42); }
      `}</style>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <div className="mt-1">{children}</div>
      {error && <div className="mt-1 text-xs text-destructive">{error}</div>}
    </div>
  );
}
