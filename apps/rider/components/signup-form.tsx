import { Link } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { BrandHeader, Button, Field, Text, colors, space } from "@transferaround/mobile-shared/ui";
import { useAuth } from "../lib/auth";

export default function SignupForm() {
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit() {
    setBusy(true);
    setError(null);
    try {
      await signUp(email.trim(), password, name.trim());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign up failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.root}
    >
      <BrandHeader subtitle="Create your account to book transfers." />
      <View style={styles.form}>
        <Field label="Full name" icon="person-outline" placeholder="Your name" value={name} onChangeText={setName} />
        <Field
          label="Email"
          icon="mail-outline"
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="you@email.com"
          value={email}
          onChangeText={setEmail}
        />
        <Field
          label="Password"
          icon="lock-closed-outline"
          secureTextEntry
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          error={error}
        />
        <Button title="Sign up" onPress={onSubmit} loading={busy} fullWidth />
        <Link href="/login" style={styles.link}>
          <Text variant="subtitle" color={colors.accentDeep} center>
            Already have an account?
          </Text>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, justifyContent: "center", padding: space.xxl },
  form: { gap: space.lg },
  link: { alignSelf: "center", marginTop: space.xs },
});
