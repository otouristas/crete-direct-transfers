import { createFileRoute, Link } from "@tanstack/react-router";
import { buildHead } from "@/lib/seo";
import type { Locale } from "@/i18n";

export const Route = createFileRoute("/{-$locale}/hotels/confirmation/$bookingId")({
  head: ({ params }) => {
    const locale = (params.locale ?? "en") as Locale;
    return buildHead({
      locale,
      path: `/hotels/confirmation/${params.bookingId}`,
      title: "Hotel booked · TransferAround",
      description: "Hotel booking confirmation",
      noindex: true,
    });
  },
  component: HotelConfirmationPage,
});

function HotelConfirmationPage() {
  const { bookingId } = Route.useParams();
  return (
    <div className="mx-auto max-w-lg px-6 py-20 text-center">
      <h1 className="font-display text-3xl text-primary">Hotel confirmed</h1>
      <p className="mt-3 text-sm text-muted-foreground">Booking ID: {bookingId}</p>
      <p className="mt-6 text-sm text-muted-foreground">
        Need a ride from the airport? Book a fixed-price private transfer next.
      </p>
      <Link
        to="/{-$locale}/book"
        className="mt-8 inline-flex rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground"
      >
        Book airport transfer
      </Link>
    </div>
  );
}
