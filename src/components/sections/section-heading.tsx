import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  dark = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.18em]",
            dark ? "text-accent" : "text-accent-deep",
          )}
        >
          {eyebrow}
        </div>
      )}
      <h2
        className={cn(
          "mt-3 text-3xl md:text-4xl font-display",
          dark ? "text-primary-foreground" : "text-primary",
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-lg",
            dark ? "text-primary-foreground/75" : "text-muted-foreground",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
