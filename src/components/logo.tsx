import { cn } from "@/lib/utils";

/** The approved TransferAround Interchange artwork, shared with the iOS apps. */
export function LogoMark({ className }: { className?: string; dark?: boolean }) {
  return (
    <img
      src="/brand/icon-180.png"
      width={36}
      height={36}
      className={cn("shrink-0 rounded-[22%] object-contain", className)}
      alt=""
      aria-hidden="true"
    />
  );
}

export function Logo({ dark = false, className }: { dark?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className="h-9 w-9" />
      <span
        className={cn(
          "font-display text-xl tracking-[-0.035em]",
          dark ? "text-white" : "text-foreground",
        )}
      >
        TransferAround
      </span>
    </span>
  );
}
