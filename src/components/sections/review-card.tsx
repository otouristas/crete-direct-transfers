import { Star, BadgeCheck } from "lucide-react";
import type { Review } from "@/data/reviews";
import { cn } from "@/lib/utils";

export function ReviewCard({ review, className }: { review: Review; className?: string }) {
  return (
    <figure
      className={cn("flex h-full flex-col rounded-2xl border border-border bg-card p-6", className)}
    >
      <div className="flex items-center gap-1" aria-label={`${review.rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-4 w-4",
              i < review.rating ? "fill-highlight text-highlight" : "fill-muted text-muted",
            )}
          />
        ))}
      </div>
      <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">
        “{review.quote}”
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-display text-primary-foreground">
          {review.author.charAt(0)}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
            <span className="truncate">{review.author}</span>
            <BadgeCheck className="h-4 w-4 shrink-0 text-accent-deep" />
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {review.route} · {review.source} · {review.month}
          </div>
        </div>
      </figcaption>
    </figure>
  );
}

export function ReviewsGrid({ reviews }: { reviews: Review[] }) {
  return (
    <>
      {/* Mobile: swipeable row */}
      <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 md:hidden">
        {reviews.map((r) => (
          <ReviewCard
            key={r.author + r.month}
            review={r}
            className="w-[85%] shrink-0 snap-center"
          />
        ))}
      </div>
      {/* Desktop: grid */}
      <div className="hidden gap-5 md:grid md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r) => (
          <ReviewCard key={r.author + r.month} review={r} />
        ))}
      </div>
    </>
  );
}
