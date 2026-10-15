import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { systemTabScreenOptions } from "@transferaround/mobile-shared/ui";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={systemTabScreenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Book",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "navigate" : "navigate-outline"} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "compass" : "compass-outline"} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: "Trips",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "receipt" : "receipt-outline"} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
