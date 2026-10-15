import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { Platform } from "react-native";
import { getDevicePosition } from "@transferaround/mobile-shared/location";
import { supabase } from "./supabase";

const TASK = "transferaround-active-trip-gps-v2";
const STORAGE = "transferaround-active-sharing-v2";
let foreground: Location.LocationSubscription | null = null;
let activeBooking: string | null = null;
let lastSent = 0;
let pending: Promise<void> | null = null;
let starts: Promise<unknown> = Promise.resolve();
let stopping: Promise<void> | null = null;

function publish(bookingId: string, fix: Location.LocationObject): Promise<void> {
  if (pending || Date.now() - lastSent < 3500) return Promise.resolve();
  if (!Number.isFinite(fix.coords.latitude) || !Number.isFinite(fix.coords.longitude))
    return Promise.resolve();
  // Old OS samples are never replayed and presented as a fresh driver position.
  if (Date.now() - fix.timestamp > 60000) return Promise.resolve();
  const operation = performPublish(bookingId, fix).finally(() => {
    if (pending === operation) pending = null;
  });
  pending = operation;
  return operation;
}
async function performPublish(bookingId: string, fix: Location.LocationObject) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    if ((await AsyncStorage.getItem(STORAGE)) !== bookingId) return;
    if (bookingId.startsWith("practice:")) {
      const { error } = await supabase
        .rpc("transfer_practice_gps", {
          p_token: bookingId.slice(9),
          p_position: {
            lat: fix.coords.latitude,
            lng: fix.coords.longitude,
            capturedAt: new Date(fix.timestamp).toISOString(),
          },
        })
        .abortSignal(controller.signal);
      if (error) {
        if (error.message.includes("practice_")) void stopTripSharing().catch(() => {});
        throw error;
      }
      lastSent = Date.now();
      return;
    }
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      void stopTripSharing().catch(() => {});
      throw new Error("Sign in before sharing trip location.");
    }
    // A pause may have happened while waiting for the auth session.
    if ((await AsyncStorage.getItem(STORAGE)) !== bookingId) return;
    const { error } = await supabase
      .from("trip_locations")
      .upsert(
        {
          booking_id: bookingId,
          driver_id: session.user.id,
          latitude: fix.coords.latitude,
          longitude: fix.coords.longitude,
          heading:
            fix.coords.heading != null && fix.coords.heading >= 0 ? fix.coords.heading : null,
          accuracy:
            fix.coords.accuracy != null && fix.coords.accuracy >= 0 ? fix.coords.accuracy : null,
          speed: fix.coords.speed != null && fix.coords.speed >= 0 ? fix.coords.speed : null,
          captured_at: new Date(fix.timestamp).toISOString(),
        },
        { onConflict: "booking_id" },
      )
      .abortSignal(controller.signal);
    if (error) {
      if (error.code === "42501" || error.code === "23503") void stopTripSharing().catch(() => {});
      throw error;
    }
    lastSent = Date.now();
  } finally {
    clearTimeout(timeout);
  }
}

if (!TaskManager.isTaskDefined(TASK))
  TaskManager.defineTask<{ locations: Location.LocationObject[] }>(
    TASK,
    async ({ data, error }) => {
      if (error || !data?.locations?.length) return;
      const bookingId = await AsyncStorage.getItem(STORAGE);
      if (!bookingId) return;
      const fix = data.locations.at(-1)!;
      try {
        await publish(bookingId, fix);
      } catch {
        /* The next OS GPS sample retries a network failure. */
      }
    },
  );

/** Explicit opt-in per active assigned trip. OS Always permission is requested separately. */
async function performStartTripSharing(bookingId: string, { background = false } = {}) {
  if (Platform.OS === "web") throw new Error("Live trip sharing needs the native driver app.");
  await getDevicePosition();
  if (activeBooking !== bookingId) {
    await stopTripSharing();
    activeBooking = bookingId;
    lastSent = 0;
  }
  await AsyncStorage.setItem(STORAGE, bookingId);
  const fix = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
  await publish(bookingId, fix);
  if (!foreground)
    foreground = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.BestForNavigation, distanceInterval: 0, timeInterval: 4000 },
      (p) => {
        void publish(bookingId, p).catch(() => {});
      },
    );
  let backgroundGranted = (await Location.getBackgroundPermissionsAsync()).status === "granted";
  if (background && !backgroundGranted) {
    await Location.requestBackgroundPermissionsAsync();
    // Read the final iOS choice after the permission controller dismisses.
    backgroundGranted = (await Location.getBackgroundPermissionsAsync()).status === "granted";
  }
  if (backgroundGranted && !(await Location.hasStartedLocationUpdatesAsync(TASK)))
    await Location.startLocationUpdatesAsync(TASK, {
      accuracy: Location.Accuracy.BestForNavigation,
      // Keep receiving genuine fixes while waiting at pickup, not only after moving 5 m.
      distanceInterval: 0,
      timeInterval: 4000,
      deferredUpdatesInterval: 5000,
      pausesUpdatesAutomatically: false,
      showsBackgroundLocationIndicator: true,
      activityType: Location.ActivityType.AutomotiveNavigation,
    });
  return { background: backgroundGranted };
}
export function startTripSharing(bookingId: string, options: { background?: boolean } = {}) {
  const next = starts.catch(() => {}).then(() => performStartTripSharing(bookingId, options));
  starts = next;
  return next;
}
export async function resumeTripSharing() {
  const bookingId = await AsyncStorage.getItem(STORAGE);
  if (!bookingId) return;
  if (bookingId.startsWith("practice:")) {
    if ((await Location.getForegroundPermissionsAsync()).granted) await startTripSharing(bookingId);
    return;
  }
  const { data } = await supabase
    .from("bookings")
    .select("id,status")
    .eq("id", bookingId)
    .maybeSingle();
  if (!data || !["claimed", "en_route"].includes(data.status)) {
    await stopTripSharing();
    return;
  }
  if ((await Location.getForegroundPermissionsAsync()).granted) await startTripSharing(bookingId);
}
async function performStopTripSharing() {
  const bookingId = activeBooking || (await AsyncStorage.getItem(STORAGE));
  activeBooking = null;
  foreground?.remove();
  foreground = null;
  await AsyncStorage.removeItem(STORAGE);
  let nativeError: unknown = null;
  try {
    if (Platform.OS !== "web" && (await Location.hasStartedLocationUpdatesAsync(TASK)))
      await Location.stopLocationUpdatesAsync(TASK);
  } catch (error) {
    nativeError = error;
  }
  // Do not let an already-started GPS request recreate the marker after deletion.
  if (pending) {
    let timer: ReturnType<typeof setTimeout> | undefined;
    await Promise.race([
      pending.catch(() => {}),
      new Promise<void>((resolve) => {
        timer = setTimeout(resolve, 12000);
      }),
    ]).finally(() => {
      if (timer) clearTimeout(timer);
    });
  }
  const cleanup = bookingId?.startsWith("practice:")
    ? await supabase.rpc("transfer_practice_gps", { p_token: bookingId.slice(9) })
    : bookingId
      ? await supabase.from("trip_locations").delete().eq("booking_id", bookingId)
      : null;
  if (cleanup?.error)
    throw new Error(
      "Location stopped on this phone, but its last shared position could not be cleared. Check your connection.",
    );
  if (nativeError) throw nativeError;
}
export function stopTripSharing() {
  // Completion can arrive from both the action response and Realtime.
  if (stopping) return stopping;
  const operation = performStopTripSharing().finally(() => {
    if (stopping === operation) stopping = null;
  });
  stopping = operation;
  return operation;
}
export const startPracticeSharing = (token: string) =>
  startTripSharing(`practice:${token}`, { background: true });
