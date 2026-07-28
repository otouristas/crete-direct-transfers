import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { TouristasChatShell } from "./chat-shell";
import { useTouristasAi } from "./provider";
import { useTouristasChat } from "./use-touristas-chat";
import { getDict, useLocale } from "@/i18n";

function launcherSecondaryForContext(
  t: ReturnType<typeof getDict>["touristasAi"],
  pageType: string,
  entityLabel?: string,
  secondaryLabel?: string,
  market?: string,
) {
  switch (pageType) {
    case "airport":
      return t.launcherFrom.replace("{place}", entityLabel ?? "airport");
    case "city":
      return t.launcherTo.replace("{place}", entityLabel ?? "city");
    case "corridor":
      return t.launcherCorridor
        .replace("{from}", entityLabel ?? "pickup")
        .replace("{to}", secondaryLabel ?? "drop-off");
    case "country":
      return t.launcherMarket.replace("{market}", entityLabel ?? market ?? "Market");
    case "routes":
      return entityLabel && entityLabel !== "Routes"
        ? t.launcherCorridor
            .replace("{from}", entityLabel.split(" to ")[0] ?? entityLabel)
            .replace("{to}", secondaryLabel ?? entityLabel.split(" to ")[1] ?? "")
        : t.launcherRoutes;
    case "book":
      return t.launcherBook;
    default:
      return t.launcherSecondary;
  }
}

export function TouristasAiPanel({ className }: { className?: string }) {
  const locale = useLocale();
  const t = getDict(locale).touristasAi;
  const { isOpen, openTouristas, closeTouristas, pendingPrompt, consumePendingPrompt } =
    useTouristasAi();
  const chat = useTouristasChat();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const handledPrompt = useRef<string | null>(null);

  const fabSecondary = launcherSecondaryForContext(
    t,
    chat.pageContext.pageType,
    chat.pageContext.entityLabel,
    chat.pageContext.secondaryLabel,
    chat.pageContext.market,
  );

  useEffect(() => {
    if (!isOpen || !pendingPrompt) return;
    if (handledPrompt.current === pendingPrompt) return;
    const pending = consumePendingPrompt();
    if (!pending) return;
    handledPrompt.current = pending.prompt;
    if (pending.autoSend) void chat.send(pending.prompt);
    else chat.setInput(pending.prompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, pendingPrompt, consumePendingPrompt]);

  // Hide FAB chrome on dedicated full-page chat route
  if (/\/touristas-ai\/?$/.test(pathname.replace(/^\/(el|de|fr|it|nl|es)(?=\/|$)/, "") || "/")) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed z-[60]",
        isOpen ? "inset-0 md:inset-auto md:bottom-6 md:right-6" : "bottom-5 right-5",
        className,
      )}
    >
      {isOpen ? (
        <div className="h-full animate-in fade-in zoom-in-95 duration-200 md:h-auto">
          <TouristasChatShell chat={chat} variant="panel" onClose={closeTouristas} />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => openTouristas()}
          className={cn(
            "group relative inline-flex max-w-[min(100vw-2.5rem,22rem)] items-center gap-3 rounded-full bg-primary px-5 py-3.5 text-primary-foreground shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45)] transition",
            "hover:scale-[1.02] hover:opacity-95 active:scale-[0.99]",
            "md:px-6 md:py-4",
          )}
        >
          <span className="absolute -inset-1 -z-10 animate-pulse rounded-full bg-accent/30 blur-md" />
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground ring-4 ring-accent/25 md:h-11 md:w-11">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="min-w-0 text-left">
            <span className="block text-sm font-semibold md:text-base">{t.launcherPrimary}</span>
            <span className="block truncate text-xs text-primary-foreground/75 md:text-sm">
              {fabSecondary}
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

/** @deprecated Prefer TouristasAiPanel */
export function BookingAssistant(props: { className?: string }) {
  return <TouristasAiPanel {...props} />;
}
