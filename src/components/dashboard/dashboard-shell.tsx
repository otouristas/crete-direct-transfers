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
 * Shared shell for the customer and driver dashboards: page heading + pill
 * nav. The active tab is the one with the longest href prefix-matching the
 * current pathname (so detail pages highlight their parent tab).
 */
export function DashboardShell({
  title,
  subtitle,
  tabs,
  children,
}: {
  title: string;
  subtitle?: string;
  tabs: ShellTab[];
  children: ReactNode;
}) {
  const locale = useLocale();
  const { pathname } = useLocation();

  const hrefs = tabs.map((tab) => localePath(locale, tab.to));
  const activeHref = hrefs
    .filter((href) => pathname === href || pathname.startsWith(`${href}/`))
    .sort((a, b) => b.length - a.length)[0];

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
