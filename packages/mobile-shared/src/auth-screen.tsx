import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database";
import { SocialSignIn } from "./social-auth";
import { useOnboarding } from "./onboarding";
import { VehicleArtwork } from "./ui/mobility";
import { BrandWordmark, LogoMark, Button, Field, Icon, Text, colors, fonts } from "./ui";

export function AuthScreen({
  role,
  client,
  onSignIn,
  onPractice,
  onCreateAccount,
  onBrowse,
}: {
  role: "rider" | "driver";
  client: SupabaseClient<Database>;
  onSignIn: (email: string, password: string) => Promise<void>;
  onPractice: () => void;
  onCreateAccount?: () => void;
  onBrowse?: () => void;
}) {
  const driver = role === "driver";
  const tour = useOnboarding();
  const [emailMode, setEmailMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function submit() {
    setBusy(true);
    setError(null);
    try {
      await onSignIn(email.trim(), password);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <SafeAreaView style={s.root}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={s.content}
        >
          <View style={s.top}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <LogoMark size={30} tone={driver ? "dark" : "light"} />
              <BrandWordmark size={21} />
            </View>
            <Text style={s.role}>{driver ? "DRIVER" : "TRAVELER"}</Text>
          </View>
          <View style={s.hero}>
            <View style={s.blueLabel}>
              <View style={s.blueDot} />
              <Text style={s.label}>
                {driver ? "YOUR DAY. IN MOTION." : "PRIVATE RIDES. BETTER ARRIVALS."}
              </Text>
            </View>
            <Text accessibilityRole="header" style={s.title}>
              {driver ? "Your next move\nstarts here." : "Let’s get\nyou moving."}
            </Text>
            <VehicleArtwork style={s.car} />
            <Text style={s.description}>
              {driver
                ? "Sign in to see your transfers and share your live location on an active trip."
                : "Your pickup, your car, your driver.\nAll in one place."}
            </Text>
          </View>
          <View style={s.auth}>
            <SocialSignIn
              client={client}
              scheme={driver ? "transferaround-driver" : "transferaround"}
            />
            {!emailMode ? (
              <Button
                title="Continue with email"
                icon="mail-outline"
                variant="outline"
                fullWidth
                onPress={() => setEmailMode(true)}
              />
            ) : (
              <View style={s.form}>
                <Field
                  label="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@email.com"
                />
                <Field
                  label="Password"
                  autoComplete="current-password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Your password"
                  error={error}
                />
                <Button title="Sign in" fullWidth loading={busy} onPress={() => void submit()} />
                {onCreateAccount && (
                  <Button title="Create an account" variant="ghost" onPress={onCreateAccount} />
                )}
              </View>
            )}
            {onBrowse && (
              <Button
                title="Explore rides"
                icon="arrow-forward"
                variant="ghost"
                fullWidth
                onPress={onBrowse}
              />
            )}
          </View>
          <View style={s.divider} />
          <View style={s.links}>
            <Pressable accessibilityRole="button" onPress={tour.replay} style={s.link}>
              <Icon name="play-circle-outline" size={18} />
              <Text style={s.linkText}>How it works</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Try a practice journey"
              onPress={onPractice}
              style={s.link}
            >
              <Text style={s.linkText}>Practice ride</Text>
              <Icon name="arrow-forward" size={16} />
            </Pressable>
          </View>
          <Text variant="caption" center color={colors.textFaint}>
            Practice is separate from real trips. No payment is taken.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "white" },
  content: { paddingHorizontal: 24, paddingTop: 14, paddingBottom: 28 },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  role: { fontSize: 9, letterSpacing: 1.5, color: colors.textMuted, fontFamily: fonts.bold },
  hero: { paddingTop: 30 },
  blueLabel: { flexDirection: "row", alignItems: "center", gap: 6 },
  blueDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: colors.accent },
  label: { fontSize: 9, letterSpacing: 1.2, color: colors.accentDeep, fontFamily: fonts.bold },
  title: {
    fontFamily: fonts.bold,
    fontSize: 39,
    lineHeight: 44,
    letterSpacing: -1.6,
    marginTop: 13,
  },
  car: { width: "100%", height: 180, marginTop: 4 },
  description: { fontSize: 14, lineHeight: 21, color: colors.textMuted, marginBottom: 24 },
  auth: { gap: 10 },
  form: { gap: 12 },
  divider: { height: 1, backgroundColor: colors.border, marginTop: 22, marginBottom: 18 },
  links: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  link: { flexDirection: "row", alignItems: "center", gap: 7, paddingVertical: 8 },
  linkText: { fontSize: 12, fontFamily: fonts.bodySemibold },
});
