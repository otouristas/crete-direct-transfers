import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  Car,
  ChevronDown,
  Clock,
  Info,
  MapPin,
  Minus,
  Plus,
} from "lucide-react";
import { parseISO } from "date-fns";
import { getRoute, ROUTES, type VehicleClass } from "@/data/routes";
import { getIataAirport } from "@/data/iata-airports";
import { quote, formatEur, bagCapacity, type TripType } from "@/lib/pricing";
import { matchRouteSlug, type PlaceResult } from "@/lib/place-search";
import { CounterInput } from "@/components/counter-input";
import { LocationPicker, type PickedLocation } from "@/components/location-picker";
import { PlaceCombobox } from "@/components/place-combobox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLocale, useT } from "@/i18n";
import { priceLineLabel } from "@/lib/price-labels";
import { dateFnsLocale } from "@/lib/date-locale";
import { getLocalizedVehicles } from "@/i18n/content";
import { cn } from "@/lib/utils";

type ServiceMode = "transfer" | "hourly";

function placeFromIata(iata?: string): PlaceResult | null {
  if (!iata) return null;
  const a = getIataAirport(iata);
  if (!a) return null;
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

function placeFromLabel(label: string): PlaceResult {
  const m = label.match(/\(([A-Z]{3})\)/);
  if (m) {
    const fromIata = placeFromIata(m[1]);
    if (fromIata) return fromIata;
  }
  return {
    id: `label:${label}`,
    label,
    kind: "route-end",
    countryCode: "GR",
    countryName: "Greece",
  };
}

function defaultsFromRoute(routeSlug?: string): {
  from: PlaceResult | null;
  to: PlaceResult | null;
} {
  if (!routeSlug) return { from: null, to: null };
  const r = getRoute(routeSlug) ?? ROUTES.find((x) => x.slug === routeSlug);
  if (!r) return { from: null, to: null };
  return { from: placeFromLabel(r.from), to: placeFromLabel(r.to) };
}

function defaultPickupLocal(): string {
  // Deterministic default: +2 days at 12:00. The hour must NOT derive from the
  // current clock — the SSR host and the browser sit in different timezones,
  // which produced a hydration mismatch on the pickup field.
  const d = new Date();
  d.setDate(d.getDate() + 2);
  d.setHours(12, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T12:00`;
}

function formatPickupLabel(value: string, locale: string): string {
  if (!value) return "—";
  try {
    const d = parseISO(value);
    return new Intl.DateTimeFormat(locale, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(d);
  } catch {
    return value;
  }
}

function splitLocal(value: string): { date?: Date; time: string } {
  if (!value) return { time: "13:00" };
  const [datePart, timePart = "13:00"] = value.split("T");
  return {
    date: datePart ? parseISO(`${datePart}T12:00:00`) : undefined,
    time: timePart.slice(0, 5),
  };
}

function joinLocal(date: Date | undefined, time: string): string {
  if (!date) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${time}`;
}

const TIME_OPTIONS = Array.from({ length: 24 * 4 }, (_, i) => {
  const h = Math.floor(i / 4);
  const m = (i % 4) * 15;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
});

export function BookingWidget({
  defaultRoute,
  defaultIata,
  defaultDestination,
  defaultClass = "economy",
  defaultService = "transfer",
  compact = false,
  variant,
}: {
  defaultRoute?: string;
  /** Prefill From with this IATA airport (pillar / airport pages). */
  defaultIata?: string;
  /** Prefill To with a country-specific city or resort on market hubs. */
  defaultDestination?: string;
  defaultClass?: VehicleClass;
  /** Open on the hourly tab — used by the /hourly-service landing page. */
  defaultService?: ServiceMode;
  compact?: boolean;
  /** Homepage uses horizontal bar; route pages keep the card. */
  variant?: "hbar" | "card";
}) {
  const resolvedVariant = variant ?? (compact ? "card" : "hbar");
  if (resolvedVariant === "card") {
    return (
      <BookingWidgetCard
        defaultRoute={defaultRoute}
        defaultIata={defaultIata}
        defaultClass={defaultClass}
        compact={compact}
      />
    );
  }
  return (
    <BookingWidgetBar
      defaultClass={defaultClass}
      defaultIata={defaultIata}
      defaultDestination={defaultDestination}
      defaultService={defaultService}
    />
  );
}

function BookingWidgetBar({
  defaultClass = "economy",
  defaultIata,
  defaultDestination,
  defaultService = "transfer",
}: {
  defaultClass?: VehicleClass;
  defaultIata?: string;
  defaultDestination?: string;
  defaultService?: ServiceMode;
}) {
  const t = useT();
  const locale = useLocale();
  const navigate = useNavigate();
  const initialFrom = placeFromIata(defaultIata);
  const initialTo = defaultDestination ? placeFromLabel(defaultDestination) : null;
  const [service, setService] = useState<ServiceMode>(defaultService);
  const [fromQuery, setFromQuery] = useState(initialFrom?.label ?? "");
  const [toQuery, setToQuery] = useState(initialTo?.label ?? "");
  const [fromPlace, setFromPlace] = useState<PlaceResult | null>(initialFrom);
  const [toPlace, setToPlace] = useState<PlaceResult | null>(initialTo);
  const [date, setDate] = useState(defaultPickupLocal);
  const [returnDate, setReturnDate] = useState("");
  const [addReturn, setAddReturn] = useState(false);
  const [pax, setPax] = useState(2);
  const [hours, setHours] = useState(6);
  const [vehicleClass] = useState<VehicleClass>(defaultClass);
  const [mapPicker, setMapPicker] = useState<"from" | "to" | null>(null);
  const [pickupPoint, setPickupPoint] = useState<PickedLocation | null>(
    initialFrom?.lat != null && initialFrom?.lng != null
      ? { lat: initialFrom.lat, lng: initialFrom.lng }
      : null,
  );
  const [dropoffPoint, setDropoffPoint] = useState<PickedLocation | null>(null);
  const [dateOpen, setDateOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);

  const kindLabels = {
    airport: t.bookPage.kindAirport,
    port: t.bookPage.kindPort,
    destination: t.bookPage.kindPlace,
    "route-end": t.bookPage.kindRoute,
    address: t.bookPage.kindAddress,
  } as const;

  const groupLabels = {
    airport: t.bookPage.groupAirports,
    port: t.bookPage.groupPorts,
    popular: t.bookPage.groupPopular,
    "in-country": t.bookPage.groupInCountry,
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const isHourly = service === "hourly";
    const matched = !isHourly ? matchRouteSlug(fromPlace, toPlace) : undefined;
    const trip: TripType = !isHourly && addReturn ? "return" : "oneway";
    const pickupLat = fromPlace?.lat ?? pickupPoint?.lat;
    const pickupLng = fromPlace?.lng ?? pickupPoint?.lng;
    const dropoffLat = isHourly ? undefined : (toPlace?.lat ?? dropoffPoint?.lat);
    const dropoffLng = isHourly ? undefined : (toPlace?.lng ?? dropoffPoint?.lng);

    navigate({
      to: "/{-$locale}/book",
      search: {
        service,
        hours: isHourly ? hours : undefined,
        route: matched,
        class: vehicleClass,
        date,
        pax,
        trip,
        returnDate: trip === "return" ? returnDate || undefined : undefined,
        pickupAddress: fromQuery || fromPlace?.label || undefined,
        dropoffAddress: isHourly ? undefined : toQuery || toPlace?.label || undefined,
        pickupLat,
        pickupLng,
        dropoffLat,
        dropoffLng,
      },
    });
  };

  const { date: calDate, time } = splitLocal(date);
  const { date: returnCalDate, time: returnTime } = splitLocal(returnDate);

  return (
    <div className="tfr-hbar relative z-10 w-full">
      <div className="tfr-hbar-shell">
        <div className="tfr-htabs" role="tablist" aria-label={t.widget.serviceType}>
          <button
            type="button"
            role="tab"
            aria-selected={service === "transfer"}
            className={cn("tfr-htab", service === "transfer" && "is-on")}
            onClick={() => setService("transfer")}
          >
            <Car className="tfr-htab-ic" aria-hidden />
            <span>{t.widget.transfer}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={service === "hourly"}
            className={cn("tfr-htab", service === "hourly" && "is-on")}
            onClick={() => {
              setService("hourly");
              setAddReturn(false);
            }}
          >
            <Clock className="tfr-htab-ic" aria-hidden />
            <span>{t.widget.byTheHour}</span>
          </button>
        </div>

        <form onSubmit={submit} className="tfr-bar">
          <PlaceCombobox
            label={t.widget.from}
            placeholder={t.widget.placePlaceholder}
            value={fromQuery}
            selected={fromPlace}
            cellClassName="tfr-cell--from"
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
            onPinOnMap={() => setMapPicker("from")}
            pinLabel={t.widget.pinOnMap}
            noPlacesLabel={t.widget.noPlaces}
            kindLabels={kindLabels}
            groupLabels={groupLabels}
            contextPlace={toPlace}
          />

          {service === "transfer" ? (
            <PlaceCombobox
              label={t.widget.to}
              placeholder={t.widget.placePlaceholder}
              value={toQuery}
              selected={toPlace}
              cellClassName="tfr-cell--to"
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
              onPinOnMap={() => setMapPicker("to")}
              pinLabel={t.widget.pinOnMap}
              noPlacesLabel={t.widget.noPlaces}
              kindLabels={kindLabels}
              groupLabels={groupLabels}
              contextPlace={fromPlace}
            />
          ) : (
            <div className="tfr-cell tfr-cell--hours">
              <Clock className="tfr-cell-ic" aria-hidden />
              <span className="tfr-cell-field">
                <span className="tfr-cell-label">{t.widget.hours}</span>
                <span className="tfr-step">
                  <button
                    type="button"
                    className="tfr-stepbtn"
                    aria-label={t.ui.decrease}
                    disabled={hours <= 2}
                    onClick={() => setHours((h) => Math.max(2, h - 1))}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <b className="tabular-nums">{hours}</b>
                  <button
                    type="button"
                    className="tfr-stepbtn"
                    aria-label={t.ui.increase}
                    disabled={hours >= 12}
                    onClick={() => setHours((h) => Math.min(12, h + 1))}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </span>
              </span>
            </div>
          )}

          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <button type="button" className="tfr-cell tfr-cell--datetime">
                <CalendarDays className="tfr-cell-ic" aria-hidden />
                <span className="tfr-cell-field">
                  <span className="tfr-cell-label">{t.widget.pickupDate}</span>
                  <span className="tfr-cell-value capitalize">
                    {formatPickupLabel(date, locale)}
                  </span>
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="start">
              <DateTimePicker
                selected={calDate}
                time={time}
                onDateChange={(d) => setDate(joinLocal(d, time))}
                onTimeChange={(tm) => setDate(joinLocal(calDate, tm))}
              />
            </PopoverContent>
          </Popover>

          {service === "transfer" && (
            <>
              {!addReturn ? (
                <button
                  type="button"
                  className="tfr-cell tfr-cell--addret"
                  onClick={() => {
                    setAddReturn(true);
                    if (!returnDate && date) {
                      const d = parseISO(date);
                      d.setDate(d.getDate() + 7);
                      setReturnDate(joinLocal(d, time));
                    }
                  }}
                >
                  <Plus className="tfr-cell-ic" aria-hidden />
                  <span className="tfr-cell-field">
                    <span className="tfr-cell-value tfr-addret">{t.widget.addReturn}</span>
                  </span>
                </button>
              ) : (
                <Popover open={returnOpen} onOpenChange={setReturnOpen}>
                  <PopoverTrigger asChild>
                    <button type="button" className="tfr-cell tfr-cell--datetime">
                      <CalendarDays className="tfr-cell-ic" aria-hidden />
                      <span className="tfr-cell-field">
                        <span className="tfr-cell-label">{t.widget.returnDate}</span>
                        <span className="tfr-cell-value capitalize">
                          {formatPickupLabel(returnDate, locale)}
                        </span>
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3" align="start">
                    <DateTimePicker
                      selected={returnCalDate}
                      time={returnTime}
                      onDateChange={(d) => setReturnDate(joinLocal(d, returnTime))}
                      onTimeChange={(tm) => setReturnDate(joinLocal(returnCalDate, tm))}
                    />
                    <button
                      type="button"
                      className="mt-2 w-full text-left text-xs font-semibold text-accent-deep"
                      onClick={() => {
                        setAddReturn(false);
                        setReturnDate("");
                        setReturnOpen(false);
                      }}
                    >
                      {t.widget.removeReturn}
                    </button>
                  </PopoverContent>
                </Popover>
              )}
            </>
          )}

          <div className="tfr-cell tfr-cell--pax">
            <span className="tfr-cell-field">
              <span className="tfr-cell-label">{t.widget.passengers}</span>
              <span className="tfr-step">
                <button
                  type="button"
                  className="tfr-stepbtn"
                  aria-label={t.ui.decrease}
                  disabled={pax <= 1}
                  onClick={() => setPax((n) => Math.max(1, n - 1))}
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <b className="tabular-nums">{pax}</b>
                <button
                  type="button"
                  className="tfr-stepbtn"
                  aria-label={t.ui.increase}
                  disabled={pax >= 16}
                  onClick={() => setPax((n) => Math.min(16, n + 1))}
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </span>
            </span>
          </div>

          <button type="submit" className="tfr-go">
            <span>{t.widget.seePrices}</span>
            <svg
              viewBox="0 0 20 20"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M3.5 10h12.5M11.5 5.5 16 10l-4.5 4.5" />
            </svg>
          </button>
        </form>

        {mapPicker && (
          <div className="border-t border-border p-4">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {mapPicker === "from" ? t.widget.pickupLocation : t.widget.dropoffLocation}
              </span>
              <button
                type="button"
                className="font-semibold text-accent-deep"
                onClick={() => setMapPicker(null)}
              >
                {t.bookPage.back}
              </button>
            </div>
            <LocationPicker
              key={mapPicker}
              value={mapPicker === "from" ? pickupPoint : dropoffPoint}
              onPick={(point, address) => {
                if (mapPicker === "from") {
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
                setMapPicker(null);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function DateTimePicker({
  selected,
  time,
  onDateChange,
  onTimeChange,
}: {
  selected?: Date;
  time: string;
  onDateChange: (d: Date) => void;
  onTimeChange: (t: string) => void;
}) {
  const t = useT();
  return (
    <div className="space-y-3">
      <Calendar
        locale={dateFnsLocale(locale)}
        mode="single"
        selected={selected}
        onSelect={(d) => d && onDateChange(d)}
        disabled={{ before: new Date() }}
      />
      <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t.widget.time}
        <select
          className="mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
        >
          {TIME_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

/** Vertical card on route / airport pillar pages — same worldwide place search as homepage. */
function BookingWidgetCard({
  defaultRoute,
  defaultIata,
  defaultClass = "economy",
  compact = false,
}: {
  defaultRoute?: string;
  defaultIata?: string;
  defaultClass?: VehicleClass;
  compact?: boolean;
}) {
  const t = useT();
  const navigate = useNavigate();
  const vehicles = getLocalizedVehicles(useLocale());
  const routeDefaults = defaultsFromRoute(defaultRoute);
  const initialFrom = placeFromIata(defaultIata) ?? routeDefaults.from;
  const initialTo = routeDefaults.to;

  const [tripType, setTripType] = useState<TripType>("oneway");
  const [fromQuery, setFromQuery] = useState(initialFrom?.label ?? "");
  const [toQuery, setToQuery] = useState(initialTo?.label ?? "");
  const [fromPlace, setFromPlace] = useState<PlaceResult | null>(initialFrom);
  const [toPlace, setToPlace] = useState<PlaceResult | null>(initialTo);
  const [vehicleClass, setVehicleClass] = useState<VehicleClass>(defaultClass);
  const [date, setDate] = useState(defaultPickupLocal);
  const [returnDate, setReturnDate] = useState("");
  const [pax, setPax] = useState(2);
  const [bagsChecked, setBagsChecked] = useState(2);
  const [bagsCabin, setBagsCabin] = useState(2);
  const [flight, setFlight] = useState("");
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [mapPicker, setMapPicker] = useState<"from" | "to" | null>(null);
  const [pickupPoint, setPickupPoint] = useState<PickedLocation | null>(
    initialFrom?.lat != null && initialFrom?.lng != null
      ? { lat: initialFrom.lat, lng: initialFrom.lng }
      : null,
  );
  const [dropoffPoint, setDropoffPoint] = useState<PickedLocation | null>(
    initialTo?.lat != null && initialTo?.lng != null
      ? { lat: initialTo.lat, lng: initialTo.lng }
      : null,
  );

  const matched = matchRouteSlug(fromPlace, toPlace);
  const selected = matched ? getRoute(matched) : undefined;
  const q = useMemo(
    () =>
      matched
        ? quote({
            routeSlug: matched,
            vehicleClass,
            tripType,
            pickupAt: date ? new Date(date) : undefined,
            returnAt: returnDate ? new Date(returnDate) : undefined,
          })
        : null,
    [matched, vehicleClass, tripType, date, returnDate],
  );

  const overCapacity = bagsChecked > bagCapacity(vehicleClass);

  const kindLabels = {
    airport: t.bookPage.kindAirport,
    port: t.bookPage.kindPort,
    destination: t.bookPage.kindPlace,
    "route-end": t.bookPage.kindRoute,
    address: t.bookPage.kindAddress,
  } as const;

  const groupLabels = {
    airport: t.bookPage.groupAirports,
    port: t.bookPage.groupPorts,
    popular: t.bookPage.groupPopular,
    "in-country": t.bookPage.groupInCountry,
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/{-$locale}/book",
      search: {
        service: "transfer",
        route: matched,
        class: vehicleClass,
        date,
        pax,
        trip: tripType,
        returnDate: tripType === "return" ? returnDate || undefined : undefined,
        flight: flight || undefined,
        bagsChecked,
        bagsCabin,
        pickupAddress: fromQuery || fromPlace?.label || undefined,
        dropoffAddress: toQuery || toPlace?.label || undefined,
        pickupLat: fromPlace?.lat ?? pickupPoint?.lat,
        pickupLng: fromPlace?.lng ?? pickupPoint?.lng,
        dropoffLat: toPlace?.lat ?? dropoffPoint?.lat,
        dropoffLng: toPlace?.lng ?? dropoffPoint?.lng,
      },
    });
  };

  return (
    <form
      onSubmit={submit}
      className={cn(
        "relative z-20 rounded-2xl border border-border bg-card text-foreground shadow-2xl ring-1 ring-black/5",
        compact ? "p-5" : "p-6",
      )}
    >
      {!compact && (
        <div className="mb-4 border-b border-border pb-4">
          <h2 className="font-display text-xl text-primary">{t.widget.title}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {t.widget.guaranteed} · {t.widget.payOnBoard}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
        {(["oneway", "return"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setTripType(type)}
            className={cn(
              "rounded-lg py-2 text-sm font-semibold transition",
              tripType === type
                ? "bg-card text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {type === "oneway" ? t.widget.oneWay : t.widget.return}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
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
          onPinOnMap={() => setMapPicker("from")}
          pinLabel={t.widget.pinOnMap}
          noPlacesLabel={t.widget.noPlaces}
        />
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
          onPinOnMap={() => setMapPicker("to")}
          pinLabel={t.widget.pinOnMap}
          noPlacesLabel={t.widget.noPlaces}
        />

        {mapPicker && (
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">{t.bookPage.pinHint}</p>
            <LocationPicker
              key={mapPicker}
              value={mapPicker === "from" ? pickupPoint : dropoffPoint}
              onPick={(point, address) => {
                if (mapPicker === "from") {
                  setPickupPoint(point);
                  setFromQuery(address);
                  setFromPlace({
                    id: "map:from",
                    label: address,
                    kind: "address",
                    lat: point.lat,
                    lng: point.lng,
                  });
                } else {
                  setDropoffPoint(point);
                  setToQuery(address);
                  setToPlace({
                    id: "map:to",
                    label: address,
                    kind: "address",
                    lat: point.lat,
                    lng: point.lng,
                  });
                }
                setMapPicker(null);
              }}
            />
          </div>
        )}

        <div className={cn("grid gap-4", tripType === "return" && "sm:grid-cols-2")}>
          <Field label={t.widget.pickupDate}>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="widget-input"
            />
          </Field>
          {tripType === "return" && (
            <Field label={t.widget.returnDate}>
              <input
                type="datetime-local"
                value={returnDate}
                min={date || undefined}
                onChange={(e) => setReturnDate(e.target.value)}
                className="widget-input"
              />
            </Field>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:items-end">
          <Field label={t.widget.vehicleClass}>
            <select
              value={vehicleClass}
              onChange={(e) => setVehicleClass(e.target.value as VehicleClass)}
              className="widget-input"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label} · {v.capacity}
                </option>
              ))}
            </select>
          </Field>
          <Field label={`${t.widget.flightNumber} (${t.common.optional})`}>
            <input
              value={flight}
              onChange={(e) => setFlight(e.target.value)}
              placeholder={t.widget.flightPlaceholder}
              className="widget-input"
            />
          </Field>
        </div>

        <div className={cn("grid sm:grid-cols-3", compact ? "gap-2" : "gap-3")}>
          <CounterInput
            label={t.widget.passengers}
            value={pax}
            onChange={setPax}
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

        {overCapacity && (
          <p className="flex items-start gap-2 rounded-lg bg-highlight/10 px-3 py-2 text-xs text-foreground/80">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-highlight" />
            {t.widget.minivanHint}
          </p>
        )}
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="text-xs text-muted-foreground">
            {selected
              ? t.widget.distance(selected.distanceKm, selected.durationMin)
              : fromPlace && toPlace
                ? t.widget.seePrices
                : t.widget.placePlaceholder}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              {t.common.from}
            </span>
            <span className="text-3xl font-display text-primary">
              {q ? formatEur(q.totalEur) : "—"}
            </span>
          </div>
        </div>

        {q && q.breakdown.length > 1 && (
          <button
            type="button"
            onClick={() => setShowBreakdown((v) => !v)}
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-accent-deep hover:opacity-80"
          >
            {t.widget.breakdown}
            <ChevronDown
              className={cn("h-3 w-3 transition-transform", showBreakdown && "rotate-180")}
            />
          </button>
        )}
        {q && showBreakdown && (
          <dl className="mt-2 space-y-1.5 rounded-lg bg-muted p-3 text-xs">
            {q.breakdown.map((b, i) => (
              <div key={i} className="flex justify-between">
                <dt className="text-muted-foreground">{priceLineLabel(t, b)}</dt>
                <dd
                  className={cn("tabular-nums", b.amountEur < 0 && "font-medium text-accent-deep")}
                >
                  {formatEur(b.amountEur)}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      <button
        type="submit"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
      >
        {t.widget.seePrices} <ArrowRight className="h-4 w-4" />
      </button>
      {compact && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          {t.widget.guaranteed} · {t.widget.payOnBoard}
        </p>
      )}

      <style>{`
        .widget-input {
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          min-height: 48px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 14px;
          line-height: 1.3;
          outline: none;
          transition: border-color 0.15s;
        }
        select.widget-input {
          appearance: none;
          -webkit-appearance: none;
          padding-right: 36px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
        }
        .widget-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--accent) 22%, transparent);
        }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block min-w-0">
      <span className="line-clamp-1 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
