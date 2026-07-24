import { Link } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { useT } from "@/i18n";
import { CONTACT_WHATSAPP_HREF } from "@/lib/site";

export function CtaBand({ title, subtitle }: { title?: string; subtitle?: string }) {
  const t = useT();
  return (
    <section className="relative overflow-hidden bg-primary">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent" />
      <div className="relative mx-auto max-w-7xl px-6 py-16 text-center md:py-20">
        <h2 className="mx-auto max-w-2xl text-3xl font-display text-primary-foreground md:text-4xl">
          {title ?? t.home.ctaTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/75">
          {subtitle ?? t.home.ctaSubtitle}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/{-$locale}/book"
            className="inline-flex items-center rounded-xl bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
          >
            {t.common.getPrice}
          </Link>
          <a
            href={CONTACT_WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/25 px-6 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-foreground/10"
          >
            <Phone className="h-4 w-4" />
            {t.common.whatsapp}
          </a>
        </div>
      </div>
    </section>
  );
}
