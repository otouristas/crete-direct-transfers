# TransferAround — Launch Blueprint

Business model, product structure, and organic-growth strategy for the public
launch. Every number here is taken from the code or the database migrations and
is annotated with where it lives, so this file can be checked against the
repository rather than trusted.

- **Product**: fixed-price private airport, port and city-to-city transfers.
- **Launch market**: Crete (instant booking). Five more countries run in quote mode.
- **Stack**: TanStack Start (React 19) SSR on Cloudflare Workers · Supabase · Stripe.
- **Surfaces**: public website, customer dashboard, driver dashboard, partner
  inbox, operations console, and two Expo apps (driver, rider).

---

## 1. Business model

### 1.1 What is sold

A private, door-to-door vehicle with a named licensed driver, at a price agreed
before booking. Not shared, not metered, no bidding, no surge. The traveller
picks up and drops off anywhere: airport, port, hotel, town or plain address.

Two purchase modes exist and the site never blurs them:

| Mode        | Where                                                  | What the traveller gets                                     |
| ----------- | ------------------------------------------------------ | ----------------------------------------------------------- |
| **Instant** | Crete (fixed corridors and distance-priced trips)      | Final price, bookable and payable online immediately        |
| **Quote**   | Rest of Greece, Spain, Italy, Portugal, Cyprus, Turkey | A route-specific price confirmed by the team before payment |

The mode is resolved server-side per route, not guessed in the UI
(`src/lib/quote-engine.ts`, `resolveBookable`). Market defaults live in
`src/data/markets.ts` (`bookableDefault`).

### 1.2 Coverage at launch

Six live markets (`live: true` in `src/data/markets.ts`): Greece (instant),
Spain, Italy, Portugal, Cyprus, Turkey (quote). Five territories carry their own
fare parameters (`src/data/territories/`): Crete, Athens, Santorini, Cyprus,
Costa del Sol.

| Asset                          | Count | Source                                 |
| ------------------------------ | ----- | -------------------------------------- |
| Fixed-price Crete corridors    | 32    | `src/data/territories/crete/routes.ts` |
| Airport-to-destination routes  | 81    | `src/data/airport-routes.ts`           |
| Airports with an authored page | 18    | `src/data/airports.ts`                 |
| Hotel and resort areas         | 8     | `src/data/hotels.ts`                   |
| Ferry ports                    | 6     | `src/data/ferry-ports.ts`              |
| Long-form route guides         | 6     | `src/data/route-guides.ts`             |
| Service categories             | 6     | `src/data/services.ts`                 |
| Editorial articles             | 6     | `src/data/posts.ts`                    |
| Indexable URLs in the sitemap  | 2,618 | `/sitemap.xml`, measured               |

Beyond the authored set, any of the 8,927 IATA airports resolves to a
quote-mode page with native generated copy and no fabricated starting price
(`src/lib/airport-resolve.ts`, `src/i18n/generated-airport-copy.ts`).

### 1.3 Pricing engine

All logic is in `src/lib/pricing.ts`. Prices are computed server-side and
persisted to a `quotes` row before checkout, so the browser cannot alter a fare.

**Base fare.** A fixed corridor uses its published `basePriceEur`. Anything else
is distance-priced per territory: `max(floor, round(km × perKm))`. Crete is
`floor €35`, `€1.15/km` (`src/data/territories/crete/index.ts`).

**Vehicle multiplier.** The base is multiplied by the class:

| Class           | Multiplier | Capacity               |
| --------------- | ---------- | ---------------------- |
| Economy         | 1.00       | 1–3 passengers, 3 bags |
| Standard Class  | 1.25       | 1–3 passengers, 3 bags |
| Van Standard    | 1.60       | 1–7 passengers, 7 bags |
| SUV             | 1.80       | 1–6 passengers, 6 bags |
| Van First Class | 2.00       | 1–6 passengers, 6 bags |
| First Class     | 2.10       | 1–3 passengers, 3 bags |
| Minibus 12      | 2.40       | up to 12 passengers    |
| Minibus 16      | 2.80       | up to 16 passengers    |

**Extras** (flat, EUR): child seat 10, extra stop 15, meet & greet with sign 10.

**Night surcharge**: +15% on the leg subtotal when that leg's pickup falls
between 22:00 and 06:00. Each leg of a return is tested on its own time.

**Return trips**: the second leg is priced like the first (its own night check),
then 5% comes off the combined total.

**Hourly hire**: €45/hour × vehicle multiplier, clamped to 2–12 hours, with the
same night rule.

Fare lines are emitted as language-independent codes (`PriceLineCode`) and
rendered through the locale catalogs, so a Greek or German traveller never sees
an English line item in a quote, confirmation or receipt.

### 1.4 Revenue

**Commission.** The platform keeps a percentage of every completed fare,
default **15%** (`commission_bps = 1500`, `platform_settings`). It is a single
admin-editable row, so the rate can move without a deploy. When a booking
completes, a `driver_earnings` row is written with `gross_cents`,
`commission_cents` and `net_cents`, and mirrored into the driver's ledger.

**Settlement.** Every booking, payout, penalty and refund is denominated in EUR.
The header offers 29 display currencies (`src/lib/currency.ts`); conversion is
presentational only and a converted price carries a "charged in EUR" note.

**Payments.** Card via Stripe Checkout on instant routes, or pay-on-board where
a route allows it. The Stripe webhook is verified and idempotent
(`stripe_webhook_events`, `process_stripe_checkout_event`).

**Payouts.** Stripe Connect Express per driver. Earnings mature after a holding
period (default **24 hours**, `holding_period_hours`), then become available.
Schedules are weekly, monthly, or instant where Stripe marks the account
eligible. Minimum payout **€20** (`min_payout_cents = 2000`).

**Worked example** — Heraklion Airport to Elounda, Standard Class, one way,
daytime, no extras, at the default commission:

| Line                | Amount                         |
| ------------------- | ------------------------------ |
| Base fare × 1.25    | as published on the route page |
| Platform commission | 15% of gross                   |
| Driver net          | 85% of gross                   |

The driver dashboard shows exactly these three numbers per job before the
driver accepts it, which is the core of the recruitment pitch.

### 1.5 Driver economics and accountability

- **85% of every fare** to the driver at the default rate, shown as net payout
  on each job card before acceptance (`src/routes/{-$locale}/driver.index.tsx`).
- **Reliability score** out of 100 over a rolling 90 days, moved by completions,
  cancellations and no-shows (`driver_reliability`,
  `recompute_driver_reliability`). A low score reduces dispatch priority.
- **Driver cancellation penalties**, charged against the driver's ledger and
  recovered from future earnings (`driver_cancellation_tier`, all admin-editable):

  | Notice before pickup | Penalty         |
  | -------------------- | --------------- |
  | 72 hours or more     | none            |
  | 72–48 hours          | 10% of the fare |
  | 48–24 hours          | 25%             |
  | under 24 hours       | 50%             |
  | no-show              | 100%            |

- **Suspension** for repeated failures, with the reason and end date surfaced in
  the driver's own earnings screen rather than hidden.
- **Negative balance** is recovered automatically from later earnings before any
  payout, and disclosed in the dashboard.
- **Contract gate**: a driver cannot be approved until the driver agreement is
  signed online (`require_signed_driver_contract`). Signatures store a SHA-256
  fingerprint of the exact document text and produce a downloadable PDF.

### 1.6 Customer policy

From `src/lib/booking-policy.ts` and the refund functions. These are the numbers
the assistant, the FAQ, the legal pages and the cancel dialog all read from, so
they cannot drift apart:

| Rule                               | Value                                                |
| ---------------------------------- | ---------------------------------------------------- |
| Free cancellation                  | 24 hours or more before pickup                       |
| Late cancellation                  | 50% fee inside 24 hours                              |
| Traveller no-show                  | full charge after free waiting                       |
| Confirmed driver fault             | 100% make-good plus €25 goodwill credit              |
| Free waiting, airports and ports   | 60 minutes, with flight tracking                     |
| Free waiting, hotels and addresses | 30 minutes                                           |
| Free changes                       | up to 4 hours before pickup, subject to availability |

Refund percentages are constrained at the database level to 0, 50 or 100, and a
refund moves through `pending_review → approved → paid` (or `credit_issued`)
rather than being applied silently.

### 1.7 Channels

1. **Direct organic** — the main bet. See section 5.
2. **Hotels and resorts** — partner accounts with their own dispatch inbox.
3. **Travel agencies and resellers** — agreed commission, digital partner
   agreement, referral attribution (`partner_referrals`, `booking_referrals`).
4. **Driver-sourced repeat business** — named drivers and a rebook action on
   every past trip.
5. **Mobile apps** — driver supply retention and rider repeat booking.

---

## 2. Roles and surfaces

| Role         | Where      | What they can do                                                                                                                                                                                                                                                             |
| ------------ | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Customer** | `/account` | Trips list with search, date-range filter, sort and pagination; next-transfer card; live trip map with driver position and ETA; trip timeline; receipt PDF; cancel with refund preview; report a problem; saved travellers; language and currency preferences                |
| **Driver**   | `/driver`  | Online toggle; ASAP offers with countdown and audible alert; open job pool; accept/decline; job detail with navigation deep links and one-tap call/WhatsApp; status transitions; live location sharing; earnings, ledger, reliability, payout schedule and Stripe onboarding |
| **Partner**  | `/partner` | Dispatch inbox for bookings routed to that partner's zone                                                                                                                                                                                                                    |
| **Admin**    | `/ops`     | Driver onboarding and document review; contracts; unassigned bookings; partner activation; open incidents with resolution actions; pending refunds; driver account adjustments                                                                                               |

Roles are `customer | driver | admin` on `profiles`, with partner membership as a
separate join (`partner_members`, roles `dispatcher | driver`). Every dashboard
route is `noindex`, blocked in `robots.txt`, and gated client-side by
`RequireAuth` on top of row-level security in the database.

Sign-in routes by role: admins to `/ops`, drivers to `/driver`, everyone else to
`/account`.

---

## 3. Order lifecycle

1. **Quote** — the engine prices the trip and persists a `quotes` row. The
   quote is recoverable from the URL and local storage if the visitor leaves.
2. **Booking** — created as `pending`. Payment is Stripe Checkout or on-board.
3. **Dispatch** — the market decides the mode (`src/lib/dispatch.ts`):
   - Greece uses **offer** mode: a batch of up to 5 eligible drivers is offered
     the job with an expiry; first acceptance wins, under a database lock so a
     job cannot be double-claimed (`create_offer_batch`, `respond_to_offer`).
   - Other markets use **partner_assign**: the job lands in a partner's inbox
     for the zone (`pick_partner_for_zone`).
   - **ASAP** bookings fan out in realtime with an 8-minute window
     (`asap_booking_fanout`, `expire_asap_bookings`).
   - Unanswered batches expire and escalate on a **one-minute cron**
     (`runExpireAndEscalate`).
4. **Trip** — `claimed → en_route → completed`, or `no_show`. The driver can
   share live location; the customer sees position, route geometry and ETA.
5. **Settlement** — completion writes the earning, applies commission, starts
   the holding period, and mirrors to the ledger.
6. **Exceptions** — incidents (`driver_no_show`, `driver_late`, `wrong_vehicle`,
   `safety`, `missed_each_other`, `unable_to_complete`, `other`) open a case
   that operations resolves with a refund, credit, partial refund or rebook.

Side effects (email, push) are written to a transactional **event outbox** and
delivered by the same cron, so a failed email can never roll back a booking and
a retry cannot double-send.

---

## 4. Site structure

English is served at the root; the other public locales are path-prefixed.
Routing is file-based under `src/routes/{-$locale}/` (72 route files). An unknown
locale prefix returns 404 rather than rendering as English.

### 4.1 URL families

| Family         | Pattern                                                                    | Purpose                                                                  |
| -------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Home           | `/`                                                                        | Booking entry, coverage proof, popular routes                            |
| Countries      | `/countries`, `/{market}`                                                  | Country hubs: `greece`, `spain`, `italy`, `portugal`, `cyprus`, `turkey` |
| Airports       | `/airports`, `/airports/{slug}`                                            | Airport hubs                                                             |
| Airport routes | `/airports/{slug}/{routeSlug}`                                             | Airport-to-destination detail                                            |
| Routes         | `/routes`, `/routes/{slug}`                                                | Fixed-price corridors                                                    |
| Regions        | `/regions`, `/regions/{slug}`                                              | Crete coverage by prefecture                                             |
| Cities         | `/cities`, `/cities/{slug}`                                                | City and resort hubs                                                     |
| Ports          | `/ports`, `/ports/{slug}`                                                  | Generated global port pages                                              |
| Ferry          | `/ferry`, `/ferry/{slug}`                                                  | Authored Crete ferry arrivals (English)                                  |
| Hotels         | `/hotels`, `/hotels/{slug}`                                                | Resort-area transfers (English)                                          |
| Guides         | `/guides`, `/guides/{slug}`                                                | Long-form route guides (English)                                         |
| Drivers        | `/drivers`, `/drivers/{slug}`                                              | Named driver profiles (gated, see 5.4)                                   |
| Services       | `/services`, `/services/{slug}`                                            | Service categories                                                       |
| Fleet          | `/fleet`, `/fleet/{class}`                                                 | Vehicle classes                                                          |
| Editorial      | `/blog`, `/blog/{slug}`                                                    | Articles                                                                 |
| Trust          | `/about`, `/how-it-works`, `/faq`, `/contact`, `/reviews`                  |                                                                          |
| Partner        | `/for-hotels`, `/for-drivers`, `/for-travel-agencies`                      | Acquisition                                                              |
| Legal          | `/legal/{terms,privacy,cookies,refunds,imprint,driver-partnership,kyc}`    |                                                                          |
| Private        | `/book`, `/account/*`, `/driver/*`, `/partner`, `/ops`, `/contracts`, auth | `noindex`, robots-blocked                                                |
| Machine        | `/sitemap.xml`, `/robots.txt`, `/llms.txt`, `/manifest.webmanifest`        |                                                                          |

### 4.2 Languages

Seven locales exist. **Five are public**: English, Greek, German, French,
Italian. **Dutch and Spanish are held** — their interface strings are translated
but their long-form content overlays are still English stubs, so publishing them
would put duplicate English bodies on two more hreflang clusters. They render
`noindex, follow` with no canonical and no alternates until the overlays are
genuinely translated, then adding them to `PUBLIC_LOCALES` is a one-line change
(`src/i18n/index.ts`).

---

## 5. SEO, GEO and AEO

The strategy is to own the high-intent long tail of "how do I get from X to Y"
for the markets where supply is real, and to be the source an answer engine
quotes when someone asks a transfer question. The full audit workspace lives in
`seo/`; this is the operating summary.

### 5.1 Indexation policy

Deliberate, and enforced in one place (`src/lib/seo.ts`):

- **Canonical** is absolute and locale-correct on every indexable page.
- **hreflang** covers the five public locales plus `x-default`, emitted only
  from leaf routes because root links cannot dedupe.
- **Non-public locales** get `noindex, follow`, no canonical, no alternates.
- **English-only editorial** (guides, hotels, ferry) publishes exactly one
  indexable URL each — the English one, self-canonical with no alternates. Other
  locales render the same body as `noindex, follow` behind a visible note that
  the page is English while prices, booking and support are localized. The
  sitemap lists only the English URL.
- **Private and transactional** routes are `noindex` and blocked in robots.
- **Unknown paths** return a real 404 with `noindex, follow`.
- **Titles** are trimmed at 65 characters and descriptions at 160, on a word
  boundary, so nothing is cut mid-word in a SERP.

### 5.2 Technical foundations

- **Server-rendered** on Cloudflare Workers: crawlers get complete HTML, not a
  hydration shell.
- **Structured data**: one shared `Organization` and `WebSite` entity site-wide,
  referenced by `@id` from per-page `Service`, `Airport`, `Offer`, `FAQPage`,
  `BreadcrumbList`, `ItemList`, `Person` and `Article` nodes. Because the entity
  is shared rather than repeated, the knowledge graph gets one consistent brand.
- **Organization logo** is a 512×512 PNG, per Google's raster requirement.
- **Social cards**: a self-hosted branded 1200×630 default, overridden per page
  where a specific image exists.
- **Sitemap** is generated from the same data the pages render from, with
  `lastmod` only where a source record actually supplies one.
- **Security headers** on every response: HSTS, `X-Content-Type-Options`,
  `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`.
- **PWA**: manifest with maskable icons, so the site installs cleanly.

### 5.3 Answer-engine optimisation

- **`/llms.txt`** states the model, coverage, languages, currencies, payment
  modes and the page map in plain prose, and is kept in sync with what the code
  actually does — including which languages are public and which content is
  English-only.
- **`robots.txt`** names GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot,
  PerplexityBot, Google-Extended, Applebot-Extended and CCBot explicitly, allows
  public content and blocks the private paths, and declares `LLM-Policy`.
- **FAQ schema mirrors visible content** — no hidden-answer markup.
- **Policy numbers come from one module**, so an answer engine that reads the
  FAQ, the refund page and the cancel dialog gets the same figures.
- **Touristas AI**, the in-product assistant, only quotes prices from the real
  quote tools and deep-links into `/book`. Its page is `noindex`.

### 5.4 Truth gates

Claims that cannot be verified yet are switched off in production rather than
written optimistically. Each is an environment flag:

| Flag                             | Gates                                                                                 |
| -------------------------------- | ------------------------------------------------------------------------------------- |
| `VITE_REVIEWS_VERIFIED`          | Review content, `aggregateRating` schema, the reviews page in the sitemap             |
| `VITE_BUSINESS_METRICS_VERIFIED` | Transfer counts and rating stats in the stats band                                    |
| `VITE_DRIVER_PROFILES_VERIFIED`  | Named driver profiles, their indexation, sitemap entries, footer link and cross-links |

Driver profiles carry real people's names, ratings and transfer counts. They
stay off until every published driver has consented and the figures are backed
by records. Coverage numbers shown to visitors are derived from the shipped
catalog (`src/lib/coverage.ts`), so a homepage claim cannot drift from reality.

### 5.5 Content model

Three layers, which is what makes the long tail defensible:

1. **Programmatic** — airports, ports, cities, corridors generated from
   structured data with genuine facts (distance, duration, price, terminals).
2. **Authored** — 18 airport pages, 32 corridors, 6 guides, 8 resort areas,
   6 ferry ports with arrival detail that only an operator knows: which gate the
   overnight boat berths at, how long the ramp takes to clear, which villa
   driveways need an SUV.
3. **Editorial** — articles that answer pre-purchase questions and link to the
   commercial page that serves the intent.

Duplicate-intent pairs (a corridor and its airport-route twin) are
differentiated and cross-linked rather than redirected or canonicalised away, so
both keep their own intent.

### 5.6 Measurement

Analytics is Plausible, injected **only after consent** — declining the cookie
banner means the script is never loaded. Consent-aware events cover the booking
CTA, phone, email, WhatsApp, booking and quote submission, checkout start,
newsletter, contact and partner enquiry.

Post-launch, in order:

1. Verify the domain in Search Console and submit `/sitemap.xml`.
2. Record discovered-versus-indexed counts per URL family weekly.
3. Baseline queries and landing pages after the first full crawl.
4. Watch instant-mode Crete corridors for conversion and quote-mode markets for
   quote-request volume; they are different funnels and should be read apart.
5. Track branded answer-engine citations separately from classic organic.

External ranking, click and backlink figures are **NOT AVAILABLE** until the
site is live and a property is connected. Nothing in `seo/` claims otherwise.

---

## 6. Technical architecture

| Layer     | Choice                                                                 |
| --------- | ---------------------------------------------------------------------- |
| Framework | TanStack Start, React 19, file-based routing, SSR                      |
| Runtime   | Cloudflare Workers, `nodejs_compat`, one-minute cron                   |
| Data      | Supabase Postgres with row-level security on every table               |
| Auth      | Supabase Auth, session in local storage, server middleware attaches it |
| Realtime  | Supabase Realtime for job offers, ASAP dispatch and live trip position |
| Payments  | Stripe Checkout and Stripe Connect Express                             |
| Email     | Resend, delivered through the transactional outbox                     |
| Push      | Expo push, device tokens per role                                      |
| Maps      | Leaflet with OpenStreetMap tiles; OSRM for route geometry              |
| Styling   | Tailwind v4 with design tokens, Radix primitives                       |
| Mobile    | Two Expo apps sharing one UI kit and the i18n package                  |

**Database surface**: 28 tables and 65 functions. Security-sensitive
operations are `security definer` functions with `search_path = ''` and explicit
grants, not client-side writes: claiming a job, responding to an offer,
cancelling, opening and resolving incidents, adjusting driver accounts, issuing
and signing contracts, reviewing onboarding. Migrations are validated in CI
against a real Supabase stack with RLS assertions (`supabase test db`).

**Error handling**: SSR failures are caught at three levels — a request
middleware, a Worker-level wrapper that recovers the original stack when h3
swallows a throw into a generic 500, and a React error boundary. The visitor
always gets a styled page, never a JSON blob.

---

## 7. Performance

Per-locale code splitting is the main lever: the interface dictionaries and the
long-form content overlays were previously in the shared bundle, meaning every
visitor downloaded six languages they would never read.

| Chunk              | Before         | After                              |
| ------------------ | -------------- | ---------------------------------- |
| Main client bundle | 2,958 KB       | 804 KB                             |
| Shared i18n chunk  | 854 KB         | 150 KB                             |
| Per-locale content | in main bundle | 309–546 KB, only the active locale |

The server registers every locale at startup so SSR stays synchronous; the
browser loads only its own locale before hydration, and the language switcher
fetches the target locale before navigating so nothing flashes back to English.

Also in place: immutable one-year caching on hashed assets, eager hero image
with `fetchPriority`, lazy map and PDF modules, self-hosted fonts, and
`scrollRestoration` owned by the router so reloads open at the top.

---

## 8. Security and compliance

- Row-level security on every table; privileged actions behind definer functions.
- Stripe webhooks signature-verified and idempotent.
- Cron endpoints require a bearer secret and return 401 otherwise.
- Redirect targets after sign-in are validated against an open-redirect.
- Preview auth storage only posts to trusted editor origins, so a session token
  cannot reach an arbitrary embedder.
- Consent gating: analytics is the only optional cookie and declining works.
- Legal pages in seven languages: terms, privacy, cookies, refunds, imprint,
  driver partnership, KYC.
- Digital agreements store a document fingerprint, signer name, timestamp and
  template version, and render a PDF.
- Supply-chain guard: `bunfig.toml` skips package versions published in the last
  24 hours; CI runs a production dependency audit at `--audit-level=high`.

---

## 9. Environment

Public browser values are `VITE_`-prefixed; everything else is server-only.
`.env.example` is the authoritative list. Required for a working launch:

| Variable                                                                | Purpose             |
| ----------------------------------------------------------------------- | ------------------- |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`                    | Browser data access |
| `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Server and cron     |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`                            | Payments            |
| `RESEND_API_KEY`, `RESEND_FROM`                                         | Transactional email |
| `OUTBOX_CRON_SECRET`, `DISPATCH_CRON_SECRET`                            | Cron authentication |
| `VITE_SITE_URL`, `VITE_CONTACT_PHONE`, `VITE_WHATSAPP_NUMBER`           | Contact surfaces    |
| `EXPO_ACCESS_TOKEN`                                                     | Push delivery       |

Optional: `VITE_PLAUSIBLE_DOMAIN` (analytics), `OPENAI_API_KEY` (assistant
free-form chat; without it the assistant still answers with quote tools),
`VITE_OSRM_URL` (self-hosted routing), `VITE_FLIGHT_API_URL` and
`VITE_FLIGHT_API_KEY` (live flight status; without them the booking shows the
flight as driver-tracked with no live ETA), `PEXELS_API_KEY` (build-time
imagery), the three verification flags in section 5.4, and store URLs and social
links, which render only when set.

---

## 10. Launch checklist

### Before the domain goes live

- [ ] Set every required variable in section 9 on the Cloudflare Worker.
- [ ] Point Stripe's live webhook at `/api/stripe/webhook` and confirm the
      signing secret matches.
- [ ] Confirm the one-minute cron is enabled (outbox and dispatch escalation
      both depend on it).
- [ ] Apply all migrations to the production project and run `supabase test db`.
- [ ] Seed `platform_settings` if the commission, holding period or penalty
      tiers should differ from the defaults.
- [ ] Create the first admin account and verify `/ops` loads for it.
- [ ] Onboard and approve at least one Crete driver end to end, including the
      signed agreement and Stripe Connect.
- [ ] Place one real instant booking, pay it, complete it, and confirm the
      earning, commission and payout appear correctly.
- [ ] Decide each verification flag in 5.4; leave them `false` unless the
      evidence exists.
- [ ] Confirm `VITE_SITE_URL` and `SITE_URL` match the live domain, since
      canonicals, hreflang, sitemap and schema all derive from it.

### At launch

- [ ] Fetch `/robots.txt`, `/llms.txt` and `/sitemap.xml` on the live domain and
      confirm status, content type and URL count.
- [ ] Spot-check one URL per template per public locale for status, title,
      description, canonical, hreflang reciprocity, `lang` and JSON-LD.
- [ ] Validate the home, an airport, a corridor and a guide in Google's Rich
      Results test and a schema validator.
- [ ] Check the social card renders on at least two platforms.
- [ ] Verify Search Console ownership and submit the sitemap.
- [ ] Confirm the cookie banner gates Plausible, and that a test conversion
      event arrives after accepting.

### First two weeks

- [ ] Watch discovered-versus-indexed counts per URL family.
- [ ] Monitor the outbox for stuck events and the dispatch escalation for
      unanswered offers.
- [ ] Review every incident and refund manually while volume is low.
- [ ] Baseline queries and landing pages once the first full crawl completes.
- [ ] Translate the Dutch and Spanish content overlays, then add them to
      `PUBLIC_LOCALES`.

---

## 11. Known gaps

Stated plainly so nobody discovers them in production:

- **Dutch and Spanish** are not published for search; the interfaces are
  translated but the long-form overlays are English stubs.
- **Long-form Crete editorial** (guides, hotel areas, ferry ports) is English
  only. Booking, prices and support are localized.
- **Driver profiles** are built but gated off pending consent and verified
  figures.
- **Reviews and business metrics** are gated off pending verified records.
- **Live flight status** falls back to "your driver tracks this flight" until a
  flight API is configured.
- **Route geometry** uses the public OSRM demo server unless `VITE_OSRM_URL`
  points at a self-hosted or paid endpoint. Set it before real traffic.
- **No automated test suite** for the front end; correctness is enforced by
  TypeScript, ESLint at zero warnings, the hardcoded-copy gate, database RLS
  assertions and manual browser verification.
- **External SEO metrics** are unavailable until the site is live and a Search
  Console property is connected.

---

## 12. Repository map

```
src/
  routes/{-$locale}/    72 locale-aware pages (public + dashboards)
  routes/sitemap[.]xml  generated sitemap
  components/           UI, dashboards, booking, assistant, ops panels
  data/                 routes, airports, hotels, ferry, guides, markets, territories
  i18n/                 7 dictionaries + per-locale content overlays (code-split)
  lib/                  pricing, quote engine, dispatch, SEO, structured data, policy
  queries/              typed Supabase access per domain
  functions/            server functions: Stripe, Connect, email, push, contracts
  server/               outbox, dispatch cron, request auth
supabase/migrations/    28 tables, 65 functions, RLS policies
apps/driver, apps/rider Expo apps
packages/               shared i18n and mobile UI kit
scripts/                icon generation, data generation, copy and i18n gates
seo/                    audit workspace, briefs, scorecards, QA evidence
```

---

## 13. Quality gates

`npm run check` runs typecheck, i18n typecheck, the hardcoded-copy gate, ESLint
at zero warnings, and the production build. CI additionally installs and
typechecks both Expo apps, audits production dependencies, and validates
migrations and RLS assertions against a live Supabase stack.

The hardcoded-copy gate is the one worth understanding: it parses every
maintained source file and fails the build if user-visible text appears as a
string literal instead of coming from a locale catalog. It is what keeps seven
languages honest as the product grows.
