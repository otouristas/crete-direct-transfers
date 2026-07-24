import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { createBooking } from "@transferaround/mobile-shared";
import {
  BottomSheetScaffold,
  Button,
  Card,
  Field,
  Heading,
  Icon,
  LogoMark,
  RouteMap,
  RouteRail,
  SectionLabel,
  Stepper,
  Text,
  colors,
  fonts,
  radius,
  space,
} from "@transferaround/mobile-shared/ui";
import { useAuth } from "../../lib/auth";
import { API_URL } from "../../lib/config";
import { PRESET_ROUTES, type PresetRoute } from "../../lib/presets";
import { supabase } from "../../lib/supabase";
import { VEHICLE_OPTIONS, priceForClass, type VehicleOption } from "../../lib/vehicles";

const WIN_H = Dimensions.get("window").height;

function defaultPickupIso() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(12, 0, 0, 0);
  return d.toISOString().slice(0, 16);
}

function friendlyDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Pick a date & time";
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function BookScreen() {
  const { user, profile, isDemo } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [route, setRoute] = useState<PresetRoute>(PRESET_ROUTES[0]);
  const [vehicle, setVehicle] = useState<VehicleOption>(VEHICLE_OPTIONS[0]);
  const [pickupLocal, setPickupLocal] = useState(defaultPickupIso());
  const [passengers, setPassengers] = useState(2);
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [name, setName] = useState(profile?.full_name ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalCents = useMemo(() => priceForClass(route.priceCents, vehicle), [route, vehicle]);
  const totalLabel = `€${(totalCents / 100).toFixed(0)}`;

  async function onBook() {
    if (isDemo) {
      setError("Demo preview — booking disabled until login is restored.");
      return;
    }
    if (!user?.email) {
      setError("Sign in required");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const pickupAt = new Date(pickupLocal).toISOString();
      const created = await createBooking(supabase, {
        user_id: user.id,
        customer_email: user.email,
        customer_name: name.trim() || profile?.full_name || "Traveler",
        customer_phone: phone.trim() || "+30000000000",
        route_slug: route.routeSlug,
        vehicle_class: vehicle.vehicleClass,
        passengers: Math.max(1, passengers),
        pickup_at: pickupAt,
        trip_type: "oneway",
        pickup_address: route.from,
        dropoff_address: route.to,
        price_cents: totalCents,
        currency: "EUR",
        market: route.market,
        status: "pending",
        payment_status: "unpaid",
        bags_cabin: 1,
        bags_checked: 1,
        extras: {},
      });

      await fetch(`${API_URL}/api/dispatch/new`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          bookingId: created.id,
          market: route.market,
          countryCode: route.countryCode,
        }),
      });

      const checkout = await fetch(`${API_URL}/api/stripe/checkout`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          bookingId: created.id,
          priceCents: totalCents,
          customerEmail: user.email,
          description: `${route.label} · ${vehicle.name}`,
        }),
      }).then((r) => r.json() as Promise<{ url?: string | null; skipped?: boolean }>);

      if (checkout.url) {
        await Linking.openURL(checkout.url);
      }

      router.push(`/trip/${created.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Booking failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.root}>
      <View style={StyleSheet.absoluteFill}>
        <RouteMap from={route.from} to={route.to} height={WIN_H} interactive={false} />
      </View>

      <View style={[styles.topBar, { paddingTop: insets.top + space.sm }]}>
        <View style={styles.brandPill}>
          <LogoMark size={22} rounded />
          <Text style={styles.brandText}>
            Transfer<Text style={{ fontFamily: fonts.display, fontSize: 15, color: colors.accent }}>Around</Text>
          </Text>
        </View>
      </View>

      <View style={styles.sheetAnchor}>
        <BottomSheetScaffold
          minHeight={WIN_H * 0.56}
          maxHeight={WIN_H * 0.9}
          initial="expanded"
          bottomInset={insets.bottom}
        >
          <View style={styles.headingRow}>
            <Heading variant="h1">Where to?</Heading>
            {isDemo ? (
              <View style={styles.demoTag}>
                <Text variant="caption" color={colors.accentDeep} style={{ fontFamily: fonts.bodySemibold }}>
                  Demo
                </Text>
              </View>
            ) : null}
          </View>

          <Card padded={false} style={styles.routeSummary}>
            <View style={{ padding: space.lg }}>
              <RouteRail from={route.from} to={route.to} />
            </View>
          </Card>

          <SectionLabel>Popular routes</SectionLabel>
          <View style={{ gap: space.sm }}>
            {PRESET_ROUTES.map((r) => {
              const selected = r.id === route.id;
              return (
                <Card key={r.id} onPress={() => setRoute(r)} selected={selected} padded>
                  <View style={styles.routeOption}>
                    <View style={styles.routeIcon}>
                      <Icon name="location" size={18} color={colors.accentDeep} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text variant="subtitle" numberOfLines={1}>
                        {r.label}
                      </Text>
                      <Text variant="caption" color={colors.textMuted}>
                        From €{(r.priceCents / 100).toFixed(0)} · private transfer
                      </Text>
                    </View>
                    <Icon
                      name={selected ? "checkmark-circle" : "ellipse-outline"}
                      size={22}
                      color={selected ? colors.accent : colors.borderStrong}
                    />
                  </View>
                </Card>
              );
            })}
          </View>

          <SectionLabel>Choose a ride</SectionLabel>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: space.md, paddingRight: space.lg }}
          >
            {VEHICLE_OPTIONS.map((v) => {
              const selected = v.id === vehicle.id;
              const price = priceForClass(route.priceCents, v);
              return (
                <Pressable key={v.id} onPress={() => setVehicle(v)}>
                  <View style={[styles.vehicleCard, selected ? styles.vehicleCardSelected : null]}>
                    <Image source={v.image} style={styles.vehicleImg} resizeMode="cover" />
                    <Text variant="subtitle">{v.name}</Text>
                    <View style={styles.vehicleMeta}>
                      <Icon name="person" size={12} color={colors.textFaint} />
                      <Text variant="caption" color={colors.textMuted}>
                        {v.seats}
                      </Text>
                    </View>
                    <Text style={styles.vehiclePrice}>€{(price / 100).toFixed(0)}</Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>

          <SectionLabel>Trip details</SectionLabel>
          <Field
            label="Pickup time"
            icon="calendar-outline"
            value={pickupLocal}
            onChangeText={setPickupLocal}
            placeholder="YYYY-MM-DDTHH:mm"
            autoCapitalize="none"
          />
          <Text variant="caption" color={colors.textMuted} style={{ marginTop: -space.sm }}>
            {friendlyDate(pickupLocal)}
          </Text>

          <View style={styles.passengerRow}>
            <View>
              <Text variant="subtitle">Passengers</Text>
              <Text variant="caption" color={colors.textMuted}>
                Up to {vehicle.seats} in a {vehicle.name}
              </Text>
            </View>
            <Stepper value={passengers} onChange={setPassengers} min={1} max={vehicle.seats} />
          </View>

          <Field label="Your name" icon="person-outline" value={name} onChangeText={setName} placeholder="Full name" />
          <Field
            label="Phone"
            icon="call-outline"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            placeholder="+30…"
          />

          <View style={styles.summary}>
            <View>
              <Text variant="caption" color={colors.textMuted}>
                Total · fixed price
              </Text>
              <Text style={styles.summaryPrice}>{totalLabel}</Text>
            </View>
            <View style={styles.summaryRight}>
              <Icon name="shield-checkmark" size={16} color={colors.accentDeep} />
              <Text variant="caption" color={colors.accentDeep} style={{ fontFamily: fonts.bodySemibold }}>
                Free cancellation
              </Text>
            </View>
          </View>

          {error ? (
            <Text variant="caption" color={colors.danger}>
              {error}
            </Text>
          ) : null}

          <Button
            title={`Book & pay ${totalLabel}`}
            icon="arrow-forward"
            onPress={() => void onBook()}
            loading={busy}
            fullWidth
          />
        </BottomSheetScaffold>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surfaceMuted },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: space.lg,
    zIndex: 10,
  },
  brandPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    alignSelf: "flex-start",
    backgroundColor: colors.surface,
    paddingVertical: 8,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    shadowColor: "#0B2545",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  brandText: { fontFamily: fonts.display, fontSize: 15, color: colors.text, letterSpacing: -0.3 },
  sheetAnchor: { flex: 1, justifyContent: "flex-end" },
  headingRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  demoTag: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: space.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  routeSummary: { overflow: "hidden" },
  routeOption: { flexDirection: "row", alignItems: "center", gap: space.md },
  routeIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  vehicleCard: {
    width: 132,
    padding: space.md,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: 4,
  },
  vehicleCardSelected: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
  vehicleImg: { width: "100%", height: 64, borderRadius: radius.md, marginBottom: space.sm },
  vehicleMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  vehiclePrice: { fontFamily: fonts.bold, fontSize: 18, color: colors.text, marginTop: 2 },
  passengerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.md,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
    padding: space.lg,
  },
  summaryPrice: { fontFamily: fonts.display, fontSize: 26, color: colors.text, letterSpacing: -0.5 },
  summaryRight: { flexDirection: "row", alignItems: "center", gap: 6 },
});
