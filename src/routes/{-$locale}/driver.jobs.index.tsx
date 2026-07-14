import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { isToday, isAfter, endOfDay } from "date-fns";
import { ArrowRight, Inbox } from "lucide-react";
import { getDict, useLocale, useT } from "@/i18n";
import { useAuth } from "@/hooks/use-auth";
import { driverJobsQuery } from "@/queries/driver";
import type { Booking } from "@/queries/bookings";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRoute } from "@/data/routes";
import { formatEur } from "@/lib/pricing";

export const Route = createFileRoute("/{-$locale}/driver/jobs/")({
  component: DriverJobsPage,
});

function DriverJobsPage() {
  const { locale } = Route.useRouteContext();
  const t = getDict(locale);
  const { user } = useAuth();

  const jobs = useQuery({
    ...driverJobsQuery(user?.id ?? ""),
    enabled: !!user,
  });

  if (jobs.isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-28 w-full rounded-2xl" />
      </div>
    );
  }

  const all = jobs.data ?? [];
  const today = all
    .filter((b) => isToday(new Date(b.pickup_at)))
    .sort((a, b) => a.pickup_at.localeCompare(b.pickup_at));
  const upcoming = all
    .filter((b) => isAfter(new Date(b.pickup_at), endOfDay(new Date())))
    .sort((a, b) => a.pickup_at.localeCompare(b.pickup_at));
  const past = all.filter(
    (b) => !isToday(new Date(b.pickup_at)) && !isAfter(new Date(b.pickup_at), endOfDay(new Date())),
  );

  return (
    <Tabs defaultValue="today">
      <TabsList>
        <TabsTrigger value="today">
          {t.driver.today} ({today.length})
        </TabsTrigger>
        <TabsTrigger value="upcoming">
          {t.driver.upcoming} ({upcoming.length})
        </TabsTrigger>
        <TabsTrigger value="past">
          {t.driver.past} ({past.length})
        </TabsTrigger>
      </TabsList>
      {(
        [
          ["today", today],
          ["upcoming", upcoming],
          ["past", past],
        ] as const
      ).map(([key, list]) => (
        <TabsContent key={key} value={key} className="mt-6">
          <JobList jobs={list} />
        </TabsContent>
      ))}
    </Tabs>
  );
}

function JobList({ jobs }: { jobs: Booking[] }) {
  const t = useT();
  const locale = useLocale();
  const dateLocale = locale === "en" ? "en-GB" : locale;

  if (jobs.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center">
        <Inbox className="mx-auto h-10 w-10 text-muted-foreground" strokeWidth={1.5} />
        <p className="mt-4 text-sm text-muted-foreground">{t.driver.jobsEmpty}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((b) => {
        const route = getRoute(b.route_slug);
        return (
          <Link
            key={b.id}
            to="/{-$locale}/driver/jobs/$id"
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
                  {" · "}
                  {b.customer_name}
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
