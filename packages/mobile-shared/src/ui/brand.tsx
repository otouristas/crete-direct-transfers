import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
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
      <Text style={{ fontFamily: fonts.display, fontSize: size, color: tone === "dark" ? "#D8ED98" : colors.accentDeep }}>
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
export function BrandSplash({
  tagline = "Private airport transfers",
  role,
}: {
  tagline?: string;
  role?: "rider" | "driver";
}) {
  const plateScale = useRef(new Animated.Value(0.82)).current;
  const plateOpacity = useRef(new Animated.Value(0)).current;
  const markOpacity = useRef(new Animated.Value(0)).current;
  const markY = useRef(new Animated.Value(18)).current;
  const ringSpin = useRef(new Animated.Value(0)).current;
  const wordOpacity = useRef(new Animated.Value(0)).current;
  const wordY = useRef(new Animated.Value(16)).current;
  const tagOpacity = useRef(new Animated.Value(0)).current;
  const routeProgress = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0.25)).current;
  const glow2 = useRef(new Animated.Value(0.15)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(plateOpacity, {
          toValue: 1,
          duration: 480,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(plateScale, {
          toValue: 1,
          friction: 7,
          tension: 56,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(markOpacity, {
          toValue: 1,
          duration: 360,
          useNativeDriver: true,
        }),
        Animated.spring(markY, {
          toValue: 0,
          friction: 8,
          tension: 64,
          useNativeDriver: true,
        }),
        Animated.timing(ringSpin, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(wordOpacity, {
          toValue: 1,
          duration: 440,
          useNativeDriver: true,
        }),
        Animated.timing(wordY, {
          toValue: 0,
          duration: 440,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(routeProgress, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(tagOpacity, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }),
    ]).start();

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(glow, {
            toValue: 0.55,
            duration: 1600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(glow2, {
            toValue: 0.35,
            duration: 1600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(glow, {
            toValue: 0.22,
            duration: 1600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(glow2, {
            toValue: 0.12,
            duration: 1600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [
    glow,
    glow2,
    markOpacity,
    markY,
    plateOpacity,
    plateScale,
    ringSpin,
    routeProgress,
    tagOpacity,
    wordOpacity,
    wordY,
  ]);

  const spin = ringSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ["-48deg", "0deg"],
  });

  const routeOpacity = routeProgress.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 0.7, 1],
  });

  const roleLine =
    role === "driver"
      ? "Driver · Go online. Accept offers."
      : role === "rider"
        ? "Book in seconds"
        : null;

  return (
    <View style={styles.splash} accessibilityLabel="TransferAround">
      <View style={styles.atmosphere} pointerEvents="none">
        <Animated.View style={[styles.orbLarge, { opacity: glow }]} />
        <Animated.View style={[styles.orbSmall, { opacity: glow2 }]} />
        <View style={styles.vignette} />
      </View>

      <Animated.View
        style={[
          styles.plate,
          {
            opacity: plateOpacity,
            transform: [{ scale: plateScale }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.ringHalo,
            {
              opacity: markOpacity,
              transform: [{ rotate: spin }],
            },
          ]}
        >
          <Svg width={128} height={128} viewBox="0 0 128 128" fill="none">
            <Path
              d="M108 82A44 44 0 1 1 112 64"
              stroke={colors.accent}
              strokeWidth={5}
              strokeLinecap="round"
              opacity={0.95}
            />
            <Path
              d="M114 44 112 64l-18-9.5"
              fill="none"
              stroke={colors.accent}
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Animated.View>

        <Animated.View
          style={{
            opacity: markOpacity,
            transform: [{ translateY: markY }],
          }}
        >
          {/* Padded brand plate — even inset so the mark never clips */}
          <View style={styles.markPad}>
            <Svg width={72} height={72} viewBox="0 0 48 48" fill="none">
              <Path
                d="M24 12c-4.7 0-8.5 3.7-8.5 8.3 0 5.9 7 13.2 7.9 14.1a.9.9 0 0 0 1.2 0c.9-.9 7.9-8.2 7.9-14.1C32.5 15.7 28.7 12 24 12Z"
                fill={colors.inverse}
              />
              <Circle cx={24} cy={20.4} r={3.1} fill={colors.accent} />
            </Svg>
          </View>
        </Animated.View>
      </Animated.View>

      <Animated.View
        style={{
          opacity: wordOpacity,
          transform: [{ translateY: wordY }],
          alignItems: "center",
          gap: space.md,
          paddingHorizontal: space.xxl,
        }}
      >
        <Text style={styles.splashWord}>
          Transfer
          <Text style={styles.splashAccent}>Around</Text>
        </Text>

        <Animated.View style={[styles.routeRow, { opacity: routeOpacity }]}>
          <View style={styles.routeDot} />
          <View style={styles.routeDash} />
          <View style={[styles.routeDot, styles.routeDotEnd]} />
        </Animated.View>

        <Animated.View style={{ opacity: tagOpacity, alignItems: "center", gap: 6 }}>
          <Text style={styles.tagline}>{tagline}</Text>
          {roleLine ? <Text style={styles.roleLine}>{roleLine}</Text> : null}
        </Animated.View>
      </Animated.View>
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
    backgroundColor: "rgba(11,37,69,0.55)",
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
