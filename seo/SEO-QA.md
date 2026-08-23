# SEO QA

Run date: 2026-08-23. Status key: **PASS / FAIL / PARTIAL / NOT TESTED / BLOCKED**.

## Repository checks

- **PASS** — `npm run check`: application typecheck, i18n package typecheck, hardcoded-copy check, ESLint with zero warnings and production build.
- **PASS** — hardcoded-copy check covered 285 maintained source files with zero findings.
- **PASS** — IDE diagnostics report no lint errors.
- **PASS** — corrected Wrangler Worker entry/assets paths and started a production-style local Cloudflare preview.
- **PASS** — ten representative Worker SSR routes plus robots, `llms.txt` and sitemap returned 200 in the production-style preview.
- **NOT TESTED** — automated unit/integration suite; the repository has no `test` script.
- **PARTIAL** — production build succeeds, but Vite reports large client chunks: main index about 2.9 MB minified/523 KB gzip, i18n about 782 KB/240 KB gzip and IATA data about 615 KB/248 KB gzip. Code splitting remains a performance backlog item.

## Local discovery and indexation

- **PASS** — `/robots.txt`: 200, `text/plain`, 1,355 bytes, private-path exclusions and canonical sitemap declaration.
- **PASS** — `/llms.txt`: 200, `text/plain`, 3,168 bytes, five public languages and current booking modes.
- **PASS** — `/sitemap.xml`: 200, `application/xml`, 2,145,259 bytes and valid XML.
- **PASS** — sitemap contains 2,490 URLs: 498 each for `en/el/de/fr/it`; `nl/es` count is zero.
- **PASS** — every sitemap URL has six alternates (`en/el/de/fr/it/x-default`); 60 URLs have a source-backed `lastmod`.
- **PASS** — unknown path returns HTTP 404 with `noindex, follow`.
- **PASS** — noindex utility/private route policy remains separate from crawlable public content.

## Full rendered crawl

- **PASS** — all 2,490 public sitemap URLs returned rendered SSR output with zero failures.
- **PASS** — every public URL had the expected `<html lang>`, exactly one title, one meta description, one self-canonical, six hreflang links, one H1 and parseable JSON-LD.
- **PASS** — final crawl found zero duplicate title groups and zero duplicate meta-description groups.
- **PASS** — representative home, country, airport directory, authored airport, generated airport, airport route, corridor route, service, article, FAQ, assistant and 404 pages were inspected directly.
- **PASS** — localized schema providers/IDs reference the shared Organization entity and localized canonical.
- **PASS** — the full-page assistant is `noindex, follow`, has one H1, no console errors and no horizontal overflow at 390×844.
- **NOT TESTED** — third-party Google Rich Results, Schema.org validator and social-card preview tools.

## Dutch and Spanish launch gate

- **PASS** — 996 held-locale route variants (`498 × 2`) returned expected structure with zero automated failures.
- **PASS** — each rendered with `lang=nl/es`, `noindex, follow`, no canonical, no hreflang and one H1.
- **PASS** — known English fallback passages were absent; country guides, market-airport details and generated-airport copy render natively.
- **BLOCKED** — native human route-by-route review. Dutch and Spanish therefore remain outside `PUBLIC_LOCALES`, sitemap and hreflang.

## Content, links and conversion

- **PASS** — instant Crete booking and quote-confirmed external markets are distinguished in page copy and schema.
- **PASS** — child-seat airport copy no longer conflicts with the booking flow; any applicable fee is disclosed before confirmation.
- **PASS** — relevant blog CTAs and all 22 route/airport-route pairs use locale-preserving contextual links.
- **PASS** — consent-aware repository events cover booking CTA, phone, email, WhatsApp, booking/quote submission, checkout start, newsletter, contact and partner inquiry.
- **BLOCKED** — owner verification for legal entity fields, support hours, prices, waiting, cancellation, driver/licensing and named-author claims.

## Production and external data

- **BLOCKED** — deployment. The live baseline supplied for this audit still exposes only `/lander` in the public sitemap until this repository is released.
- **BLOCKED** — GSC property, sitemap processing, query/landing-page baselines and indexing outcomes are **NOT AVAILABLE**.
- **BLOCKED** — production Plausible event receipt and conversion baselines are **NOT AVAILABLE**.
- **BLOCKED** — Ahrefs rankings, links and competitor traffic are **NOT AVAILABLE**.

Do not close the production sitemap P0 until the release is fetched on the public domain and processed in GSC.
