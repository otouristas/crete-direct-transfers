import { pickupClockToDate, pickupTimeZone } from "@transferaround/mobile-shared/pickup-time";
import { useRouter } from "expo-router";
import { randomUUID as makeCheckoutId } from "expo-crypto";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, Image, Linking, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ApiError, postJson } from "../../lib/api";
import {
  BottomSheetScaffold,
  Button,
  Field,
  Heading,
  Icon,
  LogoMark,
  PlaceField,
  RouteMap,
  SectionLabel,
  SegmentedControl,
  Stepper,
  Text,
  colors,
  fonts,
  radius,
  resolveCoords,
  space,
  type MobilePlace,
} from "@transferaround/mobile-shared/ui";
import { useAuth } from "../../lib/auth";
import { getApiUrl } from "../../lib/config";
import { getCurrentGps } from "../../lib/gps";
import {
  createStripeCheckoutMobile,
  quotePlacesMobile,
  reverseGeocodeMobile,
  searchPlacesMobile,
  type PlaceQuote,
} from "../../lib/places-api";
import { PRESET_ROUTES } from "../../lib/presets";
import { supabase } from "../../lib/supabase";
import { VEHICLE_OPTIONS, priceForClass, type VehicleOption } from "../../lib/vehicles";

const WIN_H = Dimensions.get("window").height;

function defaultPickupIso() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(12, 0, 0, 0);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
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

function placeFromPreset(label: string, kind: MobilePlace["kind"], id: string): MobilePlace {
  const coords = resolveCoords(label);
  return {
    id,
    label,
    kind,
    countryCode: label.includes("Barcelona") ? "ES" : "GR",
    lat: coords?.lat,
    lng: coords?.lng,
  };
}

export default function BookScreen() {
  const { user, profile, isDemo } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const checkoutAttempt = useRef<{ fingerprint: string; id: string; token: string } | null>(null);
  const [service, setService] = useState<"transfer" | "hourly">("transfer");
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [fromPlace, setFromPlace] = useState<MobilePlace | null>(null);
  const [toPlace, setToPlace] = useState<MobilePlace | null>(null);
  const [vehicle, setVehicle] = useState<VehicleOption>(VEHICLE_OPTIONS[0]);
  const [pickupLocal, setPickupLocal] = useState(defaultPickupIso());
  const [passengers, setPassengers] = useState(2);
  const [hours, setHours] = useState(4);
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [name, setName] = useState(profile?.full_name ?? "");
  const [busy, setBusy] = useState(false);
  const [verifiedPrice, setVerifiedPrice] = useState<number | null>(null);
  const [gpsBusy, setGpsBusy] = useState<"from" | "to" | null>(null);
  const [pickMode, setPickMode] = useState<"from" | "to" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<PlaceQuote | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(false);

  const sheetMin = Math.round(WIN_H * 0.42);
  const sheetMax = Math.round(WIN_H * 0.88);
  const mapHeight = Math.max(220, WIN_H - sheetMin);

  const search = useCallback(
    (query: string, context?: MobilePlace | null) => searchPlacesMobile(query, context),
    [],
  );

  useEffect(() => {
    let cancelled = false;
    const ready = service === "hourly" ? Boolean(fromPlace) : Boolean(fromPlace && toPlace);
    if (!ready) {
      setQuote(null);
      return;
    }
    setQuoting(true);
    const t = setTimeout(() => {
      void quotePlacesMobile({
        service,
        from: fromPlace,
        to: service === "hourly" ? null : toPlace,
        vehicleClass: vehicle.vehicleClass,
        hours,
        pickupAt: pickupLocal,
      })
        .then((q) => {
          if (!cancelled) setQuote(q);
        })
        .catch(() => {
          if (!cancelled) setQuote(null);
        })
        .finally(() => {
          if (!cancelled) setQuoting(false);
        });
    }, 220);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [service, fromPlace, toPlace, vehicle.vehicleClass, hours, pickupLocal]);

  const totalCents = useMemo(() => {
    if (verifiedPrice != null) return verifiedPrice;
    if (quote?.priceCents != null) return quote.priceCents;
    const preset = PRESET_ROUTES.find(
      (r) => fromPlace?.label === r.from && toPlace?.label === r.to,
    );
    if (preset) return priceForClass(preset.priceCents, vehicle);
    return null;
  }, [quote, fromPlace, toPlace, vehicle, verifiedPrice]);

  useEffect(() => {
    setVerifiedPrice(null);
  }, [quote, fromPlace, toPlace, vehicle, pickupLocal]);

  const totalLabel = totalCents != null ? `€${(totalCents / 100).toFixed(0)}` : "—";

  async function applyMapPoint(target: "from" | "to", lat: number, lng: number) {
    try {
      const { place } = await reverseGeocodeMobile(lat, lng);
      if (target === "from") {
        setFromPlace(place);
        setFromQuery(place.label);
      } else {
        setToPlace(place);
        setToQuery(place.label);
      }
      setPickMode(null);
      setError(null);
    } catch {
      // Still accept the pin if reverse geocode API is unreachable.
      const fallback: MobilePlace = {
        id: `gps:${lat.toFixed(5)},${lng.toFixed(5)}`,
        label: "Current location",
        kind: "address",
        lat,
        lng,
      };
      if (target === "from") {
        setFromPlace(fallback);
        setFromQuery(fallback.label);
      } else {
        setToPlace(fallback);
        setToQuery(fallback.label);
      }
      setPickMode(null);
      setError(null);
    }
  }

  async function onGps(target: "from" | "to") {
    setGpsBusy(target);
    setError(null);
    try {
      const coords = await getCurrentGps();
      await applyMapPoint(target, coords.lat, coords.lng);
    } catch (e) {
      setError(e instanceof Error ? e.message : "GPS failed");
    } finally {
      setGpsBusy(null);
    }
  }

  function applyPreset(id: string) {
    const r = PRESET_ROUTES.find((p) => p.id === id);
    if (!r) return;
    setService("transfer");
    const from = placeFromPreset(r.from, "airport", `preset-from:${r.id}`);
    const to = placeFromPreset(r.to, "destination", `preset-to:${r.id}`);
    setFromPlace(from);
    setToPlace(to);
    setFromQuery(r.from);
    setToQuery(r.to);
    setPickMode(null);
  }

  async function onBook() {
    if (isDemo) {
      setError("Demo preview — booking disabled until login is restored.");
      return;
    }
    if (!user?.email) {
      setError("Sign in required");
      return;
    }
    if (!fromPlace || (service === "transfer" && !toPlace)) {
      setError("Choose pickup and drop-off");
      return;
    }
    if (totalCents == null) {
      setError("Could not price this trip yet");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const pickupDate = pickupClockToDate(pickupLocal, pickupTimeZone(fromPlace.countryCode));
      if (!pickupDate) throw new Error("Choose a valid pickup time.");
      const pickupAt = pickupDate.toISOString();
      if (!name.trim() || phone.trim().length < 5)
        throw new Error("Enter your name and a contact phone number.");
      if (passengers > vehicle.seats) throw new Error("Choose a larger vehicle for your group.");
      const { data: sessionData } = await supabase.auth.getSession();
      const fingerprint = JSON.stringify([
        fromPlace,
        toPlace,
        vehicle.vehicleClass,
        passengers,
        pickupAt,
        name,
        phone,
        service,
        hours,
      ]);
      if (checkoutAttempt.current?.fingerprint !== fingerprint)
        checkoutAttempt.current = {
          fingerprint,
          id: makeCheckoutId(),
          token: makeCheckoutId().replaceAll("-", "") + makeCheckoutId().replaceAll("-", ""),
        };
      const attempt = checkoutAttempt.current;
      const result = await postJson<{
        ok: boolean;
        url?: string;
        bookingId?: string;
        error?: string;
      }>(
        "/api/bookings/checkout",
        {
          requestId: attempt.id,
          checkoutToken: attempt.token,
          service,
          hours,
          from: fromPlace,
          to: service === "hourly" ? null : toPlace,
          vehicleClass: vehicle.vehicleClass,
          passengers,
          bagsChecked: 1,
          bagsCabin: 1,
          pickupAt,
          tripType: "oneway",
          customerName: name.trim(),
          customerPhone: phone.trim(),
          customerEmail: user.email,
          expectedPriceCents: totalCents,
          locale: "en",
        },
        sessionData.session?.access_token,
      );
      if (!result.ok || !result.url) throw new Error(result.error || "Could not start payment.");
      await Linking.openURL(result.url);
      if (result.bookingId) router.push(`/trip/${result.bookingId}`);
    } catch (e) {
      if (e instanceof ApiError && e.status === 409 && typeof e.priceCents === "number")
        setVerifiedPrice(e.priceCents);
      setError(e instanceof Error ? e.message : "Booking failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.root}>
      <View
        style={[
          styles.mapHost,
          { height: mapHeight, pointerEvents: sheetExpanded && !pickMode ? "none" : "auto" },
        ]}
      >
        <RouteMap
          from={fromPlace?.label ?? null}
          to={service === "hourly" ? null : (toPlace?.label ?? null)}
          fromPoint={
            fromPlace?.lat != null && fromPlace?.lng != null
              ? { lat: fromPlace.lat, lng: fromPlace.lng }
              : null
          }
          toPoint={
            toPlace?.lat != null && toPlace?.lng != null
              ? { lat: toPlace.lat, lng: toPlace.lng }
              : null
          }
          height={mapHeight}
          interactive={!sheetExpanded || Boolean(pickMode)}
          pickMode={Boolean(pickMode)}
          onMapPress={(p) => {
            if (!pickMode) return;
            void applyMapPoint(pickMode, p.lat, p.lng);
          }}
        />
      </View>

      <View
        style={[styles.topBar, { paddingTop: insets.top + space.sm, pointerEvents: "box-none" }]}
      >
        <View style={styles.brandPill}>
          <LogoMark size={22} rounded />
          <Text style={styles.brandText}>
            Transfer
            <Text style={{ fontFamily: fonts.display, fontSize: 15, color: colors.accent }}>
              Around
            </Text>
          </Text>
        </View>
        {pickMode ? (
          <Pressable style={styles.pickBanner} onPress={() => setPickMode(null)}>
            <Icon name="map" size={14} color={colors.inverse} />
            <Text
              variant="caption"
              color={colors.inverse}
              style={{ fontFamily: fonts.bodySemibold }}
            >
              Tap map to set {pickMode === "from" ? "pickup" : "drop-off"} · Done
            </Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.sheetAnchor}>
        <BottomSheetScaffold
          minHeight={sheetMin}
          maxHeight={sheetMax}
          initial="collapsed"
          bottomInset={insets.bottom + space.lg}
          onExpandedChange={setSheetExpanded}
        >
          <View style={styles.headingRow}>
            <Heading variant="h1">Where to?</Heading>
            {isDemo ? (
              <View style={styles.demoTag}>
                <Text
                  variant="caption"
                  color={colors.accentDeep}
                  style={{ fontFamily: fonts.bodySemibold }}
                >
                  Demo
                </Text>
              </View>
            ) : null}
          </View>

          <SegmentedControl
            options={[
              { value: "transfer", label: "Transfer" },
              { value: "hourly", label: "Hourly" },
            ]}
            value={service}
            onChange={setService}
          />

          <PlaceField
            label="From"
            placeholder="Airport code, hotel, address…"
            value={fromQuery}
            selected={fromPlace}
            contextPlace={toPlace}
            onQueryChange={(q) => {
              setFromQuery(q);
              setFromPlace(null);
            }}
            onSelect={(p) => {
              setFromPlace(p);
              setFromQuery(p.label);
            }}
            onPinOnMap={() => setPickMode("from")}
            onUseGps={() => void onGps("from")}
            search={search}
            gpsBusy={gpsBusy === "from"}
          />

          {service === "transfer" ? (
            <PlaceField
              label="To"
              placeholder="Where are you going?"
              value={toQuery}
              selected={toPlace}
              contextPlace={fromPlace}
              onQueryChange={(q) => {
                setToQuery(q);
                setToPlace(null);
              }}
              onSelect={(p) => {
                setToPlace(p);
                setToQuery(p.label);
              }}
              onPinOnMap={() => setPickMode("to")}
              onUseGps={() => void onGps("to")}
              search={search}
              gpsBusy={gpsBusy === "to"}
            />
          ) : (
            <View style={styles.passengerRow}>
              <View>
                <Text variant="subtitle">Hours</Text>
                <Text variant="caption" color={colors.textMuted}>
                  Charter with driver
                </Text>
              </View>
              <Stepper value={hours} onChange={setHours} min={2} max={12} />
            </View>
          )}

          <SectionLabel>Popular routes</SectionLabel>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: space.sm, paddingRight: space.lg }}
          >
            {PRESET_ROUTES.map((r) => {
              const selected = fromPlace?.label === r.from && toPlace?.label === r.to;
              return (
                <Pressable key={r.id} onPress={() => applyPreset(r.id)}>
                  <View style={[styles.chip, selected ? styles.chipSelected : null]}>
                    <Text variant="subtitle" numberOfLines={1} style={{ maxWidth: 160 }}>
                      {r.label}
                    </Text>
                    <Text variant="caption" color={colors.textMuted}>
                      From €{(r.priceCents / 100).toFixed(0)}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>

          <SectionLabel>Choose a ride</SectionLabel>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: space.md, paddingRight: space.lg }}
          >
            {VEHICLE_OPTIONS.map((v) => {
              const selected = v.id === vehicle.id;
              const price =
                quote?.priceCents != null && v.id === vehicle.id
                  ? quote.priceCents
                  : quote?.priceCents != null
                    ? priceForClass(Math.round(quote.priceCents / vehicle.priceMultiplier), v)
                    : null;
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
                    <Text style={styles.vehiclePrice}>
                      {price != null ? `€${(price / 100).toFixed(0)}` : "…"}
                    </Text>
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

          <Field
            label="Your name"
            icon="person-outline"
            value={name}
            onChangeText={setName}
            placeholder="Full name"
          />
          <Field
            label="Phone"
            icon="call-outline"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            placeholder="+30…"
          />

          <View style={styles.summary}>
            <View style={styles.summaryTop}>
              <Text variant="caption" color={colors.textMuted} style={styles.summaryCaption}>
                {quoting ? "Pricing…" : "Total · fixed price"}
              </Text>
              <View style={styles.summaryBadge}>
                <Icon name="shield-checkmark" size={14} color={colors.accentDeep} />
                <Text
                  variant="caption"
                  color={colors.accentDeep}
                  style={{ fontFamily: fonts.bodySemibold }}
                >
                  Free cancellation
                </Text>
              </View>
            </View>
            <Text style={styles.summaryPrice}>{totalLabel}</Text>
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
            disabled={totalCents == null && !isDemo}
          />
        </BottomSheetScaffold>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surfaceMuted },
  mapHost: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: space.lg,
    zIndex: 10,
    gap: space.sm,
  },
  brandPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    alignSelf: "flex-start",
    backgroundColor: colors.surface,
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: space.lg,
    borderRadius: radius.pill,
    shadowColor: "#0B2545",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  brandText: { fontFamily: fonts.display, fontSize: 15, color: colors.text, letterSpacing: -0.3 },
  pickBanner: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: space.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  sheetAnchor: { flex: 1, justifyContent: "flex-end" },
  headingRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  demoTag: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: space.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  chip: {
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: 2,
    minWidth: 140,
  },
  chipSelected: { borderColor: colors.accent, backgroundColor: colors.accentSoft },
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
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: space.xl,
    paddingHorizontal: space.xl,
    gap: space.sm,
  },
  summaryTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.md,
  },
  summaryCaption: { flexShrink: 1 },
  summaryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: space.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  summaryPrice: {
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 38,
    color: colors.text,
    letterSpacing: -0.8,
    marginTop: 2,
  },
});
