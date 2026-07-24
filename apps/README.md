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
a Leaflet/OpenStreetMap `RouteMap`, a draggable `BottomSheetScaffold`, `useAppFonts`, and the
brand `LogoMark`/`BrandHeader`). Screens import primitives from there instead of hand-rolling
`StyleSheet` per screen; each app's `lib/theme.ts` re-exports the tokens for back-compat.

Brand: TransferAround — navy `#0B2545` (primary action) on cool-white surfaces, turquoise
`#14B8A6` accent; Plus Jakarta Sans (display) + Inter (body) via `@expo-google-fonts/*`. Logos
from `public/logo.png` / `public/favicon.svg`.
