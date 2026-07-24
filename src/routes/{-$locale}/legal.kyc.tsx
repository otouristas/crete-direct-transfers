import { createFileRoute } from "@tanstack/react-router";
import type { Locale } from "@/i18n";
import { getDict, useT } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { LegalDocument, LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/{-$locale}/legal/kyc")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const doc = getDict(locale).legal.kyc;
    return buildHead({
      locale,
      path: "/legal/kyc",
      title: doc.metaTitle,
      description: doc.metaDescription,
    });
  },
  component: function LegalKycPage() {
    const doc = useT().legal.kyc;
    return (
      <LegalPage title={doc.title} updated={doc.updated}>
        <LegalDocument doc={doc} />
      </LegalPage>
    );
  },
});
