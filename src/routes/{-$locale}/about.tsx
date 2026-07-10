import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock3, Eye, Landmark, MapPinned } from "lucide-react";
import { getDict, useT, type Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { PageHero } from "@/components/sections/page-hero";
import { StatsBand } from "@/components/sections/stats-band";
import { CtaBand } from "@/components/sections/cta-band";

export const Route = createFileRoute("/{-$locale}/about")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/about",
      title: t.about.metaTitle,
      description: t.about.metaDescription,
    });
  },
  component: AboutPage,
});

function AboutPage() {
  const t = useT();
  const values = [
    { icon: Clock3, title: t.about.value1Title, body: t.about.value1Body },
    { icon: Eye, title: t.about.value2Title, body: t.about.value2Body },
    { icon: Landmark, title: t.about.value3Title, body: t.about.value3Body },
    { icon: MapPinned, title: t.about.value4Title, body: t.about.value4Body },
  ];
  return (
    <>
      <PageHero eyebrow={t.about.eyebrow} title={t.about.title} crumbs={[{ label: t.nav.about }]} />

      <article className="mx-auto max-w-3xl space-y-6 px-6 py-14 leading-relaxed text-foreground/90">
        <p className="text-xl">{t.about.intro}</p>
        <p>
          Travellers arriving in Heraklion or Chania were being asked to compare bids from
          strangers, negotiate over WhatsApp, or trust a taxi rank meter after a long flight. The
          prices moved. The drivers rotated. Accountability was nobody's job.
        </p>
        <p>
          We're locals — a small team from Chania and Heraklion — and we built what we always wished
          existed: one fixed price per route, one licensed driver assigned per booking, one number
          to call if anything goes wrong.
        </p>
        <h2 className="pt-6 text-3xl font-display text-primary">What we won't do</h2>
        <p>
          No reverse auctions. No surge pricing at 2am. No sending you a random driver we've never
          met. Every driver in our network is KTEL-licensed, insured, and has been driving on Crete
          for a minimum of three years.
        </p>
        <h2 className="pt-6 text-3xl font-display text-primary">Why one island</h2>
        <p>
          The global platforms cover 180 countries and understand none of them well. We cover 260km
          of coastline, two international airports, three ferry ports, and every hotel access road
          worth knowing. Depth over breadth.
        </p>
      </article>

      <StatsBand />

      <section className="mx-auto max-w-7xl px-6 py-14">
        <h2 className="text-center text-3xl font-display text-primary">{t.about.valuesTitle}</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15">
                <Icon className="h-5 w-5 text-accent-deep" />
              </span>
              <h3 className="mt-4 text-lg font-display text-primary">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            to="/{-$locale}/book"
            className="inline-flex rounded-xl bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
          >
            {t.common.bookTransfer}
          </Link>
        </div>
      </section>

      <CtaBand title={t.about.ctaTitle} />
    </>
  );
}
