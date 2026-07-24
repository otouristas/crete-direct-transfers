import { Sparkles } from "lucide-react";
import { getDict, useLocale } from "@/i18n";
import { cn } from "@/lib/utils";
import { dispatchTouristasOpen, useTouristasAiOptional } from "./provider";

export function AskTouristasInline({
  prompt,
  autoSend = true,
  className,
  label,
}: {
  prompt?: string;
  autoSend?: boolean;
  className?: string;
  label?: string;
}) {
  const locale = useLocale();
  const t = getDict(locale).touristasAi;
  const api = useTouristasAiOptional();

  return (
    <button
      type="button"
      onClick={() => {
        const opts = { prompt, autoSend: Boolean(prompt) && autoSend, source: "ask-inline" };
        if (api) api.openTouristas(opts);
        else dispatchTouristasOpen(opts);
      }}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-primary-foreground/30 bg-primary-foreground/5 px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:border-accent hover:bg-accent/15",
        className,
      )}
    >
      <Sparkles className="h-4 w-4 text-accent" />
      {label ?? t.askInline}
    </button>
  );
}
