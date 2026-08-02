# Site audit + expansion plan

I crawled 20 key pages (home, routes, route detail, fleet, book, airports, cities, country hubs, EL/DE locales, contact, FAQ, blog, legal, reviews, services, regions, countries). All returned 200 and rendered a heading. Three real defects surfaced.

## Bugs to fix first

1. **Backend connection crashes the shared preview.** The published/preview bundle throws "Missing Supabase environment variable(s)" at first render, so the whole page shows the error boundary. Locally it works. Fix: make the backend client lazy and non-fatal (return a null client and let auth degrade to signed-out) instead of throwing during render, so a missing key never blanks the site.
2. **Touristas AI page hydration mismatch.** `/touristas-ai` logs a React hydration error and re-renders the whole tree client-side (flicker + wasted work). Cause is non-deterministic content in the chat shell's first render (starter chips / greeting derived at render time). Fix: compute the initial message and chip order deterministically, or render them after hydration.
3. **`/book` has no `<h1>`.** The booking page opens on step 1 with only an `<h1>` on step 2. Fix: give the page a persistent H1 and per-step subheadings — also an SEO and accessibility fix.

Also part of the pass: re-crawl every route (including all 33 route pages and all 7 locales) for 404s, missing meta descriptions, duplicate titles, and broken internal links, and fix what turns up.

## Content and real data expansion

**Real route data.** Replace placeholder distances, durations and prices with a verified matrix: real driving distance/time per corridor (from actual road geometry), a documented pricing formula (base + km rate + vehicle multiplier + night/holiday surcharge), and honest "from" prices. Every route page then shows a price breakdown instead of an unexplained number.

**Depth per page.** Each route page gains: what the pickup point actually looks like (arrivals hall, meeting sign, port quay), typical flight arrival bands, luggage guidance, seasonal notes, drive-time variance in August vs. February, and 3-5 route-specific FAQs. This is the moat competitors cannot copy at scale.

**New page families.**
- Hotel and resort landing pages (`/hotels/$slug`) for the top Cretan properties — very high booking intent.
- Ferry-port arrival pages tied to sailing schedules.
- Driver profile pages (named driver, languages, vehicle, years driving) — the trust layer GetTransfer lacks.
- Comparison pages ("CreteTransfers vs. taxi rank", "vs. bus", "vs. car hire").
- A real guides layer: getting from each airport to each region, driving in Crete, when to book.

**Trust surface.** Verified reviews tied to a booking reference, response times, cancellation stats, and a live "drivers on the road today" figure.

## Design: make it remarkable

The current look is solid but conventional. The redesign pass targets:
- **A signature interaction**: an animated route line drawn across a stylised Crete map on the homepage that traces the corridor as you pick pickup and drop-off — one memorable moment, everything else calm.
- **Editorial rhythm**: full-bleed photography of actual Cretan roads and harbours, asymmetric section layouts, generous type scale, real captions.
- **The quote card as the hero object**: a persistent, beautifully typeset price card that follows the user from route page into checkout, showing exactly what is included.
- **Motion discipline**: scroll-reveal and transitions only where they aid comprehension.
- **Craft details**: real fleet photography instead of icons, hand-set microcopy, dark-mode parity, and a full responsive pass at 390 / 768 / 1440.

I'd run this as a proper redesign round: capture the current pages, have you pick palette, type pairing and layout direction, then render three distinct directions to choose from before any code changes.

## Expanding to more countries

The site already has country hub scaffolding for Greece, Spain, Italy, Portugal, Cyprus and Turkey, but only Greece/Crete has bookable inventory; the rest are quote-only placeholders. The expansion path:

1. **Make the data model market-agnostic** — move routes, airports, cities and pricing rules out of Crete-specific files into per-market datasets with a shared shape, so a new country is data, not code.
2. **Per-market pricing profiles** — currency, VAT treatment, night windows, toll handling, local vehicle classes.
3. **Supply gate** — a country only becomes instantly bookable once it has verified partner drivers; until then the hub stays "request a quote" with a proper quote-request flow and SLA, which is honest and still converts.
4. **Sequence** — Crete first (complete), then the rest of Greece (Athens, Santorini, Rhodes, Corfu), then Cyprus, then Spain's Balearics and Canaries, then Italy and Portugal. Islands first: bounded route sets are where fixed pricing beats the tender model.
5. **Localisation** — the 7-locale system already exists; each new market needs native-quality copy plus locale-correct currency and hreflang, not machine translation.

## Suggested order

1. Fix the three bugs plus the full-crawl sweep.
2. Redesign round (pick direction, then implement).
3. Real route data and pricing transparency.
4. New page families (hotels, ports, drivers, comparisons, guides).
5. Multi-market data refactor and the Greece-wide rollout.

That is a lot for one pass. Tell me if you want all of it in sequence, or start with bugs + redesign and treat the rest as follow-ups.

## Technical notes

- Backend client: soften `src/integrations/supabase/client.ts` consumption path (auth provider, queries) so a missing env yields signed-out state, not a thrown error during render.
- Hydration: make `use-touristas-chat` initial state deterministic; gate any time/random-derived UI behind an effect.
- Data refactor: introduce `src/data/markets/<market>/{routes,airports,cities}.ts` with a shared type, and keep `src/lib/pricing.ts` parameterised by a market pricing profile.
- Every new route file gets its own `head()` with unique title, description, og:title, og:description, and JSON-LD where applicable; sitemap generation extends automatically from the market datasets.
