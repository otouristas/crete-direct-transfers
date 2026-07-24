import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Linking, ScrollView, StyleSheet, View } from "react-native";
import { fetchBooking, reportUnableToComplete, updateJobStatus } from "@transferaround/mobile-shared";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Icon,
  RouteMap,
  RouteRail,
  StatusBadge,
  Text,
  colors,
  fonts,
  radius,
  space,
} from "@transferaround/mobile-shared/ui";
import { supabase } from "../../lib/supabase";

type Booking = NonNullable<Awaited<ReturnType<typeof fetchBooking>>>;

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      setBooking(await fetchBooking(supabase, id));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  async function move(status: "en_route" | "completed" | "no_show") {
    if (!id) return;
    setBusy(status);
    setError(null);
    try {
      await updateJobStatus(supabase, id, status);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusy(null);
    }
  }

  async function unable() {
    if (!id) return;
    setBusy("unable");
    try {
      await reportUnableToComplete(supabase, id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Report failed");
    } finally {
      setBusy(null);
    }
  }

  const header = (
    <Stack.Screen
      options={{
        title: "Job",
        headerShown: true,
        headerStyle: { backgroundColor: colors.surface },
        headerShadowVisible: false,
        headerTintColor: colors.text,
        headerTitleStyle: { fontFamily: fonts.bold, color: colors.text },
      }}
    />
  );

  if (loading) {
    return (
      <View style={styles.center}>
        {header}
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.center}>
        {header}
        <Icon name="alert-circle-outline" size={40} color={colors.textFaint} />
        <Text variant="title">Job not found</Text>
        <Button title="Go back" variant="outline" icon="arrow-back" onPress={() => router.back()} />
      </View>
    );
  }

  const status = String(booking.status);
  const canStart = status === "confirmed" || status === "assigned" || status === "pending";
  const enRoute = status === "en_route";
  const maps = booking.dropoff_address
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(booking.dropoff_address)}`
    : null;

  return (
    <View style={styles.root}>
      {header}
      <ScrollView contentContainerStyle={{ paddingBottom: space.xxxl }} showsVerticalScrollIndicator={false}>
        <RouteMap from={booking.pickup_address} to={booking.dropoff_address} height={220} interactive />

        <View style={styles.body}>
          <Card padded>
            <View style={styles.statusRow}>
              <StatusBadge status={status} />
              <Text style={styles.price}>€{(booking.price_cents / 100).toFixed(0)}</Text>
            </View>
            <Divider />
            <View style={{ marginTop: space.md }}>
              <RouteRail from={booking.pickup_address || "Pickup"} to={booking.dropoff_address || "Drop-off"} />
            </View>
            <Text variant="caption" color={colors.textMuted} style={{ marginTop: space.md }}>
              {new Date(booking.pickup_at).toLocaleString()}
            </Text>
          </Card>

          <Card padded>
            <View style={styles.customer}>
              <Avatar name={booking.customer_name} size={48} />
              <View style={{ flex: 1 }}>
                <Text variant="subtitle">{booking.customer_name || "Traveler"}</Text>
                <Text variant="caption" color={colors.textMuted}>
                  {booking.customer_phone || "No phone"}
                </Text>
              </View>
              {booking.customer_phone ? (
                <Button
                  title="Call"
                  variant="outline"
                  icon="call-outline"
                  size="md"
                  onPress={() => void Linking.openURL(`tel:${booking.customer_phone}`)}
                />
              ) : null}
            </View>
          </Card>

          {maps ? (
            <Button title="Navigate" variant="primary" icon="navigate" onPress={() => void Linking.openURL(maps)} fullWidth />
          ) : null}

          {error ? (
            <View style={styles.errorBox}>
              <Icon name="alert-circle" size={18} color={colors.danger} />
              <Text variant="caption" color={colors.danger} style={{ flex: 1 }}>
                {error}
              </Text>
            </View>
          ) : null}

          {canStart ? (
            <Button
              title="Start trip · En route"
              variant="accent"
              icon="play"
              onPress={() => void move("en_route")}
              loading={busy === "en_route"}
              fullWidth
            />
          ) : null}

          {enRoute ? (
            <View style={{ gap: space.md }}>
              <Button
                title="Complete trip"
                variant="accent"
                icon="checkmark-done"
                onPress={() => void move("completed")}
                loading={busy === "completed"}
                fullWidth
              />
              <Button
                title="Traveler no-show"
                variant="outline"
                onPress={() => void move("no_show")}
                loading={busy === "no_show"}
                fullWidth
              />
              <Button
                title="Unable to complete"
                variant="danger"
                onPress={() => void unable()}
                loading={busy === "unable"}
                fullWidth
              />
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center", gap: space.md },
  body: { padding: space.lg, gap: space.lg },
  statusRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: space.md },
  price: { fontFamily: fonts.display, fontSize: 24, color: colors.text, letterSpacing: -0.5 },
  customer: { flexDirection: "row", alignItems: "center", gap: space.md },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    backgroundColor: colors.dangerSoft,
    padding: space.md,
    borderRadius: radius.md,
  },
});
