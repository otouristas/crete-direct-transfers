import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useT } from "@/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";

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

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-card/95 backdrop-blur transition-shadow ${
        scrolled ? "border-border shadow-sm" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3.5">
        <Link to="/{-$locale}" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <span className="font-display text-lg leading-none text-accent">C</span>
          </span>
          <span className="font-display text-xl tracking-tight text-primary">CreteTransfers</span>
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

      {mobileOpen && (
        <div className="max-h-[calc(100dvh-64px)] overflow-y-auto border-t border-border bg-card lg:hidden">
          <div className="space-y-4 px-6 py-5">
            {mega.map((group) => (
              <div key={group.label}>
                <Link
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  to={group.to as any}
                  onClick={() => setMobileOpen(false)}
                  className="block font-display text-lg text-primary"
                >
                  {group.label}
                </Link>
                <div className="ml-3 mt-1 space-y-1">
                  {group.items.map((item) => (
                    <Link
                      key={item.label}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      to={item.to as any}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      params={item.params as any}
                      onClick={() => setMobileOpen(false)}
                      className="block py-1 text-sm text-muted-foreground"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="space-y-2 border-t border-border pt-4">
              <Link
                to="/{-$locale}/blog"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium"
              >
                {t.nav.blog}
              </Link>
              <Link
                to="/{-$locale}/about"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium"
              >
                {t.nav.about}
              </Link>
              <Link
                to="/{-$locale}/faq"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium"
              >
                {t.nav.faq}
              </Link>
              <Link
                to="/{-$locale}/contact"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium"
              >
                {t.nav.contact}
              </Link>
              <div className="flex items-center justify-between pt-2">
                <LanguageSwitcher />
                <Link
                  to="/{-$locale}/book"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
                >
                  {t.common.bookNow}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
