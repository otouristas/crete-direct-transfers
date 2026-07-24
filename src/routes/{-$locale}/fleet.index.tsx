import { createFileRoute, Link } from "@tanstack/react-router";
import type { Locale } from "@/i18n";
import { useT } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { VEHICLE_CLASSES, ROUTES } from "@/data/routes";
import { quote, formatEur } from "@/lib/pricing";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/{-$locale}/fleet/")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    return buildHead({
      locale,
      path: "/fleet",
      title: "Our Fleet | Economy to Minibus, All Licensed · TransferAround",
      description:
        "Eight vehicle classes — Economy, Standard, First Class, SUV, vans and minibuses. All licensed and insured, with fixed pricing.",
    });
  },
  component: FleetHub,
});

function FleetHub() {
  const t = useT();
  return (
    <>
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {t.nav.fleet}
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-display leading-tight text-primary md:text-6xl">
              {t.fleetPages.indexTitle}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              {t.fleetPages.indexSubtitle}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-16 px-6 py-16 md:space-y-24 md:py-20">
        {VEHICLE_CLASSES.map((v, i) => {
          const price = quote({ routeSlug: ROUTES[0].slug, vehicleClass: v.id });
          const reverse = i % 2 === 1;
          return (
            <Reveal key={v.id}>
              <Link
                to="/{-$locale}/fleet/$class"
                params={{ class: v.id }}
                className="group grid items-center gap-8 lg:grid-cols-2"
              >
                <div className={`overflow-hidden rounded-2xl ${reverse ? "lg:order-2" : ""}`}>
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={v.image}
                      alt=""
                      className="media-grade h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
                <div className={reverse ? "lg:order-1" : ""}>
                  <div className="font-mono text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h2 className="mt-2 font-display text-3xl text-primary md:text-5xl">{v.label}</h2>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {v.capacity} · {v.bags}
                  </p>
                  <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
                    {v.description}
                  </p>
                  <div className="mt-6 flex items-end justify-between gap-4 border-t border-border pt-5">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                        {t.common.from}
                      </div>
                      <div className="font-display text-3xl text-accent-deep">
                        {price ? formatEur(price.totalEur) : "—"}
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-accent-deep group-hover:underline">
                      {t.common.learnMore} →
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </section>
    </>
  );
}
