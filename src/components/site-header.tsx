import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Briefcase, Building2, Car, ChevronDown, Globe2, Menu, Plane, X } from "lucide-react";
import { PREFIX_LOCALES, useLocale, useT } from "@/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";
import { AccountMenu } from "@/components/auth/account-menu";
import { Logo } from "@/components/logo";
import { MobileMenu } from "@/components/mobile-menu";
import { cn } from "@/lib/utils";
import { getMarketNavigation } from "@/lib/market-navigation";
import { TRAVEL_AGENCY_COPY } from "@/lib/travel-agency-copy";
import { getCountryImage, imageUrl } from "@/lib/place-image";

const HEADER_H = "h-16";

function useIsHome(): boolean {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "") return true;
  return PREFIX_LOCALES.some((l) => pathname === `/${l}` || pathname === `/${l}/`);
}

function usePathname(): string {
  return useRouterState({ select: (s) => s.location.pathname });
}

/** Strips any `/{locale}` prefix so nav matching works on every language. */
function unlocalized(pathname: string): string {
  for (const l of PREFIX_LOCALES) {
    if (pathname === `/${l}`) return "/";
    if (pathname.startsWith(`/${l}/`)) return pathname.slice(l.length + 1);
  }
  return pathname;
}

type NavLink = {
  label: string;
  to: string;
  params?: Record<string, string>;
};

export function SiteHeader() {
  const t = useT();
  const locale = useLocale();
  const isHome = useIsHome();
  const path = unlocalized(usePathname());

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [destinationsOpen, setDestinationsOpen] = useState(false);
  const [partnersOpen, setPartnersOpen] = useState(false);
  const destinationsRef = useRef<HTMLDivElement>(null);
  const partnersRef = useRef<HTMLDivElement>(null);
  const markets = getMarketNavigation(locale);

  const overlay = isHome && !scrolled;
  const solid = !overlay;

  const primaryLinks: NavLink[] = [
    {
      label: t.nav.airports,
      to: "/{-$locale}/airports",
    },
    { label: t.cityToCityPage.eyebrow, to: "/{-$locale}/city-to-city" },
  ];

  const partnerLinks: NavLink[] = [
    { label: t.nav.forHotels, to: "/{-$locale}/for-hotels" },
    { label: t.nav.forDrivers, to: "/{-$locale}/for-drivers" },
    { label: TRAVEL_AGENCY_COPY[locale].nav, to: "/{-$locale}/for-travel-agencies" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!partnersOpen && !destinationsOpen) return;
    const onPointer = (e: MouseEvent) => {
      if (destinationsRef.current && !destinationsRef.current.contains(e.target as Node)) {
        setDestinationsOpen(false);
      }
      if (partnersRef.current && !partnersRef.current.contains(e.target as Node)) {
        setPartnersOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDestinationsOpen(false);
        setPartnersOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [destinationsOpen, partnersOpen]);

  const navLinkClass = cn(
    "relative whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors",
    "text-primary-foreground/85 hover:text-primary-foreground",
    "after:pointer-events-none after:absolute after:inset-x-3 after:bottom-1 after:h-px",
    "after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300",
    "hover:after:scale-x-100",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary",
  );

  /** Lit underline + full-strength text for the section you're currently in. */
  const activeClass = "text-primary-foreground after:scale-x-100";

  return (
    <>
      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5">
        <div
          className={cn(
            "mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-4 rounded-2xl px-4 transition-[background-color,box-shadow,border-color] duration-300 sm:px-5 lg:rounded-full lg:grid-cols-[1fr_auto_1fr]",
            HEADER_H,
            solid
              ? "bg-primary/90 shadow-[0_12px_40px_-12px_var(--primary)] ring-1 ring-primary-foreground/10 backdrop-blur-xl"
              : "bg-primary/35 ring-1 ring-primary-foreground/15 backdrop-blur-md",
          )}
        >
          {/* Left — logo */}
          <Link to="/{-$locale}" className="justify-self-start">
            <Logo dark />
          </Link>

          {/* Center — flat nav */}
          <nav className="hidden items-center gap-0.5 lg:flex" aria-label={t.nav.menu}>
            <div
              ref={destinationsRef}
              className="relative"
              onMouseEnter={() => {
                setDestinationsOpen(true);
                setPartnersOpen(false);
              }}
              onMouseLeave={() => setDestinationsOpen(false)}
            >
              <button
                type="button"
                className={cn(navLinkClass, "inline-flex items-center gap-1")}
                aria-haspopup="true"
                aria-expanded={destinationsOpen}
                aria-controls={destinationsOpen ? "destinations-menu" : undefined}
                onClick={() => {
                  setDestinationsOpen((value) => !value);
                  setPartnersOpen(false);
                }}
              >
                <span>{t.nav.destinations}</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 opacity-70 transition-transform",
                    destinationsOpen && "rotate-180",
                  )}
                  aria-hidden
                />
              </button>
              {destinationsOpen ? (
                <div
                  id="destinations-menu"
                  role="menu"
                  aria-label={t.nav.destinations}
                  className="absolute left-1/2 top-full z-50 w-[34rem] -translate-x-1/2 pt-2"
                >
                  <div className="origin-top rounded-2xl bg-card p-3 text-foreground shadow-xl ring-1 ring-black/5">
                    <div className="grid grid-cols-2 gap-1">
                      {markets.map((market) => {
                        const photo = getCountryImage(market.slug);
                        return (
                          <Link
                            key={market.slug}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            to={`/{-$locale}/${market.slug}` as any}
                            role="menuitem"
                            onClick={() => setDestinationsOpen(false)}
                            className="group flex items-center gap-3 rounded-xl p-2 transition hover:bg-muted"
                          >
                            <span className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                              <img
                                src={imageUrl(photo, { width: 160, height: 120, dpr: 2 })}
                                alt=""
                                loading="lazy"
                                decoding="async"
                                style={{ backgroundColor: photo.avgColor }}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <span
                                aria-hidden
                                className="absolute bottom-0.5 left-0.5 text-sm leading-none drop-shadow"
                              >
                                {market.flag}
                              </span>
                            </span>
                            <span className="min-w-0">
                              <span className="block text-sm font-semibold text-foreground">
                                {market.name}
                              </span>
                              <span className="block text-xs text-muted-foreground">
                                {market.slug === "greece"
                                  ? t.marketsDirectory.instantCrete
                                  : t.marketsDirectory.quoteFirst}
                              </span>
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                    <Link
                      to="/{-$locale}/countries"
                      role="menuitem"
                      onClick={() => setDestinationsOpen(false)}
                      className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-accent-deep transition hover:border-accent hover:bg-accent/5"
                    >
                      <Globe2 className="h-4 w-4" aria-hidden />
                      {t.nav.allDestinations}
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>

            {primaryLinks.map((item) => {
              const href = item.to.replace("/{-$locale}", "");
              const active = href !== "" && path.startsWith(href);
              return (
                <Link
                  key={item.label}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  to={item.to as any}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  params={item.params as any}
                  aria-current={active ? "page" : undefined}
                  className={cn(navLinkClass, active && activeClass)}
                >
                  {item.label}
                </Link>
              );
            })}

            <div
              ref={partnersRef}
              className="relative"
              onMouseEnter={() => {
                setPartnersOpen(true);
                setDestinationsOpen(false);
              }}
              onMouseLeave={() => setPartnersOpen(false)}
            >
              <button
                type="button"
                className={cn(navLinkClass, "inline-flex items-center gap-1")}
                aria-haspopup="true"
                aria-expanded={partnersOpen}
                aria-controls={partnersOpen ? "partners-menu" : undefined}
                onClick={() => setPartnersOpen((v) => !v)}
              >
                <span>{t.nav.partners}</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 opacity-70 transition-transform",
                    partnersOpen && "rotate-180",
                  )}
                  aria-hidden
                />
              </button>
              {partnersOpen && (
                <div
                  id="partners-menu"
                  role="menu"
                  aria-label={t.nav.partners}
                  className="absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-2"
                >
                  <div className="origin-top rounded-xl bg-card py-2 shadow-lg ring-1 ring-black/5">
                    {partnerLinks.map((item) => (
                      <Link
                        key={item.label}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        to={item.to as any}
                        role="menuitem"
                        onClick={() => setPartnersOpen(false)}
                        className="group flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted hover:text-accent-deep"
                      >
                        <span className="text-accent">
                          {item.to.includes("hotels") ? (
                            <Building2 className="h-4 w-4" aria-hidden />
                          ) : item.to.includes("travel-agencies") ? (
                            <Plane className="h-4 w-4" aria-hidden />
                          ) : (
                            <Briefcase className="h-4 w-4" aria-hidden />
                          )}
                        </span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right — utilities */}
          <div className="flex items-center justify-self-end gap-1">
            <LanguageSwitcher onDark className="hidden md:inline-flex" />
            <AccountMenu onDark />
            <Link
              to="/{-$locale}/book"
              className="hidden items-center whitespace-nowrap rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground shadow-[0_1px_0_0_rgb(255_255_255/0.25)_inset] transition hover:brightness-105 hover:shadow-[0_6px_18px_-6px_var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary md:inline-flex"
            >
              {t.common.bookNow}
            </Link>
            <Link
              to="/{-$locale}/book"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground transition hover:opacity-90 md:hidden"
              aria-label={t.common.bookNow}
            >
              <Car className="h-4 w-4" />
            </Link>
            <button
              type="button"
              className="rounded-full p-2 text-primary-foreground transition hover:bg-primary-foreground/10 lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={t.nav.menu}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
