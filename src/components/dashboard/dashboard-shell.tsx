import { Link, useLocation } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useLocale, localePath } from "@/i18n";

export type ShellTab = {
  label: string;
  /** Locale-less path, e.g. "/account" or "/driver/jobs". */
  to: string;
};

/**
 * Shared shell for the customer and driver dashboards.
 * - dashboard: page heading + pill nav (driver)
 * - account: full-bleed muted sub-nav (customer account hub)
 */
export function DashboardShell({
  title,
  subtitle,
  tabs,
  children,
  variant = "dashboard",
}: {
  title: string;
  subtitle?: string;
  tabs: ShellTab[];
  children: ReactNode;
  variant?: "dashboard" | "account";
}) {
  const locale = useLocale();
  const { pathname } = useLocation();

  const hrefs = tabs.map((tab) => localePath(locale, tab.to));
  const activeHref = hrefs
    .filter((href) => pathname === href || pathname.startsWith(`${href}/`))
    .sort((a, b) => b.length - a.length)[0];

  if (variant === "account") {
    return (
      <div className="min-h-[60vh] bg-background">
        <div className="border-b border-border bg-muted/60">
          <div className="mx-auto hidden max-w-7xl gap-x-10 px-6 py-5 lg:flex">
            {tabs.map((tab, i) => (
              <Link
                key={tab.to}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                to={hrefs[i] as any}
                aria-current={hrefs[i] === activeHref ? "page" : undefined}
                className={cn(
                  "text-lg font-semibold transition",
                  hrefs[i] === activeHref
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
              </Link>
            ))}
          </div>
          {/* Mobile account tabs */}
          <div className="mx-auto flex gap-1 overflow-x-auto px-4 py-3 lg:hidden [scrollbar-width:none]">
            {tabs.map((tab, i) => (
              <Link
                key={tab.to}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                to={hrefs[i] as any}
                className={cn(
                  "shrink-0 rounded-lg px-3 py-2 text-sm font-semibold transition",
                  hrefs[i] === activeHref
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <h1 className="text-3xl font-display text-primary">{title}</h1>
      {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-6 flex flex-wrap gap-1.5 rounded-2xl">
        {tabs.map((tab, i) => (
          <Link
            key={tab.to}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            to={hrefs[i] as any}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-semibold transition",
              hrefs[i] === activeHref
                ? "bg-accent/15 text-accent-deep"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
