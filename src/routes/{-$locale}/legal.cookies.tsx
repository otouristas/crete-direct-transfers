import { createFileRoute } from "@tanstack/react-router";
import type { Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/{-$locale}/legal/cookies")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    return buildHead({
      locale,
      path: "/legal/cookies",
      title: "Cookie Policy | TransferAround",
      description: "How TransferAround uses cookies and similar technologies.",
    });
  },
  component: () => (
    <LegalPage title="Cookie Policy" updated="4 July 2026">
      <p>We use a minimal number of cookies to run the site and improve your experience.</p>
      <h2>Strictly necessary</h2>
      <p>
        Session and CSRF protection cookies required for the booking flow to function. These cannot
        be disabled.
      </p>
      <h2>Analytics</h2>
      <p>
        We use privacy-friendly analytics that do not track individual users across sites and do not
        require a consent banner under current EU guidance.
      </p>
      <h2>Third parties</h2>
      <p>
        Our payment provider may set its own cookies during the checkout process. See their
        respective privacy policies.
      </p>
      <h2>Your controls</h2>
      <p>
        You can block or delete cookies via your browser settings at any time. Booking flow requires
        the strictly-necessary cookies to work.
      </p>
    </LegalPage>
  ),
});
