import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarX2 } from "lucide-react";
import { getDict, useLocale, useT } from "@/i18n";
import { useAuth } from "@/hooks/use-auth";
import { myBookingsQuery, type Booking } from "@/queries/bookings";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRoute } from "@/data/routes";
import { formatEur } from "@/lib/pricing";

export const Route = createFileRoute("/{-$locale}/account/")({
  component: MyBookingsPage,
});

const TERMINAL = new Set(["completed", "cancelled", "no_show"]);

function MyBookingsPage() {
  const { locale } = Route.useRouteContext();
  const t = getDict(locale);
  const { user } = useAuth();

  const bookings = useQuery({
    ...myBookingsQuery(user?.id ?? "", user?.email ?? ""),
    enabled: !!user,
  });

  if (bookings.isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-28 w-full rounded-2xl" />
      </div>
    );
  }

  const all = bookings.data ?? [];
  const now = Date.now();
  const upcoming = all
    .filter((b) => new Date(b.pickup_at).getTime() >= now && !TERMINAL.has(b.status))
    .sort((a, b) => a.pickup_at.localeCompare(b.pickup_at));
  const past = all.filter((b) => new Date(b.pickup_at).getTime() < now || TERMINAL.has(b.status));

  return (
    <Tabs defaultValue="upcoming">
      <TabsList>
        <TabsTrigger value="upcoming">
          {t.account.upcoming} ({upcoming.length})
        </TabsTrigger>
        <TabsTrigger value="past">
          {t.account.past} ({past.length})
        </TabsTrigger>
      </TabsList>
      <TabsContent value="upcoming" className="mt-6">
        <BookingList bookings={upcoming} emptyText={t.account.emptyUpcoming} />
      </TabsContent>
      <TabsContent value="past" className="mt-6">
        <BookingList bookings={past} emptyText={t.account.emptyPast} />
      </TabsContent>
    </Tabs>
  );
}

function BookingList({ bookings, emptyText }: { bookings: Booking[]; emptyText: string }) {
  const t = useT();
  const locale = useLocale();
  if (bookings.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center">
        <CalendarX2 className="mx-auto h-10 w-10 text-muted-foreground" strokeWidth={1.5} />
        <p className="mt-4 text-sm text-muted-foreground">{emptyText}</p>
        <Link
          to="/{-$locale}/book"
          className="mt-6 inline-flex rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
        >
          {t.common.bookTransfer}
        </Link>
      </div>
    );
  }

  const dateLocale = locale === "en" ? "en-GB" : locale;

  return (
    <div className="space-y-4">
      {bookings.map((b) => {
        const route = getRoute(b.route_slug);
        return (
          <Link
            key={b.id}
            to="/{-$locale}/account/bookings/$id"
            params={{ id: b.id }}
            className="block rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-display text-lg text-primary">
                  {route ? `${route.from} → ${route.to}` : b.route_slug}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {new Date(b.pickup_at).toLocaleString(dateLocale, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                  {b.trip_type === "return" && ` · ${t.widget.return}`}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={b.status} />
                <span className="font-display text-lg text-primary">
                  {formatEur(b.price_cents / 100)}
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-sm font-medium text-accent-deep">
              {t.account.viewDetails}
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
