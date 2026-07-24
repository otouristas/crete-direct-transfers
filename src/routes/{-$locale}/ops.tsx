import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getDict } from "@/i18n";
import { useProfile } from "@/queries/profile";
import {
  openIncidentsQuery,
  opsPartnersQuery,
  pendingRefundsQuery,
  resolveIncidentAdmin,
  setPartnerStatusAdmin,
  unassignedBookingsQuery,
} from "@/queries/ops";
import { formatEur } from "@/lib/pricing";
import { Skeleton } from "@/components/ui/skeleton";
import { buildHead } from "@/lib/seo";
import type { Locale } from "@/i18n";
import { expireOffersAndEscalate } from "@/functions/dispatch";

export const Route = createFileRoute("/{-$locale}/ops")({
  head: ({ params }) => {
    const locale = (params.locale ?? "en") as Locale;
    return buildHead({
      locale,
      path: "/ops",
      title: "Ops · TransferAround",
      description: "Operations queue",
      noindex: true,
    });
  },
  component: OpsPage,
});

function OpsPage() {
  const { locale } = Route.useRouteContext();
  const t = getDict(locale);
  const profile = useProfile();
  const queryClient = useQueryClient();
  const isAdmin = profile.data?.role === "admin";
  const incidents = useQuery({ ...openIncidentsQuery, enabled: isAdmin });
  const refunds = useQuery({ ...pendingRefundsQuery, enabled: isAdmin });
  const unassigned = useQuery({ ...unassignedBookingsQuery, enabled: isAdmin });
  const partners = useQuery({ ...opsPartnersQuery, enabled: isAdmin });

  const resolve = useMutation({
    mutationFn: resolveIncidentAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ops-incidents"] });
      queryClient.invalidateQueries({ queryKey: ["ops-refunds"] });
      toast.success("Resolved");
    },
    onError: () => toast.error("Could not resolve — are you an admin?"),
  });

  const pausePartner = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "active" | "paused" }) =>
      setPartnerStatusAdmin(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ops-partners"] });
      toast.success("Partner updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const escalate = useMutation({
    mutationFn: () => expireOffersAndEscalate({ data: { locale } }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["ops-unassigned"] });
      toast.success(
        res && "escalate" in res ? `Escalated ${res.escalate ?? 0}` : "Expiry pass done",
      );
    },
  });

  if (profile.isPending) return <Skeleton className="h-64 w-full rounded-2xl" />;

  if (!profile.data || profile.data.role !== "admin") {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="font-display text-2xl text-primary">Ops</h1>
        <p className="mt-3 text-sm text-muted-foreground">Admin access required.</p>
        <Link to="/{-$locale}/account" className="mt-6 inline-block text-sm text-accent-deep underline">
          {t.account.backToBookings}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-6 py-12">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-primary">Operations</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Unassigned jobs, partners, incidents and refunds. DNS strikes auto-apply on confirmed
            driver no-shows.
          </p>
        </div>
        <button
          type="button"
          onClick={() => escalate.mutate()}
          disabled={escalate.isPending}
          className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
        >
          Run offer expiry / escalate
        </button>
      </div>

      <section>
        <h2 className="font-display text-xl text-primary">Unassigned bookings</h2>
        {unassigned.isPending ? (
          <Skeleton className="mt-4 h-32 w-full rounded-2xl" />
        ) : unassigned.data?.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No stuck unassigned bookings.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {unassigned.data?.map((b) => (
              <li
                key={b.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border px-4 py-3 text-sm"
              >
                <span>
                  {b.id.slice(0, 8)} · {b.market ?? "?"} · {b.dispatch_mode ?? "?"} ·{" "}
                  {b.customer_name} · {b.route_slug}
                </span>
                <span className="text-muted-foreground">
                  {formatEur(b.price_cents / 100)} ·{" "}
                  <Link
                    to="/{-$locale}/partner"
                    className="text-accent-deep underline"
                  >
                    Partner inbox
                  </Link>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-display text-xl text-primary">Partners</h2>
        {partners.isPending ? (
          <Skeleton className="mt-4 h-24 w-full rounded-2xl" />
        ) : (
          <ul className="mt-4 space-y-2">
            {partners.data?.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border px-4 py-3 text-sm"
              >
                <span>
                  {p.name} · {p.market} · {p.dispatch_mode ?? "default"} · {p.status}
                </span>
                <button
                  type="button"
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                  onClick={() =>
                    pausePartner.mutate({
                      id: p.id,
                      status: p.status === "active" ? "paused" : "active",
                    })
                  }
                >
                  {p.status === "active" ? "Pause" : "Activate"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-display text-xl text-primary">Open incidents</h2>
        {incidents.isPending ? (
          <Skeleton className="mt-4 h-40 w-full rounded-2xl" />
        ) : incidents.data?.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No open incidents.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {incidents.data?.map((inc) => (
              <li key={inc.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{inc.type}</p>
                    <p className="text-xs text-muted-foreground">
                      Booking {inc.booking_id.slice(0, 8)} · {inc.status}
                    </p>
                    {inc.note && <p className="mt-2 text-sm text-muted-foreground">{inc.note}</p>}
                    {inc.booking && (
                      <p className="mt-1 text-sm">
                        {inc.booking.customer_name} · {formatEur(inc.booking.price_cents / 100)}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        ["full_refund", "Full refund"],
                        ["credit", "Credit"],
                        ["partial_refund", "50%"],
                        ["rebook", "Rebook"],
                      ] as const
                    ).map(([resolution, label]) => (
                      <button
                        key={resolution}
                        type="button"
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                        onClick={() => resolve.mutate({ incidentId: inc.id, resolution })}
                      >
                        {label}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="rounded-lg border border-destructive/40 px-3 py-1.5 text-xs font-medium text-destructive"
                      onClick={() =>
                        resolve.mutate({
                          incidentId: inc.id,
                          resolution: "no_action",
                          reject: true,
                        })
                      }
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-display text-xl text-primary">Pending refunds</h2>
        {refunds.isPending ? (
          <Skeleton className="mt-4 h-32 w-full rounded-2xl" />
        ) : refunds.data?.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No pending refunds.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {refunds.data?.map((b) => (
              <li
                key={b.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border px-4 py-3 text-sm"
              >
                <span>
                  {b.id.slice(0, 8)} · {b.customer_email} · {b.refund_percent ?? "?"}%
                </span>
                <span className="text-muted-foreground">{formatEur(b.price_cents / 100)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
