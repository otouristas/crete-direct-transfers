# Multilingual SEO Audit

## Current model

- Supported application locales: `en/el/de/fr/it/nl/es` (`src/i18n/index.ts:1-9`) [High].
- English uses root URLs; all others use locale prefixes (`src/i18n/index.ts:15-18,35-39`) [High].
- Public/indexable locales are only `en/el/de/fr/it` (`src/i18n/index.ts:19-29`) [High].
- Shared SEO logic emits alternates only for public locales and x-default to English (`src/lib/seo.ts:67-80`) [High].
- Non-public locale pages receive `noindex, follow` and no canonical/alternates (`src/lib/seo.ts`) [High].

## Key findings

1. **Keep Dutch and Spanish out of indexation until native human approval** [P1, High]. Long-form overlays and generated-airport copy have been implemented, but repository policy correctly excludes both from public signals until route-level sign-off.
2. **Structured-data locale mismatch — FIXED IN REPOSITORY** [P1, High]. Page schema IDs, providers and breadcrumbs now share locale-aware canonical construction.
3. **Site-wide language overstatement — FIXED IN REPOSITORY** [P2, High]. Organization/WebSite schema and `llms.txt` now advertise only the five public locales.
4. **Per-page parity is assumed globally** [P1, Medium]. `buildHead` emits all public alternates for any indexable leaf route. Confirm every translated page is semantically equivalent and 200 before emitting its alternate.
5. **Localized slugs remain English** [P2, Medium]. This is valid, but native-language keyword fit should be tested; do not change slugs without redirect and hreflang planning.
6. **Localized blog dates — FIXED IN REPOSITORY** [P2, High]. Dates use the active locale with a stable UTC time zone.
7. **Schema breadcrumb labels — FIXED IN REPOSITORY** [P2, High]. Route and blog labels use locale dictionaries.

## Launch gate per locale

- Native review of titles, descriptions, H1s, body, FAQs, anchors, legal terms and booking language.
- Zero English fallback in indexable long-form fields.
- Canonical self-reference and reciprocal hreflang.
- Localized schema URLs and labels.
- Currency/service conditions accurate for locale and market.
- Translation terminology glossary signed off.
- Rendered crawl and spot checks across every template.

## Locale status

- `en`: public; source language; highest confidence.
- `el/de/fr/it`: public; native long-form country guides and generated-airport copy implemented; local rendered samples pass.
- `nl/es`: long-form application content implemented but intentionally non-public/noindex; native human review and full route crawl are still required before launch.

Locale workbooks are under `locales/`. Repository implementation is complete; no Dutch/Spanish launch or organic outcome is claimed.
