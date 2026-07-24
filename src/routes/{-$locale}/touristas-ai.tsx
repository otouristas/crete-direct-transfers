import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { TouristasChatShell } from "@/components/touristas-ai/chat-shell";
import { useTouristasChat } from "@/components/touristas-ai/use-touristas-chat";
import { buildHead } from "@/lib/seo";
import { getDict, type Locale } from "@/i18n";

export const Route = createFileRoute("/{-$locale}/touristas-ai")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale).touristasAi;
    return buildHead({
      locale,
      path: "/touristas-ai",
      title: t.fullPageMetaTitle,
      description: t.fullPageMetaDescription,
    });
  },
  component: TouristasAiPage,
});

function TouristasAiPage() {
  const chat = useTouristasChat();
  const t = chat.t;
  const search = useRouterState({ select: (s) => s.location.searchStr });
  const handled = useRef<string | null>(null);

  useEffect(() => {
    const raw = search.startsWith("?") ? search.slice(1) : search;
    const params = new URLSearchParams(raw);
    const prompt = params.get("prompt");
    const autosend = params.get("autosend") === "1" || params.get("autoSend") === "1";
    if (!prompt?.trim()) return;
    const key = `${search}`;
    if (handled.current === key) return;
    handled.current = key;
    if (autosend) void chat.send(prompt.trim());
    else chat.setInput(prompt.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div className="bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.08),transparent_50%)]">
      <section className="border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto max-w-3xl px-6 py-10 md:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{t.poweredBy}</p>
          <h1 className="mt-3 font-accent text-4xl md:text-5xl">{t.fullPageTitle}</h1>
          <p className="mt-3 max-w-xl text-primary-foreground/80">{t.fullPageSubtitle}</p>
          <p className="mt-4 font-display text-sm font-semibold text-accent">{chat.identity}</p>
        </div>
      </section>
      <TouristasChatShell chat={chat} variant="page" />
    </div>
  );
}
