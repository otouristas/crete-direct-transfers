import { Redirect, Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BrandSplash, colors, useAppFonts } from "@transferaround/mobile-shared/ui";
import { AuthProvider } from "../lib/auth";
import { SKIP_AUTH } from "../lib/config";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

function DemoAuthBypass() {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!SKIP_AUTH) return;
    const root = segments[0];
    if (root === "login" || root === "signup") {
      router.replace("/(tabs)");
    }
  }, [segments, router]);

  if (SKIP_AUTH && (segments[0] === "login" || segments[0] === "signup")) {
    return <Redirect href="/(tabs)" />;
  }
  return null;
}

export default function RootLayout() {
  const fontsLoaded = useAppFonts();

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {fontsLoaded ? (
        <AuthProvider>
          <DemoAuthBypass />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.bg },
            }}
          />
        </AuthProvider>
      ) : (
        <BrandSplash />
      )}
    </SafeAreaProvider>
  );
}
