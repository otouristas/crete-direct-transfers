import { Slot, useRootNavigationState, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  BrandSplash,
  colors,
  useAppFonts,
  useBrandSplashGate,
} from "@transferaround/mobile-shared/ui";
import { AuthProvider, useAuth } from "../lib/auth";
import { SKIP_AUTH } from "../lib/config";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

function AuthGate({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const root = segments[0];
  const onPracticeScreen = root === "practice";
  const onAuthScreen = root === "login" || root === "signup" || root === "auth";

  useEffect(() => {
    if (!navigationState?.key || SKIP_AUTH || loading || onPracticeScreen) return;
    if (!session && !onAuthScreen) {
      router.replace("/login");
    } else if (session && onAuthScreen) {
      router.replace("/(tabs)");
    }
  }, [loading, session, onAuthScreen, onPracticeScreen, router, navigationState?.key]);

  return (
    <>
      {children}
      {loading && !onPracticeScreen && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.bg,
          }}
        >
          <ActivityIndicator color={colors.accentDeep} />
        </View>
      )}
    </>
  );
}

export default function RootLayout() {
  const fontsLoaded = useAppFonts();
  const ready = useBrandSplashGate(fontsLoaded, 600);

  if (!ready) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <BrandSplash role="driver" tagline="Private airport transfers" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AuthProvider>
        <AuthGate>
          <Slot />
        </AuthGate>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
