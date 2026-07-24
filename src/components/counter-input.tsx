import { Minus, Plus } from "lucide-react";

export function CounterInput({
  value,
  onChange,
  min = 0,
  max = 8,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  label: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5 rounded-xl border border-input bg-card px-2 py-2">
      <span className="text-center text-[11px] leading-tight text-foreground/90">{label}</span>
      <div className="flex items-center justify-center gap-1">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition hover:bg-muted disabled:opacity-40"
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="w-5 shrink-0 text-center text-sm font-semibold tabular-nums">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition hover:bg-muted disabled:opacity-40"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
