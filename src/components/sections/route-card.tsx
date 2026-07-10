import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock } from "lucide-react";
import type { RouteData } from "@/data/routes";
import { quote, formatEur } from "@/lib/pricing";
import { useT } from "@/i18n";

export function RouteCard({ route }: { route: RouteData }) {
  const t = useT();
  const q = quote({ routeSlug: route.slug, vehicleClass: "economy" });
  return (
    <Link
      to="/{-$locale}/routes/$slug"
      params={{ slug: route.slug }}
      className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-xl"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={route.heroImage}
          alt={`${route.from} to ${route.to}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute bottom-3 left-3 rounded-full bg-primary/85 px-2.5 py-1 text-xs font-medium text-primary-foreground backdrop-blur">
          <Clock className="mr-1 inline h-3 w-3" />
          {route.durationMin} {t.common.minutes}
        </span>
      </div>
      <div className="p-5">
        <div className="text-sm text-muted-foreground">{route.from}</div>
        <div className="mt-0.5 flex items-center gap-2 text-lg font-display text-primary">
          <ArrowRight className="h-4 w-4 shrink-0 text-accent-deep" />
          {route.to}
        </div>
        <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {t.common.from}
          </span>
          <span className="text-xl font-display text-primary">
            {q ? formatEur(q.totalEur) : "—"}
            <span className="ml-1 text-xs font-sans font-normal text-muted-foreground">
              {t.common.perVehicle}
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
