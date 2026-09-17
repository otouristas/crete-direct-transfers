import { Languages } from "lucide-react";
import { useLocale, useT } from "@/i18n";

/**
 * Shown at the top of English-only editorial pages (route guides, hotel areas,
 * ferry ports) when the visitor is on another locale. The page chrome is
 * localized; the long-form body is not, and we say so instead of pretending.
 */
export function EnglishOnlyNote({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const t = useT();
  if (locale === "en") return null;
  return (
    <div className={`mx-auto max-w-7xl px-6 pt-6 ${className}`}>
      <p className="flex items-start gap-2 rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
        <Languages className="mt-0.5 h-4 w-4 shrink-0 text-accent-deep" aria-hidden />
        <span>{t.editorial.englishOnlyNote}</span>
      </p>
    </div>
  );
}
