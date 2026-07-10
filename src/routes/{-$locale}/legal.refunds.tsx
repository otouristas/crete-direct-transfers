import { createFileRoute } from "@tanstack/react-router";
import type { Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/{-$locale}/legal/refunds")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    return buildHead({
      locale,
      path: "/legal/refunds",
      title: "Refund Policy | TransferAround",
      description: "Cancellation windows and refund terms for TransferAround bookings.",
    });
  },
  component: () => (
    <LegalPage title="Cancellation &amp; Refunds" updated="4 July 2026">
      <h2>Free cancellation window</h2>
      <p>
        You can cancel any booking free of charge up to 24 hours before the scheduled pickup time.
        Refunds for prepaid bookings are processed within 7 business days.
      </p>
      <h2>Late cancellations</h2>
      <p>
        Cancellations made within 24 hours of pickup incur a 50% fee. No-shows are charged in full.
      </p>
      <h2>Cancelled or missed flights</h2>
      <p>
        If your flight is cancelled by the airline, forward the airline notification to{" "}
        <a href="mailto:hello@transferaround.com" className="text-accent underline">
          hello@transferaround.com
        </a>{" "}
        and we'll refund or rebook in full, at your choice.
      </p>
      <h2>Changes</h2>
      <p>
        Changes to pickup time, address or vehicle class are free up to 4 hours before pickup,
        subject to availability.
      </p>
      <h2>EU consumer rights</h2>
      <p>
        Nothing in this policy affects your rights under mandatory Greek and EU consumer protection
        law.
      </p>
    </LegalPage>
  ),
});
