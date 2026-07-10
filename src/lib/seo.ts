import { SITE_URL, SITE_NAME } from "./site";
import { localePath, type Locale } from "@/i18n";

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
 * en/el/de/x-default hreflang alternates (absolute URLs). Only leaf routes may
 * emit canonical/hreflang — root `links` merge without dedupe.
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
  if (ogImage) meta.push({ property: "og:image", content: ogImage });
  if (noindex) meta.push({ name: "robots", content: "noindex, nofollow" });

  const links = [
    { rel: "canonical", href: canonical },
    { rel: "alternate", hrefLang: "en", href: `${SITE_URL}${localePath("en", path)}` },
    { rel: "alternate", hrefLang: "el", href: `${SITE_URL}${localePath("el", path)}` },
    { rel: "alternate", hrefLang: "de", href: `${SITE_URL}${localePath("de", path)}` },
    { rel: "alternate", hrefLang: "x-default", href: `${SITE_URL}${localePath("en", path)}` },
  ];

  const scripts = jsonLd
    ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).map((obj) => ({
        type: "application/ld+json",
        children: JSON.stringify(obj),
      }))
    : undefined;

  return { meta, links, ...(scripts ? { scripts } : {}) };
}
