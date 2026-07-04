import { createFileRoute } from "@tanstack/react-router";
import { FAQ_GROUPS } from "@/data/faqs";
import { FaqAccordion } from "@/components/faq-accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ | Crete Transfer Questions Answered · CreteTransfers" },
      { name: "description", content: "Answers to every common question about booking a Crete transfer — pricing, payment, cancellation, luggage, kids, flight delays and more." },
      { property: "og:title", content: "Crete Transfer FAQ | CreteTransfers" },
      { property: "og:description", content: "All your Crete transfer questions answered." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_GROUPS.flatMap((g) =>
            g.items.map((i) => ({
              "@type": "Question",
              name: i.q,
              acceptedAnswer: { "@type": "Answer", text: i.a },
            })),
          ),
        }),
      },
    ],
  }),
  component: () => (
    <>
      <section className="border-b border-border/60 bg-sand">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <div className="text-xs uppercase tracking-[0.2em] text-accent">FAQ</div>
          <h1 className="mt-3 text-4xl md:text-6xl font-serif text-primary">Frequently asked.</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Everything travellers ask before booking a Crete transfer. Still stuck? Contact us.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-6 py-16">
        <FaqAccordion groups={FAQ_GROUPS} />
      </section>
    </>
  ),
});
