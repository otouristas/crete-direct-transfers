import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database";
import { Button, Text, colors } from "./ui";

WebBrowser.maybeCompleteAuthSession();
type Client = SupabaseClient<Database>;
const exchanges = new Map<string, Promise<void>>();

/** A callback can arrive through both ASWebAuthenticationSession and Expo Router. */
export function exchangeSocialCode(client: Client, code: string): Promise<void> {
  const existing = exchanges.get(code);
  if (existing) return existing;
  const exchange = client.auth.exchangeCodeForSession(code).then(({ error }) => {
    if (error) throw error;
  });
  if (exchanges.size > 3) exchanges.clear();
  exchanges.set(code, exchange);
  return exchange;
}

export async function signInWithGoogle(client: Client, scheme: string) {
  const redirectTo =
    Platform.OS === "web" ? `${window.location.origin}/auth/callback` : `${scheme}://auth/callback`;
  const { data, error } = await client.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo, skipBrowserRedirect: true },
  });
  if (error) throw error;
  if (!data.url) throw new Error("Google sign-in is unavailable. Please try email sign-in.");
  if (Platform.OS === "web") {
    window.location.assign(data.url);
    return;
  }
  const response = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (response.type !== "success") return;
  const callback = new URL(response.url);
  const expected = new URL(redirectTo);
  if (
    callback.protocol !== expected.protocol ||
    callback.host !== expected.host ||
    callback.pathname !== expected.pathname
  )
    throw new Error("The sign-in callback could not be verified.");
  const providerError = callback.searchParams.get("error_description");
  if (providerError) throw new Error(providerError);
  const code = callback.searchParams.get("code");
  if (!code) throw new Error("Sign-in did not return a verification code.");
  await exchangeSocialCode(client, code);
}

export async function signInWithApple(client: Client) {
  const rawNonce = Crypto.randomUUID();
  const nonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, rawNonce);
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
    ],
    nonce,
  });
  if (!credential.identityToken) throw new Error("Apple did not return an identity token.");
  const { data, error } = await client.auth.signInWithIdToken({
    provider: "apple",
    token: credential.identityToken,
    nonce: rawNonce,
  });
  if (error) throw error;
  const fullName = credential.fullName
    ? [credential.fullName.givenName, credential.fullName.familyName].filter(Boolean).join(" ")
    : "";
  if (fullName && data.user) {
    await client.auth.updateUser({ data: { full_name: fullName } });
    await client.from("profiles").update({ full_name: fullName }).eq("id", data.user.id);
  }
}

export function SocialSignIn({
  client,
  scheme,
  inverse = false,
}: {
  client: Client;
  scheme: string;
  inverse?: boolean;
}) {
  const [appleAvailable, setAppleAvailable] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (Platform.OS === "ios") void AppleAuthentication.isAvailableAsync().then(setAppleAvailable);
  }, []);
  async function begin(provider: "apple" | "google") {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      if (provider === "apple") await signInWithApple(client);
      else await signInWithGoogle(client, scheme);
    } catch (e) {
      if (!(e && typeof e === "object" && "code" in e && e.code === "ERR_REQUEST_CANCELED"))
        setError(e instanceof Error ? e.message : "Sign-in could not be completed.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <View style={styles.wrap}>
      {appleAvailable && (
        <View pointerEvents={busy ? "none" : "auto"} style={{ opacity: busy ? 0.55 : 1 }}>
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
            buttonStyle={
              inverse
                ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
                : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
            }
            cornerRadius={16}
            style={styles.apple}
            onPress={() => void begin("apple")}
          />
        </View>
      )}
      <Button
        title="Continue with Google"
        icon="logo-google"
        variant="outline"
        onPress={() => void begin("google")}
        loading={busy}
        fullWidth
        style={inverse ? styles.inverseButton : undefined}
      />
      {error && (
        <Text
          accessibilityRole="alert"
          variant="caption"
          color={inverse ? "#FFE1D1" : colors.danger}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { gap: 10 },
  apple: { width: "100%", height: 54 },
  inverseButton: { backgroundColor: "#F8F6EF", borderColor: "#F8F6EF" },
});
