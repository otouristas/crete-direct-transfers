import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Download, FileText } from "lucide-react";
import { RequireAuth } from "@/components/auth/require-auth";
import { ContractSigner } from "@/components/contracts/contract-signer";
import { Skeleton } from "@/components/ui/skeleton";
import { getDict, type Locale } from "@/i18n";
import { buildHead } from "@/lib/seo";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/queries/profile";
import { myPartnerMembershipsQuery } from "@/queries/partner";
import { myContractQuery, myContractsQuery } from "@/queries/contracts";
import { downloadContractPdf } from "@/lib/contract-pdf";
import { defaultVariables, type ContractKind } from "@/lib/contracts";

export const Route = createFileRoute("/{-$locale}/contracts")({
  head: (ctx) => {
    const locale = (ctx.params.locale ?? "en") as Locale;
    const t = getDict(locale);
    return buildHead({
      locale,
      path: "/contracts",
      title: `${t.contracts.title} | TransferAround`,
      description: t.contracts.subtitle,
      noindex: true,
    });
  },
  component: () => (
    <RequireAuth>
      <ContractsPage />
    </RequireAuth>
  ),
});

function ContractsPage() {
  const { locale } = Route.useRouteContext();
  const t = getDict(locale);
  const { user } = useAuth();
  const profile = useProfile();
  const memberships = useQuery({
    ...myPartnerMembershipsQuery(user?.id ?? ""),
    enabled: !!user?.id,
  });

  const isPartner = (memberships.data ?? []).length > 0;
  const kind: ContractKind = isPartner && profile.data?.role !== "driver" ? "partner" : "driver";

  const prefill =
    kind === "driver"
      ? { ...defaultVariables("driver"), driver_name: profile.data?.full_name ?? "" }
      : { ...defaultVariables("partner"), partner_representative: profile.data?.full_name ?? "" };

  const contract = useQuery({
    ...myContractQuery(kind, prefill),
    enabled: !!user && !profile.isPending && !memberships.isPending,
  });
  const all = useQuery({ ...myContractsQuery, enabled: !!user });

  const history = (all.data ?? []).filter(
    (row) => row.status === "signed" && row.id !== contract.data?.id,
  );

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-6 py-12">
      <header>
        <h1 className="font-display text-3xl text-primary">{t.contracts.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t.contracts.subtitle}</p>
      </header>

      {contract.isPending ? (
        <Skeleton className="h-96 w-full rounded-3xl" />
      ) : contract.data ? (
        <ContractSigner locale={locale} contract={contract.data} />
      ) : (
        <p className="text-sm text-muted-foreground">{t.contracts.none}</p>
      )}

      {history.length > 0 && (
        <section className="rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-xl text-primary">{t.contracts.title}</h2>
          <ul className="mt-4 space-y-3">
            {history.map((row) => (
              <li
                key={row.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-muted/40 p-4"
              >
                <span className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-accent-deep" strokeWidth={1.7} />
                  {row.title}
                  <span className="text-xs text-muted-foreground">
                    {t.contracts.signedOn}{" "}
                    {row.signedAt ? new Date(row.signedAt).toLocaleDateString(locale) : ""}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => void downloadContractPdf(row)}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold"
                >
                  <Download className="h-3.5 w-3.5" strokeWidth={1.7} />
                  {t.contracts.downloadPdf}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
