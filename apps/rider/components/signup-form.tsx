import { Link } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { BrandHeader, Button, Field, Text, colors, space } from "@transferaround/mobile-shared/ui";
import { useAuth } from "../lib/auth";
import { localizedAuthError, useI18n } from "../lib/i18n";

export default function SignupForm() {
  const { signUp } = useAuth();
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit() {
    if (name.trim().length < 2) {
      setError(t("validation.name"));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(t("validation.email"));
      return;
    }
    if (password.length < 8) {
      setError(t("validation.password"));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const active = await signUp(email.trim(), password, name.trim());
      if (!active) setSent(true);
    } catch (e) {
      setError(t(localizedAuthError(e)));
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
        {sent ? (
          <>
            <Text variant="title" center>
              {t("auth.checkEmail")}
            </Text>
            <Link href="/login" style={styles.link}>
              <Text variant="subtitle" color={colors.accentDeep} center>
                {t("auth.signIn")}
              </Text>
            </Link>
          </>
        ) : (
          <>
            <Field
              label={t("profile.fullName")}
              icon="person-outline"
              value={name}
              onChangeText={setName}
            />
            <Field
              label={t("auth.email")}
              icon="mail-outline"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="you@email.com"
              value={email}
              onChangeText={setEmail}
            />
            <Field
              label={t("auth.password")}
              icon="lock-closed-outline"
              secureTextEntry
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              error={error}
            />
            <Button title={t("auth.createAccount")} onPress={onSubmit} loading={busy} fullWidth />
            <Link href="/login" style={styles.link}>
              <Text variant="subtitle" color={colors.accentDeep} center>
                {t("auth.signIn")}
              </Text>
            </Link>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, justifyContent: "center", padding: space.xxl },
  form: { gap: space.lg },
  link: { alignSelf: "center", marginTop: space.xs },
});
