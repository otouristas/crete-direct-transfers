import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X, ChevronDown, Phone, Star } from "lucide-react";
import { useT } from "@/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";
import { AccountMenu, MobileAccountLinks } from "@/components/auth/account-menu";
import { Logo } from "@/components/logo";
import { TrustPills } from "@/components/sections/trust-pills";
import { CONTACT_PHONE, CONTACT_PHONE_HREF } from "@/lib/site";
import { AVG_RATING } from "@/data/reviews";

type MegaItem = { label: string; to: string; params?: Record<string, string> };
type MegaGroup = { label: string; to: string; items: MegaItem[] };

function useMega(): MegaGroup[] {
  const t = useT();
  return [
    {
      label: t.nav.routes,
      to: "/{-$locale}/routes",
      items: [
        {
          label: "Heraklion Airport → Elounda",
          to: "/{-$locale}/routes/$slug",
          params: { slug: "heraklion-airport-to-elounda" },
        },
        {
          label: "Heraklion Airport → Chania",
          to: "/{-$locale}/routes/$slug",
          params: { slug: "heraklion-airport-to-chania" },
        },
        {
          label: "Chania Airport → Old Town",
          to: "/{-$locale}/routes/$slug",
          params: { slug: "chania-airport-to-chania-old-town" },
        },
        {
          label: "Souda Port → Chania",
          to: "/{-$locale}/routes/$slug",
          params: { slug: "souda-port-to-chania-old-town" },
        },
      ],
    },
    {
      label: t.nav.regions,
      to: "/{-$locale}/regions",
      items: [
        { label: "Chania", to: "/{-$locale}/regions/$slug", params: { slug: "chania" } },
        { label: "Rethymno", to: "/{-$locale}/regions/$slug", params: { slug: "rethymno" } },
        { label: "Heraklion", to: "/{-$locale}/regions/$slug", params: { slug: "heraklion" } },
        { label: "Lasithi", to: "/{-$locale}/regions/$slug", params: { slug: "lasithi" } },
      ],
    },
    {
      label: t.nav.services,
      to: "/{-$locale}/services",
      items: [
        {
          label: "Airport transfers",
          to: "/{-$locale}/services/$slug",
          params: { slug: "airport-transfers" },
        },
        {
          label: "Port transfers",
          to: "/{-$locale}/services/$slug",
          params: { slug: "port-transfers" },
        },
        {
          label: "Private day tours",
          to: "/{-$locale}/services/$slug",
          params: { slug: "private-tours" },
        },
        {
          label: "Group transfers",
          to: "/{-$locale}/services/$slug",
          params: { slug: "group-transfers" },
        },
      ],
    },
    {
      label: t.nav.fleet,
      to: "/{-$locale}/fleet",
      items: [
        { label: "Economy", to: "/{-$locale}/fleet/$class", params: { class: "economy" } },
        { label: "Comfort", to: "/{-$locale}/fleet/$class", params: { class: "comfort" } },
        { label: "Minivan", to: "/{-$locale}/fleet/$class", params: { class: "minivan" } },
        { label: "Luxury", to: "/{-$locale}/fleet/$class", params: { class: "luxury" } },
      ],
    },
  ];
}

export function SiteHeader() {
  const t = useT();
  const mega = useMega();
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the full-screen menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const close = () => setMobileOpen(false);

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-card/95 backdrop-blur transition-shadow ${
        scrolled ? "border-border shadow-sm" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3.5">
        <Link to="/{-$locale}" className="flex shrink-0 items-center">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-0.5 text-sm lg:flex">
          {mega.map((group) => (
            <div
              key={group.label}
              className="relative"
              onMouseEnter={() => setOpen(group.label)}
              onMouseLeave={() => setOpen(null)}
            >
              <Link
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                to={group.to as any}
                className="flex items-center gap-1 rounded-full px-3 py-2 font-medium transition hover:bg-muted"
              >
                {group.label}
                <ChevronDown className="h-3 w-3 opacity-60" />
              </Link>
              {open === group.label && (
                <div className="absolute left-0 top-full min-w-56 pt-2">
                  <div className="rounded-xl border border-border bg-card p-2 shadow-xl">
                    {group.items.map((item) => (
                      <Link
                        key={item.label}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        to={item.to as any}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        params={item.params as any}
                        className="block rounded-lg px-3 py-2 text-sm hover:bg-muted"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <Link
            to="/{-$locale}/blog"
            className="rounded-full px-3 py-2 font-medium transition hover:bg-muted"
          >
            {t.nav.blog}
          </Link>
          <Link
            to="/{-$locale}/about"
            className="rounded-full px-3 py-2 font-medium transition hover:bg-muted"
          >
            {t.nav.about}
          </Link>
          <Link
            to="/{-$locale}/contact"
            className="rounded-full px-3 py-2 font-medium transition hover:bg-muted"
          >
            {t.nav.contact}
          </Link>
        </nav>

        <div className="flex items-center gap-1.5">
          <LanguageSwitcher className="hidden md:inline-flex" />
          <AccountMenu />
          <Link
            to="/{-$locale}/book"
            className="hidden items-center rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90 md:inline-flex"
          >
            {t.common.bookNow}
          </Link>
          <button
            className="rounded-full p-2 hover:bg-muted lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={t.nav.menu}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* The header's backdrop-blur makes it the containing block for
          position:fixed children, so the overlay must portal to <body>. */}
      {mobileOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-50 flex flex-col bg-primary text-primary-foreground lg:hidden">
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-4">
              <Link to="/{-$locale}" onClick={close}>
                <Logo dark />
              </Link>
              <button
                onClick={close}
                aria-label={t.nav.menu}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-foreground/10 transition hover:bg-primary-foreground/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable nav body */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-3.5 py-1.5 text-xs font-semibold ring-1 ring-primary-foreground/15">
                <Star className="h-3.5 w-3.5 fill-highlight text-highlight" />
                {AVG_RATING} · Google · {t.stats.transfersValue} {t.stats.transfers.toLowerCase()}
              </div>

              <nav className="space-y-6">
                {mega.map((group) => (
                  <div key={group.label}>
                    <Link
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      to={group.to as any}
                      onClick={close}
                      className="font-display text-3xl leading-tight transition hover:text-accent"
                    >
                      {group.label}
                    </Link>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
                      {group.items.map((item) => (
                        <Link
                          key={item.label}
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          to={item.to as any}
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          params={item.params as any}
                          onClick={close}
                          className="text-sm text-primary-foreground/70 transition hover:text-accent"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>

              <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-primary-foreground/15 pt-6 text-base font-medium">
                <Link
                  to="/{-$locale}/blog"
                  onClick={close}
                  className="transition hover:text-accent"
                >
                  {t.nav.blog}
                </Link>
                <Link
                  to="/{-$locale}/about"
                  onClick={close}
                  className="transition hover:text-accent"
                >
                  {t.nav.about}
                </Link>
                <Link to="/{-$locale}/faq" onClick={close} className="transition hover:text-accent">
                  {t.nav.faq}
                </Link>
                <Link
                  to="/{-$locale}/reviews"
                  onClick={close}
                  className="transition hover:text-accent"
                >
                  {t.nav.reviews}
                </Link>
                <Link
                  to="/{-$locale}/contact"
                  onClick={close}
                  className="transition hover:text-accent"
                >
                  {t.nav.contact}
                </Link>
                <Link
                  to="/{-$locale}/how-it-works"
                  onClick={close}
                  className="transition hover:text-accent"
                >
                  {t.nav.howItWorks}
                </Link>
                <MobileAccountLinks onNavigate={close} />
              </div>

              <TrustPills dark className="mt-8" />
            </div>

            {/* Bottom CTA block */}
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
                  href={CONTACT_PHONE_HREF}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-primary-foreground/25 px-4 py-3 text-sm font-semibold transition hover:bg-primary-foreground/10"
                >
                  <Phone className="h-4 w-4" />
                  {CONTACT_PHONE}
                </a>
                <LanguageSwitcher className="text-primary-foreground hover:bg-primary-foreground/10" />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </header>
  );
}
