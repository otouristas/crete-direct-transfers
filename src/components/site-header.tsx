import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Briefcase,
  Building2,
  Car,
  ChevronDown,
  Menu,
  Phone,
  X,
} from "lucide-react";
import { PREFIX_LOCALES, useT } from "@/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";
import { AccountMenu, MobileAccountLinks } from "@/components/auth/account-menu";
import { Logo } from "@/components/logo";
import { CONTACT_PHONE, CONTACT_PHONE_HREF, CONTACT_WHATSAPP_HREF } from "@/lib/site";
import { cn } from "@/lib/utils";

const HEADER_H = "h-16";

function useIsHome(): boolean {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname === "/" || pathname === "") return true;
  return PREFIX_LOCALES.some((l) => pathname === `/${l}` || pathname === `/${l}/`);
}

type NavLink = {
  label: string;
  to: string;
  params?: Record<string, string>;
};

export function SiteHeader() {
  const t = useT();
  const isHome = useIsHome();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [partnersOpen, setPartnersOpen] = useState(false);
  const partnersRef = useRef<HTMLDivElement>(null);

  const overlay = isHome && !scrolled;
  const solid = !overlay;

  const primaryLinks: NavLink[] = [
    {
      label: t.nav.airports,
      to: "/{-$locale}/airports",
    },
    { label: t.nav.greece, to: "/{-$locale}/greece" },
    { label: t.nav.routes, to: "/{-$locale}/routes" },
    { label: t.nav.fleet, to: "/{-$locale}/fleet" },
    { label: t.nav.faq, to: "/{-$locale}/faq" },
  ];

  const partnerLinks: NavLink[] = [
    { label: t.nav.forHotels, to: "/{-$locale}/for-hotels" },
    { label: t.nav.forDrivers, to: "/{-$locale}/for-drivers" },
  ];

  const secondaryLinks: NavLink[] = [
    { label: t.nav.about, to: "/{-$locale}/about" },
    { label: t.nav.contact, to: "/{-$locale}/contact" },
    { label: t.nav.blog, to: "/{-$locale}/blog" },
    { label: t.nav.howItWorks, to: "/{-$locale}/how-it-works" },
    { label: t.nav.reviews, to: "/{-$locale}/reviews" },
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
    if (!partnersOpen) return;
    const onPointer = (e: MouseEvent) => {
      if (partnersRef.current && !partnersRef.current.contains(e.target as Node)) {
        setPartnersOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPartnersOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [partnersOpen]);

  const close = () => setMobileOpen(false);

  const navLinkClass = cn(
    "rounded-full px-3 py-2 text-sm font-medium transition",
    "text-primary-foreground/90 hover:bg-primary-foreground/10 hover:text-primary-foreground",
  );

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 transition-[background-color,box-shadow,border-color] duration-300",
          solid
            ? "border-b border-primary-foreground/10 bg-primary shadow-sm"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div
          className={cn(
            "mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-5 lg:grid-cols-[1fr_auto_1fr]",
            HEADER_H,
          )}
        >
          {/* Left — logo */}
          <Link to="/{-$locale}" className="justify-self-start">
            <Logo dark />
          </Link>

          {/* Center — flat nav */}
          <nav
            className="hidden items-center gap-0.5 lg:flex"
            aria-label="Global"
          >
            {primaryLinks.map((item) => (
              <Link
                key={item.label}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                to={item.to as any}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                params={item.params as any}
                className={navLinkClass}
              >
                {item.label}
              </Link>
            ))}

            <div
              ref={partnersRef}
              className="relative"
              onMouseEnter={() => setPartnersOpen(true)}
              onMouseLeave={() => setPartnersOpen(false)}
            >
              <button
                type="button"
                className={cn(navLinkClass, "inline-flex items-center gap-1")}
                aria-haspopup="true"
                aria-expanded={partnersOpen}
                aria-controls="partners-menu"
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
              className="hidden items-center rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition hover:opacity-90 md:inline-flex"
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

      {/* Mobile sheet — portaled so backdrop-blur header isn't the containing block */}
      {mobileOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-50 flex flex-col bg-primary text-primary-foreground lg:hidden">
            <div className={cn("flex items-center justify-between px-5", HEADER_H)}>
              <Link to="/{-$locale}" onClick={close}>
                <Logo dark />
              </Link>
              <button
                type="button"
                onClick={close}
                aria-label={t.nav.menu}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-foreground/10 transition hover:bg-primary-foreground/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <nav className="space-y-1">
                {primaryLinks.map((item) => (
                  <Link
                    key={item.label}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    to={item.to as any}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    params={item.params as any}
                    onClick={close}
                    className="block font-display text-3xl leading-tight transition hover:text-accent"
                  >
                    {item.label}
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
                      onClick={close}
                      className="flex items-center gap-2.5 text-lg font-medium transition hover:text-accent"
                    >
                      {item.to.includes("hotels") ? (
                        <Building2 className="h-4 w-4 text-accent" aria-hidden />
                      ) : (
                        <Briefcase className="h-4 w-4 text-accent" aria-hidden />
                      )}
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-primary-foreground/15 pt-6 text-base font-medium">
                {secondaryLinks.map((item) => (
                  <Link
                    key={item.label}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    to={item.to as any}
                    onClick={close}
                    className="transition hover:text-accent"
                  >
                    {item.label}
                  </Link>
                ))}
                <MobileAccountLinks onNavigate={close} />
              </div>
            </div>

            <div className="border-t border-primary-foreground/15 bg-primary px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
              <Link
                to="/{-$locale}/book"
                onClick={close}
                className="flex w-full items-center justify-center rounded-xl bg-accent px-5 py-4 text-base font-semibold text-accent-foreground transition hover:opacity-90"
              >
                {t.common.getPrice}
              </Link>
              <div className="mt-3 flex items-center justify-between gap-3">
                <a
                  href={CONTACT_WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-primary-foreground/25 px-4 py-3 text-sm font-semibold transition hover:bg-primary-foreground/10"
                >
                  <Phone className="h-4 w-4" />
                  WhatsApp
                </a>
                <a
                  href={CONTACT_PHONE_HREF}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-primary-foreground/25 px-4 py-3 text-sm font-semibold transition hover:bg-primary-foreground/10"
                >
                  {CONTACT_PHONE}
                </a>
                <LanguageSwitcher
                  onDark
                  className="text-primary-foreground hover:bg-primary-foreground/10"
                />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
