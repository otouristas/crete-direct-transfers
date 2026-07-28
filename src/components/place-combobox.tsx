import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Anchor, MapPin, Plane } from "lucide-react";
import {
  getQuickPickGroups,
  searchLocalPlaces,
  searchPlaces,
  type PlaceKind,
  type PlaceResult,
} from "@/lib/place-search";
import { cn } from "@/lib/utils";

const KIND_FALLBACK: Record<PlaceKind, string> = {
  airport: "Airport",
  port: "Port",
  destination: "Place",
  "route-end": "Route",
  address: "Address",
};

function KindIcon({ kind }: { kind: PlaceKind }) {
  if (kind === "airport") return <Plane className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-deep" />;
  if (kind === "port") return <Anchor className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-deep" />;
  return <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-deep" />;
}

export function PlaceCombobox({
  label,
  placeholder,
  value,
  onQueryChange,
  onSelect,
  onPinOnMap,
  pinLabel,
  noPlacesLabel,
  kindLabels = KIND_FALLBACK,
  groupLabels,
  cellClassName,
  variant = "cell",
  contextPlace = null,
}: {
  label: string;
  placeholder: string;
  value: string;
  selected?: PlaceResult | null;
  onQueryChange: (q: string) => void;
  onSelect: (place: PlaceResult) => void;
  onPinOnMap: () => void;
  pinLabel: string;
  noPlacesLabel: string;
  kindLabels?: Record<PlaceKind, string>;
  groupLabels?: Partial<Record<PlaceKind | "popular" | "in-country", string>>;
  cellClassName?: string;
  /** `cell` = homepage bar; `field` = book page form field */
  variant?: "cell" | "field";
  /** Other end of the trip — used to propose same-country ports/cities/hotels */
  contextPlace?: PlaceResult | null;
}) {
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<PlaceResult[]>(() =>
    searchLocalPlaces("", 12, contextPlace),
  );
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);

  const emptyGroups = useMemo(
    () => getQuickPickGroups(10, groupLabels, contextPlace),
    [groupLabels, contextPlace],
  );

  const showGroups = open && !value.trim();
  const flatForKeyboard = showGroups ? emptyGroups.flatMap((g) => g.places) : results;

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const q = value.trim();
    setLoading(true);
    const handle = window.setTimeout(
      async () => {
        const next = await searchPlaces(q, 10, contextPlace);
        if (!cancelled) {
          setResults(next);
          setActive(0);
          setLoading(false);
        }
      },
      q.length >= 3 ? 280 : 0,
    );
    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [value, open, contextPlace]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const pick = (place: PlaceResult) => {
    onSelect(place);
    setOpen(false);
  };

  const renderItem = (place: PlaceResult, i: number) => (
    <button
      key={place.id}
      type="button"
      role="option"
      aria-selected={i === active}
      data-active={i === active}
      className="tfr-suggest-item"
      onMouseEnter={() => setActive(i)}
      onClick={() => pick(place)}
    >
      <KindIcon kind={place.kind} />
      <span className="min-w-0">
        <span className="block truncate font-medium">{place.label}</span>
        <span className="tfr-suggest-kind">
          {kindLabels[place.kind]}
          {place.countryName ? ` · ${place.countryName}` : ""}
        </span>
      </span>
    </button>
  );

  const dropdown = open && (
    <div id={listId} role="listbox" className="tfr-suggest max-h-80 overflow-y-auto">
      {showGroups ? (
        emptyGroups.map((group) => (
          <div key={group.kind}>
            <div className="px-3 pb-1 pt-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {group.label}
            </div>
            {group.places.map((place) => {
              const i = flatForKeyboard.findIndex((p) => p.id === place.id);
              return renderItem(place, i);
            })}
          </div>
        ))
      ) : (
        <>
          {results.length === 0 && !loading && (
            <div className="px-3 py-2.5 text-sm text-muted-foreground">{noPlacesLabel}</div>
          )}
          {results.map((place, i) => renderItem(place, i))}
        </>
      )}
      <button
        type="button"
        role="option"
        aria-selected={active === flatForKeyboard.length}
        data-active={active === flatForKeyboard.length}
        className="tfr-suggest-item border-t border-border"
        onMouseEnter={() => setActive(flatForKeyboard.length)}
        onClick={() => {
          onPinOnMap();
          setOpen(false);
        }}
      >
        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
        <span className="font-medium">{pinLabel}</span>
      </button>
    </div>
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, flatForKeyboard.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active === flatForKeyboard.length) {
        onPinOnMap();
        setOpen(false);
      } else if (flatForKeyboard[active]) {
        pick(flatForKeyboard[active]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  if (variant === "field") {
    return (
      <div ref={wrapRef} className={cn("relative min-w-0", cellClassName)}>
        <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
        <div className="relative min-w-0">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            className="w-full min-w-0 truncate rounded-xl border border-border bg-card py-3 pl-10 pr-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            autoComplete="off"
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              onQueryChange(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
          />
        </div>
        {dropdown}
      </div>
    );
  }

  return (
    <div ref={wrapRef} className={cn("tfr-cell relative min-w-0", cellClassName)}>
      <MapPin className="tfr-cell-ic" aria-hidden />
      <div className="tfr-cell-field">
        <span className="tfr-cell-label">
          <span className="truncate">{label}</span>
        </span>
        <input
          className="tfr-cell-value"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onQueryChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
      </div>
      {dropdown}
    </div>
  );
}
