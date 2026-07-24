import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarDays,
  Car,
  ChevronDown,
  Clock,
  Info,
  ListFilter,
  MapPin,
  Minus,
  Plus,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ROUTES, VEHICLE_CLASSES, type VehicleClass } from "@/data/routes";
import { quote, formatEur, bagCapacity, type TripType } from "@/lib/pricing";
import { matchRouteSlug, type PlaceResult } from "@/lib/place-search";
import { CounterInput } from "@/components/counter-input";
import { LocationPicker, type PickedLocation } from "@/components/location-picker";
import { PlaceCombobox } from "@/components/place-combobox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";

type ServiceMode = "transfer" | "hourly";

function defaultPickupLocal(): string {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  d.setMinutes(0, 0, 0);
  if (d.getHours() < 10) d.setHours(13);
  else if (d.getHours() > 20) d.setHours(13);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatPickupLabel(value: string): string {
  if (!value) return "—";
  try {
    const d = parseISO(value);
    return format(d, "EEE, MMM d · HH:mm");
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
  defaultClass = "economy",
  compact = false,
  variant,
}: {
  defaultRoute?: string;
  defaultClass?: VehicleClass;
  compact?: boolean;
  /** Homepage uses horizontal bar; route pages keep the card. */
  variant?: "hbar" | "card";
}) {
  const resolvedVariant = variant ?? (compact ? "card" : "hbar");
  if (resolvedVariant === "card") {
    return (
      <BookingWidgetCard
        defaultRoute={defaultRoute}
        defaultClass={defaultClass}
        compact={compact}
      />
    );
  }
  return <BookingWidgetBar defaultClass={defaultClass} />;
}

function BookingWidgetBar({ defaultClass = "economy" }: { defaultClass?: VehicleClass }) {
  const t = useT();
  const navigate = useNavigate();
  const [service, setService] = useState<ServiceMode>("transfer");
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [fromPlace, setFromPlace] = useState<PlaceResult | null>(null);
  const [toPlace, setToPlace] = useState<PlaceResult | null>(null);
  const [date, setDate] = useState(defaultPickupLocal);
  const [returnDate, setReturnDate] = useState("");
  const [addReturn, setAddReturn] = useState(false);
  const [pax, setPax] = useState(2);
  const [hours, setHours] = useState(6);
  const [vehicleClass] = useState<VehicleClass>(defaultClass);
  const [mapPicker, setMapPicker] = useState<"from" | "to" | null>(null);
  const [pickupPoint, setPickupPoint] = useState<PickedLocation | null>(null);
  const [dropoffPoint, setDropoffPoint] = useState<PickedLocation | null>(null);
  const [dateOpen, setDateOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);

  const kindLabels = {
    airport: "Airport",
    destination: "Place",
    "route-end": "Route",
    address: "Address",
  } as const;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const isHourly = service === "hourly";
    const matched = !isHourly ? matchRouteSlug(fromPlace, toPlace) : undefined;
    const trip: TripType = !isHourly && addReturn ? "return" : "oneway";

    navigate({
      to: "/{-$locale}/book",
      search: {
        service,
        hours: isHourly ? hours : undefined,
        route: matched ?? ROUTES[0].slug,
        class: vehicleClass,
        date,
        pax,
        trip,
        returnDate: trip === "return" ? returnDate || undefined : undefined,
        pickupAddress: fromQuery || fromPlace?.label || undefined,
        dropoffAddress: isHourly ? undefined : toQuery || toPlace?.label || undefined,
        pickupLat: fromPlace?.lat ?? pickupPoint?.lat,
        pickupLng: fromPlace?.lng ?? pickupPoint?.lng,
        dropoffLat: isHourly ? undefined : (toPlace?.lat ?? dropoffPoint?.lat),
        dropoffLng: isHourly ? undefined : (toPlace?.lng ?? dropoffPoint?.lng),
      },
    });
  };

  const { date: calDate, time } = splitLocal(date);
  const { date: returnCalDate, time: returnTime } = splitLocal(returnDate);

  return (
    <div className="tfr-hbar relative z-10 w-full">
      <div className="tfr-hbar-shell">
        <div className="tfr-htabs" role="tablist" aria-label="Service type">
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
                    aria-label="−"
                    disabled={hours <= 2}
                    onClick={() => setHours((h) => Math.max(2, h - 1))}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <b className="tabular-nums">{hours}</b>
                  <button
                    type="button"
                    className="tfr-stepbtn"
                    aria-label="+"
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
                  <span className="tfr-cell-value capitalize">{formatPickupLabel(date)}</span>
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
                          {formatPickupLabel(returnDate)}
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
                  aria-label="−"
                  disabled={pax <= 1}
                  onClick={() => setPax((n) => Math.max(1, n - 1))}
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <b className="tabular-nums">{pax}</b>
                <button
                  type="button"
                  className="tfr-stepbtn"
                  aria-label="+"
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
  return (
    <div className="space-y-3">
      <Calendar
        mode="single"
        selected={selected}
        onSelect={(d) => d && onDateChange(d)}
        disabled={{ before: new Date() }}
      />
      <label className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Time
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

/** Legacy vertical card used on route detail pages. */
function BookingWidgetCard({
  defaultRoute,
  defaultClass = "economy",
  compact = false,
}: {
  defaultRoute?: string;
  defaultClass?: VehicleClass;
  compact?: boolean;
}) {
  const t = useT();
  const navigate = useNavigate();
  const [tripType, setTripType] = useState<TripType>("oneway");
  const [routeMode, setRouteMode] = useState<"preset" | "map">("preset");
  const [routeSlug, setRouteSlug] = useState(defaultRoute ?? ROUTES[0].slug);
  const [vehicleClass, setVehicleClass] = useState<VehicleClass>(defaultClass);
  const [date, setDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [pax, setPax] = useState(2);
  const [bagsChecked, setBagsChecked] = useState(2);
  const [bagsCabin, setBagsCabin] = useState(2);
  const [flight, setFlight] = useState("");
  const [showBreakdown, setShowBreakdown] = useState(false);

  const [pickupPoint, setPickupPoint] = useState<PickedLocation | null>(null);
  const [dropoffPoint, setDropoffPoint] = useState<PickedLocation | null>(null);
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [activePicker, setActivePicker] = useState<"pickup" | "dropoff" | null>(null);

  const selected = ROUTES.find((r) => r.slug === routeSlug)!;
  const q = useMemo(
    () =>
      quote({
        routeSlug,
        vehicleClass,
        tripType,
        pickupAt: date ? new Date(date) : undefined,
        returnAt: returnDate ? new Date(returnDate) : undefined,
      }),
    [routeSlug, vehicleClass, tripType, date, returnDate],
  );

  const overCapacity = bagsChecked > bagCapacity(vehicleClass);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/{-$locale}/book",
      search: {
        service: "transfer",
        route: routeSlug,
        class: vehicleClass,
        date,
        pax,
        trip: tripType,
        returnDate: tripType === "return" ? returnDate : undefined,
        flight: flight || undefined,
        bagsChecked,
        bagsCabin,
        pickupAddress: routeMode === "map" && pickupAddress ? pickupAddress : undefined,
        dropoffAddress: routeMode === "map" && dropoffAddress ? dropoffAddress : undefined,
        pickupLat: routeMode === "map" && pickupPoint ? pickupPoint.lat : undefined,
        pickupLng: routeMode === "map" && pickupPoint ? pickupPoint.lng : undefined,
        dropoffLat: routeMode === "map" && dropoffPoint ? dropoffPoint.lat : undefined,
        dropoffLng: routeMode === "map" && dropoffPoint ? dropoffPoint.lng : undefined,
      },
    });
  };

  return (
    <form
      onSubmit={submit}
      className={cn(
        "rounded-2xl border border-border bg-card text-foreground shadow-2xl ring-1 ring-black/5",
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

      <div className="mt-4 space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              {t.widget.route}
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setRouteMode("preset")}
                className={cn(
                  "flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium transition",
                  routeMode === "preset"
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <ListFilter className="h-3 w-3" />
                {t.widget.selectRoute}
              </button>
              <button
                type="button"
                onClick={() => {
                  setRouteMode("map");
                  if (!activePicker) setActivePicker("pickup");
                }}
                className={cn(
                  "flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium transition",
                  routeMode === "map"
                    ? "bg-accent/15 font-semibold text-accent-deep"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <MapPin className="h-3 w-3 text-accent" />
                {t.widget.pinOnMap}
              </button>
            </div>
          </div>

          <div className="mt-1.5">
            {routeMode === "preset" ? (
              <select
                value={routeSlug}
                onChange={(e) => setRouteSlug(e.target.value)}
                className="widget-input"
              >
                {ROUTES.map((r) => (
                  <option key={r.slug} value={r.slug}>
                    {r.from} → {r.to}
                  </option>
                ))}
              </select>
            ) : (
              <div className="space-y-3 rounded-xl border border-border bg-muted/40 p-3">
                <div className="relative space-y-3 pl-5">
                  <div
                    className="absolute bottom-3 left-[7px] top-3 w-px bg-border"
                    aria-hidden
                  />
                  <div className="relative">
                    <span className="absolute -left-5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-accent bg-card" />
                    <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                      {t.widget.pickupLocation}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActivePicker(activePicker === "pickup" ? null : "pickup")}
                      className={cn(
                        "mt-1 flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-xs transition",
                        activePicker === "pickup"
                          ? "border-accent bg-card font-medium text-foreground"
                          : "border-border bg-card/80 text-muted-foreground hover:bg-card",
                      )}
                    >
                      <span className="truncate">
                        {pickupAddress ||
                          (pickupPoint
                            ? `${pickupPoint.lat.toFixed(4)}, ${pickupPoint.lng.toFixed(4)}`
                            : t.bookPage.pinOnMap)}
                      </span>
                      <MapPin
                        className={cn(
                          "ml-1 h-3.5 w-3.5 shrink-0",
                          pickupPoint ? "text-accent" : "text-muted-foreground",
                        )}
                      />
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-primary" />
                    <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                      {t.widget.dropoffLocation}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setActivePicker(activePicker === "dropoff" ? null : "dropoff")
                      }
                      className={cn(
                        "mt-1 flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-xs transition",
                        activePicker === "dropoff"
                          ? "border-accent bg-card font-medium text-foreground"
                          : "border-border bg-card/80 text-muted-foreground hover:bg-card",
                      )}
                    >
                      <span className="truncate">
                        {dropoffAddress ||
                          (dropoffPoint
                            ? `${dropoffPoint.lat.toFixed(4)}, ${dropoffPoint.lng.toFixed(4)}`
                            : t.bookPage.pinOnMap)}
                      </span>
                      <MapPin
                        className={cn(
                          "ml-1 h-3.5 w-3.5 shrink-0",
                          dropoffPoint ? "text-accent" : "text-muted-foreground",
                        )}
                      />
                    </button>
                  </div>
                </div>

                {activePicker && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {activePicker === "pickup"
                          ? t.widget.pickupLocation
                          : t.widget.dropoffLocation}
                      </span>
                      <span>{t.bookPage.pinHint}</span>
                    </div>
                    <LocationPicker
                      key={activePicker}
                      value={activePicker === "pickup" ? pickupPoint : dropoffPoint}
                      onPick={(point, address) => {
                        if (activePicker === "pickup") {
                          setPickupPoint(point);
                          setPickupAddress(address);
                        } else {
                          setDropoffPoint(point);
                          setDropoffAddress(address);
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

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

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t.widget.vehicleClass}>
            <select
              value={vehicleClass}
              onChange={(e) => setVehicleClass(e.target.value as VehicleClass)}
              className="widget-input"
            >
              {VEHICLE_CLASSES.map((v) => (
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

        <div className="grid gap-3 sm:grid-cols-3">
          <CounterInput label={t.widget.passengers} value={pax} onChange={setPax} min={1} max={8} />
          <CounterInput
            label={t.widget.checkedBags}
            value={bagsChecked}
            onChange={setBagsChecked}
            max={8}
          />
          <CounterInput
            label={t.widget.cabinBags}
            value={bagsCabin}
            onChange={setBagsCabin}
            max={8}
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
            {t.widget.distance(selected.distanceKm, selected.durationMin)}
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
                <dt className="text-muted-foreground">{b.label}</dt>
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
    <div>
      <label className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
