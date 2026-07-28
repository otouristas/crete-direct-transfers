import { SITE_URL, SITE_NAME, OG_DEFAULT_IMAGE } from "./site";
import { LOCALES, localePath, type Locale } from "@/i18n";

type JsonLd = Record<string, unknown>;

export interface BuildHeadArgs {
  locale: Locale;
  /** Locale-less path, e.g. "/about" or "/routes/heraklion-airport-to-chania". */
  path: string;
  title: string;
  description: string;
  ogImage?: string;
  noindex?: boolean;
  jsonLd?: JsonLd | JsonLd[];
}

/**
 * head() payload for a leaf route: title/description/OG, one canonical and
 * per-locale + x-default hreflang alternates (absolute URLs, generated from
 * LOCALES so new languages appear automatically). Only leaf routes may emit
 * canonical/hreflang — root `links` merge without dedupe.
 */
export function buildHead({
  locale,
  path,
  title,
  description,
  ogImage,
  noindex,
  jsonLd,
}: BuildHeadArgs) {
  const canonical = `${SITE_URL}${localePath(locale, path)}`;

  const meta: Record<string, string>[] = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: canonical },
    { property: "og:site_name", content: SITE_NAME },
  ];
  const image = ogImage ?? OG_DEFAULT_IMAGE;
  meta.push({ property: "og:image", content: image });
  meta.push({ name: "twitter:image", content: image });
  if (noindex) meta.push({ name: "robots", content: "noindex, nofollow" });

  const links = noindex
    ? []
    : [
        { rel: "canonical", href: canonical },
        ...LOCALES.map((l) => ({
          rel: "alternate",
          hrefLang: l,
          href: `${SITE_URL}${localePath(l, path)}`,
        })),
        {
          rel: "alternate",
          hrefLang: "x-default",
          href: `${SITE_URL}${localePath("en", path)}`,
        },
      ];

  const scripts =
    jsonLd && !noindex
      ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).map((obj) => ({
          type: "application/ld+json",
          children: JSON.stringify(obj),
        }))
      : undefined;

  return { meta, links, ...(scripts ? { scripts } : {}) };
}
