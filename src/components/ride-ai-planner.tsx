import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  ArrowUpRight,
  Check,
  Loader2,
  LocateFixed,
  MapPin,
  RotateCcw,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { localePath, useLocale } from "@/i18n";
import type { PlaceResult } from "@/lib/place-search";
import type { RideAIResult, RideMessage } from "@/lib/ride-ai";

export function RideAIPlanner({
  initialPrompt,
  onClose,
}: {
  initialPrompt?: string | null;
  onClose?: () => void;
}) {
  const locale = useLocale();
  const greek = locale === "el";
  const { session } = useAuth();
  const [input, setInput] = useState(initialPrompt || "");
  const [messages, setMessages] = useState<RideMessage[]>([]);
  const [result, setResult] = useState<RideAIResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [gps, setGPS] = useState<PlaceResult | null>(null);
  const [gpsBusy, setGPSBusy] = useState(false);
  const [chosen, setChosen] = useState<{
    selectedFrom?: PlaceResult;
    selectedTo?: PlaceResult;
    selectedFromQuery?: string;
    selectedToQuery?: string;
  }>({});
  const latest = useRef<HTMLDivElement>(null);
  const inFlight = useRef(false);
  useEffect(() => {
    if (initialPrompt) setInput(initialPrompt);
  }, [initialPrompt]);
  useEffect(() => {
    latest.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "end",
    });
  }, [result, busy]);
  async function request(history: RideMessage[], choices = chosen, selection = false) {
    if (inFlight.current || !session || !consent) return;
    inFlight.current = true;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/ride-ai", {
        method: "POST",
        signal: AbortSignal.timeout(45000),
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          messages: history,
          locale,
          ...choices,
          ...(selection && result ? { mode: "selection", intent: result.intent } : {}),
          ...(gps ? { gps } : {}),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Please try again.");
      const next = data as RideAIResult;
      setResult(next);
      if (history.at(-1)?.role === "user")
        setMessages([
          ...history,
          { role: "assistant", content: next.reply + " " + next.questions.join(" ") },
        ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn’t plan this transfer. Please try again.");
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }
  function send() {
    const text = input.trim();
    if (!text || busy || !session || !consent) return;
    if (messages.filter((m) => m.role === "user").length >= 5) {
      setError("Start a new plan to continue, or use the booking form.");
      return;
    }
    const history = [...messages, { role: "user" as const, content: text }];
    setMessages(history);
    setInput("");
    void request(history);
  }
  function choose(place: PlaceResult, pickup: boolean) {
    const next = {
      ...chosen,
      ...(pickup
        ? { selectedFrom: place, selectedFromQuery: result?.intent.pickupQuery ?? undefined }
        : { selectedTo: place, selectedToQuery: result?.intent.destinationQuery ?? undefined }),
    };
    setChosen(next);
    void request(messages, next, true);
  }
  function locate() {
    if (!navigator.geolocation) {
      setError("GPS isn’t available. Enter your pickup address.");
      return;
    }
    setGPSBusy(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setGPS({
          id: "gps",
          kind: "address",
          label: greek ? "Η τοποθεσία μου" : "My location",
          lat: p.coords.latitude,
          lng: p.coords.longitude,
        });
        setInput((v) => v || "Pick me up at my current location. ");
        setGPSBusy(false);
      },
      () => {
        setError(
          greek
            ? "Δεν δόθηκε πρόσβαση GPS. Γράψε τη διεύθυνση παραλαβής."
            : "GPS permission wasn’t granted. Enter your pickup address.",
        );
        setGPSBusy(false);
      },
      { enableHighAccuracy: true, maximumAge: 15000, timeout: 12000 },
    );
  }
  const proposal = result?.recommendation;
  return (
    <div className="flex h-full min-h-0 flex-col bg-white text-[#101114]">
      <header className="flex shrink-0 items-center justify-between border-b border-black/5 px-6 py-5">
        <div className="flex items-center gap-3">
          <img
            src="/brand/rider-icon-v3.png"
            width="40"
            height="40"
            alt="TransferAround"
            className="rounded-xl"
          />
          <div>
            <h2 className="font-display text-lg font-bold">Ride with AI</h2>
            <p className="text-xs text-muted-foreground">Powered by Claude</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setMessages([]);
              setResult(null);
              setChosen({});
              setError(null);
              setInput("");
            }}
            aria-label="Start a new plan"
            className="rounded-full p-3 hover:bg-black/5"
          >
            <RotateCcw size={17} />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Ride with AI"
              className="rounded-full p-3 hover:bg-black/5"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </header>
      <div
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-7"
        aria-live="polite"
        aria-busy={busy}
      >
        <div className="mx-auto max-w-xl space-y-6">
          {!messages.length && (
            <>
              <p className="font-display text-4xl font-bold leading-[1.08] tracking-tight">
                {greek ? "Τα σχέδιά σου." : "Your plans."}
                <br />
                <span className="text-[#245BEB]">
                  {greek ? "Η επόμενή μας κίνηση." : "Our next move."}
                </span>
              </p>
              <p className="max-w-md text-muted-foreground">
                {greek
                  ? "Πες μας πού φτάνεις, πότε και με ποια παρέα. Θα βρούμε τη μεταφορά που ταιριάζει."
                  : "Tell us where you’re landing, when, and who’s coming. We’ll help find the transfer that fits."}
              </p>
              <button
                type="button"
                onClick={() =>
                  setInput(
                    "Tomorrow I’m landing at Heraklion Airport (HER) at 5pm, flight A3306. Two people, two suitcases, to GDM Megaron hotel in Heraklion.",
                  )
                }
                className="w-full rounded-3xl bg-[#F3F5F9] p-5 text-left text-sm leading-relaxed"
              >
                “Landing in Heraklion tomorrow. Two people, two bags, straight to our hotel.”
                <span className="mt-3 flex items-center gap-2 text-xs font-semibold text-[#245BEB]">
                  {greek ? "Δοκίμασε ένα παράδειγμα" : "Try an example"}
                  <ArrowUpRight size={14} />
                </span>
              </button>
            </>
          )}
          {messages
            .filter((m) => m.role === "user")
            .map((m, i) => (
              <p
                key={i}
                className="ml-8 rounded-3xl rounded-br-lg bg-[#EEF3FF] p-5 text-sm leading-relaxed"
              >
                {m.content}
              </p>
            ))}
          {result && (
            <>
              <p className="leading-relaxed">{result.reply}</p>
              {result.questions.length > 0 && (
                <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  {result.questions.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              )}
              {[
                {
                  items: result.pickupOptions,
                  title: greek ? "Επιβεβαίωσε παραλαβή" : "Confirm your pickup",
                  pickup: true,
                },
                {
                  items: result.destinationOptions,
                  title: greek ? "Επιβεβαίωσε προορισμό" : "Confirm your destination",
                  pickup: false,
                },
              ].map(
                (group) =>
                  group.items.length > 0 && (
                    <div key={group.title} className="space-y-2">
                      <h3 className="text-sm font-semibold">{group.title}</h3>
                      {group.items.map((place) => (
                        <button
                          type="button"
                          key={place.id}
                          disabled={busy}
                          onClick={() => choose(place, group.pickup)}
                          className="flex w-full items-center gap-3 rounded-2xl border border-black/10 p-4 text-left text-sm transition hover:border-[#245BEB] disabled:opacity-50"
                        >
                          <MapPin className="shrink-0 text-[#245BEB]" size={18} />
                          <span>{place.label}</span>
                          <ArrowUpRight size={16} className="ml-auto shrink-0" />
                        </button>
                      ))}
                    </div>
                  ),
              )}
            </>
          )}
          {proposal && result && (
            <article className="overflow-hidden rounded-3xl border border-[#245BEB]/20 bg-white shadow-[0_12px_40px_-20px_rgba(36,91,235,0.25)]">
              <div className="space-y-5 p-6">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#245BEB]">
                  <Check size={15} />
                  {greek ? "Η πρότασή σου" : "Your transfer proposal"}
                </p>
                <div className="space-y-3 border-l-2 border-[#245BEB]/25 pl-4 text-sm font-medium">
                  <p>{result.from?.label}</p>
                  <p>{result.to?.label}</p>
                </div>
                <div className="flex items-center gap-4">
                  <img
                    src={`/fleet/${proposal.vehicleClass}.jpg`}
                    alt=""
                    width="132"
                    height="80"
                    className="h-20 w-32 object-contain"
                  />
                  <div>
                    <h3 className="font-display text-xl font-bold">{proposal.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {result.intent.passengers} travelers · {result.intent.bags} bags
                    </p>
                  </div>
                  <strong className="ml-auto text-xl">
                    {new Intl.NumberFormat(locale, {
                      style: "currency",
                      currency: "EUR",
                      maximumFractionDigits: 0,
                    }).format(proposal.priceCents / 100)}
                  </strong>
                </div>
                <p className="text-sm">
                  {new Intl.DateTimeFormat(locale, {
                    timeZone: proposal.timeZone,
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(proposal.pickupAt))}{" "}
                  · {proposal.timeZone}
                </p>
                <p className="text-sm text-muted-foreground">
                  {proposal.distanceKm?.toFixed(1)} km · ~{Math.ceil(proposal.durationMin || 0)} min
                  {proposal.routeSource === "estimated" ? " · estimated route" : " · road route"}
                </p>
                {result.intent.flightNumber && (
                  <p className="text-xs text-muted-foreground">
                    Flight {result.intent.flightNumber} · details provided by you, not verified
                  </p>
                )}
                <a
                  href={proposal.bookPath}
                  className="flex min-h-14 items-center justify-between rounded-2xl bg-[#245BEB] px-5 font-semibold text-white"
                >
                  {greek ? "Έλεγξε τη μεταφορά" : "Review this transfer"}
                  <ArrowUpRight size={19} />
                </a>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {greek
                    ? "Έλεγξε τη διαδρομή και τα στοιχεία πριν πληρώσεις. Η κράτηση θα σταλεί σε οδηγούς μετά την επιβεβαίωση της πληρωμής."
                    : "Review the route and details before paying. The transfer is sent to drivers after payment is confirmed."}
                </p>
              </div>
            </article>
          )}
          {busy && (
            <p className="flex items-center gap-3 text-sm text-muted-foreground">
              <Loader2 size={18} className="animate-spin motion-reduce:animate-none" />
              {greek ? "Ετοιμάζουμε τη διαδρομή σου…" : "Putting your journey together…"}
            </p>
          )}
          {error && (
            <p role="alert" className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
              {error}
            </p>
          )}
          <div ref={latest} />
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="shrink-0 space-y-3 border-t border-black/5 px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4"
      >
        {!session && (
          <a
            href={`${localePath(locale, "/login")}?redirect=${encodeURIComponent(localePath(locale, "/touristas-ai"))}`}
            className="block rounded-xl bg-[#EEF3FF] p-3 text-sm font-semibold text-[#245BEB]"
          >
            {greek ? "Συνδέσου για Ride with AI" : "Sign in to use Ride with AI"}
            <ArrowUpRight className="ml-2 inline" size={15} />
          </a>
        )}
        {!consent && (
          <label className="flex items-start gap-3 text-xs leading-relaxed text-muted-foreground">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 accent-[#245BEB]"
            />
            {greek
              ? "Συμφωνώ να σταλούν τα μηνύματα του ταξιδιού μου στην Anthropic. Οι συντεταγμένες GPS χρησιμοποιούνται από χάρτες και κράτηση και δεν στέλνονται στο Claude."
              : "Send my trip messages to Anthropic. GPS coordinates are used by maps and booking and aren’t sent to Claude."}
          </label>
        )}
        <div className="flex items-end gap-3 rounded-3xl bg-[#F3F5F9] p-2">
          <textarea
            aria-label={greek ? "Τα σχέδιά σου" : "Your travel plans"}
            rows={2}
            maxLength={2400}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={greek ? "Πες μας τα σχέδιά σου…" : "Tell us your plans…"}
            className="max-h-32 min-h-16 flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[#245BEB]"
          />
          <button
            type="submit"
            disabled={busy || !input.trim() || !session || !consent}
            aria-label={greek ? "Σχεδίασε τη μεταφορά" : "Plan my transfer"}
            className="grid size-12 shrink-0 place-items-center rounded-full bg-[#245BEB] text-white disabled:opacity-35"
          >
            <ArrowUp size={21} />
          </button>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <button
            type="button"
            onClick={locate}
            disabled={gpsBusy || busy}
            className="flex items-center gap-2 font-medium text-[#245BEB]"
          >
            <LocateFixed size={14} />
            {gpsBusy
              ? "Locating…"
              : gps
                ? "GPS pickup added"
                : greek
                  ? "Χρήση GPS"
                  : "Add GPS pickup"}
          </button>
          <span>{greek ? "Η πληρωμή γίνεται ξεχωριστά" : "You review before paying"}</span>
        </div>
      </form>
    </div>
  );
}
