import { Link } from "@tanstack/react-router";
import { ROUTES } from "@/data/routes";
import { REGIONS } from "@/data/regions";
import { SERVICES } from "@/data/services";

export function SiteFooter() {
  const topRoutes = ROUTES.slice(0, 6);
  return (
    <footer className="mt-24 border-t border-border/60 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-full bg-accent flex items-center justify-center">
              <span className="text-accent-foreground font-serif text-lg leading-none">C</span>
            </span>
            <span className="font-serif text-2xl tracking-tight">CreteTransfers</span>
          </div>
          <p className="mt-4 text-primary-foreground/70 max-w-sm">
            Fixed-price airport and port transfers across Crete. Local licensed drivers, no bidding, no
            surprises.
          </p>
          <div className="mt-6 space-y-2 text-sm text-primary-foreground/80">
            <div>hello@cretetransfers.example</div>
            <div>+30 28 1000 0000 · 24/7 dispatch</div>
          </div>
        </div>

        <FooterCol title="Top routes">
          {topRoutes.map((r) => (
            <li key={r.slug}>
              <Link to="/routes/$slug" params={{ slug: r.slug }} className="hover:text-accent">
                {r.from.replace(" (HER)", "").replace(" (CHQ)", "").replace(" (Ferry)", "")} → {r.to}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/routes" className="hover:text-accent underline underline-offset-4">
              All routes →
            </Link>
          </li>
        </FooterCol>

        <FooterCol title="Regions & services">
          {REGIONS.map((r) => (
            <li key={r.slug}>
              <Link to="/regions/$slug" params={{ slug: r.slug }} className="hover:text-accent">
                {r.name}
              </Link>
            </li>
          ))}
          {SERVICES.slice(0, 3).map((s) => (
            <li key={s.slug}>
              <Link to="/services/$slug" params={{ slug: s.slug }} className="hover:text-accent">
                {s.name}
              </Link>
            </li>
          ))}
        </FooterCol>

        <FooterCol title="Company">
          <li><Link to="/about" className="hover:text-accent">About</Link></li>
          <li><Link to="/how-it-works" className="hover:text-accent">How it works</Link></li>
          <li><Link to="/fleet" className="hover:text-accent">Our fleet</Link></li>
          <li><Link to="/reviews" className="hover:text-accent">Reviews</Link></li>
          <li><Link to="/faq" className="hover:text-accent">FAQ</Link></li>
          <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
          <li><Link to="/for-hotels" className="hover:text-accent">For hotels</Link></li>
          <li><Link to="/for-drivers" className="hover:text-accent">For drivers</Link></li>
        </FooterCol>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto max-w-7xl px-6 py-6 text-xs text-primary-foreground/50 flex flex-wrap justify-between gap-3">
          <span>© {new Date().getFullYear()} CreteTransfers. Licensed Cretan operators.</span>
          <div className="flex flex-wrap gap-4">
            <Link to="/legal/terms" className="hover:text-accent">Terms</Link>
            <Link to="/legal/privacy" className="hover:text-accent">Privacy</Link>
            <Link to="/legal/cookies" className="hover:text-accent">Cookies</Link>
            <Link to="/legal/refunds" className="hover:text-accent">Refunds</Link>
            <Link to="/legal/imprint" className="hover:text-accent">Imprint</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-primary-foreground/50 mb-4">{title}</div>
      <ul className="space-y-2 text-sm">{children}</ul>
    </div>
  );
}
