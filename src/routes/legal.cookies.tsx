import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/legal/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy | CreteTransfers" },
      { name: "description", content: "How CreteTransfers uses cookies and similar technologies." },
      { property: "og:url", content: "/legal/cookies" },
    ],
    links: [{ rel: "canonical", href: "/legal/cookies" }],
  }),
  component: () => (
    <LegalPage title="Cookie Policy" updated="4 July 2026">
      <p>We use a minimal number of cookies to run the site and improve your experience.</p>
      <h2>Strictly necessary</h2>
      <p>Session and CSRF protection cookies required for the booking flow to function. These cannot be disabled.</p>
      <h2>Analytics</h2>
      <p>We use privacy-friendly analytics that do not track individual users across sites and do not require a consent banner under current EU guidance.</p>
      <h2>Third parties</h2>
      <p>Our payment provider may set its own cookies during the checkout process. See their respective privacy policies.</p>
      <h2>Your controls</h2>
      <p>You can block or delete cookies via your browser settings at any time. Booking flow requires the strictly-necessary cookies to work.</p>
    </LegalPage>
  ),
});
