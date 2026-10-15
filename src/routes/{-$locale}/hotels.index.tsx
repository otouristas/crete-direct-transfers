import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Check,
  Filter,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  Users,
  X,
} from "lucide-react";
import { liteHotelRates } from "@/functions/liteapi";
import { LitePlaceCombobox, type LitePlaceOption } from "@/components/lite-place-combobox";
import { formatEur } from "@/lib/pricing";
import { buildHead } from "@/lib/seo";
import type { Locale } from "@/i18n";
import { cn } from "@/lib/utils";

type Search = {
  placeId?: string;
  placeName?: string;
  aiSearch?: string;
  checkin?: string;
  checkout?: string;
  adults?: number;
};

export const Route = createFileRoute("/{-$locale}/hotels/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    placeId: typeof s.placeId === "string" ? s.placeId : undefined,
    placeName: typeof s.placeName === "string" ? s.placeName : undefined,
    aiSearch: typeof s.aiSearch === "string" ? s.aiSearch : undefined,
    checkin: typeof s.checkin === "string" ? s.checkin : undefined,
    checkout: typeof s.checkout === "string" ? s.checkout : undefined,
    adults: typeof s.adults === "number" ? s.adults : Number(s.adults) || undefined,
  }),
  head: ({ params }) => {
    const locale = (params.locale ?? "en") as Locale;
    return buildHead({
      locale,
      path: "/hotels",
      title: "Hotels · TransferAround",
      description: "Search and book hotels with Nuitee Connect",
    });
  },
  component: HotelsResultsPage,
});

type HotelCard = {
  hotelId: string;
  name: string;
  photo?: string;
  address?: string;
  city?: string;
  rating?: number;
  stars?: number;
  price?: number;
  currency?: string;
  offerId?: string;
  freeCancellation?: boolean;
  board?: string;
};

type SortKey = "recommended" | "price_asc" | "price_desc" | "rating";

function isoDateOffset(days: number): string {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function nightsBetween(checkin?: string, checkout?: string): number {
  if (!checkin || !checkout) return 1;
  const a = new Date(checkin).getTime();
  const b = new Date(checkout).getTime();
  const n = Math.round((b - a) / (1000 * 60 * 60 * 24));
  return Math.max(1, n);
}

function HotelsResultsPage() {
  const { locale } = Route.useRouteContext();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const nights = nightsBetween(search.checkin, search.checkout);
  const hasDates = Boolean(search.checkin && search.checkout);

  const [place, setPlace] = useState<LitePlaceOption | null>(
    search.placeId && search.placeName
      ? { placeId: search.placeId, displayName: search.placeName }
      : null,
  );
  const [checkIn, setCheckIn] = useState(search.checkin ?? isoDateOffset(7));
  const [checkOut, setCheckOut] = useState(search.checkout ?? isoDateOffset(10));
  const [adults, setAdults] = useState(search.adults ?? 2);
  const [aiSearch, setAiSearch] = useState(search.aiSearch ?? "");

  useEffect(() => {
    setCheckIn(search.checkin ?? isoDateOffset(7));
    setCheckOut(search.checkout ?? isoDateOffset(10));
    setAdults(search.adults ?? 2);
    setAiSearch(search.aiSearch ?? "");
    if (search.placeId && search.placeName) {
      setPlace({ placeId: search.placeId, displayName: search.placeName });
    }
  }, [
    search.placeId,
    search.placeName,
    search.checkin,
    search.checkout,
    search.adults,
    search.aiSearch,
  ]);

  // Booking.com behavior: always land with dates in the URL so results can load.
  useEffect(() => {
    if (search.checkin && search.checkout) return;
    const checkin = search.checkin ?? isoDateOffset(7);
    const checkout = search.checkout ?? isoDateOffset(10);
    void navigate({
      to: "/{-$locale}/hotels",
      search: {
        placeId: search.placeId,
        placeName: search.placeName,
        aiSearch: search.aiSearch,
        checkin,
        checkout,
        adults: search.adults ?? 2,
      },
      replace: true,
    });
  }, [search, navigate]);

  const [loading, setLoading] = useState(hasDates);
  const [error, setError] = useState<string | null>(null);
  const [hotels, setHotels] = useState<HotelCard[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [sort, setSort] = useState<SortKey>("recommended");
  const [starFilter, setStarFilter] = useState<number[]>([]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [freeCancelOnly, setFreeCancelOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);

  function runSearch(e?: React.FormEvent) {
    e?.preventDefault();
    if (!checkIn || !checkOut) return;
    if (checkOut <= checkIn) {
      setError("Check-out must be after check-in.");
      return;
    }
    void navigate({
      to: "/{-$locale}/hotels",
      search: {
        placeId: place?.placeId,
        placeName: place?.displayName,
        aiSearch: aiSearch.trim() || undefined,
        checkin: checkIn,
        checkout: checkOut,
        adults,
      },
    });
  }

  useEffect(() => {
    if (!search.checkin || !search.checkout) {
      setLoading(false);
      setHotels([]);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    void liteHotelRates({
      data: {
        checkin: search.checkin,
        checkout: search.checkout,
        adults: search.adults ?? 2,
        placeId: search.placeId,
        aiSearch: search.aiSearch,
        currency: "EUR",
        guestNationality: "GR",
        maxRatesPerHotel: 1,
        includeHotelData: true,
      },
    })
      .then((res) => {
        if (cancelled) return;
        if (!res.ok || !res.data) {
          setError(String(res.error || "Could not load hotels"));
          setHotels([]);
          return;
        }
        const data = res.data as {
          data?: Array<{
            hotelId: string;
            roomTypes?: Array<{
              offerId?: string;
              rates?: Array<{
                name?: string;
                boardName?: string;
                cancellationPolicies?: unknown;
                retailRate?: { total?: Array<{ amount: number; currency: string }> };
              }>;
            }>;
          }>;
          hotels?: Array<{
            id: string;
            name: string;
            main_photo?: string;
            address?: string;
            city?: string;
            rating?: number;
            starRating?: number;
            stars?: number;
          }>;
        };

        const ratesById = new Map(
          (data.data ?? []).map((h) => {
            const rt = h.roomTypes?.[0];
            const rate = rt?.rates?.[0];
            const total = rate?.retailRate?.total?.[0];
            const policies = rate?.cancellationPolicies;
            const freeCancellation = Array.isArray(policies)
              ? policies.some((p) => {
                  const row = p as { refundableTag?: string; cancelCharge?: number };
                  return (
                    row.refundableTag === "RFN" ||
                    row.refundableTag === "refundable" ||
                    row.cancelCharge === 0
                  );
                })
              : Boolean(policies);
            return [
              h.hotelId,
              {
                offerId: rt?.offerId,
                price: total?.amount,
                currency: total?.currency ?? "EUR",
                board: rate?.boardName,
                freeCancellation,
              },
            ] as const;
          }),
        );

        const meta = data.hotels ?? [];
        const cards: HotelCard[] = meta.length
          ? meta.map((h) => {
              const r = ratesById.get(h.id);
              return {
                hotelId: h.id,
                name: h.name,
                photo: h.main_photo,
                address: h.address,
                city: h.city,
                rating: h.rating,
                stars: h.starRating ?? h.stars,
                price: r?.price,
                currency: r?.currency,
                offerId: r?.offerId,
                freeCancellation: r?.freeCancellation,
                board: r?.board,
              };
            })
          : [...ratesById.entries()].map(([hotelId, r]) => ({
              hotelId,
              name: hotelId,
              price: r.price,
              currency: r.currency,
              offerId: r.offerId,
              freeCancellation: r.freeCancellation,
              board: r.board,
            }));

        setHotels(cards);
        const prices = cards.map((c) => c.price).filter((p): p is number => p != null);
        if (prices.length) {
          setMaxPrice((prev) => prev ?? Math.ceil(Math.max(...prices)));
        }
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

  const priceCeiling = useMemo(() => {
    const prices = hotels.map((h) => h.price).filter((p): p is number => p != null);
    if (!prices.length) return 500;
    return Math.ceil(Math.max(...prices) / 10) * 10;
  }, [hotels]);

  const filtered = useMemo(() => {
    let list = [...hotels];
    if (starFilter.length) {
      list = list.filter((h) => h.stars != null && starFilter.includes(Math.round(h.stars)));
    }
    if (maxPrice != null) {
      list = list.filter((h) => h.price == null || h.price <= maxPrice);
    }
    if (freeCancelOnly) {
      list = list.filter((h) => h.freeCancellation);
    }
    if (minRating > 0) {
      list = list.filter((h) => (h.rating ?? 0) >= minRating);
    }
    switch (sort) {
      case "price_asc":
        list.sort((a, b) => (a.price ?? 1e9) - (b.price ?? 1e9));
        break;
      case "price_desc":
        list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case "rating":
        list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      default:
        break;
    }
    return list;
  }, [hotels, starFilter, maxPrice, freeCancelOnly, minRating, sort]);

  function toggleStar(n: number) {
    setStarFilter((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));
  }

  const placeLabel = search.placeName || search.aiSearch || "Hotels";

  const sidebar = (
    <aside className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-primary">Filter by</h2>
        <p className="mt-1 text-xs text-muted-foreground">Refine results like Booking.com</p>
      </div>

      <section className="space-y-3 border-t border-border pt-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Your budget
        </h3>
        <div className="flex items-center justify-between text-sm">
          <span>€0</span>
          <span className="font-medium text-primary">up to €{maxPrice ?? priceCeiling}</span>
        </div>
        <input
          type="range"
          min={0}
          max={priceCeiling}
          step={10}
          value={maxPrice ?? priceCeiling}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-accent"
        />
      </section>

      <section className="space-y-3 border-t border-border pt-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Star rating
        </h3>
        <div className="space-y-2">
          {[5, 4, 3, 2].map((n) => (
            <label key={n} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={starFilter.includes(n)}
                onChange={() => toggleStar(n)}
                className="size-4 rounded border-border accent-accent"
              />
              <span className="flex items-center gap-0.5 text-amber-500">
                {Array.from({ length: n }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-current" />
                ))}
              </span>
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-3 border-t border-border pt-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Guest review score
        </h3>
        <div className="space-y-2">
          {[
            { label: "Wonderful: 9+", value: 9 },
            { label: "Very good: 8+", value: 8 },
            { label: "Good: 7+", value: 7 },
            { label: "Any", value: 0 },
          ].map((opt) => (
            <label key={opt.value} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="minRating"
                checked={minRating === opt.value}
                onChange={() => setMinRating(opt.value)}
                className="size-4 accent-accent"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </section>

      <section className="space-y-3 border-t border-border pt-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Cancellation
        </h3>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={freeCancelOnly}
            onChange={(e) => setFreeCancelOnly(e.target.checked)}
            className="size-4 rounded border-border accent-accent"
          />
          Free cancellation
        </label>
      </section>

      {(starFilter.length > 0 ||
        freeCancelOnly ||
        minRating > 0 ||
        (maxPrice != null && maxPrice < priceCeiling)) && (
        <button
          type="button"
          onClick={() => {
            setStarFilter([]);
            setFreeCancelOnly(false);
            setMinRating(0);
            setMaxPrice(priceCeiling);
          }}
          className="text-sm font-medium text-accent-deep underline"
        >
          Clear all filters
        </button>
      )}
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Booking.com-style sticky search bar */}
      <div className="sticky top-16 z-30 border-b border-[#febb02]/40 bg-[#003b95] text-white shadow-md">
        <form
          onSubmit={runSearch}
          className="mx-auto grid max-w-7xl gap-2 px-4 py-3 sm:px-5 lg:grid-cols-[1.4fr_repeat(3,minmax(0,0.85fr))_auto]"
        >
          <label className="flex min-h-[52px] flex-col justify-center rounded-lg border-2 border-[#febb02] bg-white px-3 py-1.5 text-[#1a1a1a]">
            <span className="text-[10px] font-bold uppercase tracking-wide text-[#6b6b6b]">
              Destination
            </span>
            <div className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0 text-[#003b95]" />
              <div className="min-w-0 flex-1">
                <LitePlaceCombobox
                  value={place}
                  onChange={setPlace}
                  placeholder="Where are you going?"
                  className="min-w-0 flex-1"
                  inputClassName="rounded-none border-0 bg-transparent px-0 py-0 text-sm font-semibold text-[#1a1a1a] shadow-none focus:border-transparent"
                />
              </div>
            </div>
          </label>

          <label className="flex min-h-[52px] flex-col justify-center rounded-lg border-2 border-[#febb02] bg-white px-3 py-1.5 text-[#1a1a1a]">
            <span className="text-[10px] font-bold uppercase tracking-wide text-[#6b6b6b]">
              Check-in
            </span>
            <input
              type="date"
              required
              value={checkIn}
              min={isoDateOffset(0)}
              onChange={(e) => {
                setCheckIn(e.target.value);
                if (checkOut <= e.target.value) {
                  const next = new Date(e.target.value);
                  next.setDate(next.getDate() + 3);
                  setCheckOut(next.toISOString().slice(0, 10));
                }
              }}
              className="bg-transparent text-sm font-semibold outline-none"
            />
          </label>

          <label className="flex min-h-[52px] flex-col justify-center rounded-lg border-2 border-[#febb02] bg-white px-3 py-1.5 text-[#1a1a1a]">
            <span className="text-[10px] font-bold uppercase tracking-wide text-[#6b6b6b]">
              Check-out
            </span>
            <input
              type="date"
              required
              value={checkOut}
              min={checkIn}
              onChange={(e) => setCheckOut(e.target.value)}
              className="bg-transparent text-sm font-semibold outline-none"
            />
          </label>

          <label className="flex min-h-[52px] flex-col justify-center rounded-lg border-2 border-[#febb02] bg-white px-3 py-1.5 text-[#1a1a1a]">
            <span className="text-[10px] font-bold uppercase tracking-wide text-[#6b6b6b]">
              Guests
            </span>
            <div className="flex items-center gap-2">
              <Users className="size-4 shrink-0 text-[#003b95]" />
              <input
                type="number"
                min={1}
                max={12}
                value={adults}
                onChange={(e) => setAdults(Math.max(1, Number(e.target.value) || 1))}
                className="w-full bg-transparent text-sm font-semibold outline-none"
              />
            </div>
          </label>

          <button
            type="submit"
            className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-lg bg-[#006ce4] px-6 text-sm font-bold text-white transition hover:bg-[#0057b8]"
          >
            <Search className="size-4" />
            Search
          </button>
        </form>
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 pb-3 sm:px-5">
          <input
            value={aiSearch}
            onChange={(e) => setAiSearch(e.target.value)}
            placeholder="Optional vibe — beach, boutique, family pool…"
            className="min-w-[200px] flex-1 rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white placeholder:text-white/60 outline-none focus:bg-white/15"
          />
          {hasDates ? (
            <p className="text-xs text-white/80">
              {placeLabel} · {search.checkin} → {search.checkout} · {nights} night
              {nights === 1 ? "" : "s"} · {search.adults ?? adults} adults
            </p>
          ) : (
            <p className="text-xs font-medium text-[#febb02]">Pick dates above, then hit Search</p>
          )}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[260px_1fr]">
        <div className="hidden rounded-2xl border border-border bg-card p-5 lg:block">
          {sidebar}
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl text-primary sm:text-3xl">
                {!hasDates
                  ? "Search hotels"
                  : `${placeLabel}: ${loading ? "…" : filtered.length} properties found`}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {!hasDates
                  ? "Enter destination and dates in the yellow search bar"
                  : `Prices for ${nights} night${nights === 1 ? "" : "s"}, ${search.adults ?? 2} adults`}
              </p>
            </div>
            {hasDates ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium lg:hidden"
                  onClick={() => setFiltersOpen(true)}
                >
                  <SlidersHorizontal className="size-4" />
                  Filters
                </button>
                <label className="hidden items-center gap-2 text-sm sm:flex">
                  <span className="text-muted-foreground">Sort</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="rounded-xl border border-border bg-card px-3 py-2 text-sm"
                  >
                    <option value="recommended">Our top picks</option>
                    <option value="price_asc">Price (low to high)</option>
                    <option value="price_desc">Price (high to low)</option>
                    <option value="rating">Guest rating</option>
                  </select>
                </label>
              </div>
            ) : null}
          </div>

          {!hasDates ? (
            <div className="rounded-2xl border border-dashed border-[#003b95]/30 bg-card p-10 text-center">
              <Search className="mx-auto size-10 text-[#003b95]" />
              <p className="mt-4 font-display text-xl text-primary">Where to next?</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Choose a destination, check-in and check-out in the bar above — same flow as
                Booking.com.
              </p>
            </div>
          ) : null}

          {hasDates && loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-40 animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          ) : null}

          {error ? (
            <div className="rounded-2xl border border-destructive/30 bg-card p-6 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          {hasDates && !loading && !error && filtered.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-10 text-center">
              <Filter className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">
                No hotels match these filters. Try clearing some filters or changing dates.
              </p>
            </div>
          ) : null}

          <ul className="space-y-4">
            {filtered.map((h) => (
              <li
                key={h.hotelId}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md"
              >
                <div className="grid sm:grid-cols-[220px_1fr_180px]">
                  <div className="relative min-h-44 bg-muted sm:min-h-full">
                    {h.photo ? (
                      <img
                        src={h.photo}
                        alt=""
                        className="absolute inset-0 size-full object-cover"
                      />
                    ) : (
                      <div className="flex h-44 items-center justify-center sm:h-full">
                        <Building2 className="size-10 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 p-4 sm:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h2 className="font-display text-lg text-primary sm:text-xl">{h.name}</h2>
                        {(h.address || h.city) && (
                          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="size-3.5 shrink-0" />
                            {h.address || h.city}
                          </p>
                        )}
                      </div>
                      {h.rating != null ? (
                        <div className="rounded-lg bg-primary px-2.5 py-1 text-center text-primary-foreground">
                          <div className="text-sm font-bold">{h.rating.toFixed(1)}</div>
                          <div className="text-[10px] opacity-80">Score</div>
                        </div>
                      ) : null}
                    </div>

                    {h.stars != null ? (
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: Math.min(5, Math.round(h.stars)) }).map((_, i) => (
                          <Star key={i} className="size-3.5 fill-current" />
                        ))}
                      </div>
                    ) : null}

                    <div className="flex flex-wrap gap-2 pt-1">
                      {h.freeCancellation ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          <Check className="size-3" />
                          Free cancellation
                        </span>
                      ) : null}
                      {h.board ? (
                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                          {h.board}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-col items-stretch justify-between gap-3 border-t border-border bg-[#fafbfc] p-4 sm:border-l sm:border-t-0 sm:p-5">
                    <div className="text-right sm:text-left">
                      <div className="text-xs text-muted-foreground">
                        {nights} night{nights === 1 ? "" : "s"}
                      </div>
                      <div className="font-display text-2xl text-primary">
                        {h.price != null ? formatEur(h.price) : "—"}
                      </div>
                      <div className="text-xs text-muted-foreground">Includes taxes</div>
                    </div>
                    <Link
                      to="/{-$locale}/hotels/$hotelId"
                      params={{
                        locale: locale === "en" ? undefined : locale,
                        hotelId: h.hotelId,
                      }}
                      search={{
                        checkin: search.checkin,
                        checkout: search.checkout,
                        adults: search.adults,
                      }}
                      className={cn(
                        "inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2.5",
                        "text-sm font-semibold text-accent-foreground transition hover:opacity-90",
                      )}
                    >
                      See availability
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {filtersOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(100%,320px)] flex-col bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="font-semibold text-primary">Filters</span>
              <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Close">
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{sidebar}</div>
            <div className="border-t border-border p-4">
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-accent-foreground"
              >
                Show {filtered.length} properties
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
