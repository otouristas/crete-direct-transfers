import { createFileRoute } from "@tanstack/react-router";
import type { Locale } from "@/i18n";
import { getDict, useT } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { LegalDocument, LegalPage } from "@/components/legal-page";

export const Route = createFileRoute("/{-$locale}/legal/imprint")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const doc = getDict(locale).legal.imprint;
    return buildHead({
      locale,
      path: "/legal/imprint",
      title: doc.metaTitle,
      description: doc.metaDescription,
    });
  },
  component: function LegalImprintPage() {
    const doc = useT().legal.imprint;
    return (
      <LegalPage title={doc.title} updated={doc.updated}>
        <LegalDocument doc={doc} />
      </LegalPage>
    );
  },
});
