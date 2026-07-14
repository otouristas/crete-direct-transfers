import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RequireAuth } from "@/components/auth/require-auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getDict, type Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/{-$locale}/account")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/account",
      title: t.account.metaTitle,
      description: t.account.title,
      noindex: true,
    });
  },
  component: AccountLayout,
});

function AccountLayout() {
  const { locale } = Route.useRouteContext();
  const t = getDict(locale);
  return (
    <RequireAuth>
      <DashboardShell
        title={t.account.title}
        tabs={[
          { label: t.account.tabBookings, to: "/account" },
          { label: t.account.tabProfile, to: "/account/profile" },
        ]}
      >
        <Outlet />
      </DashboardShell>
    </RequireAuth>
  );
}
