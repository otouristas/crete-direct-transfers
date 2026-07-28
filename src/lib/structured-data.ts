// Site-wide schema.org entities (Organization + WebSite). These render on every
// page via the root head and give search + AI answer engines a stable, linkable
// identity for the brand — the key signal for a Google knowledge panel and for
// GEO citation (ChatGPT / Perplexity / Gemini / AI Overviews). Per-page schema
// (LocalBusiness, TaxiService, Article…) references these by @id.
import { SITE_URL, SITE_NAME, CONTACT_EMAIL, CONTACT_PHONE, OG_DEFAULT_IMAGE } from "./site";
import { LOCALES } from "@/i18n";

/** BCP-47 language tags we publish in — drives availableLanguage / inLanguage. */
const LANGUAGE_TAGS: string[] = [...LOCALES];

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: OG_DEFAULT_IMAGE,
  },
  image: OG_DEFAULT_IMAGE,
  description:
    "Fixed-price private airport, port and city-to-city transfers with licensed local drivers, flight tracking and no bidding.",
  email: CONTACT_EMAIL,
  areaServed: [
    { "@type": "Country", name: "Greece" },
    { "@type": "Country", name: "Spain" },
    { "@type": "Country", name: "Italy" },
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: CONTACT_EMAIL,
    availableLanguage: LANGUAGE_TAGS,
    ...(CONTACT_PHONE ? { telephone: CONTACT_PHONE } : {}),
  },
  ...(CONTACT_PHONE ? { telephone: CONTACT_PHONE } : {}),
};

export const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: LANGUAGE_TAGS,
  publisher: { "@id": ORGANIZATION_ID },
};

/** Ready-to-spread head `scripts` entries for the site-wide entities. */
export const SITE_JSONLD_SCRIPTS = [
  { type: "application/ld+json", children: JSON.stringify(ORGANIZATION_JSONLD) },
  { type: "application/ld+json", children: JSON.stringify(WEBSITE_JSONLD) },
];
