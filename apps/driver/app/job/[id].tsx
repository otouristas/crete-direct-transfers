import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { updateJobStatus } from "@transferaround/mobile-shared";
import {
  advanceTrip,
  bookingPoint,
  useLiveTrip,
  useRealtimeBooking,
} from "@transferaround/mobile-shared/live-trip";
import { LivePill } from "@transferaround/mobile-shared/ui/mobility";
import {
  Avatar,
  Button,
  Icon,
  RouteMap,
  RouteRail,
  Text,
  colors,
  fonts,
} from "@transferaround/mobile-shared/ui";
import { startTripSharing, stopTripSharing } from "../../lib/tracking";
import { supabase } from "../../lib/supabase";

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const [sheetHeight, setSheetHeight] = useState(380);
  const [viewportHeight, setViewportHeight] = useState(height);
  const { booking, loading, error: loadError } = useRealtimeBooking(supabase, id);
  const live = useLiveTrip(supabase, id);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [background, setBackground] = useState<boolean | null>(null);
  const active = Boolean(booking && ["claimed", "en_route"].includes(booking.status));
  const closed = Boolean(booking && !active);
  useEffect(() => {
    if (closed) void stopTripSharing();
  }, [closed]);
  async function share(allowBackground = false) {
    if (!id) return;
    setBusy(true);
    setError(null);
    try {
      const result = await startTripSharing(id, { background: allowBackground });
      setBackground(result.background);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Location could not be shared.");
    } finally {
      setBusy(false);
    }
  }
  async function move() {
    if (!booking || !id) return;
    setBusy(true);
    setError(null);
    try {
      if (booking.status === "claimed") {
        const r = await startTripSharing(id);
        setBackground(r.background);
        await updateJobStatus(supabase, id, "en_route");
      } else if (booking.journey_stage === "to_pickup")
        await advanceTrip(supabase, id, "at_pickup");
      else if (booking.journey_stage === "at_pickup") await advanceTrip(supabase, id, "on_trip");
      else {
        await updateJobStatus(supabase, id, "completed");
        await stopTripSharing();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "The trip could not be updated.");
    } finally {
      setBusy(false);
    }
  }
  async function pause() {
    setBusy(true);
    setError(null);
    try {
      await stopTripSharing();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Location sharing could not be paused.");
    } finally {
      setBusy(false);
    }
  }
  if (loading && !booking)
    return (
      <View style={s.center}>
        <ActivityIndicator />
      </View>
    );
  if (!booking)
    return (
      <View style={s.center}>
        <Text variant="h2">Trip unavailable</Text>
        <Text color={colors.textMuted}>
          {loadError || "This trip isn’t assigned to your account."}
        </Text>
        <Button title="Back" onPress={() => router.back()} />
      </View>
    );
  const stage = booking.journey_stage;
  const title = !active
    ? booking.status === "completed"
      ? "Trip complete"
      : "Trip closed"
    : booking.status === "claimed"
      ? "Your next pickup"
      : stage === "to_pickup"
        ? "Head to pickup"
        : stage === "at_pickup"
          ? "Meet your traveler"
          : "On the way to drop-off";
  const action =
    booking.status === "claimed"
      ? "Start heading to pickup"
      : stage === "to_pickup"
        ? "I’ve arrived at pickup"
        : stage === "at_pickup"
          ? "Traveler on board · start ride"
          : "Complete trip";
  const point =
    active && live.position
      ? {
          lat: live.position.latitude,
          lng: live.position.longitude,
          heading: live.position.heading,
        }
      : null;
  const navigate = () => {
    const target =
      stage === "on_trip"
        ? bookingPoint(booking.dropoff_point)
        : bookingPoint(booking.pickup_point);
    const address = stage === "on_trip" ? booking.dropoff_address : booking.pickup_address;
    const destination = target ? `${target.lat},${target.lng}` : address;
    if (destination)
      void Linking.openURL(
        `https://maps.apple.com/?daddr=${encodeURIComponent(destination)}&dirflg=d`,
      );
  };
  return (
    <View style={s.root} onLayout={(e) => setViewportHeight(e.nativeEvent.layout.height)}>
      <RouteMap
        from={booking.pickup_address}
        to={booking.dropoff_address}
        fromPoint={bookingPoint(booking.pickup_point)}
        toPoint={bookingPoint(booking.dropoff_point)}
        driverPoint={point}
        height={viewportHeight}
        bottomInset={sheetHeight}
      />
      <View style={[s.top, { top: insets.top + 8 }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to jobs"
          style={s.circle}
          onPress={() => router.back()}
        >
          <Icon name="arrow-back" size={21} />
        </Pressable>
        <View style={s.farePill}>
          <Text style={s.fare}>€{(booking.price_cents / 100).toFixed(0)}</Text>
          <Text style={s.fareLabel}>TRIP FARE</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open navigation"
          style={s.circle}
          onPress={navigate}
        >
          <Icon name="navigate" size={22} />
        </Pressable>
      </View>
      <View
        onLayout={(e) => setSheetHeight(e.nativeEvent.layout.height)}
        style={[s.sheet, { paddingBottom: insets.bottom + 12, maxHeight: height * 0.61 }]}
      >
        <View style={s.grabber} />
        <ScrollView showsVerticalScrollIndicator={false} style={{ flexShrink: 1 }}>
          <LivePill
            live={live.fresh}
            label={
              !active
                ? "Location sharing stopped"
                : live.fresh
                  ? "Sharing live GPS"
                  : live.position
                    ? `Last sent ${live.ageSeconds}s ago`
                    : "Location sharing is off"
            }
          />
          <Text accessibilityRole="header" style={s.title}>
            {title}
          </Text>
          <View style={s.person}>
            <Avatar name={booking.customer_name} size={42} />
            <View style={{ flex: 1 }}>
              <Text variant="title">{booking.customer_name || "Traveler"}</Text>
              <Text variant="caption" color={colors.textMuted}>
                {booking.passengers} travelers · {booking.vehicle_class}
              </Text>
            </View>
            {booking.customer_phone && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Call traveler"
                style={s.circle}
                onPress={() => void Linking.openURL(`tel:${booking.customer_phone}`)}
              >
                <Icon name="call-outline" size={22} />
              </Pressable>
            )}
          </View>
          <RouteRail
            from={booking.pickup_address || "Pickup"}
            to={booking.dropoff_address || "Destination"}
          />
          <Text variant="caption" color={colors.textMuted} style={{ marginTop: 12 }}>
            {new Date(booking.pickup_at).toLocaleString()}
          </Text>
          {active && !live.fresh && (
            <Button
              title="Share my live location"
              icon="locate"
              variant="outline"
              fullWidth
              loading={busy}
              onPress={() => void share()}
            />
          )}
          {active && live.fresh && (
            <Button
              title="Pause location sharing"
              variant="ghost"
              fullWidth
              loading={busy}
              onPress={() => void pause()}
            />
          )}
          {active && background !== true && (
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                Alert.alert(
                  "Keep your traveler updated",
                  "Allow background location so your traveler can follow you while you use Maps or lock your phone. Sharing is limited to this active trip.",
                  [
                    { text: "Not now", style: "cancel" },
                    { text: "Enable background GPS", onPress: () => void share(true) },
                  ],
                )
              }
              style={s.background}
            >
              <Icon name="location-outline" size={17} color={colors.accent} />
              <Text style={s.backgroundText}>Keep sharing while using navigation</Text>
              <Icon name="chevron-forward" size={15} />
            </Pressable>
          )}
          {background === false && active && (
            <Text variant="caption" color={colors.textMuted}>
              Keep this app open for live GPS until background location is allowed.
            </Text>
          )}
          {(error || loadError) && (
            <Text
              accessibilityRole="alert"
              variant="caption"
              color={colors.danger}
              style={{ marginVertical: 10 }}
            >
              {error || loadError}
            </Text>
          )}
          <View style={{ height: 8 }} />
        </ScrollView>
        <View style={{ paddingTop: 12 }}>
          {active ? (
            <Button
              title={action}
              icon="arrow-forward"
              fullWidth
              loading={busy}
              onPress={() => void move()}
            />
          ) : (
            <Button
              title="Back to your jobs"
              fullWidth
              onPress={() => router.replace("/(tabs)/jobs")}
            />
          )}
        </View>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#EDF0F3" },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 18,
    backgroundColor: "white",
  },
  top: {
    position: "absolute",
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  circle: {
    width: 42,
    height: 42,
    borderRadius: 22,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  farePill: {
    backgroundColor: colors.primary,
    borderRadius: 28,
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 9,
  },
  fare: { color: "white", fontSize: 23, lineHeight: 29, fontFamily: fonts.bold },
  fareLabel: { fontSize: 7, letterSpacing: 1.2, color: "#CDD2DC", fontFamily: fonts.bold },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 11,
    shadowOpacity: 0.08,
    shadowRadius: 20,
  },
  grabber: {
    width: 34,
    height: 4,
    borderRadius: 3,
    backgroundColor: colors.borderStrong,
    alignSelf: "center",
    marginBottom: 16,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 26,
    lineHeight: 33,
    letterSpacing: -0.8,
    marginTop: 14,
  },
  person: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    paddingVertical: 19,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  background: { flexDirection: "row", gap: 8, alignItems: "center", paddingVertical: 14 },
  backgroundText: { flex: 1, fontSize: 12, color: colors.accentDeep },
});
