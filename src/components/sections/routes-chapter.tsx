import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ROUTES } from "@/data/routes";
import { quote, formatEur } from "@/lib/pricing";
import { useT } from "@/i18n";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

const ROUTE_IMAGES: Record<string, string> = {
  "heraklion-airport-to-elounda":
    "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=1400&q=75",
  "heraklion-airport-to-agios-nikolaos":
    "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1400&q=75",
  "heraklion-airport-to-hersonissos":
    "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1400&q=75",
  "heraklion-airport-to-malia":
    "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1400&q=75",
  "heraklion-airport-to-stalis":
    "https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&w=1400&q=75",
  "heraklion-airport-to-rethymno":
    "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?auto=format&fit=crop&w=1400&q=75",
  "heraklion-airport-to-chania":
    "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?auto=format&fit=crop&w=1400&q=75",
  "chania-airport-to-chania-old-town":
    "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1400&q=75",
  "souda-port-to-chania-old-town":
    "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1400&q=75",
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1601161221525-6b3e0f0e13db?auto=format&fit=crop&w=1400&q=75";

export function RoutesChapter({ id }: { id?: string }) {
  const t = useT();
  const popular = ROUTES.slice(0, 6);
  const [active, setActive] = useState(popular[0]?.slug ?? "");
  const activeRoute = popular.find((r) => r.slug === active) ?? popular[0];
  const image = (activeRoute && ROUTE_IMAGES[activeRoute.slug]) || FALLBACK_IMAGE;

  return (
    <section id={id} className="scroll-mt-32 border-y border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {t.nav.routes}
          </p>
          <h2 className="mt-3 max-w-xl text-3xl font-display leading-tight text-primary md:text-5xl">
            {t.home.routesChapterTitle}{" "}
            <span className="font-accent text-accent">{t.home.routesChapterAccent}</span>
          </h2>
          <p className="mt-4 max-w-lg text-base text-muted-foreground md:text-lg">
            {t.home.routesChapterSubtitle}
          </p>
        </Reveal>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <Reveal className="relative hidden overflow-hidden rounded-2xl lg:block lg:sticky lg:top-28">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                key={image}
                src={image}
                alt=""
                className="media-grade h-full w-full object-cover transition-opacity duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/55 via-transparent to-primary/10" />
              {activeRoute && (
                <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground">
                  <div className="text-xs uppercase tracking-[0.18em] text-primary-foreground/70">
                    {activeRoute.from}
                  </div>
                  <div className="mt-1 font-display text-2xl">{activeRoute.to}</div>
                </div>
              )}
            </div>
          </Reveal>

          <ol className="divide-y divide-border">
            {popular.map((route, i) => {
              const q = quote({ routeSlug: route.slug, vehicleClass: "economy" });
              const isActive = route.slug === active;
              return (
                <li key={route.slug}>
                  <Link
                    to="/{-$locale}/routes/$slug"
                    params={{ slug: route.slug }}
                    onMouseEnter={() => setActive(route.slug)}
                    onFocus={() => setActive(route.slug)}
                    className={cn(
                      "group flex items-start gap-4 py-5 transition md:gap-6",
                      isActive ? "opacity-100" : "hover:bg-muted/40",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-1 font-mono text-xs tabular-nums",
                        isActive ? "text-accent-deep" : "text-muted-foreground",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-display text-xl text-primary md:text-2xl">
                        {route.from} → {route.to}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {route.distanceKm} km · {route.durationMin} {t.common.minutes}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                        {t.common.from}
                      </div>
                      <div className="font-display text-xl text-accent-deep md:text-2xl">
                        {q ? formatEur(q.totalEur) : "—"}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-10">
          <Link
            to="/{-$locale}/routes"
            className="inline-flex items-center text-sm font-semibold text-accent-deep transition hover:underline"
          >
            {t.common.seeAllRoutes} →
          </Link>
        </div>
      </div>
    </section>
  );
}
