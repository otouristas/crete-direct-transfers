import { createFileRoute, Link } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import type { Locale } from "@/i18n";

export const Route = createFileRoute("/{-$locale}/flights/confirmation/$bookingId")({
  head: ({ params }) => {
    const locale = (params.locale ?? "en") as Locale;
    return buildHead({
      locale,
      path: `/flights/confirmation/${params.bookingId}`,
      title: "Flight booked · TransferAround",
      description: "Flight booking confirmation",
      noindex: true,
    });
  },
  component: function FlightConfirmation() {
    const { bookingId } = Route.useParams();
    return (
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <h1 className="font-display text-3xl text-primary">Flight confirmed</h1>
        <p className="mt-3 text-sm text-muted-foreground">Ref: {bookingId}</p>
        <Link
          to="/{-$locale}/book"
          className="mt-8 inline-flex rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground"
        >
          Book airport transfer
        </Link>
      </div>
    );
  },
});
