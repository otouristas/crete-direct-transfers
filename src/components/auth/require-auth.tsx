import { useEffect, type ReactNode } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/queries/profile";
import { useLocale, localePath } from "@/i18n";

function PageSkeleton() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <Skeleton className="h-9 w-56" />
      <Skeleton className="mt-4 h-10 w-80" />
      <div className="mt-8 space-y-4">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    </div>
  );
}

/**
 * Client-side auth gate: the Supabase session lives in localStorage, so the
 * server render can never know it — guarded pages render a skeleton until the
 * session is restored, then either their content or a redirect.
 */
export function RequireAuth({ children, role }: { children: ReactNode; role?: "driver" }) {
  const { session, ready } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const locale = useLocale();
  const profile = useProfile();

  const needsLogin = ready && !session;
  const wrongRole = role === "driver" && profile.data ? profile.data.role !== "driver" : false;

  useEffect(() => {
    if (needsLogin) {
      navigate({
        to: "/{-$locale}/login",
        params: { locale: locale === "en" ? undefined : locale },
        search: { redirect: location.pathname },
        replace: true,
      });
    } else if (wrongRole) {
      navigate({ to: localePath(locale, "/account"), replace: true });
    }
  }, [needsLogin, wrongRole, navigate, locale, location.pathname]);

  if (!ready || needsLogin) return <PageSkeleton />;
  if (role === "driver" && (profile.isPending || wrongRole)) return <PageSkeleton />;
  return <>{children}</>;
}
