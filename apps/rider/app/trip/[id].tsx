import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { fetchBooking } from "@transferaround/mobile-shared";
import {
  Avatar,
  Button,
  Card,
  Divider,
  Icon,
  ProgressStepper,
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

const STEPS = [
  { key: "pending", label: "Pending" },
  { key: "assigned", label: "Assigned" },
  { key: "enroute", label: "En route" },
  { key: "done", label: "Completed" },
];

function stepIndex(status: string, hasDriver: boolean) {
  const s = status.toLowerCase();
  if (["completed", "paid", "done", "finished"].includes(s)) return 3;
  if (["en_route", "on_the_way", "arriving", "in_progress", "started"].includes(s)) return 2;
  if (hasDriver || ["assigned", "confirmed", "accepted", "scheduled"].includes(s)) return 1;
  return 0;
}

function DetailRow({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Icon name={icon} size={18} color={colors.textFaint} />
      <Text variant="body" color={colors.textMuted} style={{ flex: 1 }}>
        {label}
      </Text>
      <Text variant="subtitle">{value}</Text>
    </View>
  );
}

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [booking, setBooking] = useState<Awaited<ReturnType<typeof fetchBooking>>>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      setBooking(await fetchBooking(supabase, id));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
    const poll = setInterval(() => void load(), 20_000);
    return () => clearInterval(poll);
  }, [load]);

  const header = (
    <Stack.Screen
      options={{
        headerShown: true,
        title: "Trip details",
        headerStyle: { backgroundColor: colors.surface },
        headerShadowVisible: false,
        headerTintColor: colors.text,
        headerTitleStyle: { fontFamily: fonts.bold, color: colors.text },
      }}
    />
  );

  if (loading && !booking) {
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
        <Text variant="title">Trip not found</Text>
        <Button title="Go back" variant="outline" icon="arrow-back" onPress={() => router.back()} />
      </View>
    );
  }

  const hasDriver = !!booking.driver_id;
  const idx = stepIndex(String(booking.status), hasDriver);

  return (
    <View style={styles.root}>
      {header}
      <ScrollView contentContainerStyle={{ paddingBottom: space.xxxl }} showsVerticalScrollIndicator={false}>
        <RouteMap from={booking.pickup_address} to={booking.dropoff_address} height={220} interactive />

        <View style={styles.body}>
          <Card padded>
            <View style={styles.statusRow}>
              <StatusBadge status={String(booking.status)} />
              <Text style={styles.price}>€{(booking.price_cents / 100).toFixed(0)}</Text>
            </View>
            <View style={{ marginTop: space.lg }}>
              <ProgressStepper steps={STEPS} currentIndex={idx} />
            </View>
          </Card>

          <Card padded>
            <RouteRail from={booking.pickup_address || "Pickup"} to={booking.dropoff_address || "Drop-off"} />
            <Divider inset={0} />
            <View style={{ gap: space.sm, marginTop: space.md }}>
              <DetailRow icon="calendar-outline" label="Pickup" value={new Date(booking.pickup_at).toLocaleString()} />
              <DetailRow icon="card-outline" label="Payment" value={String(booking.payment_status)} />
              <DetailRow icon="people-outline" label="Passengers" value={String(booking.passengers ?? 1)} />
            </View>
          </Card>

          {hasDriver ? (
            <Card padded>
              <View style={styles.driverRow}>
                <Avatar name="Your Driver" size={52} bg={colors.accentSoft} fg={colors.accentDeep} />
                <View style={{ flex: 1 }}>
                  <Text variant="subtitle">Driver assigned</Text>
                  <Text variant="caption" color={colors.textMuted}>
                    Contact details are in your confirmation email.
                  </Text>
                </View>
                <Icon name="checkmark-circle" size={24} color={colors.accent} />
              </View>
            </Card>
          ) : (
            <Card padded style={styles.waiting}>
              <ActivityIndicator color={colors.accent} />
              <View style={{ flex: 1 }}>
                <Text variant="subtitle">Finding your driver…</Text>
                <Text variant="caption" color={colors.textMuted}>
                  We’re matching you with a nearby transfer partner.
                </Text>
              </View>
            </Card>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center", gap: space.md },
  body: { padding: space.lg, gap: space.lg },
  statusRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  price: { fontFamily: fonts.display, fontSize: 24, color: colors.text, letterSpacing: -0.5 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: space.md },
  driverRow: { flexDirection: "row", alignItems: "center", gap: space.md },
  waiting: { flexDirection: "row", alignItems: "center", gap: space.md },
});
