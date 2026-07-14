import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, CarFront, Phone } from "lucide-react";
import { toast } from "sonner";
import { getDict } from "@/i18n";
import { bookingDriverQuery, bookingQuery, cancelBooking } from "@/queries/bookings";
import { StatusBadge } from "@/components/dashboard/status-badge";
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
import { getRoute, VEHICLE_CLASSES } from "@/data/routes";
import { formatEur } from "@/lib/pricing";
import { CONTACT_PHONE, CONTACT_PHONE_HREF } from "@/lib/site";

export const Route = createFileRoute("/{-$locale}/account/bookings/$id")({
  component: BookingDetailPage,
});

const CANCELLABLE = new Set(["pending", "claimed"]);
const HAS_DRIVER = new Set(["claimed", "en_route", "completed"]);

function BookingDetailPage() {
  const { locale } = Route.useRouteContext();
  const t = getDict(locale);
  const { id } = Route.useParams();
  const queryClient = useQueryClient();

  const booking = useQuery(bookingQuery(id));
  const b = booking.data;
  const driver = useQuery({
    ...bookingDriverQuery(id),
    enabled: !!b && HAS_DRIVER.has(b.status),
  });

  const cancel = useMutation({
    mutationFn: () => cancelBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking", id] });
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      toast.success(t.account.cancelled);
    },
    onError: () => toast.error(t.account.cancelFailed),
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
  const canCancel =
    CANCELLABLE.has(b.status) && new Date(b.pickup_at).getTime() > Date.now() + 24 * 60 * 60 * 1000;

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
          <StatusBadge status={b.status} />
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
        </dl>

        <div className="mt-6 flex items-baseline justify-between border-t border-border pt-4">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            {t.common.total}
          </span>
          <span className="font-display text-2xl text-primary">
            {formatEur(b.price_cents / 100)}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{t.widget.payOnBoard}</p>
      </div>

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

      <div className="flex flex-wrap items-center gap-3">
        {route && (
          <Link
            to="/{-$locale}/book"
            search={{
              route: b.route_slug,
              class: b.vehicle_class as "economy" | "comfort" | "minivan" | "luxury",
              pax: b.passengers,
            }}
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
          >
            {t.account.bookAgain}
          </Link>
        )}
        {canCancel ? (
          <AlertDialog>
            <AlertDialogTrigger className="rounded-xl border border-destructive/40 px-5 py-2.5 text-sm font-medium text-destructive transition hover:bg-destructive/10">
              {t.account.cancelBooking}
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t.account.cancelTitle}</AlertDialogTitle>
                <AlertDialogDescription>{t.account.cancelBody}</AlertDialogDescription>
              </AlertDialogHeader>
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
        ) : (
          CANCELLABLE.has(b.status) && (
            <a
              href={CONTACT_PHONE_HREF}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
            >
              <Phone className="h-4 w-4" />
              {t.account.tooLateToCancel(CONTACT_PHONE)}
            </a>
          )
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
