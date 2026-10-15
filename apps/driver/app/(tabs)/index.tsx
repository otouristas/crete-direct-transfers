import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  claimJob,
  fetchDriverJobs,
  fetchMyJobOffers,
  fetchOpenJobs,
  respondToOffer,
  setDriverOnline,
} from "@transferaround/mobile-shared";
import { getDevicePosition, type DevicePosition } from "@transferaround/mobile-shared/location";
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
import { useAuth } from "../../lib/auth";
import { supabase } from "../../lib/supabase";

type Offer = Awaited<ReturnType<typeof fetchMyJobOffers>>[number];
type Job = Awaited<ReturnType<typeof fetchOpenJobs>>[number];
type DriverJob = Awaited<ReturnType<typeof fetchDriverJobs>>[number];
export default function OffersScreen() {
  const { profile, user, refreshProfile, signOut, isDemo } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const [sheetHeight, setSheetHeight] = useState(380);
  const [viewportHeight, setViewportHeight] = useState(height);
  const raw = profile?.driver_profiles;
  const driver = Array.isArray(raw) ? raw[0] : raw;
  const approved = profile?.role === "driver" && driver?.approval_status === "approved";
  const online = Boolean(driver?.is_online);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [assigned, setAssigned] = useState<DriverJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [me, setMe] = useState<DevicePosition | null>(null);
  const [now, setNow] = useState(Date.now());
  const load = useCallback(async () => {
    if (!approved || !user?.id || isDemo) return;
    setLoading(true);
    try {
      const [o, j, a] = await Promise.all([
        online ? fetchMyJobOffers(supabase) : [],
        online ? fetchOpenJobs(supabase) : [],
        fetchDriverJobs(supabase, user.id),
      ]);
      setOffers(o);
      setJobs(j);
      setAssigned(a);
      setError(null);
    } catch {
      setError("Your transfers could not be refreshed. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, [approved, user?.id, online, isDemo]);
  useEffect(() => {
    void load();
  }, [load]);
  useEffect(() => {
    if (!user?.id || !approved) return;
    const ch = supabase
      .channel(`driver-work:${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "job_offers", filter: `driver_id=eq.${user.id}` },
        () => void load(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings", filter: `driver_id=eq.${user.id}` },
        () => void load(),
      )
      .subscribe((s) => {
        if (s === "SUBSCRIBED") void load();
      });
    const timer = setInterval(() => void load(), 15000);
    return () => {
      clearInterval(timer);
      void supabase.removeChannel(ch);
    };
  }, [user?.id, approved, load]);
  useEffect(() => {
    if (!offers.length) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [offers.length]);
  async function toggle() {
    setBusy("online");
    setError(null);
    try {
      await setDriverOnline(supabase, !online);
      await refreshProfile();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update availability.");
    } finally {
      setBusy(null);
    }
  }
  async function accept(offer: Offer, yes: boolean) {
    if (!offer.offer_id || !offer.id) return;
    setBusy(offer.offer_id);
    try {
      await respondToOffer(supabase, offer.offer_id, yes);
      if (yes) router.push(`/job/${offer.id}`);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "This offer is no longer available.");
    } finally {
      setBusy(null);
    }
  }
  async function claim(job: Job) {
    if (!job.id) return;
    setBusy(job.id);
    try {
      await claimJob(supabase, job.id);
      router.push(`/job/${job.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "This trip could not be claimed.");
    } finally {
      setBusy(null);
    }
  }
  const active = assigned.find((j) => ["claimed", "en_route"].includes(j.status));
  const completed = assigned.filter(
    (j) =>
      j.status === "completed" &&
      new Date(j.pickup_at).toDateString() === new Date().toDateString(),
  );
  const pendingOffers = offers.filter((o) => !o.expires_at || Date.parse(o.expires_at) > now);
  const first = pendingOffers[0];
  function openAccount() {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: profile?.full_name || "TransferAround Driver",
          options: ["Your jobs", "Practice ride", "Sign out", "Cancel"],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 3,
        },
        (choice) => {
          if (choice === 0) router.push("/(tabs)/jobs");
          if (choice === 1) router.push("/practice");
          if (choice === 2) void signOut();
        },
      );
      return;
    }
    Alert.alert("Your account", profile?.full_name || "TransferAround Driver", [
      { text: "Practice ride", onPress: () => router.push("/practice") },
      { text: "Sign out", style: "destructive", onPress: () => void signOut() },
      { text: "Cancel", style: "cancel" },
    ]);
  }
  return (
    <View style={s.root} onLayout={(e) => setViewportHeight(e.nativeEvent.layout.height)}>
      <RouteMap
        from={active?.pickup_address || first?.pickup_address}
        to={active?.dropoff_address || first?.dropoff_address}
        userPoint={me}
        height={viewportHeight}
        bottomInset={sheetHeight}
      />
      <View style={[s.top, { top: insets.top + 8 }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Driver account actions"
          style={s.circle}
          onPress={openAccount}
        >
          <Avatar name={profile?.full_name || "Driver"} size={42} />
        </Pressable>
        <View style={s.earnings}>
          <Text style={s.earningsValue}>{completed.length}</Text>
          <Text style={s.earningsLabel}>TRIPS TODAY</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Show my GPS location"
          style={s.circle}
          onPress={() =>
            void getDevicePosition()
              .then(setMe)
              .catch((e) => setError(e.message))
          }
        >
          <Icon name="locate" size={22} />
        </Pressable>
      </View>
      <View
        onLayout={(e) => setSheetHeight(e.nativeEvent.layout.height)}
        style={[s.sheet, { paddingBottom: 15, maxHeight: height * 0.58 }]}
      >
        <View style={s.grabber} />
        <ScrollView showsVerticalScrollIndicator={false}>
          {!profile ? (
            <View style={s.state}>
              <ActivityIndicator />
              <Text color={colors.textMuted}>Loading your driver profile…</Text>
            </View>
          ) : !approved ? (
            <>
              <LivePill live={false} label="Driver setup" />
              <Text style={s.title}>
                {profile.role !== "driver"
                  ? "Use your driver account"
                  : driver?.approval_status === "draft"
                    ? "Finish your driver setup"
                    : "Your account needs approval"}
              </Text>
              <Text style={s.description}>
                {profile.role !== "driver"
                  ? "Sign in with the account registered as a driver."
                  : "Your account is registered. Operations must review your driver documents and vehicle before you receive real trips."}
              </Text>
              <Button
                title="Refresh approval status"
                variant="outline"
                fullWidth
                onPress={() => void refreshProfile()}
              />
              <Button title="Sign out" variant="ghost" fullWidth onPress={() => void signOut()} />
            </>
          ) : active ? (
            <>
              <LivePill live label="ACTIVE TRANSFER" />
              <Text style={s.title}>
                {active.status === "claimed"
                  ? "Your next pickup"
                  : active.journey_stage === "on_trip"
                    ? "On the way to drop-off"
                    : active.journey_stage === "at_pickup"
                      ? "Meet your traveler"
                      : "Head to pickup"}
              </Text>
              <RouteRail
                from={active.pickup_address || "Pickup"}
                to={active.dropoff_address || "Destination"}
              />
              <View style={{ height: 20 }} />
              <Button
                title="Open active trip"
                icon="arrow-forward"
                fullWidth
                onPress={() => router.push(`/job/${active.id}`)}
              />
            </>
          ) : (
            <>
              <LivePill
                live={online}
                label={online ? "Online · ready for requests" : "You’re offline"}
              />
              <Text style={s.title}>
                {first
                  ? "New transfer request"
                  : online
                    ? "Ready for your next trip"
                    : `Let’s go, ${(profile.full_name || "Driver").split(" ")[0]}`}
              </Text>
              {first ? (
                <View key={first.offer_id}>
                  <View style={s.offerHead}>
                    <Text style={s.fare}>€{Math.round((first.price_cents || 0) / 100)}</Text>
                    <View style={s.timer}>
                      <Icon name="time-outline" size={14} />
                      <Text variant="caption">
                        {Math.max(0, Math.ceil((Date.parse(first.expires_at || "") - now) / 1000))}s
                        to respond
                      </Text>
                    </View>
                  </View>
                  <RouteRail
                    from={first.pickup_address || "Pickup"}
                    to={first.dropoff_address || "Destination"}
                  />
                  <Text style={s.description}>
                    {first.pickup_at
                      ? new Date(first.pickup_at).toLocaleString()
                      : "Scheduled pickup"}
                  </Text>
                  <View style={s.actions}>
                    <Button
                      title="Decline"
                      variant="outline"
                      style={{ flex: 1 }}
                      onPress={() => void accept(first, false)}
                    />
                    <Button
                      title="Accept transfer"
                      style={{ flex: 2 }}
                      loading={busy === first.offer_id}
                      onPress={() => void accept(first, true)}
                    />
                  </View>
                </View>
              ) : (
                <>
                  <Text style={s.description}>
                    {online
                      ? "New offers will appear here as they arrive. Your location is shared only on an active assigned trip."
                      : "Go online to receive transfer offers. Review the pickup and fare before you accept."}
                  </Text>
                  <Button
                    title={online ? "Go offline" : "Go online"}
                    icon={online ? "pause" : "power"}
                    variant={online ? "outline" : "primary"}
                    fullWidth
                    loading={busy === "online"}
                    onPress={() => void toggle()}
                  />
                </>
              )}
              {online && jobs.length > 0 && (
                <>
                  <Text style={s.section}>AVAILABLE TRANSFERS</Text>
                  {jobs.slice(0, 3).map((j) => (
                    <Pressable
                      key={j.id}
                      accessibilityRole="button"
                      style={s.job}
                      onPress={() => void claim(j)}
                    >
                      <View style={{ flex: 1, gap: 3 }}>
                        <Text variant="subtitle">{j.dropoff_address || "Transfer"}</Text>
                        <Text variant="caption" color={colors.textMuted}>
                          {j.pickup_address}
                        </Text>
                      </View>
                      {busy === j.id ? (
                        <ActivityIndicator />
                      ) : (
                        <Text variant="title">€{Math.round((j.price_cents || 0) / 100)}</Text>
                      )}
                      <Icon name="chevron-forward" size={18} />
                    </Pressable>
                  ))}
                </>
              )}
            </>
          )}
          {error && (
            <Text
              variant="caption"
              color={colors.danger}
              accessibilityRole="alert"
              style={{ marginTop: 12 }}
            >
              {error}
            </Text>
          )}
          {loading && <ActivityIndicator style={{ marginTop: 12 }} />}
        </ScrollView>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#EDF0F3" },
  top: {
    position: "absolute",
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  circle: {
    width: 43,
    height: 43,
    borderRadius: 23,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  earnings: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingHorizontal: 25,
    paddingVertical: 8,
    alignItems: "center",
  },
  earningsValue: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 28, color: "white" },
  earningsLabel: {
    fontFamily: fonts.bodySemibold,
    fontSize: 7,
    letterSpacing: 1,
    color: "#CDD0D8",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  grabber: {
    width: 34,
    height: 4,
    borderRadius: 3,
    backgroundColor: colors.borderStrong,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 25,
    lineHeight: 32,
    letterSpacing: -0.7,
    marginTop: 13,
    marginBottom: 12,
  },
  description: { fontSize: 13, lineHeight: 20, color: colors.textMuted, marginBottom: 18 },
  state: { padding: 25, alignItems: "center", gap: 12 },
  offerHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  fare: { fontSize: 35, lineHeight: 43, fontFamily: fonts.bold, letterSpacing: -1 },
  timer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.surfaceMuted,
    padding: 9,
    borderRadius: 15,
  },
  actions: { flexDirection: "row", gap: 10 },
  section: {
    fontFamily: fonts.bodySemibold,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.textMuted,
    marginTop: 22,
    marginBottom: 12,
  },
  job: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
