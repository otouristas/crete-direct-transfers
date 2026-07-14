import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Inbox, Luggage, Users } from "lucide-react";
import { toast } from "sonner";
import { getDict, useLocale } from "@/i18n";
import { claimJob, openJobsQuery, type OpenJob } from "@/queries/driver";
import { Skeleton } from "@/components/ui/skeleton";
import { getRoute, VEHICLE_CLASSES } from "@/data/routes";
import { formatEur } from "@/lib/pricing";

export const Route = createFileRoute("/{-$locale}/driver/")({
  component: OpenJobsPage,
});

function OpenJobsPage() {
  const { locale } = Route.useRouteContext();
  const t = getDict(locale);
  const jobs = useQuery(openJobsQuery);

  if (jobs.isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  const list = jobs.data ?? [];

  if (list.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center">
        <Inbox className="mx-auto h-10 w-10 text-muted-foreground" strokeWidth={1.5} />
        <p className="mt-4 text-sm text-muted-foreground">{t.driver.poolEmpty}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {list.map((job) => (
        <OpenJobCard key={job.id} job={job} />
      ))}
    </div>
  );
}

function OpenJobCard({ job }: { job: OpenJob }) {
  const locale = useLocale();
  const t = getDict(locale);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const claim = useMutation({
    mutationFn: () => claimJob(job.id!),
    onSuccess: (booking) => {
      queryClient.invalidateQueries({ queryKey: ["open-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["driver-jobs"] });
      toast.success(t.driver.claimedToast);
      navigate({
        to: "/{-$locale}/driver/jobs/$id",
        params: { id: booking.id },
      });
    },
    onError: (err: Error) => {
      if (/job_already_claimed/.test(err.message)) {
        toast.error(t.driver.jobTaken);
        queryClient.invalidateQueries({ queryKey: ["open-jobs"] });
      } else if (/not_approved_driver/.test(err.message)) {
        toast.error(t.driver.notApproved);
      } else {
        toast.error(err.message);
      }
    },
  });

  const route = getRoute(job.route_slug ?? "");
  const vehicle = VEHICLE_CLASSES.find((v) => v.id === job.vehicle_class);
  const dateLocale = locale === "en" ? "en-GB" : locale;
  const extras = (job.extras ?? {}) as Record<string, boolean>;
  const extrasLabels = [
    extras.childSeat && t.bookPage.childSeat,
    extras.extraStop && t.bookPage.extraStop,
    extras.meetAndGreet && t.bookPage.meetGreet,
  ].filter(Boolean) as string[];

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="font-display text-lg text-primary">
            {route ? `${route.from} → ${route.to}` : job.route_slug}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {job.pickup_at &&
              new Date(job.pickup_at).toLocaleString(dateLocale, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            {job.trip_type === "return" && ` · ${t.widget.return}`}
          </div>
        </div>
        <span className="font-display text-xl text-primary">
          {formatEur((job.price_cents ?? 0) / 100)}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
        {vehicle && <span>{vehicle.label}</span>}
        <span className="inline-flex items-center gap-1">
          <Users className="h-4 w-4" />
          {job.passengers}
        </span>
        <span className="inline-flex items-center gap-1">
          <Luggage className="h-4 w-4" />
          {job.bags_checked ?? 0}+{job.bags_cabin ?? 0}
        </span>
        {extrasLabels.map((label) => (
          <span
            key={label}
            className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent-deep"
          >
            {label}
          </span>
        ))}
      </div>

      {(job.pickup_address || job.dropoff_address) && (
        <div className="mt-2 text-sm text-muted-foreground">
          {[job.pickup_address, job.dropoff_address].filter(Boolean).join(" → ")}
        </div>
      )}

      <button
        onClick={() => claim.mutate()}
        disabled={claim.isPending}
        className="mt-4 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
      >
        {claim.isPending ? t.driver.claiming : t.driver.claim}
      </button>
    </div>
  );
}
