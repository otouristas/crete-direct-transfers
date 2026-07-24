import { useEffect, useId, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { searchLocalPlaces, searchPlaces, type PlaceResult } from "@/lib/place-search";
import { cn } from "@/lib/utils";

const KIND_FALLBACK: Record<PlaceResult["kind"], string> = {
  airport: "Airport",
  destination: "Place",
  "route-end": "Route",
  address: "Address",
};

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
  cellClassName,
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
  kindLabels?: Record<PlaceResult["kind"], string>;
  cellClassName?: string;
}) {
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<PlaceResult[]>(() => searchLocalPlaces(""));
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const q = value.trim();
    setLoading(true);
    const handle = window.setTimeout(async () => {
      const next = await searchPlaces(q);
      if (!cancelled) {
        setResults(next);
        setActive(0);
        setLoading(false);
      }
    }, q.length >= 3 ? 280 : 0);
    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [value, open]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

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
          onKeyDown={(e) => {
            if (!open) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((i) => Math.min(i + 1, results.length));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              if (active === results.length) {
                onPinOnMap();
                setOpen(false);
              } else if (results[active]) {
                onSelect(results[active]);
                setOpen(false);
              }
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
        />
      </div>

      {open && (
        <div id={listId} role="listbox" className="tfr-suggest">
          {results.length === 0 && !loading && (
            <div className="px-3 py-2.5 text-sm text-muted-foreground">{noPlacesLabel}</div>
          )}
          {results.map((place, i) => (
            <button
              key={place.id}
              type="button"
              role="option"
              aria-selected={i === active}
              data-active={i === active}
              className="tfr-suggest-item"
              onMouseEnter={() => setActive(i)}
              onClick={() => {
                onSelect(place);
                setOpen(false);
              }}
            >
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-deep" />
              <span className="min-w-0">
                <span className="block truncate font-medium">{place.label}</span>
                <span className="tfr-suggest-kind">{kindLabels[place.kind]}</span>
              </span>
            </button>
          ))}
          <button
            type="button"
            role="option"
            aria-selected={active === results.length}
            data-active={active === results.length}
            className="tfr-suggest-item border-t border-border"
            onMouseEnter={() => setActive(results.length)}
            onClick={() => {
              onPinOnMap();
              setOpen(false);
            }}
          >
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
            <span className="font-medium">{pinLabel}</span>
          </button>
        </div>
      )}
    </div>
  );
}
