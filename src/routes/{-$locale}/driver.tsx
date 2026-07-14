import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Clock3, ShieldAlert } from "lucide-react";
import { RequireAuth } from "@/components/auth/require-auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { useProfile } from "@/queries/profile";
import { getDict, type Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { CONTACT_PHONE, CONTACT_PHONE_HREF } from "@/lib/site";

export const Route = createFileRoute("/{-$locale}/driver")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/driver",
      title: t.driver.metaTitle,
      description: t.driver.title,
      noindex: true,
    });
  },
  component: DriverLayout,
});

function DriverLayout() {
  return (
    <RequireAuth role="driver">
      <DriverGate />
    </RequireAuth>
  );
}

function DriverGate() {
  const { locale } = Route.useRouteContext();
  const t = getDict(locale);
  const profile = useProfile();
  const approval = profile.data?.driver_profiles?.approval_status;

  if (approval !== "approved") {
    const suspended = approval === "suspended";
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        {suspended ? (
          <ShieldAlert className="mx-auto h-12 w-12 text-destructive" strokeWidth={1.5} />
        ) : (
          <Clock3 className="mx-auto h-12 w-12 text-accent" strokeWidth={1.5} />
        )}
        <h1 className="mt-6 text-3xl font-display text-primary">
          {suspended ? t.driver.suspendedTitle : t.driver.pendingTitle}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {suspended ? t.driver.suspendedBody : t.driver.pendingBody}
        </p>
        <a
          href={CONTACT_PHONE_HREF}
          className="mt-8 inline-flex rounded-xl border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
        >
          {t.common.call}: {CONTACT_PHONE}
        </a>
      </div>
    );
  }

  return (
    <DashboardShell
      title={t.driver.title}
      tabs={[
        { label: t.driver.tabPool, to: "/driver" },
        { label: t.driver.tabJobs, to: "/driver/jobs" },
        { label: t.driver.tabEarnings, to: "/driver/earnings" },
      ]}
    >
      <Outlet />
    </DashboardShell>
  );
}
