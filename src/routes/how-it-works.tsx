import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works | Book a Crete Transfer in 3 Steps · CreteTransfers" },
      { name: "description", content: "How CreteTransfers works: get your fixed price, book in a minute, meet your named driver at the gate." },
      { property: "og:title", content: "How CreteTransfers Works" },
      { property: "og:description", content: "Fixed price. Book in a minute. Meet your driver." },
      { property: "og:url", content: "/how-it-works" },
    ],
    links: [{ rel: "canonical", href: "/how-it-works" }],
  }),
  component: () => (
    <>
      <section className="border-b border-border/60 bg-sand">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <div className="text-xs uppercase tracking-[0.2em] text-accent">How it works</div>
          <h1 className="mt-3 text-4xl md:text-6xl font-serif text-primary">
            Three steps. Zero back-and-forth.
          </h1>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-6 py-16 space-y-12">
        {[
          ["01", "Get your fixed price", "Enter your route, date and passenger count. Our price engine returns a guaranteed fixed price across four vehicle classes — no bidding, no waiting for a driver to respond."],
          ["02", "Book in a minute", "Passenger name, contact and flight number. That's it. You'll receive email confirmation immediately, and your driver's name, photo and WhatsApp 24 hours before pickup."],
          ["03", "Meet at the gate", "Your driver tracks your flight or ferry, arrives 15 minutes before you land, and waits at arrivals with your name. Pay in cash, by card, or online in advance."],
        ].map(([n, t, b]) => (
          <div key={n} className="grid gap-6 md:grid-cols-[100px_1fr] items-start">
            <div className="font-serif text-6xl text-accent">{n}</div>
            <div>
              <h2 className="font-serif text-2xl text-primary">{t}</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">{b}</p>
            </div>
          </div>
        ))}
        <div className="pt-6">
          <Link to="/book" className="inline-flex rounded-full bg-accent px-6 py-3 text-accent-foreground text-sm hover:opacity-90">
            Start your booking →
          </Link>
        </div>
      </section>
    </>
  ),
});
