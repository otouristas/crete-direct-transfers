import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CarFront, Flag, Phone } from "lucide-react";
import { toast } from "sonner";
import { getDict } from "@/i18n";
import {
  bookingDriverQuery,
  bookingIncidentsQuery,
  bookingQuery,
  hoursUntilPickup,
  openIncident,
  previewCancelRefund,
  requestCancellation,
  type CancellationReason,
  type IncidentType,
} from "@/queries/bookings";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { TripTimeline } from "@/components/account/trip-timeline";
import { ReceiptButton } from "@/components/account/receipt-button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getRoute, VEHICLE_CLASSES, type VehicleClass } from "@/data/routes";
import { useMoney } from "@/hooks/use-currency";
import { lookupFlight } from "@/lib/flight-tracking";
import { CONTACT_PHONE, CONTACT_PHONE_HREF, CONTACT_WHATSAPP_HREF } from "@/lib/site";

export const Route = createFileRoute("/{-$locale}/account/bookings/$id")({
  component: BookingDetailPage,
});

const CANCELLABLE = new Set(["pending", "claimed"]);
const HAS_DRIVER = new Set(["claimed", "en_route", "completed"]);
const CAN_REPORT = new Set(["pending", "claimed", "en_route", "completed", "no_show"]);

const CANCEL_REASONS: CancellationReason[] = [
  "customer_plans_changed",
  "customer_booked_wrong",
  "flight_cancelled_airline",
  "other",
];

const INCIDENT_TYPES: Exclude<IncidentType, "unable_to_complete">[] = [
  "driver_no_show",
  "driver_late",
  "wrong_vehicle",
  "safety",
  "missed_each_other",
  "other",
];

function BookingDetailPage() {
  const money = useMoney();
  const { locale } = Route.useRouteContext();
  const t = getDict(locale);
  const { id } = Route.useParams();
  const queryClient = useQueryClient();

  const [cancelReason, setCancelReason] = useState<CancellationReason>("customer_plans_changed");
  const [cancelNote, setCancelNote] = useState("");
  const [preferCredit, setPreferCredit] = useState(true);
  const [incidentType, setIncidentType] =
    useState<Exclude<IncidentType, "unable_to_complete">>("driver_no_show");
  const [incidentNote, setIncidentNote] = useState("");

  const booking = useQuery(bookingQuery(id));
  const b = booking.data;
  const driver = useQuery({
    ...bookingDriverQuery(id),
    enabled: !!b && HAS_DRIVER.has(b.status),
  });
  const incidents = useQuery({
    ...bookingIncidentsQuery(id),
    enabled: !!b,
  });

  const cancel = useMutation({
    mutationFn: () =>
      requestCancellation({
        id,
        reason: cancelReason,
        note: cancelNote || undefined,
        preferCredit,
      }),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["booking", id] });
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      toast.success(t.account.cancelled);
    },
    onError: () => toast.error(t.account.cancelFailed),
  });

  const report = useMutation({
    mutationFn: () =>
      openIncident({
        bookingId: id,
        type: incidentType,
        note: incidentNote || undefined,
        claimedWaitUntil:
          incidentType === "driver_no_show" || incidentType === "driver_late"
            ? new Date().toISOString()
            : undefined,
      }),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["booking", id] });
      queryClient.invalidateQueries({ queryKey: ["booking-incidents", id] });
      setIncidentNote("");
      toast.success(t.account.incidentOpened);
    },
    onError: () => toast.error(t.account.incidentFailed),
  });

  if (booking.isPending) {
    return <Skeleton className="h-96 w-full rounded-2xl" />;
  }

  if (!b) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center">
        <p className="text-sm text-muted-foreground">{t.account.notFound}</p>
        <Link
          to="/{-$locale}/account"
          className="mt-6 inline-flex items-center gap-1.5 rounded-xl border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.account.backToBookings}
        </Link>
      </div>
    );
  }

  const route = getRoute(b.route_slug);
  const vehicle = VEHICLE_CLASSES.find((v) => v.id === b.vehicle_class);
  const dateLocale = locale === "en" ? "en-GB" : locale;
  const fmt = (iso: string) =>
    new Date(iso).toLocaleString(dateLocale, { dateStyle: "medium", timeStyle: "short" });
  const extras = (b.extras ?? {}) as Record<string, boolean>;
  const extrasLabels = [
    extras.childSeat && t.bookPage.childSeat,
    extras.extraStop && t.bookPage.extraStop,
    extras.meetAndGreet && t.bookPage.meetGreet,
  ].filter(Boolean) as string[];

  const hoursLeft = hoursUntilPickup(b.pickup_at);
  const canCancel = CANCELLABLE.has(b.status) && hoursLeft > 0;
  const preview = previewCancelRefund(b.pickup_at, cancelReason);
  const canReport = CAN_REPORT.has(b.status);

  return (
    <div className="space-y-6">
      <Link
        to="/{-$locale}/account"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-deep hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.account.backToBookings}
      </Link>

      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl text-primary">
              {route ? `${route.from} → ${route.to}` : b.route_slug}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t.account.bookingRef}: <span className="font-mono">{b.id.slice(0, 8)}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={b.status} />
            {b.refund_status !== "none" && b.refund_status !== "n_a" && (
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {t.account.refundStatus[b.refund_status as keyof typeof t.account.refundStatus] ??
                  b.refund_status}
              </span>
            )}
          </div>
        </div>

        <dl className="mt-6 grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2">
          <Item label={t.account.pickupTitle} value={fmt(b.pickup_at)} />
          {b.trip_type === "return" && b.return_at && (
            <Item label={t.account.returnTitle} value={fmt(b.return_at)} />
          )}
          {vehicle && <Item label={t.widget.vehicleClass} value={vehicle.label} />}
          <Item label={t.widget.passengers} value={String(b.passengers)} />
          <Item
            label={t.account.luggage}
            value={`${b.bags_checked} ${t.widget.checkedBags.toLowerCase()} · ${b.bags_cabin} ${t.widget.cabinBags.toLowerCase()}`}
          />
          {b.flight_number && <Item label={t.widget.flightNumber} value={b.flight_number} />}
          {b.flight_number && <FlightStatusRow flightNumber={b.flight_number} />}
          {b.return_flight_number && (
            <Item label={t.bookPage.returnFlightNumber} value={b.return_flight_number} />
          )}
          {b.pickup_address && <Item label={t.bookPage.pickupAddress} value={b.pickup_address} />}
          {b.dropoff_address && (
            <Item label={t.bookPage.dropoffAddress} value={b.dropoff_address} />
          )}
          {extrasLabels.length > 0 && (
            <Item label={t.bookPage.extrasTitle} value={extrasLabels.join(", ")} />
          )}
          {b.notes && <Item label={t.bookPage.notes} value={b.notes} />}
          {b.cancellation_reason && (
            <Item
              label={t.account.cancelReasonLabel}
              value={
                t.account.cancelReasons[
                  b.cancellation_reason as keyof typeof t.account.cancelReasons
                ] ?? b.cancellation_reason
              }
            />
          )}
        </dl>

        <div className="mt-6 flex items-baseline justify-between border-t border-border pt-4">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            {t.common.total}
          </span>
          <span className="font-display text-2xl text-primary">
            {money.format(b.price_cents / 100)}
          </span>
        </div>
        {money.isConverted && (
          <p className="mt-1 text-right text-xs text-muted-foreground">{t.account.chargedInEur}</p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          {b.payment_status === "paid" || b.payment_status === "deposit_paid"
            ? t.account.paidOnline
            : t.widget.payOnBoard}
        </p>
        <p className="mt-3 text-xs text-muted-foreground">{t.account.policyBlurb}</p>
      </div>

      <TripTimeline status={b.status} locale={locale} />


      {b.status === "pending" && !b.driver_id && (
        <div className="rounded-2xl border border-border bg-card p-8">
          <h3 className="flex items-center gap-2 font-display text-lg text-primary">
            <CarFront className="h-5 w-5 text-accent" />
            {t.account.findingDriverTitle}
          </h3>
          <p className="mt-3 text-sm text-muted-foreground">{t.account.findingDriverBody}</p>
        </div>
      )}

      {HAS_DRIVER.has(b.status) && (
        <div className="rounded-2xl border border-border bg-card p-8">
          <h3 className="flex items-center gap-2 font-display text-lg text-primary">
            <CarFront className="h-5 w-5 text-accent" />
            {t.account.driverTitle}
          </h3>
          {driver.data ? (
            <dl className="mt-4 grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2">
              {driver.data.full_name && (
                <Item label={t.bookPage.fullName} value={driver.data.full_name} />
              )}
              {driver.data.phone && (
                <div>
                  <dt className="text-xs uppercase tracking-widest text-muted-foreground">
                    {t.contact.phoneTitle}
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={`tel:${driver.data.phone.replace(/\s+/g, "")}`}
                      className="font-medium text-accent-deep hover:underline"
                    >
                      {driver.data.phone}
                    </a>
                  </dd>
                </div>
              )}
              {driver.data.vehicle_make_model && (
                <Item label={t.widget.vehicleClass} value={driver.data.vehicle_make_model} />
              )}
              {driver.data.vehicle_plate && (
                <Item label={t.account.plate} value={driver.data.vehicle_plate} />
              )}
            </dl>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">{t.account.driverPendingBody}</p>
          )}
        </div>
      )}

      {incidents.data && incidents.data.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-8">
          <h3 className="font-display text-lg text-primary">{t.account.incidentsTitle}</h3>
          <ul className="mt-4 space-y-3">
            {incidents.data.map((inc) => (
              <li key={inc.id} className="rounded-xl border border-border px-4 py-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">
                    {t.account.incidentTypes[inc.type as keyof typeof t.account.incidentTypes] ??
                      inc.type}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {t.account.incidentStatus[
                      inc.status as keyof typeof t.account.incidentStatus
                    ] ?? inc.status}
                  </span>
                </div>
                {inc.note && <p className="mt-1 text-muted-foreground">{inc.note}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {route && (
          <Link
            to="/{-$locale}/book"
            search={{
              route: b.route_slug,
              class: b.vehicle_class as VehicleClass,
              pax: b.passengers,
            }}
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
          >
            {t.account.bookAgain}
          </Link>
        )}

        <ReceiptButton
          locale={locale}
          brand="TransferAround"
          data={{
            reference: b.id.slice(0, 8),
            route: route ? `${route.from} → ${route.to}` : b.route_slug,
            pickupAt: fmt(b.pickup_at),
            passengers: b.passengers,
            vehicle: vehicle?.label ?? b.vehicle_class,
            total: money.format(b.price_cents / 100),
            paymentStatus:
              b.payment_status === "paid" || b.payment_status === "deposit_paid"
                ? t.account.paidOnline
                : t.widget.payOnBoard,
          }}
        />


        {canCancel && (
          <AlertDialog>
            <AlertDialogTrigger className="rounded-xl border border-destructive/40 px-5 py-2.5 text-sm font-medium text-destructive transition hover:bg-destructive/10">
              {t.account.cancelBooking}
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle>{t.account.cancelTitle}</AlertDialogTitle>
                <AlertDialogDescription>{t.account.cancelBody}</AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>{t.account.cancelReasonLabel}</Label>
                  <Select
                    value={cancelReason}
                    onValueChange={(v) => setCancelReason(v as CancellationReason)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CANCEL_REASONS.map((r) => (
                        <SelectItem key={r} value={r}>
                          {t.account.cancelReasons[r]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t.account.cancelNoteLabel}</Label>
                  <Textarea
                    value={cancelNote}
                    onChange={(e) => setCancelNote(e.target.value)}
                    placeholder={t.account.cancelNotePlaceholder}
                    rows={3}
                  />
                </div>
                {preview.refundPercent === 100 && b.payment_status !== "unpaid" && (
                  <label className="flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={preferCredit}
                      onChange={(e) => setPreferCredit(e.target.checked)}
                    />
                    <span>{t.account.preferCreditHint}</span>
                  </label>
                )}
                <p className="rounded-lg bg-muted px-3 py-2 text-sm text-foreground">
                  {preview.refundPercent === 100
                    ? t.account.cancelFeeFull
                    : t.account.cancelFeeHalf}
                  {preview.needsReview ? ` ${t.account.cancelNeedsReview}` : ""}
                </p>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>{t.account.cancelKeep}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => cancel.mutate()}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {t.account.cancelConfirm}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {canReport && (
          <AlertDialog>
            <AlertDialogTrigger className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-muted">
              <Flag className="h-4 w-4" />
              {t.account.reportProblem}
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle>{t.account.reportProblemTitle}</AlertDialogTitle>
                <AlertDialogDescription>{t.account.reportProblemBody}</AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>{t.account.incidentTypeLabel}</Label>
                  <Select
                    value={incidentType}
                    onValueChange={(v) =>
                      setIncidentType(v as Exclude<IncidentType, "unable_to_complete">)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INCIDENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {t.account.incidentTypes[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t.account.incidentNoteLabel}</Label>
                  <Textarea
                    value={incidentNote}
                    onChange={(e) => setIncidentNote(e.target.value)}
                    placeholder={t.account.incidentNotePlaceholder}
                    rows={3}
                  />
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>{t.account.cancelKeep}</AlertDialogCancel>
                <AlertDialogAction onClick={() => report.mutate()}>
                  {t.account.reportProblemConfirm}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {CONTACT_WHATSAPP_HREF && (
          <a
            href={CONTACT_WHATSAPP_HREF}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
          >
            {t.account.needHelpWhatsapp}
          </a>
        )}
        {CONTACT_PHONE && CONTACT_PHONE_HREF && (
          <a
            href={CONTACT_PHONE_HREF}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
          >
            <Phone className="h-4 w-4" />
            {CONTACT_PHONE}
          </a>
        )}
      </div>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-foreground">{value}</dd>
    </div>
  );
}

function FlightStatusRow({ flightNumber }: { flightNumber: string }) {
  const [label, setLabel] = useState("Checking flight…");
  useEffect(() => {
    let cancelled = false;
    void lookupFlight(flightNumber).then((f) => {
      if (cancelled) return;
      const eta = f.estimatedArrival ? new Date(f.estimatedArrival).toLocaleString() : "—";
      setLabel(
        f.source === "live"
          ? `${f.status} · ETA ${eta}`
          : `Tracking ready (${f.flightNumber}) — connect flight API for live ETA`,
      );
    });
    return () => {
      cancelled = true;
    };
  }, [flightNumber]);
  return <Item label="Flight status" value={label} />;
}
