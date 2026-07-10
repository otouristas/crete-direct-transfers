import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { getDict, type Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";

export const Route = createFileRoute("/{-$locale}/book/success")({
  validateSearch: z.object({ id: z.string().optional() }),
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/book/success",
      title: `${t.bookPage.successTitle} | TransferAround`,
      description: t.bookPage.successBody,
      noindex: true,
    });
  },
  component: SuccessPage,
});

function SuccessPage() {
  const { id } = Route.useSearch();
  const { locale } = Route.useRouteContext();
  const t = getDict(locale);
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <CheckCircle2 className="mx-auto h-14 w-14 text-accent" strokeWidth={1.5} />
      <h1 className="mt-6 text-4xl font-display text-primary">{t.bookPage.successTitle}</h1>
      <p className="mt-4 text-muted-foreground">{t.bookPage.successBody}</p>
      {id && (
        <div className="mt-6 inline-block rounded-full bg-muted px-4 py-2 font-mono text-xs text-muted-foreground">
          Ref: {id.slice(0, 8)}
        </div>
      )}
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          to="/{-$locale}"
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          {t.common.backHome}
        </Link>
        <Link
          to="/{-$locale}/book"
          className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
        >
          {t.bookPage.bookAnother}
        </Link>
      </div>
    </div>
  );
}
