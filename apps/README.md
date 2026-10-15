# TransferAround mobile apps (Expo)

- **Driver** — `apps/driver` — online toggle, job offers, job lifecycle
- **Rider** — `apps/rider` — book transfers, trips, account

Shared API helpers live in `packages/mobile-shared` (`@transferaround/mobile-shared`).

```bash
# from repo root
npm run mobile:driver   # Expo on default port
npm run mobile:rider
```

## Design system

Both apps share one **light, Uber-style** UI kit that lives in
`@transferaround/mobile-shared/ui` (tokens, `Button`/`Card`/`Field`/`StatusBadge`/`RouteRail`,
a native Apple MapKit `RouteMap` (Leaflet fallback on web), a draggable `BottomSheetScaffold`, `useAppFonts`, and the
brand `LogoMark`/`BrandHeader`). Screens import primitives from there instead of hand-rolling
`StyleSheet` per screen; each app's `lib/theme.ts` re-exports the tokens for back-compat.

Brand: TransferAround — the approved abstract Interchange mark, cobalt #245BEB, white and charcoal;
Plus Jakarta Sans (display) + Inter (body) via `@expo-google-fonts/*`. Logos
use the exact `identity-{rider,driver}-v3.png` shared assets and role app icons.

Both roles have persisted onboarding, original transparent vehicle artwork, reduced-motion
support and native haptics. Traveler exposes device GPS, address search and pickup-pin selection.
Active trips receive driver GPS and journey-stage updates through participant-protected Supabase
Realtime subscriptions. Driver sharing requires an assigned active trip and an approved driver;
background updates additionally require iOS Always location permission.

See [native iOS delivery and testing](../docs/release/IOS.md) for bundled Release builds,
the isolated practice journey and the remaining live-payment dependencies.
