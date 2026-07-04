import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const MEGA = {
  Routes: {
    href: "/routes",
    items: [
      { label: "All Crete routes", to: "/routes" },
      { label: "From Heraklion Airport", to: "/routes" },
      { label: "From Chania Airport", to: "/routes" },
      { label: "From Souda Port", to: "/routes" },
    ],
  },
  Regions: {
    href: "/regions",
    items: [
      { label: "Chania", to: "/regions/chania" },
      { label: "Rethymno", to: "/regions/rethymno" },
      { label: "Heraklion", to: "/regions/heraklion" },
      { label: "Lasithi", to: "/regions/lasithi" },
    ],
  },
  Services: {
    href: "/services",
    items: [
      { label: "Airport transfers", to: "/services/airport-transfers" },
      { label: "Port transfers", to: "/services/port-transfers" },
      { label: "Private day tours", to: "/services/private-tours" },
      { label: "Group transfers", to: "/services/group-transfers" },
    ],
  },
  Fleet: {
    href: "/fleet",
    items: [
      { label: "Economy", to: "/fleet/economy" },
      { label: "Comfort", to: "/fleet/comfort" },
      { label: "Minivan", to: "/fleet/minivan" },
      { label: "Luxury", to: "/fleet/luxury" },
    ],
  },
} as const;

export function SiteHeader() {
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
      className={`sticky top-0 z-40 transition-all ${
        scrolled
          ? "bg-background/95 backdrop-blur border-b border-border/60"
          : "bg-background/80 backdrop-blur border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-serif text-lg leading-none">C</span>
          </span>
          <span className="font-serif text-xl tracking-tight text-primary">CreteTransfers</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 text-sm">
          {(Object.keys(MEGA) as (keyof typeof MEGA)[]).map((key) => (
            <div
              key={key}
              className="relative"
              onMouseEnter={() => setOpen(key)}
              onMouseLeave={() => setOpen(null)}
            >
              <Link
                to={MEGA[key].href}
                className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-muted transition"
              >
                {key}
                <ChevronDown className="w-3 h-3 opacity-60" />
              </Link>
              {open === key && (
                <div className="absolute top-full left-0 pt-2 min-w-52">
                  <div className="rounded-xl bg-card border border-border/60 shadow-xl p-2">
                    {MEGA[key].items.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        className="block px-3 py-2 rounded-lg text-sm hover:bg-muted"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <Link to="/about" className="px-3 py-2 rounded-full hover:bg-muted transition">About</Link>
          <Link to="/faq" className="px-3 py-2 rounded-full hover:bg-muted transition">FAQ</Link>
          <Link to="/contact" className="px-3 py-2 rounded-full hover:bg-muted transition">Contact</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/book"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm text-accent-foreground hover:opacity-90 transition"
          >
            Get a quote
          </Link>
          <button
            className="lg:hidden p-2 rounded-full hover:bg-muted"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border/60 bg-background">
          <div className="px-6 py-4 space-y-3">
            {(Object.keys(MEGA) as (keyof typeof MEGA)[]).map((key) => (
              <div key={key}>
                <Link
                  to={MEGA[key].href}
                  onClick={() => setMobileOpen(false)}
                  className="font-serif text-lg text-primary block"
                >
                  {key}
                </Link>
                <div className="mt-1 ml-3 space-y-1">
                  {MEGA[key].items.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className="block text-sm text-muted-foreground py-1"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <div className="pt-3 border-t border-border/60 space-y-2">
              <Link to="/about" onClick={() => setMobileOpen(false)} className="block text-sm">About</Link>
              <Link to="/faq" onClick={() => setMobileOpen(false)} className="block text-sm">FAQ</Link>
              <Link to="/contact" onClick={() => setMobileOpen(false)} className="block text-sm">Contact</Link>
              <Link
                to="/book"
                onClick={() => setMobileOpen(false)}
                className="mt-3 block text-center rounded-full bg-accent px-5 py-3 text-sm text-accent-foreground"
              >
                Get a quote
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
