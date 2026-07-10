import type { ReactNode } from "react";
import { useT } from "@/i18n";
import { CONTACT_EMAIL } from "@/lib/site";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  const t = useT();
  return (
    <>
      <section className="border-b border-border bg-gradient-to-b from-muted to-background">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-deep">
            {t.legal.eyebrow}
          </div>
          <h1 className="mt-3 text-4xl font-display text-primary md:text-5xl">{title}</h1>
          <div className="mt-3 text-sm text-muted-foreground">
            {t.common.lastUpdated}: {updated}
          </div>
        </div>
      </section>
      <article className="mx-auto max-w-3xl space-y-6 px-6 py-14 leading-relaxed text-foreground/90 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-primary [&_h2]:pt-4 [&_p]:text-base [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_li]:text-base [&_a]:text-accent-deep [&_a]:underline">
        {children}
        <p className="border-t border-border pt-8 text-sm text-muted-foreground">
          {t.legal.companyDetails} {t.footer.contactTitle}: {CONTACT_EMAIL}.
        </p>
      </article>
    </>
  );
}
