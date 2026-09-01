import { useEffect, useMemo, useState, type ReactNode } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Inbox, Luggage, Radio, Users, Zap } from "lucide-react";
import { toast } from "sonner";
import { getDict, useLocale } from "@/i18n";
import {
  myJobOffersQuery,
  openJobsQuery,
  respondToOffer,
  setDriverOnline,
  type MyJobOffer,
  type OpenJob,
} from "@/queries/driver";
import { useProfile } from "@/queries/profile";
import { Skeleton } from "@/components/ui/skeleton";
import { DriverStatsBand } from "@/components/driver/driver-stats-band";
import { getRoute, VEHICLE_CLASSES } from "@/data/routes";
import { formatEur } from "@/lib/pricing";
import { supabase } from "@/integrations/supabase/client";
import {
  listAsapDispatchEvents,
  subscribeAsapDispatch,
  type AsapDispatchEvent,
} from "@/lib/asap-dispatch";

export const Route = createFileRoute("/{-$locale}/driver/")({
  component: OpenJobsPage,
});

function playAsapChime() {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.value = 0.04;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
    osc.stop(ctx.currentTime + 0.4);
  } catch {
    /* ignore */
  }
}

function OpenJobsPage() {
  const { locale } = Route.useRouteContext();
  const t = getDict(locale);
  const profile = useProfile();
  const queryClient = useQueryClient();
  const isOnline = profile.data?.driver_profiles?.is_online ?? false;
  const [asapEvents, setAsapEvents] = useState<AsapDispatchEvent[]>([]);

  const offers = useQuery({ ...myJobOffersQuery, enabled: isOnline });
  const jobs = useQuery({ ...openJobsQuery, enabled: isOnline });

  useEffect(() => {
    const userId = profile.data?.id;
    if (!userId) return;
    const channel = supabase
      .channel(`driver-offers-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "job_offers",
          filter: `driver_id=eq.${userId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["my-job-offers"] });
          queryClient.invalidateQueries({ queryKey: ["open-jobs"] });
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [profile.data?.id, queryClient]);

  useEffect(() => {
    if (!isOnline) {
      setAsapEvents([]);
      return;
    }
    let cancelled = false;
    void listAsapDispatchEvents()
      .then((rows) => {
        if (!cancelled) setAsapEvents(rows);
      })
      .catch(() => {
        /* migration may not be applied yet */
      });

    const unsub = subscribeAsapDispatch(
      (row) => {
        setAsapEvents((prev) => {
          if (prev.some((p) => p.booking_id === row.booking_id)) return prev;
          return [row, ...prev];
        });
        queryClient.invalidateQueries({ queryKey: ["open-jobs"] });
        toast.message(t.driver.asapNewToast);
        playAsapChime();
      },
      (bookingId) => {
        setAsapEvents((prev) => prev.filter((p) => p.booking_id !== bookingId));
        queryClient.invalidateQueries({ queryKey: ["open-jobs"] });
      },
    );
    return () => {
      cancelled = true;
      unsub();
    };
  }, [isOnline, queryClient, t.driver.asapNewToast]);

  const asapJobs = useMemo(() => {
    const fromPool = (jobs.data ?? []).filter((j) => j.urgency === "asap");
    const fromEvents = asapEvents.filter((e) => !fromPool.some((j) => j.id === e.booking_id));
    return { fromPool, fromEvents };
  }, [jobs.data, asapEvents]);

  const scheduledJobs = useMemo(
    () => (jobs.data ?? []).filter((j) => j.urgency !== "asap"),
    [jobs.data],
  );

  const toggle = useMutation({
    mutationFn: (online: boolean) => setDriverOnline(online),
    onSuccess: (row) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success(row.is_online ? t.driver.statusOnline : t.driver.statusOffline);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (profile.isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DriverStatsBand locale={locale} />
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
        <div>
          <p className="text-sm font-medium text-primary">
            {isOnline ? t.driver.statusOnline : t.driver.statusOffline}
          </p>
          <p className="text-xs text-muted-foreground">{t.driver.availabilityHint}</p>
        </div>
        <button
          type="button"
          onClick={() => toggle.mutate(!isOnline)}
          disabled={toggle.isPending}
          className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${
            isOnline
              ? "border border-border bg-background text-primary hover:bg-muted"
              : "bg-accent text-accent-foreground hover:opacity-90"
          }`}
        >
          {toggle.isPending
            ? t.driver.updatingAvailability
            : isOnline
              ? t.driver.goOffline
              : t.driver.goOnline}
        </button>
      </div>

      {!isOnline ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <Inbox className="mx-auto h-10 w-10 text-muted-foreground" strokeWidth={1.5} />
          <p className="mt-4 text-sm text-muted-foreground">{t.driver.goOnlineEmpty}</p>
        </div>
      ) : offers.isPending || jobs.isPending ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      ) : (
        <>
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-accent" />
              <h2 className="font-display text-lg text-primary">{t.driver.asapTitle}</h2>
            </div>
            {asapJobs.fromPool.length === 0 && asapJobs.fromEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t.driver.asapEmpty}</p>
            ) : (
              <>
                {asapJobs.fromPool.map((job) => (
                  <OpenJobCard key={job.id} job={job} asap />
                ))}
                {asapJobs.fromEvents.map((ev) => (
                  <AsapEventCard key={ev.booking_id} event={ev} />
                ))}
              </>
            )}
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg text-primary">{t.driver.offersTitle}</h2>
            {(offers.data ?? []).length === 0 ? (
              <p className="text-sm text-muted-foreground">{t.driver.offersEmpty}</p>
            ) : (
              (offers.data ?? []).map((offer) => (
                <OfferCard key={offer.offer_id ?? offer.id} offer={offer} />
              ))
            )}
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg text-primary">{t.driver.poolTitle}</h2>
            {scheduledJobs.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t.driver.poolEmpty}</p>
            ) : (
              scheduledJobs.map((job) => <OpenJobCard key={job.id} job={job} />)
            )}
          </section>
        </>
      )}
    </div>
  );
}

function useCountdown(expiresAt: string | null | undefined) {
  const [left, setLeft] = useState(0);
  useEffect(() => {
    if (!expiresAt) return;
    const tick = () => {
      setLeft(Math.max(0, Math.round((new Date(expiresAt).getTime() - Date.now()) / 1000)));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [expiresAt]);
  return left;
}

function OfferCard({ offer }: { offer: MyJobOffer }) {
  const locale = useLocale();
  const t = getDict(locale);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const seconds = useCountdown(offer.expires_at);

  const respond = useMutation({
    mutationFn: (accept: boolean) => respondToOffer(offer.offer_id!, accept),
    onSuccess: async (booking, accept) => {
      queryClient.invalidateQueries({ queryKey: ["my-job-offers"] });
      queryClient.invalidateQueries({ queryKey: ["open-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["driver-jobs"] });
      if (!accept) {
        toast.message(t.driver.offerDeclined);
        return;
      }
      toast.success(t.driver.claimedToast);
      if (booking?.id) {
        navigate({
          to: "/{-$locale}/driver/jobs/$id",
          params: { id: booking.id },
        });
      }
    },
    onError: (err: Error) => {
      if (/job_already_claimed|offer_expired|offer_not_pending/.test(err.message)) {
        toast.error(t.driver.jobTaken);
        queryClient.invalidateQueries({ queryKey: ["my-job-offers"] });
      } else if (/driver_offline/.test(err.message)) {
        toast.error(t.driver.mustBeOnline);
      } else {
        toast.error(err.message);
      }
    },
  });

  return (
    <JobSummaryCard
      routeSlug={offer.route_slug}
      pickupAt={offer.pickup_at}
      tripType={offer.trip_type}
      priceCents={offer.price_cents}
      vehicleClass={offer.vehicle_class}
      passengers={offer.passengers}
      bagsChecked={offer.bags_checked}
      bagsCabin={offer.bags_cabin}
      extras={offer.extras}
      pickupAddress={offer.pickup_address}
      dropoffAddress={offer.dropoff_address}
      footer={
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium text-muted-foreground">
            {t.driver.offerExpires.replace("{sec}", String(seconds))}
          </span>
          <button
            type="button"
            onClick={() => respond.mutate(true)}
            disabled={respond.isPending || seconds <= 0}
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {respond.isPending ? t.driver.accepting : t.driver.accept}
          </button>
          <button
            type="button"
            onClick={() => respond.mutate(false)}
            disabled={respond.isPending}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
          >
            {t.driver.decline}
          </button>
        </div>
      }
    />
  );
}

function OpenJobCard({ job, asap = false }: { job: OpenJob; asap?: boolean }) {
  const locale = useLocale();
  const t = getDict(locale);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const seconds = useCountdown(job.asap_expires_at);

  const claim = useMutation({
    mutationFn: async () => {
      const { claimJob } = await import("@/queries/driver");
      return claimJob(job.id!);
    },
    onSuccess: async (booking) => {
      queryClient.invalidateQueries({ queryKey: ["open-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["my-job-offers"] });
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
      } else if (/driver_offline/.test(err.message)) {
        toast.error(t.driver.mustBeOnline);
      } else if (/not_approved_driver/.test(err.message)) {
        toast.error(t.driver.notApproved);
      } else {
        toast.error(err.message);
      }
    },
  });

  return (
    <JobSummaryCard
      routeSlug={job.route_slug}
      pickupAt={job.pickup_at}
      tripType={job.trip_type}
      priceCents={job.price_cents}
      vehicleClass={job.vehicle_class}
      passengers={job.passengers}
      bagsChecked={job.bags_checked}
      bagsCabin={job.bags_cabin}
      extras={job.extras}
      pickupAddress={job.pickup_address}
      dropoffAddress={job.dropoff_address}
      highlight={asap}
      footer={
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {asap && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-accent/15 px-2 py-1 text-xs font-semibold text-accent-deep">
              <Radio className="h-3 w-3" />
              {t.driver.asapBadge}
              {job.asap_expires_at
                ? ` · ${t.driver.asapExpires.replace("{sec}", String(seconds))}`
                : ""}
            </span>
          )}
          {asap && job.eta_minutes != null && (
            <span className="text-xs text-muted-foreground">
              {t.driver.asapEtaHint.replace("{min}", String(job.eta_minutes))}
            </span>
          )}
          <button
            type="button"
            onClick={() => claim.mutate()}
            disabled={claim.isPending || (asap && seconds <= 0 && Boolean(job.asap_expires_at))}
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {claim.isPending ? t.driver.claiming : asap ? t.driver.asapAccept : t.driver.claim}
          </button>
        </div>
      }
    />
  );
}

function AsapEventCard({ event }: { event: AsapDispatchEvent }) {
  const locale = useLocale();
  const t = getDict(locale);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const seconds = useCountdown(event.expires_at);

  const claim = useMutation({
    mutationFn: async () => {
      const { claimJob } = await import("@/queries/driver");
      return claimJob(event.booking_id);
    },
    onSuccess: async (booking) => {
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
      } else if (/driver_offline/.test(err.message)) {
        toast.error(t.driver.mustBeOnline);
      } else {
        toast.error(err.message);
      }
    },
  });

  return (
    <JobSummaryCard
      routeSlug={event.route_slug}
      pickupAt={new Date().toISOString()}
      tripType="oneway"
      priceCents={event.price_cents}
      vehicleClass={event.vehicle_class}
      passengers={event.passengers}
      bagsChecked={0}
      bagsCabin={0}
      extras={{ eta_hint_minutes: event.eta_hint_minutes }}
      pickupAddress={event.pickup_address}
      dropoffAddress={event.dropoff_address}
      highlight
      footer={
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1 rounded-lg bg-accent/15 px-2 py-1 text-xs font-semibold text-accent-deep">
            <Radio className="h-3 w-3" />
            {t.driver.asapBadge} · {t.driver.asapExpires.replace("{sec}", String(seconds))}
          </span>
          {event.eta_hint_minutes != null && (
            <span className="text-xs text-muted-foreground">
              {t.driver.asapEtaHint.replace("{min}", String(event.eta_hint_minutes))}
            </span>
          )}
          <button
            type="button"
            onClick={() => claim.mutate()}
            disabled={claim.isPending || seconds <= 0}
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {claim.isPending ? t.driver.claiming : t.driver.asapAccept}
          </button>
        </div>
      }
    />
  );
}

function JobSummaryCard(props: {
  routeSlug: string | null | undefined;
  pickupAt: string | null | undefined;
  tripType: string | null | undefined;
  priceCents: number | null | undefined;
  vehicleClass: string | null | undefined;
  passengers: number | null | undefined;
  bagsChecked: number | null | undefined;
  bagsCabin: number | null | undefined;
  extras: unknown;
  pickupAddress?: string | null;
  dropoffAddress?: string | null;
  highlight?: boolean;
  footer: ReactNode;
}) {
  const locale = useLocale();
  const t = getDict(locale);
  const route = getRoute(props.routeSlug ?? "");
  const vehicle = VEHICLE_CLASSES.find((v) => v.id === props.vehicleClass);
  const dateLocale = locale === "en" ? "en-GB" : locale;
  const extras = (props.extras ?? {}) as Record<string, boolean>;
  const extrasLabels = [
    extras.childSeat && t.bookPage.childSeat,
    extras.extraStop && t.bookPage.extraStop,
    extras.meetAndGreet && t.bookPage.meetGreet,
  ].filter(Boolean) as string[];

  return (
    <div
      className={`rounded-2xl border bg-card p-6 ${
        props.highlight
          ? "border-accent/50 shadow-[0_0_0_1px_rgba(20,184,166,0.12)]"
          : "border-border"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="font-display text-lg text-primary">
            {route ? `${route.from} → ${route.to}` : props.routeSlug}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {props.pickupAt &&
              new Date(props.pickupAt).toLocaleString(dateLocale, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            {props.tripType === "return" && ` · ${t.widget.return}`}
          </div>
        </div>
        <span className="font-display text-xl text-primary">
          {formatEur((props.priceCents ?? 0) / 100)}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
        {vehicle && <span>{vehicle.label}</span>}
        <span className="inline-flex items-center gap-1">
          <Users className="h-4 w-4" />
          {props.passengers}
        </span>
        <span className="inline-flex items-center gap-1">
          <Luggage className="h-4 w-4" />
          {props.bagsChecked ?? 0}+{props.bagsCabin ?? 0}
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

      {(props.pickupAddress || props.dropoffAddress) && (
        <div className="mt-2 text-sm text-muted-foreground">
          {[props.pickupAddress, props.dropoffAddress].filter(Boolean).join(" → ")}
        </div>
      )}

      {props.footer}
    </div>
  );
}
