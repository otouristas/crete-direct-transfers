import { Link } from "@tanstack/react-router";
import { ArrowRight, Anchor, Building2, Clock, Map, Plane, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useLocale, useT } from "@/i18n";
import { getLocalizedServices } from "@/i18n/content";
import { cn } from "@/lib/utils";

/** One mark per service page — keyed by slug so the data stays copy-only. */
const ICONS: Record<string, LucideIcon> = {
  "airport-transfers": Plane,
  "port-transfers": Anchor,
  "hotel-transfers": Building2,
  "private-tours": Map,
  "long-distance": Clock,
  "group-transfers": Users,
};

/**
 * Surfaces the six service pages from the homepage. They render and are in the
 * sitemap, but until now nothing on the front page linked to them.
 */
export function ServicesRail({ compact = false }: { compact?: boolean } = {}) {
  const t = useT();
  const locale = useLocale();
  const services = getLocalizedServices(locale);

  return (
    <div
      className={cn(
        "grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2",
        // Half-width columns can't take three across without truncating every card.
        compact ? "" : "lg:grid-cols-3",
      )}
    >
      {services.map((service) => {
        const Icon = ICONS[service.slug] ?? Plane;
        return (
          <Link
            key={service.slug}
            to="/{-$locale}/services/$slug"
            params={{ slug: service.slug }}
            className="group flex flex-col gap-3 bg-card p-6 transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
          >
            <span
              aria-hidden
              className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent-deep transition-colors group-hover:bg-accent group-hover:text-accent-foreground"
            >
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <h3 className="font-display text-lg leading-snug text-primary">{service.name}</h3>
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {service.tagline}
            </p>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-xs font-semibold text-accent-deep">
              {t.common.learnMore}
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden
              />
            </span>
          </Link>
        );
      })}
    </div>
  );
}
