import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  EMPTY_PRACTICE,
  runPractice,
  type PracticeAction,
  type PracticeState,
} from "../../../packages/mobile-shared/src/practice";

const STORAGE_KEY = "transferaround-practice-session";
export function usePractice() {
  const [state, setState] = useState<PracticeState>(EMPTY_PRACTICE);
  const [token, setToken] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tokenRef = useRef<string | null>(null);
  const generation = useRef(0);

  const connect = useCallback(async (fresh = false) => {
    const gen = ++generation.current;
    setBusy(true);
    setError(null);
    try {
      const url = new URL(window.location.href);
      const candidate = fresh
        ? null
        : url.searchParams.get("session") || localStorage.getItem(STORAGE_KEY);
      const saved = candidate && /^[a-f0-9]{48}$/.test(candidate) ? candidate : null;
      let result;
      try {
        result = await runPractice(supabase, saved, saved ? "read" : "create");
      } catch (e) {
        if (!saved) throw e;
        result = await runPractice(supabase, null, "create");
      }
      if (gen !== generation.current) return;
      const next = result.token || saved!;
      tokenRef.current = next;
      localStorage.setItem(STORAGE_KEY, next);
      setToken(next);
      setState(result.state);
      url.searchParams.set("session", next);
      window.history.replaceState(window.history.state, "", url);
    } catch (e) {
      if (gen === generation.current)
        setError(e instanceof Error ? e.message : "Could not connect.");
    } finally {
      if (gen === generation.current) setBusy(false);
    }
  }, []);

  useEffect(() => {
    void connect();
    return () => {
      ++generation.current;
    };
  }, [connect]);
  useEffect(() => {
    if (!token) return;
    let active = true;
    const poll = async () => {
      if (document.hidden) return;
      const gen = generation.current;
      try {
        const result = await runPractice(supabase, token, "read");
        if (active && gen === generation.current) {
          setState(result.state);
          setError(null);
        }
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : "Connection interrupted.");
      }
    };
    const timer = window.setInterval(poll, 2500);
    window.addEventListener("focus", poll);
    return () => {
      active = false;
      clearInterval(timer);
      window.removeEventListener("focus", poll);
    };
  }, [token]);

  const act = useCallback(
    async (action: PracticeAction, input?: { route?: string; vehicle?: string }) => {
      if (!tokenRef.current) return;
      ++generation.current;
      setBusy(true);
      setError(null);
      try {
        const result = await runPractice(supabase, tokenRef.current, action, input);
        setState(result.state);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Please try again.");
      } finally {
        setBusy(false);
      }
    },
    [],
  );
  return { state, token, busy, error, act, reconnect: connect };
}
