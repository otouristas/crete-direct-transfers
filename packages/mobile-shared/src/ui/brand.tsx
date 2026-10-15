/* eslint-disable @typescript-eslint/no-require-imports -- Metro needs static asset references. */
import { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Text } from "./text";
import { colors, fonts, space } from "./tokens";

/** Accepted Interchange identity; use the same artwork as the app icons. */
export function LogoMark({
  size = 36,
  tone = "light",
  rounded = false,
}: {
  size?: number;
  tone?: "light" | "dark";
  rounded?: boolean;
}) {
  return (
    <Image
      source={
        tone === "dark"
          ? require("../../assets/identity-driver-v3.png")
          : require("../../assets/identity-rider-v3.png")
      }
      accessibilityRole="image"
      accessibilityLabel="TransferAround"
      resizeMode="contain"
      style={{ width: size, height: size, borderRadius: size * (rounded ? 0.25 : 0.22) }}
    />
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
      <Text
        style={{
          fontFamily: fonts.display,
          fontSize: size,
          color: tone === "dark" ? colors.inverse : colors.text,
        }}
      >
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

/**
 * Full-bleed splash — atmosphere, padded brand plate, wordmark, route beat.
 */
export function BrandSplash({ role }: { tagline?: string; role?: "rider" | "driver" }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
      }}
    >
      <LogoMark size={56} tone={role === "driver" ? "dark" : "light"} />
      <BrandWordmark size={28} />
      <Text style={{ fontSize: 10, letterSpacing: 2, color: colors.textMuted }}>
        {role === "driver" ? "DRIVER" : "PRIVATE TRANSFERS"}
      </Text>
    </View>
  );
}

/** Hold the splash for fonts + a minimum brand beat. */
export function useBrandSplashGate(fontsLoaded: boolean, minMs = 2600): boolean {
  const readyAt = useRef<number | null>(null);
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    if (!fontsLoaded) return;
    if (readyAt.current == null) readyAt.current = Date.now();
    const elapsed = Date.now() - readyAt.current;
    const wait = Math.max(0, minMs - elapsed);
    const t = setTimeout(() => setShowApp(true), wait);
    return () => clearTimeout(t);
  }, [fontsLoaded, minMs]);

  return showApp;
}

const styles = StyleSheet.create({
  wrap: { marginBottom: space.xxl },
  row: { flexDirection: "row", alignItems: "center", gap: space.md },
  sub: { marginTop: space.md },
  splash: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    gap: space.xxxl,
    overflow: "hidden",
  },
  atmosphere: {
    ...StyleSheet.absoluteFillObject,
  },
  orbLarge: {
    position: "absolute",
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: colors.accent,
    top: "18%",
    alignSelf: "center",
    left: "50%",
    marginLeft: -170,
  },
  orbSmall: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#1E3A5F",
    bottom: "12%",
    right: -40,
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5, 16, 32, 0.28)",
  },
  plate: {
    width: 168,
    height: 168,
    borderRadius: 42,
    backgroundColor: "rgba(248,250,252,0.08)",
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: "rgba(248,250,252,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  ringHalo: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  markPad: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: "rgba(16,17,20,0.55)",
    borderWidth: 1,
    borderColor: "rgba(248,250,252,0.12)",
    alignItems: "center",
    justifyContent: "center",
    // Even inset so the pin sits optically centered inside the plate
    paddingTop: 4,
  },
  splashWord: {
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 40,
    color: colors.inverse,
    letterSpacing: -0.8,
    textAlign: "center",
  },
  splashAccent: {
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 40,
    color: colors.accent,
    letterSpacing: -0.8,
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  routeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
  },
  routeDotEnd: {
    backgroundColor: colors.inverse,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  routeDash: {
    width: 56,
    height: 2,
    borderRadius: 1,
    backgroundColor: "rgba(248,250,252,0.35)",
  },
  tagline: {
    fontFamily: fonts.medium,
    fontSize: 15,
    lineHeight: 20,
    color: "rgba(248,250,252,0.78)",
    letterSpacing: 0.15,
    textAlign: "center",
  },
  roleLine: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    color: colors.accent,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
});
