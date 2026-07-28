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
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none" accessibilityRole="image">
      {rounded ? <Rect width={48} height={48} rx={12} fill={colors.primary} /> : null}
      <Path
        d="M40.5 30.5A18 18 0 1 1 42 24"
        stroke={colors.accent}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <Path
        d="M42.5 15.5 42 24l-7.5-4"
        fill="none"
        stroke={colors.accent}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M24 12c-4.7 0-8.5 3.7-8.5 8.3 0 5.9 7 13.2 7.9 14.1a.9.9 0 0 0 1.2 0c.9-.9 7.9-8.2 7.9-14.1C32.5 15.7 28.7 12 24 12Z"
        fill={rounded ? colors.inverse : pin}
      />
      <Circle cx={24} cy={20.4} r={3.1} fill={colors.accent} />
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
