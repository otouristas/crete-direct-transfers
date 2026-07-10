import { createFileRoute } from "@tanstack/react-router";
import { getDict, type Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { ContactForm } from "@/components/contact-form";
import { Check } from "lucide-react";

export const Route = createFileRoute("/{-$locale}/for-drivers")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/for-drivers",
      title: t.forDrivers.metaTitle,
      description: t.forDrivers.metaDescription,
    });
  },
  component: () => (
    <>
      <section className="border-b border-border bg-muted">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <div className="text-xs uppercase tracking-[0.2em] text-accent">Drive with us</div>
          <h1 className="mt-3 text-4xl md:text-6xl font-display text-primary">For drivers.</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            A fixed-price network built for professional Cretan drivers who care about repeat guests
            and reputation — not bidding wars.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16 grid gap-12 lg:grid-cols-2 items-start">
        <div>
          <h2 className="font-display text-2xl text-primary">Requirements</h2>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              "Valid KTEL / EDX transfer licence",
              "Vehicle under 7 years old, full commercial insurance",
              "Minimum 3 years professional driving in Crete",
              "Working English (basic)",
              "Smartphone with WhatsApp",
              "Willingness to work to a fixed-price model",
            ].map((x) => (
              <li key={x} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" /> {x}
              </li>
            ))}
          </ul>
          <h2 className="font-display text-2xl text-primary mt-10">What you get</h2>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              "Guaranteed rate per route — no bidding, no undercutting",
              "Weekly payouts, no held cash",
              "Local dispatch (Heraklion & Chania) available 24/7",
              "Priority for repeat and partner-hotel bookings",
            ].map((x) => (
              <li key={x} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-accent mt-0.5 shrink-0" /> {x}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-2xl text-primary mb-6">Apply to join</h2>
          <ContactForm
            topic="driver"
            submitLabel="Send application"
            placeholder="Base city, vehicle make/model/year, years driving in Crete."
          />
        </div>
      </section>
    </>
  ),
});
