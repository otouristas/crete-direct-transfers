import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Eraser,
  ExternalLink,
  Loader2,
  Mic,
  MicOff,
  Shield,
  Sparkles,
  X,
} from "lucide-react";
import { formatEur } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { localePath } from "@/i18n";
import { DispatchLiveCard } from "./dispatch-card";
import { withSearchParam, type useTouristasChat } from "./use-touristas-chat";

type ChatApi = ReturnType<typeof useTouristasChat>;

export function TouristasChatShell({
  chat,
  variant,
  onClose,
  className,
}: {
  chat: ChatApi;
  variant: "panel" | "page";
  onClose?: () => void;
  className?: string;
}) {
  const {
    t,
    locale,
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
  } = chat;

  const fullPageHref = localePath(locale, "/touristas-ai");
  const TitleTag = variant === "page" ? "h1" : "p";

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden text-foreground",
        variant === "panel" &&
          "h-full w-full border-0 bg-[color-mix(in_oklab,var(--color-card)_88%,transparent)] shadow-2xl backdrop-blur-2xl md:h-[min(760px,88vh)] md:w-[min(520px,calc(100vw-2rem))] md:rounded-[1.75rem] md:border md:border-border/80",
        variant === "page" && "min-h-[calc(100vh-4rem)] rounded-none bg-background",
        className,
      )}
      style={variant === "panel" ? { paddingBottom: "env(safe-area-inset-bottom)" } : undefined}
    >
      <header
        className={cn(
          "relative shrink-0 overflow-hidden border-b border-border/60 bg-primary text-primary-foreground",
          variant === "panel" && "md:rounded-t-[1.75rem]",
          variant === "page" && "px-0",
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.35),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.1),transparent_50%)]" />
        <div
          className={cn(
            "relative flex items-start justify-between gap-3 px-5 pb-5 pt-[max(1rem,env(safe-area-inset-top))] md:pt-6",
            variant === "page" && "mx-auto max-w-3xl px-6",
          )}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-[0_0_0_4px_rgba(20,184,166,0.25)]">
                <Sparkles className="h-5 w-5" />
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-highlight ring-2 ring-primary" />
              </span>
              <div>
                <TitleTag className="font-accent text-xl leading-none tracking-tight md:text-2xl">
                  {t.title}
                </TitleTag>
                <p className="mt-1 text-xs text-primary-foreground/70">{t.subtitle}</p>
              </div>
            </div>
            <p className="mt-4 font-display text-sm font-semibold tracking-tight text-accent md:text-base">
              {identity}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              onClick={resetChat}
              disabled={busy}
              className="rounded-xl p-2 transition hover:bg-primary-foreground/10 disabled:opacity-40"
              aria-label={t.clearChat}
              title={t.clearChat}
            >
              <Eraser className="h-5 w-5" />
            </button>
            {variant === "panel" && (
              <>
                <Link
                  to="/{-$locale}/touristas-ai"
                  className="rounded-xl p-2 transition hover:bg-primary-foreground/10"
                  aria-label={t.openFullPage}
                  title={t.openFullPage}
                  onClick={onClose}
                >
                  <ExternalLink className="h-5 w-5" />
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl p-2 transition hover:bg-primary-foreground/10"
                  aria-label={t.close}
                >
                  <X className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <div
        ref={scrollerRef}
        className={cn(
          "flex-1 space-y-4 overflow-y-auto px-4 py-5 md:px-5",
          variant === "page" && "mx-auto w-full max-w-3xl px-6",
        )}
      >
        {messages.map((m, i) => (
          <div
            key={`${m.role}-${i}`}
            className="animate-in fade-in slide-in-from-bottom-2 space-y-3 duration-300"
          >
            <div
              className={cn(
                "max-w-[92%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed md:text-[15px]",
                m.role === "user"
                  ? "ml-auto bg-accent text-accent-foreground shadow-sm"
                  : "bg-muted/80 text-foreground ring-1 ring-border/50",
              )}
            >
              {m.content}
            </div>

            {m.policy && (
              <div className="flex gap-3 rounded-2xl border border-accent/30 bg-accent/5 px-4 py-3 text-sm">
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-accent-deep" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-deep">
                    {t.policyCardTitle}
                  </p>
                  <p className="mt-1 text-muted-foreground">{t.policyCardBody}</p>
                </div>
              </div>
            )}

            {m.tripSummary && (
              <div className="rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {t.tripSummary}
                </p>
                <p className="mt-1 font-display text-lg text-primary">
                  {m.tripSummary.from}
                  <span className="mx-2 font-accent text-accent">→</span>
                  {m.tripSummary.to}
                </p>
                <p className="mt-0.5 text-muted-foreground">
                  {[m.tripSummary.when, m.tripSummary.pax ? `${m.tripSummary.pax} pax` : null]
                    .filter(Boolean)
                    .join(" · ") || t.tripSummaryFallback}
                </p>
              </div>
            )}

            {m.dispatch && (
              <DispatchLiveCard
                initial={m.dispatch}
                locale={locale}
                labels={{
                  searching: t.dispatchSearching,
                  claimed: t.dispatchClaimed,
                  enRoute: t.dispatchEnRoute,
                  expired: t.dispatchExpired,
                  failed: t.dispatchFailed,
                  cancelled: t.dispatchCancelled,
                  eta: t.dispatchEta,
                  viewBooking: t.dispatchViewBooking,
                  supportHint: t.dispatchSupport,
                  price: t.dispatchPrice,
                }}
                onStatusChange={(next, line) => updateDispatchMessage(i, next, line)}
              />
            )}

            {m.quotes && m.quotes.length > 0 && (
              <div className="grid gap-2">
                {m.quotes.slice(0, 6).map((q) => (
                  <a
                    key={q.id}
                    href={m.bookPath ? withSearchParam(m.bookPath, "class", q.id) : undefined}
                    className={cn(
                      "group flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm transition",
                      m.bookPath && "hover:border-accent hover:shadow-md",
                    )}
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-primary">{q.label}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {q.capacity} · {q.bags}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="font-display text-lg text-primary">
                        {formatEur(q.totalEur)}
                      </span>
                      {m.bookPath && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
                          {t.bookThis}
                          <ArrowUpRight className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            )}

            {m.bookPath && (!m.quotes || m.quotes.length === 0) && (
              <a
                href={m.bookPath}
                className="inline-flex items-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground shadow-sm"
              >
                {t.continueBook}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}

            {m.followUps && m.followUps.length > 0 && i === messages.length - 1 && !busy && (
              <div className="flex flex-wrap gap-2">
                {m.followUps.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => void send(chip)}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-accent hover:bg-accent/10"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {busy && (
          <div className="inline-flex items-center gap-2 rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-accent" />
            {t.thinking}
          </div>
        )}

        {messages.length <= 1 && !busy && (
          <div className="flex flex-wrap gap-2 pt-1">
            {chips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => void send(chip)}
                className="rounded-full border border-border bg-background px-3 py-2 text-xs font-medium transition hover:border-accent hover:bg-accent/5"
              >
                {chip}
              </button>
            ))}
          </div>
        )}
      </div>

      <footer
        className={cn(
          "shrink-0 border-t border-border bg-card/95 px-4 py-3 md:px-5",
          variant === "page" && "sticky bottom-0",
        )}
      >
        <div className={cn(variant === "page" && "mx-auto max-w-3xl")}>
          <div className="flex gap-2">
            {speechSupported && (
              <button
                type="button"
                onClick={toggleVoice}
                disabled={busy}
                className={cn(
                  "inline-flex min-h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border transition",
                  listening
                    ? "border-accent bg-accent text-accent-foreground"
                    : "bg-background hover:border-accent",
                )}
                aria-label={listening ? t.voiceStop : t.voiceStart}
                title={listening ? t.voiceStop : t.voiceStart}
              >
                {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
            )}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && void send()}
              placeholder={t.placeholder}
              className="min-h-12 flex-1 rounded-2xl border border-border bg-background px-4 text-sm outline-none ring-accent focus:ring-2"
              disabled={busy}
            />
            <button
              type="button"
              onClick={() => void send()}
              disabled={busy || !input.trim()}
              className="min-h-12 rounded-2xl bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              {t.send}
            </button>
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] leading-snug text-muted-foreground">{t.disclaimer}</p>
            {variant === "panel" && (
              <a
                href={fullPageHref}
                className="text-[11px] font-semibold text-accent-deep hover:underline"
                onClick={onClose}
              >
                {t.openFullPage}
              </a>
            )}
          </div>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-deep">
            {t.poweredBy}
          </p>
        </div>
      </footer>
    </div>
  );
}
