# Fix the crash, add travel agents, go global

## 1. Fix the "Something went wrong" screen

The preview build throws at first render because the backend client throws when its keys are absent in that bundle, and the throw happens during rendering, so the whole page falls into the error boundary.

Fix: never throw during render. The client returns a signed-out, no-op state when keys are missing, auth degrades to logged-out, and public pages (home, routes, airports, countries) render fully without a backend. The crash screen disappears for good.

## 2. Finish the database restore (cause of the remaining code errors)

Three schema layers from the repo still aren't in the database, and everything that reads them is broken:

- device tokens (push notifications)
- driver onboarding submissions + driver documents (used by the driver application flow and the ops review screen)
- profile preferences (language, currency)

Symptoms today: the ops review page, the driver onboarding component, and the push/dispatch server code all fail to compile. Applying these three migrations, then regenerating types, clears every outstanding error. After that a full typecheck must pass with zero errors.

## 3. Travel agents alongside partners

Today there are partner surfaces for hotels and for drivers only. Add a third:

- `/for-travel-agents` — a dedicated partner page: agency commission model, group and multi-leg bookings, named-driver guarantees, invoicing, and a signup form.
- Add "Travel agents" to the header partner menu and the footer partner column, in every locale.
- The contact form gains a "travel agent" topic so enquiries are routed and reported separately.
- The existing partner dashboard gains an `agency` member role next to `dispatcher`/`driver`: agencies see the bookings they referred, their commission, and can create bookings on behalf of clients. This reuses the referral tables already in place.

## 4. Global destinations

Today only Greece/Crete has real bookable inventory; Spain, Italy, Portugal, Cyprus and Turkey are quote-only shells, which is why nothing feels new.

- Make routes, airports and cities per-market datasets with one shared shape, so adding a country is data, not code.
- Add real inventory for a first global wave: Spain (Barcelona, Malaga, Alicante, Palma, Tenerife), Italy (Rome, Milan, Naples, Catania), Portugal (Lisbon, Faro, Porto), Cyprus (Larnaca, Paphos), Turkey (Antalya, Istanbul, Dalaman), plus the rest of Greece (Athens, Thessaloniki, Rhodes, Corfu, Santorini). Each airport gets its own page with its real top corridors, distances, drive times and "from" prices.
- Per-market pricing profiles: currency, VAT treatment, night windows, tolls, local vehicle classes.
- Countries a driver network doesn't cover yet stay honest: instant quote, request-to-book, stated response time — not a fake instant booking.
- Sitemap, hreflang and the 7 locales extend automatically from the new datasets.

## 5. Redesign so it visibly changes

A proper redesign round rather than tweaks: I capture the current pages, you pick palette, type pairing and layout direction, then I render three distinct directions and you choose one before any code is written. The direction you pick gets implemented across home, route pages, airport pages, country hubs and booking.

The redesign targets a global operator look, not a single-island brochure: a world map entry point that resolves down to country, airport, then corridor; the price quote card as the persistent hero object across the whole funnel; full-bleed location photography; editorial type scale; motion only where it aids comprehension; full dark-mode and 390/768/1440 responsive parity.

## Order

1. Crash fix + database restore + zero type errors.
2. Travel agents surface.
3. Redesign round (you pick a direction).
4. Global destination data and new country/airport pages.

## Technical notes

- Backend client: remove the throw in the accessor path; expose a null-safe client and make auth/profile queries tolerate it.
- Migrations to apply: `20260724200000_push_device_tokens`, `20260728174400_production_accounts_and_driver_onboarding`, plus the profile locale/currency columns that `account.profile.tsx` writes. Regenerate `src/integrations/supabase/types.ts` afterwards.
- `src/server/dispatch.ts` null-vs-undefined mismatches get fixed in the same pass.
- New market data at `src/data/markets/<market>/{routes,airports,cities}.ts` with a shared type; `src/lib/pricing.ts` parameterised by market pricing profile.
- Travel agent role added to `partner_members.role` with matching access rules; new route file with its own head metadata and JSON-LD.
