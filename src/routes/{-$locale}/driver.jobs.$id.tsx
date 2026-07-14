import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, MessageCircle, Navigation, Phone } from "lucide-react";
import { toast } from "sonner";
import { getDict } from "@/i18n";
import { bookingQuery } from "@/queries/bookings";
import { updateJobStatus } from "@/queries/driver";
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

export const Route = createFileRoute("/{-$locale}/driver/jobs/$id")({
  component: DriverJobDetailPage,
});

type Point = { lat: number; lng: number };

function mapsUrl(point: unknown, address: string | null): string | null {
  const p = point as Point | null;
  if (p && typeof p.lat === "number" && typeof p.lng === "number") {
    return `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;
  }
  if (address) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  }
  return null;
}

function DriverJobDetailPage() {
  const { locale } = Route.useRouteContext();
  const t = getDict(locale);
  const { id } = Route.useParams();
  const queryClient = useQueryClient();

  const booking = useQuery(bookingQuery(id));
  const b = booking.data;

  const move = useMutation({
    mutationFn: (status: "en_route" | "completed" | "no_show") => updateJobStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking", id] });
      queryClient.invalidateQueries({ queryKey: ["driver-jobs"] });
      toast.success(t.driver.statusUpdated);
    },
    onError: () => toast.error(t.driver.updateFailed),
  });

  if (booking.isPending) {
    return <Skeleton className="h-96 w-full rounded-2xl" />;
  }

  if (!b) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center">
        <p className="text-sm text-muted-foreground">{t.account.notFound}</p>
        <Link
          to="/{-$locale}/driver/jobs"
          className="mt-6 inline-flex items-center gap-1.5 rounded-xl border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.driver.backToJobs}
        </Link>
      </div>
    );
  }

  const route = getRoute(b.route_slug);
  const vehicle = VEHICLE_CLASSES.find((v) => v.id === b.vehicle_class);
  const dateLocale = locale === "en" ? "en-GB" : locale;
  const fmt = (iso: string) =>
    new Date(iso).toLocaleString(dateLocale, { dateStyle: "medium", timeStyle: "short" });
  const phoneDigits = b.customer_phone.replace(/[^\d+]/g, "");
  const waDigits = phoneDigits.replace(/\D/g, "");
  const pickupMaps = mapsUrl(b.pickup_point, b.pickup_address);
  const dropoffMaps = mapsUrl(b.dropoff_point, b.dropoff_address);
  const extras = (b.extras ?? {}) as Record<string, boolean>;
  const extrasLabels = [
    extras.childSeat && t.bookPage.childSeat,
    extras.extraStop && t.bookPage.extraStop,
    extras.meetAndGreet && t.bookPage.meetGreet,
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-6">
      <Link
        to="/{-$locale}/driver/jobs"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-deep hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.driver.backToJobs}
      </Link>

      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl text-primary">
              {route ? `${route.from} → ${route.to}` : b.route_slug}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{fmt(b.pickup_at)}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={b.status} />
            <span className="font-display text-xl text-primary">
              {formatEur(b.price_cents / 100)}
            </span>
          </div>
        </div>

        <dl className="mt-6 grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2">
          {vehicle && <Item label={t.widget.vehicleClass} value={vehicle.label} />}
          <Item label={t.widget.passengers} value={String(b.passengers)} />
          <Item
            label={t.account.luggage}
            value={`${b.bags_checked} ${t.widget.checkedBags.toLowerCase()} · ${b.bags_cabin} ${t.widget.cabinBags.toLowerCase()}`}
          />
          {b.flight_number && <Item label={t.widget.flightNumber} value={b.flight_number} />}
          {b.trip_type === "return" && b.return_at && (
            <Item label={t.account.returnTitle} value={fmt(b.return_at)} />
          )}
          {b.return_flight_number && (
            <Item label={t.bookPage.returnFlightNumber} value={b.return_flight_number} />
          )}
          {extrasLabels.length > 0 && (
            <Item label={t.bookPage.extrasTitle} value={extrasLabels.join(", ")} />
          )}
          {b.notes && <Item label={t.bookPage.notes} value={b.notes} />}
        </dl>
      </div>

      <div className="rounded-2xl border border-border bg-card p-8">
        <h3 className="font-display text-lg text-primary">{t.driver.customerTitle}</h3>
        <p className="mt-2 text-sm text-foreground">{b.customer_name}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={`tel:${phoneDigits}`}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
          >
            <Phone className="h-4 w-4" />
            {t.driver.callCustomer}
          </a>
          {waDigits && (
            <a
              href={`https://wa.me/${waDigits}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
            >
              <MessageCircle className="h-4 w-4" />
              {t.driver.whatsapp}
            </a>
          )}
        </div>
        {(pickupMaps || dropoffMaps) && (
          <div className="mt-3 flex flex-wrap gap-3">
            {pickupMaps && (
              <a
                href={pickupMaps}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
              >
                <Navigation className="h-4 w-4" />
                {t.driver.navigatePickup}
              </a>
            )}
            {dropoffMaps && (
              <a
                href={dropoffMaps}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
              >
                <Navigation className="h-4 w-4" />
                {t.driver.navigateDropoff}
              </a>
            )}
          </div>
        )}
        {(b.pickup_address || b.dropoff_address) && (
          <div className="mt-3 space-y-1 text-sm text-muted-foreground">
            {b.pickup_address && (
              <p>
                {t.bookPage.pickupAddress}: {b.pickup_address}
              </p>
            )}
            {b.dropoff_address && (
              <p>
                {t.bookPage.dropoffAddress}: {b.dropoff_address}
              </p>
            )}
          </div>
        )}
      </div>

      {(b.status === "claimed" || b.status === "en_route") && (
        <div className="rounded-2xl border border-border bg-card p-8">
          <h3 className="font-display text-lg text-primary">{t.driver.statusTitle}</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {b.status === "claimed" && (
              <button
                onClick={() => move.mutate("en_route")}
                disabled={move.isPending}
                className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                {t.driver.startTrip}
              </button>
            )}
            {b.status === "en_route" && (
              <>
                <ConfirmAction
                  trigger={t.driver.completeTrip}
                  title={t.driver.confirmComplete}
                  confirmLabel={t.driver.completeTrip}
                  cancelLabel={t.account.cancelKeep}
                  onConfirm={() => move.mutate("completed")}
                  accent
                />
                <ConfirmAction
                  trigger={t.driver.noShow}
                  title={t.driver.confirmNoShow}
                  confirmLabel={t.driver.noShow}
                  cancelLabel={t.account.cancelKeep}
                  onConfirm={() => move.mutate("no_show")}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ConfirmAction({
  trigger,
  title,
  confirmLabel,
  cancelLabel,
  onConfirm,
  accent,
}: {
  trigger: string;
  title: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  accent?: boolean;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={
          accent
            ? "rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
            : "rounded-xl border border-destructive/40 px-5 py-2.5 text-sm font-medium text-destructive transition hover:bg-destructive/10"
        }
      >
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{confirmLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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
