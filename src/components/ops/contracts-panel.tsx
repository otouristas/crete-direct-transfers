import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { getDict, type Locale } from "@/i18n";
import { Skeleton } from "@/components/ui/skeleton";
import { issueContractAdmin, opsContractsQuery } from "@/queries/contracts";
import { adminGetContract } from "@/functions/contracts";
import { downloadContractPdf } from "@/lib/contract-pdf";
import { PARTNERSHIP_TYPES, type ContractKind } from "@/lib/contracts";

/** Admin panel: issue contracts with custom annex values and download signed PDFs. */
export function ContractsPanel({ locale }: { locale: Locale }) {
  const t = getDict(locale);
  const queryClient = useQueryClient();
  const contracts = useQuery(opsContractsQuery);

  const [userId, setUserId] = useState("");
  const [kind, setKind] = useState<ContractKind>("partner");
  const [commission, setCommission] = useState("3");
  const [noticeDays, setNoticeDays] = useState("30");
  const [partnershipType, setPartnershipType] = useState<string>(PARTNERSHIP_TYPES[3]);
  const [specialTerms, setSpecialTerms] = useState("");

  const issue = useMutation({
    mutationFn: () =>
      issueContractAdmin({
        userId: userId.trim(),
        kind,
        variables:
          kind === "partner"
            ? {
                commission_percent: commission.trim() || "3",
                notice_days: noticeDays.trim() || "30",
                partnership_type: partnershipType,
                special_terms: specialTerms.trim(),
              }
            : {
                notice_days: noticeDays.trim() || "30",
                special_terms: specialTerms.trim(),
              },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ops-contracts"] });
      setUserId("");
      setSpecialTerms("");
      toast.success(t.contracts.opsSent);
    },
    onError: () => toast.error(t.contracts.opsFailed),
  });

  const download = async (contractId: string) => {
    try {
      const record = await adminGetContract({ data: { contractId } });
      await downloadContractPdf(record);
    } catch {
      toast.error(t.contracts.opsFailed);
    }
  };

  const statusLabel = (status: string) =>
    status === "signed"
      ? t.contracts.statusSigned
      : status === "void"
        ? t.contracts.statusVoid
        : t.contracts.statusPending;

  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <h2 className="font-display text-2xl text-primary">{t.contracts.opsTitle}</h2>

      <div className="mt-5 grid gap-3 rounded-2xl bg-muted/40 p-4 md:grid-cols-2">
        <label className="text-sm">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            {t.contracts.opsIssueFor}
          </span>
          <input
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            placeholder="uuid"
            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
        </label>
        <label className="text-sm">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            {t.contracts.opsTitle}
          </span>
          <select
            value={kind}
            onChange={(event) => setKind(event.target.value as ContractKind)}
            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="driver">{t.contracts.driverAgreement}</option>
            <option value="partner">{t.contracts.partnerAgreement}</option>
          </select>
        </label>
        {kind === "partner" && (
          <>
            <label className="text-sm">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                {t.contracts.opsCommission}
              </span>
              <input
                value={commission}
                onChange={(event) => setCommission(event.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              />
            </label>
            <label className="text-sm">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                {t.contracts.opsPartnershipType}
              </span>
              <select
                value={partnershipType}
                onChange={(event) => setPartnershipType(event.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
              >
                {PARTNERSHIP_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}
        <label className="text-sm">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            {t.contracts.opsNoticeDays}
          </span>
          <input
            value={noticeDays}
            onChange={(event) => setNoticeDays(event.target.value)}
            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
        </label>
        <label className="text-sm md:col-span-2">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            {t.contracts.opsSpecialTerms}
          </span>
          <textarea
            value={specialTerms}
            rows={2}
            onChange={(event) => setSpecialTerms(event.target.value)}
            className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          />
        </label>
        <div className="md:col-span-2">
          <button
            type="button"
            disabled={!userId.trim() || issue.isPending}
            onClick={() => issue.mutate()}
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            {t.contracts.opsSend}
          </button>
        </div>
      </div>

      {contracts.isPending ? (
        <Skeleton className="mt-5 h-40 w-full rounded-2xl" />
      ) : (contracts.data ?? []).length === 0 ? (
        <p className="mt-5 text-sm text-muted-foreground">{t.contracts.opsNoContracts}</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {contracts.data?.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border p-4 text-sm"
            >
              <div>
                <p className="font-semibold text-primary">
                  {row.fullName ?? row.userId.slice(0, 8)} ·{" "}
                  {row.kind === "driver"
                    ? t.contracts.driverAgreement
                    : t.contracts.partnerAgreement}
                </p>
                <p className="text-xs text-muted-foreground">
                  {statusLabel(row.status)}
                  {row.signedAt
                    ? ` · ${t.contracts.signedOn} ${new Date(row.signedAt).toLocaleDateString(locale)} · ${row.signerName}`
                    : ""}
                </p>
              </div>
              {row.status === "signed" && (
                <button
                  type="button"
                  onClick={() => void download(row.id)}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold"
                >
                  <Download className="h-3.5 w-3.5" strokeWidth={1.7} />
                  {t.contracts.downloadPdf}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
