import { createFileRoute } from "@tanstack/react-router";
import type { Locale } from "@/i18n";
import { getDict, useT } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { LegalDocument, LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/{-$locale}/legal/refunds")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const doc = getDict(locale).legal.refunds;
    return buildHead({
      locale,
      path: "/legal/refunds",
      title: doc.metaTitle,
      description: doc.metaDescription,
    });
  },
  component: function LegalRefundsPage() {
    const doc = useT().legal.refunds;
    return (
      <LegalPage title={doc.title} updated={doc.updated}>
        <LegalDocument doc={doc} />
      </LegalPage>
    );
  },
});
