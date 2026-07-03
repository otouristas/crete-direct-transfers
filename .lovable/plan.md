
# CreteTransfers — Phase 1 Build Plan

Brand: **CreteTransfers**. Tagline: *Fixed price. Local drivers. No bidding.*
Scope: Homepage + routes (hub + 10 route detail pages) + fleet + booking flow with fixed-price engine + Stripe payments. No driver profiles, no B2B pages (per your answer).

## 1. Design system

Editorial boutique, not rideshare-app.

- **Palette** (semantic tokens in `src/styles.css`, oklch):
  - Background whitewash `#FAF8F3`, deep Aegean `#1B3A4B`, terracotta accent `#C15B3D`, olive secondary `#6B7A4F`, ink `#161616`.
- **Typography** (via `@fontsource`): **Fraunces** (editorial serif, headlines) + **Inter** (UI/body).
- Restrained motion: subtle route-line SVG animation on the hero map, hover lifts on cards.
- Real Crete photography via Unsplash URLs (Chania harbor, Elafonissi, Samaria road, Heraklion).

## 2. Routes (TanStack Start file-based)

```
src/routes/
  __root.tsx                       (nav + footer + head defaults)
  index.tsx                        (homepage)
  routes.index.tsx                 (all routes hub, /routes)
  routes.$slug.tsx                 (route detail, /routes/heraklion-airport-to-elounda)
  fleet.tsx                        (fleet classes)
  book.tsx                         (booking flow: quote → details → payment)
  book.success.tsx                 (post-payment confirmation)
  book.cancel.tsx
  api/public/stripe-webhook.ts     (server route, signature-verified)
```

Each content route sets its own `head()` (title, description, og:title/description). Canonical + og:url are relative. og:image only on leaf routes with a hero image.

## 3. Seed data — 10 routes (placeholder, editable later)

Stored as a typed TS constant `src/data/routes.ts` (no CMS in phase 1). Fields per route: `slug`, `from`, `to`, `distanceKm`, `durationMin`, `basePriceEur` (per vehicle class), `heroImage`, `blurb`, `notes` (seasonal/road).

Initial 10 (plausible values):
1. Heraklion Airport → Elounda
2. Heraklion Airport → Agios Nikolaos
3. Heraklion Airport → Hersonissos
4. Heraklion Airport → Rethymno
5. Chania Airport → Chania Old Town
6. Chania Airport → Rethymno
7. Chania Airport → Kissamos
8. Souda Port → Chania Old Town
9. Heraklion Port → Matala
10. Heraklion Airport → Chania

Fleet classes with multipliers over base: Economy 1.0×, Comfort 1.25×, Minivan 1.6×, Luxury 2.1×.

## 4. Fixed-price engine

Pure server-side function `getQuote({ routeSlug, vehicleClass, passengers, extras })` in `src/lib/pricing.functions.ts` (`createServerFn`):
- Looks up route in seed data, applies class multiplier, adds extras (child seat €10, extra stop €15, meet-and-greet €10), applies night surcharge (22:00–06:00, +15%).
- Returns `{ priceEur, breakdown, currency: "EUR" }`.
- Called from the homepage hero (instant estimate) and the booking flow.

## 5. Homepage sections

1. Hero — search widget (From/To selects populated from seed routes, date/time, passengers) → instant fixed price preview.
2. Trust bar — 4 pills (Fixed price / Licensed drivers / Free cancellation 24h / Flight-tracked).
3. Popular routes — 6 cards from seed data with `price from €X`, drive time.
4. Fleet strip — 4 class cards with photo + capacity + from-price.
5. Region explainer — static SVG map of Crete's 4 regional units (non-interactive in phase 1, just visual).
6. How it works — 3 steps (Quote → Book → Meet driver).
7. Reviews — 6 short quotes (seed).
8. Footer.

## 6. Booking flow

`/book?route=<slug>&class=<class>&date=<iso>&pax=<n>`:
1. **Quote step** — shows fixed price + breakdown, editable class/extras. Zod-validated form.
2. **Details step** — passenger name, email, phone, flight/ferry number, pickup notes.
3. **Payment step** — Stripe Checkout redirect (managed_payments where eligible). On return, `/book/success?session_id=…` verifies via server fn and shows confirmation with (mock) driver name + WhatsApp link.

Data persistence: `bookings` table in Lovable Cloud (Supabase) with RLS. Insert on quote confirm, update status on webhook.

## 7. Payments

- Run `payments--recommend_payment_provider` → likely Stripe (service, not physical). Enable with `enable_stripe_payments`. Use **tax calculation & collection only** (`automatic_tax`) since seller is likely Greece (not in full-compliance-supported list).
- Create one Stripe product per (route × class) lazily via `batch_create_product` OR use `price_data` inline on Checkout Session for a fixed-price transfer (simpler for dynamic route matrix — recommended).
- Webhook at `/api/public/stripe-webhook` with HMAC signature verification, marks booking `paid`.

## 8. Database (Lovable Cloud)

Enable Lovable Cloud. One migration:

```sql
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_slug text NOT NULL,
  vehicle_class text NOT NULL,
  passengers int NOT NULL,
  pickup_at timestamptz NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  flight_number text,
  notes text,
  price_cents int NOT NULL,
  currency text NOT NULL DEFAULT 'EUR',
  status text NOT NULL DEFAULT 'pending', -- pending|paid|cancelled
  stripe_session_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.bookings TO authenticated;
GRANT INSERT ON public.bookings TO anon; -- guest bookings
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
-- Guests can insert; only service_role reads (webhook + future admin)
CREATE POLICY "anyone can create booking" ON public.bookings FOR INSERT TO anon, authenticated WITH CHECK (true);
```

No auth surface for end users in phase 1 (guest checkout). Admin dashboard is out of scope.

## 9. SEO

- Per-route `head()` with real title/description ("Heraklion Airport to Elounda Transfer | Fixed Price €X | CreteTransfers").
- JSON-LD `TaxiService` on each route detail page.
- Sitemap.xml + robots.txt (no `Sitemap:` line yet, no domain).
- Root sets sitewide title/description, `og:site_name = "CreteTransfers"`.

## 10. Out of scope (Phase 2+)

Driver profile pages, /for-hotels, /for-drivers, Greek-language mirror, flight-tracking integration, WhatsApp automation, dispatch/driver app, blog, region hubs beyond map visual, admin dashboard.

## Build order

1. Enable Lovable Cloud + create `bookings` table.
2. Run `recommend_payment_provider` → `enable_stripe_payments`.
3. Design system tokens + fonts + shared layout (nav/footer in `__root.tsx`).
4. Seed data + pricing server fn.
5. Homepage.
6. Routes hub + dynamic route detail page.
7. Fleet page.
8. Booking flow (3 steps) + Stripe Checkout server fn.
9. Stripe webhook + success/cancel pages.
10. SEO metadata + JSON-LD + sitemap/robots.

Approve to start, or tell me what to change.
