import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { getDict, useT, type Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { REVIEWS, AVG_RATING } from "@/data/reviews";
import { PageHero } from "@/components/sections/page-hero";
import { ReviewCard } from "@/components/sections/review-card";
import { CtaBand } from "@/components/sections/cta-band";

export const Route = createFileRoute("/{-$locale}/reviews")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/reviews",
      title: t.reviewsPage.metaTitle,
      description: t.reviewsPage.metaDescription,
    });
  },
  component: ReviewsPage,
});

function ReviewsPage() {
  const t = useT();
  return (
    <>
      <PageHero
        eyebrow={t.reviewsPage.eyebrow}
        title={t.reviewsPage.title}
        subtitle={t.reviewsPage.subtitle}
        crumbs={[{ label: t.nav.reviews }]}
      >
        <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-border bg-card px-5 py-2.5">
          <span className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-highlight text-highlight" />
            ))}
          </span>
          <span className="text-sm font-semibold text-primary">
            {AVG_RATING} · {REVIEWS.length}+ {t.nav.reviews.toLowerCase()}
          </span>
        </div>
      </PageHero>
      <section className="mx-auto grid max-w-7xl gap-5 px-6 py-14 md:grid-cols-2 lg:grid-cols-3">
        {REVIEWS.map((r, i) => (
          <ReviewCard key={i} review={r} />
        ))}
      </section>
      <CtaBand />
    </>
  );
}
