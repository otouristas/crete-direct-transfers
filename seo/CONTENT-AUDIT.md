# Content Audit

Metrics: GSC **NOT AVAILABLE** · GA4 **NOT AVAILABLE** · Ahrefs **NOT AVAILABLE**. Performance labels below are editorial priorities, not traffic or ranking claims.

## Repository inventory

- 32 fixed-price route records (`src/data/routes.ts:139-572`) [High].
- 18 curated airport records and 77 airport-route records [High, repository counts].
- 77 destination records, whose city/resort/port/POI/beach entries feed directory templates (`src/data/destinations.ts:12-127`) [High].
- Six services (`src/data/services.ts:14-112`), four regions, eight vehicle classes and six blog posts (`src/data/posts.ts:27-322`) [High].
- Six published/live country markets: Greece, Spain, Italy, Portugal, Cyprus and Turkey (`src/data/markets.ts:22-191`) [High].
- 63 route component files, including public, utility, auth and driver/account templates [High].

## Quality by page family

### Strongest: authored airport and fixed-price route pages [High]

Airport pages include terminal/pickup facts, comparison tables, FAQs, local insights and schema (`src/data/airports.ts:47-157`; `src/routes/{-$locale}/airports.$slug.tsx:66-139`). Route pages include distance, duration, live price logic, localized FAQs and related routes (`src/routes/{-$locale}/routes.$slug.tsx:147-196,218-227`). These are the most commercially aligned assets.

Action: prioritize factual review, pricing consistency, update dates, proof of licensing and clearer links between airport, destination, route and booking pages.

### Strong: editorial guides [High]

Six posts cover Heraklion–Chania transport, taxi comparisons, Souda arrivals, child seats, late-night arrivals and Chania Old Town. They have named operational authors, dates, FAQs and related-post links (`src/data/posts.ts:24-27`; `src/routes/{-$locale}/blog.$slug.tsx:33-68,90-96`).

Risk: several factual claims (public transport schedules/prices, laws, airport traffic, taxi fares) need cited sources and dated review. Author names/roles should have profile or organization corroboration.

### Medium: service, region, fleet and country hubs [Medium]

The data structures are useful and intent-aligned, but these families are mostly broad category pages. Country expansion markets are quote-mode and can outrun proof of supply. The market model supports useful search intents (`src/data/markets.ts:35-42,62-69,93-100`) but some later markets have empty `searchIntents` (`src/data/markets.ts:123,148,168`).

Action: add market-specific proof, response-time expectations, operating-area limits, partner vetting and genuinely local transport guidance before scaling.

### Weakest: generic city and generated airport pages [High]

City pages use generic title/description/intro functions and primarily assemble airport/route links (`src/routes/{-$locale}/cities.$slug.tsx:55-61,122-136`). Global airport fallback content can render for ~8,927 airports, while live-market gating permits a broad subset to index (`src/i18n/content/index.ts:176-178`; `src/lib/indexable-airports.ts:61-68`).

Action: require a minimum unique-content standard before indexation: local pickup logistics, terminal detail, realistic corridors, regulatory/supply proof, transport comparison, FAQs and reviewed update date.

## Accuracy and trust issues to resolve

- Child-seat pricing conflict — **FIXED IN REPOSITORY**: airport FAQs now defer to the fee shown by the booking flow, while the current Crete form and guide state `+€10`. The owner must still confirm the production policy [High].
- Claims about taxi prices, bus frequency, licences, waiting time and tolls need source/date ownership [Medium].
- `/llms.txt` states seven languages and lists Reviews without reflecting five-locale public policy and conditional review verification (`public/llms.txt:18-19,35`; `src/i18n/index.ts:27`) [High].
- Country/city expansion language must not imply instant local supply where the product is quote-confirmed [High].

## Keep / improve / consolidate / noindex

- **Keep and improve:** core airports, route pages, airport-route pages, service pages, six articles.
- **Improve before scaling:** cities, country markets, market-hub airports, ports.
- **Consolidate where overlap is not differentiated:** legacy route pages versus airport-route pages targeting the same origin/destination [Medium; requires rendered-URL crawl].
- **Keep noindex:** booking, success, auth, account, driver/ops and unapproved locales.
- **Noindex candidates:** low-information generated airports/cities until minimum standards pass.

See `CONTENT-INVENTORY.csv` for template-level decisions. No content changes are claimed complete.
