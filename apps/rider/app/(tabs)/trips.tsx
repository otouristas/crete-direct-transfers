import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { fetchMyBookings } from "@transferaround/mobile-shared";
import {
  Card,
  Divider,
  EmptyState,
  Heading,
  RouteRail,
  Screen,
  StatusBadge,
  Text,
  colors,
  fonts,
  space,
} from "@transferaround/mobile-shared/ui";
import { useAuth } from "../../lib/auth";
import { supabase } from "../../lib/supabase";

type Trip = Awaited<ReturnType<typeof fetchMyBookings>>[number];

export default function TripsScreen() {
  const { user, isDemo } = useAuth();
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (isDemo) {
      setTrips([]);
      setLoading(false);
      return;
    }
    if (!user?.id || !user.email) return;
    setLoading(true);
    try {
      setTrips(await fetchMyBookings(supabase, user.id, user.email));
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.email, isDemo]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <Screen scroll refreshing={loading} onRefresh={load}>
      <Heading variant="h1">Your trips</Heading>

      {loading && trips.length === 0 ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: space.xl }} />
      ) : null}

      {!loading && trips.length === 0 ? (
        <EmptyState
          icon="map-outline"
          title={isDemo ? "Demo mode" : "No trips yet"}
          subtitle={
            isDemo
              ? "Live trips appear here once sign-in is restored."
              : "Book your first transfer and it will show up here."
          }
        />
      ) : null}

      {trips.map((t) => (
        <Card key={t.id} onPress={() => router.push(`/trip/${t.id}`)} padded>
          <View style={styles.cardHead}>
            <StatusBadge status={String(t.status)} />
            <Text style={styles.price}>€{(t.price_cents / 100).toFixed(0)}</Text>
          </View>
          <Divider />
          <View style={{ marginTop: space.md }}>
            <RouteRail from={t.pickup_address || "Pickup"} to={t.dropoff_address || "Drop-off"} compact />
          </View>
          <Text variant="caption" color={colors.textMuted} style={{ marginTop: space.md }}>
            {new Date(t.pickup_at).toLocaleString()}
          </Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  cardHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: space.md,
  },
  price: { fontFamily: fonts.bold, fontSize: 18, color: colors.text },
});
