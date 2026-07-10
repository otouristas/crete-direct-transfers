import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { ROUTES, VEHICLE_CLASSES } from "@/data/routes";
import { REGIONS } from "@/data/regions";
import { SERVICES } from "@/data/services";
import { POSTS } from "@/data/posts";
import { SITE_URL } from "@/lib/site";
import { LOCALES, localePath } from "@/i18n";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const paths: string[] = [
          "/",
          "/routes",
          "/regions",
          "/services",
          "/fleet",
          "/blog",
          "/about",
          "/how-it-works",
          "/faq",
          "/contact",
          "/reviews",
          "/for-hotels",
          "/for-drivers",
          "/legal/terms",
          "/legal/privacy",
          "/legal/cookies",
          "/legal/refunds",
          "/legal/imprint",
          ...ROUTES.map((r) => `/routes/${r.slug}`),
          ...REGIONS.map((r) => `/regions/${r.slug}`),
          ...SERVICES.map((s) => `/services/${s.slug}`),
          ...VEHICLE_CLASSES.map((v) => `/fleet/${v.id}`),
          ...POSTS.map((p) => `/blog/${p.slug}`),
        ];

        const alternates = (path: string) =>
          [
            ...LOCALES.map(
              (l) =>
                `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE_URL}${localePath(l, path)}"/>`,
            ),
            `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${localePath("en", path)}"/>`,
          ].join("\n");

        const urls = paths
          .flatMap((path) =>
            LOCALES.map(
              (locale) =>
                `  <url>\n    <loc>${SITE_URL}${localePath(locale, path)}</loc>\n${alternates(path)}\n    <changefreq>weekly</changefreq>\n  </url>`,
            ),
          )
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
