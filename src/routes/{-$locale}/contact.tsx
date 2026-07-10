import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, Clock } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { getDict, useT, type Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { PageHero } from "@/components/sections/page-hero";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF } from "@/lib/site";

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
  const cards = [
    {
      icon: Mail,
      title: t.contact.emailTitle,
      value: CONTACT_EMAIL,
      href: `mailto:${CONTACT_EMAIL}`,
    },
    { icon: Phone, title: t.contact.phoneTitle, value: CONTACT_PHONE, href: CONTACT_PHONE_HREF },
    { icon: Clock, title: t.contact.hoursTitle, value: t.contact.hoursValue },
  ];
  return (
    <>
      <PageHero
        eyebrow={t.contact.eyebrow}
        title={t.contact.title}
        subtitle={t.contact.subtitle}
        crumbs={[{ label: t.nav.contact }]}
      />
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-14 lg:grid-cols-[1fr_320px]">
        <div>
          <h2 className="mb-6 text-2xl font-display text-primary">{t.contact.formTitle}</h2>
          <ContactForm topic="general" placeholder="How can we help?" />
        </div>
        <aside className="space-y-4 text-sm">
          {cards.map(({ icon: Icon, title, value, href }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15">
                <Icon className="h-5 w-5 text-accent-deep" />
              </span>
              <div className="mt-3 font-display text-primary">{title}</div>
              {href ? (
                <a href={href} className="mt-1 block text-muted-foreground hover:text-accent-deep">
                  {value}
                </a>
              ) : (
                <div className="mt-1 text-muted-foreground">{value}</div>
              )}
            </div>
          ))}
        </aside>
      </section>
    </>
  );
}
