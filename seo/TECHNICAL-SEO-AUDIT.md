# Technical SEO Audit

Metrics: GSC **NOT AVAILABLE** · GA4 **NOT AVAILABLE** · Ahrefs **NOT AVAILABLE**.

## Implementation update — 2026-08-23

- **FIXED IN REPOSITORY:** locale-aware schema IDs and breadcrumbs, one shared Organization entity, visible FAQ schema, `noindex, follow`, public-language schema/`llms.txt` alignment, social metadata, a noindex `/touristas-ai` route, private-route robots rules, sitemap locale/lastmod generation and 404 noindex.
- **MITIGATED:** generated market-airport pages now use native quote-safe copy, no fabricated starting price and no instant-booking promise.
- **BLOCKED EXTERNAL:** production still serves the baseline deployment until these changes are released; sitemap submission, indexing and event receipt require production/GSC/Plausible access.
- **HELD BY DESIGN:** Dutch and Spanish remain outside `PUBLIC_LOCALES`, sitemap and hreflang pending native human QA.

## Findings

| Priority | Finding | Evidence | Confidence | Required validation |
|---|---|---|---|---|
| P0 | Production sitemap exposes only `/lander`, not the repository URL set | Requested live baseline; repository generator at `src/routes/sitemap[.]xml.ts:20-79` | High | Fetch live XML after deployment; compare URL count and samples |
| P0 | Live and repository robots policies differ | Live baseline allows all and has `LLM-Policy: /llms.txt`; repository blocks private paths at `public/robots.txt:5-55` | High | Fetch headers/body from production and confirm desired policy |
| P1 | Localized page schema can point to English-root URLs | Airport schema uses `${SITE_URL}${path}` and English-root breadcrumbs at `src/routes/{-$locale}/airports.$slug.tsx:70-74,117-134`; similar patterns appear in route/blog templates | High | Test an `el/de/fr/it` URL in Rich Results and inspect JSON-LD URLs |
| P1 | Programmatic airport pages remain a scaled-content risk | Global fallback is ~8,927 airports (`src/i18n/content/index.ts:176-178`); indexability allows airports in live markets (`src/lib/indexable-airports.ts:61-68`) | High | Sample 25 generated pages per market for uniqueness/usefulness |
| P1 | Sitemap has no `<lastmod>` and is built as one URL set | `src/routes/sitemap[.]xml.ts:70-85` | High | Measure resulting URL count/size; split if operationally large |
| P1 | Public-locale alternates are emitted for every path without explicit translation-level validation per page | `src/lib/seo.ts:67-81` | High | Confirm every alternate resolves 200 and has equivalent localized content |
| P2 | `noindex` also sets `nofollow` | `src/lib/seo.ts:65` | High | Decide whether links on non-indexable utility pages should remain discoverable |
| P2 | Default social image is an interim logo rather than a dedicated 1200×630 creative | `src/lib/site.ts:30-36` | High | Validate image response, dimensions and social previews |
| P2 | Root metadata can merge with leaf metadata; implementation comments warn root links cannot dedupe | `src/lib/seo.ts:33-37`; root defaults at `src/routes/__root.tsx:92-131` | Medium | Render representative pages and count title/description/OG tags |
| P2 | Site-wide schema advertises all seven languages although only five are public | `src/lib/structured-data.ts:7-10`; `src/i18n/index.ts:27` | High | Align `availableLanguage`/`inLanguage` with launch policy |
| P2 | `/llms.txt` says seven languages and lists Reviews, but indexable locale/review behavior is conditional | `public/llms.txt:18-19,35`; `src/i18n/index.ts:27`; sitemap condition at `src/routes/sitemap[.]xml.ts:38` | High | Reconcile machine-readable claims with production truth |

## Positive implementation evidence

- Absolute canonical source of truth: `src/lib/site.ts:1-4`.
- Metadata length handling: title 65 and description 160 characters (`src/lib/seo.ts:17-31`).
- Canonical, hreflang and x-default are centralized (`src/lib/seo.ts:48-80`).
- Unknown locale prefixes 404 (`src/routes/{-$locale}/route.tsx:4-12`).
- Non-public locales become `noindex, follow` and receive no canonical/hreflang (`src/lib/seo.ts`).
- Airport aliases are prevented from becoming duplicate indexable URLs (`src/lib/indexable-airports.ts:75-88`).
- Airport directory groups all indexable airports to reduce orphaning (`src/lib/indexable-airports.ts:106-137`).
- Utility/auth/transactional pages explicitly noindex through route heads; repository robots also blocks key private paths [High].

## Production QA sequence

1. Fetch `/robots.txt`, `/llms.txt`, `/sitemap.xml` and record status, content type, redirects and cache headers.
2. Compare production sitemap against repository families: home, market, route, region, service, fleet, blog, airport, port, airport-route and city.
3. Test one URL per template and per public locale for status, rendered title, description, canonical, hreflang reciprocity, language attribute and JSON-LD.
4. Confirm `nl/es` return either intentional noindex pages or are unavailable; do not let them enter sitemap/hreflang before approval.
5. Crawl for orphan pages, redirect chains, duplicate titles/descriptions, soft 404s and parameter variants.
6. Submit the corrected sitemap in GSC and monitor discovered/indexed deltas. GSC metrics are currently **NOT AVAILABLE**.

Repository fixes are confirmed by local SSR and build checks in `SEO-QA.md`; production impact is not claimed before deployment and measurement.
