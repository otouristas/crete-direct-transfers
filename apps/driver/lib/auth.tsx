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
import { clearDriverPushToken, syncDriverPushToken } from "./push";

type Profile = Awaited<ReturnType<typeof fetchProfile>>;

const DEMO_USER = {
  id: "00000000-0000-4000-8000-000000000001",
  email: "demo.driver@transferaround.com",
} as User;

const DEMO_PROFILE = {
  id: DEMO_USER.id,
  full_name: "Demo Driver",
  phone: "+30 690 000 0000",
  role: "driver",
  driver_profiles: {
    id: DEMO_USER.id,
    approval_status: "approved",
    is_online: false,
    vehicle_class: "comfort",
    vehicle_make_model: "Mercedes E-Class",
    vehicle_plate: "CHQ-DEMO",
  },
} as unknown as NonNullable<Profile>;

type AuthState = {
  session: Session | null;
  user: User | null;
  profile: Profile;
  loading: boolean;
  isDemo: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setDemoOnline: (online: boolean) => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile>(null);
  const [loading, setLoading] = useState(true);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [demoOnline, setDemoOnline] = useState(false);

  const refreshProfile = useCallback(async () => {
    if (SKIP_AUTH && !session?.user) {
      setProfile({
        ...DEMO_PROFILE,
        driver_profiles: {
          ...(DEMO_PROFILE.driver_profiles as object),
          is_online: demoOnline,
        },
      } as Profile);
      return;
    }
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) {
      setProfile(null);
      return;
    }
    const row = await fetchProfile(supabase, userId);
    setProfile(row);
  }, [session?.user, demoOnline]);

  useEffect(() => {
    if (SKIP_AUTH) {
      setSession(null);
      setProfile({
        ...DEMO_PROFILE,
        driver_profiles: {
          ...(DEMO_PROFILE.driver_profiles as object),
          is_online: demoOnline,
        },
      } as Profile);
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });
    return () => sub.subscription.unsubscribe();
  }, [demoOnline]);

  useEffect(() => {
    if (SKIP_AUTH) return;
    if (!session?.user) {
      setProfile(null);
      return;
    }
    void refreshProfile();
    void syncDriverPushToken(session.user.id)
      .then(setPushToken)
      .catch((err) => console.warn("[push]", err));
  }, [session?.user?.id, refreshProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const row = await fetchProfile(supabase, data.user.id);
    if (!row || (row.role !== "driver" && row.role !== "admin")) {
      await supabase.auth.signOut();
      throw new Error("driver_role_required");
    }
    setProfile(row);
  }, []);

  const signOut = useCallback(async () => {
    if (SKIP_AUTH) return;
    if (session?.user && pushToken) {
      try {
        await clearDriverPushToken(session.user.id, pushToken);
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
      profile: SKIP_AUTH
        ? ({
            ...DEMO_PROFILE,
            driver_profiles: {
              ...(DEMO_PROFILE.driver_profiles as object),
              is_online: demoOnline,
            },
          } as Profile)
        : profile,
      loading,
      isDemo: SKIP_AUTH,
      signIn,
      signOut,
      refreshProfile,
      setDemoOnline,
    }),
    [session, profile, loading, signIn, signOut, refreshProfile, demoOnline],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth outside AuthProvider");
  return ctx;
}
