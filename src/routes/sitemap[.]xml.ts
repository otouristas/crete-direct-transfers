import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { ROUTES, VEHICLE_CLASSES } from "@/data/routes";
import { REGIONS } from "@/data/regions";
import { SERVICES } from "@/data/services";
import { POSTS } from "@/data/posts";
import { AIRPORT_ROUTES } from "@/data/airport-routes";
import { MARKET_HUB_CITIES } from "@/data/market-hubs";
import { listIndexableAirports } from "@/lib/indexable-airports";
import { listIndexablePorts } from "@/lib/port-resolve";
import { listCityDestinations } from "@/data/destinations";
import { listLiveMarkets } from "@/data/markets";
import { REVIEWS_VERIFIED, SITE_URL } from "@/lib/site";
import { PUBLIC_LOCALES, localePath } from "@/i18n";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const paths = new Set([
          "/",
          "/countries",
          ...listLiveMarkets().map((m) => `/${m.slug}`),
          "/airports",
          "/ports",
          "/cities",
          "/routes",
          "/regions",
          "/services",
          "/hourly-service",
          "/city-to-city",
          "/fleet",
          "/blog",
          "/about",
          "/how-it-works",
          "/faq",
          "/contact",
          ...(REVIEWS_VERIFIED ? ["/reviews"] : []),
          "/for-hotels",
          "/for-drivers",
          "/legal/terms",
          "/legal/privacy",
          "/legal/cookies",
          "/legal/refunds",
          "/legal/imprint",
          "/legal/driver-partnership",
          "/legal/kyc",
          ...ROUTES.map((r) => `/routes/${r.slug}`),
          ...REGIONS.map((r) => `/regions/${r.slug}`),
          ...SERVICES.map((s) => `/services/${s.slug}`),
          ...VEHICLE_CLASSES.map((v) => `/fleet/${v.id}`),
          ...POSTS.map((p) => `/blog/${p.slug}`),
          ...listIndexableAirports().map((a) => `/airports/${a.slug}`),
          ...listIndexablePorts().map((p) => `/ports/${p.slug}`),
          ...AIRPORT_ROUTES.map((r) => `/airports/${r.airportSlug}/${r.routeSlug}`),
          ...listCityDestinations().map((c) => `/cities/${c.slug}`),
          ...MARKET_HUB_CITIES.map((c) => `/cities/${c.slug}`),
          "/for-travel-agencies",
        ]);
        const lastModified = new Map<string, string>([
          ...listLiveMarkets().map((market) => [`/${market.slug}`, market.lastModified] as const),
          ...POSTS.map(
            (post) => [`/blog/${post.slug}`, post.updatedAt ?? post.publishedAt] as const,
          ),
        ]);

        const alternates = (path: string) =>
          [
            ...PUBLIC_LOCALES.map(
              (l) =>
                `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE_URL}${localePath(l, path)}"/>`,
            ),
            `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${localePath("en", path)}"/>`,
          ].join("\n");

        const urls = [...paths]
          .flatMap((path) => {
            const modified = lastModified.get(path);
            const lastmod = modified ? `\n    <lastmod>${modified}</lastmod>` : "";
            return PUBLIC_LOCALES.map(
              (locale) =>
                `  <url>\n    <loc>${SITE_URL}${localePath(locale, path)}</loc>${lastmod}\n${alternates(path)}\n  </url>`,
            );
          })
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
