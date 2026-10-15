# TransferAround release candidate — 16 October 2026

The canonical iOS implementation is `apps/ios-native`: two Swift/SwiftUI iPhone apps, version 1.0.0 build 5. See [IOS.md](IOS.md) for build, delivery and verification limits. Older Expo directories and the build-3 notes are historical and are not the current iOS targets.

The working website and API are https://crete-direct-transfers.gk-3ae.workers.dev. The canonical domain transferaround.com still serves a parking page and needs DNS cutover. Driver and Traveler web dashboards read the same protected booking, offer, test-transfer and GPS state as the native apps.

## Connected no-charge test

1. Install both latest Swift TestFlight builds. Sign in with designated tester accounts.
2. Driver: open Test transfers, enable Apple notifications and go online for tests.
3. Traveler: select pickup/destination, review the road line, distance and time, choose a vehicle and future pickup, enable Test this transfer, then confirm Demo payment.
4. Driver: accept the timed offer, start GPS sharing, arrive, board and complete the transfer.
5. Follow the same journey from Traveler and the website dashboards. GPS disappears when the trip closes.

Test rides use separate tester-gated tables and guarded RPCs. They create no Stripe charge, payout, refund or normal financial booking. Driver acceptance has one winner. Availability lasts 20 minutes and offers expire after 90 seconds. The approved test accounts retain normal compliance gates for paid Driver access.

Native APNs uses a bundle-restricted production credential held in server secrets, a durable per-device outbox and retry leases. The Cloudflare dispatch scheduler is deployed. Simulator registration, authenticated Apple transport and queue behavior were checked; delivery to a physical TestFlight iPhone remains a device check.

## Ride with AI

Traveler and website share the authenticated Claude planner described in [RIDE-WITH-AI.md](RIDE-WITH-AI.md). The dedicated workspace has a verified $10 monthly cap. The key is held only in server secrets. Trip messages require explicit consent. GPS-button coordinates are excluded from the model payload. Choosing an address preserves the agreed intent; the booking service computes the fare and route. Review and payment remain explicit.

## Paid launch requirements

Live payments remain unavailable until the correct merchant Stripe keys and signed webhook are configured and tested. A sandbox checkout, failed/delayed payment, replayed webhook, cancellation/refund, dispatch and carrier payout flow must be verified before taking customer money. No real charge, refund or payout was executed during this release.

The site recalculates fares on the server. A return-page parameter or client payment flag cannot confirm a booking. Only a verified paid Stripe event can settle payment and dispatch paid jobs. Missing payment configuration fails closed. Hotel/flight provider purchases remain independently gated by TRAVEL_BOOKING_ENABLED.

The supplied public phone/WhatsApp is +30 695 588 5718. Operating-company registration, VAT/GEMI details and the existing legal copy still require owner confirmation before public commercial launch. No company registration or legal approval has been inferred from a working beta. Unverified seeded reviews and aggregate rating claims were removed; private/API paths remain excluded from indexing.

## Validation and artifacts

Run npm test, npm run typecheck, npm run lint and npm run build from the root. Native build commands are documented in IOS.md. Use npm run check:launch for local configuration diagnostics; it does not establish which secrets are deployed. npm run package:release packages compiled website output, release documentation and Swift source, excluding local credentials and Xcode user data. Signed IPAs are delivered separately.

Never commit or package server secrets, .env files, APNs keys, local QA/review credentials or release/ios/testing. The Apple review accounts were submitted only after the owner's explicit authorization and have no approved paid-driver access.
