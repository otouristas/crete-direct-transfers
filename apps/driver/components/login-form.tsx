import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { BrandHeader, Button, Field, colors, space } from "@transferaround/mobile-shared/ui";
import { useAuth } from "../lib/auth";
import { localizedAuthError, useI18n } from "../lib/i18n";

export default function LoginForm() {
  const { signIn } = useAuth();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit() {
    setBusy(true);
    setError(null);
    try {
      await signIn(email.trim(), password);
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
      <BrandHeader subtitle="Driver · Go online. Accept offers. Run the job." />
      <View style={styles.form}>
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
        <Button title={t("auth.signIn")} onPress={onSubmit} loading={busy} fullWidth />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, justifyContent: "center", padding: space.xxl },
  form: { gap: space.lg },
});
