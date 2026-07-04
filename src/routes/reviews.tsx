import { createFileRoute } from "@tanstack/react-router";
import { REVIEWS, AVG_RATING } from "@/data/reviews";
import { Star } from "lucide-react";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: `Crete Transfer Reviews | ${AVG_RATING}/5 from ${REVIEWS.length}+ Travellers` },
      { name: "description", content: `Read ${REVIEWS.length}+ real reviews of CreteTransfers — average rating ${AVG_RATING}/5 from Google, Tripadvisor and direct bookings.` },
      { property: "og:title", content: `${AVG_RATING}/5 — CreteTransfers Reviews` },
      { property: "og:description", content: `${REVIEWS.length}+ traveller reviews.` },
      { property: "og:url", content: "/reviews" },
    ],
    links: [{ rel: "canonical", href: "/reviews" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "CreteTransfers",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: AVG_RATING,
            reviewCount: REVIEWS.length,
          },
          review: REVIEWS.slice(0, 10).map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.author },
            reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
            reviewBody: r.quote,
          })),
        }),
      },
    ],
  }),
  component: () => (
    <>
      <section className="border-b border-border/60 bg-sand">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <div className="text-xs uppercase tracking-[0.2em] text-accent">Reviews</div>
          <h1 className="mt-3 text-4xl md:text-6xl font-serif text-primary">
            {AVG_RATING} from {REVIEWS.length}+ travellers.
          </h1>
          <div className="mt-4 flex gap-0.5 text-accent">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {REVIEWS.map((r, i) => (
          <blockquote key={i} className="rounded-2xl bg-card border border-border/60 p-6">
            <div className="flex gap-0.5 text-accent mb-3">
              {Array.from({ length: r.rating }).map((_, k) => (
                <Star key={k} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="font-serif text-lg text-foreground leading-snug">"{r.quote}"</p>
            <footer className="mt-4 text-xs text-muted-foreground flex justify-between">
              <div>
                <div className="font-medium text-foreground">{r.author}</div>
                <div>{r.route}</div>
              </div>
              <div className="text-right">
                <div>{r.source}</div>
                <div>{r.month}</div>
              </div>
            </footer>
          </blockquote>
        ))}
      </section>
    </>
  ),
});
