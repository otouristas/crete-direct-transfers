import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { formatEur } from "@/lib/pricing";
import { useLocale, useT } from "@/i18n";
import { getFeaturedGateways } from "@/lib/featured-gateways";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";
import {
  getAirportImage,
  getCityImage,
  getRegionImage,
  imageUrl,
  type PlaceImage,
} from "@/lib/place-image";
import { PhotoCredit } from "@/components/photo-credit";

/** Featured-gateway imagery, resolved from the Pexels manifest by place. */
const GATEWAY_PHOTOS: Record<string, PlaceImage> = {
  "transfer-from-heraklion-airport-to-elounda": getCityImage("elounda"),
  "transfer-from-chania-airport-to-chania-old-town": getCityImage("chania"),
  "rome-fiumicino-airport-transfers-fco": getAirportImage({ iata: "FCO" }),
  "barcelona-el-prat-airport-transfers-bcn": getAirportImage({ iata: "BCN" }),
  "lisbon-airport-transfers-lis": getAirportImage({ iata: "LIS" }),
  "antalya-airport-transfers-ayt": getAirportImage({ iata: "AYT" }),
};

const FALLBACK_PHOTO = getRegionImage("chania");

export function RoutesChapter({ id }: { id?: string }) {
  const t = useT();
  const locale = useLocale();
  const gateways = getFeaturedGateways(locale);
  const [active, setActive] = useState(gateways[0]?.key ?? "");
  const activeGateway = gateways.find((g) => g.key === active) ?? gateways[0];
  const photo = (activeGateway && GATEWAY_PHOTOS[activeGateway.key]) || FALLBACK_PHOTO;
  const image = imageUrl(photo, { width: 1400 });

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
                loading="lazy"
                style={{ backgroundColor: photo.avgColor }}
                className="media-grade h-full w-full object-cover transition-opacity duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/55 via-transparent to-primary/10" />
              <PhotoCredit image={photo} overlay className="bottom-1.5 right-2" />
              {activeGateway && (
                <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground">
                  <div className="text-xs uppercase tracking-[0.18em] text-primary-foreground/70">
                    {activeGateway.from}
                  </div>
                  <div className="mt-1 font-display text-2xl">{activeGateway.to}</div>
                </div>
              )}
            </div>
          </Reveal>

          <ol className="divide-y divide-border">
            {gateways.map((gateway, i) => {
              const isActive = gateway.key === active;
              const inner = (
                <>
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
                      {gateway.from} → {gateway.to}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {gateway.distanceKm && gateway.durationMin
                        ? `${gateway.countryName} · ${gateway.distanceKm} km · ${gateway.durationMin} ${t.common.minutes}`
                        : gateway.countryName}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                      {gateway.priceEur === null ? " " : t.common.from}
                    </div>
                    <div className="font-display text-xl text-accent-deep md:text-2xl">
                      {gateway.priceEur === null
                        ? t.home.countriesQuote
                        : formatEur(gateway.priceEur)}
                    </div>
                  </div>
                </>
              );
              const className = cn(
                "group flex items-start gap-4 py-5 transition md:gap-6",
                isActive ? "opacity-100" : "hover:bg-muted/40",
              );
              const handlers = {
                onMouseEnter: () => setActive(gateway.key),
                onFocus: () => setActive(gateway.key),
              };
              return (
                <li key={gateway.key}>
                  {gateway.link.kind === "airportRoute" ? (
                    <Link
                      to="/{-$locale}/airports/$slug/$routeSlug"
                      params={{
                        slug: gateway.link.airportSlug,
                        routeSlug: gateway.link.routeSlug,
                      }}
                      className={className}
                      {...handlers}
                    >
                      {inner}
                    </Link>
                  ) : (
                    <Link
                      to="/{-$locale}/airports/$slug"
                      params={{ slug: gateway.link.airportSlug }}
                      className={className}
                      {...handlers}
                    >
                      {inner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
          <Link
            to="/{-$locale}/airports"
            className="inline-flex items-center text-sm font-semibold text-accent-deep transition hover:underline"
          >
            {t.nav.airports} →
          </Link>
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
