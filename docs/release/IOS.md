# Native iOS delivery — 15 October 2026

Both native Release iOS apps were compiled, distribution-signed and successfully uploaded as **1.0.0 (3)** with Xcode 27 and the approved Interchange identity. Apple processing and internal/external TestFlight availability are recorded in the local release verification manifest. Physical iPhone installation has not been observed.

| App                   | Bundle ID                   | TestFlight                                                                                                                    |
| --------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| TransferAround        | `com.transferaround.rider`  | [Traveler build](https://appstoreconnect.apple.com/teams/05050f94-6e0f-48f1-8973-bfdbf4706f4e/apps/6823245074/testflight/ios) |
| TransferAround Driver | `com.transferaround.driver` | [Driver build](https://appstoreconnect.apple.com/teams/05050f94-6e0f-48f1-8973-bfdbf4706f4e/apps/6823246039/testflight/ios)   |

## Try the connected native journey

1. Install both apps from TestFlight using the invited Apple account.
2. In Traveler, choose “Practice ride” (accessibility label: “Try a practice journey”), then start a new practice session.
3. Open “Connect the other app” and share the native link, or copy the session code.
4. In Driver, enter Practice, join that session and switch online.
5. In Traveler, choose the route and vehicle, open “Demo Apple Pay”, simulate confirmation and follow the journey.
6. In Driver, accept, start to pickup and complete. Watch Traveler show each change.

This entire lifecycle passed on a real iOS simulator running independently bundled Release apps, using the shared private Supabase practice API. Reset, changing vehicle/fare and cancelling the demo payment sheet also passed. Practice uses fictional details, expires after two hours and creates no real booking, payment, refund or payout. The Apple Pay sheet is an explicitly labeled simulation of the payment step. It does not access Wallet.

## Authentication

Native Sign in with Apple uses the official system control, SHA-256 nonce and Supabase ID-token verification. Both bundle IDs have the Apple capability and are allowed in the Supabase provider. Successful physical-device account authentication remains unverified.

Google uses ASWebAuthenticationSession and PKCE. The exact callbacks `transferaround://auth/callback` and `transferaround-driver://auth/callback` are allowed in Supabase. The owner approved Google's User Data Policy; a dedicated web OAuth client now has the exact Supabase HTTPS callback configured, and the Google provider is enabled. The authorize endpoint redirects successfully to accounts.google.com with state and the correct callback. The Google project is in **Testing**, with all four owner-designated accounts permitted. Public Google access still requires publishing the consent configuration. The apps check provider availability before opening authentication.

Four owner-requested accounts exist in Auth. The two additional testers have driver draft records and can also use Traveler. Accounts were created through the Auth admin API with their customer/driver roles, without auto-confirming email, sending invitations or choosing a shared temporary password. Driver onboarding stays in draft until normal approval. Account details are excluded from this public release note.

## Design and native compatibility

Build 3 applies the exact owner-approved Interchange icon throughout app icons, splash, onboarding, sign-in and the Traveler map header. Cobalt #245BEB, white and charcoal replace the previous teal/navy identity. Map-first screens and original vehicle-class renders remain. The logo itself contains no car or taxi symbol. Each role has a persisted three-step onboarding flow, reduced-motion support, haptics and animated graphics. Traveler supports browsing before sign-in, fresh device GPS, manual address search through Apple's geocoder and map-pin pickup. An incomplete booking draft survives sign-in. The official Apple authentication control is preserved.

The map/action hierarchy draws on the [Uber pickup reference on Mobbin](https://mobbin.com/screens/482a07a9-7892-4b08-a001-0dd935316c9f). Mobbin screenshots are not bundled as app assets. The accepted identity and vehicle artwork are documented in `packages/mobile-shared/assets/ASSETS.md`.

## Active trip tracking

Driver explicitly starts GPS sharing on an assigned active trip. Foreground updates use device GPS; background sharing requires a separate Always permission choice. Traveler receives position and trip-stage changes through authenticated Supabase Realtime, with initial/reconnect reads and a recovery poll. The map interpolates between received samples, never inventing motion. Updates older than 20 seconds are marked stale; low-accuracy samples are identified. Driver and traveler can center/follow the map, and navigation opens Apple Maps for the current trip leg.

Sharing ends on completion, cancellation, reassignment or sign-out. RLS restricts location reads to the trip's participants, restricts writes to its assigned approved driver, and rejects invalid timestamps/coordinates. The server supplies driver metadata and removes locations when a trip closes. Arrival and boarding follow a guarded sequence. No driver profile is automatically approved by this change.

`node scripts/verify-live-tracking.mjs` checks real WebSocket delivery, separate driver/traveler/intruder access, spoofed metadata, stale samples, trip-stage transitions and cleanup using disposable test identities and an unpaid zero-value fixture. It sends no email or payment. Credentials remain local; never include `release/ios/testing` in a delivery archive. `TA_KEEP_TRACKING_FIXTURES=1` retains fixtures for native testing; `--cleanup` removes only those fixtures afterward.

Native Release verification covered both role introductions, pickup GPS and address resolution, Google’s actual account sign-in page, private practice connection using the iOS keyboard, simulated Apple Pay, acceptance, GPS sharing, start and completion. A separate real-booking fixture exercised guarded arrival/boarding, Apple Maps handoff and 52 device CoreLocation updates received through authenticated Realtime over five minutes while the driver app was backgrounded. These coordinates came from the simulator's location subsystem, not a physical road test. Pause/resume and trip completion removed location rows; a delayed publish could not recreate a paused row.

The CNG plugins in `apps/native-plugins` adopt UIKit scenes for iOS 27 raise old Pod resource targets to iOS 15.1, and quote Expo/React Native build paths when dependencies are staged in Application Support. The root Expo Router uses `Slot`, avoiding the blank native-stack screen observed with this SDK combination. Warm app switching, native route navigation and persisted practice state passed. Metro watches the real shared-package path, including when dependencies are staged on the internal disk.

## Build again

Install app dependencies and CocoaPods, then use `npm run ios:rider` or `npm run ios:driver` from the repository root. These commands generate native iOS code, run Pods, compile a bundled Release app, sign it ad hoc for simulator UI/GPS testing, and install/launch it on the dedicated “TransferAround iPhone” simulator. Open Xcode Device Hub to see it. No Metro server is required. Simulator signatures omit device authentication entitlements; Apple account authentication must be checked with a correctly provisioned device build. `TA_IOS_WORKSPACE` can point to a staging workspace; `TA_SIMULATOR_UDID` can select an existing simulator.

For distribution, generate Pods as above and archive with `xcodebuild -workspace ios/TransferAround.xcworkspace -scheme TransferAround -configuration Release -destination 'generic/platform=iOS' -archivePath /path/TransferAround.xcarchive CODE_SIGNING_ALLOWED=NO archive` (use the Driver scheme/workspace for Driver). Run `scripts/prepare-ios-archive.py` with the archive, its generated entitlements file and the actual Apple team; then export using Xcode automatic App Store Connect signing with `-allowProvisioningUpdates`. The preparatory ad hoc signature is not a distribution signature; only a successful Xcode export confirms distribution signing. Increment the build number before the next upload.

The verified local IPAs and SHA-256 manifest are in ignored `release/ios/`. Both signatures passed `codesign --verify --deep --strict`, the production profiles contain Apple sign-in/push entitlements, and their JavaScript bundle hashes match the simulator-tested apps. A scan found no server secrets or `.env` files in either IPA. TypeScript and portable lockfile checks passed for both apps; targeted lint has zero errors and five React refresh warnings.

Apple accepted both uploads. It reported missing third-party dSYMs for prebuilt React, ReactNativeDependencies and Hermes frameworks; app dSYMs are present. Native push delivery, physical-device login and live Stripe operations remain unverified. The apps now use the verified live website API at https://crete-direct-transfers.gk-3ae.workers.dev. Real checkout still needs the merchant Stripe keys and signed webhook. transferaround.com currently serves a parking page and needs its DNS connected. No public App Store review submission has been made.
