import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { ArrowRight, CarFront, MapPin, MessageCircle, Phone, Timer } from "lucide-react";
import { dateFnsLocale } from "@/lib/date-locale";
import { getDict, type Locale } from "@/i18n";
import { bookingDriverQuery, type Booking } from "@/queries/bookings";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { getRoute } from "@/data/routes";
import { useMoney } from "@/hooks/use-currency";

function countdownLabel(t: ReturnType<typeof getDict>, pickupAt: string): string {
  const ms = new Date(pickupAt).getTime() - Date.now();
  if (ms <= 0) return t.account.countdownNow;
  const minutes = Math.round(ms / 60000);
  if (minutes < 60) return t.account.countdownMinutes(minutes);
  const hours = Math.round(minutes / 60);
  if (hours < 36) return t.account.countdownHours(hours);
  return t.account.countdownDays(Math.round(hours / 24));
}

function routeLabel(b: Booking): string {
  const route = getRoute(b.route_slug);
  if (route) return `${route.from} → ${route.to}`;
  if (b.pickup_address && b.dropoff_address) return `${b.pickup_address} → ${b.dropoff_address}`;
  return b.pickup_address ?? b.route_slug;
}

export function NextTransferCard({ booking, locale }: { booking: Booking; locale: Locale }) {
  const t = getDict(locale);
  const money = useMoney();
  const driver = useQuery({
    ...bookingDriverQuery(booking.id),
    enabled: !!booking.driver_id,
  });

  const info = driver.data;
  const phone = info?.phone ?? null;
  const waPhone = phone?.replace(/[^\d]/g, "");

  return (
    <section className="mb-8 overflow-hidden rounded-3xl border border-border bg-primary text-primary-foreground shadow-lg">
      <div className="grid gap-6 p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:p-8">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-primary-foreground/70">
              {t.account.nextTransferTitle}
            </span>
            <StatusBadge status={booking.status} className="bg-background/15 text-inherit" />
          </div>

          <h2 className="mt-3 truncate font-display text-2xl md:text-3xl">
            {routeLabel(booking)}
          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-primary-foreground/80">
            <span className="inline-flex items-center gap-1.5">
              <Timer className="h-3.5 w-3.5 shrink-0" />
              {countdownLabel(t, booking.pickup_at)}
            </span>
            <span>
              {format(new Date(booking.pickup_at), "EEEE d MMMM · HH:mm", {
                locale: dateFnsLocale(locale),
              })}
            </span>
            <span className="font-medium text-primary-foreground">
              {money.format(booking.price_cents / 100)}
            </span>
          </div>

          {info ? (
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <CarFront className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">
                  {[info.full_name, info.vehicle_make_model].filter(Boolean).join(" · ")}
                </span>
              </span>
              {info.vehicle_plate && (
                <span className="rounded-md bg-background/15 px-2 py-0.5 font-mono text-xs tracking-widest">
                  {info.vehicle_plate}
                </span>
              )}
            </div>
          ) : (
            <p className="mt-5 max-w-xl text-sm text-primary-foreground/70">
              {t.account.driverPendingBody}
            </p>
          )}

          {booking.pickup_address && (
            <p className="mt-3 inline-flex max-w-xl items-start gap-1.5 text-sm text-primary-foreground/70">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{booking.pickup_address}</span>
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 md:flex-col md:items-stretch">
          {phone && (
            <>
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-background/15 px-4 py-2.5 text-sm font-medium transition hover:bg-background/25"
              >
                <Phone className="h-4 w-4" />
                {t.account.callDriver}
              </a>
              {waPhone && (
                <a
                  href={`https://wa.me/${waPhone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-background/15 px-4 py-2.5 text-sm font-medium transition hover:bg-background/25"
                >
                  <MessageCircle className="h-4 w-4" />
                  {t.account.messageDriver}
                </a>
              )}
            </>
          )}
          <Link
            to="/{-$locale}/account/bookings/$id"
            params={{ id: booking.id }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
          >
            {t.account.viewTransfer}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
