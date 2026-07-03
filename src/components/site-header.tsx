import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-serif text-lg leading-none">C</span>
          </span>
          <span className="font-serif text-xl tracking-tight text-primary">
            CreteTransfers
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link to="/routes" className="hover:text-accent transition-colors [&.active]:text-accent">
            Routes
          </Link>
          <Link to="/fleet" className="hover:text-accent transition-colors [&.active]:text-accent">
            Fleet
          </Link>
          <a
            href="#how-it-works"
            className="hover:text-accent transition-colors"
          >
            How it works
          </a>
        </nav>
        <Link
          to="/book"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm text-accent-foreground hover:opacity-90 transition"
        >
          Get a quote
        </Link>
      </div>
    </header>
  );
}
