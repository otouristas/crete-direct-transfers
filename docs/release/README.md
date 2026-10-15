# TransferAround — release candidate, 15 October 2026

The website and the Driver/Traveler Expo apps are prepared for review on branch `codex/launch-readiness`. No production website deployment or App Store submission has been performed.

## Open the working previews

- Website and connected practice studio: `http://localhost:8081/apps`
- Traveler app: `http://localhost:8082/practice`
- Driver app: `http://localhost:8083/practice`

The practice studio and both Expo apps use the same `transfer_practice` database API in the verified Supabase project **mlrgwkgiazmrsfjhfrnq** (`Transferaround.com`). Start a session, copy its code, and join it from the other app. Practice sessions expire after two hours. Only fictional traveler/driver details are used; practice never creates a real booking, sends a customer message or charges a payment method.

### Suggested test

1. Start a practice session in the Traveler app, or open `/apps` on the website.
2. Share the 48-character session code with the Driver app and join it.
3. Put the driver online; request a practice ride as the traveler.
4. Accept, start and complete the trip in the Driver app.
5. Check the Traveler app and website: all show the same trip state.
6. Reset; also test cancellation and trying to accept while offline.

## Payment behavior

The user selected **online Stripe payment before booking confirmation**. The server validates the itinerary, recalculates the fare and saves an unpaid checkout. Guests use a separately hashed access capability; signed-in users can access their own booking. Client prices, payment flags and return-page query parameters cannot confirm payment.

Only a signed, paid Checkout event can settle the booking. The database checks session ID, amount, currency and event ID before updating payment status. A durable outbox then dispatches the trip and sends confirmation. Direct anonymous/authenticated booking writes are revoked; an unpaid trip cannot be assigned to a driver. Stripe session creation and carrier transfers have idempotency keys. Database-approved cash refunds are retried separately with idempotency keys; pending reviews and booking credits do not trigger cash refunds.

### Remaining activation requirements

These are concrete external requirements, not completed work:

- Set `SUPABASE_SERVICE_ROLE_KEY` on the website server for the verified project.
- Set the correct merchant account's `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` on the website server. A restricted Stripe key can be used with the required Checkout, refunds, Connect and transfer permissions.
- Register `/api/stripe/webhook` for `checkout.session.completed` and `checkout.session.async_payment_succeeded`.
- Schedule authenticated POST requests to `/api/events/process` and `/api/dispatch/expire` every minute. `DISPATCH_CRON_SECRET` has been generated only in the ignored local configuration; configure it securely on the deployed server/scheduler.
- Verify a Stripe sandbox checkout, delayed/failed payment, replayed webhook, cancellation/refund and an assigned-driver flow; then verify the live account configuration before accepting customer payments. No Stripe transaction, refund or payout was executed in this work.
- Create genuine customer/approved-driver accounts through the normal auth/onboarding flow. The project had zero real users and bookings during verification; no fabricated production accounts were inserted.

Until the missing server settings exist, real checkout returns a clear unavailable message and creates no booking. `npm run check:launch` reports the missing configuration without printing secret values. Presence of settings alone is not proof of live payment operation.

The placeholder telephone and business details were deferred by the user. Hotel/flight purchases remain gated by `TRAVEL_BOOKING_ENABLED=true` until their independent provider payment/fulfillment flow is verified. Their search/UI code is retained. Do not enable provider purchases solely because the transfer checkout passes.

## Build and verification

From the repository root:

```sh
npm ci
npm --prefix apps/rider ci
npm --prefix apps/driver ci
npm test
npm run typecheck
npm --prefix apps/rider run typecheck
npm --prefix apps/driver run typecheck
npm run lint
npm run verify:practice
npm run build
npm run build:apps
npm run check:launch
```

`verify:practice` exercises only the isolated practice API and rejected direct booking writes. The SQL payment-integrity tests ran inside rolled-back transactions. The lint baseline has non-blocking React refresh/hooks warnings; there are no lint errors.

The production website build is a **Cloudflare Worker with server rendering**, in `.output/`; uploading only its static assets to generic static hosting will not provide the booking API. Use the existing Cloudflare/Lovable deployment flow and configure server secrets there. Keep published Git history intact. The local database migration filenames from July differ from the August versions already applied to this existing project; reconcile migration history before running a blanket `supabase db push`. The missing August onboarding/outbox/hardening/payment SQL has been saved from the actual remote migration history. The October migration filenames match the applied versions.

For local previews:

```sh
npm run dev -- --host 0.0.0.0 --port 8080
npm run preview:rider
npm run preview:driver
```

The default development website port is 8080. The current review session also has an active website preview at 8081. For physical-device API testing, set each app's `EXPO_PUBLIC_API_URL` to the computer's reachable LAN URL; a phone's `localhost` is the phone itself. The practice API connects directly to Supabase and does not need the website API to be deployed.

## Native distribution

Both native apps retain real Supabase login, account/job/trip flows and a separate Practice entry from login. Auth sessions persist with AsyncStorage and refresh with app activity. The driver can start a `claimed` job. Both apps can export browser and iOS JavaScript bundles.

Signed iOS/Android binaries, TestFlight/Play distribution and native push delivery have **not** been completed. Initialize the actual Expo/EAS projects and use real project IDs before building development/internal distribution binaries. Invalid placeholder EAS IDs were removed; native notifications deliberately wait for valid IDs. Store links appear only when real listing URLs are configured.

## Configuration and data safety

Configured provider/server secrets were moved out of the tracked `.env` into ignored `.env.local`. Release bundles must exclude all `.env*` files except `.env.example`. Browser bundles must contain only publishable Supabase configuration. Existing published Git history has not been rewritten.

Practice state lives in the private schema, has RLS, has no direct API grants, and is accessed only through a random 192-bit session capability. The intentionally anonymous practice RPC and legacy RPCs are listed by Supabase's security advisor; those warnings are not a declaration that every privileged routine has undergone a full independent security audit.

## Packaged delivery

Run `npm run package:release` after the builds. The resulting archive in the root `release/` directory contains the compiled Worker, both browser apps, unsigned iOS JavaScript exports, configuration examples and this documentation. It excludes local environment files and dependencies, and includes SHA-256 checksums.

The packaged Worker configuration omits the source build command so it can deploy the already compiled output. After configuring the correct Cloudflare account, server secrets and webhook/scheduler, deploy from the extracted `website/server` directory with `npx wrangler deploy --config wrangler.json`. This command publishes the site; it has not been executed in this task. Browser app folders require a static host with SPA route fallback and their API URL must point to the deployed website for real bookings.
