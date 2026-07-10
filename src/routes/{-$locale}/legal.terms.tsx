import { createFileRoute } from "@tanstack/react-router";
import type { Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/{-$locale}/legal/terms")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    return buildHead({
      locale,
      path: "/legal/terms",
      title: "Terms of Service | CreteTransfers",
      description: "Terms and conditions for booking a transfer with CreteTransfers.",
    });
  },
  component: () => (
    <LegalPage title="Terms of Service" updated="4 July 2026">
      <p>
        These terms govern your use of CreteTransfers (the "Service") and any transfer you book
        through it.
      </p>
      <h2>1. Booking &amp; contract</h2>
      <p>
        A booking becomes binding once you receive email confirmation from us. The price you see at
        booking is the price you pay — extras (child seat, extra stop, meet-and-greet) and the
        automatic night surcharge (22:00–06:00, +15%) are shown before you confirm.
      </p>
      <h2>2. Driver &amp; vehicle</h2>
      <p>
        All drivers are KTEL/EDX licensed under Greek law and carry commercial passenger insurance.
        We reserve the right to substitute an equivalent-class vehicle if operationally required.
      </p>
      <h2>3. Cancellation</h2>
      <p>
        Free cancellation up to 24 hours before scheduled pickup. Inside 24 hours, 50% of the fare
        is charged. No-shows are charged in full. See our{" "}
        <a href="/legal/refunds" className="text-accent underline">
          Refunds policy
        </a>
        .
      </p>
      <h2>4. Delays &amp; waiting</h2>
      <p>
        Flights and ferries are tracked automatically. 60 minutes of free waiting from scheduled
        arrival for flights; unlimited waiting for confirmed delays. For hotel pickups, 15 minutes
        free waiting applies.
      </p>
      <h2>5. Passenger conduct</h2>
      <p>
        Drivers may refuse service to intoxicated or abusive passengers. Any damage caused to the
        vehicle by passengers is chargeable.
      </p>
      <h2>6. Liability</h2>
      <p>
        Our liability is limited to the fare paid, except where mandatory Greek and EU consumer law
        provides otherwise.
      </p>
      <h2>7. Governing law</h2>
      <p>
        These terms are governed by Greek law. Courts of Heraklion, Greece, have exclusive
        jurisdiction.
      </p>
    </LegalPage>
  ),
});
