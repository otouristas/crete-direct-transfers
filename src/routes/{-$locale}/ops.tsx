import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getDict } from "@/i18n";
import { useProfile } from "@/queries/profile";
import {
  openIncidentsQuery,
  getDriverDocumentReviewUrl,
  opsDriverOnboardingQuery,
  opsPartnersQuery,
  pendingRefundsQuery,
  reviewDriverDocumentAdmin,
  reviewDriverOnboardingAdmin,
  resolveIncidentAdmin,
  setPartnerStatusAdmin,
  unassignedBookingsQuery,
} from "@/queries/ops";
import { DriverAccountsPanel } from "@/components/ops/driver-accounts-panel";
import { formatEur } from "@/lib/pricing";
import { Skeleton } from "@/components/ui/skeleton";
import { buildHead } from "@/lib/seo";
import type { Locale } from "@/i18n";

export const Route = createFileRoute("/{-$locale}/ops")({
  head: ({ params }) => {
    const locale = (params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/ops",
      title: t.ops.metaTitle,
      description: t.ops.metaDescription,
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
  const onboarding = useQuery({ ...opsDriverOnboardingQuery, enabled: isAdmin });

  const resolve = useMutation({
    mutationFn: resolveIncidentAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ops-incidents"] });
      queryClient.invalidateQueries({ queryKey: ["ops-refunds"] });
      toast.success(t.ops.resolved);
    },
    onError: () => toast.error(t.ops.resolveFailed),
  });

  const pausePartner = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "active" | "paused" }) =>
      setPartnerStatusAdmin(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ops-partners"] });
      toast.success(t.ops.partnerUpdated);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const reviewDocument = useMutation({
    mutationFn: reviewDriverDocumentAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ops-driver-onboarding"] });
      toast.success(t.ops.documentUpdated);
    },
    onError: () => toast.error(t.ops.documentReviewFailed),
  });

  const reviewOnboarding = useMutation({
    mutationFn: reviewDriverOnboardingAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ops-driver-onboarding"] });
      toast.success(t.ops.applicationUpdated);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (profile.isPending) return <Skeleton className="h-64 w-full rounded-2xl" />;

  if (!profile.data || profile.data.role !== "admin") {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="font-display text-2xl text-primary">{t.ops.shortTitle}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{t.ops.adminRequired}</p>
        <Link
          to="/{-$locale}/account"
          className="mt-6 inline-block text-sm text-accent-deep underline"
        >
          {t.account.backToBookings}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-6 py-12">
      <div>
        <h1 className="font-display text-3xl text-primary">{t.ops.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t.ops.description}</p>
      </div>

      <DriverAccountsPanel locale={locale} />

      <section>
        <h2 className="font-display text-xl text-primary">{t.ops.onboardingReview}</h2>
        {onboarding.isPending ? (
          <Skeleton className="mt-4 h-40 w-full rounded-2xl" />
        ) : onboarding.data?.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">{t.ops.noApplications}</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {onboarding.data?.map((application) => (
              <li key={application.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {application.profile?.full_name ?? application.driver_id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {application.status} · {application.profile?.phone}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium"
                      onClick={() =>
                        reviewOnboarding.mutate({
                          driverId: application.driver_id,
                          status: "approved",
                          notes: t.ops.approvalNote,
                        })
                      }
                    >
                      {t.ops.approve}
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium"
                      onClick={() => {
                        const notes = window.prompt(t.ops.requiredChanges);
                        if (notes?.trim()) {
                          reviewOnboarding.mutate({
                            driverId: application.driver_id,
                            status: "needs_changes",
                            notes,
                          });
                        }
                      }}
                    >
                      {t.ops.requestChanges}
                    </button>
                  </div>
                </div>
                <ul className="mt-4 grid gap-2 md:grid-cols-2">
                  {application.documents.map((document) => (
                    <li key={document.id} className="rounded-xl bg-muted/50 p-3 text-sm">
                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          className="font-medium text-accent-deep underline"
                          onClick={async () => {
                            const url = await getDriverDocumentReviewUrl(document.storage_path);
                            window.open(url, "_blank", "noopener,noreferrer");
                          }}
                        >
                          {document.document_type}
                        </button>
                        <span className="text-xs text-muted-foreground">{document.status}</span>
                      </div>
                      {document.expires_on && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {t.ops.expires} {new Date(document.expires_on).toLocaleDateString(locale)}
                        </p>
                      )}
                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          className="rounded-lg border border-border px-2.5 py-1 text-xs"
                          onClick={() =>
                            reviewDocument.mutate({
                              documentId: document.id,
                              status: "verified",
                            })
                          }
                        >
                          {t.ops.verify}
                        </button>
                        <button
                          type="button"
                          className="rounded-lg border border-destructive/30 px-2.5 py-1 text-xs text-destructive"
                          onClick={() => {
                            const reason = window.prompt(t.ops.rejectionReason);
                            if (reason?.trim()) {
                              reviewDocument.mutate({
                                documentId: document.id,
                                status: "rejected",
                                reason,
                              });
                            }
                          }}
                        >
                          {t.ops.reject}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                {application.reviewer_notes && (
                  <p className="mt-3 text-xs text-muted-foreground">{application.reviewer_notes}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-display text-xl text-primary">{t.ops.unassignedBookings}</h2>
        {unassigned.isPending ? (
          <Skeleton className="mt-4 h-32 w-full rounded-2xl" />
        ) : unassigned.data?.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">{t.ops.noUnassigned}</p>
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
                  <Link to="/{-$locale}/partner" className="text-accent-deep underline">
                    {t.ops.partnerInbox}
                  </Link>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-display text-xl text-primary">{t.ops.partners}</h2>
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
                  {p.status === "active" ? t.ops.pause : t.ops.activate}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-display text-xl text-primary">{t.ops.openIncidents}</h2>
        {incidents.isPending ? (
          <Skeleton className="mt-4 h-40 w-full rounded-2xl" />
        ) : incidents.data?.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">{t.ops.noOpenIncidents}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {incidents.data?.map((inc) => (
              <li key={inc.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{inc.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.ops.booking} {inc.booking_id.slice(0, 8)} · {inc.status}
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
                        ["full_refund", t.ops.fullRefund],
                        ["credit", t.ops.credit],
                        ["partial_refund", t.ops.halfRefund],
                        ["rebook", t.ops.rebook],
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
                      {t.ops.reject}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-display text-xl text-primary">{t.ops.pendingRefunds}</h2>
        {refunds.isPending ? (
          <Skeleton className="mt-4 h-32 w-full rounded-2xl" />
        ) : refunds.data?.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">{t.ops.noPendingRefunds}</p>
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
