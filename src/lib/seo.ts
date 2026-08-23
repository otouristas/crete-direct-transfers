import { SITE_URL, SITE_NAME, OG_DEFAULT_IMAGE } from "./site";
import { PUBLIC_LOCALES, localePath, type Locale } from "@/i18n";

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

const TITLE_LIMIT = 65;
const DESCRIPTION_LIMIT = 160;

function trimAtWord(value: string, limit: number): string {
  if (value.length <= limit) return value;
  const slice = value.slice(0, limit - 1);
  const boundary = slice.lastIndexOf(" ");
  return `${slice.slice(0, boundary > limit * 0.7 ? boundary : undefined).trimEnd()}…`;
}

function fitTitle(value: string): string {
  if (value.length <= TITLE_LIMIT) return value;
  const withoutBrand = value.replace(/\s+(?:\||·)\s+TransferAround(?: Blog)?$/u, "");
  return trimAtWord(withoutBrand, TITLE_LIMIT);
}

/** Absolute canonical URL for a locale and locale-less route path. */
export function buildCanonicalUrl(locale: Locale, path: string): string {
  return `${SITE_URL}${localePath(locale, path)}`;
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
  const canonical = buildCanonicalUrl(locale, path);
  const isPublicLocale = (PUBLIC_LOCALES as readonly string[]).includes(locale);
  const seoTitle = fitTitle(title);
  const seoDescription = trimAtWord(description, DESCRIPTION_LIMIT);
  const shouldNoindex = Boolean(noindex || !isPublicLocale);

  const meta: Record<string, string>[] = [
    { title: seoTitle },
    { name: "description", content: seoDescription },
    { property: "og:title", content: seoTitle },
    { property: "og:description", content: seoDescription },
    { property: "og:url", content: canonical },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: seoTitle },
    { name: "twitter:description", content: seoDescription },
  ];
  const image = ogImage ?? OG_DEFAULT_IMAGE;
  meta.push({ property: "og:image", content: image });
  if (!ogImage) {
    meta.push({ property: "og:image:width", content: "1200" });
    meta.push({ property: "og:image:height", content: "630" });
  }
  meta.push({ property: "og:image:alt", content: seoTitle });
  meta.push({ name: "twitter:image", content: image });
  meta.push({ name: "twitter:image:alt", content: seoTitle });
  if (shouldNoindex) meta.push({ name: "robots", content: "noindex, follow" });

  const links = shouldNoindex
    ? []
    : [
        { rel: "canonical", href: canonical },
        ...PUBLIC_LOCALES.map((l) => ({
          rel: "alternate",
          hrefLang: l,
          href: buildCanonicalUrl(l, path),
        })),
        {
          rel: "alternate",
          hrefLang: "x-default",
          href: buildCanonicalUrl("en", path),
        },
      ];

  const scripts =
    jsonLd && !shouldNoindex
      ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).map((obj) => ({
          type: "application/ld+json",
          children: JSON.stringify(obj),
        }))
      : undefined;

  return { meta, links, ...(scripts ? { scripts } : {}) };
}
