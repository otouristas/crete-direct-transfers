import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Check, Coins, Globe, X } from "lucide-react";
import { LOCALES, LOCALE_LABELS, useLocale, useT, type Locale } from "@/i18n";
import { CURRENCIES, type CurrencyCode } from "@/lib/currency";
import { useCurrency } from "@/hooks/use-currency";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({
  className,
  onDark = false,
}: {
  className?: string;
  /** Soft hover for navy / transparent header chrome. */
  onDark?: boolean;
}) {
  const t = useT();
  const locale = useLocale();
  const navigate = useNavigate();
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);

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

  const pickCurrency = (code: CurrencyCode) => {
    setCurrency(code);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
          onDark
            ? "text-primary-foreground hover:bg-primary-foreground/10"
            : "hover:bg-muted",
          className,
        )}
        aria-label={t.settings.title}
      >
        <Globe className="h-4 w-4" />
        <span className="uppercase">{locale}</span>
        <span className="opacity-50" aria-hidden>
          ·
        </span>
        <span className="uppercase tracking-wide">{currency}</span>
      </button>

      <DialogContent
        showCloseButton={false}
        className={cn(
          "flex flex-col gap-0 overflow-hidden border-0 bg-card p-0 shadow-xl",
          "fixed inset-x-0 bottom-0 top-auto left-auto right-auto h-[92vh] w-full max-w-none",
          "translate-x-0 translate-y-0 rounded-t-2xl rounded-b-none",
          "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
          "sm:inset-auto sm:left-[50%] sm:top-[50%] sm:h-auto sm:max-h-[85vh] sm:w-full sm:max-w-[600px]",
          "sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-2xl",
          "sm:data-[state=open]:slide-in-from-top-0 sm:data-[state=closed]:slide-out-to-top-0",
          "sm:data-[state=open]:zoom-in-95 sm:data-[state=closed]:zoom-out-95",
        )}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-6 pb-4 pt-5">
          <DialogTitle className="text-lg font-semibold text-foreground">
            {t.settings.title}
          </DialogTitle>
          <DialogDescription className="sr-only">{t.settings.description}</DialogDescription>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="cursor-pointer rounded-full p-1 transition-colors hover:bg-muted"
            aria-label={t.settings.close}
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" aria-hidden />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {t.settings.language}
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {LOCALES.map((l) => {
                const selected = l === locale;
                return (
                  <button
                    key={l}
                    type="button"
                    onClick={() => switchTo(l)}
                    className={cn(
                      "relative flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all",
                      selected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border bg-card hover:border-muted-foreground/30 hover:bg-muted/50",
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm font-medium",
                        selected ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {LOCALE_LABELS[l]}
                    </span>
                    {selected && (
                      <span className="absolute right-2.5 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="my-5 border-t border-border" />

          <div>
            <div className="mb-3 flex items-center gap-2">
              <Coins className="h-4 w-4 text-muted-foreground" aria-hidden />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {t.settings.currency}
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {CURRENCIES.map((c) => {
                const selected = c.code === currency;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => pickCurrency(c.code)}
                    className={cn(
                      "relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 px-2 py-3 text-center transition-all",
                      selected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border bg-card hover:border-muted-foreground/30 hover:bg-muted/50",
                    )}
                  >
                    <span
                      className={cn(
                        "text-base font-bold",
                        selected ? "text-foreground" : "text-foreground/80",
                      )}
                    >
                      {c.code}
                    </span>
                    <span
                      className={cn(
                        "mt-0.5 max-w-full truncate text-[11px]",
                        selected ? "text-muted-foreground" : "text-muted-foreground/70",
                      )}
                    >
                      {c.name}
                    </span>
                    {selected && (
                      <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
