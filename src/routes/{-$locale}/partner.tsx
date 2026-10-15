import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { RequireAuth } from "@/components/auth/require-auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getDict, type Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { myPartnerMembershipsQuery } from "@/queries/partner";
import { useProfile } from "@/queries/profile";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/{-$locale}/partner")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/partner",
      title: t.partner.metaTitle,
      description: t.partner.title,
      noindex: true,
    });
  },
  component: PartnerLayout,
});

function PartnerLayout() {
  return (
    <RequireAuth>
      <PartnerGate />
    </RequireAuth>
  );
}

function PartnerGate() {
  const { locale } = Route.useRouteContext();
  const t = getDict(locale);
  const { user } = useAuth();
  const profile = useProfile();
  const memberships = useQuery({
    ...myPartnerMembershipsQuery(user?.id ?? ""),
    enabled: !!user?.id,
  });

  if (profile.isPending || memberships.isPending) {
    return <Skeleton className="mx-auto mt-12 h-64 max-w-5xl rounded-2xl" />;
  }

  const dispatcher = (memberships.data ?? []).filter((m) => m.role === "dispatcher");
  const isAdmin = profile.data?.role === "admin";

  if (!isAdmin && dispatcher.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="font-display text-2xl text-primary">{t.partner.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{t.partner.noAccess}</p>
        <Link
          to="/{-$locale}/account"
          className="mt-6 inline-block text-sm text-accent-deep underline"
        >
          {t.account.backToBookings}
        </Link>
      </div>
    );
  }

  const partnerId = dispatcher[0]?.partner_id ?? memberships.data?.[0]?.partner_id;

  return (
    <DashboardShell
      title={t.partner.title}
      tabs={[{ label: t.partner.inboxTitle, to: "/partner" }]}
    >
      <Outlet />
      {/* partnerId available via query on index; admin sees first membership or picks via URL later */}
      <span className="sr-only" data-partner-id={partnerId ?? ""} />
    </DashboardShell>
  );
}
