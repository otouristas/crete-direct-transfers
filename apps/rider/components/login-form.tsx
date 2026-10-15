import { useRouter } from "expo-router";
import { AuthScreen } from "@transferaround/mobile-shared/auth-screen";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";
export default function LoginForm() {
  const { signIn } = useAuth();
  const router = useRouter();
  return (
    <AuthScreen
      role="rider"
      onBrowse={() => router.replace("/(tabs)")}
      client={supabase}
      onSignIn={signIn}
      onPractice={() => router.push("/practice")}
      onCreateAccount={() => router.push("/signup")}
    />
  );
}
