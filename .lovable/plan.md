# Platform Polish: Localization, Conversion, Dashboards

Goal: bring the public site and both dashboards to a level that stands next to GetTransfer and Transfeero — fully localized in all 7 languages, conversion-optimized booking, and dashboards that look and read like a real product.

## What the audit found (verified in code)

- **Prices are half-English.** `src/lib/pricing.ts` builds the fare breakdown with hardcoded labels: "Child seat", "Extra stop", "Night surcharge (22:00–06:00)", "Return trip", "Return discount (−5%)", "<Class> vehicle". A Greek or German traveller sees English line items in the quote, the booking summary and the confirmation.
- **Dates are always English.** `date-fns` is imported in the account dashboard, booking flow, driver jobs and booking widget with no locale — no file in the project imports `date-fns/locale`. Month and weekday names render in English in every language.
- **Currency preference is ignored in dashboards.** A full multi-currency module exists (`src/lib/currency.ts`, 30 currencies) and profiles store `preferred_currency`, but the account and driver screens format with `formatEur`.
- **Translation keys are complete** — all 6 non-English locales have every key English has (0 missing). The gaps are the hardcoded strings above, not the dictionaries.
- **`llms.txt` is out of date**: it lists site languages as English, Greek, German, French, Italian; the site actually ships 7 (adds Dutch and Spanish).
- Sitemap, robots and the locale-prefixed routing are in good shape and only need the new pages added.

## Workstream 1 — Localization completeness

- Move every pricing breakdown label to translation keys and return label *codes* from the pricing engine, formatting them in the UI. Covers quote preview, booking step 2, success page, account booking detail and driver job detail.
- Add a shared `dateLocale(locale)` helper mapping the 7 locales to `date-fns` locales; use it in every `format`, calendar and day-picker instance so months, weekdays and relative times localize.
- Route all customer-facing money through the currency module with the profile's `preferred_currency` (EUR stays the settlement currency, with an "charged in EUR" note where a converted price is displayed).
- Add a currency + language switcher to the account settings and the header (competitors both have this above the fold).
- Sweep every route and component for remaining literal UI strings, add keys, and translate them properly per language — not machine-literal copies.
- Refresh `llms.txt` (7 languages, contracts/legal pages, current coverage) and add the newer pages to the sitemap.

## Workstream 2 — Booking flow CRO

Benchmarked against GetTransfer/Transfeero patterns:

- Price transparency block on the quote step: what's included (meet & greet, 60 min airport waiting, flight tracking, free cancellation window) as icons, plus an explicit "no hidden fees, price is final" line.
- Trust rail through the whole funnel: verified review count, licensed-driver badge, secure-payment marks, and a live "X transfers booked this week" style social proof element on route pages.
- Sticky mobile price bar with the CTA, so the price and "Book" are always visible during scroll.
- Vehicle class cards with real photos, passenger/luggage capacity and a clear price delta rather than a plain list.
- Abandonment recovery: keep the quote in the URL and local storage so a returning visitor lands back on their price.
- Booking widget: recent searches, popular route suggestions, and inline validation messages in the active language.

## Workstream 3 — Customer dashboard

The bookings list already has tabs, search, date-range filter, sort and pagination. What it lacks is the surrounding product:

- **Overview header**: next transfer countdown card with driver name/photo/vehicle and plate once assigned, WhatsApp and call buttons, meeting-point instructions, and live status (assigned → en route → completed).
- **Booking detail redesign**: timeline of the trip, price breakdown in the user's language and currency, invoice/receipt PDF download, flight-tracking status, change/cancel with refund preview.
- **Saved travellers and addresses** surfaced as a managed section (the table exists) so rebooking is two clicks.
- **Rebook / repeat trip** action from any past booking, and a "book the return" prompt on one-way trips.
- Empty, loading and error states designed rather than plain text.

## Workstream 4 — Driver dashboard

- **Today view**: today's earnings, jobs remaining, online toggle with clear status, next pickup card with navigation deep link.
- **Job cards** upgraded: distance, estimated duration, net payout after commission, passenger and luggage counts, urgency/incentive badges, accept countdown ring on offers.
- **Earnings**: pending / available / paid summary tiles with a sparkline of the last 8 weeks, payout schedule control, penalty and incentive entries explained in plain language, and CSV export.
- **Performance**: reliability score with what moves it, acceptance rate, completion rate, and a suspension explainer.
- **Compliance strip**: document expiry warnings, onboarding status, contract signature status linking to the agreements page.
- Full translation of every driver string (job states, penalty reasons, ledger entry types) across all 7 languages.

## Workstream 5 — Design system pass

- Tighten spacing, typographic scale and card treatments across public pages and dashboards so both halves of the product feel like one brand.
- Consistent status colour semantics (pending / confirmed / en route / completed / cancelled) as tokens in `src/styles.css`, used by badges everywhere.
- Real photography slots for fleet and destination cards, with proper `alt` text per language.
- Responsive audit at 390px, 768px and 1440px for the booking funnel and both dashboards.

## Technical notes

- Pricing engine changes are label-only: the numeric logic, quote hashing and stored `breakdown` JSON keep working; the engine emits `{ code, params, amountEur }` and the UI renders the localized string.
- Currency conversion stays presentational; bookings, earnings, penalties and payouts remain EUR in the database.
- Date locale mapping lives in one module so no component imports `date-fns/locale` directly.
- No schema changes are required for Workstreams 1, 2, 3 and 5. Workstream 4's earnings sparkline reads existing `driver_earnings` rows; no new tables.

## Suggested order

1. Localization completeness (prices, dates, currency, llms.txt) — it affects every screen.
2. Customer dashboard, then driver dashboard.
3. Booking flow CRO.
4. Design system pass and responsive audit.
