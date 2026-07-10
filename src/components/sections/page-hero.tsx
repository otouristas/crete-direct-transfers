import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { useT } from "@/i18n";

export type Crumb = { label: string; to?: string; params?: Record<string, string> };

export function PageHero({
  eyebrow,
  title,
  subtitle,
  crumbs,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  crumbs?: Crumb[];
  children?: ReactNode;
}) {
  const t = useT();
  return (
    <section className="border-b border-border bg-gradient-to-b from-muted to-background">
      <div className="mx-auto max-w-7xl px-6 py-14 md:py-20">
        {crumbs && crumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="mb-5 flex flex-wrap items-center gap-1 text-xs text-muted-foreground"
          >
            <Link to="/{-$locale}" className="hover:text-accent-deep">
              {t.nav.home}
            </Link>
            {crumbs.map((c) => (
              <span key={c.label} className="flex items-center gap-1">
                <ChevronRight className="h-3 w-3" />
                {c.to ? (
                  <Link
                    to={c.to as never}
                    params={c.params as never}
                    className="hover:text-accent-deep"
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-foreground/80">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && (
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-deep">
            {eyebrow}
          </div>
        )}
        <h1 className="mt-3 max-w-3xl text-4xl md:text-5xl font-display text-primary">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
