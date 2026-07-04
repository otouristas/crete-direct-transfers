import type { ReactNode } from "react";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <section className="border-b border-border/60 bg-sand">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
          <div className="text-xs uppercase tracking-[0.2em] text-accent">Legal</div>
          <h1 className="mt-3 text-4xl md:text-5xl font-serif text-primary">{title}</h1>
          <div className="mt-3 text-sm text-muted-foreground">Last updated: {updated}</div>
        </div>
      </section>
      <article className="mx-auto max-w-3xl px-6 py-16 space-y-6 text-foreground/90 leading-relaxed [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-primary [&_h2]:pt-4 [&_p]:text-base [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_li]:text-base">
        {children}
        <p className="pt-8 text-sm text-muted-foreground border-t border-border/60">
          Company details: CreteTransfers Ltd., Heraklion, Crete, Greece. VAT / GEMI details to be
          confirmed. Contact: hello@cretetransfers.example.
        </p>
      </article>
    </>
  );
}
