import { cn } from "@/lib/utils";

/**
 * TransferAround mark: a location pin wrapped by a circular "around" arrow.
 * variant "light" = for light backgrounds (navy text); "dark" = for navy backgrounds.
 */
export function LogoMark({ className, dark = false }: { className?: string; dark?: boolean }) {
  const pin = dark ? "#F8FAFC" : "#0B2545";
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" fill="none">
      {/* circular "around" arrow */}
      <path
        d="M40.5 30.5A18 18 0 1 1 42 24"
        stroke="#14B8A6"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M42.5 15.5 42 24l-7.5-4"
        fill="none"
        stroke="#14B8A6"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* location pin */}
      <path
        d="M24 12c-4.7 0-8.5 3.7-8.5 8.3 0 5.9 7 13.2 7.9 14.1a.9.9 0 0 0 1.2 0c.9-.9 7.9-8.2 7.9-14.1C32.5 15.7 28.7 12 24 12Z"
        fill={pin}
      />
      <circle cx="24" cy="20.4" r="3.1" fill="#14B8A6" />
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
