import * as Location from "expo-location";
import { Platform } from "react-native";

export type GpsResult = { lat: number; lng: number };

/** Current device location — web uses navigator; native uses expo-location. */
export async function getCurrentGps(): Promise<GpsResult> {
  if (Platform.OS === "web") {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      throw new Error("GPS not available in this browser");
    }
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => reject(new Error(err.message || "GPS permission denied or timed out")),
        { enableHighAccuracy: true, timeout: 15_000, maximumAge: 30_000 },
      );
    });
  }

  const services = await Location.hasServicesEnabledAsync();
  if (!services) {
    throw new Error("Turn on Location Services, then try GPS again");
  }

  const current = await Location.getForegroundPermissionsAsync();
  let status = current.status;
  if (status !== "granted") {
    const asked = await Location.requestForegroundPermissionsAsync();
    status = asked.status;
  }
  if (status !== "granted") {
    throw new Error("Allow location access for TransferAround in Settings");
  }

  // Prefer a fresh fix; fall back to last known so Simulator / weak GPS still works.
  try {
    const pos = await Promise.race([
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("GPS timed out")), 12_000),
      ),
    ]);
    return { lat: pos.coords.latitude, lng: pos.coords.longitude };
  } catch (first) {
    const last = await Location.getLastKnownPositionAsync({
      maxAge: 1000 * 60 * 30,
      requiredAccuracy: 500,
    });
    if (last) {
      return { lat: last.coords.latitude, lng: last.coords.longitude };
    }
    throw first instanceof Error
      ? first
      : new Error("Could not read GPS — set a location in Simulator or use Pin on map");
  }
}
