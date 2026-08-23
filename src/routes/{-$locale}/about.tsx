import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock3, Eye, Landmark, MapPinned } from "lucide-react";
import { getDict, useT, type Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { Reveal } from "@/components/reveal";
import { StatsBand } from "@/components/sections/stats-band";
import { CtaBand } from "@/components/sections/cta-band";
import { getRegionImage, imageUrl } from "@/lib/place-image";

const ABOUT_PHOTO = getRegionImage("chania");
const ABOUT_IMAGE = imageUrl(ABOUT_PHOTO, { width: 1400 });

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
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {t.about.eyebrow}
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-display leading-tight text-primary md:text-6xl">
              {t.about.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">{t.about.intro}</p>
          </Reveal>

          <div className="mt-14 grid items-start gap-10 lg:grid-cols-[1fr_0.95fr]">
            <Reveal
              delay={1}
              className="space-y-6 text-base leading-relaxed text-foreground/85 md:text-lg"
            >
              <p>{t.about.body1}</p>
              <p>{t.about.body2}</p>
              <h2 className="pt-4 text-2xl font-display text-primary md:text-3xl">
                {t.about.wontTitle}
              </h2>
              <p>{t.about.wontBody}</p>
              <h2 className="pt-4 text-2xl font-display text-primary md:text-3xl">
                {t.about.whyTitle}
              </h2>
              <p>{t.about.whyBody}</p>
            </Reveal>
            <Reveal delay={2} className="overflow-hidden rounded-2xl lg:sticky lg:top-28">
              <div className="aspect-[4/5] overflow-hidden">
                <img src={ABOUT_IMAGE} alt="" className="media-grade h-full w-full object-cover" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <StatsBand />

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <Reveal>
          <h2 className="text-3xl font-display text-primary md:text-4xl">{t.about.valuesTitle}</h2>
        </Reveal>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={(Math.min(i, 2) + 1) as 1 | 2 | 3}>
              <div className="border-t border-border pt-5">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15">
                  <Icon className="h-5 w-5 text-accent-deep" />
                </span>
                <h3 className="mt-4 text-lg font-display text-primary">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-12">
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
