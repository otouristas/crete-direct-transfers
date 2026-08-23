import { createFileRoute, notFound } from "@tanstack/react-router";
import { CountryHubPage } from "@/components/country-hub-page";
import { buildCanonicalUrl, buildHead } from "@/lib/seo";
import { getDict, type Locale } from "@/i18n";
import { getLocalizedMarket } from "@/i18n/content";
import { ORGANIZATION_ID } from "@/lib/structured-data";

export const Route = createFileRoute("/{-$locale}/spain")({
  loader: ({ params }) => {
    const locale = (params.locale ?? "en") as Locale;
    const market = getLocalizedMarket(locale, "spain");
    if (!market) throw notFound();
    return { market };
  },
  head: ({ loaderData, params }) => {
    const locale = (params.locale ?? "en") as Locale;
    const t = getDict(locale);
    const market = loaderData?.market;
    if (!market) {
      return {
        meta: [{ title: t.seo.notFound("Market") }, { name: "robots", content: "noindex" }],
      };
    }
    return buildHead({
      locale,
      path: "/spain",
      title: market.metaTitle,
      description: market.metaDescription,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${buildCanonicalUrl(locale, "/spain")}#service`,
        name: market.heroTitle,
        provider: { "@id": ORGANIZATION_ID },
        areaServed: { "@type": "Country", name: market.name },
      },
    });
  },
  component: function SpainPage() {
    const { market } = Route.useLoaderData();
    return <CountryHubPage market={market} />;
  },
});
