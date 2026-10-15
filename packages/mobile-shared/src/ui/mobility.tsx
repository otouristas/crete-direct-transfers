/* eslint-disable @typescript-eslint/no-require-imports -- Metro needs static asset references. */
import { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Image,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { Icon } from "./icon";
import { Text } from "./text";
import { colors, fonts } from "./tokens";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduced);
    const listener = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduced);
    return () => listener.remove();
  }, []);
  return reduced;
}
export function VehicleArtwork({
  van = false,
  style,
}: {
  van?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[{ width: 112, height: 76 }, style]}>
      <Image
        source={van ? require("../../assets/van-v2.png") : require("../../assets/sedan-v2.png")}
        resizeMode="contain"
        style={{ width: "100%", height: "100%" }}
        accessibilityLabel={van ? "Executive passenger van" : "Premium sedan"}
      />
    </View>
  );
}
/** Decorative map illustration, used only in onboarding. Never represents live drivers. */
export function MobilityArtwork({ mode = 0, driver = false }: { mode?: number; driver?: boolean }) {
  const motion = useRef(new Animated.Value(0)).current;
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(motion, {
          toValue: 1,
          duration: 2700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(motion, {
          toValue: 0,
          duration: 2700,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [motion, reduced]);
  return (
    <View style={a.scene} accessibilityLabel="Illustration of a private transfer">
      <Svg width="100%" height="100%" viewBox="0 0 360 350" style={StyleSheet.absoluteFill}>
        <Rect width="360" height="350" rx="0" fill="#F1F3F6" />
        <Path d="M280 0H360V350H295C270 260 333 248 320 170S260 80 280 0" fill="#DBE9F6" />
        <Path
          d="M-10 60H370M-10 148H370M-10 252H370M75-10V370M191-10V370M285-10V370"
          stroke="white"
          strokeWidth="16"
        />
        <Path d="M-20 341 334-10M-15 204 210-20" stroke="white" strokeWidth="11" />
        <Rect x="94" y="76" width="70" height="52" rx="6" fill="#E1E8E3" />
        <Rect x="206" y="171" width="58" height="56" rx="7" fill="#E0E8E3" />
        <Path
          d="M76 250V148H191V60"
          stroke="#101114"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Circle cx="191" cy="60" r="14" fill="#245BEB" opacity=".12" />
        <Circle cx="191" cy="60" r="6" fill="#245BEB" stroke="white" strokeWidth="3" />
        <Rect
          x="69"
          y="243"
          width="14"
          height="14"
          rx="2"
          fill="#101114"
          stroke="white"
          strokeWidth="3"
        />
      </Svg>
      <View style={a.routeLabel}>
        <Icon name={driver ? "navigate" : "location"} size={13} color={colors.accent} />
        <Text style={a.routeText}>
          {mode === 1
            ? "Connected, every turn"
            : mode === 2
              ? "Your pickup, precisely"
              : "A better way to arrive"}
        </Text>
      </View>
      <Animated.View
        style={[
          a.car,
          {
            transform: [
              { translateY: motion.interpolate({ inputRange: [0, 1], outputRange: [5, -5] }) },
              { translateX: motion.interpolate({ inputRange: [0, 1], outputRange: [-5, 5] }) },
            ],
          },
        ]}
      >
        <VehicleArtwork van={driver && mode === 1} style={{ width: "100%", height: "100%" }} />
      </Animated.View>
      {mode === 1 && (
        <View style={a.liveChip}>
          <View style={a.blueDot} />
          <Text style={a.liveText}>Live GPS · how it works</Text>
        </View>
      )}
      {mode === 2 && (
        <View style={a.locationPin}>
          <Icon name="navigate" size={25} color="white" />
        </View>
      )}
    </View>
  );
}
export function LivePill({ live, label }: { live: boolean; label: string }) {
  return (
    <View style={[a.pill, { backgroundColor: live ? colors.accentSoft : colors.surfaceMuted }]}>
      <View style={[a.blueDot, { backgroundColor: live ? colors.accent : colors.textFaint }]} />
      <Text variant="caption" color={live ? colors.accentDeep : colors.textMuted}>
        {label}
      </Text>
    </View>
  );
}
const a = StyleSheet.create({
  scene: { height: 300, width: "100%", overflow: "hidden", backgroundColor: "#F1F3F6" },
  routeLabel: {
    position: "absolute",
    top: 35,
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 13,
    paddingVertical: 9,
    shadowOpacity: 0.07,
    shadowRadius: 12,
  },
  routeText: { fontSize: 11, fontFamily: fonts.bodySemibold },
  car: { position: "absolute", top: 72, left: 15, right: -10, height: 225 },
  liveChip: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    padding: 10,
  },
  blueDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.accent },
  liveText: { fontSize: 11 },
  locationPin: {
    position: "absolute",
    bottom: 36,
    right: 45,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "white",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: "flex-start",
  },
});
