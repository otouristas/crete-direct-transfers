import { createFileRoute, Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { DRIVERS, driverInitials } from "@/data/drivers";
import { buildHead } from "@/lib/seo";
import { ORGANIZATION_ID } from "@/lib/structured-data";
import type { Locale } from "@/i18n";

export const Route = createFileRoute("/{-$locale}/drivers/")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    return buildHead({
      locale,
      path: "/drivers",
      title: "Meet the Crete drivers | TransferAround",
      description:
        "The named local drivers behind our fixed-price transfers: where they are based, which languages they speak, what they drive, and the routes they know best.",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Crete transfer drivers",
        publisher: { "@id": ORGANIZATION_ID },
        itemListElement: DRIVERS.map((d, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: d.name,
        })),
      },
    });
  },
  component: DriversIndex,
});

function DriversIndex() {
  return (
    <>
      <PageHero
        eyebrow="Our drivers"
        title="You are not booking a fleet. You are booking a person."
        subtitle="Every transfer is run by a named local driver on their own plates. Here is who they are, where they live, and what they know."
        crumbs={[{ label: "Drivers" }]}
      />
      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-14 md:grid-cols-2 lg:grid-cols-3">
        {DRIVERS.map((d) => (
          <Link
            key={d.slug}
            to="/{-$locale}/drivers/$slug"
            params={{ slug: d.slug }}
            className="group rounded-2xl border border-border bg-card p-6 transition hover:shadow-lg"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary font-display text-xl text-primary-foreground">
                {driverInitials(d.name)}
              </span>
              <div>
                <h2 className="font-display text-lg text-primary">{d.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {d.base} · {d.years} years driving
                </p>
              </div>
            </div>
            <p className="mt-4 line-clamp-3 text-sm text-muted-foreground">{d.bio[0]}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {d.languages.map((l) => (
                <span key={l} className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                  {l}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm">
              <span className="inline-flex items-center gap-1.5 font-semibold text-primary">
                <Star className="h-4 w-4 fill-highlight text-highlight" />
                {d.rating.toFixed(1)}
              </span>
              <span className="text-muted-foreground">{d.transfers.toLocaleString()} transfers</span>
            </div>
          </Link>
        ))}
      </section>
      <CtaBand
        title="Want to drive with us?"
        subtitle="We onboard a small number of Crete drivers each season, on 85% of every fare."
      />
    </>
  );
}
