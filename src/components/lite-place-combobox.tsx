import { useEffect, useRef, useState } from "react";
import { liteSearchPlaces } from "@/functions/liteapi";
import { cn } from "@/lib/utils";

export type LitePlaceOption = {
  placeId: string;
  displayName: string;
  formattedAddress?: string;
};

/** Autocomplete against Nuitee Connect /data/places (server-side key). */
export function LitePlaceCombobox({
  value,
  onChange,
  placeholder = "City, area, or hotel…",
  className,
  inputClassName,
}: {
  value: LitePlaceOption | null;
  onChange: (p: LitePlaceOption | null) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}) {
  const [query, setQuery] = useState(value?.displayName ?? "");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hits, setHits] = useState<LitePlaceOption[]>([]);
  const seq = useRef(0);

  useEffect(() => {
    if (value) setQuery(value.displayName);
  }, [value]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2 || (value && q === value.displayName)) {
      setHits([]);
      return;
    }
    const id = ++seq.current;
    setLoading(true);
    const t = setTimeout(() => {
      void liteSearchPlaces({ data: { textQuery: q, type: "locality,airport" } })
        .then((res) => {
          if (id !== seq.current) return;
          if (!res.ok || !res.data) {
            setHits([]);
            return;
          }
          setHits(
            res.data.map((p) => ({
              placeId: p.placeId,
              displayName: p.displayName,
              formattedAddress: p.formattedAddress,
            })),
          );
        })
        .finally(() => {
          if (id === seq.current) setLoading(false);
        });
    }, 280);
    return () => clearTimeout(t);
  }, [query, value]);

  return (
    <div className={cn("relative", className)}>
      <input
        className={cn(
          "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-accent",
          inputClassName,
        )}
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(null);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        autoComplete="off"
      />
      {open && (hits.length > 0 || loading) ? (
        <ul className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-border bg-card shadow-lg">
          {loading ? <li className="px-3 py-2 text-xs text-muted-foreground">Searching…</li> : null}
          {hits.map((h) => (
            <li key={h.placeId}>
              <button
                type="button"
                className="block w-full px-3 py-2 text-left text-sm hover:bg-muted"
                onClick={() => {
                  onChange(h);
                  setQuery(h.displayName);
                  setOpen(false);
                }}
              >
                <div className="font-medium text-primary">{h.displayName}</div>
                {h.formattedAddress ? (
                  <div className="text-xs text-muted-foreground">{h.formattedAddress}</div>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
