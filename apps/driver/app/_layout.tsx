import { Redirect, Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BrandSplash, colors, useAppFonts } from "@transferaround/mobile-shared/ui";
import { AuthProvider } from "../lib/auth";
import { useAuth } from "../lib/auth";
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

function AuthGuard() {
  const { user, profile, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const inAuth = segments[0] === "login";
    const inOnboarding = segments[0] === "onboarding";
    if (!user && !inAuth) router.replace("/login");
    if (!user || !profile) return;
    const driverProfile = Array.isArray(profile.driver_profiles)
      ? profile.driver_profiles[0]
      : profile.driver_profiles;
    const approved = driverProfile?.approval_status === "approved";
    if (!approved && !inOnboarding) router.replace("/onboarding");
    if (approved && (inAuth || inOnboarding)) router.replace("/(tabs)");
  }, [loading, profile, router, segments, user]);

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
          <AuthGuard />
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
