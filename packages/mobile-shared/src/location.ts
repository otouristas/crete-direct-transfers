import * as Location from "expo-location";
import { Linking, Platform } from "react-native";

export type DevicePosition = {
  lat: number;
  lng: number;
  accuracy: number | null;
  capturedAt: string;
};
export class LocationPermissionError extends Error {
  constructor(public canAskAgain: boolean) {
    super("Location access is off. Enable it in Settings or choose your pickup on the map.");
  }
}

/** Called only after the person chooses a location action. Never starts background tracking. */
export async function getDevicePosition(): Promise<DevicePosition> {
  if (!(await Location.hasServicesEnabledAsync()))
    throw new Error("Location Services are off. Turn them on in your device settings.");
  let permission = await Location.getForegroundPermissionsAsync();
  if (permission.status !== "granted" && permission.canAskAgain)
    permission = await Location.requestForegroundPermissionsAsync();
  if (permission.status !== "granted") throw new LocationPermissionError(permission.canAskAgain);
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const fix = await Promise.race([
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }),
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () =>
            reject(new Error("We couldn’t get a fresh GPS fix. Try again outdoors or set a pin.")),
          15000,
        );
      }),
    ]);
    return {
      lat: fix.coords.latitude,
      lng: fix.coords.longitude,
      accuracy: fix.coords.accuracy,
      capturedAt: new Date(fix.timestamp).toISOString(),
    };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function openLocationSettings() {
  if (Platform.OS !== "web") await Linking.openSettings();
}

/** Native reverse geocoding keeps GPS pickup useful even before the website API is deployed. */
export async function describePosition(point: { lat: number; lng: number }): Promise<string> {
  try {
    const [address] = await Location.reverseGeocodeAsync({
      latitude: point.lat,
      longitude: point.lng,
    });
    if (address) {
      const street = [address.street, address.streetNumber].filter(Boolean).join(" ");
      const label = [street || address.name, address.city || address.subregion]
        .filter(Boolean)
        .join(", ");
      if (label) return label;
    }
  } catch {
    /* A coordinate pin is still a valid pickup if geocoding is offline. */
  }
  return "Current location";
}
