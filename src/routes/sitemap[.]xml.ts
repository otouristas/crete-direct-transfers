import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { ROUTES } from "@/data/routes";
import { REGIONS } from "@/data/regions";
import { SERVICES } from "@/data/services";
import { VEHICLE_CLASSES } from "@/data/routes";

// TODO: replace with your project URL once a project name or custom domain is set.
const BASE_URL = "";

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
        ];

        const urls = paths
          .map(
            (p) =>
              `  <url>\n    <loc>${BASE_URL}${p}</loc>\n    <changefreq>weekly</changefreq>\n  </url>`,
          )
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

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
