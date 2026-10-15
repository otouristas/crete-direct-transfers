import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, Share, StyleSheet, Switch, View } from "react-native";

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
}: {
  client: PracticeClient;
  role: "rider" | "driver";
}) {
  const [token, setToken] = useState<string | null>(null);
  const [joinCode, setJoinCode] = useState("");
  const [state, setState] = useState<PracticeState>(EMPTY_PRACTICE);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [routeId, setRouteId] = useState<string>(PRACTICE_ROUTES[0].id);
  const [vehicleId, setVehicleId] = useState<string>("comfort");
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
    void AsyncStorage.getItem(`transferaround-practice-${role}`)
      .then((saved) => {
        if (active && saved) void connect(saved);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [connect, role]);

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
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen scroll>
      <View style={s.hero}>
        <View style={s.tag}>
          <Icon name="sparkles-outline" size={14} color="#D4F078" />
          <Text style={s.tagText}>THE PRACTICE STUDIO</Text>
        </View>
        <Heading variant="h1" style={s.title}>
          {driver ? "Your road.\nYour rhythm." : "A little less planning.\nA beautiful arrival."}
        </Heading>
        <Text style={s.sub}>A connected practice trip. No real bookings or charges.</Text>
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
                  <Button
                    title={
                      trip.status === "pending"
                        ? "Accept practice ride"
                        : trip.status === "claimed"
                          ? "Start driving to pickup"
                          : "Complete practice trip"
                    }
                    onPress={() =>
                      void act(
                        trip.status === "pending"
                          ? "accept"
                          : trip.status === "claimed"
                            ? "start"
                            : "complete",
                      )
                    }
                    loading={busy}
                    fullWidth
                  />
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
                  <Button
                    key={r.id}
                    title={`${r.from} → ${r.to}`}
                    variant={routeId === r.id ? "primary" : "outline"}
                    size="md"
                    onPress={() => setRouteId(r.id)}
                    fullWidth
                  />
                ))}
              </View>
              <Text variant="caption" color={colors.textMuted}>
                Choose your ride · 2 travelers
              </Text>
              <View style={s.options}>
                {PRACTICE_VEHICLES.map((v) => (
                  <Button
                    key={v.id}
                    title={`${v.name} · ${euro(practiceFare(route.baseCents, v.multiplier))}`}
                    variant={vehicleId === v.id ? "primary" : "outline"}
                    onPress={() => setVehicleId(v.id)}
                    fullWidth
                  />
                ))}
              </View>
              <Button
                title={`Request practice ride · ${euro(practiceFare(route.baseCents, vehicle.multiplier))}`}
                icon="arrow-forward"
                onPress={() => void act("request")}
                loading={busy}
                fullWidth
              />
            </Card>
          )}
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
                  message: `Try our connected TransferAround practice journey: https://transferaround.com/apps?session=${token}\n\nMobile session code: ${token}`,
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
  hero: { backgroundColor: "#102D32", padding: 24, borderRadius: 24, gap: 15 },
  tag: { flexDirection: "row", gap: 8, alignItems: "center" },
  tagText: { fontSize: 9, letterSpacing: 2, color: "#D4F078", fontFamily: fonts.bold },
  title: { color: "#F7F8F2", fontSize: 29, lineHeight: 36, letterSpacing: -1 },
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
    letterSpacing: -1.7,
    color: "#102D32",
    marginVertical: 12,
  },
  rail: { marginVertical: 20 },
  person: { flexDirection: "row", alignItems: "center", gap: 12, marginVertical: 18 },
  options: { gap: 8, marginVertical: 18 },
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
