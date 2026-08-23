# SEO Executive Summary

Audit basis: repository evidence reviewed 2026-08-23 plus the requested live baseline. No ranking, crawl, backlink, conversion, or revenue data was available.

## Measurement status

- GSC metrics: **NOT AVAILABLE**
- GA4 metrics: **NOT AVAILABLE**
- Ahrefs metrics: **NOT AVAILABLE**
- Rankings / share of voice: **NOT AVAILABLE — not inferred or fabricated**

Confidence labels: **High** = directly observed in code/live baseline; **Medium** = strong implementation inference; **Low** = hypothesis requiring SERP or analytics validation.

## Implementation outcome

The repository implementation now scores **84/100** against the documented technical, content, multilingual, internal-linking and measurement rubric (baseline **61/100**). All 2,490 public sitemap URLs pass the final local SSR crawl with zero structural failures and zero duplicate title/description groups. Dutch and Spanish long-form routes are complete enough for automated QA but remain noindex pending native human review. Production deployment, GSC processing and organic outcomes remain **BLOCKED / NOT AVAILABLE**.

## Baseline and highest-priority finding

**P0 — live/repository sitemap drift [High].** The live `https://transferaround.com/sitemap.xml` currently returns only `https://transferaround.com/lander`, while the repository contains a much fuller dynamic sitemap covering directories, markets, routes, regions, services, fleet, posts, airports, ports, airport routes and cities across five public locales (`src/routes/sitemap[.]xml.ts:20-79`; `src/i18n/index.ts:27`). This is the clearest organic-discovery blocker. It indicates deployment or routing drift; it does **not** prove the repository implementation is deployed or correct.

The requested live baseline also shows robots allowing all crawlers and advertising `LLM-Policy: /llms.txt`. Repository `public/robots.txt` instead disallows private/transactional paths and references the sitemap (`public/robots.txt:5-57`). Preserve the useful `/llms.txt` discovery behavior, but reconcile live and repository policies deliberately.

## What is strong

- Central metadata builder emits title, description, canonical, public-locale hreflang, x-default, Open Graph and optional JSON-LD (`src/lib/seo.ts:39-91`) [High].
- English is root; Greek, German, French, Italian, Dutch and Spanish have URL prefixes (`src/i18n/index.ts:15-18`) [High].
- Only `en/el/de/fr/it` are currently public/indexable; `nl/es` are intentionally noindexed through the shared head logic (`src/i18n/index.ts:19-29`; `src/lib/seo.ts:49-80`) [High].
- Repository sitemap avoids indexing all ~8,900 airport fallbacks and uses an explicit indexability gate (`src/lib/indexable-airports.ts:1-18,45-88`) [High].
- Six expert-attributed articles, 32 fixed-price route records, 18 curated airports, 77 airport-route records, six services and four regions provide a substantial evidence base [High].
- Organization and WebSite entities exist site-wide; page templates add Article, FAQPage, Service, TaxiService, BreadcrumbList and ItemList where relevant (`src/lib/structured-data.ts:15-58`) [High].

## Main risks and opportunities

1. **Restore a complete production sitemap and verify submitted/processed URLs** [P0, High].
2. **Reconcile live robots, repository robots and `/llms.txt` claims** [P0, High].
3. **Reduce programmatic-page quality risk.** In-market airport pages can be indexed with generated copy, and city pages rely heavily on generic templates (`src/lib/indexable-airports.ts:9-15`; `src/routes/{-$locale}/cities.$slug.tsx:122-136`) [P1, High].
4. **Locale consistency in structured data — FIXED IN REPOSITORY.** Page entities and breadcrumbs use locale-aware canonicals and one shared Organization ID [P1, High].
5. **Publish Dutch and Spanish only after human QA.** Long-form overlays and generated airport/market copy are complete; current policy correctly keeps them noindex until native sign-off [P1, High].
6. **Build intent clusters around airport-to-resort routes, ports, family travel, late arrivals, groups and price comparisons** [P1, Medium].
7. **Strengthen entity and citation evidence:** operating areas, licensing proof, policies, author profiles, update dates and independently verifiable sources [P1, Medium].

## 90-day order of operations

- Days 0–7: production sitemap/robots verification, indexability QA, canonical/hreflang/schema tests.
- Days 8–30: refresh highest-value Crete airport/route hubs; add contextual internal links; validate factual/pricing claims.
- Days 31–60: publish the first new intent cluster and locale-specific briefs for public locales.
- Days 61–90: expand only where GSC/GA4 evidence supports it; begin Dutch/Spanish launch QA if translation is genuinely complete.

Repository changes and local QA are complete. No production deployment, ranking, traffic, conversion or revenue outcome is claimed.
