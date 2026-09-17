import { cn } from "@/lib/utils";

/**
 * TransferAround mark: a location pin wrapped by a circular "around" arrow.
 * variant "light" = for light backgrounds (navy text); "dark" = for navy backgrounds.
 */
export function LogoMark({ className, dark = false }: { className?: string; dark?: boolean }) {
  const pin = dark ? "#F8FAFC" : "#0B2545";
  // Same 64-unit geometry as public/favicon.svg and the app icons (see
  // scripts/generate-brand-icons.mjs); the viewBox crops the tile's padding so
  // the mark sits tight against the wordmark.
  return (
    <svg viewBox="12.5 10.7 42.7 42.7" className={className} aria-hidden="true" fill="none">
      {/* "around" ring, closing into the arrowhead */}
      <path
        d="M49.16 37.25A17.94 17.94 0 1 1 49.84 30.13"
        stroke="#14B8A6"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M47 27.38H55.13L49.84 33.88Z" fill="#14B8A6" />
      {/* location pin */}
      <path d="M32 42 25.51 33.61A8.2 8.2 0 1 1 38.49 33.61Z" fill={pin} />
      <circle cx="32" cy="28.6" r="3.56" fill="#14B8A6" />
    </svg>
  );
}

export function Logo({ dark = false, className }: { dark?: boolean; className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <LogoMark className="h-9 w-9 shrink-0" dark={dark} />
      <span
        className={cn(
          "font-display text-xl tracking-tight",
          dark ? "text-primary-foreground" : "text-primary",
        )}
      >
        Transfer<span className="text-accent">Around</span>
      </span>
    </span>
  );
}
