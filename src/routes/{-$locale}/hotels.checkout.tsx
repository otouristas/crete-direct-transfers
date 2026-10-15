import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { liteGetSession, liteHotelBook } from "@/functions/liteapi";
import { buildHead } from "@/lib/seo";
import type { Locale } from "@/i18n";

type Search = {
  prebookId?: string;
  transactionId?: string;
  paid?: string;
};

export const Route = createFileRoute("/{-$locale}/hotels/checkout")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    prebookId: typeof s.prebookId === "string" ? s.prebookId : undefined,
    transactionId: typeof s.transactionId === "string" ? s.transactionId : undefined,
    paid: typeof s.paid === "string" ? s.paid : undefined,
  }),
  head: ({ params }) => {
    const locale = (params.locale ?? "en") as Locale;
    return buildHead({
      locale,
      path: "/hotels/checkout",
      title: "Hotel checkout · TransferAround",
      description: "Complete your hotel booking",
      noindex: true,
    });
  },
  component: HotelCheckoutPage,
});

declare global {
  interface Window {
    LiteAPIPayment?: new (cfg: Record<string, unknown>) => { handlePayment: () => void };
  }
}

function HotelCheckoutPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [readyPay, setReadyPay] = useState(false);
  const payMounted = useRef(false);

  const stored = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("liteapi_hotel_prebook") || "{}") as {
        prebookId?: string;
        transactionId?: string;
        secretKey?: string;
        hotelName?: string;
        price?: number;
        currency?: string;
      };
    } catch {
      return {};
    }
  })();

  const prebookId = search.prebookId || stored.prebookId;
  const transactionId = search.transactionId || stored.transactionId;
  const [secretKey, setSecretKey] = useState<string | undefined>(stored.secretKey);

  useEffect(() => {
    if (stored.secretKey || !prebookId) return;
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
    void liteHotelBook({
      data: {
        prebookId,
        transactionId,
        holder: {
          firstName: firstName || "Guest",
          lastName: lastName || "Traveler",
          email: email || "guest@transferaround.com",
        },
      },
    })
      .then((res) => {
        if (!res.ok || !res.data) throw new Error(res.error || "Book failed");
        const bookingId = String((res.data as { bookingId?: string }).bookingId ?? "ok");
        sessionStorage.removeItem("liteapi_hotel_prebook");
        navigate({
          to: "/{-$locale}/hotels/confirmation/$bookingId",
          params: { bookingId },
        });
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Book failed"))
      .finally(() => setBusy(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on return from payment
  }, [search.paid]);

  useEffect(() => {
    if (!readyPay || !secretKey || payMounted.current) return;
    payMounted.current = true;
    const script = document.createElement("script");
    script.src = "https://payment-wrapper.liteapi.travel/dist/liteAPIPayment.js?v=a1";
    script.async = true;
    script.onload = () => {
      const returnUrl = `${window.location.origin}${window.location.pathname}?prebookId=${encodeURIComponent(prebookId || "")}&transactionId=${encodeURIComponent(transactionId || "")}&paid=1`;
      const isSandbox = (secretKey || "").toLowerCase().includes("test") || true;
      const liteAPIPayment = new window.LiteAPIPayment!({
        publicKey: isSandbox ? "sandbox" : "live",
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

  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      <h1 className="font-display text-3xl text-primary">Hotel checkout</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {stored.hotelName ?? "Hotel"} · {stored.price != null ? `€${stored.price}` : ""}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        Sandbox test card: 4242 4242 4242 4242 · any future expiry · any CVC
      </p>

      {!readyPay ? (
        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!firstName || !lastName || !email) {
              setError("Fill guest details");
              return;
            }
            setError(null);
            setReadyPay(true);
          }}
        >
          <input
            className="w-full rounded-xl border border-border px-3 py-2.5 text-sm"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            className="w-full rounded-xl border border-border px-3 py-2.5 text-sm"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <input
            type="email"
            className="w-full rounded-xl border border-border px-3 py-2.5 text-sm"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <button
            type="submit"
            className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-accent-foreground"
          >
            Continue to payment
          </button>
        </form>
      ) : (
        <div className="mt-8">
          {busy ? <p className="text-sm text-muted-foreground">Confirming booking…</p> : null}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <div id="liteapi-pay" className="min-h-[220px]" />
        </div>
      )}
    </div>
  );
}
