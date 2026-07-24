import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { fetchProfile } from "@transferaround/mobile-shared";
import { SKIP_AUTH } from "./config";
import { supabase } from "./supabase";
import { clearRiderPushToken, syncRiderPushToken } from "./push";

type Profile = Awaited<ReturnType<typeof fetchProfile>>;

const DEMO_USER = {
  id: "00000000-0000-4000-8000-000000000002",
  email: "demo.rider@transferaround.com",
} as User;

const DEMO_PROFILE = {
  id: DEMO_USER.id,
  full_name: "Demo Traveler",
  phone: "+30 690 000 0001",
  role: "customer",
  driver_profiles: null,
} as unknown as NonNullable<Profile>;

type AuthState = {
  session: Session | null;
  user: User | null;
  profile: Profile;
  loading: boolean;
  isDemo: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile>(null);
  const [loading, setLoading] = useState(true);
  const [pushToken, setPushToken] = useState<string | null>(null);

  useEffect(() => {
    if (SKIP_AUTH) {
      setSession(null);
      setProfile(DEMO_PROFILE);
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, next) => setSession(next));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (SKIP_AUTH) return;
    if (!session?.user) {
      setProfile(null);
      return;
    }
    void fetchProfile(supabase, session.user.id).then(setProfile);
    void syncRiderPushToken(session.user.id)
      .then(setPushToken)
      .catch((err) => console.warn("[push]", err));
  }, [session?.user?.id]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, signup_role: "customer" } },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    if (SKIP_AUTH) return;
    if (session?.user && pushToken) {
      try {
        await clearRiderPushToken(session.user.id, pushToken);
      } catch {
        /* ignore */
      }
    }
    await supabase.auth.signOut();
    setPushToken(null);
  }, [pushToken, session?.user]);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? (SKIP_AUTH ? DEMO_USER : null),
      profile: SKIP_AUTH ? DEMO_PROFILE : profile,
      loading,
      isDemo: SKIP_AUTH,
      signIn,
      signUp,
      signOut,
    }),
    [session, profile, loading, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth outside AuthProvider");
  return ctx;
}
