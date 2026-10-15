import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouterState } from "@tanstack/react-router";

export type TouristasOpenOptions = {
  prompt?: string;
  autoSend?: boolean;
  source?: string;
};

type TouristasAiContextValue = {
  isOpen: boolean;
  pendingPrompt: string | null;
  pendingAutoSend: boolean;
  openTouristas: (opts?: TouristasOpenOptions) => void;
  closeTouristas: () => void;
  consumePendingPrompt: () => { prompt: string; autoSend: boolean } | null;
};

const TouristasAiContext = createContext<TouristasAiContextValue | null>(null);

const EVENT_NAME = "touristas:open";

export function dispatchTouristasOpen(opts: TouristasOpenOptions = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: opts }));
}

export function TouristasAiProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const [pendingAutoSend, setPendingAutoSend] = useState(false);
  const search = useRouterState({ select: (s) => s.location.searchStr });
  const handledDeepLink = useRef<string | null>(null);

  const openTouristas = useCallback((opts: TouristasOpenOptions = {}) => {
    setIsOpen(true);
    if (opts.prompt?.trim()) {
      setPendingPrompt(opts.prompt.trim());
      setPendingAutoSend(Boolean(opts.autoSend));
    }
  }, []);

  const closeTouristas = useCallback(() => {
    setIsOpen(false);
  }, []);

  const consumePendingPrompt = useCallback(() => {
    if (!pendingPrompt) return null;
    const next = { prompt: pendingPrompt, autoSend: pendingAutoSend };
    setPendingPrompt(null);
    setPendingAutoSend(false);
    return next;
  }, [pendingPrompt, pendingAutoSend]);

  useEffect(() => {
    const onEvent = (e: Event) => {
      const detail = (e as CustomEvent<TouristasOpenOptions>).detail ?? {};
      openTouristas(detail);
    };
    window.addEventListener(EVENT_NAME, onEvent);
    return () => window.removeEventListener(EVENT_NAME, onEvent);
  }, [openTouristas]);

  useEffect(() => {
    const raw = search.startsWith("?") ? search.slice(1) : search;
    const params = new URLSearchParams(raw);
    const ai = params.get("ai") ?? params.get("touristas");
    const prompt = params.get("prompt") ?? undefined;
    const autosend = params.get("autosend") === "1" || params.get("autoSend") === "1";
    if (ai !== "1" && ai !== "true") return;
    const key = `${search}|${prompt ?? ""}|${autosend}`;
    if (handledDeepLink.current === key) return;
    handledDeepLink.current = key;
    openTouristas({ prompt, autoSend: Boolean(prompt) && autosend, source: "deeplink" });
  }, [search, openTouristas]);

  const value = useMemo(
    () => ({
      isOpen,
      pendingPrompt,
      pendingAutoSend,
      openTouristas,
      closeTouristas,
      consumePendingPrompt,
    }),
    [isOpen, pendingPrompt, pendingAutoSend, openTouristas, closeTouristas, consumePendingPrompt],
  );

  return <TouristasAiContext.Provider value={value}>{children}</TouristasAiContext.Provider>;
}

export function useTouristasAi() {
  const ctx = useContext(TouristasAiContext);
  if (!ctx) {
    throw new Error("useTouristasAi must be used within TouristasAiProvider");
  }
  return ctx;
}

/** Safe for CTAs that may render outside provider during SSR edge cases. */
export function useTouristasAiOptional() {
  return useContext(TouristasAiContext);
}
