import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { systemTabScreenOptions } from "@transferaround/mobile-shared/ui";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={systemTabScreenOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Offers",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "flash" : "flash-outline"} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: "Jobs",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "briefcase" : "briefcase-outline"} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="hotels"
        options={{
          title: "Hotels",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "bed" : "bed-outline"} size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
