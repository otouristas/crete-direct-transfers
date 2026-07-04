import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About CreteTransfers | Fixed-Price, Local Drivers, One Island" },
      { name: "description", content: "CreteTransfers was built by locals to fix what's broken about airport transfers: bidding, surge pricing and no accountability. One island, fixed prices, licensed drivers." },
      { property: "og:title", content: "About CreteTransfers" },
      { property: "og:description", content: "Locally owned, fixed-price, licensed transfers across Crete." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: () => (
    <>
      <section className="border-b border-border/60 bg-sand">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <div className="text-xs uppercase tracking-[0.2em] text-accent">About</div>
          <h1 className="mt-3 text-4xl md:text-6xl font-serif text-primary">
            One island. Fixed prices. Local drivers.
          </h1>
        </div>
      </section>
      <article className="mx-auto max-w-3xl px-6 py-16 prose prose-lg text-foreground/90 leading-relaxed space-y-6">
        <p className="text-xl">
          CreteTransfers exists because the transfer market on our island was broken.
        </p>
        <p>
          Travellers arriving in Heraklion or Chania were being asked to compare bids from strangers,
          negotiate over WhatsApp, or trust a taxi rank meter after a long flight. The prices moved.
          The drivers rotated. Accountability was nobody's job.
        </p>
        <p>
          We're locals — a small team from Chania and Heraklion — and we built what we always wished
          existed: one fixed price per route, one licensed driver assigned per booking, one number to
          call if anything goes wrong.
        </p>
        <h2 className="font-serif text-3xl text-primary pt-6">What we won't do</h2>
        <p>
          No reverse auctions. No surge pricing at 2am. No sending you a random driver we've never met.
          Every driver in our network is KTEL-licensed, insured, and has been driving on Crete for a
          minimum of three years.
        </p>
        <h2 className="font-serif text-3xl text-primary pt-6">Why one island</h2>
        <p>
          The global platforms cover 180 countries and understand none of them well. We cover 260km
          of coastline, two international airports, three ferry ports, and every hotel access road
          worth knowing. Depth over breadth.
        </p>
        <div className="pt-8">
          <Link to="/book" className="inline-flex rounded-full bg-accent px-6 py-3 text-accent-foreground text-sm hover:opacity-90">
            Book a transfer
          </Link>
        </div>
      </article>
    </>
  ),
});
