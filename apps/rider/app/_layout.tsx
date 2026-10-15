import { Redirect, Stack, useRouter, useSegments } from "expo-router";
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
  const root = segments[0];
  const onPracticeScreen = root === "practice";
  const onAuthScreen = root === "login" || root === "signup";

  useEffect(() => {
    if (SKIP_AUTH || loading || onPracticeScreen) return;
    if (!session && !onAuthScreen) {
      router.replace("/login");
    } else if (session && onAuthScreen) {
      router.replace("/(tabs)");
    }
  }, [loading, session, onAuthScreen, onPracticeScreen, router]);

  if (SKIP_AUTH || onPracticeScreen) return <>{children}</>;

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.bg,
        }}
      >
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (!session && !onAuthScreen) {
    return <Redirect href="/login" />;
  }

  if (session && onAuthScreen) {
    return <Redirect href="/(tabs)" />;
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const fontsLoaded = useAppFonts();
  const ready = useBrandSplashGate(fontsLoaded, 2800);

  if (!ready) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <BrandSplash role="rider" tagline="Private airport transfers" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AuthProvider>
        <AuthGate>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.bg },
            }}
          />
        </AuthGate>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
