import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/book/success")({
  validateSearch: z.object({ id: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Reservation confirmed | CreteTransfers" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { id } = Route.useSearch();
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <div className="mx-auto w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-7 h-7 stroke-accent" fill="none" strokeWidth="2">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="mt-6 font-serif text-4xl text-primary">Reservation received</h1>
      <p className="mt-4 text-muted-foreground">
        We've logged your transfer request. A local dispatcher will confirm your driver by email
        within a few hours and send you their name, photo and WhatsApp the day before pickup.
      </p>
      {id && (
        <div className="mt-6 inline-block rounded-full bg-muted px-4 py-2 text-xs font-mono text-muted-foreground">
          Booking ref: {id.slice(0, 8)}
        </div>
      )}
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm hover:opacity-90"
        >
          Back home
        </Link>
        <Link
          to="/routes"
          className="rounded-full border border-border px-5 py-2 text-sm hover:bg-muted"
        >
          Browse more routes
        </Link>
      </div>
    </div>
  );
}
