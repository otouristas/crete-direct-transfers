import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useT } from "@/i18n";

export function BookingCtaBand() {
  const t = useT();
  return (
    <section className="my-16">
      <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-card px-5 py-6 shadow-sm sm:px-8 sm:py-7">
        <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-muted blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-muted/80 blur-2xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-foreground">
              <Sparkles className="h-3.5 w-3.5 text-accent-deep" />
              {t.account.ctaEyebrow}
            </span>
            <h2 className="mt-2 text-center text-2xl font-semibold leading-tight text-primary md:text-left">
              {t.account.ctaTitle}
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground md:text-left">
              {t.account.ctaSubtitle}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2.5 md:justify-start">
              {[t.account.ctaInstant, t.account.ctaFreeCancel, t.account.ctaDoorToDoor].map(
                (label) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground"
                  >
                    <Check className="h-3.5 w-3.5 text-primary" />
                    {label}
                  </span>
                ),
              )}
            </div>
          </div>
          <Link
            to="/{-$locale}/book"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary via-primary to-primary/90 px-6 py-3.5 text-[15px] font-semibold text-primary-foreground shadow-lg transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 lg:w-auto"
          >
            <span>{t.account.ctaButton}</span>
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/20">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
