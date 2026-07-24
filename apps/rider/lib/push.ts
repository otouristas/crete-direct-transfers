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

export async function syncRiderPushToken(userId: string): Promise<string | null> {
  if (!Device.isDevice) return null;
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
      projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID,
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
