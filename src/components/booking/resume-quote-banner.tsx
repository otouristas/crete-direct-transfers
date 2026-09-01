import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, History, X } from "lucide-react";
import { getDict, type Locale } from "@/i18n";
import { clearQuote, loadQuote, type SavedQuote } from "@/lib/quote-recovery";
import { cn } from "@/lib/utils";

/** Shows the visitor's last unfinished quote so they can pick it back up. */
export function ResumeQuoteBanner({ locale, className }: { locale: Locale; className?: string }) {
  const t = getDict(locale);
  const [quote, setQuote] = useState<SavedQuote | null>(null);

  // Read after hydration only — local storage is not available during SSR.
  useEffect(() => {
    setQuote(loadQuote());
  }, []);

  if (!quote) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-sm",
        className,
      )}
    >
      <History className="h-4 w-4 shrink-0 text-accent" />
      <div className="min-w-0 flex-1">
        <p className="font-medium text-primary">{t.account.resumeQuoteTitle}</p>
        <p className="truncate text-muted-foreground">{quote.label}</p>
      </div>
      <Link
        to="/{-$locale}/book"
        search={quote.search as never}
        className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
      >
        {t.account.resumeQuoteCta}
        <ArrowRight className="h-4 w-4" />
      </Link>
      <button
        type="button"
        aria-label={t.account.dismiss}
        onClick={() => {
          clearQuote();
          setQuote(null);
        }}
        className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
