import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import {
  ActivityIndicator,
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";
import { BrandWordmark, LogoMark, Button, Icon, Text, colors, fonts } from "./ui";
import { MobilityArtwork, useReducedMotion } from "./ui/mobility";
import {
  getDevicePosition,
  LocationPermissionError,
  openLocationSettings,
  type DevicePosition,
} from "./location";

const TourContext = createContext<{ replay: () => void; pickupPosition: DevicePosition | null }>({
  replay: () => {},
  pickupPosition: null,
});
export const useOnboarding = () => useContext(TourContext);
export const PICKUP_POSITION_KEY = "transferaround-pickup-position-v2";
const content = {
  rider: [
    {
      title: "Your arrival.\nAlready sorted.",
      body: "Private rides from airport to front door. Choose your car, see your fare, and make yourself comfortable.",
      detail: "Your journey, your own space",
      icon: "car-sport-outline" as const,
    },
    {
      title: "Your driver.\nRight on your map.",
      body: "Follow your driver’s real position during your trip. Know when location is live and when it was last updated.",
      detail: "Real GPS. Clear trip updates.",
      icon: "navigate-outline" as const,
    },
    {
      title: "Start right\nwhere you are.",
      body: "Use your location for a precise pickup. You can also search an address or place a pin on the map.",
      detail: "You control location access",
      icon: "shield-checkmark-outline" as const,
    },
  ],
  driver: [
    {
      title: "A clear road\nahead of you.",
      body: "Your transfers, your passengers, and your next move. Everything you need in one focused driver app.",
      detail: "Built around your working day",
      icon: "car-sport-outline" as const,
    },
    {
      title: "Know the trip.\nMake your move.",
      body: "Review pickup, destination and fare before accepting. Navigate to pickup, mark your arrival, then start the journey.",
      detail: "One action at a time",
      icon: "navigate-outline" as const,
    },
    {
      title: "Stay connected.\nEvery turn.",
      body: "Share your live location with the traveler on your assigned trip. Sharing stops when you finish or cancel.",
      detail: "Only your trip participants can see you",
      icon: "shield-checkmark-outline" as const,
    },
  ],
};

export function OnboardingGate({
  role,
  children,
}: {
  role: "rider" | "driver";
  children: ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState(false);
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [denied, setDenied] = useState(false);
  const [pickupPosition, setPickupPosition] = useState<DevicePosition | null>(null);
  const fade = useRef(new Animated.Value(1)).current;
  const reduced = useReducedMotion();
  const key = `transferaround-onboarding-v2-${role}`;
  useEffect(() => {
    let mounted = true;
    void AsyncStorage.getItem(key)
      .then((saved) => {
        if (mounted) {
          setVisible(saved !== "complete");
          setChecked(true);
        }
      })
      .catch(() => {
        if (mounted) {
          setVisible(true);
          setChecked(true);
        }
      });
    return () => {
      mounted = false;
    };
  }, [key]);
  async function complete() {
    await AsyncStorage.setItem(key, "complete");
    setVisible(false);
  }
  function next() {
    void Haptics.selectionAsync().catch(() => {});
    setError(null);
    if (reduced) {
      setStep((s) => s + 1);
      return;
    }
    Animated.timing(fade, { toValue: 0, duration: 100, useNativeDriver: true }).start(() => {
      setStep((s) => s + 1);
      Animated.timing(fade, { toValue: 1, duration: 280, useNativeDriver: true }).start();
    });
  }
  async function locate() {
    setBusy(true);
    setError(null);
    try {
      const position = await getDevicePosition();
      await AsyncStorage.setItem(PICKUP_POSITION_KEY, JSON.stringify(position));
      setPickupPosition(position);
      await complete();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Location is unavailable. You can continue and choose a pin.",
      );
      setDenied(e instanceof LocationPermissionError);
    } finally {
      setBusy(false);
    }
  }
  const page = content[role][step];
  return (
    <TourContext.Provider
      value={{
        pickupPosition,
        replay: () => {
          setStep(0);
          setError(null);
          setVisible(true);
        },
      }}
    >
      {checked ? (
        children
      ) : (
        <View style={{ flex: 1, backgroundColor: "white", justifyContent: "center" }}>
          <ActivityIndicator />
        </View>
      )}
      <Modal
        visible={visible}
        animationType="fade"
        onRequestClose={() => void complete()}
        presentationStyle="fullScreen"
      >
        <SafeAreaProvider>
          <SafeAreaView style={s.root}>
            <StatusBar style="dark" />
            <View style={s.top}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 9 }}>
                <LogoMark size={28} tone={role === "driver" ? "dark" : "light"} />
                <BrandWordmark size={19} />
              </View>
              <Pressable accessibilityRole="button" onPress={() => void complete()} hitSlop={12}>
                <Text style={s.skip}>Skip</Text>
              </Pressable>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
            >
              <Animated.View
                style={{
                  opacity: fade,
                  transform: [
                    { translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) },
                  ],
                }}
              >
                <View style={s.art}>
                  <MobilityArtwork mode={step} driver={role === "driver"} />
                </View>
                <View style={s.copy}>
                  <View style={s.steps}>
                    {[0, 1, 2].map((i) => (
                      <View key={i} style={[s.step, i === step && s.stepActive]} />
                    ))}
                  </View>
                  <Text accessibilityRole="header" style={s.title}>
                    {page.title}
                  </Text>
                  <Text style={s.body}>{page.body}</Text>
                  <View style={s.detail}>
                    <Icon name={page.icon} size={17} color={colors.accent} />
                    <Text style={s.detailText}>{page.detail}</Text>
                  </View>
                </View>
              </Animated.View>
            </ScrollView>
            <View style={s.bottom}>
              {error && (
                <Text accessibilityRole="alert" variant="caption" color={colors.danger}>
                  {error}
                </Text>
              )}
              {denied && (
                <Button
                  title="Open location settings"
                  variant="outline"
                  onPress={() => void openLocationSettings()}
                />
              )}
              <Button
                title={step === 2 ? "Use my location" : "Continue"}
                icon={step === 2 ? "navigate" : "arrow-forward"}
                fullWidth
                loading={busy}
                onPress={() => (step === 2 ? void locate() : next())}
              />
              {step === 2 && (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => void complete()}
                  style={s.later}
                >
                  <Text style={s.skip}>I’ll set my location later</Text>
                </Pressable>
              )}
            </View>
          </SafeAreaView>
        </SafeAreaProvider>
      </Modal>
    </TourContext.Provider>
  );
}
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "white" },
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 15,
  },
  skip: { fontSize: 13, fontFamily: fonts.bodySemibold, color: colors.textMuted },
  art: { marginTop: 12, marginHorizontal: 0 },
  copy: { paddingHorizontal: 28, paddingTop: 24, paddingBottom: 20 },
  steps: { flexDirection: "row", gap: 5, marginBottom: 24 },
  step: { width: 7, height: 4, borderRadius: 2, backgroundColor: "#D7DBE1" },
  stepActive: { width: 28, backgroundColor: colors.primary },
  title: { fontFamily: fonts.bold, fontSize: 35, lineHeight: 41, letterSpacing: -1.4 },
  body: { fontSize: 15, lineHeight: 23, color: colors.textMuted, marginTop: 18 },
  detail: { flexDirection: "row", gap: 9, alignItems: "center", marginTop: 22 },
  detailText: { fontSize: 12, color: colors.textMuted },
  bottom: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 12, gap: 12 },
  later: { alignItems: "center", padding: 8 },
});
