import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { chatTouristasAssistant } from "@/functions/assistant";
import { starterChips } from "@/lib/touristas-ai/prompts";
import {
  buildPageContext,
  stripEmDashes,
  type AssistantResponse,
  type QuoteCard,
  type TouristasPageContext,
} from "@/lib/touristas-ai/types";
import { getDict, useLocale } from "@/i18n";

export type UiMessage = {
  role: "user" | "assistant";
  content: string;
  quotes?: QuoteCard[];
  bookPath?: string;
  followUps?: string[];
  tripSummary?: AssistantResponse["tripSummary"];
  dispatch?: AssistantResponse["dispatch"];
  policy?: boolean;
};

export function withSearchParam(path: string, key: string, value: string): string {
  const hashIdx = path.indexOf("#");
  const hash = hashIdx >= 0 ? path.slice(hashIdx) : "";
  const withoutHash = hashIdx >= 0 ? path.slice(0, hashIdx) : path;
  const qIdx = withoutHash.indexOf("?");
  const base = qIdx >= 0 ? withoutHash.slice(0, qIdx) : withoutHash;
  const query = qIdx >= 0 ? withoutHash.slice(qIdx + 1) : "";
  const params = new URLSearchParams(query);
  params.set(key, value);
  const qs = params.toString();
  return `${base}${qs ? `?${qs}` : ""}${hash}`;
}

export function identityLine(
  ctx: TouristasPageContext,
  t: ReturnType<typeof getDict>["touristasAi"],
) {
  switch (ctx.pageType) {
    case "airport":
      return t.identityAirport.replace("{place}", ctx.entityLabel ?? "airport");
    case "city":
      return t.identityCity.replace("{place}", ctx.entityLabel ?? "city");
    case "corridor":
      return t.identityCorridor
        .replace("{from}", ctx.entityLabel ?? "pickup")
        .replace("{to}", ctx.secondaryLabel ?? "drop-off");
    case "country":
      return t.identityCountry.replace("{market}", ctx.entityLabel ?? ctx.market ?? "Market");
    case "routes":
      return t.identityRoutes.replace("{place}", ctx.entityLabel ?? "this route");
    case "book":
      return t.identityBook;
    case "home":
      return t.identityHome;
    default:
      return t.identityDefault;
  }
}

export function welcomeForContext(
  t: ReturnType<typeof getDict>["touristasAi"],
  ctx: TouristasPageContext,
): string {
  const place = ctx.entityLabel ?? "this place";
  switch (ctx.pageType) {
    case "airport":
      return t.welcomeAirport.replace("{place}", place);
    case "city":
      return t.welcomeCity.replace("{place}", place);
    case "corridor":
      return t.welcomeCorridor
        .replace("{from}", ctx.entityLabel ?? place)
        .replace("{to}", ctx.secondaryLabel ?? "destination");
    case "country":
      return t.welcomeCountry.replace("{market}", ctx.entityLabel ?? ctx.market ?? "this market");
    case "routes":
      return t.welcomeRoutes.replace("{place}", place);
    case "book":
      return t.welcomeBook;
    default:
      return t.welcome;
  }
}

function looksLikePolicy(text: string) {
  return /cancel|refund|waiting|no-?show|policy|make-good/i.test(text);
}

export function useTouristasChat() {
  const locale = useLocale();
  const t = getDict(locale).touristasAi;
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const pageContext = useMemo(() => buildPageContext(pathname, locale), [pathname, locale]);
  const chips = useMemo(
    () => starterChips(pageContext.pageType, pageContext.entityLabel, pageContext),
    [pageContext],
  );
  const welcomeText = useMemo(() => welcomeForContext(t, pageContext), [t, pageContext]);
  const identity = useMemo(() => identityLine(pageContext, t), [pageContext, t]);

  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [listening, setListening] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  const resetChat = useCallback(() => {
    setInput("");
    setMessages([
      {
        role: "assistant",
        content: stripEmDashes(welcomeText),
        followUps: chips.slice(0, 3),
      },
    ]);
  }, [welcomeText, chips]);

  useEffect(() => {
    resetChat();
  }, [resetChat, pageContext.pageType, pageContext.entitySlug, pageContext.secondarySlug, locale]);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const send = useCallback(
    async (textOverride?: string) => {
      const text = (textOverride ?? input).trim();
      if (!text || busy) return;
      setInput("");
      const nextUser: UiMessage = { role: "user", content: text };
      const history = [...messages, nextUser];
      setMessages(history);
      setBusy(true);
      try {
        const result = await chatTouristasAssistant({
          data: {
            messages: history.map((m) => ({ role: m.role, content: m.content })),
            locale,
            pageContext,
          },
        });
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: stripEmDashes(result.reply),
            quotes: result.quotes,
            bookPath: result.bookPath,
            followUps: result.followUps?.map(stripEmDashes),
            tripSummary: result.tripSummary,
            dispatch: result.dispatch,
            policy: !result.quotes?.length && !result.dispatch && looksLikePolicy(result.reply),
          },
        ]);
      } catch {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: stripEmDashes(t.error),
            followUps: chips.slice(0, 2),
          },
        ]);
      } finally {
        setBusy(false);
      }
    },
    [input, busy, messages, locale, pageContext, t.error, chips],
  );

  const updateDispatchMessage = useCallback(
    (messageIndex: number, next: NonNullable<UiMessage["dispatch"]>, assistantLine?: string) => {
      setMessages((prev) => {
        const copy = [...prev];
        const target = copy[messageIndex];
        if (!target || target.role !== "assistant") return prev;
        copy[messageIndex] = { ...target, dispatch: next };
        if (
          assistantLine &&
          (next.status === "claimed" || next.status === "en_route" || next.status === "expired")
        ) {
          const already = copy.some(
            (m, i) => i > messageIndex && m.role === "assistant" && m.content === assistantLine,
          );
          if (!already) {
            copy.push({
              role: "assistant",
              content: stripEmDashes(assistantLine),
              followUps:
                next.status === "expired"
                  ? ["HER to Elounda tomorrow 3pm", "What is free waiting?"]
                  : ["Any update?", "Open my bookings"],
            });
          }
        }
        return copy;
      });
    },
    [],
  );

  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    const speechWindow = window as unknown as {
      SpeechRecognition?: unknown;
      webkitSpeechRecognition?: unknown;
    };
    setSpeechSupported(
      Boolean(speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition),
    );
  }, []);

  const toggleVoice = useCallback(() => {
    if (!speechSupported || busy) return;
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionLike;
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) return;

    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    const recognition = new Ctor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang =
      locale === "el"
        ? "el-GR"
        : locale === "de"
          ? "de-DE"
          : locale === "fr"
            ? "fr-FR"
            : locale === "it"
              ? "it-IT"
              : locale === "es"
                ? "es-ES"
                : locale === "nl"
                  ? "nl-NL"
                  : "en-US";
    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0]?.transcript ?? "";
      }
      if (transcript) setInput(transcript.trim());
      if (event.results[event.results.length - 1]?.isFinal) {
        setListening(false);
      }
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }, [speechSupported, busy, listening, locale]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  return {
    t,
    locale,
    pageContext,
    chips,
    identity,
    messages,
    input,
    setInput,
    busy,
    listening,
    speechSupported,
    scrollerRef,
    resetChat,
    send,
    toggleVoice,
    updateDispatchMessage,
  };
}

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult:
    | ((event: {
        resultIndex: number;
        results: {
          length: number;
          [i: number]: { isFinal: boolean; [j: number]: { transcript: string } };
        };
      }) => void)
    | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};
