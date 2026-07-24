import { createFileRoute, notFound } from "@tanstack/react-router";
import { CountryHubPage } from "@/components/country-hub-page";
import { buildHead } from "@/lib/seo";
import { getDict, type Locale } from "@/i18n";
import { getLocalizedMarket } from "@/i18n/content";

export const Route = createFileRoute("/{-$locale}/greece")({
  loader: ({ params }) => {
    const locale = (params.locale ?? "en") as Locale;
    const market = getLocalizedMarket(locale, "greece");
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
      path: "/greece",
      title: market.metaTitle,
      description: market.metaDescription,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Service",
        name: `Private transfers in ${market.name}`,
        provider: { "@type": "LocalBusiness", name: "TransferAround" },
        areaServed: { "@type": "Country", name: market.name },
      },
    });
  },
  component: function GreecePage() {
    const { market } = Route.useLoaderData();
    return <CountryHubPage market={market} />;
  },
});
