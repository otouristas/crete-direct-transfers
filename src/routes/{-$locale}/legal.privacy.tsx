import { createFileRoute } from "@tanstack/react-router";
import type { Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/{-$locale}/legal/privacy")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    return buildHead({
      locale,
      path: "/legal/privacy",
      title: "Privacy Policy | TransferAround",
      description: "How TransferAround collects, uses and protects your personal data.",
    });
  },
  component: () => (
    <LegalPage title="Privacy Policy" updated="4 July 2026">
      <p>
        We are committed to protecting your personal data in accordance with the EU General Data
        Protection Regulation (GDPR) and Greek data protection law.
      </p>
      <h2>Data we collect</h2>
      <ul>
        <li>Booking details: name, email, phone, flight/ferry number, pickup notes.</li>
        <li>
          Payment details: processed by our payment provider — we never store full card numbers.
        </li>
        <li>Communications: messages sent via our contact forms.</li>
        <li>Technical: IP address, browser type, pages viewed (via privacy-friendly analytics).</li>
      </ul>
      <h2>How we use it</h2>
      <ul>
        <li>To fulfil your booking and assign a driver.</li>
        <li>To send booking confirmations and driver contact details.</li>
        <li>To answer your questions.</li>
        <li>To comply with Greek accounting and tax obligations.</li>
      </ul>
      <h2>Who we share it with</h2>
      <p>
        Only the assigned driver receives your contact and pickup details. We do not sell or share
        your data with third-party marketers.
      </p>
      <h2>Retention</h2>
      <p>
        Booking records are retained for the period required by Greek tax law (currently 5 years).
        Contact-form messages are retained for 2 years unless a business relationship is ongoing.
      </p>
      <h2>Your rights</h2>
      <p>
        Under GDPR you may request access to, correction of, or deletion of your personal data.
        Email{" "}
        <a href="mailto:hello@transferaround.com" className="text-accent underline">
          hello@transferaround.com
        </a>
        .
      </p>
      <h2>Complaints</h2>
      <p>You may lodge a complaint with the Hellenic Data Protection Authority (dpa.gr).</p>
    </LegalPage>
  ),
});
