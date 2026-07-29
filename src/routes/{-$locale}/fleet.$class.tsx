import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { VEHICLE_CLASSES, type VehicleClass } from "@/data/routes";
import { quote, formatEur } from "@/lib/pricing";
import { Check } from "lucide-react";
import { getDict, useLocale, useT, type Locale } from "@/i18n";
import { getLocalizedRoutes, getLocalizedVehicles } from "@/i18n/content";
import { buildHead } from "@/lib/seo";

const VALID = VEHICLE_CLASSES.map((v) => v.id);

export const Route = createFileRoute("/{-$locale}/fleet/$class")({
  loader: ({ params }) => {
    const locale = (params.locale ?? "en") as Locale;
    if (!VALID.includes(params.class as VehicleClass)) throw notFound();
    const vc = getLocalizedVehicles(locale).find((v) => v.id === (params.class as VehicleClass))!;
    return { vc };
  },
  head: ({ loaderData, params }) => {
    const locale = (params.locale ?? "en") as Locale;
    const t = getDict(locale);
    if (!loaderData)
      return {
        meta: [
          { title: t.seo.notFound(t.directoryPages.vehicleEntity) },
          { name: "robots", content: "noindex" },
        ],
      };
    const v = loaderData.vc;
    return buildHead({
      locale,
      path: `/fleet/${params.class}`,
      title: t.seo.fleetTitle(v.label),
      description: t.directoryPages.vehicleMetaDescription(
        v.description,
        v.capacity,
        v.bags,
        v.label,
      ),
      ogImage: v.image,
    });
  },
  component: FleetDetail,
  notFoundComponent: FleetNotFound,
});

function FleetNotFound() {
  const t = useT();
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-display text-3xl text-primary">{t.directoryPages.vehicleNotFound}</h1>
      <Link
        to="/{-$locale}/fleet"
        className="inline-flex mt-6 rounded-xl bg-accent px-5 py-2 text-sm text-accent-foreground"
      >
        {t.directoryPages.allClasses}
      </Link>
    </div>
  );
}

function FleetDetail() {
  const { vc } = Route.useLoaderData();
  const locale = useLocale();
  const t = useT();
  const others = getLocalizedVehicles(locale).filter((v) => v.id !== vc.id);
  const popular = getLocalizedRoutes(locale).slice(0, 6);
  return (
    <>
      <section className="relative">
        <div
          className="aspect-[16/7] bg-cover bg-center"
          style={{ backgroundImage: `url(${vc.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-10 md:pb-14 text-primary-foreground">
          <nav className="flex gap-2 text-xs text-primary-foreground/70 mb-3">
            <Link to="/{-$locale}" className="hover:text-accent">
              {t.nav.home}
            </Link>
            <span>/</span>
            <Link to="/{-$locale}/fleet" className="hover:text-accent">
              {t.nav.fleet}
            </Link>
            <span>/</span>
            <span>{vc.label}</span>
          </nav>
          <div className="text-xs uppercase tracking-[0.2em] text-accent">{vc.example}</div>
          <h1 className="mt-2 text-4xl md:text-6xl font-display">
            {t.directoryPages.className(vc.label)}
          </h1>
          <p className="mt-3 text-lg text-primary-foreground/85">
            {vc.capacity} · {vc.bags}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 grid gap-12 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="text-lg text-foreground/90 leading-relaxed max-w-2xl">{vc.description}</p>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-card border border-border p-6">
              <h3 className="font-display text-lg text-primary">
                {t.directoryPages.specifications}
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">{t.directoryPages.capacity}</span>
                  <span>{vc.capacity}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">{t.directoryPages.luggage}</span>
                  <span>{vc.bags}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">{t.directoryPages.example}</span>
                  <span>{vc.example}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">{t.directoryPages.maxAge}</span>
                  <span>{t.directoryPages.maxAgeValue}</span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl bg-card border border-border p-6">
              <h3 className="font-display text-lg text-primary">
                {t.directoryPages.allClassesInclude}
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                {t.directoryPages.vehicleIncludedItems.map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" /> {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="font-display text-2xl text-primary">
              {t.directoryPages.pricesOnPopularRoutes}
            </h2>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {popular.map((r) => {
                const q = quote({ routeSlug: r.slug, vehicleClass: vc.id });
                return (
                  <Link
                    key={r.slug}
                    to="/{-$locale}/routes/$slug"
                    params={{ slug: r.slug }}
                    className="rounded-xl bg-card border border-border p-4 hover:border-accent flex justify-between items-center transition"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {r.from} → {r.to}
                    </span>
                    <span className="text-sm text-accent">{q ? formatEur(q.totalEur) : "—"}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 h-fit rounded-2xl bg-primary text-primary-foreground p-6">
          <div className="text-xs uppercase tracking-widest text-accent">
            {t.directoryPages.bookVehicle(vc.label)}
          </div>
          <Link
            to="/{-$locale}/book"
            search={{ class: vc.id }}
            className="mt-5 block text-center rounded-xl bg-accent px-5 py-3 text-accent-foreground text-sm hover:opacity-90"
          >
            {t.directoryPages.getFixedPrice}
          </Link>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <h2 className="font-display text-2xl text-primary mb-6">{t.directoryPages.otherClasses}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {others.map((v) => (
            <Link
              key={v.id}
              to="/{-$locale}/fleet/$class"
              params={{ class: v.id }}
              className="rounded-xl bg-card border border-border p-5 hover:border-accent transition"
            >
              <div className="font-display text-primary text-lg">{v.label}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {v.capacity} · {v.bags}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
