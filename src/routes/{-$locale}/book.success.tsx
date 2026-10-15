import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { CheckCircle2, Clock3, ShieldCheck, Loader2, CreditCard } from "lucide-react";
import { getDict, type Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { checkoutStatus } from "@/functions/checkout-status";
import { createCheckoutSession } from "@/functions/stripe";

export const Route = createFileRoute("/{-$locale}/book/success")({
  validateSearch: z.object({
    id: z.string().optional(),
    session_id: z.string().optional(),
    cancelled: z.coerce.number().optional(),
  }),
  head: ({ params }) =>
    buildHead({
      locale: (params.locale ?? "en") as Locale,
      path: "/book/success",
      title: "Your transfer payment | TransferAround",
      description: "Secure payment confirmation for your TransferAround journey.",
      noindex: true,
    }),
  component: PaymentReturn,
});
function PaymentReturn() {
  const { id, session_id, cancelled } = Route.useSearch();
  const { locale } = Route.useRouteContext();
  const el = locale === "el";
  const [status, setStatus] = useState<"checking" | "paid" | "unpaid" | "unavailable">("checking");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!id) {
      setStatus("unavailable");
      return;
    }
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    let attempts = 0;
    const read = async () => {
      try {
        const result = await checkoutStatus({
          data: {
            bookingId: id,
            sessionId: session_id,
            checkoutToken: sessionStorage.getItem(`checkout-token:${id}`) || undefined,
          },
        });
        if (!active) return;
        setStatus(result.status);
        if (result.status === "unpaid" && !cancelled && attempts++ < 20)
          timer = setTimeout(read, 2000);
      } catch {
        if (active) setStatus("unavailable");
      }
    };
    void read();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [id, session_id, cancelled]);
  async function retry() {
    if (!id) return;
    setBusy(true);
    setError(null);
    try {
      const r = await createCheckoutSession({
        data: {
          bookingId: id,
          checkoutToken: sessionStorage.getItem(`checkout-token:${id}`) || undefined,
        },
      });
      if (r.url) window.location.assign(r.url);
      else throw new Error("Could not open payment.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  const paid = status === "paid";
  return (
    <div className="mx-auto max-w-xl px-6 py-20">
      <div className="rounded-[2rem] border border-border bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto mb-7 grid h-20 w-20 place-items-center rounded-full bg-accent/10 text-accent-deep">
          {paid ? (
            <CheckCircle2 size={38} />
          ) : status === "checking" ? (
            <Loader2 size={34} className="animate-spin" />
          ) : (
            <Clock3 size={34} />
          )}
        </div>
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-accent-deep">
          TransferAround
        </p>
        <h1 className="mt-4 text-3xl font-display leading-tight text-primary">
          {paid
            ? el
              ? "Η πληρωμή επιβεβαιώθηκε."
              : "Your journey is confirmed."
            : cancelled
              ? el
                ? "Η πληρωμή δεν ολοκληρώθηκε."
                : "Your payment wasn’t completed."
              : el
                ? "Έλεγχος πληρωμής."
                : "We’re checking your payment."}
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          {paid
            ? el
              ? "Το Stripe επιβεβαίωσε την πληρωμή σας. Θα λάβετε τα στοιχεία της διαδρομής και του οδηγού σας."
              : "Your payment has been verified. Your transfer is booked and we’ll send your journey and driver details."
            : cancelled
              ? el
                ? "Η κράτησή σας παραμένει απλήρωτη. Μπορείτε να επιστρέψετε στην ασφαλή πληρωμή."
                : "Your booking is awaiting payment. You can return to secure checkout whenever you’re ready."
              : el
                ? "Η επιβεβαίωση εμφανίζεται μόλις καταγραφεί η πληρωμή από το Stripe. Αν χρειαστεί λίγο παραπάνω, ελέγξτε τις κρατήσεις σας."
                : "Confirmation appears once Stripe has recorded your payment. If verification takes a little longer, check your bookings shortly."}
        </p>
        {id && (
          <p className="mt-6 rounded-xl bg-muted px-4 py-3 font-mono text-xs text-muted-foreground">
            Ref: {id.slice(0, 8)}
          </p>
        )}
        {error && (
          <p role="alert" className="mt-4 text-sm text-destructive">
            {error}
          </p>
        )}
        <div className="mt-8 flex flex-col gap-3">
          {!paid && id && (
            <button
              onClick={() => void retry()}
              disabled={busy}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              <CreditCard size={17} />
              {busy
                ? el
                  ? "Αναμονή…"
                  : "Opening checkout…"
                : el
                  ? "Επιστροφή στην πληρωμή"
                  : "Return to secure payment"}
            </button>
          )}
          <Link
            to="/{-$locale}/account"
            className="rounded-xl border border-border px-5 py-3 text-sm font-medium"
          >
            {el ? "Οι κρατήσεις μου" : "View my bookings"}
          </Link>
          <Link to="/{-$locale}" className="py-2 text-xs text-muted-foreground">
            {el ? "Επιστροφή στην αρχική" : "Back to the journey"}
          </Link>
        </div>
        <p className="mt-7 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
          <ShieldCheck size={14} />
          {el ? "Ασφαλείς πληρωμές μέσω Stripe" : "Secure payments with Stripe"}
        </p>
      </div>
    </div>
  );
}
