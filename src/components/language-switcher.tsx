import { useNavigate } from "@tanstack/react-router";
import { ChevronDown, Globe } from "lucide-react";
import { LOCALES, LOCALE_LABELS, useLocale, type Locale } from "@/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({
  className,
  onDark = false,
}: {
  className?: string;
  /** Soft hover for navy / transparent header chrome. */
  onDark?: boolean;
}) {
  const locale = useLocale();
  const navigate = useNavigate();

  const switchTo = (next: Locale) => {
    if (next === locale) return;
    navigate({
      to: ".",
      params: (prev: Record<string, string | undefined>) => ({
        ...prev,
        locale: next === "en" ? undefined : next,
      }),
      search: true,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
          onDark
            ? "text-primary-foreground hover:bg-primary-foreground/10"
            : "hover:bg-muted",
          className,
        )}
        aria-label="Change language"
      >
        <Globe className="h-4 w-4" />
        <span className="uppercase">{locale}</span>
        <ChevronDown className="h-3 w-3 opacity-70" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        {LOCALES.map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => switchTo(l)}
            className={cn("cursor-pointer", l === locale && "font-semibold text-primary")}
          >
            <span className="w-7 text-xs uppercase text-muted-foreground">{l}</span>
            {LOCALE_LABELS[l]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
