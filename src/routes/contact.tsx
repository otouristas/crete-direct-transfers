import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "@/components/contact-form";
import { Mail, Phone, Clock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact CreteTransfers | 24/7 Dispatch, WhatsApp, Email" },
      { name: "description", content: "Get in touch with our 24/7 Crete transfer dispatch. Email, phone, WhatsApp or contact form." },
      { property: "og:title", content: "Contact CreteTransfers" },
      { property: "og:description", content: "24/7 dispatch — email, phone, or the form." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: () => (
    <>
      <section className="border-b border-border/60 bg-sand">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <div className="text-xs uppercase tracking-[0.2em] text-accent">Contact</div>
          <h1 className="mt-3 text-4xl md:text-6xl font-serif text-primary">Talk to a human.</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Our dispatch is based in Heraklion and answers 24/7. Booking questions, changes, or
            last-minute pickups — we're here.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16 grid gap-12 lg:grid-cols-[1fr_320px]">
        <div>
          <h2 className="font-serif text-2xl text-primary mb-6">Send a message</h2>
          <ContactForm topic="general" placeholder="How can we help?" />
        </div>
        <aside className="space-y-4 text-sm">
          <div className="rounded-2xl bg-card border border-border/60 p-6">
            <Mail className="w-5 h-5 text-accent" />
            <div className="mt-3 font-serif text-primary">Email</div>
            <div className="text-muted-foreground">hello@cretetransfers.example</div>
          </div>
          <div className="rounded-2xl bg-card border border-border/60 p-6">
            <Phone className="w-5 h-5 text-accent" />
            <div className="mt-3 font-serif text-primary">Phone / WhatsApp</div>
            <div className="text-muted-foreground">+30 28 1000 0000</div>
          </div>
          <div className="rounded-2xl bg-card border border-border/60 p-6">
            <Clock className="w-5 h-5 text-accent" />
            <div className="mt-3 font-serif text-primary">Hours</div>
            <div className="text-muted-foreground">Dispatch 24/7 · Office 08:00–22:00 EET</div>
          </div>
        </aside>
      </section>
    </>
  ),
});
