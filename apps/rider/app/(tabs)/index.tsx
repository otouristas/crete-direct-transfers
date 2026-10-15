import AsyncStorage from "@react-native-async-storage/async-storage";
import { PICKUP_POSITION_KEY, useOnboarding } from "@transferaround/mobile-shared/onboarding";
import { VehicleArtwork } from "@transferaround/mobile-shared/ui/mobility";
import {
  getDevicePosition,
  describePosition,
  LocationPermissionError,
  openLocationSettings,
  type DevicePosition,
} from "@transferaround/mobile-shared/location";
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
  const { pickupPosition } = useOnboarding();
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
  const [quoteFailed, setQuoteFailed] = useState(false);
  const [pricingAttempt, setPricingAttempt] = useState(0);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [step, setStep] = useState<"home" | "route" | "vehicle" | "details">("home");
  const [devicePosition, setDevicePosition] = useState<DevicePosition | null>(null);
  const [gpsDenied, setGpsDenied] = useState(false);
  const applyMapPoint = useCallback(async (target: "from" | "to", lat: number, lng: number) => {
    try {
      const label = await describePosition({ lat, lng });
      const place: MobilePlace = {
        id: `pin:${lat.toFixed(6)},${lng.toFixed(6)}`,
        label,
        kind: "address",
        lat,
        lng,
      };
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
  }, []);

  useEffect(() => {
    let alive = true;
    void Promise.all([
      AsyncStorage.getItem("transferaround-booking-draft-v2"),
      AsyncStorage.getItem(PICKUP_POSITION_KEY),
    ])
      .then(async ([draftRaw, positionRaw]) => {
        if (!alive) return;
        if (draftRaw) {
          const draft = JSON.parse(draftRaw);
          if (draft.fromPlace?.label) {
            setFromPlace(draft.fromPlace);
            setFromQuery(draft.fromPlace.label);
          }
          if (draft.toPlace?.label) {
            setToPlace(draft.toPlace);
            setToQuery(draft.toPlace.label);
          }
          const selected = VEHICLE_OPTIONS.find((v) => v.id === draft.vehicleId);
          if (selected) setVehicle(selected);
          if (draft.pickupLocal) setPickupLocal(draft.pickupLocal);
          if (draft.service === "hourly") setService("hourly");
          if (Number.isInteger(draft.passengers)) setPassengers(draft.passengers);
          if (Number.isInteger(draft.hours)) setHours(draft.hours);
          setStep("details");
          await AsyncStorage.removeItem("transferaround-booking-draft-v2");
          return;
        }
        if (positionRaw) {
          const p = JSON.parse(positionRaw) as DevicePosition;
          if (Date.now() - Date.parse(p.capturedAt) < 60000) {
            setDevicePosition(p);
            void applyMapPoint("from", p.lat, p.lng);
          }
        }
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [applyMapPoint]);
  useEffect(() => {
    if (profile?.phone) setPhone(profile.phone);
    if (profile?.full_name) setName(profile.full_name);
  }, [profile?.phone, profile?.full_name]);

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
    setQuoteFailed(false);
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
          if (!cancelled) {
            setQuote(null);
            setQuoteFailed(true);
          }
        })
        .finally(() => {
          if (!cancelled) setQuoting(false);
        });
    }, 220);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [service, fromPlace, toPlace, vehicle.vehicleClass, hours, pickupLocal, pricingAttempt]);

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

  useEffect(() => {
    if (!pickupPosition) return;
    setDevicePosition(pickupPosition);
    void applyMapPoint("from", pickupPosition.lat, pickupPosition.lng);
  }, [pickupPosition, applyMapPoint]);

  async function onGps(target: "from" | "to") {
    setGpsBusy(target);
    setError(null);
    try {
      const coords = await getDevicePosition();
      setDevicePosition(coords);
      setGpsDenied(false);
      await applyMapPoint(target, coords.lat, coords.lng);
    } catch (e) {
      setGpsDenied(e instanceof LocationPermissionError);
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
      await AsyncStorage.setItem(
        "transferaround-booking-draft-v2",
        JSON.stringify({
          fromPlace,
          toPlace,
          vehicleId: vehicle.id,
          pickupLocal,
          service,
          hours,
          passengers,
        }),
      );
      router.push("/login");
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

  const compact = step === "home";
  const [viewportHeight, setViewportHeight] = useState(WIN_H);
  const sheetHeight = Math.min(
    viewportHeight * 0.66,
    compact ? 365 : step === "route" ? 470 : step === "vehicle" ? 490 : 540,
  );
  const ready = Boolean(fromPlace && (service === "hourly" || toPlace));
  const footer =
    step !== "home" ? (
      <View style={styles.footer}>
        {step !== "route" && (
          <View>
            <Text variant="caption" color={colors.textMuted}>
              {quoting
                ? "Getting fare…"
                : quote?.priceCents != null
                  ? "Trip total"
                  : "Estimated fare"}
            </Text>
            <Text style={styles.total}>{totalLabel}</Text>
          </View>
        )}
        <Button
          title={
            step === "route"
              ? "Choose your ride"
              : step === "vehicle"
                ? "Continue"
                : user
                  ? "Continue to payment"
                  : "Sign in to book"
          }
          icon="arrow-forward"
          style={{ flex: 1 }}
          loading={busy}
          disabled={!ready || (step !== "route" && totalCents == null)}
          onPress={() =>
            step === "route"
              ? setStep("vehicle")
              : step === "vehicle"
                ? setStep("details")
                : void onBook()
          }
        />
      </View>
    ) : undefined;
  return (
    <View style={styles.root} onLayout={(e) => setViewportHeight(e.nativeEvent.layout.height)}>
      <View style={StyleSheet.absoluteFill}>
        <RouteMap
          from={fromPlace?.label}
          to={service === "hourly" ? null : toPlace?.label}
          fromPoint={
            fromPlace?.lat != null && fromPlace.lng != null
              ? { lat: fromPlace.lat, lng: fromPlace.lng }
              : null
          }
          toPoint={
            toPlace?.lat != null && toPlace.lng != null
              ? { lat: toPlace.lat, lng: toPlace.lng }
              : null
          }
          height={viewportHeight}
          bottomInset={sheetHeight}
          userPoint={devicePosition}
          interactive={!sheetExpanded || Boolean(pickMode)}
          pickMode={Boolean(pickMode)}
          onMapPress={(p) => {
            if (pickMode) void applyMapPoint(pickMode, p.lat, p.lng);
          }}
        />
      </View>
      <View style={[styles.topBar, { top: insets.top + 8 }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={user ? "Your account" : "Sign in"}
          style={styles.circle}
          onPress={() => router.push(user ? "/(tabs)/account" : "/login")}
        >
          <Icon name="person-outline" size={21} />
        </Pressable>
        <View style={styles.brand}>
          <LogoMark size={24} />
          <Text style={styles.brandText}>TransferAround</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Use my location for pickup"
          disabled={Boolean(gpsBusy)}
          accessibilityState={{ busy: Boolean(gpsBusy) }}
          style={styles.circle}
          onPress={() => void onGps("from")}
        >
          <Icon name="locate" size={22} color={colors.accent} />
        </Pressable>
      </View>
      {pickMode && (
        <View style={[styles.pickBanner, { top: insets.top + 65 }]}>
          <Icon name="location" size={16} color="white" />
          <Text color="white" variant="caption">
            Tap the map to set your {pickMode === "from" ? "pickup" : "destination"}
          </Text>
          <Pressable onPress={() => setPickMode(null)} accessibilityLabel="Cancel map pin">
            <Icon name="close" color="white" size={18} />
          </Pressable>
        </View>
      )}
      <View style={styles.sheetAnchor} pointerEvents="box-none">
        <BottomSheetScaffold
          key={`${step}-${Boolean(pickMode)}`}
          minHeight={sheetHeight}
          maxHeight={Math.max(sheetHeight, viewportHeight - insets.top - 20)}
          initial="collapsed"
          bottomInset={12}
          onExpandedChange={setSheetExpanded}
          footer={footer}
          contentStyle={{ gap: 16 }}
        >
          <View style={styles.headingRow}>
            {!compact && (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Previous booking step"
                onPress={() =>
                  setStep(step === "details" ? "vehicle" : step === "vehicle" ? "route" : "home")
                }
                hitSlop={12}
              >
                <Icon name="arrow-back" size={22} />
              </Pressable>
            )}
            <Heading variant="h1" style={{ flex: 1 }}>
              {compact
                ? "Where are you headed?"
                : step === "route"
                  ? "Plan your ride"
                  : step === "vehicle"
                    ? "Choose your ride"
                    : "Make it yours"}
            </Heading>
            {!compact && (
              <Text variant="caption" color={colors.textMuted}>
                {step === "route" ? "1" : step === "vehicle" ? "2" : "3"} / 3
              </Text>
            )}
          </View>
          {compact ? (
            <>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Where to? Search destination"
                style={styles.destinationSearch}
                onPress={() => setStep("route")}
              >
                <Icon name="search" size={23} />
                <Text style={styles.searchText}>Where to?</Text>
                <View style={styles.schedule}>
                  <Icon name="time-outline" size={14} />
                  <Text style={styles.scheduleText}>Schedule</Text>
                </View>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Use my location for pickup"
                style={styles.gpsRow}
                disabled={Boolean(gpsBusy)}
                onPress={() => void onGps("from")}
              >
                <View style={styles.gpsIcon}>
                  <Icon name="navigate" size={19} color={colors.accent} />
                </View>
                <View style={{ flex: 1, gap: 3 }}>
                  <Text variant="subtitle">
                    {gpsBusy
                      ? "Finding your location…"
                      : fromPlace
                        ? fromPlace.label
                        : "Use my location"}
                  </Text>
                  <Text variant="caption" color={colors.textMuted}>
                    {fromPlace ? "Your pickup · tap to update" : "Set a precise pickup with GPS"}
                  </Text>
                </View>
                <Icon name="chevron-forward" size={16} color={colors.textFaint} />
              </Pressable>
              <View style={styles.services}>
                {[
                  { name: "Airport ride", van: false },
                  { name: "Group transfer", van: true },
                ].map((item) => (
                  <Pressable
                    accessibilityRole="button"
                    key={item.name}
                    style={styles.service}
                    onPress={() => {
                      setVehicle(item.van ? VEHICLE_OPTIONS[3] : VEHICLE_OPTIONS[0]);
                      setStep("route");
                    }}
                  >
                    <VehicleArtwork van={item.van} style={{ width: 120, height: 70 }} />
                    <Text variant="subtitle">{item.name}</Text>
                  </Pressable>
                ))}
              </View>
            </>
          ) : step === "route" ? (
            <>
              <SegmentedControl
                options={[
                  { value: "transfer", label: "Transfer" },
                  { value: "hourly", label: "By the hour" },
                ]}
                value={service}
                onChange={setService}
              />
              <PlaceField
                label="Pickup"
                placeholder="Airport, hotel or address"
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
                gpsLabel="Use my location"
                gpsBusy={gpsBusy === "from"}
              />
              {service === "transfer" ? (
                <PlaceField
                  label="Destination"
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
                <View style={styles.row}>
                  <Text variant="subtitle">Hours with your driver</Text>
                  <Stepper value={hours} onChange={setHours} min={2} max={12} />
                </View>
              )}
              <Text style={styles.sectionTitle}>POPULAR TRANSFERS</Text>
              {PRESET_ROUTES.slice(0, 3).map((r) => (
                <Pressable
                  accessibilityRole="button"
                  key={r.id}
                  style={styles.preset}
                  onPress={() => {
                    applyPreset(r.id);
                    setStep("vehicle");
                  }}
                >
                  <View style={styles.presetIcon}>
                    <Icon name="airplane-outline" size={18} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text variant="subtitle">{r.to}</Text>
                    <Text variant="caption" color={colors.textMuted}>
                      From {r.from}
                    </Text>
                  </View>
                  <Icon name="chevron-forward" size={17} color={colors.textFaint} />
                </Pressable>
              ))}
            </>
          ) : step === "vehicle" ? (
            <>
              <Text variant="caption" color={colors.textMuted}>
                {fromPlace?.label} → {toPlace?.label || `${hours} hours`}
              </Text>
              {VEHICLE_OPTIONS.map((v) => {
                const selected = v.id === vehicle.id;
                const price =
                  totalCents != null
                    ? priceForClass(Math.round(totalCents / vehicle.priceMultiplier), v)
                    : null;
                return (
                  <Pressable
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                    key={v.id}
                    style={[styles.vehicleRow, selected && styles.selectedVehicle]}
                    onPress={() => setVehicle(v)}
                  >
                    <VehicleArtwork van={v.id === "minivan"} style={{ width: 91, height: 64 }} />
                    <View style={{ flex: 1, gap: 3 }}>
                      <Text variant="title">
                        {v.name}{" "}
                        <Text variant="caption" color={colors.textMuted}>
                          {" "}
                          · {v.seats}
                        </Text>
                      </Text>
                      <Text variant="caption" color={colors.textMuted}>
                        {v.tagline}
                      </Text>
                    </View>
                    <Text style={styles.vehiclePrice}>
                      {price != null ? `€${Math.round(price / 100)}` : "—"}
                    </Text>
                  </Pressable>
                );
              })}
              <Text variant="caption" color={colors.textMuted}>
                Vehicle images illustrate the class. Your assigned car appears in trip details.
              </Text>
            </>
          ) : (
            <>
              <View style={styles.rideSummary}>
                <VehicleArtwork van={vehicle.id === "minivan"} />
                <View style={{ flex: 1, gap: 4 }}>
                  <Text variant="title">{vehicle.name}</Text>
                  <Text variant="caption" color={colors.textMuted}>
                    {toPlace?.label || `${hours} hours with your driver`}
                  </Text>
                </View>
                <Text style={styles.vehiclePrice}>{totalLabel}</Text>
              </View>
              <Field
                label="Pickup date & time"
                icon="calendar-outline"
                value={pickupLocal}
                onChangeText={setPickupLocal}
                placeholder="YYYY-MM-DDTHH:mm"
                autoCapitalize="none"
              />
              <Text variant="caption" color={colors.textMuted}>
                {friendlyDate(pickupLocal)}
              </Text>
              <View style={styles.row}>
                <View>
                  <Text variant="subtitle">Travelers</Text>
                  <Text variant="caption" color={colors.textMuted}>
                    Up to {vehicle.seats} seats
                  </Text>
                </View>
                <Stepper value={passengers} onChange={setPassengers} min={1} max={vehicle.seats} />
              </View>
              <Field
                label="Your name"
                value={name}
                onChangeText={setName}
                placeholder="Full name"
                autoComplete="name"
              />
              <Field
                label="Contact phone"
                value={phone}
                onChangeText={setPhone}
                placeholder="Country code + phone"
                keyboardType="phone-pad"
              />
              <View style={styles.paymentNote}>
                <Icon name="shield-checkmark-outline" size={18} color={colors.accent} />
                <Text variant="caption" color={colors.textMuted} style={{ flex: 1 }}>
                  Confirm your fare and complete secure payment before your booking is confirmed.
                </Text>
              </View>
            </>
          )}
          {quoteFailed && totalCents == null && ready && (
            <View style={{ gap: 10 }}>
              <Text variant="caption" color={colors.textMuted}>
                Live fares are unavailable right now. Your route is saved; please try again shortly.
              </Text>
              <Button
                title="Try getting the fare again"
                variant="outline"
                onPress={() => setPricingAttempt((n) => n + 1)}
              />
            </View>
          )}
          {error && (
            <Text accessibilityRole="alert" variant="caption" color={colors.danger}>
              {error}
            </Text>
          )}
          {gpsDenied && (
            <Button
              title="Open location settings"
              variant="outline"
              onPress={() => void openLocationSettings()}
            />
          )}
        </BottomSheetScaffold>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#EDF0F3" },
  topBar: {
    position: "absolute",
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  circle: {
    width: 43,
    height: 43,
    borderRadius: 24,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.09,
    shadowRadius: 8,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 24,
    shadowOpacity: 0.06,
    shadowRadius: 7,
  },
  brandText: { fontFamily: fonts.bold, fontSize: 15, letterSpacing: -0.7 },
  sheetAnchor: { flex: 1, justifyContent: "flex-end" },
  headingRow: { flexDirection: "row", gap: 14, alignItems: "center" },
  destinationSearch: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 13,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchText: { flex: 1, fontFamily: fonts.bold, fontSize: 21, letterSpacing: -0.5 },
  schedule: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: colors.borderStrong,
  },
  scheduleText: { fontSize: 11, fontFamily: fonts.bodySemibold },
  gpsRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  gpsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  services: { flexDirection: "row", gap: 12 },
  service: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 16,
    padding: 12,
    paddingTop: 0,
  },
  pickBanner: {
    position: "absolute",
    left: 20,
    right: 20,
    backgroundColor: colors.primary,
    borderRadius: 15,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
    gap: 8,
  },
  footer: { flexDirection: "row", alignItems: "center", gap: 20 },
  total: { fontFamily: fonts.bold, fontSize: 26, lineHeight: 33, letterSpacing: -0.8 },
  sectionTitle: {
    fontSize: 10,
    letterSpacing: 1,
    color: colors.textMuted,
    fontFamily: fonts.bodySemibold,
    marginTop: 6,
  },
  preset: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 9 },
  presetIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  vehicleRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 15,
    padding: 8,
    marginVertical: -5,
  },
  selectedVehicle: { borderColor: colors.primary, backgroundColor: "#F7F8FA" },
  vehiclePrice: { fontFamily: fonts.bold, fontSize: 19, lineHeight: 27, letterSpacing: -0.4 },
  rideSummary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  paymentNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    backgroundColor: colors.surfaceMuted,
    padding: 13,
    borderRadius: 12,
  },
});
