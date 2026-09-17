import { View, StyleSheet } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { Text } from "./text";
import { colors, fonts, space } from "./tokens";

/**
 * Brand mark (location pin + circular "around" arrow), matching
 * `src/components/logo.tsx` / `public/favicon.svg`.
 * `tone="light"` = pin navy on light surfaces; `tone="dark"` = pin white on dark.
 */
export function LogoMark({
  size = 36,
  tone = "light",
  rounded = false,
}: {
  size?: number;
  tone?: "light" | "dark";
  rounded?: boolean;
}) {
  const pin = tone === "dark" ? colors.inverse : colors.primary;
  // Same 64-unit geometry as public/favicon.svg and the app icons (see
  // scripts/generate-brand-icons.mjs). The tight viewBox crops the tile's
  // padding; `rounded` restores it and draws the navy tile behind the mark.
  return (
    <Svg
      width={size}
      height={size}
      viewBox={rounded ? "0 0 64 64" : "12.5 10.7 42.7 42.7"}
      fill="none"
      accessibilityRole="image"
    >
      {rounded ? <Rect width={64} height={64} rx={14} fill={colors.primary} /> : null}
      <Path
        d="M49.16 37.25A17.94 17.94 0 1 1 49.84 30.13"
        stroke={colors.accent}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Path d="M47 27.38H55.13L49.84 33.88Z" fill={colors.accent} />
      <Path
        d="M32 42 25.51 33.61A8.2 8.2 0 1 1 38.49 33.61Z"
        fill={rounded ? colors.inverse : pin}
      />
      <Circle cx={32} cy={28.6} r={3.56} fill={colors.accent} />
    </Svg>
  );
}

/** "TransferAround" wordmark with the accent on "Around". */
export function BrandWordmark({
  size = 24,
  tone = "light",
}: {
  size?: number;
  tone?: "light" | "dark";
}) {
  return (
    <Text
      style={{
        fontFamily: fonts.display,
        fontSize: size,
        letterSpacing: -0.5,
        color: tone === "dark" ? colors.inverse : colors.text,
      }}
    >
      Transfer
      <Text style={{ fontFamily: fonts.display, fontSize: size, color: colors.accent }}>
        Around
      </Text>
    </Text>
  );
}

export function BrandHeader({
  subtitle,
  tone = "light",
}: {
  subtitle?: string;
  tone?: "light" | "dark";
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row} accessibilityRole="header" accessibilityLabel="TransferAround">
        <LogoMark size={40} tone={tone} />
        <BrandWordmark size={26} tone={tone} />
      </View>
      {subtitle ? (
        <Text
          variant="body"
          color={tone === "dark" ? colors.textFaint : colors.textMuted}
          style={styles.sub}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

/** Full-screen branded splash shown while fonts load. */
export function BrandSplash() {
  return (
    <View style={styles.splash}>
      <LogoMark size={72} rounded />
      <Text style={styles.splashWord}>
        Transfer
        <Text style={{ fontFamily: fonts.display, color: colors.accent, fontSize: 22 }}>
          Around
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: space.xxl },
  row: { flexDirection: "row", alignItems: "center", gap: space.md },
  sub: { marginTop: space.md },
  splash: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
    gap: space.lg,
  },
  splashWord: { fontFamily: fonts.display, fontSize: 22, color: colors.text, letterSpacing: -0.5 },
});
