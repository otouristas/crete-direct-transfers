import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { format, parseISO, subHours } from "date-fns";
import { dateFnsLocale } from "@/lib/date-locale";
import { VEHICLE_CLASSES, getRoute, type VehicleClass } from "@/data/routes";
import {
  quoteAllClasses,
  quoteHourly,
  quoteTrip,
  formatEur,
  bagCapacity,
  type Extras,
  type TripType,
} from "@/lib/pricing";
import { fetchTripRoute, type TripGeometry } from "@/lib/trip-route";
import {
  matchRouteSlug,
  placeCountry,
  searchLocalPlaces,
  type PlaceResult,
} from "@/lib/place-search";
import { getIataAirport } from "@/data/iata-airports";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/queries/profile";
import { CounterInput } from "@/components/counter-input";
import { LocationPicker, type PickedLocation } from "@/components/location-picker";
import { PlaceCombobox } from "@/components/place-combobox";
import { BookingRouteMap } from "@/components/booking/booking-route-map";
import { BookingVehicleList } from "@/components/booking/booking-vehicle-list";
import { BookingSummary, FreeCancelBanner } from "@/components/booking/booking-summary";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { getDict, type Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { ArrowLeftRight, ChevronUp, Info } from "lucide-react";
import { createAndPersistQuote } from "@/lib/quote-engine";
import { createCheckoutSession } from "@/functions/stripe";
import { attachReferral } from "@/lib/referrals";
import { cn } from "@/lib/utils";
import { trackAnalyticsEvent } from "@/lib/cookie-consent";
import { marketFromCountryCode } from "@/lib/dispatch";

const vehicleClassEnum = z.enum([
  "economy",
  "comfort",
  "luxury",
  "suv",
  "minivan",
  "van-first",
  "minibus-12",
  "minibus-16",
]);

/** Duplicate ?class=a&class=b becomes an array in the router; take the last value. */
const vehicleClassParam = z.preprocess((v) => {
  if (Array.isArray(v)) return v[v.length - 1];
  return v;
}, vehicleClassEnum.optional());

const searchSchema = z.object({
  route: z.string().optional(),
  class: vehicleClassParam,
  date: z.string().optional(),
  pax: z.coerce.number().optional(),
  trip: z.enum(["oneway", "return"]).optional(),
  returnDate: z.string().optional(),
  flight: z.string().optional(),
  bagsChecked: z.coerce.number().min(0).max(20).optional(),
  bagsCabin: z.coerce.number().min(0).max(20).optional(),
  pickupAddress: z.string().optional(),
  dropoffAddress: z.string().optional(),
  pickupLat: z.coerce.number().optional(),
  pickupLng: z.coerce.number().optional(),
  dropoffLat: z.coerce.number().optional(),
  dropoffLng: z.coerce.number().optional(),
  ref: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  service: z.enum(["transfer", "hourly"]).optional(),
  hours: z.coerce.number().min(2).max(12).optional(),
});

export const Route = createFileRoute("/{-$locale}/book")({
  validateSearch: searchSchema,
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/book",
      title: t.bookPage.metaTitle,
      description: t.bookPage.metaDescription,
      noindex: true,
    });
  },
  component: BookPage,
});

const detailsSchema = z.object({
  customer_name: z.string().trim().min(2, "Please enter your name").max(100),
  customer_email: z.string().trim().email("Please enter a valid email").max(255),
  customer_phone: z.string().trim().min(5, "Please enter your phone").max(30),
  flight_number: z.string().trim().max(20).optional().or(z.literal("")),
  return_flight_number: z.string().trim().max(20).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

function placeFromSearch(label?: string, lat?: number, lng?: number): PlaceResult | null {
  if (!label && lat == null) return null;

  // Resolve IATA from label like "Athens Airport (ATH)"
  const iataMatch = label?.match(/\(([A-Z]{3})\)\s*$/);
  if (iataMatch) {
    const a = getIataAirport(iataMatch[1]);
    if (a) {
      return {
        id: `airport:${a.iata}`,
        label: a.label,
        kind: "airport",
        lat: a.lat,
        lng: a.lng,
        iata: a.iata,
        countryCode: a.countryCode,
        countryName: a.countryName,
      };
    }
  }

  if (lat != null && lng != null) {
    const local = label ? searchLocalPlaces(label, 5) : [];
    const hit = local.find(
      (p) =>
        p.lat != null &&
        p.lng != null &&
        Math.abs(p.lat - lat) < 0.05 &&
        Math.abs(p.lng - lng) < 0.05,
    );
    if (hit) return hit;
    return {
      id: `map:${lat.toFixed(4)},${lng.toFixed(4)}`,
      label: label || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      kind: "address",
      lat,
      lng,
    };
  }
  if (label) {
    const hit = searchLocalPlaces(label, 1)[0];
    if (hit && hit.label.toLowerCase().includes(label.toLowerCase().slice(0, 8))) return hit;
    return { id: `label:${label}`, label, kind: "address" };
  }
  return null;
}

function formatClock(iso: string): string {
  if (!iso) return "";
  try {
    return format(parseISO(iso), "HH:mm");
  } catch {
    return "";
  }
}

function formatDay(iso: string): string {
  if (!iso) return "";
  try {
    return format(parseISO(iso), "d MMM yyyy", { locale: dateFnsLocale(locale) });
  } catch {
    return "";
  }
}

function etaTime(pickupIso: string, durationMin?: number): string {
  if (!pickupIso || durationMin == null) return "";
  try {
    const d = parseISO(pickupIso);
    d.setMinutes(d.getMinutes() + durationMin);
    return format(d, "HH:mm");
  } catch {
    return "";
  }
}

function BookPage() {
  const search = Route.useSearch();
  const { locale } = Route.useRouteContext();
  const t = getDict(locale);
  const navigate = useNavigate();
  const bp = t.bookPage;

  const [step, setStep] = useState<1 | 2>(1);
  const [service, setService] = useState<"transfer" | "hourly">(search.service ?? "transfer");
  const [hours, setHours] = useState(search.hours ?? 6);
  const [tripType, setTripType] = useState<TripType>(
    search.service === "hourly" ? "oneway" : (search.trip ?? "oneway"),
  );
  const [vehicleClass, setVehicleClass] = useState<VehicleClass>(search.class ?? "economy");
  const [pickupAt, setPickupAt] = useState(search.date ?? "");
  const [returnAt, setReturnAt] = useState(search.returnDate ?? "");
  const [passengers, setPassengers] = useState(search.pax ?? 2);
  const [bagsChecked, setBagsChecked] = useState(search.bagsChecked ?? 2);
  const [bagsCabin, setBagsCabin] = useState(search.bagsCabin ?? 2);
  const [extras, setExtras] = useState<Extras>({});
  const [editingPlaces, setEditingPlaces] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const summarySwipeY = useRef<number | null>(null);

  const initialFrom = placeFromSearch(search.pickupAddress, search.pickupLat, search.pickupLng);
  const initialTo = placeFromSearch(search.dropoffAddress, search.dropoffLat, search.dropoffLng);

  const [fromQuery, setFromQuery] = useState(search.pickupAddress ?? initialFrom?.label ?? "");
  const [toQuery, setToQuery] = useState(search.dropoffAddress ?? initialTo?.label ?? "");
  const [fromPlace, setFromPlace] = useState<PlaceResult | null>(initialFrom);
  const [toPlace, setToPlace] = useState<PlaceResult | null>(initialTo);
  const [pickupPoint, setPickupPoint] = useState<PickedLocation | null>(
    search.pickupLat != null && search.pickupLng != null
      ? { lat: search.pickupLat, lng: search.pickupLng }
      : initialFrom?.lat != null && initialFrom?.lng != null
        ? { lat: initialFrom.lat, lng: initialFrom.lng }
        : null,
  );
  const [dropoffPoint, setDropoffPoint] = useState<PickedLocation | null>(
    search.dropoffLat != null && search.dropoffLng != null
      ? { lat: search.dropoffLat, lng: search.dropoffLng }
      : initialTo?.lat != null && initialTo?.lng != null
        ? { lat: initialTo.lat, lng: initialTo.lng }
        : null,
  );
  const [openPicker, setOpenPicker] = useState<"pickup" | "dropoff" | null>(null);

  const [routeInfo, setRouteInfo] = useState<{
    distanceKm: number;
    durationMin: number;
    geometry: TripGeometry;
    routeSlug?: string;
  } | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);

  const [details, setDetails] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    flight_number: search.flight ?? "",
    return_flight_number: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { user } = useAuth();
  const profile = useProfile();

  useEffect(() => {
    if (!user) return;
    setDetails((d) => ({
      ...d,
      customer_name: d.customer_name || profile.data?.full_name || "",
      customer_email: d.customer_email || user.email || "",
      customer_phone: d.customer_phone || profile.data?.phone || "",
    }));
  }, [user, profile.data]);

  const fromCoords = useMemo(
    () =>
      fromPlace?.lat != null && fromPlace?.lng != null
        ? { lat: fromPlace.lat, lng: fromPlace.lng }
        : pickupPoint,
    [fromPlace?.lat, fromPlace?.lng, pickupPoint],
  );
  const toCoords = useMemo(
    () =>
      toPlace?.lat != null && toPlace?.lng != null
        ? { lat: toPlace.lat, lng: toPlace.lng }
        : dropoffPoint,
    [toPlace?.lat, toPlace?.lng, dropoffPoint],
  );

  const isHourly = service === "hourly";

  useEffect(() => {
    if (isHourly) {
      setRouteInfo(null);
      setRouteLoading(false);
      return;
    }
    const matched = matchRouteSlug(fromPlace, toPlace) ?? search.route;

    if (!fromCoords || !toCoords) {
      if (matched) {
        const r = getRoute(matched);
        setRouteInfo(
          r
            ? {
                distanceKm: r.distanceKm,
                durationMin: r.durationMin,
                geometry: [],
                routeSlug: matched,
              }
            : { distanceKm: 0, durationMin: 0, geometry: [], routeSlug: matched },
        );
      } else {
        setRouteInfo(null);
      }
      setRouteLoading(false);
      return;
    }

    let cancelled = false;
    setRouteLoading(true);
    fetchTripRoute(fromCoords, toCoords).then((trip) => {
      if (cancelled) return;
      setRouteInfo({
        ...trip,
        routeSlug: matched,
      });
      setRouteLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [isHourly, fromPlace, toPlace, fromCoords, toCoords, search.route]);

  const classQuotes = useMemo(() => {
    if (isHourly) {
      return VEHICLE_CLASSES.flatMap((vc) => {
        const hq = quoteHourly({
          hours,
          vehicleClass: vc.id,
          pickupAt: pickupAt ? new Date(pickupAt) : undefined,
        });
        if (!hq) return [];
        return [
          {
            vehicleClass: vc.id,
            quote: {
              routeSlug: `hourly-${hours}h`,
              vehicleClass: vc.id,
              tripType: "oneway" as const,
              currency: "EUR" as const,
              breakdown: hq.breakdown,
              totalEur: hq.totalEur,
              source: "distance" as const,
            },
          },
        ];
      });
    }

    const matched = routeInfo?.routeSlug || matchRouteSlug(fromPlace, toPlace) || search.route;
    const hasDistance = routeInfo && routeInfo.distanceKm > 0;
    if (!matched && !hasDistance) return [];

    return quoteAllClasses({
      routeSlug: matched,
      distanceKm: hasDistance ? routeInfo!.distanceKm : undefined,
      durationMin: hasDistance ? routeInfo!.durationMin : undefined,
      pickupAt: pickupAt ? new Date(pickupAt) : undefined,
      returnAt: returnAt ? new Date(returnAt) : undefined,
      tripType,
      extras,
    });
  }, [
    isHourly,
    hours,
    routeInfo,
    fromPlace,
    toPlace,
    search.route,
    pickupAt,
    returnAt,
    tripType,
    extras,
  ]);

  const q = useMemo(() => {
    const row = classQuotes.find((c) => c.vehicleClass === vehicleClass);
    if (row) return row.quote;
    return quoteTrip({
      routeSlug: routeInfo?.routeSlug || search.route,
      distanceKm: routeInfo?.distanceKm,
      durationMin: routeInfo?.durationMin,
      vehicleClass,
      pickupAt: pickupAt ? new Date(pickupAt) : undefined,
      returnAt: returnAt ? new Date(returnAt) : undefined,
      tripType,
      extras,
    });
  }, [classQuotes, vehicleClass, routeInfo, search.route, pickupAt, returnAt, tripType, extras]);

  const overCapacity = bagsChecked > bagCapacity(vehicleClass);
  const canContinue =
    !!pickupAt &&
    !!q &&
    (isHourly
      ? true
      : !!fromCoords &&
        !!toCoords &&
        (!!routeInfo?.routeSlug || (routeInfo?.distanceKm ?? 0) > 0 || routeLoading));

  const proceed = () => {
    const errs: Record<string, string> = {};
    if (!pickupAt) errs.pickupAt = "Please pick a date and time";
    if (!isHourly && tripType === "return" && !returnAt) {
      errs.returnAt = "Please pick your return date and time";
    }
    if (!isHourly && (!fromCoords || !toCoords)) {
      errs.places = bp.needPlaces;
    }
    if (!q) errs.quote = bp.needQuote;
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setEditingPlaces(true);
      return;
    }
    setErrors({});
    setStep(2);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = detailsSchema.safeParse(details);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errs[issue.path.join(".")] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    setSubmitError(null);

    if (!q) {
      setSubmitting(false);
      setSubmitError("Unable to calculate price. Please try again.");
      return;
    }

    const hourlyNote = isHourly
      ? `Hourly chauffeur · ${hours}h${parsed.data.notes ? ` · ${parsed.data.notes}` : ""}`
      : parsed.data.notes || null;

    const routeSlug = isHourly
      ? `hourly-${hours}h`
      : routeInfo?.routeSlug ||
        search.route ||
        `distance-${Math.round(routeInfo?.distanceKm ?? 0)}km`;

    let quoteId: string | null = null;
    let lockedPriceCents = q.totalEur * 100;
    let bookableMode: "instant" | "quote" = "instant";
    const countryCode = placeCountry(fromPlace) ?? placeCountry(toPlace);
    const market = marketFromCountryCode(countryCode);
    try {
      const persisted = await createAndPersistQuote({
        service: isHourly ? "hourly" : "transfer",
        routeSlug,
        vehicleClass,
        tripType: isHourly ? "oneway" : tripType,
        extras,
        pickupAt: new Date(pickupAt).toISOString(),
        returnAt:
          !isHourly && tripType === "return" && returnAt ? new Date(returnAt).toISOString() : null,
        distanceKm: routeInfo?.distanceKm ?? null,
        durationMin: routeInfo?.durationMin ?? null,
        hours: isHourly ? hours : null,
        market,
      });
      quoteId = persisted.quoteId;
      lockedPriceCents = persisted.priceCents;
      bookableMode = persisted.bookableMode;
    } catch {
      // Quote persistence optional until migration is applied; fall back to client price.
    }

    const base = {
      route_slug: routeSlug,
      vehicle_class: vehicleClass,
      passengers,
      pickup_at: new Date(pickupAt).toISOString(),
      customer_name: parsed.data.customer_name,
      customer_email: parsed.data.customer_email,
      customer_phone: parsed.data.customer_phone,
      flight_number: parsed.data.flight_number || null,
      notes: hourlyNote,
      extras: extras as never,
      price_cents: lockedPriceCents,
      currency: "EUR",
      status: "pending",
      user_id: user?.id ?? null,
      quote_id: quoteId,
      payment_status: "unpaid" as const,
      market,
      locale,
    };
    const v2 = {
      trip_type: isHourly ? "oneway" : tripType,
      return_at:
        !isHourly && tripType === "return" && returnAt ? new Date(returnAt).toISOString() : null,
      return_flight_number: parsed.data.return_flight_number || null,
      bags_checked: bagsChecked,
      bags_cabin: bagsCabin,
      pickup_address: fromQuery.trim() || fromPlace?.label || null,
      dropoff_address: isHourly ? null : toQuery.trim() || toPlace?.label || null,
      pickup_point: fromCoords ?? null,
      dropoff_point: isHourly ? null : (toCoords ?? null),
    };

    let { data, error } = await supabase
      .from("bookings")
      .insert({ ...base, ...v2 } as never)
      .select("id")
      .single();

    if (error && user && /user_id/i.test(error.message)) {
      const { user_id: _omit, ...withoutUser } = { ...base, ...v2 };
      void _omit;
      ({ data, error } = await supabase
        .from("bookings")
        .insert(withoutUser as never)
        .select("id")
        .single());
    }

    setSubmitting(false);
    if (error || !data) {
      setSubmitError(error?.message ?? "Something went wrong. Please try again.");
      return;
    }

    try {
      await attachReferral(data.id, search.ref);
    } catch {
      /* referral is best-effort */
    }

    trackAnalyticsEvent(
      bookableMode === "instant" ? "Booking Submitted" : "Quote Request Submitted",
      {
        locale,
        market,
        trip_type: isHourly ? "hourly" : tripType,
        vehicle_class: vehicleClass,
      },
    );

    if (bookableMode === "instant") {
      try {
        const checkout = await createCheckoutSession({
          data: {
            bookingId: data.id,
            locale,
          },
        });
        if (!checkout.skipped && checkout.url) {
          trackAnalyticsEvent("Checkout Started", { locale, market, vehicle_class: vehicleClass });
          window.location.href = checkout.url;
          return;
        }
      } catch {
        // Fall through to success without prepaid checkout
      }
    }

    navigate({ to: "/{-$locale}/book/success", search: { id: data.id } });
  };

  const kindLabels = {
    airport: bp.kindAirport,
    port: bp.kindPort,
    destination: bp.kindPlace,
    "route-end": bp.kindRoute,
    address: bp.kindAddress,
  };

  const groupLabels = {
    airport: bp.groupAirports,
    port: bp.groupPorts,
    popular: bp.groupPopular,
    "in-country": bp.groupInCountry,
  };

  const summaryLabels = {
    yourBooking: bp.yourBooking,
    passengers: t.widget.passengers,
    outward: bp.outward,
    edit: bp.editTrip,
    addReturn: t.widget.addReturn,
    priceDetails: bp.priceDetails,
    total: t.common.total,
    freeCancel: bp.freeCancel,
    doorToDoor: bp.doorToDoor,
    meetGreet: bp.meetGreetShort,
    flightTracking: bp.flightTracking,
    licensed: bp.licensed,
    yourChoice: bp.yourChoice,
  };

  const vehicleLabel = VEHICLE_CLASSES.find((v) => v.id === vehicleClass)?.label;
  const fromLabel = fromPlace?.label || fromQuery || "—";
  const toLabel = toPlace?.label || toQuery || "—";
  const durationMin = q && "durationMin" in q ? q.durationMin : routeInfo?.durationMin;
  const distanceKm = q && "distanceKm" in q ? q.distanceKm : routeInfo?.distanceKm;

  const cancelDeadline = pickupAt
    ? (() => {
        try {
          return format(subHours(parseISO(pickupAt), 24), "d MMMM yyyy HH:mm", {
            locale: dateFnsLocale(locale),
          });
        } catch {
          return "";
        }
      })()
    : "";

  const showPlaceEditor = editingPlaces || (!fromCoords && !isHourly) || (!toCoords && !isHourly);

  return (
    <div className="w-full bg-muted/30 pb-28 md:pb-14 md:pt-8">
      <h1 className="sr-only">{bp.metaTitle}</h1>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center gap-3 pt-4 text-sm text-muted-foreground md:pt-0">
          <span className={step >= 1 ? "font-semibold text-accent-deep" : ""}>
            1. {bp.stepTrip}
          </span>
          <span>·</span>
          <span className={step >= 2 ? "font-semibold text-accent-deep" : ""}>
            2. {bp.stepDetails}
          </span>
        </div>

        {step === 1 ? (
          <div className="lg:grid lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-8">
              {!isHourly && (
                <BookingRouteMap
                  pickup={
                    fromCoords
                      ? {
                          lat: fromCoords.lat,
                          lng: fromCoords.lng,
                          label: fromLabel,
                          timeLabel: formatClock(pickupAt),
                          kind: "pickup",
                        }
                      : null
                  }
                  dropoff={
                    toCoords
                      ? {
                          lat: toCoords.lat,
                          lng: toCoords.lng,
                          label: toLabel,
                          timeLabel: etaTime(pickupAt, durationMin),
                          kind: "dropoff",
                        }
                      : null
                  }
                  geometry={routeInfo?.geometry}
                  className="h-[42vh] w-full md:h-[340px] lg:h-[400px]"
                />
              )}

              <div
                className={cn(
                  "relative z-10 space-y-5 rounded-t-2xl bg-card px-4 pb-8 pt-5 shadow-sm md:space-y-6 md:rounded-xl md:bg-transparent md:px-0 md:pb-0 md:pt-0 md:shadow-none",
                  isHourly ? "mt-0" : "-mt-6 md:mt-5",
                )}
              >
                <p className="text-center text-xs text-muted-foreground sm:text-sm">
                  {bp.pricesInclude}
                </p>

                {showPlaceEditor && (
                  <div className="space-y-4 rounded-xl border border-border bg-card p-4 sm:p-5">
                    <div className="grid max-w-xs grid-cols-2 gap-1 rounded-xl bg-muted p-1">
                      {(
                        [
                          ["transfer", t.widget.transfer],
                          ["hourly", t.widget.byTheHour],
                        ] as const
                      ).map(([id, label]) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => {
                            setService(id);
                            if (id === "hourly") setTripType("oneway");
                          }}
                          className={cn(
                            "rounded-lg py-2 text-sm font-semibold transition",
                            service === id
                              ? "bg-card text-primary shadow-sm"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    <div className={cn("grid gap-4", !isHourly && "md:grid-cols-2")}>
                      <PlaceCombobox
                        variant="field"
                        label={t.widget.from}
                        placeholder={t.widget.placePlaceholder}
                        value={fromQuery}
                        selected={fromPlace}
                        kindLabels={kindLabels}
                        groupLabels={groupLabels}
                        contextPlace={toPlace}
                        onQueryChange={(q) => {
                          setFromQuery(q);
                          setFromPlace(null);
                        }}
                        onSelect={(place) => {
                          setFromPlace(place);
                          setFromQuery(place.label);
                          if (place.lat != null && place.lng != null) {
                            setPickupPoint({ lat: place.lat, lng: place.lng });
                          }
                        }}
                        onPinOnMap={() => setOpenPicker("pickup")}
                        pinLabel={t.widget.pinOnMap}
                        noPlacesLabel={t.widget.noPlaces}
                      />
                      {!isHourly && (
                        <PlaceCombobox
                          variant="field"
                          label={t.widget.to}
                          placeholder={t.widget.placePlaceholder}
                          value={toQuery}
                          selected={toPlace}
                          kindLabels={kindLabels}
                          groupLabels={groupLabels}
                          contextPlace={fromPlace}
                          onQueryChange={(q) => {
                            setToQuery(q);
                            setToPlace(null);
                          }}
                          onSelect={(place) => {
                            setToPlace(place);
                            setToQuery(place.label);
                            if (place.lat != null && place.lng != null) {
                              setDropoffPoint({ lat: place.lat, lng: place.lng });
                            }
                          }}
                          onPinOnMap={() => setOpenPicker("dropoff")}
                          pinLabel={t.widget.pinOnMap}
                          noPlacesLabel={t.widget.noPlaces}
                        />
                      )}
                    </div>

                    {openPicker && (
                      <div className="space-y-2">
                        <LocationPicker
                          key={openPicker}
                          value={openPicker === "pickup" ? pickupPoint : dropoffPoint}
                          onPick={(point, address) => {
                            if (openPicker === "pickup") {
                              setPickupPoint(point);
                              setFromQuery(address);
                              setFromPlace({
                                id: `map:from`,
                                label: address,
                                kind: "address",
                                lat: point.lat,
                                lng: point.lng,
                              });
                            } else {
                              setDropoffPoint(point);
                              setToQuery(address);
                              setToPlace({
                                id: `map:to`,
                                label: address,
                                kind: "address",
                                lat: point.lat,
                                lng: point.lng,
                              });
                            }
                            setOpenPicker(null);
                          }}
                        />
                        <p className="text-xs text-muted-foreground">{bp.pinHint}</p>
                      </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label={t.widget.pickupDate} error={errors.pickupAt}>
                        <input
                          type="datetime-local"
                          value={pickupAt}
                          onChange={(e) => setPickupAt(e.target.value)}
                          className="input"
                        />
                      </Field>
                      {!isHourly && tripType === "return" && (
                        <Field label={t.widget.returnDate} error={errors.returnAt}>
                          <input
                            type="datetime-local"
                            value={returnAt}
                            min={pickupAt || undefined}
                            onChange={(e) => setReturnAt(e.target.value)}
                            className="input"
                          />
                        </Field>
                      )}
                    </div>

                    {isHourly && (
                      <CounterInput
                        label={t.widget.hours}
                        value={hours}
                        onChange={setHours}
                        min={2}
                        max={12}
                      />
                    )}

                    <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
                      <CounterInput
                        label={t.widget.passengers}
                        value={passengers}
                        onChange={setPassengers}
                        min={1}
                        max={16}
                      />
                      <CounterInput
                        label={t.widget.checkedBags}
                        value={bagsChecked}
                        onChange={setBagsChecked}
                        max={20}
                      />
                      <CounterInput
                        label={t.widget.cabinBags}
                        value={bagsCabin}
                        onChange={setBagsCabin}
                        max={20}
                      />
                    </div>

                    {(errors.places || errors.quote) && (
                      <p className="text-sm text-destructive">{errors.places || errors.quote}</p>
                    )}

                    {(fromCoords || isHourly) && (toCoords || isHourly) && (
                      <button
                        type="button"
                        onClick={() => setEditingPlaces(false)}
                        className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
                      >
                        {bp.seeVehicles}
                      </button>
                    )}
                  </div>
                )}

                <BookingVehicleList
                  quotes={classQuotes}
                  selected={vehicleClass}
                  onSelect={setVehicleClass}
                  loading={routeLoading}
                  labels={{
                    totalPrice: bp.totalPrice,
                    upTo: bp.upTo,
                    bestValue: bp.bestValue,
                    mostPopular: bp.mostPopular,
                    topClass: bp.topClass,
                  }}
                />

                {!isHourly && tripType === "oneway" && (
                  <button
                    type="button"
                    onClick={() => setTripType("return")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-accent/40 py-3 text-sm font-semibold text-foreground transition hover:border-accent hover:bg-accent/5"
                  >
                    <ArrowLeftRight className="h-4 w-4 text-accent" />
                    {bp.roundTripCta}
                  </button>
                )}

                {!isHourly && tripType === "return" && (
                  <div className="space-y-2 rounded-xl border border-border bg-muted/40 p-4 sm:p-5">
                    <Field label={t.widget.returnDate} error={errors.returnAt}>
                      <input
                        type="datetime-local"
                        value={returnAt}
                        min={pickupAt || undefined}
                        onChange={(e) => setReturnAt(e.target.value)}
                        className="input"
                      />
                    </Field>
                    <button
                      type="button"
                      className="text-xs text-muted-foreground underline"
                      onClick={() => {
                        setTripType("oneway");
                        setReturnAt("");
                      }}
                    >
                      {t.widget.removeReturn}
                    </button>
                  </div>
                )}

                {overCapacity && (
                  <p className="flex items-start gap-2 rounded-xl bg-highlight/10 px-3.5 py-2.5 text-xs text-foreground/80">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-highlight" />
                    {t.widget.minivanHint}
                  </p>
                )}

                <Field label={bp.extrasTitle}>
                  <div className="space-y-2.5 text-sm">
                    {(
                      [
                        ["childSeat", `${bp.childSeat} (+€10)`],
                        ["extraStop", `${bp.extraStop} (+€15)`],
                        ["meetAndGreet", `${bp.meetGreet} (+€10)`],
                      ] as const
                    ).map(([key, label]) => (
                      <label key={key} className="flex cursor-pointer items-center gap-3">
                        <input
                          type="checkbox"
                          checked={!!extras[key]}
                          onChange={(e) => setExtras({ ...extras, [key]: e.target.checked })}
                          className="accent-accent"
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </Field>

                <FreeCancelBanner
                  title={bp.freeCancelTitle}
                  body={
                    cancelDeadline ? (
                      <>
                        {bp.freeCancelBodyBefore}{" "}
                        <strong className="font-semibold text-emerald-900">{cancelDeadline}</strong>{" "}
                        {bp.freeCancelBodyAfter}
                      </>
                    ) : (
                      bp.freeCancelBodyGeneric
                    )
                  }
                />
              </div>
            </div>

            <div className="relative mt-8 hidden lg:col-span-4 lg:mt-0 lg:block">
              <BookingSummary
                className="sticky top-20 z-30"
                tripLabel={tripType === "return" ? t.widget.return : t.widget.oneWay}
                passengers={passengers}
                dateLabel={formatDay(pickupAt)}
                fromLabel={fromLabel}
                toLabel={isHourly ? `${hours}h` : toLabel}
                fromTime={formatClock(pickupAt)}
                toTime={etaTime(pickupAt, durationMin)}
                distanceKm={distanceKm}
                durationMin={durationMin}
                totalEur={q?.totalEur}
                vehicleLabel={vehicleLabel}
                onEdit={() => setEditingPlaces(true)}
                onAddReturn={() => setTripType("return")}
                showAddReturn={!isHourly && tripType === "oneway"}
                onContinue={proceed}
                continueDisabled={!canContinue || !q}
                continueLabel={bp.continue}
                labels={summaryLabels}
              />
            </div>
          </div>
        ) : (
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_340px]">
            <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-8">
              <h1 className="font-display text-3xl text-primary">{bp.stepDetails}</h1>
              <div className="mt-6 space-y-4">
                <Field label={bp.fullName} error={errors.customer_name}>
                  <input
                    className="input"
                    value={details.customer_name}
                    onChange={(e) => setDetails({ ...details, customer_name: e.target.value })}
                  />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label={bp.emailLabel} error={errors.customer_email}>
                    <input
                      type="email"
                      className="input"
                      value={details.customer_email}
                      onChange={(e) => setDetails({ ...details, customer_email: e.target.value })}
                    />
                  </Field>
                  <Field label={bp.phoneLabel} error={errors.customer_phone}>
                    <input
                      className="input"
                      placeholder="+44 …"
                      value={details.customer_phone}
                      onChange={(e) => setDetails({ ...details, customer_phone: e.target.value })}
                    />
                  </Field>
                </div>
                <div className={cn("grid gap-4", tripType === "return" && "md:grid-cols-2")}>
                  <Field label={`${t.widget.flightNumber} (${t.common.optional})`}>
                    <input
                      className="input"
                      placeholder={t.widget.flightPlaceholder}
                      value={details.flight_number}
                      onChange={(e) => setDetails({ ...details, flight_number: e.target.value })}
                    />
                  </Field>
                  {tripType === "return" && (
                    <Field label={`${bp.returnFlightNumber} (${t.common.optional})`}>
                      <input
                        className="input"
                        placeholder={t.widget.flightPlaceholder}
                        value={details.return_flight_number}
                        onChange={(e) =>
                          setDetails({ ...details, return_flight_number: e.target.value })
                        }
                      />
                    </Field>
                  )}
                </div>
                <Field label={`${bp.notes} (${t.common.optional})`} error={errors.notes}>
                  <textarea
                    className="input min-h-24"
                    placeholder={bp.notesPlaceholder}
                    value={details.notes}
                    onChange={(e) => setDetails({ ...details, notes: e.target.value })}
                  />
                </Field>
              </div>
              {submitError && (
                <div className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  {submitError}
                </div>
              )}
              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-xl border border-border px-5 py-3 text-sm font-medium hover:bg-muted"
                >
                  {bp.back}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
                >
                  {submitting
                    ? bp.submitting
                    : `${bp.confirm} · ${q ? formatEur(q.totalEur) : "—"}`}
                </button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">{bp.payOnArrival}</p>
            </form>

            <BookingSummary
              className="h-fit lg:sticky lg:top-20 lg:z-30"
              tripLabel={tripType === "return" ? t.widget.return : t.widget.oneWay}
              passengers={passengers}
              dateLabel={formatDay(pickupAt)}
              fromLabel={fromLabel}
              toLabel={isHourly ? `${hours}h` : toLabel}
              fromTime={formatClock(pickupAt)}
              toTime={etaTime(pickupAt, durationMin)}
              distanceKm={distanceKm}
              durationMin={durationMin}
              totalEur={q?.totalEur}
              vehicleLabel={vehicleLabel}
              onContinue={() => {}}
              continueDisabled
              continueLabel={bp.continue}
              labels={summaryLabels}
            />
          </div>
        )}
      </div>

      {/* Mobile sticky continue + swipe-up booking summary drawer */}
      {step === 1 && (
        <>
          <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-card shadow-[0_-4px_20px_rgba(0,0,0,.12)] lg:hidden">
            <button
              type="button"
              aria-label={summaryLabels.yourBooking}
              className="flex w-full flex-col items-center pt-2"
              onClick={() => setSummaryOpen(true)}
              onTouchStart={(e) => {
                summarySwipeY.current = e.touches[0]?.clientY ?? null;
              }}
              onTouchEnd={(e) => {
                const start = summarySwipeY.current;
                summarySwipeY.current = null;
                if (start == null) return;
                const end = e.changedTouches[0]?.clientY;
                if (end != null && start - end > 36) setSummaryOpen(true);
              }}
            >
              <span className="h-1 w-10 rounded-full bg-muted-foreground/30" />
              <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                <ChevronUp className="h-3.5 w-3.5" />
                {summaryLabels.yourBooking}
              </span>
            </button>
            <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2">
              <button
                type="button"
                className="min-w-0 flex-1 text-left"
                onClick={() => setSummaryOpen(true)}
              >
                <div className="text-[11px] text-muted-foreground">{t.common.total}</div>
                <div className="text-lg font-semibold tabular-nums">
                  {q ? formatEur(q.totalEur) : "—"}
                </div>
              </button>
              <button
                type="button"
                disabled={!canContinue || !q}
                onClick={proceed}
                className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                {bp.continue}
              </button>
            </div>
          </div>

          <Drawer open={summaryOpen} onOpenChange={setSummaryOpen} shouldScaleBackground={false}>
            <DrawerContent className="max-h-[92vh] lg:hidden">
              <DrawerHeader className="sr-only">
                <DrawerTitle>{summaryLabels.yourBooking}</DrawerTitle>
                <DrawerDescription>{bp.stepTrip}</DrawerDescription>
              </DrawerHeader>
              <div className="overflow-y-auto px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                <BookingSummary
                  className="border-0 bg-transparent p-0 shadow-none"
                  forceActions
                  tripLabel={tripType === "return" ? t.widget.return : t.widget.oneWay}
                  passengers={passengers}
                  dateLabel={formatDay(pickupAt)}
                  fromLabel={fromLabel}
                  toLabel={isHourly ? `${hours}h` : toLabel}
                  fromTime={formatClock(pickupAt)}
                  toTime={etaTime(pickupAt, durationMin)}
                  distanceKm={distanceKm}
                  durationMin={durationMin}
                  totalEur={q?.totalEur}
                  vehicleLabel={vehicleLabel}
                  onEdit={() => {
                    setSummaryOpen(false);
                    setEditingPlaces(true);
                  }}
                  onAddReturn={() => setTripType("return")}
                  showAddReturn={!isHourly && tripType === "oneway"}
                  onContinue={() => {
                    setSummaryOpen(false);
                    proceed();
                  }}
                  continueDisabled={!canContinue || !q}
                  continueLabel={bp.continue}
                  labels={summaryLabels}
                />
              </div>
            </DrawerContent>
          </Drawer>
        </>
      )}

      <style>{`
        .input {
          width: 100%;
          min-height: 46px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 15px;
          line-height: 1.3;
          outline: none;
        }
        .input:focus { border-color: var(--accent); }
        .leaflet-popup-content-wrapper { padding: 0; border-radius: 6px; overflow: hidden; }
        .leaflet-popup-content { margin: 0; }
        .leaflet-popup-tip { display: none; }
      `}</style>
    </div>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(className)}>
      <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && <div className="mt-1 text-xs text-destructive">{error}</div>}
    </div>
  );
}
