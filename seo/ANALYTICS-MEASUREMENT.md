# Organic conversion measurement

Implementation status: **CONFIRMED in repository** · Production event receipt: **NOT AVAILABLE**

Plausible loads only after explicit analytics consent and only when `VITE_PLAUSIBLE_DOMAIN` is configured. Custom events use the same consent gate and never include names, emails, phone numbers, booking IDs or message text.

## Implemented events

- `Booking CTA Click`: delegated tracking for internal links to a locale-aware `/book` path.
- `Phone Click`, `Email Click`, `WhatsApp Click`: delegated tracking for public contact links.
- `Booking Submitted`: successful instant-mode booking database insert.
- `Quote Request Submitted`: successful quote-mode booking database insert.
- `Checkout Started`: a valid checkout URL was returned before redirect.
- `Newsletter Signup`: successful insert or already-subscribed response.
- `Contact Form Submitted`: successful general/hotel/driver contact insert.
- `Partner Inquiry Submitted`: successful hotel, driver or travel-agency inquiry.

Allowed event properties are non-identifying context such as locale, market, trip type, vehicle class, partner type, page path, destination category/path and visible link label.

## Production work still required

1. Confirm `VITE_PLAUSIBLE_DOMAIN` in the production environment.
2. Accept analytics consent in a clean browser and trigger one event of each type.
3. Verify each event in Plausible with the expected properties.
4. Build funnels for landing page → booking CTA → submitted → checkout started.
5. Segment by landing page, locale, market and route family.
6. Connect GSC landing-page/query data. GSC and production Plausible access are currently **NOT AVAILABLE**.

Do not treat event implementation as evidence of conversions until production receipt is verified.
