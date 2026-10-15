/**
 * TransferAround mobile design tokens — light, Uber-authentic system.
 * Mirrors the web brand truth in `src/styles.css`:
 *   navy #103F3A (primary action), turquoise #4D7C61 (accent),
 *   cool-white surfaces, slate ink, Plus Jakarta Sans + Inter.
 */

export const colors = {
  /** App backdrop — soft cool gray behind white surfaces (Uber-style). */
  bg: "#F6F4EC",
  surface: "#FFFEFA",
  surfaceMuted: "#EEF0E5",
  surfaceSunken: "#E7EBDF",
  border: "#E0E4D5",
  borderStrong: "#CDD6C1",

  text: "#153C35",
  textMuted: "#75846F",
  textFaint: "#91A087",
  /** Text/icons on dark (navy/accent) surfaces. */
  inverse: "#F8FAFC",

  /** Navy — the bold "black" primary action colour. */
  primary: "#103F3A",
  primaryPressed: "#0A302B",
  primarySoft: "#E4ECDC",

  /** Turquoise — selection, highlights, focus ring, "on the way". */
  accent: "#4D7C61",
  accentPressed: "#3D6651",
  accentDeep: "#365F45",
  accentSoft: "#EDF4D8",

  highlight: "#F59E0B",
  highlightSoft: "#FEF3C7",
  danger: "#DC2626",
  dangerSoft: "#FEE2E2",
  success: "#059669",
  successSoft: "#DCFCE7",
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

/** Font family names as registered by `useAppFonts()` (see fonts.ts). */
export const fonts = {
  display: "PlusJakartaSans_800ExtraBold",
  bold: "PlusJakartaSans_700Bold",
  semibold: "PlusJakartaSans_600SemiBold",
  body: "Inter_400Regular",
  medium: "Inter_500Medium",
  bodySemibold: "Inter_600SemiBold",
} as const;

export const type = {
  display: { fontFamily: fonts.display, fontSize: 30, lineHeight: 36, letterSpacing: -0.6 },
  h1: { fontFamily: fonts.bold, fontSize: 24, lineHeight: 30, letterSpacing: -0.4 },
  h2: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 26, letterSpacing: -0.3 },
  title: { fontFamily: fonts.semibold, fontSize: 17, lineHeight: 22, letterSpacing: -0.2 },
  subtitle: { fontFamily: fonts.bodySemibold, fontSize: 15, lineHeight: 20 },
  body: { fontFamily: fonts.body, fontSize: 15, lineHeight: 21 },
  label: { fontFamily: fonts.bodySemibold, fontSize: 13, lineHeight: 16, letterSpacing: 0.1 },
  caption: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16 },
} as const;

export type TypeVariant = keyof typeof type;

/** Elevation presets (iOS shadow* + Android elevation), ported from web card shadows. */
export const shadow = {
  card: {
    shadowColor: "#103F3A",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  raised: {
    shadowColor: "#103F3A",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  sheet: {
    shadowColor: "#000000",
    shadowOpacity: 0.16,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: -6 },
    elevation: 20,
  },
} as const;

export const tokens = { colors, space, radius, fonts, type, shadow } as const;
