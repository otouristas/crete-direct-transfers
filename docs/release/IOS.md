# Native iOS delivery — 15 October 2026

Two separate Release iOS apps were built with Xcode 27, signed for App Store Connect and uploaded successfully as **1.0.0 (1)**. Both builds are **Ready to Test** in their internal “TransferAround Team” group. The owner’s existing Apple account is invited; installation on a physical iPhone has not been observed.

| App | Bundle ID | TestFlight |
| --- | --- | --- |
| TransferAround | `com.transferaround.rider` | [Traveler build](https://appstoreconnect.apple.com/teams/05050f94-6e0f-48f1-8973-bfdbf4706f4e/apps/6823245074/testflight/ios) |
| TransferAround Driver | `com.transferaround.driver` | [Driver build](https://appstoreconnect.apple.com/teams/05050f94-6e0f-48f1-8973-bfdbf4706f4e/apps/6823246039/testflight/ios) |

## Try the connected native journey

1. Install both apps from TestFlight using the invited Apple account.
2. In Traveler, choose “Take it for a spin” (accessibility label: “Try a practice journey”), then start a new practice session.
3. Open “Connect the other app” and share the native link, or copy the session code.
4. In Driver, enter Practice, join that session and switch online.
5. In Traveler, choose the route and vehicle, open “Demo Apple Pay”, simulate confirmation and follow the journey.
6. In Driver, accept, start to pickup and complete. Watch Traveler show each change.

This entire lifecycle passed on a real iOS simulator running independently bundled Release apps, using the shared private Supabase practice API. Reset, changing vehicle/fare and cancelling the demo payment sheet also passed. Practice uses fictional details, expires after two hours and creates no real booking, payment, refund or payout. The Apple Pay sheet is an explicitly labeled simulation of the payment step. It does not access Wallet.

## Authentication

Native Sign in with Apple is implemented with the system Apple button, a SHA-256 nonce and Supabase ID-token verification. Both bundle IDs are registered in Apple Developer with the capability enabled and allowed by the Supabase Apple provider. The distribution profiles contain the Apple entitlement. A successful user login on a physical iPhone remains unverified.

Google uses ASWebAuthenticationSession through Expo WebBrowser and PKCE. The exact callbacks `transferaround://auth/callback` and `transferaround-driver://auth/callback` are allowed in Supabase, and the router callback deduplicates the code exchange. A dedicated Google Cloud project `transferaround` was created. Branding is prepared but cannot be submitted until the owner approves the Google API Services User Data Policy. The Google provider is still disabled, pending that approval and genuine OAuth client configuration.

Two owner-requested accounts were created through the Auth admin API with their customer/driver roles, without auto-confirming email, sending invitations or choosing a shared temporary password. Driver onboarding stays in draft until normal approval. Account details are excluded from this public release note.

## Design and native compatibility

The two apps share an original Mediterranean palette and coastal illustration, with ivory traveler screens and a deep green driver welcome. The official Apple sign-in control is preserved. The booking and driver actions stay in a safe-area footer with the fare, following the map/route/action hierarchy examined in [this Waymo reference on Mobbin](https://mobbin.com/screens/41e92a4e-ba6c-4fa4-9137-4984f4469436). Reference screenshots were not bundled as app assets.

The CNG plugins in `apps/native-plugins` adopt UIKit scenes for iOS 27 and raise old Pod resource targets to iOS 15.1. The root Expo Router uses `Slot`, avoiding the blank native-stack screen observed with this SDK combination. Warm app switching, native route navigation and persisted practice state passed. Metro watches the real shared-package path, including when dependencies are staged on the internal disk.

## Build again

Install app dependencies and CocoaPods, then use `npm run ios:rider` or `npm run ios:driver` from the repository root. These commands generate native iOS code, run Pods, compile a bundled Release app, sign it ad hoc for simulator keychain access, and install/launch it on the dedicated “TransferAround iPhone” simulator. Open Xcode Device Hub to see it. No Metro server is required. `TA_IOS_WORKSPACE` can point to a staging workspace; `TA_SIMULATOR_UDID` can select an existing simulator.

For distribution, generate Pods as above and archive with `xcodebuild -workspace ios/TransferAround.xcworkspace -scheme TransferAround -configuration Release -destination 'generic/platform=iOS' -archivePath /path/TransferAround.xcarchive CODE_SIGNING_ALLOWED=NO archive` (use the Driver scheme/workspace for Driver). Run `scripts/prepare-ios-archive.py` with the archive, its generated entitlements file and the actual Apple team; then export using Xcode automatic App Store Connect signing with `-allowProvisioningUpdates`. The preparatory ad hoc signature is not a distribution signature; only a successful Xcode export confirms distribution signing. Increment the build number before the next upload.

The verified local IPAs and SHA-256 manifest are in ignored `release/ios/`. Both signatures passed `codesign --verify --deep --strict`, the production profiles contain Apple sign-in/push entitlements, and their JavaScript bundle hashes match the simulator-tested apps. A scan found no server secrets or `.env` files in either IPA. TypeScript and portable lockfile checks passed for both apps; targeted lint has zero errors and five React refresh warnings.

Apple accepted both uploads. It reported missing third-party dSYMs for prebuilt React, ReactNativeDependencies and Hermes frameworks; app dSYMs are present. Native push delivery, physical-device login and live Stripe operations remain unverified. Real checkout still needs the merchant Stripe keys, webhook and deployed website API. No public App Store review submission has been made.
