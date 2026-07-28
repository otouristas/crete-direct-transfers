import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Switch, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Stack } from "expo-router";
import {
  Button,
  Card,
  Field,
  Heading,
  Icon,
  Screen,
  Text,
  colors,
  space,
} from "@transferaround/mobile-shared/ui";
import type { Tables } from "@transferaround/mobile-shared";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";
import { useI18n } from "../lib/i18n";

type Submission = Tables<"driver_onboarding_submissions">;
type DriverDocument = Tables<"driver_documents">;
type DocumentType = "driving_licence" | "identity" | "insurance" | "vehicle_registration";

const documentTypes: Array<{
  type: DocumentType;
  label:
    | "onboarding.document.drivingLicence"
    | "onboarding.document.identity"
    | "onboarding.document.insurance"
    | "onboarding.document.registration";
}> = [
  { type: "driving_licence", label: "onboarding.document.drivingLicence" },
  { type: "identity", label: "onboarding.document.identity" },
  { type: "insurance", label: "onboarding.document.insurance" },
  { type: "vehicle_registration", label: "onboarding.document.registration" },
];

export default function DriverOnboardingScreen() {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const { t } = useI18n();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [documents, setDocuments] = useState<DriverDocument[]>([]);
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [expiry, setExpiry] = useState<Partial<Record<DocumentType, string>>>({});
  const [error, setError] = useState<string | null>(null);

  const driverProfile = useMemo(() => {
    const value = profile?.driver_profiles;
    return Array.isArray(value) ? value[0] : value;
  }, [profile?.driver_profiles]);

  const load = useCallback(async () => {
    if (!user?.id) return;
    const [submissionResult, documentResult] = await Promise.all([
      supabase.from("driver_onboarding_submissions").select("*").eq("driver_id", user.id).single(),
      supabase.from("driver_documents").select("*").eq("driver_id", user.id),
    ]);
    if (submissionResult.error) throw submissionResult.error;
    if (documentResult.error) throw documentResult.error;
    setSubmission(submissionResult.data);
    setDocuments(documentResult.data ?? []);
    setVehicleModel(driverProfile?.vehicle_make_model ?? "");
    setVehiclePlate(driverProfile?.vehicle_plate ?? "");
  }, [driverProfile?.vehicle_make_model, driverProfile?.vehicle_plate, user?.id]);

  useEffect(() => {
    setLoading(true);
    void load()
      .catch(() => setError(t("common.error")))
      .finally(() => setLoading(false));
  }, [load, t]);

  async function upload(type: DocumentType) {
    if (!user?.id) return;
    setBusy(type);
    setError(null);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/jpeg", "image/png", "image/webp"],
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      if ((asset.size ?? 0) > 10 * 1024 * 1024) throw new Error("file_too_large");
      const mimeType = asset.mimeType ?? "application/pdf";
      const safeName = asset.name.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(-100);
      const path = `${user.id}/${type}/${Date.now()}-${safeName}`;
      const body = await fetch(asset.uri).then((response) => response.arrayBuffer());
      const uploadResult = await supabase.storage
        .from("driver-documents")
        .upload(path, body, { contentType: mimeType, upsert: false });
      if (uploadResult.error) throw uploadResult.error;

      const current = documents.find((document) => document.document_type === type);
      if (current) {
        const deleted = await supabase.from("driver_documents").delete().eq("id", current.id);
        if (deleted.error) throw deleted.error;
      }

      const inserted = await supabase.from("driver_documents").insert({
        driver_id: user.id,
        document_type: type,
        storage_path: path,
        original_filename: asset.name,
        mime_type: mimeType,
        size_bytes: asset.size ?? body.byteLength,
        expires_on: expiry[type] || null,
      });
      if (inserted.error) throw inserted.error;
      if (current) {
        await supabase.storage.from("driver-documents").remove([current.storage_path]);
      }
      await load();
    } catch {
      setError(t("common.error"));
    } finally {
      setBusy(null);
    }
  }

  async function submit() {
    if (!user?.id) return;
    setBusy("submit");
    setError(null);
    try {
      const vehicle = await supabase
        .from("driver_profiles")
        .update({
          vehicle_class: driverProfile?.vehicle_class ?? "comfort",
          vehicle_make_model: vehicleModel.trim(),
          vehicle_plate: vehiclePlate.trim(),
        })
        .eq("id", user.id);
      if (vehicle.error) throw vehicle.error;
      const submitted = await supabase.rpc("submit_driver_onboarding", {
        p_consent_version: "driver-kyc-2026-07",
      });
      if (submitted.error) throw submitted.error;
      await refreshProfile();
      await load();
    } catch {
      setError(t("common.error"));
    } finally {
      setBusy(null);
    }
  }

  const editable = submission?.status === "draft" || submission?.status === "needs_changes";

  return (
    <Screen scroll>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <View style={styles.icon}>
          <Icon name="shield-checkmark-outline" size={28} color={colors.accentDeep} />
        </View>
        <View style={{ flex: 1 }}>
          <Heading variant="h1">{t("onboarding.title")}</Heading>
          <Text variant="body" color={colors.textMuted}>
            {t("onboarding.subtitle")}
          </Text>
        </View>
      </View>

      {loading ? <ActivityIndicator color={colors.accent} /> : null}
      {error ? (
        <Card padded style={styles.error}>
          <Text color={colors.danger}>{error}</Text>
        </Card>
      ) : null}

      {!loading && !editable ? (
        <Card padded>
          <Text variant="title">
            {submission?.status === "approved"
              ? t("onboarding.approved")
              : submission?.status === "rejected"
                ? t("onboarding.rejected")
                : submission?.status === "suspended"
                  ? t("onboarding.suspended")
                  : t("onboarding.submitted")}
          </Text>
          {submission?.reviewer_notes ? (
            <Text variant="body" color={colors.textMuted}>
              {submission.reviewer_notes}
            </Text>
          ) : null}
        </Card>
      ) : null}

      {editable ? (
        <>
          <Card padded>
            <Heading variant="h2">{t("onboarding.step.vehicle")}</Heading>
            <Field
              label={t("onboarding.vehicleModel")}
              value={vehicleModel}
              onChangeText={setVehicleModel}
            />
            <Field
              label={t("onboarding.vehiclePlate")}
              value={vehiclePlate}
              onChangeText={setVehiclePlate}
              autoCapitalize="characters"
            />
          </Card>

          <Card padded>
            <Heading variant="h2">{t("onboarding.step.documents")}</Heading>
            <Text variant="caption" color={colors.textMuted}>
              {t("onboarding.documentsHelp")}
            </Text>
            {documentTypes.map((definition) => {
              const current = documents.find(
                (document) => document.document_type === definition.type,
              );
              return (
                <View key={definition.type} style={styles.document}>
                  <View>
                    <Text variant="subtitle">{t(definition.label)}</Text>
                    <Text variant="caption" color={colors.textMuted}>
                      {current?.original_filename ?? t("common.optional")}
                    </Text>
                  </View>
                  <Field
                    label={t("onboarding.expiry")}
                    value={expiry[definition.type] ?? current?.expires_on ?? ""}
                    onChangeText={(value) =>
                      setExpiry((values) => ({ ...values, [definition.type]: value }))
                    }
                    placeholder="YYYY-MM-DD"
                  />
                  <Button
                    title={t(current ? "onboarding.replace" : "onboarding.upload")}
                    variant="outline"
                    size="md"
                    loading={busy === definition.type}
                    onPress={() => void upload(definition.type)}
                  />
                </View>
              );
            })}
          </Card>

          <Card padded style={styles.consent}>
            <Text variant="body" style={{ flex: 1 }}>
              {t("onboarding.consent")}
            </Text>
            <Switch value={consent} onValueChange={setConsent} />
          </Card>

          <Button
            title={t("onboarding.submit")}
            loading={busy === "submit"}
            disabled={
              !consent ||
              documents.length !== 4 ||
              vehicleModel.trim().length < 2 ||
              vehiclePlate.trim().length < 2
            }
            onPress={() => void submit()}
            fullWidth
          />
        </>
      ) : null}

      <Button
        title={t("common.signOut")}
        variant="outline"
        icon="log-out-outline"
        onPress={() => void signOut()}
        fullWidth
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", gap: space.md, alignItems: "flex-start" },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accentSoft,
  },
  document: {
    gap: space.md,
    paddingVertical: space.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  consent: { flexDirection: "row", alignItems: "center", gap: space.md },
  error: { borderColor: colors.danger },
});
