import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator } from "react-native";
import { exchangeSocialCode } from "@transferaround/mobile-shared/social-auth";
import { Button, Screen, Text, colors } from "@transferaround/mobile-shared/ui";
import { supabase } from "../../lib/supabase";
export default function AuthCallback() {
  const { code, error_description } = useLocalSearchParams<{
    code?: string;
    error_description?: string;
  }>();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (error_description) {
      setError(error_description);
      return;
    }
    if (!code) {
      setError("Sign-in did not return a verification code.");
      return;
    }
    void exchangeSocialCode(supabase, code)
      .then(() => router.replace("/(tabs)"))
      .catch((e) => setError(e instanceof Error ? e.message : "Could not complete sign-in."));
  }, [code, error_description, router]);
  return (
    <Screen contentStyle={{ flex: 1, justifyContent: "center", gap: 20 }}>
      {error ? (
        <>
          <Text accessibilityRole="alert">{error}</Text>
          <Button title="Back to sign in" onPress={() => router.replace("/login")} />
        </>
      ) : (
        <>
          <ActivityIndicator color={colors.accentDeep} />
          <Text center>Finishing your secure sign-in…</Text>
        </>
      )}
    </Screen>
  );
}
