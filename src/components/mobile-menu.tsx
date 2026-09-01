import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Briefcase, Building2, Globe2, Plane, X } from "lucide-react";
import { useLocale, useT } from "@/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileAccountLinks } from "@/components/auth/account-menu";
import { Logo } from "@/components/logo";
import { TrustPills } from "@/components/sections/trust-pills";
import { cn } from "@/lib/utils";
import { BUSINESS_METRICS_VERIFIED, REVIEWS_VERIFIED } from "@/lib/site";
import { getMarketNavigation } from "@/lib/market-navigation";
import { TRAVEL_AGENCY_COPY } from "@/lib/travel-agency-copy";

const HEADER_H = "h-16";

type NavLink = {
  label: string;
  to: string;
  hint?: string;
  params?: Record<string, string>;
};

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const t = useT();
  const locale = useLocale();
  const heroCtaRef = useRef<HTMLDivElement>(null);
  const [stickyVisible, setStickyVisible] = useState(false);
  const markets = getMarketNavigation(locale);

  const primaryLinks: NavLink[] = [
    { label: t.nav.airports, to: "/{-$locale}/airports", hint: t.navHints.airports },
    { label: t.nav.routes, to: "/{-$locale}/routes", hint: t.navHints.routes },
  ];

  const partnerLinks: NavLink[] = [
    { label: t.nav.forHotels, to: "/{-$locale}/for-hotels" },
    { label: t.nav.forDrivers, to: "/{-$locale}/for-drivers" },
    { label: TRAVEL_AGENCY_COPY[locale].nav, to: "/{-$locale}/for-travel-agencies" },
  ];

  const secondaryLinks: NavLink[] = [
    { label: t.nav.about, to: "/{-$locale}/about" },
    { label: t.nav.contact, to: "/{-$locale}/contact" },
    { label: t.nav.blog, to: "/{-$locale}/blog" },
    { label: t.nav.howItWorks, to: "/{-$locale}/how-it-works" },
    ...(REVIEWS_VERIFIED ? [{ label: t.nav.reviews, to: "/{-$locale}/reviews" }] : []),
  ];

  const stats = [
    ...(BUSINESS_METRICS_VERIFIED
      ? [{ value: t.stats.transfersValue, label: t.stats.transfers }]
      : []),
    ...(REVIEWS_VERIFIED
      ? [{ value: t.stats.ratingValue, label: t.stats.rating, highlight: true }]
      : []),
    { value: t.stats.supportValue, label: t.stats.support },
  ];

  useEffect(() => {
    if (!open) {
      setStickyVisible(false);
      return;
    }
    const node = heroCtaRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setStickyVisible(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex flex-col bg-primary text-primary-foreground animate-in fade-in duration-200 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label={t.nav.menu}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent" />

      <div className={cn("relative flex items-center justify-between px-5", HEADER_H)}>
        <Link to="/{-$locale}" onClick={onClose}>
          <Logo dark />
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.nav.menu}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-foreground/10 transition hover:bg-primary-foreground/20"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className={cn("relative flex-1 overflow-y-auto px-6", stickyVisible ? "pb-28" : "pb-8")}>
        <TrustPills
          dark
          className="flex-nowrap gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        />

        <div className="mt-5 grid grid-cols-3 gap-3 border-y border-primary-foreground/15 py-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div
                className={cn(
                  "font-display text-xl leading-none",
                  s.highlight ? "text-highlight" : "text-primary-foreground",
                )}
              >
                {s.value}
              </div>
              <div className="mt-1.5 text-[11px] leading-snug text-primary-foreground/55">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div ref={heroCtaRef} className="mt-6">
          <Link
            to="/{-$locale}/book"
            onClick={onClose}
            className="flex w-full items-center justify-center rounded-xl bg-accent px-5 py-4 text-base font-semibold text-accent-foreground transition hover:opacity-90"
          >
            {t.common.getPrice}
          </Link>
          <p className="mt-2.5 text-center text-xs leading-relaxed text-primary-foreground/55">
            {t.trust.flightTracked} · {t.trust.freeCancel} · {t.trust.payOnArrival}
          </p>
        </div>

        <nav className="mt-8" aria-label={t.nav.destinations}>
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/50">
              {t.nav.destinations}
            </p>
            <Link
              to="/{-$locale}/countries"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent"
            >
              <Globe2 className="h-3.5 w-3.5" aria-hidden />
              {t.nav.allDestinations}
            </Link>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {markets.map((market, index) => (
              <Link
                key={market.slug}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                to={`/{-$locale}/${market.slug}` as any}
                onClick={onClose}
                className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 px-3 py-3 transition hover:border-accent/60 hover:bg-primary-foreground/10"
                style={{ animationDelay: `${60 + index * 35}ms`, animationDuration: "300ms" }}
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl" aria-hidden>
                    {market.flag}
                  </span>
                  <span className="text-base font-semibold">{market.name}</span>
                </span>
                <span className="mt-1 block text-[11px] text-primary-foreground/50">
                  {market.slug === "greece"
                    ? t.marketsDirectory.instantCrete
                    : t.marketsDirectory.quoteFirst}
                </span>
              </Link>
            ))}
          </div>
        </nav>

        <nav className="mt-8 space-y-1" aria-label={t.nav.menu}>
          {primaryLinks.map((item, i) => (
            <Link
              key={item.label}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              to={item.to as any}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              params={item.params as any}
              onClick={onClose}
              className="block animate-in fade-in slide-in-from-bottom-2 fill-mode-both py-1.5 transition hover:text-accent"
              style={{ animationDelay: `${80 + i * 45}ms`, animationDuration: "350ms" }}
            >
              <span className="font-display text-3xl leading-tight">{item.label}</span>
              {item.hint ? (
                <span className="mt-0.5 block text-sm font-medium text-primary-foreground/45">
                  {item.hint}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/50">
            {t.nav.partners}
          </p>
          <div className="mt-3 space-y-2">
            {partnerLinks.map((item) => (
              <Link
                key={item.label}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                to={item.to as any}
                onClick={onClose}
                className="flex items-center gap-2.5 text-lg font-medium transition hover:text-accent"
              >
                {item.to.includes("hotels") ? (
                  <Building2 className="h-4 w-4 text-accent" aria-hidden />
                ) : item.to.includes("travel-agencies") ? (
                  <Plane className="h-4 w-4 text-accent" aria-hidden />
                ) : (
                  <Briefcase className="h-4 w-4 text-accent" aria-hidden />
                )}
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-primary-foreground/15 pt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/50">
            {t.nav.company}
          </p>
          <div className="mt-3 flex flex-col gap-2.5 text-base font-medium">
            {secondaryLinks.map((item) => (
              <Link
                key={item.label}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                to={item.to as any}
                onClick={onClose}
                className="transition hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
            <MobileAccountLinks onNavigate={onClose} />
          </div>
        </div>

        <div className="mt-8 border-t border-primary-foreground/15 pt-5">
          <LanguageSwitcher
            onDark
            className="text-primary-foreground hover:bg-primary-foreground/10"
          />
        </div>
      </div>

      {stickyVisible ? (
        <div className="absolute inset-x-0 bottom-0 z-10 border-t border-primary-foreground/15 bg-primary/95 px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Link
            to="/{-$locale}/book"
            onClick={onClose}
            className="flex w-full items-center justify-center rounded-xl bg-accent px-4 py-3.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
          >
            {t.common.getPrice}
          </Link>
        </div>
      ) : null}
    </div>,
    document.body,
  );
}
