import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AppState,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { DemoApplePay } from "./demo-apple-pay";
import {
  getDevicePosition,
  LocationPermissionError,
  openLocationSettings,
  type DevicePosition,
} from "./location";
import {
  EMPTY_PRACTICE,
  PRACTICE_ROUTES,
  PRACTICE_VEHICLES,
  practiceFare,
  runPractice,
  type PracticeAction,
  type PracticeClient,
  type PracticeState,
} from "./practice";
import { Button, Field, Icon, RouteMap, RouteRail, Text, colors, fonts } from "./ui";
import { LivePill, VehicleArtwork } from "./ui/mobility";
const euro = (c: number) => `€${Math.round(c / 100)}`;
const labels = {
  pending: "Finding your driver",
  claimed: "Your driver accepted",
  en_route: "Your driver is on the way",
  completed: "You’ve arrived",
  cancelled: "Trip cancelled",
};
export function PracticeScreen({
  client,
  role,
  initialSession,
  onExit,
  onShareGPS,
  onStopGPS,
}: {
  client: PracticeClient;
  role: "rider" | "driver";
  initialSession?: string;
  onExit?: () => void;
  onShareGPS?: (token: string) => Promise<{ background: boolean }>;
  onStopGPS?: () => Promise<void>;
}) {
  const { height } = useWindowDimensions();
  const [sheetHeight, setSheetHeight] = useState(380);
  const [viewportHeight, setViewportHeight] = useState(height);
  const insets = useSafeAreaInsets();
  const driver = role === "driver";
  const [token, setToken] = useState<string | null>(null);
  const [joinCode, setJoinCode] = useState("");
  const [state, setState] = useState<PracticeState>(EMPTY_PRACTICE);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [routeId, setRouteId] = useState<string>(PRACTICE_ROUTES[0].id);
  const [vehicleId, setVehicleId] = useState("comfort");
  const [payVisible, setPayVisible] = useState(false);
  const [connection, setConnection] = useState(false);
  const [routes, setRoutes] = useState(false);
  const [me, setMe] = useState<DevicePosition | null>(null);
  const [gpsBusy, setGpsBusy] = useState(false);
  const [gpsDenied, setGpsDenied] = useState(false);
  const [now, setNow] = useState(Date.now());
  const serial = useRef(0);
  const trip = state.trip;
  const active = Boolean(trip && !["completed", "cancelled"].includes(trip.status));
  const route = PRACTICE_ROUTES.find((r) => r.id === routeId)!;
  const vehicle = PRACTICE_VEHICLES.find((v) => v.id === vehicleId)!;
  const connect = useCallback(
    async (code?: string) => {
      Keyboard.dismiss();
      const request = ++serial.current;
      setBusy(true);
      setError(null);
      try {
        const trimmed = code?.trim().toLowerCase();
        if (trimmed && !/^[a-f0-9]{48}$/.test(trimmed))
          throw new Error("Paste the 48-character code from your other app.");
        const r = await runPractice(client, trimmed || null, trimmed ? "read" : "create");
        if (request !== serial.current) return;
        const next = r.token || trimmed!;
        setToken(next);
        setState(r.state);
        await AsyncStorage.setItem(`transferaround-practice-${role}`, next);
        setJoinCode("");
        setConnection(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Connection failed.");
      } finally {
        if (request === serial.current) setBusy(false);
      }
    },
    [client, role],
  );
  useEffect(() => {
    let alive = true;
    if (initialSession) {
      void connect(initialSession);
      return;
    }
    void AsyncStorage.getItem(`transferaround-practice-${role}`)
      .then((saved) => {
        if (alive && saved) void connect(saved);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [connect, role, initialSession]);
  useEffect(() => {
    if (!token) return;
    let alive = true,
      polling = false;
    const poll = async () => {
      if (polling || AppState.currentState === "background") return;
      polling = true;
      const request = serial.current;
      try {
        const r = await runPractice(client, token, "read");
        if (alive && request === serial.current) setState(r.state);
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : "Connection interrupted.");
      } finally {
        polling = false;
      }
    };
    const timer = setInterval(() => void poll(), 2000);
    const app = AppState.addEventListener("change", (s) => {
      if (s === "active") void poll();
    });
    return () => {
      alive = false;
      clearInterval(timer);
      app.remove();
    };
  }, [token, client]);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const closed = Boolean(trip && !active);
  useEffect(() => {
    if (driver && closed) void onStopGPS?.();
  }, [driver, closed, onStopGPS]);
  async function act(action: PracticeAction) {
    if (!token || busy) return false;
    ++serial.current;
    setBusy(true);
    setError(null);
    try {
      const r = await runPractice(client, token, action, { route: routeId, vehicle: vehicleId });
      setState(r.state);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
      return false;
    } finally {
      setBusy(false);
    }
  }
  async function locate() {
    setGpsBusy(true);
    setError(null);
    try {
      setMe(await getDevicePosition());
      setGpsDenied(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "GPS unavailable.");
      setGpsDenied(e instanceof LocationPermissionError);
    } finally {
      setGpsBusy(false);
    }
  }
  async function shareGPS() {
    if (!token || !onShareGPS) return;
    setGpsBusy(true);
    setError(null);
    try {
      const result = await onShareGPS(token);
      if (!result.background)
        setError(
          "Live GPS is on while this app is open. Allow Always location in Settings to keep sharing in the other app.",
        );
    } catch (e) {
      setError(e instanceof Error ? e.message : "GPS sharing failed.");
      setGpsDenied(e instanceof LocationPermissionError);
    } finally {
      setGpsBusy(false);
    }
  }
  const position = active ? state.driverLocation : null;
  const age = position
    ? Math.max(0, Math.floor((now - Date.parse(position.capturedAt)) / 1000))
    : null;
  const fresh = age !== null && age <= 20;
  const action =
    driver && trip && active && (state.online || trip.status !== "pending")
      ? trip.status === "pending"
        ? "accept"
        : trip.status === "claimed"
          ? "start"
          : "complete"
      : null;
  const amount =
    trip && active ? trip.priceCents : practiceFare(route.baseCents, vehicle.multiplier);
  const reset = trip && ["completed", "cancelled"].includes(trip.status);
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={s.root} onLayout={(e) => setViewportHeight(e.nativeEvent.layout.height)}>
        <RouteMap
          from={trip && active ? trip.from : route.from}
          to={trip && active ? trip.to : route.to}
          height={viewportHeight}
          bottomInset={sheetHeight}
          userPoint={me}
          driverPoint={position}
        />
        <View style={[s.top, { top: insets.top + 8 }]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Leave practice"
            style={s.circle}
            onPress={onExit}
          >
            <Icon name="arrow-back" size={21} />
          </Pressable>
          <View style={s.mode}>
            <Text style={s.modeText}>{driver ? "DRIVER" : "TRAVELER"} · PRACTICE</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Use my location"
            style={s.circle}
            disabled={gpsBusy}
            onPress={() => void locate()}
          >
            <Icon name="locate" size={22} color={colors.accent} />
          </Pressable>
        </View>
        <View
          onLayout={(e) => setSheetHeight(e.nativeEvent.layout.height)}
          style={[
            s.sheet,
            {
              paddingBottom: Math.max(insets.bottom, 14),
              maxHeight: Math.min(height * 0.65, Math.max(180, viewportHeight - insets.top - 80)),
            },
          ]}
        >
          <View style={s.grabber} />
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 12 }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            {!token ? (
              <>
                <Text accessibilityRole="header" style={s.title}>
                  Try both sides of the ride.
                </Text>
                <Text style={s.description}>
                  Connect Traveler and Driver with one private session. The trip and payment are
                  simulated. GPS sharing uses the driver device’s actual location.
                </Text>
                <Button
                  title="Start new practice session"
                  icon="arrow-forward"
                  fullWidth
                  loading={busy}
                  onPress={() => void connect()}
                />
                <View style={{ height: 18 }} />
                <Field
                  label="Or join your other app"
                  value={joinCode}
                  onChangeText={setJoinCode}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Paste the session code"
                  returnKeyType="join"
                  onSubmitEditing={() => {
                    if (joinCode.trim()) void connect(joinCode);
                  }}
                />
                <View style={{ height: 12 }} />
                <Button
                  title="Join shared session"
                  variant="outline"
                  fullWidth
                  disabled={!joinCode.trim() || busy}
                  onPress={() => void connect(joinCode)}
                />
              </>
            ) : (
              <>
                <View style={s.statusRow}>
                  <LivePill
                    live={fresh}
                    label={
                      fresh
                        ? "Real device GPS · live"
                        : position
                          ? `GPS updated ${age}s ago`
                          : "Connected test drive"
                    }
                  />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Connect the other app"
                    onPress={() => setConnection(true)}
                    hitSlop={10}
                  >
                    <Icon name="link-outline" size={21} />
                  </Pressable>
                </View>
                <Text accessibilityRole="header" style={s.title}>
                  {trip && (active || reset)
                    ? labels[trip.status]
                    : driver
                      ? state.online
                        ? "Ready for a request"
                        : "You’re offline"
                      : "Choose your practice ride"}
                </Text>
                {position && !fresh && (
                  <Text style={s.description}>Showing the last received GPS position.</Text>
                )}
                {!active && !reset && !driver ? (
                  <>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Choose practice route"
                      style={s.routeRow}
                      onPress={() => setRoutes(true)}
                    >
                      <Icon name="location-outline" size={20} />
                      <View style={{ flex: 1, gap: 3 }}>
                        <Text variant="subtitle">{route.to}</Text>
                        <Text variant="caption" color={colors.textMuted}>
                          From {route.from}
                        </Text>
                      </View>
                      <Icon name="chevron-down" size={18} />
                    </Pressable>
                    {PRACTICE_VEHICLES.map((v) => (
                      <Pressable
                        accessibilityRole="radio"
                        accessibilityState={{ checked: vehicleId === v.id }}
                        accessibilityLabel={`${v.name} ${euro(practiceFare(route.baseCents, v.multiplier))}`}
                        key={v.id}
                        onPress={() => setVehicleId(v.id)}
                        style={[s.vehicle, vehicleId === v.id && s.selected]}
                      >
                        <VehicleArtwork
                          van={v.id === "minivan"}
                          style={{ width: 88, height: 60 }}
                        />
                        <View style={{ flex: 1, gap: 3 }}>
                          <Text variant="title">{v.name}</Text>
                          <Text variant="caption" color={colors.textMuted}>
                            {v.seats} seats · example car
                          </Text>
                        </View>
                        <Text style={s.price}>
                          {euro(practiceFare(route.baseCents, v.multiplier))}
                        </Text>
                      </Pressable>
                    ))}
                  </>
                ) : driver && !active && !reset ? (
                  <>
                    <Text style={s.description}>
                      {state.online
                        ? "Send a practice request from Traveler. It will appear here."
                        : "Go online to receive the connected practice request."}
                    </Text>
                    <Button
                      title={state.online ? "Go offline" : "Go online"}
                      icon="power"
                      fullWidth
                      variant={state.online ? "outline" : "primary"}
                      loading={busy}
                      onPress={() => void act(state.online ? "offline" : "online")}
                    />
                  </>
                ) : trip ? (
                  <>
                    <View style={s.routeBlock}>
                      <RouteRail from={trip.from} to={trip.to} />
                    </View>
                    <View style={s.tripMeta}>
                      <VehicleArtwork
                        van={trip.vehicle === "minivan"}
                        style={{ width: 94, height: 62 }}
                      />
                      <View style={{ flex: 1 }}>
                        <Text variant="subtitle">{trip.vehicleName}</Text>
                        <Text variant="caption" color={colors.textMuted}>
                          Example vehicle · 2 travelers
                        </Text>
                      </View>
                      <Text style={s.price}>{euro(trip.priceCents)}</Text>
                    </View>
                    {driver && active && trip.status !== "pending" && onShareGPS && (
                      <Button
                        title={fresh ? "Update live GPS sharing" : "Share live device GPS"}
                        icon="locate"
                        variant="outline"
                        loading={gpsBusy}
                        fullWidth
                        onPress={() => void shareGPS()}
                      />
                    )}
                    {driver && active && trip.status !== "pending" && (
                      <Text style={s.privacy}>
                        Anyone with this session code can see the shared position. Sharing ends with
                        the practice trip.
                      </Text>
                    )}
                    {!driver && active && !position && (
                      <Text style={s.description}>
                        In Driver, choose “Share live device GPS” after accepting to see the real
                        moving position here.
                      </Text>
                    )}
                    {!driver && active && trip.status !== "en_route" && (
                      <Button
                        title="Cancel practice ride"
                        variant="ghost"
                        onPress={() => void act("cancel")}
                      />
                    )}
                    {reset && (
                      <Button
                        title="Try another journey"
                        fullWidth
                        onPress={() => void act("reset")}
                      />
                    )}
                  </>
                ) : null}
              </>
            )}
            {error && (
              <Text
                accessibilityRole="alert"
                color={colors.danger}
                variant="caption"
                style={{ marginTop: 12 }}
              >
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
          </ScrollView>
          {token && !reset && (!driver || action) && (
            <View style={s.footer}>
              <View>
                <Text variant="caption" color={colors.textMuted}>
                  Practice fare
                </Text>
                <Text style={s.total}>{euro(amount)}</Text>
              </View>
              <Button
                title={
                  driver
                    ? action === "accept"
                      ? "Accept ride"
                      : action === "start"
                        ? "Start to pickup"
                        : "Complete ride"
                    : active
                      ? "Connect Driver"
                      : "Demo Apple Pay"
                }
                icon={driver ? "arrow-forward" : active ? "link-outline" : "logo-apple"}
                style={{ flex: 1 }}
                loading={busy}
                onPress={() =>
                  driver && action
                    ? void act(action)
                    : active
                      ? setConnection(true)
                      : setPayVisible(true)
                }
              />
            </View>
          )}
          <Text style={s.disclaimer}>TEST DRIVE · NO REAL BOOKING OR PAYMENT</Text>
        </View>
        <DemoApplePay
          visible={payVisible}
          amountCents={practiceFare(route.baseCents, vehicle.multiplier)}
          destination={route.to}
          onClose={() => setPayVisible(false)}
          onAuthorize={() => act("request")}
        />
        <Modal
          visible={connection || routes}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => {
            setConnection(false);
            setRoutes(false);
          }}
        >
          <SafeAreaView style={s.modal}>
            <View style={s.modalHeader}>
              <Text variant="h2">{routes ? "Choose a practice route" : "Connect your apps"}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close connection details"
                style={s.circle}
                onPress={() => {
                  setConnection(false);
                  setRoutes(false);
                }}
              >
                <Icon name="close" size={23} />
              </Pressable>
            </View>
            <ScrollView
              contentContainerStyle={{ gap: 18, padding: 24 }}
              keyboardShouldPersistTaps="handled"
              automaticallyAdjustKeyboardInsets
              keyboardDismissMode="on-drag"
            >
              {routes ? (
                PRACTICE_ROUTES.map((r) => (
                  <Pressable
                    accessibilityRole="radio"
                    accessibilityState={{ checked: r.id === routeId }}
                    key={r.id}
                    style={s.routeRow}
                    onPress={() => {
                      setRouteId(r.id);
                      setRoutes(false);
                    }}
                  >
                    <Icon name="airplane-outline" size={22} />
                    <View style={{ flex: 1 }}>
                      <Text variant="title">{r.to}</Text>
                      <Text variant="caption" color={colors.textMuted}>
                        From {r.from}
                      </Text>
                    </View>
                    {r.id === routeId && <Icon name="checkmark" size={23} />}
                  </Pressable>
                ))
              ) : (
                <>
                  <Text color={colors.textMuted}>
                    Join the same private session on both devices. The code expires after two hours.
                  </Text>
                  <Text selectable style={s.code}>
                    {token}
                  </Text>
                  <Button
                    title="Share session link"
                    icon="share-outline"
                    fullWidth
                    onPress={() =>
                      void Share.share({
                        message: `TransferAround practice: ${driver ? "transferaround" : "transferaround-driver"}://practice?session=${token}\n\nSession code: ${token}`,
                      }).catch(() =>
                        setError("Sharing unavailable. Select and copy the session code."),
                      )
                    }
                  />
                  <Field
                    label="Join a different session"
                    value={joinCode}
                    onChangeText={setJoinCode}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder="Paste the other app’s code"
                    returnKeyType="join"
                    onSubmitEditing={() => {
                      if (joinCode.trim()) void connect(joinCode);
                    }}
                  />
                  <Button
                    title="Join shared session"
                    variant="outline"
                    disabled={!joinCode.trim() || busy}
                    fullWidth
                    onPress={() => void connect(joinCode)}
                  />
                  <Button
                    title="Reset this practice journey"
                    variant="ghost"
                    onPress={() => void act("reset")}
                  />
                  {state.events.slice(-5).map((e, i) => (
                    <Text key={i} variant="caption" color={colors.textMuted}>
                      {e.label}
                    </Text>
                  ))}
                </>
              )}
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#EDF0F3" },
  top: {
    position: "absolute",
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  circle: {
    width: 42,
    height: 42,
    borderRadius: 22,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.08,
    shadowRadius: 7,
  },
  mode: { backgroundColor: "white", borderRadius: 23, paddingVertical: 12, paddingHorizontal: 15 },
  modeText: { fontFamily: fonts.bold, fontSize: 9, letterSpacing: 1 },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 11,
    shadowOpacity: 0.12,
    shadowRadius: 20,
  },
  grabber: {
    width: 34,
    height: 4,
    borderRadius: 3,
    backgroundColor: colors.borderStrong,
    alignSelf: "center",
    marginBottom: 19,
  },
  statusRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: {
    fontFamily: fonts.bold,
    fontSize: 25,
    lineHeight: 31,
    letterSpacing: -0.8,
    marginTop: 14,
    marginBottom: 15,
  },
  description: { fontSize: 13, lineHeight: 20, color: colors.textMuted, marginBottom: 16 },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 13,
    padding: 14,
    marginBottom: 9,
  },
  vehicle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 14,
    padding: 6,
    marginTop: 2,
  },
  selected: { borderColor: colors.primary, backgroundColor: "#F8F9FB" },
  price: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 28 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  total: { fontFamily: fonts.bold, fontSize: 27, lineHeight: 35, letterSpacing: -0.8 },
  disclaimer: {
    fontFamily: fonts.bodySemibold,
    fontSize: 8,
    letterSpacing: 0.7,
    textAlign: "center",
    color: colors.textMuted,
    marginTop: 12,
  },
  tripMeta: { flexDirection: "row", alignItems: "center", gap: 9, marginBottom: 16 },
  routeBlock: { paddingBottom: 16 },
  privacy: { fontSize: 10, lineHeight: 16, color: colors.textMuted, marginVertical: 10 },
  modal: { flex: 1, backgroundColor: "white" },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  code: {
    fontSize: 13,
    lineHeight: 22,
    padding: 18,
    borderRadius: 12,
    backgroundColor: colors.surfaceMuted,
    fontFamily: fonts.medium,
  },
});
