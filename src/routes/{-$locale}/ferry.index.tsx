import { createFileRoute, Link } from "@tanstack/react-router";
import { Anchor, Ship } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { FERRY_PORTS } from "@/data/ferry-ports";
import { formatEur } from "@/lib/pricing";
import { buildHead } from "@/lib/seo";
import type { Locale } from "@/i18n";

export const Route = createFileRoute("/{-$locale}/ferry/")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    return buildHead({
      locale,
      path: "/ferry",
      title: "Crete ferry port transfers | TransferAround",
      description:
        "Ferry and cruise arrival transfers at every Crete port — Heraklion, Souda, Rethymno, Kissamos, Agios Nikolaos and Sitia. Berthing times, meeting points and fixed prices.",
    });
  },
  component: FerryIndex,
});

function FerryIndex() {
  return (
    <>
      <PageHero
        eyebrow="Ferry & cruise arrivals"
        title="Off the ramp at 06:00, in the car by 06:15"
        subtitle="The overnight boats land thousands of people at once and the taxi rank empties in minutes. Every Crete port, with the berthing times and meeting points we actually work to."
        crumbs={[{ label: "Ferry ports" }]}
      />
      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-14 md:grid-cols-2">
        {FERRY_PORTS.map((p) => (
          <Link
            key={p.slug}
            to="/{-$locale}/ferry/$slug"
            params={{ slug: p.slug }}
            className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:shadow-lg"
          >
            <div className="aspect-[16/9] overflow-hidden">
              <img
                src={p.heroImage}
                alt={p.name}
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h2 className="inline-flex items-center gap-2 font-display text-xl text-primary">
                <Anchor className="h-4 w-4 text-accent-deep" />
                {p.name}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.summary}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Ship className="h-3.5 w-3.5" /> {p.lines.length} operators
                </span>
                <span className="font-semibold text-accent-deep">
                  from {formatEur(p.fromPriceEur)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </section>
      <CtaBand />
    </>
  );
}
