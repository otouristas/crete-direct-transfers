import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { liteFlightBook, liteGetSession } from "@/functions/liteapi";
import { buildHead } from "@/lib/seo";
import type { Locale } from "@/i18n";

type Search = {
  prebookId?: string;
  transactionId?: string;
  paid?: string;
};

export const Route = createFileRoute("/{-$locale}/flights/checkout")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    prebookId: typeof s.prebookId === "string" ? s.prebookId : undefined,
    transactionId: typeof s.transactionId === "string" ? s.transactionId : undefined,
    paid: typeof s.paid === "string" ? s.paid : undefined,
  }),
  head: ({ params }) => {
    const locale = (params.locale ?? "en") as Locale;
    return buildHead({
      locale,
      path: "/flights/checkout",
      title: "Flight checkout · TransferAround",
      description: "Complete your flight booking",
      noindex: true,
    });
  },
  component: FlightCheckoutPage,
});

declare global {
  interface Window {
    LiteAPIPayment?: new (cfg: Record<string, unknown>) => { handlePayment: () => void };
  }
}

function FlightCheckoutPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [secretKey, setSecretKey] = useState<string | null>(null);
  const [readyPay, setReadyPay] = useState(false);
  const payMounted = useRef(false);

  const stored = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("liteapi_flight_prebook") || "{}") as {
        prebookId?: string;
        transactionId?: string;
        secretKey?: string;
      };
    } catch {
      return {};
    }
  })();

  const prebookId = search.prebookId || stored.prebookId;
  const transactionId = search.transactionId || stored.transactionId;

  useEffect(() => {
    if (stored.secretKey) {
      setSecretKey(stored.secretKey);
      return;
    }
    if (!prebookId) return;
    void liteGetSession({ data: { prebookId } }).then((res) => {
      if (res.ok && res.data) {
        const sk = String((res.data as { secret_key?: string }).secret_key ?? "");
        if (sk) setSecretKey(sk);
      }
    });
  }, [prebookId, stored.secretKey]);

  useEffect(() => {
    if (!search.paid || !prebookId || !transactionId) return;
    setBusy(true);
    void liteFlightBook({ data: { prebookId, transactionId } })
      .then((res) => {
        if (!res.ok || !res.data) throw new Error(res.error || "Booking failed");
        const data = (Array.isArray(res.data) ? res.data[0] : res.data) as {
          bookingId?: string;
          bookingRef?: string;
        };
        sessionStorage.removeItem("liteapi_flight_prebook");
        navigate({
          to: "/{-$locale}/flights/confirmation/$bookingId",
          params: { bookingId: String(data.bookingId ?? data.bookingRef ?? "ok") },
        });
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Booking failed"))
      .finally(() => setBusy(false));
  }, [search.paid, prebookId, transactionId, navigate]);

  useEffect(() => {
    if (!readyPay || !secretKey || payMounted.current) return;
    payMounted.current = true;
    const script = document.createElement("script");
    script.src = "https://payment-wrapper.liteapi.travel/dist/liteAPIPayment.js?v=a1";
    script.async = true;
    script.onload = () => {
      const returnUrl = `${window.location.origin}${window.location.pathname}?prebookId=${encodeURIComponent(prebookId || "")}&transactionId=${encodeURIComponent(transactionId || "")}&paid=1`;
      const liteAPIPayment = new window.LiteAPIPayment!({
        publicKey: "sandbox",
        secretKey,
        returnUrl,
        targetElement: "#liteapi-pay",
        appearance: { theme: "flat" },
        options: { business: { name: "TransferAround" } },
      });
      liteAPIPayment.handlePayment();
    };
    document.body.appendChild(script);
  }, [readyPay, secretKey, prebookId, transactionId]);

  // Credit-line / already-paid path when no Payment SDK key.
  useEffect(() => {
    if (search.paid || !prebookId || !transactionId || secretKey) return;
    if (stored.secretKey) return;
    const t = setTimeout(() => {
      if (!secretKey) setReadyPay(false);
    }, 800);
    return () => clearTimeout(t);
  }, [search.paid, prebookId, transactionId, secretKey, stored.secretKey]);

  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      <h1 className="font-display text-3xl text-primary">Flight checkout</h1>
      <p className="mt-2 text-xs text-muted-foreground">
        Sandbox test card: 4242 4242 4242 4242 · any future expiry · any CVC
      </p>

      {!search.paid && secretKey && !readyPay ? (
        <button
          type="button"
          className="mt-8 w-full rounded-xl bg-accent py-3 text-sm font-semibold text-accent-foreground"
          onClick={() => setReadyPay(true)}
        >
          Continue to payment
        </button>
      ) : null}

      {!search.paid && !secretKey && prebookId && transactionId ? (
        <button
          type="button"
          className="mt-8 w-full rounded-xl bg-accent py-3 text-sm font-semibold text-accent-foreground"
          disabled={busy}
          onClick={() => {
            setBusy(true);
            void liteFlightBook({ data: { prebookId, transactionId } })
              .then((res) => {
                if (!res.ok || !res.data) throw new Error(res.error || "Booking failed");
                const data = (Array.isArray(res.data) ? res.data[0] : res.data) as {
                  bookingId?: string;
                  bookingRef?: string;
                };
                sessionStorage.removeItem("liteapi_flight_prebook");
                navigate({
                  to: "/{-$locale}/flights/confirmation/$bookingId",
                  params: { bookingId: String(data.bookingId ?? data.bookingRef ?? "ok") },
                });
              })
              .catch((e) => setError(e instanceof Error ? e.message : "Booking failed"))
              .finally(() => setBusy(false));
          }}
        >
          {busy ? "Confirming…" : "Confirm booking"}
        </button>
      ) : null}

      {readyPay ? <div id="liteapi-pay" className="mt-8 min-h-[220px]" /> : null}
      {busy ? <p className="mt-6 text-sm text-muted-foreground">Confirming…</p> : null}
      {error ? <p className="mt-6 text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
