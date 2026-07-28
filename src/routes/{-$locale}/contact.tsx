import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Clock, Copy, Mail, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { getDict, useT, type Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_HREF,
  CONTACT_WHATSAPP_HREF,
} from "@/lib/site";

export const Route = createFileRoute("/{-$locale}/contact")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/contact",
      title: t.contact.metaTitle,
      description: t.contact.metaDescription,
    });
  },
  component: ContactPage,
});

function ContactPage() {
  const t = useT();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {t.contact.eyebrow}
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-display leading-tight text-primary md:text-6xl">
              {t.contact.title}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">{t.contact.subtitle}</p>
          </Reveal>

          <div className={`mt-12 grid gap-5 ${CONTACT_PHONE ? "md:grid-cols-2" : ""}`}>
            <Reveal delay={1} className="rounded-2xl border border-border bg-card p-7 md:p-8">
              <Mail className="h-5 w-5 text-accent-deep" />
              <div className="mt-4 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                {t.contact.emailTitle}
              </div>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-2 block font-display text-2xl text-primary md:text-3xl"
              >
                {CONTACT_EMAIL}
              </a>
              <div className="mt-6 flex flex-wrap gap-4">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-sm font-semibold text-accent-deep hover:underline"
                >
                  {t.contact.emailAction} →
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition hover:text-accent-deep"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "OK" : t.contact.emailCopy}
                </button>
              </div>
            </Reveal>

            {CONTACT_PHONE && CONTACT_PHONE_HREF && (
              <Reveal delay={2} className="rounded-2xl border border-border bg-card p-7 md:p-8">
                <Phone className="h-5 w-5 text-accent-deep" />
                <div className="mt-4 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                  {t.contact.phoneTitle}
                </div>
                <a
                  href={CONTACT_PHONE_HREF}
                  className="mt-2 block font-display text-2xl text-primary md:text-3xl"
                >
                  {CONTACT_PHONE}
                </a>
                {CONTACT_WHATSAPP_HREF && (
                  <div className="mt-6">
                    <a
                      href={CONTACT_WHATSAPP_HREF}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-accent-deep hover:underline"
                    >
                      {t.contact.phoneAction} →
                    </a>
                  </div>
                )}
              </Reveal>
            )}
          </div>

          <Reveal
            delay={3}
            className="mt-5 flex items-center gap-3 rounded-2xl border border-border bg-muted/40 px-6 py-4 text-sm text-muted-foreground"
          >
            <Clock className="h-4 w-4 shrink-0 text-accent-deep" />
            <span>
              <strong className="font-medium text-foreground">{t.contact.hoursTitle}:</strong>{" "}
              {t.contact.hoursValue}
            </span>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-14 md:py-20">
        <Reveal>
          <h2 className="mb-6 text-2xl font-display text-primary md:text-3xl">
            {t.contact.formTitle}
          </h2>
          <ContactForm topic="general" placeholder={t.contact.formTitle} />
        </Reveal>
      </section>
    </>
  );
}
