import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, Plane } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { hotelAreasByRegion, HOTEL_AREAS } from "@/data/hotels";
import { formatEur } from "@/lib/pricing";
import { buildHead } from "@/lib/seo";
import type { Locale } from "@/i18n";

export const Route = createFileRoute("/{-$locale}/hotels/")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    return buildHead({
      locale,
      path: "/hotels",
      title: "Hotel and resort transfers in Crete | TransferAround",
      description:
        "Fixed-price airport transfers to every major Crete resort area — Elounda, Hersonissos, Platanias, Bali, Chania Old Town and more, with door-to-reception arrival detail.",
    });
  },
  component: HotelsIndex,
});

function HotelsIndex() {
  const groups = hotelAreasByRegion();
  return (
    <>
      <PageHero
        eyebrow="Hotels & resorts"
        title="Transfers to where you are actually staying"
        subtitle={`${HOTEL_AREAS.length} resort areas across Crete, each with the gate quirks, drive times and check-in realities that decide how your first day goes.`}
        crumbs={[{ label: "Hotels & resorts" }]}
      />
      {groups.map(({ region, areas }) => (
        <section key={region} className="mx-auto max-w-7xl px-6 py-10">
          <h2 className="font-display text-2xl text-primary">{region}</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {areas.map((a) => (
              <Link
                key={a.slug}
                to="/{-$locale}/hotels/$slug"
                params={{ slug: a.slug }}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:shadow-lg"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={a.heroImage}
                    alt={a.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg text-primary">{a.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{a.summary}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Plane className="h-3.5 w-3.5" /> {a.airportIata}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" /> {a.driveMin} min
                    </span>
                    <span className="font-semibold text-accent-deep">
                      from {formatEur(a.fromPriceEur)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
      <div className="py-6" />
      <CtaBand />
    </>
  );
}
