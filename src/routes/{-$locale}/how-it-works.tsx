import { createFileRoute, Link } from "@tanstack/react-router";
import { getDict, type Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { CtaBand } from "@/components/sections/cta-band";
import { TrustPills } from "@/components/sections/trust-pills";

export const Route = createFileRoute("/{-$locale}/how-it-works")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/how-it-works",
      title: t.howItWorksPage.metaTitle,
      description: t.howItWorksPage.metaDescription,
    });
  },
  component: () => (
    <>
      <section className="border-b border-border bg-muted">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <div className="text-xs uppercase tracking-[0.2em] text-accent">How it works</div>
          <h1 className="mt-3 text-4xl md:text-6xl font-display text-primary">
            Three steps. Zero back-and-forth.
          </h1>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-6 py-16 space-y-12">
        {[
          [
            "01",
            "Get your fixed price",
            "Enter your route, date and passenger count. Our price engine returns a guaranteed fixed price across four vehicle classes — no bidding, no waiting for a driver to respond.",
          ],
          [
            "02",
            "Book in a minute",
            "Passenger name, contact and flight number. That's it. You'll receive email confirmation immediately, and your driver's name, photo and WhatsApp 24 hours before pickup.",
          ],
          [
            "03",
            "Meet at the gate",
            "Your driver tracks your flight or ferry, arrives 15 minutes before you land, and waits at arrivals with your name. Pay in cash, by card, or online in advance.",
          ],
        ].map(([n, t, b]) => (
          <div key={n} className="grid gap-6 md:grid-cols-[100px_1fr] items-start">
            <div className="font-display text-6xl text-accent">{n}</div>
            <div>
              <h2 className="font-display text-2xl text-primary">{t}</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">{b}</p>
            </div>
          </div>
        ))}
        <div className="pt-6">
          <TrustPills />
        </div>
        <div className="pt-2">
          <Link
            to="/{-$locale}/book"
            className="inline-flex rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:opacity-90"
          >
            Start your booking →
          </Link>
        </div>
      </section>
      <CtaBand />
    </>
  ),
});
