import { createFileRoute, notFound } from "@tanstack/react-router";
import { CountryHubPage } from "@/components/country-hub-page";
import { buildCanonicalUrl, buildHead } from "@/lib/seo";
import { getDict, type Locale } from "@/i18n";
import { getLocalizedMarket } from "@/i18n/content";
import { ORGANIZATION_ID } from "@/lib/structured-data";

export const Route = createFileRoute("/{-$locale}/turkey")({
  loader: ({ params }) => {
    const locale = (params.locale ?? "en") as Locale;
    const market = getLocalizedMarket(locale, "turkey");
    if (!market) throw notFound();
    return { market };
  },
  head: ({ loaderData, params }) => {
    const locale = (params.locale ?? "en") as Locale;
    const t = getDict(locale);
    const market = loaderData?.market;
    if (!market) {
      return {
        meta: [{ title: t.seo.notFound("TransferAround") }, { name: "robots", content: "noindex" }],
      };
    }
    return buildHead({
      locale,
      path: "/turkey",
      title: market.metaTitle,
      description: market.metaDescription,
      noindex: market.publicationStatus !== "published" || !market.live,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${buildCanonicalUrl(locale, "/turkey")}#service`,
        name: market.heroTitle,
        provider: { "@id": ORGANIZATION_ID },
        areaServed: { "@type": "Country", name: market.name },
      },
    });
  },
  component: function TurkeyPage() {
    const { market } = Route.useLoaderData();
    return <CountryHubPage market={market} />;
  },
});
