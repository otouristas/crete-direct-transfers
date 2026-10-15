import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  bookingPoint,
  useLiveTrip,
  useRealtimeBooking,
} from "@transferaround/mobile-shared/live-trip";
import { LivePill, VehicleArtwork } from "@transferaround/mobile-shared/ui/mobility";
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
import { getDevicePosition, type DevicePosition } from "@transferaround/mobile-shared/location";
import { supabase } from "../../lib/supabase";

type Driver = {
  full_name: string | null;
  phone: string | null;
  vehicle_make_model: string | null;
  vehicle_plate: string | null;
};
export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const [sheetHeight, setSheetHeight] = useState(380);
  const [viewportHeight, setViewportHeight] = useState(height);
  const { booking, loading, error } = useRealtimeBooking(supabase, id);
  const live = useLiveTrip(supabase, id);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [me, setMe] = useState<DevicePosition | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  useEffect(() => {
    if (!id || !booking?.driver_id) {
      setDriver(null);
      return;
    }
    let alive = true;
    void supabase.rpc("booking_driver_info", { p_booking_id: id }).then(({ data }) => {
      if (alive) setDriver(data?.[0] ?? null);
    });
    return () => {
      alive = false;
    };
  }, [id, booking?.driver_id]);
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
        <Text color={colors.textMuted}>{error || "This trip is not linked to your account."}</Text>
        <Button title="Back" onPress={() => router.back()} />
      </View>
    );
  const active = ["claimed", "en_route"].includes(booking.status);
  const position = active ? live.position : null;
  const title =
    booking.status === "completed"
      ? "You’ve arrived."
      : booking.status === "cancelled"
        ? "Trip cancelled"
        : !booking.driver_id
          ? "Finding your driver"
          : booking.journey_stage === "on_trip"
            ? "On your way"
            : booking.journey_stage === "at_pickup"
              ? "Your driver is here"
              : booking.status === "claimed"
                ? "Your driver is confirmed"
                : "Your driver is on the way";
  const locationLabel = !position
    ? "Waiting for driver GPS"
    : live.fresh
      ? "Live location"
      : `Last update ${live.ageSeconds ?? 0}s ago`;
  return (
    <View style={s.root} onLayout={(e) => setViewportHeight(e.nativeEvent.layout.height)}>
      <RouteMap
        from={booking.pickup_address}
        to={booking.dropoff_address}
        fromPoint={bookingPoint(booking.pickup_point)}
        toPoint={bookingPoint(booking.dropoff_point)}
        height={viewportHeight}
        bottomInset={sheetHeight}
        userPoint={me}
        driverPoint={
          position
            ? {
                lat: position.latitude,
                lng: position.longitude,
                heading: position.heading,
                capturedAt: position.captured_at,
              }
            : null
        }
      />
      <View style={[s.top, { top: insets.top + 8 }]}>
        <Pressable
          accessibilityLabel="Back to trips"
          accessibilityRole="button"
          style={s.circle}
          onPress={() => router.back()}
        >
          <Icon name="arrow-back" size={21} />
        </Pressable>
        <View style={s.tripLabel}>
          <Text style={s.tripLabelText}>YOUR TRANSFER</Text>
        </View>
        <Pressable
          accessibilityLabel="Use my location"
          accessibilityRole="button"
          style={s.circle}
          onPress={() => {
            void getDevicePosition()
              .then(setMe)
              .catch((e) => setGpsError(e.message));
          }}
        >
          <Icon name="locate" size={22} />
        </Pressable>
      </View>
      <View
        onLayout={(e) => setSheetHeight(e.nativeEvent.layout.height)}
        style={[s.sheet, { paddingBottom: insets.bottom + 14, maxHeight: height * 0.58 }]}
      >
        <View style={s.grabber} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {active && <LivePill live={live.fresh} label={locationLabel} />}
          <Text accessibilityRole="header" style={s.title}>
            {title}
          </Text>
          <Text style={s.subtitle}>
            {booking.status === "completed"
              ? "Your transfer is complete. Location sharing has ended."
              : booking.status === "cancelled"
                ? "This transfer was cancelled. Location sharing has ended."
                : booking.journey_stage === "at_pickup"
                  ? "Meet your driver at the pickup pin."
                  : booking.journey_stage === "on_trip"
                    ? "Follow your journey to your destination."
                    : booking.driver_id
                      ? "Your map updates from your driver’s GPS."
                      : "We’ll update this screen when a driver accepts."}
          </Text>
          {position && !live.fresh && (
            <Text accessibilityRole="alert" style={s.notice}>
              The marker is the last received position. Your driver may be offline.
            </Text>
          )}
          {position?.accuracy != null && position.accuracy > 100 && (
            <Text style={s.notice}>
              Approximate GPS position · accuracy ±{Math.round(position.accuracy)} m
            </Text>
          )}
          {booking.driver_id && (
            <View style={s.driverRow}>
              <Avatar name={driver?.full_name || position?.driver_name || "Driver"} size={46} />
              <View style={{ flex: 1, gap: 3 }}>
                <Text variant="title">
                  {driver?.full_name || position?.driver_name || "Your driver"}
                </Text>
                <Text variant="caption" color={colors.textMuted}>
                  {driver?.vehicle_make_model || position?.vehicle_name || "Assigned vehicle"}
                </Text>
                {(driver?.vehicle_plate || position?.vehicle_plate) && (
                  <Text style={s.plate}>{driver?.vehicle_plate || position?.vehicle_plate}</Text>
                )}
              </View>
              <VehicleArtwork
                van={booking.vehicle_class === "minivan"}
                style={{ width: 88, height: 62 }}
              />
            </View>
          )}
          <View style={s.divider} />
          <RouteRail
            from={booking.pickup_address || "Pickup"}
            to={booking.dropoff_address || "Destination"}
          />
          <View style={s.summary}>
            <Text style={s.fare}>€{(booking.price_cents / 100).toFixed(0)}</Text>
            <Text variant="caption" color={colors.textMuted}>
              {booking.payment_status.replaceAll("_", " ")} · {booking.passengers} travelers
            </Text>
          </View>
          {(gpsError || error) && (
            <Text color={colors.danger} variant="caption">
              {gpsError || error}
            </Text>
          )}
          {driver?.phone && active && (
            <Button
              title="Call your driver"
              icon="call-outline"
              variant="outline"
              fullWidth
              onPress={() => void Linking.openURL(`tel:${driver.phone}`)}
            />
          )}
          {!active && (
            <Button
              title="Back to your trips"
              fullWidth
              onPress={() => router.replace("/(tabs)/trips")}
            />
          )}
        </ScrollView>
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tripLabel: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  tripLabelText: { fontSize: 10, fontFamily: fonts.bold, letterSpacing: 1 },
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
    marginBottom: 18,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 26,
    lineHeight: 33,
    letterSpacing: -0.8,
    marginTop: 13,
  },
  subtitle: { fontSize: 13, lineHeight: 20, color: colors.textMuted, marginTop: 6 },
  notice: { fontSize: 12, lineHeight: 18, color: colors.textMuted, marginTop: 8 },
  driverRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 18 },
  plate: { fontSize: 12, fontFamily: fonts.bold, letterSpacing: 0.8 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 18 },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 18,
  },
  fare: { fontSize: 25, lineHeight: 32, fontFamily: fonts.bold },
});
