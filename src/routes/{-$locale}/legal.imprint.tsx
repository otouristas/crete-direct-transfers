import { createFileRoute } from "@tanstack/react-router";
import type { Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/{-$locale}/legal/imprint")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    return buildHead({
      locale,
      path: "/legal/imprint",
      title: "Imprint | TransferAround",
      description: "Company information and legal disclosures for TransferAround.",
    });
  },
  component: () => (
    <LegalPage title="Imprint" updated="4 July 2026">
      <p>Legal entity operating this website:</p>
      <p>
        <strong>TransferAround Ltd.</strong>
        <br />
        Heraklion, Crete, Greece
        <br />
        Email: hello@transferaround.com
        <br />
        Phone: +30 28 1000 0000
      </p>
      <p className="text-sm text-muted-foreground">
        (Registered company number, VAT ID and GEMI number to be added once the operating entity is
        finalised.)
      </p>
      <h2>Content responsibility</h2>
      <p>
        Content on this site is provided by TransferAround Ltd. External links are provided for
        reference; we take no responsibility for external content.
      </p>
      <h2>Dispute resolution</h2>
      <p>
        The EU online dispute resolution platform is available at{" "}
        <a href="https://ec.europa.eu/consumers/odr" className="text-accent underline">
          ec.europa.eu/consumers/odr
        </a>
        .
      </p>
    </LegalPage>
  ),
});
