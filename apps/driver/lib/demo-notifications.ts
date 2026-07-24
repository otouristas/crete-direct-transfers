import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/**
 * Demo-mode local notifications that simulate an incoming dispatch push
 * (e.g. "George K. is requesting a ride"). Uses `expo-notifications` local
 * scheduling — no backend / Expo push service required, so it works in Expo Go.
 * The foreground banner handler is configured in `./push`.
 */

export const RIDE_OFFER_CATEGORY = "demo_ride_offer";
export const ACCEPT_ACTION = "accept";
export const DECLINE_ACTION = "decline";

let categoryReady = false;

/** Requests notification permission (works on simulators too — no Device gate). */
async function ensureLocalNotifications(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  let status = current.status;
  if (status !== "granted") {
    status = (await Notifications.requestPermissionsAsync()).status;
  }
  if (status !== "granted") return false;
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Ride offers",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      sound: "default",
    });
  }
  return true;
}

async function ensureCategory() {
  if (categoryReady) return;
  // Action categories (Accept / Decline) are iOS/Android only — expo-notifications
  // throws "not available on web" if we call setNotificationCategoryAsync here.
  if (Platform.OS === "web") {
    categoryReady = true;
    return;
  }
  await Notifications.setNotificationCategoryAsync(RIDE_OFFER_CATEGORY, [
    { identifier: ACCEPT_ACTION, buttonTitle: "Accept", options: { opensAppToForeground: true } },
    { identifier: DECLINE_ACTION, buttonTitle: "Decline", options: { opensAppToForeground: false, isDestructive: true } },
  ]);
  categoryReady = true;
}

export type DemoOfferPush = {
  offerId: string;
  customerName: string;
  from: string;
  to: string;
  priceCents: number;
};

/** Presents a "new ride request" notification with Accept / Decline actions. */
export async function presentDemoOfferNotification(offer: DemoOfferPush): Promise<boolean> {
  // Local notification categories + action buttons are native-only. On web the
  // in-app offer cards already surface the demo dispatch; skip the push sim.
  if (Platform.OS === "web") return false;

  const ok = await ensureLocalNotifications();
  if (!ok) return false;
  await ensureCategory();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "New ride request 🚗",
      body: `${offer.customerName} · ${offer.from} → ${offer.to} · €${(offer.priceCents / 100).toFixed(0)}`,
      data: {
        type: "demo_offer",
        offerId: offer.offerId,
        customerName: offer.customerName,
        priceCents: offer.priceCents,
      },
      categoryIdentifier: RIDE_OFFER_CATEGORY,
      sound: "default",
    },
    trigger: null, // present immediately
  });
  return true;
}
