import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { liteFlightPrebook, liteFlightRates } from "@/functions/liteapi";
import { formatEur } from "@/lib/pricing";
import { buildHead } from "@/lib/seo";
import type { Locale } from "@/i18n";

type Search = {
  origin?: string;
  destination?: string;
  date?: string;
  adults?: number;
};

export const Route = createFileRoute("/{-$locale}/flights/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    origin: typeof s.origin === "string" ? s.origin : undefined,
    destination: typeof s.destination === "string" ? s.destination : undefined,
    date: typeof s.date === "string" ? s.date : undefined,
    adults: typeof s.adults === "number" ? s.adults : Number(s.adults) || 1,
  }),
  head: ({ params }) => {
    const locale = (params.locale ?? "en") as Locale;
    return buildHead({
      locale,
      path: "/flights",
      title: "Flights · TransferAround",
      description: "Search flights with Nuitee Connect",
    });
  },
  component: FlightsPage,
});

type OfferRow = {
  offerId: string;
  label: string;
  price?: number;
  currency?: string;
};

function FlightsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offers, setOffers] = useState<OfferRow[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!search.origin || !search.destination || !search.date) {
      setLoading(false);
      setError("Missing search parameters");
      return;
    }
    let cancelled = false;
    setLoading(true);
    void liteFlightRates({
      data: {
        legs: [
          {
            origin: search.origin,
            destination: search.destination,
            date: search.date,
          },
        ],
        adults: search.adults ?? 1,
        currency: "EUR",
        country: "GR",
      },
    })
      .then((res) => {
        if (cancelled) return;
        if (!res.ok || !res.data) {
          setError(String(res.error || "Flight search failed"));
          return;
        }
        const raw = res.data as {
          data?: Array<Record<string, unknown>>;
          offers?: Array<Record<string, unknown>>;
        };
        const list = raw.data ?? raw.offers ?? [];
        const rows: OfferRow[] = list.slice(0, 30).map((o, i) => {
          const offerId = String(o.offerId ?? o.id ?? `offer-${i}`);
          const pricing = o.pricing as { display?: { total?: number }; total?: number } | undefined;
          const price =
            pricing?.display?.total ??
            pricing?.total ??
            (o.price as number | undefined) ??
            undefined;
          const carriers = o.carriers as string[] | undefined;
          const label =
            (o.summary as string) ||
            carriers?.join(", ") ||
            `${search.origin} → ${search.destination}`;
          return {
            offerId,
            label,
            price: typeof price === "number" ? price : undefined,
            currency: "EUR",
          };
        });
        setOffers(rows);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Search failed");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [search]);

  async function startCheckout(offerId: string) {
    setBusy(offerId);
    setError(null);
    try {
      const pre = await liteFlightPrebook({
        data: {
          offerId,
          contact: {
            firstName: "Guest",
            lastName: "Traveler",
            email: "guest@transferaround.com",
            phone: "+30000000000",
          },
          passengers: [
            {
              type: "ADT",
              firstName: "Guest",
              lastName: "Traveler",
              birthday: "1990-01-01",
              gender: "X",
            },
          ],
        },
      });
      if (!pre.ok || !pre.data) throw new Error(pre.error || "Prebook failed");
      const d = pre.data as {
        prebookId?: string;
        transactionId?: string;
        secretKey?: string;
      };
      const payload = (Array.isArray(d) ? d[0] : d) as typeof d;
      sessionStorage.setItem("liteapi_flight_prebook", JSON.stringify(payload));
      navigate({
        to: "/{-$locale}/flights/checkout",
        search: {
          prebookId: payload.prebookId,
          transactionId: payload.transactionId,
        },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Prebook failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-3xl text-primary">Flights</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {search.origin} → {search.destination} · {search.date} · {search.adults ?? 1} adult(s)
      </p>
      {loading ? <p className="mt-8 text-sm text-muted-foreground">Searching…</p> : null}
      {error ? <p className="mt-8 text-sm text-destructive">{error}</p> : null}
      <ul className="mt-8 space-y-3">
        {offers.map((o) => (
          <li
            key={o.offerId}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-5 py-4"
          >
            <div>
              <div className="font-medium text-primary">{o.label}</div>
              <div className="font-display text-xl text-primary">
                {o.price != null ? formatEur(o.price) : "—"}
              </div>
            </div>
            <button
              type="button"
              disabled={busy === o.offerId}
              onClick={() => void startCheckout(o.offerId)}
              className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
            >
              {busy === o.offerId ? "…" : "Select"}
            </button>
          </li>
        ))}
      </ul>
      {!loading && !error && offers.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No offers returned.</p>
      ) : null}
    </div>
  );
}
