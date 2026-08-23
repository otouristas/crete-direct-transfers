# Internal Linking Audit

Metrics: GSC **NOT AVAILABLE** · GA4 **NOT AVAILABLE** · Ahrefs **NOT AVAILABLE**.

## Current strengths

- Sitemap families are backed by index directories for airports, cities, routes, regions, services, fleet, blog and ports (`src/routes/sitemap[.]xml.ts:24-38`) [High].
- Airport directory grouping is explicitly designed to prevent orphan indexable airports (`src/lib/indexable-airports.ts:106-137`) [High].
- Route pages show up to three related routes from the same region (`src/routes/{-$locale}/routes.$slug.tsx:218-227`) [High].
- Blog posts carry explicit related slugs and the template resolves them per locale (`src/data/posts.ts:21`; `src/routes/{-$locale}/blog.$slug.tsx:90-96`) [High].
- City pages link to matching airports, airport routes and nearby cities (`src/routes/{-$locale}/cities.$slug.tsx:87-105,139-150`) [High].

## Gaps

1. **Legacy route vs airport-route overlap** [P1, Medium]. Both `/routes/{slug}` and `/airports/{airport}/{route}` can target the same corridor. Define a primary URL and use the secondary page for a genuinely different intent, or consolidate.
2. **Editorial-to-money-page links are sparse/implicit** [P1, Medium]. Each guide should link contextually to the exact airport, route, service and policy page—not only related articles and a generic CTA.
3. **City hubs may remain shallow** [P1, High]. Generic pages need links to locally relevant routes, airports, regions and guides with descriptive anchors.
4. **Country hubs need full child discovery** [P1, Medium]. Ensure every indexable market airport/city is linked from its country and directory pages within a few clicks.
5. **Policy/support content should support commercial claims** [P2, High]. Link waiting-time, cancellation, refunds, child-seat and licensing claims to the relevant policy/evidence page.

## Recommended link model

- Home → countries / airports / routes / services.
- Country → airports + cities + country-specific guidance.
- Airport → top destination routes + city + comparison guide + booking.
- Airport route → airport + destination + relevant service + related route guide.
- City → nearest airports + top inbound/outbound routes + region + local guide.
- Blog → one primary commercial page + one supporting policy/service page + two related articles.
- Legal/policy → relevant commercial explanations where useful; commercial pages → policy evidence.

## Anchor guidance

Use descriptive, localized anchors such as “Heraklion Airport to Elounda transfer” or “child seats for Crete airport transfers.” Avoid sitewide exact-match repetition and generic “learn more.” Preserve locale paths through the router.

## QA

- Crawl each public locale and flag indexable pages with zero inlinks.
- Flag pages deeper than four clicks from a hub.
- Compare sitemap URLs to crawl-discovered URLs.
- Detect links from public pages to noindex/auth/private paths.
- Verify translated anchors do not point to English URLs.

Confidence is **Medium** until a rendered crawl is available.
