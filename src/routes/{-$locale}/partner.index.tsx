import { useState, useEffect } from "react";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getDict } from "@/i18n";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/queries/profile";
import {
  assignJobToDriver,
  myPartnerMembershipsQuery,
  partnerDriversQuery,
  partnerInboxQuery,
} from "@/queries/partner";
import { notifyDriverAssigned } from "@/functions/dispatch";
import { startPartnerConnectOnboarding, syncConnectOnboarding } from "@/functions/stripe";
import { Skeleton } from "@/components/ui/skeleton";
import { formatEur } from "@/lib/pricing";
import { getRoute } from "@/data/routes";

export const Route = createFileRoute("/{-$locale}/partner/")({
  validateSearch: (s: Record<string, unknown>) => ({
    connect: typeof s.connect === "string" ? s.connect : undefined,
  }),
  component: PartnerInboxPage,
});

function PartnerInboxPage() {
  const { locale } = Route.useRouteContext();
  const search = useSearch({ from: "/{-$locale}/partner/" });
  const t = getDict(locale);
  const { user } = useAuth();
  const profile = useProfile();
  const queryClient = useQueryClient();

  const memberships = useQuery({
    ...myPartnerMembershipsQuery(user?.id ?? ""),
    enabled: !!user?.id,
  });

  const dispatcherPartner =
    (memberships.data ?? []).find((m) => m.role === "dispatcher")?.partner_id ??
    (profile.data?.role === "admin" ? (memberships.data ?? [])[0]?.partner_id : undefined);

  // Admins without membership: load first active partner via inbox disabled until we have id
  const partnerId = dispatcherPartner;

  const inbox = useQuery({
    ...partnerInboxQuery(partnerId ?? ""),
    enabled: !!partnerId,
  });
  const drivers = useQuery({
    ...partnerDriversQuery(partnerId ?? ""),
    enabled: !!partnerId,
  });

  const partnerMeta = useQuery({
    queryKey: ["partner-stripe", partnerId],
    enabled: !!partnerId,
    queryFn: async () => {
      const { data, error } = await (await import("@/integrations/supabase/client")).supabase
        .from("partners")
        .select("stripe_account_id, stripe_onboarding_complete, market, dispatch_email")
        .eq("id", partnerId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!partnerId || (search.connect !== "return" && search.connect !== "refresh")) return;
    void syncConnectOnboarding({ data: { kind: "partner", id: partnerId } })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["partner-stripe", partnerId] });
        if (search.connect === "return") toast.success(t.partner.connectSynced);
      })
      .catch(() => toast.error(t.partner.connectFailed));
  }, [search.connect, partnerId, queryClient, t.partner.connectFailed, t.partner.connectSynced]);

  const connect = useMutation({
    mutationFn: async () => {
      if (!partnerId) throw new Error("no partner");
      const res = await startPartnerConnectOnboarding({
        data: {
          partnerId,
          email: partnerMeta.data?.dispatch_email,
          market: partnerMeta.data?.market,
          locale,
        },
      });
      if (res.skipped || !res.url) throw new Error("Stripe not configured");
      window.location.href = res.url;
    },
    onError: () => toast.error(t.partner.connectFailed),
  });

  const [selected, setSelected] = useState<Record<string, string>>({});

  const assign = useMutation({
    mutationFn: ({ bookingId, driverId }: { bookingId: string; driverId: string }) =>
      assignJobToDriver(bookingId, driverId),
    onSuccess: async (booking) => {
      queryClient.invalidateQueries({ queryKey: ["partner-inbox"] });
      toast.success(t.partner.assignedToast);
      try {
        await notifyDriverAssigned({ data: { bookingId: booking.id, locale } });
      } catch {
        /* best-effort */
      }
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (memberships.isPending) return <Skeleton className="h-64 w-full rounded-2xl" />;

  if (!partnerId) {
    return <p className="text-sm text-muted-foreground">{t.partner.noAccess}</p>;
  }

  if (inbox.isPending) return <Skeleton className="h-64 w-full rounded-2xl" />;

  const list = inbox.data ?? [];
  const driverList = drivers.data ?? [];
  const onboarded = Boolean(partnerMeta.data?.stripe_onboarding_complete);

  return (
    <div className="space-y-4">
      {!onboarded ? (
        <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6">
          <h3 className="font-display text-lg text-primary">{t.partner.connectTitle}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{t.partner.connectBody}</p>
          <button
            type="button"
            disabled={connect.isPending}
            onClick={() => connect.mutate()}
            className="mt-4 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {connect.isPending ? t.partner.connectBusy : t.partner.connectCta}
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card px-6 py-3 text-sm text-muted-foreground">
          {t.partner.connectReady}
        </div>
      )}

      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t.partner.inboxEmpty}</p>
      ) : null}
      {list.map((b) => {
        const route = getRoute(b.route_slug);
        const label = route
          ? `${route.from} → ${route.to}`
          : [b.pickup_address, b.dropoff_address].filter(Boolean).join(" → ") || b.route_slug;
        const driverId = selected[b.id] ?? "";
        return (
          <div key={b.id} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-display text-lg text-primary">{label}</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {new Date(b.pickup_at).toLocaleString(locale === "en" ? "en-GB" : locale, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                  {" · "}
                  {b.customer_name}
                </div>
              </div>
              <span className="font-display text-xl text-primary">
                {formatEur(b.price_cents / 100)}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-end gap-3">
              <label className="block text-sm">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  {t.partner.pickDriver}
                </span>
                <select
                  className="mt-1 block w-64 rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  value={driverId}
                  onChange={(e) => setSelected((s) => ({ ...s, [b.id]: e.target.value }))}
                >
                  <option value="">—</option>
                  {driverList.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.full_name ?? d.id.slice(0, 8)}
                      {d.is_online
                        ? ` · ${t.partner.onlineDriver}`
                        : ` · ${t.partner.offlineDriver}`}
                      {d.vehicle_class ? ` · ${d.vehicle_class}` : ""}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                disabled={!driverId || assign.isPending}
                onClick={() => assign.mutate({ bookingId: b.id, driverId })}
                className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                {assign.isPending ? t.partner.assigning : t.partner.assign}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
