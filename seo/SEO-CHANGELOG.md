# SEO Changelog

## 2026-09-17 — Public-launch pass

- Route guides, hotel/resort areas and ferry ports are English-only long-form content. They now publish one indexable URL each (English, self-canonical, no locale alternates); every other locale renders the same body as `noindex, follow` with a visible language note, and the sitemap lists only the English URL. Previously all five public locales were in the sitemap and hreflang clusters with identical English bodies.
- Named driver profiles (`/drivers`) are gated behind `VITE_DRIVER_PROFILES_VERIFIED` like reviews and business metrics: `noindex`, out of the sitemap, footer and cross-links until each driver has consented and ratings/transfer counts are backed by records.
- Page chrome on the four editorial families (headings, labels, CTAs, meta titles/descriptions) moved into the seven dictionaries; the hardcoded-copy gate is green again.
- `llms.txt` now states the five public languages (Dutch and Spanish remain held) and lists the editorial families.
- Organization `logo` points to a 512×512 PNG (`/icons/icon-512.png`); the default social image is a self-hosted branded 1200×630 card (`/og-default.png`) instead of a Pexels stock URL; PWA manifest and `apple-touch-icon` use real PNG icons.
- Performance: UI dictionaries and long-form content overlays are code-split per locale and loaded only for the active language (server preloads all). Main client chunk 2,958 KB → 804 KB; shared i18n chunk 854 KB → 150 KB. A visitor no longer downloads six other languages' content.
- Verification: SSR probe of representative routes (all locales, editorial families, private routes, 404s), sitemap composition, and a headless-browser hydration/console/locale-switch pass on the local Worker preview. Live GSC/Plausible outcomes remain **NOT AVAILABLE** until deployment.
- Brand mark redrawn from supplied artwork and regenerated from one vector source for the web favicon, PWA icons (including maskable), Apple touch icon and both Expo apps; Organization `logo` continues to point at the 512×512 PNG.
- `llms.txt` currency count corrected to 29 and the vehicle-class list completed to the eight classes the pricing engine actually offers.
- Added `../LAUNCH.md`: the launch blueprint covering the business model, pricing and payout mechanics, roles, order lifecycle, URL families, indexation and answer-engine policy, performance budget, environment, and the pre-launch checklist.

## 2026-08-23 — Audit workspace created

- Added repository-evidence technical, content, keyword, internal-linking, competitor, AI-search and multilingual audits.
- Added template-level content inventory, QA checklist, content briefs and research capture templates.
- Recorded live baseline supplied for this audit:
  - `https://transferaround.com/sitemap.xml` returns only `https://transferaround.com/lander`.
  - live robots allows all and declares `LLM-Policy: /llms.txt`.
  - repository contains a fuller dynamic sitemap and a more restrictive robots policy.
- Marked GSC, GA4 and Ahrefs metrics **NOT AVAILABLE**.
- Made no ranking claims and no code-fix completion claims.

## 2026-08-23 — Organic growth implementation

- Centralized locale-aware canonical/schema URLs and shared Organization references.
- Aligned structured-data and machine-readable language claims with the five public locales.
- Added visible FAQ schema, social metadata, a noindex Touristas AI page, a 404 noindex directive and a complete five-locale sitemap with truthful lastmod sources.
- Differentiated and cross-linked the 22 overlapping route/airport-route pairs without redirects or destructive canonical changes.
- Reworked generated airport pages to quote mode with native copy and no fabricated starting price.
- Added native country-guide and long-form overlays; kept Dutch/Spanish noindex pending human review.
- Added contextual editorial links, cited child-seat guidance and source rendering.
- Added consent-aware booking, checkout, quote, contact, partner, newsletter, phone, email, WhatsApp and CTA event instrumentation.
- Added the content inventory, URL scores, ICE backlog, briefs, research notes, QA, scorecard and roadmap.
- Corrected stale Wrangler output paths and verified representative SSR routes in a local Cloudflare Worker preview.
- Final typecheck, i18n checks, lint and build pass; 2,490 public URLs plus 996 Dutch/Spanish hold routes pass automated crawl gates. Evidence is recorded in `SEO-QA.md`.

Future entries should record date, owner, affected URL/template, hypothesis, implementation reference, QA evidence, release date and observed result. Keep implementation and outcome separate.
