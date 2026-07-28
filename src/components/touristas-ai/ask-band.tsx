import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { starterChips } from "@/lib/touristas-ai/prompts";
import type { TouristasPageType } from "@/lib/touristas-ai/types";
import { getDict, useLocale } from "@/i18n";
import { cn } from "@/lib/utils";
import { useTouristasAiOptional, dispatchTouristasOpen } from "./provider";

export function AskTouristasBand({
  pageType,
  entityLabel,
  entitySlug,
  secondaryLabel,
  market,
  chips: chipsProp,
  className,
}: {
  pageType: TouristasPageType;
  entityLabel?: string;
  entitySlug?: string;
  secondaryLabel?: string;
  market?: "greece" | "spain" | "italy" | "portugal" | "cyprus" | "turkey";
  chips?: string[];
  className?: string;
}) {
  const locale = useLocale();
  const t = getDict(locale).touristasAi;
  const api = useTouristasAiOptional();
  const chips =
    chipsProp ??
    starterChips(pageType, entityLabel, {
      locale,
      path: "",
      pageType,
      entityLabel,
      entitySlug,
      secondaryLabel,
      market:
        market ??
        (entitySlug as "greece" | "spain" | "italy" | "portugal" | "cyprus" | "turkey" | undefined),
    });

  const open = (prompt?: string, autoSend = false) => {
    if (api) api.openTouristas({ prompt, autoSend, source: "ask-band" });
    else dispatchTouristasOpen({ prompt, autoSend, source: "ask-band" });
  };

  const headline =
    pageType === "airport"
      ? t.askBandTitleAirport.replace("{place}", entityLabel ?? "this airport")
      : pageType === "city"
        ? t.askBandTitleCity.replace("{place}", entityLabel ?? "this city")
        : pageType === "corridor"
          ? t.askBandTitleCorridor
              .replace("{from}", entityLabel ?? "pickup")
              .replace("{to}", secondaryLabel ?? "drop-off")
          : pageType === "country"
            ? t.askBandTitleCountry.replace("{market}", entityLabel ?? "this market")
            : pageType === "routes"
              ? t.askBandTitleRoutes.replace("{place}", entityLabel ?? "this route")
              : t.askBandTitle;

  const body =
    pageType === "airport" || pageType === "city" || pageType === "corridor"
      ? t.askBandBodyPlace.replace("{place}", entityLabel ?? secondaryLabel ?? "your trip")
      : t.askBandBody;

  return (
    <section
      className={cn(
        "relative overflow-hidden border-y border-border/60 bg-primary text-primary-foreground",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(20,184,166,0.28),transparent_55%),radial-gradient(ellipse_at_right,rgba(255,255,255,0.08),transparent_45%)]" />
      <div className="relative mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              {t.poweredBy}
            </p>
            <h2 className="mt-3 font-display text-3xl leading-tight md:text-4xl">{headline}</h2>
            <p className="mt-3 max-w-xl text-base text-primary-foreground/75 md:text-lg">
              <span className="font-accent text-[1.05em] text-accent/95">{t.title}.</span> {body}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => open(undefined, false)}
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground shadow-lg shadow-accent/20 transition hover:opacity-95"
              >
                {t.askBandCta}
                <ArrowUpRight className="h-4 w-4" />
              </button>
              <Link
                to="/{-$locale}/touristas-ai"
                className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/25 px-5 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-foreground/10"
              >
                {t.openFullPage}
              </Link>
            </div>
          </div>
          <div className="flex max-w-xl flex-wrap gap-2 lg:justify-end">
            {chips.slice(0, 4).map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => open(chip, true)}
                className="rounded-full border border-primary-foreground/20 bg-primary-foreground/5 px-4 py-2 text-left text-xs font-medium text-primary-foreground/90 transition hover:border-accent hover:bg-accent/15 md:text-sm"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
