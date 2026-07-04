import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "@/components/contact-form";
import { Check } from "lucide-react";

export const Route = createFileRoute("/for-hotels")({
  head: () => ({
    meta: [
      { title: "For Hotels | Guest Transfer Partnership · CreteTransfers" },
      { name: "description", content: "Give your guests a fixed-price, licensed-driver transfer experience. Partnership program for hotels across Crete." },
      { property: "og:title", content: "For Hotels — CreteTransfers Partnership" },
      { property: "og:description", content: "Fixed-price transfers for your guests." },
      { property: "og:url", content: "/for-hotels" },
    ],
    links: [{ rel: "canonical", href: "/for-hotels" }],
  }),
  component: () => (
    <>
      <section className="border-b border-border/60 bg-sand">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <div className="text-xs uppercase tracking-[0.2em] text-accent">Partnership</div>
          <h1 className="mt-3 text-4xl md:text-6xl font-serif text-primary">For hotels.</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            A guest transfer that reflects your standards. Fixed prices, named drivers, one number for
            your concierge to call.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16 grid gap-12 lg:grid-cols-2 items-start">
        <div>
          <h2 className="font-serif text-2xl text-primary">What partner hotels get</h2>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              "Dedicated concierge line, priority booking",
              "White-label booking widget for your site",
              "Commission on every booked transfer",
              "Monthly reporting and reconciliation",
              "Preferred driver pool assigned to your property",
              "Custom pricing for group and wedding bookings",
            ].map((x) => (
              <li key={x} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" /> {x}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-muted-foreground text-sm">
            We already partner with boutique hotels across Chania, Rethymno, Heraklion and Lasithi —
            from 10-room properties to major resorts.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-2xl text-primary mb-6">Get in touch</h2>
          <ContactForm topic="hotel" showCompany submitLabel="Request partnership info" placeholder="Tell us about your property and typical guest volume." />
        </div>
      </section>
    </>
  ),
});
