import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { ROUTES, VEHICLE_CLASSES, type VehicleClass } from "@/data/routes";
import { quote, formatEur, bagCapacity, type Extras, type TripType } from "@/lib/pricing";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/queries/profile";
import { CounterInput } from "@/components/counter-input";
import { LocationPicker, type PickedLocation } from "@/components/location-picker";
import { getDict, type Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { Info, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  route: z.string().optional(),
  class: z.enum(["economy", "comfort", "minivan", "luxury"]).optional(),
  date: z.string().optional(),
  pax: z.coerce.number().optional(),
  trip: z.enum(["oneway", "return"]).optional(),
  returnDate: z.string().optional(),
  flight: z.string().optional(),
  bagsChecked: z.coerce.number().min(0).max(20).optional(),
  bagsCabin: z.coerce.number().min(0).max(20).optional(),
});

export const Route = createFileRoute("/{-$locale}/book")({
  validateSearch: searchSchema,
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/book",
      title: t.bookPage.metaTitle,
      description: t.bookPage.metaDescription,
      noindex: true,
    });
  },
  component: BookPage,
});

const detailsSchema = z.object({
  customer_name: z.string().trim().min(2, "Please enter your name").max(100),
  customer_email: z.string().trim().email("Please enter a valid email").max(255),
  customer_phone: z.string().trim().min(5, "Please enter your phone").max(30),
  flight_number: z.string().trim().max(20).optional().or(z.literal("")),
  return_flight_number: z.string().trim().max(20).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

function BookPage() {
  const search = Route.useSearch();
  const { locale } = Route.useRouteContext();
  const t = getDict(locale);
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [tripType, setTripType] = useState<TripType>(search.trip ?? "oneway");
  const [routeSlug, setRouteSlug] = useState(search.route ?? ROUTES[0].slug);
  const [vehicleClass, setVehicleClass] = useState<VehicleClass>(search.class ?? "economy");
  const [pickupAt, setPickupAt] = useState(search.date ?? "");
  const [returnAt, setReturnAt] = useState(search.returnDate ?? "");
  const [passengers, setPassengers] = useState(search.pax ?? 2);
  const [bagsChecked, setBagsChecked] = useState(search.bagsChecked ?? 2);
  const [bagsCabin, setBagsCabin] = useState(search.bagsCabin ?? 2);
  const [extras, setExtras] = useState<Extras>({});
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [pickupPoint, setPickupPoint] = useState<PickedLocation | null>(null);
  const [dropoffPoint, setDropoffPoint] = useState<PickedLocation | null>(null);
  const [openPicker, setOpenPicker] = useState<"pickup" | "dropoff" | null>(null);

  const [details, setDetails] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    flight_number: search.flight ?? "",
    return_flight_number: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { user } = useAuth();
  const profile = useProfile();

  // Prefill contact fields for signed-in customers — only fields still empty,
  // so nothing the visitor typed is ever overwritten.
  useEffect(() => {
    if (!user) return;
    setDetails((d) => ({
      ...d,
      customer_name: d.customer_name || profile.data?.full_name || "",
      customer_email: d.customer_email || user.email || "",
      customer_phone: d.customer_phone || profile.data?.phone || "",
    }));
  }, [user, profile.data]);

  const currentRoute = ROUTES.find((r) => r.slug === routeSlug)!;
  const q = useMemo(
    () =>
      quote({
        routeSlug,
        vehicleClass,
        tripType,
        pickupAt: pickupAt ? new Date(pickupAt) : undefined,
        returnAt: returnAt ? new Date(returnAt) : undefined,
        extras,
      })!,
    [routeSlug, vehicleClass, tripType, pickupAt, returnAt, extras],
  );

  const overCapacity = bagsChecked > bagCapacity(vehicleClass);

  const proceed = () => {
    const errs: Record<string, string> = {};
    if (!pickupAt) errs.pickupAt = "Please pick a date and time";
    if (tripType === "return" && !returnAt) errs.returnAt = "Please pick your return date and time";
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
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

    const base = {
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
      user_id: user?.id ?? null,
    };
    const v2 = {
      trip_type: tripType,
      return_at: tripType === "return" && returnAt ? new Date(returnAt).toISOString() : null,
      return_flight_number: parsed.data.return_flight_number || null,
      bags_checked: bagsChecked,
      bags_cabin: bagsCabin,
      pickup_address: pickupAddress.trim() || null,
      dropoff_address: dropoffAddress.trim() || null,
      pickup_point: pickupPoint ?? null,
      dropoff_point: dropoffPoint ?? null,
    };

    let { data, error } = await supabase
      .from("bookings")
      .insert({ ...base, ...v2 } as never)
      .select("id")
      .single();

    // Transition fallback: if the dispatch migration (user_id column) isn't
    // applied yet, keep the booking rather than losing it.
    if (error && user && /user_id/i.test(error.message)) {
      const { user_id: _omit, ...withoutUser } = { ...base, ...v2 };
      void _omit;
      ({ data, error } = await supabase
        .from("bookings")
        .insert(withoutUser as never)
        .select("id")
        .single());
    }

    setSubmitting(false);
    if (error || !data) {
      setSubmitError(error?.message ?? "Something went wrong. Please try again.");
      return;
    }
    navigate({ to: "/{-$locale}/book/success", search: { id: data.id } });
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <div className="mb-8 flex items-center gap-3 text-sm text-muted-foreground">
        <span className={step >= 1 ? "font-semibold text-accent-deep" : ""}>
          1. {t.bookPage.stepTrip}
        </span>
        <span>·</span>
        <span className={step >= 2 ? "font-semibold text-accent-deep" : ""}>
          2. {t.bookPage.stepDetails}
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="rounded-2xl border border-border bg-card p-8">
          {step === 1 ? (
            <>
              <h1 className="text-3xl font-display text-primary">{t.common.getPrice}</h1>
              <div className="mt-6 space-y-5">
                <div className="grid max-w-xs grid-cols-2 gap-1 rounded-xl bg-muted p-1">
                  {(["oneway", "return"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTripType(type)}
                      className={cn(
                        "rounded-lg py-2 text-sm font-semibold transition",
                        tripType === type
                          ? "bg-card text-primary shadow-sm"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {type === "oneway" ? t.widget.oneWay : t.widget.return}
                    </button>
                  ))}
                </div>

                <Field label={t.widget.route}>
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

                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    {
                      key: "pickup" as const,
                      label: t.bookPage.pickupAddress,
                      value: pickupAddress,
                      setValue: setPickupAddress,
                      point: pickupPoint,
                      setPoint: setPickupPoint,
                    },
                    {
                      key: "dropoff" as const,
                      label: t.bookPage.dropoffAddress,
                      value: dropoffAddress,
                      setValue: setDropoffAddress,
                      point: dropoffPoint,
                      setPoint: setDropoffPoint,
                    },
                  ].map((loc) => (
                    <Field key={loc.key} label={`${loc.label} (${t.common.optional})`}>
                      <input
                        className="input"
                        value={loc.value}
                        onChange={(e) => loc.setValue(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setOpenPicker(openPicker === loc.key ? null : loc.key)}
                        className={cn(
                          "mt-2 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition",
                          openPicker === loc.key || loc.point
                            ? "bg-accent/15 text-accent-deep"
                            : "bg-muted text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <MapPin className="h-3.5 w-3.5" />
                        {t.bookPage.pinOnMap}
                        {loc.point && " ✓"}
                      </button>
                    </Field>
                  ))}
                </div>
                {openPicker && (
                  <div>
                    <LocationPicker
                      key={openPicker}
                      value={openPicker === "pickup" ? pickupPoint : dropoffPoint}
                      onPick={(point, address) => {
                        if (openPicker === "pickup") {
                          setPickupPoint(point);
                          setPickupAddress(address);
                        } else {
                          setDropoffPoint(point);
                          setDropoffAddress(address);
                        }
                      }}
                    />
                    <p className="mt-2 text-xs text-muted-foreground">{t.bookPage.pinHint}</p>
                  </div>
                )}

                <Field label={t.widget.vehicleClass}>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                    {VEHICLE_CLASSES.map((v) => (
                      <button
                        type="button"
                        key={v.id}
                        onClick={() => setVehicleClass(v.id)}
                        className={cn(
                          "rounded-xl border px-3 py-3 text-left transition",
                          vehicleClass === v.id
                            ? "border-accent bg-accent/10"
                            : "border-border hover:border-accent/50",
                        )}
                      >
                        <div className="font-display text-primary">{v.label}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{v.capacity}</div>
                      </button>
                    ))}
                  </div>
                </Field>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label={t.widget.pickupDate} error={errors.pickupAt}>
                    <input
                      type="datetime-local"
                      value={pickupAt}
                      onChange={(e) => setPickupAt(e.target.value)}
                      className="input"
                    />
                  </Field>
                  {tripType === "return" && (
                    <Field label={t.widget.returnDate} error={errors.returnAt}>
                      <input
                        type="datetime-local"
                        value={returnAt}
                        min={pickupAt || undefined}
                        onChange={(e) => setReturnAt(e.target.value)}
                        className="input"
                      />
                    </Field>
                  )}
                </div>

                <div className="grid gap-2.5 md:grid-cols-3">
                  <CounterInput
                    label={t.widget.passengers}
                    value={passengers}
                    onChange={setPassengers}
                    min={1}
                    max={8}
                  />
                  <CounterInput
                    label={t.widget.checkedBags}
                    value={bagsChecked}
                    onChange={setBagsChecked}
                    max={8}
                  />
                  <CounterInput
                    label={t.widget.cabinBags}
                    value={bagsCabin}
                    onChange={setBagsCabin}
                    max={8}
                  />
                </div>
                {overCapacity && (
                  <p className="flex items-start gap-2 rounded-lg bg-highlight/10 px-3 py-2 text-xs text-foreground/80">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-highlight" />
                    {t.widget.minivanHint}
                  </p>
                )}

                <Field label={t.bookPage.extrasTitle}>
                  <div className="space-y-2 text-sm">
                    {(
                      [
                        ["childSeat", `${t.bookPage.childSeat} (+€10)`],
                        ["extraStop", `${t.bookPage.extraStop} (+€15)`],
                        ["meetAndGreet", `${t.bookPage.meetGreet} (+€10)`],
                      ] as const
                    ).map(([key, label]) => (
                      <label key={key} className="flex cursor-pointer items-center gap-3">
                        <input
                          type="checkbox"
                          checked={!!extras[key]}
                          onChange={(e) => setExtras({ ...extras, [key]: e.target.checked })}
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
                className="mt-8 w-full rounded-xl bg-accent px-5 py-3.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
              >
                {t.bookPage.continue}
              </button>
            </>
          ) : (
            <form onSubmit={submit}>
              <h1 className="text-3xl font-display text-primary">{t.bookPage.stepDetails}</h1>
              <div className="mt-6 space-y-4">
                <Field label={t.bookPage.fullName} error={errors.customer_name}>
                  <input
                    className="input"
                    value={details.customer_name}
                    onChange={(e) => setDetails({ ...details, customer_name: e.target.value })}
                  />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label={t.bookPage.emailLabel} error={errors.customer_email}>
                    <input
                      type="email"
                      className="input"
                      value={details.customer_email}
                      onChange={(e) => setDetails({ ...details, customer_email: e.target.value })}
                    />
                  </Field>
                  <Field label={t.bookPage.phoneLabel} error={errors.customer_phone}>
                    <input
                      className="input"
                      placeholder="+44 …"
                      value={details.customer_phone}
                      onChange={(e) => setDetails({ ...details, customer_phone: e.target.value })}
                    />
                  </Field>
                </div>
                <div className={cn("grid gap-4", tripType === "return" && "md:grid-cols-2")}>
                  <Field label={`${t.widget.flightNumber} (${t.common.optional})`}>
                    <input
                      className="input"
                      placeholder={t.widget.flightPlaceholder}
                      value={details.flight_number}
                      onChange={(e) => setDetails({ ...details, flight_number: e.target.value })}
                    />
                  </Field>
                  {tripType === "return" && (
                    <Field label={`${t.bookPage.returnFlightNumber} (${t.common.optional})`}>
                      <input
                        className="input"
                        placeholder={t.widget.flightPlaceholder}
                        value={details.return_flight_number}
                        onChange={(e) =>
                          setDetails({ ...details, return_flight_number: e.target.value })
                        }
                      />
                    </Field>
                  )}
                </div>
                <Field label={`${t.bookPage.notes} (${t.common.optional})`} error={errors.notes}>
                  <textarea
                    className="input min-h-24"
                    placeholder={t.bookPage.notesPlaceholder}
                    value={details.notes}
                    onChange={(e) => setDetails({ ...details, notes: e.target.value })}
                  />
                </Field>
              </div>
              {submitError && (
                <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {submitError}
                </div>
              )}
              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-xl border border-border px-5 py-3 text-sm font-medium hover:bg-muted"
                >
                  {t.bookPage.back}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
                >
                  {submitting
                    ? t.bookPage.submitting
                    : `${t.bookPage.confirm} · ${formatEur(q.totalEur)}`}
                </button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">{t.bookPage.payOnArrival}</p>
            </form>
          )}
        </div>

        <aside className="h-fit rounded-2xl bg-primary p-6 text-primary-foreground lg:sticky lg:top-24">
          <div className="text-xs uppercase tracking-widest text-accent">
            {t.bookPage.yourQuote}
          </div>
          <div className="mt-2 font-display text-lg">{currentRoute.from}</div>
          <div className="text-sm text-primary-foreground/70">→ {currentRoute.to}</div>
          <div className="mt-3 text-sm text-primary-foreground/70">
            {currentRoute.distanceKm} km · {currentRoute.durationMin} {t.common.minutes}
            {tripType === "return" && ` · ${t.widget.return}`}
          </div>
          <div className="mt-6 space-y-2 border-t border-primary-foreground/20 pt-4 text-sm">
            {q.breakdown.map((b, i) => (
              <div key={i} className="flex justify-between gap-3">
                <span className="text-primary-foreground/80">{b.label}</span>
                <span className={cn("tabular-nums", b.amountEur < 0 && "text-accent")}>
                  {formatEur(b.amountEur)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-baseline justify-between border-t border-primary-foreground/20 pt-4">
            <span className="text-xs uppercase tracking-widest text-primary-foreground/60">
              {t.common.total}
            </span>
            <span className="text-3xl font-display">{formatEur(q.totalEur)}</span>
          </div>
          <p className="mt-4 text-xs text-primary-foreground/60">{t.widget.guaranteed}</p>
        </aside>
      </div>

      <style>{`
        .input {
          width: 100%;
          min-height: 46px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 15px;
          line-height: 1.3;
          outline: none;
        }
        select.input {
          appearance: none;
          -webkit-appearance: none;
          padding-right: 36px;
        }
        .input:focus { border-color: var(--accent); }
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
      <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <div className="mt-1">{children}</div>
      {error && <div className="mt-1 text-xs text-destructive">{error}</div>}
    </div>
  );
}
