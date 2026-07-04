
# CreteTransfers v2 — Full Redesign & Site Expansion

Benchmarked against gettransfer.com and transfeero.com, rebuilt for Crete only. Same fixed-price engine and Lovable Cloud `bookings` table stay — this plan is IA, content depth, SEO surface, and a full visual redesign.

## 1. Visual redesign

Current site is editorial-boutique but flat. Both competitors lead with a full-bleed hero image, a booking widget floating over it, and heavy social-proof scaffolding (badges, review counts, trust logos). We'll take that structural pattern but keep an editorial Crete identity — no rideshare-app blue.

Direction: **"Mediterranean editorial"** — full-bleed Crete cinematography, warm whitewash surfaces, deep Aegean primary, terracotta accent, generous serif display type (Fraunces), tight sans body (Inter). Motion: subtle parallax on hero, animated route lines on the map, hover lifts on cards, sticky booking widget on scroll.

Redesigned components:
- Full-bleed hero with layered booking widget (From → To → Date → Pax → Class → Quote button, all in one row on desktop, stacked on mobile), live price preview under it
- Trust strip (5 pills: Fixed price / Free cancellation / Flight tracked / Licensed drivers / 24-7 support) directly under hero
- "How it works" as a 3-step horizontal timeline with icons
- Popular routes as a large 6-card grid with image, price-from, duration, one-line hook
- Fleet as horizontal scroll cards with real vehicle photography
- Interactive-feel SVG Crete map with animated route lines connecting the 4 regional hubs
- Reviews carousel with star rating + source (Google, Tripadvisor placeholders)
- FAQ accordion (competitor-parity — both have 10+ Qs on homepage)
- Pre-footer CTA band (Aegean background, terracotta button)
- Redesigned footer with 4 columns (Routes / Regions / Company / Legal) + language switcher stub

I'll generate 3 design directions for the homepage hero + booking widget and let you pick before implementing.

## 2. Information architecture — full route map

```text
/                                    Homepage
/routes                              All routes hub (30 routes, filterable by region)
/routes/$slug                        Route detail (30 pages, programmatic SEO)
/regions                             Regions hub
/regions/$slug                       Region page (Chania / Rethymno / Heraklion / Lasithi)
/fleet                               Fleet overview
/fleet/$class                        Vehicle class detail (economy / comfort / minivan / luxury)
/services                            Services hub
/services/airport-transfers          Service page
/services/port-transfers             Service page
/services/hotel-transfers            Service page
/services/private-tours              Service page
/services/long-distance              Service page
/services/group-transfers            Service page
/book                                Booking flow (unchanged engine)
/book/success                        Confirmation
/about                               About / story
/how-it-works                        3-step explainer + FAQ
/faq                                 Full FAQ (20+ Qs)
/contact                             Contact form + WhatsApp + phone
/reviews                             Reviews page (seeded)
/for-hotels                          B2B partnership page
/for-drivers                         Driver recruitment page
/legal/terms                         Terms of Service
/legal/privacy                       Privacy Policy
/legal/cookies                       Cookie Policy
/legal/refunds                       Cancellation & Refunds
/legal/imprint                       Company / Impressum
/sitemap.xml                         Dynamic sitemap covering all above
/robots.txt                          Allow all + sitemap ref
```

## 3. SEO route expansion — from 10 to 30 routes

Add 20 new plausible transfers to `src/data/routes.ts`. Full new list groups by regional hub:

**Heraklion hub (12):** HER Airport → Elounda, Agios Nikolaos, Hersonissos, Malia, Stalis, Rethymno, Chania, Matala, Bali, Anissaras, Analipsi, Ierapetra. Plus Heraklion Port → Matala, Heraklion Port → Chania.

**Chania hub (10):** CHQ Airport → Chania Old Town, Rethymno, Kissamos, Platanias, Georgioupoli, Kolymbari, Almyrida, Falasarna, Sougia, Paleochora. Plus Souda Port → Chania.

**Rethymno hub (4):** Rethymno → Bali, Panormo, Plakias, Agia Galini.

**Lasithi hub (4):** Agios Nikolaos → Elounda, Sitia, Ierapetra, Vai.

Each route detail page gets:
- Hero image + fixed-price matrix (all 4 vehicle classes)
- Distance, duration, drive description
- What's included / not included
- Local tips for the destination (2-3 paragraphs)
- FAQ specific to the route (5 Qs)
- JSON-LD `TaxiService` + `Offer` + `FAQPage` + `BreadcrumbList`
- Related routes (3 cards)
- Sticky booking CTA

## 4. Region pages (4)

Each region page = hub for its area:
- Hero of the region
- 2-3 paragraphs on the region (what travelers do there, main destinations)
- All routes serving this region (filtered cards)
- Popular hotels served (seed list)
- Local driver knowledge blurb
- FAQ (5 Qs)
- JSON-LD `Place` + `BreadcrumbList`

## 5. Service pages (6)

Airport transfers, port transfers, hotel transfers, private tours, long distance, group transfers. Each: hero, what it is, pricing model, popular routes for this service, fleet recommendations, FAQ, JSON-LD `Service`.

## 6. Fleet detail pages (4)

One per vehicle class (economy, comfort, minivan, luxury): photo gallery, capacity/bags, example models, price-from per popular route, when to pick this class, book CTA.

## 7. Legal pages (5)

Terms, Privacy, Cookies, Refunds, Imprint. Real templates tailored to a Greek transfer marketplace — placeholder company name "CreteTransfers Ltd." with a `<!-- REPLACE: legal entity -->` marker. GDPR-appropriate privacy language, EU cancellation rights, standard transfer T&Cs.

## 8. FAQ, About, Contact, Reviews

- `/faq`: 20+ questions grouped (booking, payment, cancellation, luggage, kids, flight delays, meeting point, tipping) with `FAQPage` JSON-LD
- `/about`: brand story, why fixed price, team blurb
- `/contact`: form (saves to a new `contact_messages` table with anon insert) + WhatsApp/phone placeholders
- `/reviews`: 20 seeded reviews with source badges + aggregate rating, `AggregateRating` JSON-LD

## 9. B2B pages

- `/for-hotels`: partnership pitch, commission model placeholder, contact form (reuses `contact_messages` with a `topic` field)
- `/for-drivers`: driver recruitment, requirements, application form

## 10. Technical / SEO plumbing

- Dynamic `src/routes/sitemap[.]xml.ts` server route enumerating every static + programmatic route
- `public/robots.txt` allow all
- Per-route `head()` with unique title/description/og:title/og:description
- Leaf-only `og:image` using each route's hero
- JSON-LD per page type (TaxiService, Service, Place, FAQPage, BreadcrumbList, AggregateRating, Organization on root)
- Relative canonical + og:url (no domain yet)

## 11. Database additions

One new table via migration:

```sql
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text NOT NULL,           -- 'general' | 'hotel' | 'driver'
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT ALL  ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can send message" ON public.contact_messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);
```

## 12. Out of scope for this pass

- Real payments (still reserve-then-confirm; Stripe BYOK is one turn away when you want it)
- Greek-language mirror (`/el/*`) — structure ready, translations later
- Real driver profiles, dispatch app, admin dashboard
- Live flight tracking / WhatsApp automation
- Blog / content marketing pages beyond routes+regions

## 13. Build order

1. `contact_messages` migration
2. Expand `src/data/routes.ts` to 30 routes + add regions data + services data
3. Design directions for hero + booking widget → you pick one
4. New design system tokens (refined palette, animated map utilities, sticky-widget)
5. Rebuild `__root.tsx` shell (new header with mega-menu for Routes/Regions, new footer)
6. Homepage rebuild (all sections above)
7. Route detail template (upgrade existing `routes.$slug.tsx`) + routes hub
8. Region hub + region detail
9. Services hub + 6 service pages
10. Fleet hub + 4 class pages
11. About / How-it-works / FAQ / Contact / Reviews
12. B2B: for-hotels, for-drivers (share contact form component)
13. Legal: 5 pages
14. Dynamic sitemap + robots
15. SEO pass: verify per-route head(), JSON-LD, canonicals

Roughly ~55 new/edited files. I'll batch aggressively.

Approve to start, or tell me what to change (drop scope, swap routes, different visual direction, skip B2B, etc.).
