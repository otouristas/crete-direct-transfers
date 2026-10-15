import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  liteHotelDetails,
  liteHotelPrebook,
  liteHotelRates,
  liteHotelReviews,
} from "@/functions/liteapi";
import { formatEur } from "@/lib/pricing";
import { buildHead } from "@/lib/seo";
import type { Locale } from "@/i18n";
import { SITE_URL } from "@/lib/site";

type Search = {
  checkin?: string;
  checkout?: string;
  adults?: number;
  offerId?: string;
};

type HotelImage = {
  url: string;
  urlHd?: string;
  caption?: string;
  order?: number;
  defaultImage?: boolean;
};

type HotelRoom = {
  id?: string | number;
  roomName?: string;
  description?: string;
  roomSizeSquare?: number;
  roomSizeUnit?: string;
  maxAdults?: number;
  maxChildren?: number;
  maxOccupancy?: number;
  bedTypes?: Array<{ quantity?: number; bedType?: string; bedSize?: string }>;
  roomAmenities?: Array<string | { name?: string }>;
  photos?: HotelImage[];
  views?: string[];
};

type HotelDetails = {
  id?: string;
  name?: string;
  hotelDescription?: string;
  hotelImportantInformation?: string;
  address?: string;
  city?: string;
  country?: string;
  zip?: string;
  starRating?: number;
  main_photo?: string;
  hotelImages?: HotelImage[];
  hotelFacilities?: string[];
  facilities?: Array<{ facilityId?: number; name?: string }>;
  rooms?: HotelRoom[];
  location?: { latitude?: number; longitude?: number };
  checkinCheckoutTimes?: {
    checkin?: string;
    checkout?: string;
    checkin_start?: string;
    checkin_end?: string;
    checkinStart?: string;
    checkinEnd?: string;
    special_instructions?: string;
  };
};

type Review = {
  averageScore?: number;
  name?: string;
  country?: string;
  type?: string;
  date?: string;
  headline?: string;
  pros?: string;
  cons?: string;
  language?: string;
};

type RateRow = {
  offerId: string;
  name: string;
  board?: string;
  price?: number;
  mappedRoomId?: number;
  refundable?: boolean;
};

export const Route = createFileRoute("/{-$locale}/hotels/$hotelId")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    checkin: typeof s.checkin === "string" ? s.checkin : undefined,
    checkout: typeof s.checkout === "string" ? s.checkout : undefined,
    adults: typeof s.adults === "number" ? s.adults : Number(s.adults) || 2,
    offerId: typeof s.offerId === "string" ? s.offerId : undefined,
  }),
  head: ({ params }) => {
    const locale = (params.locale ?? "en") as Locale;
    return buildHead({
      locale,
      path: `/hotels/${params.hotelId}`,
      title: "Hotel · TransferAround",
      description: "Hotel details, photos, amenities and rates",
    });
  },
  component: HotelDetailPage,
});

function starsLabel(n?: number) {
  if (!n || n <= 0) return null;
  return "★".repeat(Math.min(5, Math.round(n)));
}

function amenityName(a: string | { name?: string }) {
  return typeof a === "string" ? a : String(a.name ?? "");
}

function HotelDetailPage() {
  const { locale } = Route.useRouteContext();
  const { hotelId } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [details, setDetails] = useState<HotelDetails | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rates, setRates] = useState<RateRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [activePhoto, setActivePhoto] = useState(0);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    setLoadingDetails(true);
    void liteHotelDetails({ data: { hotelId } })
      .then((res) => {
        if (res.ok && res.data) setDetails(res.data as HotelDetails);
        else setError(String(res.error || "Could not load hotel details"));
      })
      .finally(() => setLoadingDetails(false));

    void liteHotelReviews({ data: { hotelId, limit: 10 } }).then((res) => {
      if (res.ok && Array.isArray(res.data)) setReviews(res.data as Review[]);
    });

    if (!search.checkin || !search.checkout) return;
    void liteHotelRates({
      data: {
        hotelIds: [hotelId],
        checkin: search.checkin,
        checkout: search.checkout,
        adults: search.adults ?? 2,
        maxRatesPerHotel: 30,
        roomMapping: true,
        includeHotelData: false,
        currency: "EUR",
        guestNationality: "GR",
      },
    }).then((res) => {
      if (!res.ok || !res.data) {
        setError(String(res.error || "Rates unavailable"));
        return;
      }
      const rows = (res.data as { data?: Array<{ roomTypes?: Array<Record<string, unknown>> }> })
        .data?.[0]?.roomTypes;
      const out: RateRow[] = [];
      for (const rt of rows ?? []) {
        const offerId = String(rt.offerId ?? "");
        const rate = (rt.rates as Array<Record<string, unknown>> | undefined)?.[0];
        if (!offerId || !rate) continue;
        const total = (rate.retailRate as { total?: Array<{ amount: number }> } | undefined)
          ?.total?.[0]?.amount;
        out.push({
          offerId,
          name: String(rate.name ?? "Room"),
          board: rate.boardName ? String(rate.boardName) : undefined,
          price: total,
          mappedRoomId: typeof rate.mappedRoomId === "number" ? rate.mappedRoomId : undefined,
          refundable: rate.cancellationPolicy
            ? String(JSON.stringify(rate.cancellationPolicy)).toLowerCase().includes("refund")
            : undefined,
        });
      }
      setRates(out);
    });
  }, [hotelId, search.checkin, search.checkout, search.adults]);

  const name = details?.name ?? hotelId;
  const photos = useMemo(() => {
    const imgs = [...(details?.hotelImages ?? [])].sort(
      (a, b) => Number(a.order ?? 0) - Number(b.order ?? 0),
    );
    if (!imgs.length && details?.main_photo) {
      return [{ url: details.main_photo, defaultImage: true }];
    }
    return imgs;
  }, [details]);

  const amenities = useMemo(() => {
    if (details?.hotelFacilities?.length) return details.hotelFacilities;
    return (details?.facilities ?? []).map((f) => f.name).filter(Boolean) as string[];
  }, [details]);

  const times = details?.checkinCheckoutTimes;
  const checkinTime = times?.checkin_start || times?.checkinStart || times?.checkin;
  const checkoutTime = times?.checkout;
  const checkinEnd = times?.checkin_end || times?.checkinEnd;

  const mapUrl =
    details?.location?.latitude != null && details?.location?.longitude != null
      ? `https://www.google.com/maps/search/?api=1&query=${details.location.latitude},${details.location.longitude}`
      : null;

  const grouped = useMemo(() => {
    const map = new Map<string, RateRow[]>();
    for (const r of rates) {
      const key = String(r.mappedRoomId ?? r.name);
      const list = map.get(key) ?? [];
      list.push(r);
      map.set(key, list);
    }
    return [...map.entries()];
  }, [rates]);

  const visibleAmenities = showAllAmenities ? amenities : amenities.slice(0, 18);
  const galleryThumbs = showAllPhotos ? photos : photos.slice(0, 8);
  const hero = photos[activePhoto] ?? photos[0];

  async function onBook(offerId: string) {
    setBusy(offerId);
    setError(null);
    try {
      const pre = await liteHotelPrebook({ data: { offerId } });
      if (!pre.ok || !pre.data) throw new Error(pre.error || "Prebook failed");
      const d = pre.data as {
        prebookId?: string;
        transactionId?: string;
        secretKey?: string;
        price?: number;
        currency?: string;
      };
      const prefix = locale && locale !== "en" ? `/${locale}` : "";
      sessionStorage.setItem(
        "liteapi_hotel_prebook",
        JSON.stringify({
          ...d,
          hotelId,
          hotelName: name,
          checkin: search.checkin,
          checkout: search.checkout,
          returnUrl: `${SITE_URL}${prefix}/hotels/checkout`,
        }),
      );
      navigate({
        to: "/{-$locale}/hotels/checkout",
        search: {
          prebookId: d.prebookId,
          transactionId: d.transactionId,
        },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Prebook failed");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f5f7fa_0%,#fff_28%)]">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6">
        <Link
          to="/{-$locale}/hotels"
          search={search}
          className="text-sm font-medium text-accent-deep underline-offset-2 hover:underline"
        >
          ← Back to results
        </Link>

        {loadingDetails && !details ? (
          <p className="mt-10 text-sm text-muted-foreground">Loading hotel details…</p>
        ) : null}

        {/* Gallery */}
        {hero ? (
          <div className="mt-6 grid gap-3 lg:grid-cols-[1.6fr_1fr]">
            <button
              type="button"
              className="relative overflow-hidden rounded-3xl bg-primary/10"
              onClick={() => setActivePhoto((activePhoto + 1) % Math.max(photos.length, 1))}
            >
              <img
                src={hero.urlHd || hero.url}
                alt={hero.caption || name}
                className="aspect-[16/10] h-full w-full object-cover"
              />
              {hero.caption ? (
                <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1 text-xs text-white">
                  {hero.caption}
                </span>
              ) : null}
              {photos.length > 1 ? (
                <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1 text-xs text-white">
                  {activePhoto + 1} / {photos.length}
                </span>
              ) : null}
            </button>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
              {galleryThumbs.slice(1, 5).map((img, i) => (
                <button
                  key={`${img.url}-${i}`}
                  type="button"
                  onClick={() => setActivePhoto(photos.indexOf(img))}
                  className="overflow-hidden rounded-2xl"
                >
                  <img
                    src={img.url}
                    alt={img.caption || ""}
                    className="aspect-square h-full w-full object-cover transition hover:scale-[1.03]"
                  />
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {photos.length > 5 ? (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {galleryThumbs.map((img, i) => {
              const idx = photos.indexOf(img);
              return (
                <button
                  key={`thumb-${img.url}-${i}`}
                  type="button"
                  onClick={() => setActivePhoto(idx)}
                  className={`h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 ${
                    idx === activePhoto ? "border-accent" : "border-transparent"
                  }`}
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              );
            })}
            {photos.length > 8 && !showAllPhotos ? (
              <button
                type="button"
                onClick={() => setShowAllPhotos(true)}
                className="flex h-16 w-28 shrink-0 items-center justify-center rounded-xl bg-primary text-xs font-semibold text-primary-foreground"
              >
                +{photos.length - 8} photos
              </button>
            ) : null}
          </div>
        ) : null}

        {/* Header */}
        <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-3xl tracking-tight text-primary sm:text-4xl">
                {name}
              </h1>
              {starsLabel(details?.starRating) ? (
                <span className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700">
                  {starsLabel(details?.starRating)}
                </span>
              ) : null}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {[details?.address, details?.city, details?.zip, details?.country?.toUpperCase()]
                .filter(Boolean)
                .join(" · ")}
            </p>
            {mapUrl ? (
              <a
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm font-medium text-accent-deep underline-offset-2 hover:underline"
              >
                Open in Maps
              </a>
            ) : null}
          </div>
          {search.checkin && search.checkout ? (
            <div className="rounded-2xl border border-border bg-white px-4 py-3 text-sm shadow-sm">
              <div className="text-muted-foreground">Your stay</div>
              <div className="font-semibold text-primary">
                {search.checkin} → {search.checkout}
              </div>
              <div className="text-muted-foreground">{search.adults ?? 2} guests</div>
            </div>
          ) : null}
        </div>

        {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-10">
            {/* About */}
            {details?.hotelDescription ? (
              <section>
                <h2 className="font-display text-xl text-primary">About this stay</h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-foreground/80">
                  {details.hotelDescription}
                </p>
              </section>
            ) : null}

            {/* Amenities */}
            {amenities.length ? (
              <section>
                <h2 className="font-display text-xl text-primary">Amenities</h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {visibleAmenities.map((a) => (
                    <li
                      key={a}
                      className="flex items-start gap-2 rounded-xl bg-white px-3 py-2 text-sm text-foreground/85 shadow-sm ring-1 ring-border/70"
                    >
                      <span className="mt-0.5 text-accent">✓</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
                {amenities.length > 18 ? (
                  <button
                    type="button"
                    onClick={() => setShowAllAmenities((v) => !v)}
                    className="mt-4 text-sm font-semibold text-accent-deep underline-offset-2 hover:underline"
                  >
                    {showAllAmenities
                      ? "Show fewer amenities"
                      : `Show all ${amenities.length} amenities`}
                  </button>
                ) : null}
              </section>
            ) : null}

            {/* Policies */}
            {(checkinTime || checkoutTime || details?.hotelImportantInformation) && (
              <section>
                <h2 className="font-display text-xl text-primary">Good to know</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {checkinTime ? (
                    <div className="rounded-2xl border border-border bg-white p-4">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">
                        Check-in
                      </div>
                      <div className="mt-1 font-display text-lg text-primary">{checkinTime}</div>
                      {checkinEnd ? (
                        <div className="text-xs text-muted-foreground">Until {checkinEnd}</div>
                      ) : null}
                    </div>
                  ) : null}
                  {checkoutTime ? (
                    <div className="rounded-2xl border border-border bg-white p-4">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">
                        Check-out
                      </div>
                      <div className="mt-1 font-display text-lg text-primary">{checkoutTime}</div>
                    </div>
                  ) : null}
                </div>
                {details?.hotelImportantInformation ? (
                  <p className="mt-4 whitespace-pre-line rounded-2xl bg-amber-50/80 p-4 text-sm leading-relaxed text-amber-950/80 ring-1 ring-amber-100">
                    {details.hotelImportantInformation}
                  </p>
                ) : null}
              </section>
            )}

            {/* Room catalogue from static content */}
            {details?.rooms?.length ? (
              <section>
                <h2 className="font-display text-xl text-primary">Rooms</h2>
                <div className="mt-4 space-y-4">
                  {details.rooms.map((room) => {
                    const roomPhoto = room.photos?.[0]?.urlHd || room.photos?.[0]?.url;
                    const beds = (room.bedTypes ?? [])
                      .map((b) => [b.quantity, b.bedType, b.bedSize].filter(Boolean).join(" "))
                      .filter(Boolean)
                      .join(" · ");
                    const roomAmenities = (room.roomAmenities ?? [])
                      .map(amenityName)
                      .filter(Boolean)
                      .slice(0, 8);
                    return (
                      <article
                        key={String(room.id ?? room.roomName)}
                        className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
                      >
                        <div className="grid gap-0 sm:grid-cols-[180px_1fr]">
                          {roomPhoto ? (
                            <img
                              src={roomPhoto}
                              alt={room.roomName || ""}
                              className="h-40 w-full object-cover sm:h-full"
                            />
                          ) : (
                            <div className="flex h-40 items-center justify-center bg-primary/5 text-sm text-muted-foreground sm:h-full">
                              Room
                            </div>
                          )}
                          <div className="p-4">
                            <h3 className="font-display text-lg text-primary">
                              {room.roomName || "Room"}
                            </h3>
                            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                              {room.maxOccupancy ? (
                                <span>Up to {room.maxOccupancy} guests</span>
                              ) : null}
                              {room.roomSizeSquare ? (
                                <span>
                                  {room.roomSizeSquare} {room.roomSizeUnit || "m²"}
                                </span>
                              ) : null}
                              {beds ? <span>{beds}</span> : null}
                              {room.views?.length ? (
                                <span>View: {room.views.join(", ")}</span>
                              ) : null}
                            </div>
                            {room.description ? (
                              <p className="mt-2 line-clamp-3 text-sm text-foreground/75">
                                {room.description}
                              </p>
                            ) : null}
                            {roomAmenities.length ? (
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {roomAmenities.map((a) => (
                                  <span
                                    key={a}
                                    className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-muted-foreground"
                                  >
                                    {a}
                                  </span>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ) : null}

            {/* Reviews */}
            {reviews.length ? (
              <section>
                <h2 className="font-display text-xl text-primary">Guest reviews</h2>
                <div className="mt-4 space-y-3">
                  {reviews.map((r, i) => (
                    <article
                      key={`${r.name}-${r.date}-${i}`}
                      className="rounded-2xl border border-border bg-white p-4 shadow-sm"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="font-semibold text-primary">
                          {r.name || "Guest"}
                          {r.country ? (
                            <span className="ml-2 text-xs font-normal uppercase text-muted-foreground">
                              {r.country}
                            </span>
                          ) : null}
                        </div>
                        {r.averageScore != null ? (
                          <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-sm font-semibold text-accent-deep">
                            {r.averageScore}/10
                          </span>
                        ) : null}
                      </div>
                      {r.headline ? (
                        <div className="mt-1 text-sm font-medium">{r.headline}</div>
                      ) : null}
                      <div className="mt-1 text-xs text-muted-foreground">
                        {[r.type?.replace(/_/g, " "), r.date?.slice(0, 10)]
                          .filter(Boolean)
                          .join(" · ")}
                      </div>
                      {r.pros ? (
                        <p className="mt-2 text-sm text-foreground/80">
                          <span className="font-medium text-emerald-700">Pros:</span> {r.pros}
                        </p>
                      ) : null}
                      {r.cons ? (
                        <p className="mt-1 text-sm text-foreground/80">
                          <span className="font-medium text-destructive">Cons:</span> {r.cons}
                        </p>
                      ) : null}
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          {/* Rates sidebar */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-3xl border border-border bg-white p-5 shadow-md">
              <h2 className="font-display text-xl text-primary">Available rates</h2>
              {!search.checkin || !search.checkout ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Add check-in and check-out dates to see live prices.
                </p>
              ) : null}
              <div className="mt-4 space-y-4">
                {grouped.length === 0 && search.checkin ? (
                  <p className="text-sm text-muted-foreground">Checking availability…</p>
                ) : null}
                {grouped.map(([roomKey, roomRates]) => (
                  <div key={roomKey} className="rounded-2xl border border-border/80 p-3">
                    <h3 className="text-sm font-semibold text-primary">{roomRates[0]?.name}</h3>
                    <ul className="mt-2 space-y-2">
                      {roomRates.map((r) => (
                        <li
                          key={r.offerId}
                          className="flex items-center justify-between gap-3 border-t border-border/60 pt-2 first:border-0 first:pt-0"
                        >
                          <div>
                            <div className="text-xs text-muted-foreground">
                              {r.board ?? "Room only"}
                            </div>
                            <div className="font-display text-lg text-primary">
                              {r.price != null ? formatEur(r.price) : "—"}
                            </div>
                          </div>
                          <button
                            type="button"
                            disabled={busy === r.offerId}
                            onClick={() => void onBook(r.offerId)}
                            className="rounded-xl bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground disabled:opacity-50"
                          >
                            {busy === r.offerId ? "…" : "Select"}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                After booking, you can add a private airport transfer with TransferAround.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
