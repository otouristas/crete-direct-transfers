import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border/60 bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-6 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-serif text-2xl tracking-tight">CreteTransfers</div>
          <p className="mt-3 text-primary-foreground/70 max-w-sm">
            Fixed-price airport and port transfers across Crete. Local licensed drivers, no bidding,
            no surprises.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-primary-foreground/50 mb-4">
            Service
          </div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/routes" className="hover:text-accent">All routes</Link></li>
            <li><Link to="/fleet" className="hover:text-accent">Our fleet</Link></li>
            <li><Link to="/book" className="hover:text-accent">Book a transfer</Link></li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-primary-foreground/50 mb-4">
            Contact
          </div>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li>hello@cretetransfers.example</li>
            <li>+30 28 1000 0000</li>
            <li>24 / 7 dispatch</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-primary-foreground/50 flex flex-wrap justify-between gap-2">
          <span>© {new Date().getFullYear()} CreteTransfers. Licensed Cretan operators.</span>
          <span>Heraklion · Chania · Rethymno · Lasithi</span>
        </div>
      </div>
    </footer>
  );
}
