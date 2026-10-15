/** Native mobility palette: high-contrast ink, white surfaces, blue GPS/selection. */

export const colors = {
  /** App backdrop — white behind the map and booking sheets. */
  bg: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceMuted: "#F3F4F6",
  surfaceSunken: "#E9EBEF",
  border: "#E7E8EC",
  borderStrong: "#CDD0D6",

  text: "#101114",
  textMuted: "#646A74",
  textFaint: "#858B95",
  /** Text/icons on dark (navy/accent) surfaces. */
  inverse: "#F8FAFC",

  /** Primary action ink. */
  primary: "#245BEB",
  primaryPressed: "#1946C0",
  primarySoft: "#EEF3FF",

  /** Blue — GPS, selection, focus and live status. */
  accent: "#245BEB",
  accentPressed: "#1946C0",
  accentDeep: "#1B49C6",
  accentSoft: "#EEF3FF",

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
