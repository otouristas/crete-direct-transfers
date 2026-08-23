# Programmatic SEO review

Status: **IMPLEMENTED SAFEGUARDS / PERFORMANCE DATA NOT AVAILABLE**

## Indexable families

- Country, region, service and fleet hubs: bounded source arrays with distinct intent.
- Curated airports and market airports: bounded by live-market indexability; quote mode now has native, claim-safe copy and no fabricated zero-price offer.
- Airport routes: exact airport-arrival intent with route-specific facts and links.
- Crete corridor routes: planning intent, differentiated from airport-arrival pages.
- Cities and ports: market-bounded discovery pages with airport/geographic relationships.
- Blog: six authored source records, not generated at scale.

URL-family scores and actions are in `URL-SCORES.csv`; exact overlaps are in `ROUTE-OVERLAP-INVENTORY.md`.

## Implemented safeguards

- The sitemap uses explicit indexable collections rather than every resolvable IATA fallback.
- Noncanonical airport aliases do not enter public discovery.
- Generated in-market airports use route/flight/passenger inputs, quote confirmation and localized country names.
- Quote-only airport schema omits offers when no truthful starting price exists.
- Empty airport route collections no longer emit an empty `ItemList`.
- Dutch and Spanish remain outside public sitemap/hreflang despite complete application routes.
- Every public sitemap URL passed canonical, hreflang, H1, metadata and JSON-LD parsing checks.

## Investigate after deployment

1. Compare impressions, ranking URLs and bookings for generated airports against curated hubs.
2. Consolidate only pages with no distinct demand, links, conversion value or information gain.
3. Monitor the 22 corridor/arrival pairs before any redirect or canonical decision.
4. Add original meeting-point, access or local-route evidence where a generated page earns demand.
5. Keep global out-of-market IATA fallbacks noindex and outside the sitemap.

No page removal or consolidation is justified without GSC, backlink and conversion evidence.
