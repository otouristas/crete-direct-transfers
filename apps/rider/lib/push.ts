import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import Constants from "expo-constants";
import { registerDeviceToken, unregisterDeviceToken } from "@transferaround/mobile-shared";
import { supabase } from "./supabase";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function resolveEasProjectId(): string | null {
  const fromEnv = process.env.EXPO_PUBLIC_EAS_PROJECT_ID?.trim();
  const fromExtra = (Constants.expoConfig?.extra as { eas?: { projectId?: string } } | undefined)
    ?.eas?.projectId;
  const id = fromEnv || fromExtra || null;
  if (!id || !UUID_RE.test(id)) return null;
  return id;
}

export async function syncRiderPushToken(userId: string): Promise<string | null> {
  if (!Device.isDevice) return null;
  const projectId = resolveEasProjectId();
  // Expo Go + placeholder projectId throws VALIDATION_ERROR — skip quietly until EAS is wired.
  if (!projectId) return null;

  const current = await Notifications.getPermissionsAsync();
  let status = current.status;
  if (status !== "granted") {
    status = (await Notifications.requestPermissionsAsync()).status;
  }
  if (status !== "granted") return null;
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Trips",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  const token = (
    await Notifications.getExpoPushTokenAsync({
      projectId,
    })
  ).data;
  await registerDeviceToken(supabase, {
    userId,
    role: "customer",
    platform: Platform.OS === "ios" ? "ios" : "android",
    expoPushToken: token,
  });
  return token;
}

export async function clearRiderPushToken(userId: string, token: string | null) {
  if (!token) return;
  await unregisterDeviceToken(supabase, { userId, expoPushToken: token });
}
