import { Stack, useLocalSearchParams } from "expo-router";
import { PracticeScreen } from "@transferaround/mobile-shared/practice-screen";
import { supabase } from "../lib/supabase";

export default function Practice() {
  const { session } = useLocalSearchParams<{ session?: string }>();
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: "Traveler · practice" }} />
      <PracticeScreen client={supabase} role="rider" initialSession={session} />
    </>
  );
}
