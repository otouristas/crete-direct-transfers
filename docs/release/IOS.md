# TransferAround native Swift iOS release

The canonical iOS source is `apps/ios-native/`. Both apps are entirely Swift/SwiftUI, with MapKit, Core Location, UserNotifications, AuthenticationServices and the official Supabase Swift package pinned to 2.55.4. There is no Expo, React Native, Hermes, Metro or CocoaPods dependency in these iOS targets. Older directories and build-3 notes are retained as history.

| App | Scheme | Bundle ID |
| --- | --- | --- |
| Traveler | TransferAround | com.transferaround.rider |
| Driver | TransferAroundDriver | com.transferaround.driver |

Version 1.0.0 (5), iOS 17+, Apple team S768Y6EZW8. Current upload and TestFlight processing results are recorded separately after verification; an archive/export alone is not a TestFlight delivery.

## Build

Open `apps/ios-native/TransferAround.xcodeproj` in Xcode. Regenerate after adding files/assets with `xcodegen generate --spec apps/ios-native/project.yml`. Package.resolved is committed.

`npm run ios:rider` / `npm run ios:driver` install correctly signed Debug Swift apps on a booted iPhone simulator. Node only invokes Xcode commands. Simulator signing must remain enabled (`CODE_SIGN_IDENTITY=-`) for Keychain session storage. Do not manually re-sign simulator apps.

`npm run build:apps` archives both real iOS targets using Xcode. Export for distribution with the committed ExportOptions.plist and Xcode automatic signing. Only the separate UploadOptions.plist explicitly requests an App Store Connect upload. Keep the system rsync first in PATH during export/upload.

## End-to-end testing

1. Install both latest Swift builds from TestFlight. Complete onboarding and sign in using a designated testing account. Google remains limited to the configured consent-test accounts; Apple and email use Supabase Auth. Existing email/password accounts can select **Already have a password? Sign in**. Dedicated Apple Beta Review credentials are stored outside this repository and were submitted to App Store Connect with the owner's explicit approval. Review Driver accounts are not approved for paid jobs.
2. In Driver, select **Test transfers**, enable Apple notifications and go online. Real paid offers still require driver approval.
3. In Traveler, select pickup/destination, verify the road line/distance/ETA, choose a vehicle and future pickup time. Enable **Test this transfer**, choose **Demo payment** and confirm the clearly marked no-charge transfer.
4. Driver receives a timed offer. Accepting is atomic: only one driver wins. Continue through driving, arrival, boarding and completion. Start GPS sharing explicitly when using the Driver app.
5. Traveler sees protected live GPS and trip stages. Old samples are labeled stale; location disappears when the trip closes. Driver and Traveler web dashboards expose these same test rides separately from paid bookings.

Test transfers use separate `test_rides`, `test_ride_offers` and `test_trip_locations` tables and a private tester allowlist. They never create a Stripe charge, payout, refund or normal financial booking. Test availability lasts 20 minutes; offers expire after 90 seconds. Demo payment does not access Apple Wallet.

## Notifications and tracking

Native Apple APNs credentials are restricted to the two bundle IDs and stored in this project's server secrets. `native_device_tokens` accepts variable-length tokens, and a service-only durable outbox queues a unique offer per device. The sender leases work, retries transient errors, removes invalid device tokens and expires obsolete offers. The Cloudflare dispatch scheduler recovers interrupted processing. A notification's Accept action invokes the same guarded acceptance RPC as the app.

The APNs key is production-only, matching TestFlight. Debug simulator tokens use the sandbox environment and do not establish production-device delivery. Token registration, Apple transport authentication and queue behavior have been checked. Actual delivery on a physical iPhone remains a separate final-device check.

GPS sharing is limited to the assigned active trip, uses authenticated Realtime with recovery reads and stops on completion/cancellation/sign-out. Simulator location updates establish the connected data flow, not a physical road test. Sign-out stops Core Location before network cleanup, and local sign-out proceeds even if token deletion fails.

## Ride with AI

Traveler and website use the same authenticated Claude endpoint, private server credential, structured extraction, map/place selection and pricing service. The vehicle catalog is aligned across web and Swift. Review and payment remain explicit. See RIDE-WITH-AI.md for limits and data handling.

## Release gates

Physical-device Google/Apple login and production APNs receipt must be verified on the delivered TestFlight builds. Live Stripe checkout/webhook/refund tests require merchant credentials. `transferaround.com` must be connected to the deployed website before the canonical-domain launch. The current working API/site is https://crete-direct-transfers.gk-3ae.workers.dev.

Never commit or package server credentials, `.env` files, local QA accounts, `release/ios/testing`, APNs private keys, or Xcode user data.
