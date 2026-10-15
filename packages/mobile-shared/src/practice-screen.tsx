import AsyncStorage from "@react-native-async-storage/async-storage";
import { DemoApplePay } from "./demo-apple-pay";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, Platform, Pressable, Share, StyleSheet, Switch, View } from "react-native";

import {
  EMPTY_PRACTICE,
  PRACTICE_ROUTES,
  PRACTICE_VEHICLES,
  practiceFare,
  runPractice,
  type PracticeAction,
  type PracticeState,
  type PracticeClient,
} from "./practice";
import {
  Avatar,
  BrandWordmark,
  Button,
  Card,
  Field,
  Heading,
  Icon,
  RouteMap,
  RouteRail,
  Screen,
  Text,
  colors,
  fonts,
  radius,
  space,
} from "./ui";

const euro = (cents: number) => `€${Math.round(cents / 100)}`;
const labels = {
  pending: "Finding your driver",
  claimed: "Nikos accepted your trip",
  en_route: "Your driver is on the way",
  completed: "You’ve arrived. Enjoy Crete.",
  cancelled: "Practice trip cancelled",
};

/** Both native apps and the website use the same isolated practice API. */
export function PracticeScreen({
  client,
  role,
  initialSession,
}: {
  client: PracticeClient;
  role: "rider" | "driver";
  initialSession?: string;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [joinCode, setJoinCode] = useState("");
  const [state, setState] = useState<PracticeState>(EMPTY_PRACTICE);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [routeId, setRouteId] = useState<string>(PRACTICE_ROUTES[0].id);
  const [vehicleId, setVehicleId] = useState<string>("comfort");
  const [payVisible, setPayVisible] = useState(false);
  const [showConnection, setShowConnection] = useState(false);
  const requestSerial = useRef(0);
  const driver = role === "driver";
  const trip = state.trip;
  const active = trip && !["completed", "cancelled"].includes(trip.status);
  const route = PRACTICE_ROUTES.find((r) => r.id === routeId)!;
  const vehicle = PRACTICE_VEHICLES.find((v) => v.id === vehicleId)!;

  const connect = useCallback(
    async (code?: string) => {
      const serial = ++requestSerial.current;
      setBusy(true);
      setError(null);
      try {
        const trimmed = code?.trim().toLowerCase();
        if (trimmed && !/^[a-f0-9]{48}$/.test(trimmed))
          throw new Error("Paste the 48-character session code from the other app or website.");
        const result = await runPractice(client, trimmed || null, trimmed ? "read" : "create");
        if (serial !== requestSerial.current) return;
        const nextToken = result.token || trimmed!;
        setToken(nextToken);
        await AsyncStorage.setItem(`transferaround-practice-${role}`, nextToken);
        setState(result.state);
        setJoinCode("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not connect.");
      } finally {
        if (serial === requestSerial.current) setBusy(false);
      }
    },
    [client, role],
  );

  useEffect(() => {
    let active = true;
    if (initialSession) {
      void connect(initialSession);
      return;
    }
    void AsyncStorage.getItem(`transferaround-practice-${role}`)
      .then((saved) => {
        if (active && saved) void connect(saved);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [connect, role, initialSession]);

  useEffect(() => {
    if (!token) return;
    let mounted = true;
    let polling = false;
    const poll = async () => {
      if (polling || AppState.currentState === "background") return;
      polling = true;
      const serial = requestSerial.current;
      try {
        const r = await runPractice(client, token, "read");
        if (mounted && serial === requestSerial.current) setState(r.state);
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : "Connection interrupted.");
      } finally {
        polling = false;
      }
    };
    const timer = setInterval(poll, 2500);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [client, token]);

  async function act(action: PracticeAction) {
    if (!token || busy) return;
    ++requestSerial.current;
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

  const driverAction =
    driver && trip && active && (state.online || trip.status !== "pending")
      ? trip.status === "pending"
        ? "accept"
        : trip.status === "claimed"
          ? "start"
          : "complete"
      : null;
  const canRequest = !driver && !active && trip?.status !== "completed";
  const footer =
    token && (canRequest || driverAction) ? (
      <View style={s.actionBar}>
        <View>
          <Text variant="caption" color={colors.textMuted}>
            {driver ? "Demo earnings" : "Demo total"}
          </Text>
          <Text style={s.footerFare}>
            {euro(
              driver && trip
                ? Math.round(trip.priceCents * 0.85)
                : practiceFare(route.baseCents, vehicle.multiplier),
            )}
          </Text>
        </View>
        <Button
          title={
            driverAction === "accept"
              ? "Accept practice ride"
              : driverAction === "start"
                ? "Start to pickup"
                : driverAction === "complete"
                  ? "Complete trip"
                  : "Demo Apple Pay"
          }
          icon={driver ? "arrow-forward" : "logo-apple"}
          onPress={() => (driverAction ? void act(driverAction) : setPayVisible(true))}
          loading={busy}
          style={{ flex: 1 }}
        />
      </View>
    ) : undefined;

  return (
    <Screen scroll background="#F6F4EC" footer={footer}>
      <DemoApplePay
        visible={payVisible}
        amountCents={practiceFare(route.baseCents, vehicle.multiplier)}
        destination={route.to}
        onClose={() => setPayVisible(false)}
        onAuthorize={async () => Boolean(await act("request"))}
      />
      <View style={s.brandBar}>
        <BrandWordmark size={21} />
        <Text style={s.roleLabel}>{driver ? "DRIVER" : "TRAVELER"}</Text>
      </View>
      <View style={[s.hero, !driver && s.travelerHero, token && s.compactHero]}>
        <View style={s.tag}>
          <Icon name="sparkles-outline" size={14} color="#D4F078" />
          <Text style={[s.tagText, !driver && s.travelerInk]}>YOUR CONNECTED PRACTICE JOURNEY</Text>
        </View>
        <Heading variant="h1" style={[s.title, !driver && s.travelerInk, token && s.compactTitle]}>
          {token
            ? driver
              ? "Your day, in motion."
              : "Hello, sunshine."
            : driver
              ? "A great day,\none journey at a time."
              : "Leave the planning.\nKeep the feeling."}
        </Heading>
        {!token && (
          <Text style={[s.sub, !driver && { color: "#788773" }]}>
            Two apps. One smooth arrival. No real charges.
          </Text>
        )}
      </View>
      {error && (
        <Card padded>
          <Text color={colors.danger} accessibilityRole="alert">
            {error}
          </Text>
          <Button
            title="Start a fresh practice session"
            variant="outline"
            onPress={() => void connect()}
            disabled={busy}
          />
        </Card>
      )}
      {!token ? (
        <Card padded>
          <Heading variant="h2">Let’s take it for a spin.</Heading>
          <Text color={colors.textMuted} style={s.copy}>
            Start a session in either app. Share its code, then join the same session in the other
            app to see both sides of the journey.
          </Text>
          <Button
            title="Start new practice session"
            icon="add-circle-outline"
            onPress={() => void connect()}
            loading={busy}
            fullWidth
          />
          <Text color={colors.textMuted} center style={s.or}>
            or join your other screen
          </Text>
          <Field
            label="Session code"
            value={joinCode}
            onChangeText={setJoinCode}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Paste your session code"
          />
          <View style={{ height: 12 }} />
          <Button
            title="Join shared session"
            variant="outline"
            disabled={!joinCode.trim() || busy}
            onPress={() => void connect(joinCode)}
            fullWidth
          />
        </Card>
      ) : (
        <>
          <View style={s.connected}>
            <Icon name="radio-outline" size={16} color={colors.accentDeep} />
            <Text variant="caption" color={colors.accentDeep}>
              Connected · practice only · expires in 2 hours
            </Text>
          </View>
          {driver && (
            <Card padded style={s.availability}>
              <View>
                <Text variant="title">{state.online ? "You’re online" : "You’re offline"}</Text>
                <Text variant="caption" color={colors.textMuted}>
                  {state.online
                    ? "Ready for the next journey"
                    : "Switch on to receive the practice request"}
                </Text>
              </View>
              <Switch
                value={state.online}
                onValueChange={(v) => void act(v ? "online" : "offline")}
                disabled={busy}
                trackColor={{ false: colors.border, true: colors.accent }}
                accessibilityLabel="Driver online"
              />
            </Card>
          )}
          <RouteMap from={trip?.from || route.from} to={trip?.to || route.to} height={180} />
          {driver ? (
            <Card padded>
              {trip && active && (state.online || trip.status !== "pending") ? (
                <>
                  <Text variant="caption" color={colors.accentDeep}>
                    {trip.status === "pending" ? "NEW PRACTICE REQUEST" : "YOUR ACTIVE JOURNEY"}
                  </Text>
                  <Text style={s.fare}>{euro(Math.round(trip.priceCents * 0.85))}</Text>
                  <Text variant="caption" color={colors.textMuted}>
                    Illustrative earnings · 85% of {euro(trip.priceCents)}
                  </Text>
                  <View style={s.rail}>
                    <RouteRail from={trip.from} to={trip.to} />
                  </View>
                  <View style={s.person}>
                    <Avatar name="Alex Morgan" size={38} />
                    <View>
                      <Text variant="subtitle">Alex Morgan</Text>
                      <Text variant="caption" color={colors.textMuted}>
                        2 travelers · {trip.vehicleName}
                      </Text>
                    </View>
                  </View>
                </>
              ) : trip?.status === "completed" ? (
                <>
                  <Icon name="checkmark-circle-outline" size={44} color={colors.accentDeep} />
                  <Heading variant="h2" style={{ marginTop: 14 }}>
                    Beautifully done.
                  </Heading>
                  <Text style={s.copy} color={colors.textMuted}>
                    One journey. Two connected experiences. No payment or payout was made.
                  </Text>
                  <Button
                    title="Try another journey"
                    onPress={() => void act("reset")}
                    loading={busy}
                    fullWidth
                  />
                </>
              ) : (
                <>
                  <Heading variant="h2">
                    {state.online ? "Ready for a great day." : "Your next journey awaits."}
                  </Heading>
                  <Text style={s.copy} color={colors.textMuted}>
                    {state.online
                      ? "Request a trip in the Traveler app or website. It will appear here in a moment."
                      : "Go online, share your session code and request a ride in the Traveler app."}
                  </Text>
                </>
              )}
            </Card>
          ) : active || trip?.status === "completed" ? (
            <Card padded>
              <Text variant="caption" color={colors.accentDeep}>
                YOUR JOURNEY
              </Text>
              <Heading variant="h2" style={{ marginVertical: 12 }}>
                {labels[trip.status]}
              </Heading>
              {["claimed", "en_route", "completed"].includes(trip.status) && (
                <View style={s.person}>
                  <Avatar name="Nikos" size={44} />
                  <View>
                    <Text variant="subtitle">Nikos · ★ 4.9</Text>
                    <Text variant="caption" color={colors.textMuted}>
                      {trip.vehicleName} · {trip.plate}
                    </Text>
                  </View>
                </View>
              )}
              <RouteRail from={trip.from} to={trip.to} />
              <Text style={s.fare}>{euro(trip.priceCents)}</Text>
              <Text variant="caption" color={colors.textMuted}>
                Fictional fare · no payment taken
              </Text>
              {["pending", "claimed"].includes(trip.status) && (
                <Button
                  title="Cancel practice trip"
                  variant="outline"
                  onPress={() => void act("cancel")}
                  loading={busy}
                  fullWidth
                />
              )}
              {trip.status === "completed" && (
                <Button title="Try another journey" onPress={() => void act("reset")} fullWidth />
              )}
            </Card>
          ) : (
            <Card padded>
              <Heading variant="h2">Where are we taking you?</Heading>
              <View style={s.options}>
                {PRACTICE_ROUTES.map((r) => (
                  <Pressable
                    accessibilityRole="radio"
                    accessibilityState={{ checked: routeId === r.id }}
                    key={r.id}
                    accessibilityLabel={`${r.from} to ${r.to}`}
                    onPress={() => setRouteId(r.id)}
                    style={[s.routeOption, routeId === r.id && s.selectedOption]}
                  >
                    <View style={s.optionIcon}>
                      <Icon name="airplane-outline" size={20} color="#365F45" />
                    </View>
                    <View style={{ flex: 1, gap: 4 }}>
                      <Text style={s.optionTitle}>{r.to}</Text>
                      <Text style={s.optionSubtitle}>From {r.from}</Text>
                    </View>
                    <Icon
                      name={routeId === r.id ? "checkmark-circle" : "ellipse-outline"}
                      size={21}
                      color={routeId === r.id ? "#365F45" : "#BBC8AD"}
                    />
                  </Pressable>
                ))}
              </View>
              <Text variant="caption" color={colors.textMuted}>
                Choose your ride · 2 travelers
              </Text>
              <View style={s.vehicleOptions}>
                {PRACTICE_VEHICLES.map((v) => (
                  <Pressable
                    accessibilityRole="radio"
                    accessibilityState={{ checked: vehicleId === v.id }}
                    key={v.id}
                    accessibilityLabel={`${v.name} ${euro(practiceFare(route.baseCents, v.multiplier))}`}
                    onPress={() => setVehicleId(v.id)}
                    style={[s.vehicleOption, vehicleId === v.id && s.selectedOption]}
                  >
                    <Icon
                      name={v.id === "minivan" ? "bus-outline" : "car-sport-outline"}
                      size={28}
                      color="#365F45"
                    />
                    <Text style={s.vehicleName}>{v.name}</Text>
                    <Text style={s.vehiclePrice}>
                      {euro(practiceFare(route.baseCents, v.multiplier))}
                    </Text>
                    {vehicleId === v.id && (
                      <View style={s.vehicleCheck}>
                        <Icon name="checkmark" size={11} color="#F6F4EC" />
                      </View>
                    )}
                  </Pressable>
                ))}
              </View>
            </Card>
          )}
          <Button
            title={showConnection ? "Hide connection details" : "Connect the other app"}
            icon="share-outline"
            variant="outline"
            fullWidth
            onPress={() => setShowConnection(!showConnection)}
          />
          {showConnection && (
            <Card padded>
              <Text variant="subtitle">Connect the other app</Text>
              <Text style={s.copy} variant="caption" color={colors.textMuted}>
                Paste this code into the other mobile app, or open the shared link on any screen.
              </Text>
              <Text selectable style={s.code}>
                {token}
              </Text>
              <View style={{ height: 12 }} />
              <Button
                title="Share practice session"
                icon="share-outline"
                variant="outline"
                onPress={() =>
                  void Share.share({
                    message: `Join my TransferAround practice journey in the ${driver ? "Traveler" : "Driver"} iPhone app:\n${driver ? "transferaround" : "transferaround-driver"}://practice?session=${token}\n\nSession code: ${token}`,
                  }).catch(() => setError("Could not open sharing. Copy the session code above."))
                }
                fullWidth
              />
              <View style={{ height: 8 }} />
              <Button
                title="Reset this practice journey"
                variant="ghost"
                onPress={() => void act("reset")}
                disabled={busy}
              />
            </Card>
          )}
          {state.events.length > 0 && (
            <Card padded>
              <Text variant="caption" color={colors.accentDeep}>
                THE JOURNEY, AS IT HAPPENS
              </Text>
              {state.events.slice(-5).map((e, i) => (
                <View key={`${e.at}-${i}`} style={s.event}>
                  <Icon name="checkmark-circle-outline" size={15} color={colors.accentDeep} />
                  <Text variant="caption" style={{ flex: 1 }}>
                    {e.label}
                  </Text>
                </View>
              ))}
            </Card>
          )}
        </>
      )}
    </Screen>
  );
}
const s = StyleSheet.create({
  actionBar: { flexDirection: "row", alignItems: "center", gap: 22 },
  footerFare: {
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -1,
    color: colors.primary,
  },
  compactHero: { paddingVertical: 15, gap: 8 },
  compactTitle: { fontSize: 27, lineHeight: 34 },
  brandBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  roleLabel: { fontFamily: fonts.bodySemibold, fontSize: 8, letterSpacing: 2, color: "#788773" },
  hero: { backgroundColor: "#103F3A", padding: 24, borderRadius: 24, gap: 15 },
  travelerHero: { backgroundColor: "#F6F4EC", paddingHorizontal: 0, paddingVertical: 12 },
  travelerInk: { color: "#103F3A" },
  tag: { flexDirection: "row", gap: 8, alignItems: "center" },
  tagText: { fontSize: 9, letterSpacing: 2, color: "#D4F078", fontFamily: fonts.bold },
  title: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    color: "#F7F8F2",
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -1,
  },
  sub: { color: "#ADC6B6", fontSize: 12, lineHeight: 20 },
  copy: { marginVertical: 15, lineHeight: 21 },
  or: { marginVertical: 18, fontSize: 11 },
  connected: { flexDirection: "row", alignItems: "center", gap: 8 },
  availability: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  fare: {
    fontFamily: fonts.display,
    fontSize: 38,
    lineHeight: 48,
    letterSpacing: -1.7,
    color: "#102D32",
    marginVertical: 12,
  },
  rail: { marginVertical: 20 },
  person: { flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 18 },
  options: { gap: 8, marginVertical: 18 },
  routeOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#E0E4D5",
    backgroundColor: "#FFFEFA",
  },
  selectedOption: { backgroundColor: "#EDF3DC", borderColor: "#7F9D66" },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#E7EDDC",
    alignItems: "center",
    justifyContent: "center",
  },
  optionTitle: { fontFamily: fonts.semibold, fontSize: 13, color: "#153C35" },
  optionSubtitle: { fontFamily: fonts.body, fontSize: 10, color: "#788773" },
  vehicleOptions: { flexDirection: "row", gap: 8, marginVertical: 18 },
  vehicleOption: {
    flex: 1,
    alignItems: "center",
    gap: 9,
    paddingVertical: 17,
    borderWidth: 1,
    borderColor: "#E0E4D5",
    borderRadius: 19,
    backgroundColor: "#FFFEFA",
  },
  vehicleName: { fontSize: 10, fontFamily: fonts.semibold, color: "#153C35" },
  vehiclePrice: {
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
    fontSize: 24,
    color: "#103F3A",
  },
  vehicleCheck: {
    position: "absolute",
    top: 7,
    right: 7,
    backgroundColor: "#365F45",
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  code: {
    fontSize: 11,
    color: colors.accentDeep,
    padding: 12,
    backgroundColor: "#F0F4E9",
    borderRadius: radius.sm,
    lineHeight: 19,
  },
  event: { flexDirection: "row", gap: 9, alignItems: "center", marginTop: 16 },
});
