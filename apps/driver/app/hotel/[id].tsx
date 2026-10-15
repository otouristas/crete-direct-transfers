import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Linking, Pressable, StyleSheet, TextInput, View } from "react-native";
import {
  Button,
  Heading,
  Screen,
  Text,
  colors,
  fonts,
  radius,
  shadow,
  space,
} from "@transferaround/mobile-shared/ui";
import { liteapiMobile } from "../../lib/liteapi";

export default function HotelDetailScreen() {
  const { id, offerId, name, checkin, checkout, photo, price, address } = useLocalSearchParams<{
    id: string;
    offerId?: string;
    name?: string;
    checkin?: string;
    checkout?: string;
    photo?: string;
    price?: string;
    address?: string;
  }>();
  const router = useRouter();
  const [hero, setHero] = useState(photo || "");
  const [desc, setDesc] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    void liteapiMobile.hotelDetails(id).then((res) => {
      const d = (res.data as Record<string, unknown> | undefined) ?? res;
      if (!hero && typeof d.main_photo === "string") setHero(d.main_photo);
      const description =
        typeof d.hotelDescription === "string"
          ? d.hotelDescription
          : typeof d.description === "string"
            ? d.description
            : null;
      if (description) setDesc(description.slice(0, 320));
    });
  }, [id, hero]);

  async function prebookAndPay() {
    if (!offerId) {
      setError("No rate available for this stay");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const pre = await liteapiMobile.hotelPrebook(offerId);
      const data = (pre.data as Record<string, unknown> | undefined) ?? pre;
      const prebookId = String(data.prebookId ?? "");
      const transactionId = String(data.transactionId ?? "");
      if (!prebookId) throw new Error("Missing prebookId");
      const url =
        `https://transferaround.com/hotels/checkout?prebookId=${encodeURIComponent(prebookId)}` +
        `&transactionId=${encodeURIComponent(transactionId)}`;
      setInfo("Opening secure checkout…");
      await Linking.openURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Prebook failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen scroll padded={false}>
      <View style={styles.hero}>
        {hero ? (
          <Image source={{ uri: hero }} style={styles.heroImg} resizeMode="cover" />
        ) : (
          <View style={[styles.heroImg, styles.heroFallback]} />
        )}
        <View style={styles.heroScrim} />
        <Pressable style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <View style={styles.heroMeta}>
          <Heading variant="h1" style={{ color: colors.inverse }}>
            {name || id}
          </Heading>
          {address ? (
            <Text variant="caption" color="rgba(248,250,252,0.8)">
              {address}
            </Text>
          ) : null}
          <Text variant="caption" color="rgba(248,250,252,0.7)" style={{ marginTop: 4 }}>
            {checkin} → {checkout}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        {price ? (
          <View style={styles.priceRow}>
            <Text style={styles.price}>€{Math.round(Number(price))}</Text>
            <Text variant="caption" color={colors.textMuted}>
              total stay
            </Text>
          </View>
        ) : null}

        {desc ? (
          <Text variant="body" color={colors.textMuted} style={{ marginTop: space.md }}>
            {desc}
            {desc.length >= 320 ? "…" : ""}
          </Text>
        ) : null}

        <View style={styles.form}>
          <Text variant="subtitle">Guest details</Text>
          <TextInput
            style={styles.input}
            placeholder="First name"
            placeholderTextColor={colors.textFaint}
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            style={styles.input}
            placeholder="Last name"
            placeholderTextColor={colors.textFaint}
            value={lastName}
            onChangeText={setLastName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.textFaint}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          {error ? (
            <Text variant="caption" color={colors.danger}>
              {error}
            </Text>
          ) : null}
          {info ? (
            <Text variant="caption" color={colors.accentDeep}>
              {info}
            </Text>
          ) : null}
          <Button
            title="Reserve & pay"
            onPress={() => void prebookAndPay()}
            loading={busy}
            fullWidth
          />
          <Button
            title="Back to offers"
            variant="ghost"
            onPress={() => router.push("/(tabs)")}
            fullWidth
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: 280,
    backgroundColor: colors.primary,
  },
  heroImg: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  heroFallback: { backgroundColor: colors.primary },
  heroScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(11, 37, 69, 0.4)",
  },
  back: {
    position: "absolute",
    top: space.xl,
    left: space.xl,
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.pill,
  },
  backText: {
    fontFamily: fonts.bodySemibold,
    fontSize: 13,
    color: colors.primary,
  },
  heroMeta: {
    position: "absolute",
    left: space.xl,
    right: space.xl,
    bottom: space.xl,
    gap: 4,
  },
  body: {
    paddingHorizontal: space.xl,
    paddingTop: space.xl,
    paddingBottom: space.xxxl,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: space.sm,
  },
  price: {
    fontFamily: fonts.display,
    fontSize: 32,
    color: colors.primary,
    letterSpacing: -0.5,
  },
  form: {
    marginTop: space.xxl,
    gap: space.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: space.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: 12,
    color: colors.text,
    backgroundColor: colors.surfaceMuted,
    fontFamily: fonts.body,
  },
});
