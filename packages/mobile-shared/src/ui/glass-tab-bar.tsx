import { Platform, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { colors } from "./tokens";

/**
 * Standard full-width translucent tab bar (not a floating capsule).
 * Use with Expo Router `<Tabs screenOptions={systemTabScreenOptions} />` — no custom `tabBar`.
 */
export function SystemTabBarBackground() {
  if (Platform.OS === "web") {
    return <View style={[StyleSheet.absoluteFill, styles.webGlass]} />;
  }
  if (Platform.OS === "ios") {
    return <BlurView intensity={64} tint="light" style={StyleSheet.absoluteFill} />;
  }
  return <View style={[StyleSheet.absoluteFill, styles.androidFill]} />;
}

export const systemTabScreenOptions = {
  headerShown: false,
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.textFaint,
  tabBarLabelStyle: {
    fontSize: 11,
    fontWeight: "600" as const,
  },
  tabBarStyle: {
    position: "relative" as const,
    backgroundColor: Platform.OS === "ios" ? "transparent" : "rgba(255,255,255,0.96)",
    borderTopColor: "rgba(16,17,20,0.12)",
    borderTopWidth: StyleSheet.hairlineWidth,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBarBackground: () => <SystemTabBarBackground />,
};

/** @deprecated Floating glass dock — use systemTabScreenOptions instead. */
export type GlassTabBarProps = {
  state: {
    index: number;
    routes: { key: string; name: string; params?: object }[];
  };
  descriptors: Record<string, { options: Record<string, unknown> }>;
  navigation: {
    emit: (e: { type: string; target: string; canPreventDefault: boolean }) => {
      defaultPrevented: boolean;
    };
    navigate: (name: string, params?: object) => void;
  };
};

/** @deprecated */
export function GlassTabBar(_props: GlassTabBarProps) {
  return null;
}

/** @deprecated Tab bar is in-flow now — no extra clearance needed. */
export const GLASS_TAB_BAR_CLEARANCE = 0;

/** @deprecated Prefer systemTabScreenOptions */
export const glassTabScreenOptions = systemTabScreenOptions;

const styles = StyleSheet.create({
  webGlass: {
    backgroundColor: "rgba(255,255,255,0.92)",
    // @ts-expect-error RN web CSS
    backdropFilter: "blur(20px) saturate(160%)",
    WebkitBackdropFilter: "blur(20px) saturate(160%)",
  },
  androidFill: {
    backgroundColor: "rgba(255,255,255,0.96)",
  },
});
