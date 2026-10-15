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
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from "react-native-svg";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database";
import { SocialSignIn } from "./social-auth";
import { BrandWordmark, Button, Field, Icon, Text, fonts } from "./ui";

export function ArrivalArtwork({ driver = false }: { driver?: boolean }) {
  return (
    <Svg
      width="100%"
      height={230}
      viewBox="0 0 360 230"
      accessibilityRole="image"
      accessibilityLabel="An illustrated coastal road in Crete"
    >
      <Defs>
        <LinearGradient id="sea" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={driver ? "#295C50" : "#BBD9CE"} />
          <Stop offset="1" stopColor={driver ? "#153F38" : "#E1EBDF"} />
        </LinearGradient>
      </Defs>
      <Rect width="360" height="230" rx="28" fill="url(#sea)" />
      <Circle cx="284" cy="55" r="32" fill={driver ? "#D8ED98" : "#E2AD78"} />
      <Path
        d="M0 42C61 24 81 93 125 108S191 117 176 162 120 214 158 230H0Z"
        fill={driver ? "#46715A" : "#D7DFC8"}
      />
      <Path
        d="M0 76C49 55 71 105 109 121S152 139 127 173 74 215 108 230"
        stroke={driver ? "#819678" : "#F6F4EC"}
        strokeWidth="22"
        fill="none"
      />
      <Path
        d="M0 76C49 55 71 105 109 121S152 139 127 173 74 215 108 230"
        stroke={driver ? "#D9E6C1" : "#9DAA8C"}
        strokeWidth="1.5"
        strokeDasharray="5 7"
        fill="none"
      />
      <Path d="M221 151 240 147 254 151 236 155Z" fill={driver ? "#8AAE9B" : "#95B7AC"} />
      <Path d="m240 147-1-19 15 23" fill={driver ? "#C5DDC3" : "#F8F5E9"} />
      <Circle cx="110" cy="121" r="15" fill="#103F3A" />
      <Path
        d="m103 124 1-6h12l2 6m-15 0h15m-12-6 2-4h6l2 4"
        stroke="#E4F19F"
        strokeWidth="1.5"
        fill="none"
      />
      <Circle cx="43" cy="77" r="6" fill="#F6F4EC" stroke="#103F3A" strokeWidth="2" />
      <Path d="m285 160 3-13 13 2-11 4-5 7Z" fill={driver ? "#D6E4C0" : "#628B7C"} />
      <Path d="m278 91 8-6 14 3-10 3-4 11-3-2 2-9-7 1Z" fill={driver ? "#D6E4C0" : "#52776E"} />
    </Svg>
  );
}

export function AuthScreen({
  role,
  client,
  onSignIn,
  onPractice,
  onCreateAccount,
}: {
  role: "rider" | "driver";
  client: SupabaseClient<Database>;
  onSignIn: (email: string, password: string) => Promise<void>;
  onPractice: () => void;
  onCreateAccount?: () => void;
}) {
  const driver = role === "driver";
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
    <SafeAreaView style={[s.root, driver && s.dark]}>
      <StatusBar style={driver ? "light" : "dark"} />
      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={s.brandRow}>
            <BrandWordmark size={21} tone={driver ? "dark" : "light"} />
            <View style={[s.role, driver && s.roleDark]}>
              <Text style={[s.roleText, driver && s.lightText]}>
                {driver ? "DRIVER" : "TRAVELER"}
              </Text>
            </View>
          </View>
          <View style={s.headingWrap}>
            <Text style={[s.eyebrow, driver && s.sageText]}>
              {driver ? "GOOD DAYS START HERE" : "YOUR HOLIDAY STARTS HERE"}
            </Text>
            <Text accessibilityRole="header" style={[s.heading, driver && s.lightText]}>
              {driver ? "Your road.\nYour rhythm." : "Arrive a little\nmore yourself."}
            </Text>
            <Text style={[s.description, driver && s.sageText]}>
              {driver
                ? "A clear plan. Great passengers.\nA better way to spend your day."
                : "Land, meet your driver, switch off.\nWe’ll take it from here."}
            </Text>
          </View>
          <View style={s.art}>
            <ArrivalArtwork driver={driver} />
            <View style={[s.journey, driver && s.journeyDark]}>
              <View style={[s.journeyIcon, driver && { backgroundColor: "#D8ED98" }]}>
                <Icon
                  name={driver ? "navigate-outline" : "airplane-outline"}
                  size={21}
                  color="#103F3A"
                />
              </View>
              <View style={s.flex}>
                <Text style={[s.journeyTitle, driver && s.lightText]}>
                  {driver ? "Your next great journey" : "From airport to holiday"}
                </Text>
                <Text style={[s.journeyCaption, driver && s.sageText]}>
                  {driver
                    ? "Private transfers. Personal service."
                    : "Your ride, ready when you are."}
                </Text>
              </View>
              <Icon name="arrow-forward" size={18} color={driver ? "#D8ED98" : "#103F3A"} />
            </View>
          </View>
          <View style={s.actions}>
            <SocialSignIn
              client={client}
              scheme={driver ? "transferaround-driver" : "transferaround"}
              inverse={driver}
            />
            {!emailMode ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => setEmailMode(true)}
                style={s.emailLink}
              >
                <Text style={[s.emailText, driver && s.lightText]}>Continue with email ↗</Text>
              </Pressable>
            ) : (
              <View style={[s.emailForm, driver && { backgroundColor: "#F6F4EC" }]}>
                <Field
                  label="Email"
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  placeholder="you@email.com"
                  value={email}
                  onChangeText={setEmail}
                />
                <Field
                  label="Password"
                  autoComplete="current-password"
                  secureTextEntry
                  placeholder="Your password"
                  value={password}
                  onChangeText={setPassword}
                  error={error}
                />
                <Button title="Sign in" fullWidth loading={busy} onPress={() => void submit()} />
                {onCreateAccount && (
                  <Button title="Create an account" variant="ghost" onPress={onCreateAccount} />
                )}
              </View>
            )}
            <View style={[s.divider, driver && { backgroundColor: "#355C50" }]} />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Try a practice journey"
              onPress={onPractice}
              style={s.practice}
            >
              <View>
                <Text style={[s.practiceTitle, driver && s.lightText]}>Take it for a spin</Text>
                <Text style={[s.practiceCaption, driver && s.sageText]}>
                  Explore a connected journey. No account needed.
                </Text>
              </View>
              <View style={s.practiceArrow}>
                <Icon name="arrow-forward" size={18} color="#103F3A" />
              </View>
            </Pressable>
            <Text style={[s.footnote, driver && s.sageText]}>
              {driver
                ? "FOR PEOPLE WHO MAKE EVERY ARRIVAL A GOOD ONE."
                : "LESS PLANNING. MORE LOOKING FORWARD."}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F6F4EC" },
  dark: { backgroundColor: "#103F3A" },
  flex: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 28, gap: 20 },
  brandRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  role: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D0D7C8",
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  roleDark: { borderColor: "#46685A" },
  roleText: { fontSize: 9, letterSpacing: 1.6, fontFamily: fonts.bodySemibold, color: "#103F3A" },
  headingWrap: { gap: 12, paddingTop: 12 },
  eyebrow: { fontFamily: fonts.bodySemibold, fontSize: 9, letterSpacing: 2.2, color: "#6B7D70" },
  heading: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 45,
    lineHeight: 49,
    letterSpacing: -1.7,
    color: "#103F3A",
  },
  description: { fontFamily: fonts.body, fontSize: 13, lineHeight: 21, color: "#718074" },
  lightText: { color: "#F8F5E9" },
  sageText: { color: "#B6CCB6" },
  art: { marginBottom: 16 },
  journey: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    position: "absolute",
    bottom: -14,
    left: 14,
    right: 14,
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 19,
    shadowColor: "#103F3A",
    shadowOpacity: 0.1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
  },
  journeyDark: { backgroundColor: "#23544A" },
  journeyIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#E8EFDD",
    alignItems: "center",
    justifyContent: "center",
  },
  journeyTitle: { fontFamily: fonts.semibold, fontSize: 12, color: "#103F3A" },
  journeyCaption: { fontFamily: fonts.body, fontSize: 10, color: "#829084", marginTop: 4 },
  actions: { gap: 12 },
  emailLink: { alignItems: "center", paddingVertical: 10 },
  emailText: { fontFamily: fonts.bodySemibold, fontSize: 12, color: "#103F3A" },
  emailForm: { gap: 12, borderRadius: 20, padding: 16 },
  divider: { height: 1, backgroundColor: "#DBDFD2", marginVertical: 3 },
  practice: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    paddingVertical: 8,
  },
  practiceTitle: { fontFamily: fonts.semibold, fontSize: 15, color: "#103F3A" },
  practiceCaption: {
    fontFamily: fonts.body,
    fontSize: 9,
    lineHeight: 15,
    color: "#829084",
    marginTop: 4,
  },
  practiceArrow: {
    width: 39,
    height: 39,
    backgroundColor: "#D8ED98",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  footnote: {
    fontFamily: fonts.medium,
    fontSize: 8,
    letterSpacing: 1.1,
    color: "#829084",
    textAlign: "center",
    marginTop: 4,
  },
});
