import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { getDict, useLocale, useT, type Locale } from "@/i18n";
import { getLocalizedServices } from "@/i18n/content";
import { buildHead } from "@/lib/seo";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/{-$locale}/services/")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/services",
      title: t.seo.servicesIndexTitle,
      description: t.seo.servicesIndexDescription,
    });
  },
  component: ServicesHub,
});

function ServicesHub() {
  const t = useT();
  const locale = useLocale();
  const services = getLocalizedServices(locale);
  const [active, setActive] = useState(services[0]?.slug ?? "");
  const current = services.find((s) => s.slug === active) ?? services[0];

  return (
    <>
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {t.nav.services}
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-display leading-tight text-primary md:text-6xl">
              {t.servicesPages.indexTitle}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              {t.servicesPages.indexSubtitle}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 md:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <Reveal className="relative hidden overflow-hidden rounded-2xl lg:block lg:sticky lg:top-28">
            {current && (
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  key={current.slug}
                  src={current.heroImage}
                  alt=""
                  className="media-grade h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-primary-foreground">
                  <div className="font-mono text-xs text-primary-foreground/70">
                    {String(services.findIndex((s) => s.slug === current.slug) + 1).padStart(
                      2,
                      "0",
                    )}
                  </div>
                  <div className="mt-1 font-display text-2xl">{current.name}</div>
                </div>
              </div>
            )}
          </Reveal>

          <ol className="divide-y divide-border">
            {services.map((s, i) => {
              const isActive = s.slug === active;
              return (
                <li key={s.slug}>
                  <Link
                    to="/{-$locale}/services/$slug"
                    params={{ slug: s.slug }}
                    onMouseEnter={() => setActive(s.slug)}
                    onFocus={() => setActive(s.slug)}
                    className={cn(
                      "group flex gap-5 py-6 transition",
                      isActive ? "opacity-100" : "opacity-65 hover:opacity-100",
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
                      <div className="font-display text-2xl text-primary md:text-3xl">{s.name}</div>
                      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                        {s.tagline}
                      </p>
                      <span className="mt-3 inline-block text-sm font-semibold text-accent-deep group-hover:underline">
                        {t.common.learnMore} →
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </>
  );
}
