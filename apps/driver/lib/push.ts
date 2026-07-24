import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
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

export async function ensurePushPermissions(): Promise<boolean> {
  if (!Device.isDevice) return false;
  const current = await Notifications.getPermissionsAsync();
  let status = current.status;
  if (status !== "granted") {
    const asked = await Notifications.requestPermissionsAsync();
    status = asked.status;
  }
  if (status !== "granted") return false;
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Job offers",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }
  return true;
}

export async function syncDriverPushToken(userId: string): Promise<string | null> {
  const ok = await ensurePushPermissions();
  if (!ok) return null;
  const token = (
    await Notifications.getExpoPushTokenAsync({
      projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID,
    })
  ).data;
  await registerDeviceToken(supabase, {
    userId,
    role: "driver",
    platform: Platform.OS === "ios" ? "ios" : "android",
    expoPushToken: token,
  });
  return token;
}

export async function clearDriverPushToken(userId: string, token: string | null) {
  if (!token) return;
  await unregisterDeviceToken(supabase, { userId, expoPushToken: token });
}
