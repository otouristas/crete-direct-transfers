import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Download, FileSignature, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { getDict, type Locale } from "@/i18n";
import { signMyContract, type ContractRecord } from "@/queries/contracts";
import { downloadContractPdf } from "@/lib/contract-pdf";

type Props = {
  locale: Locale;
  contract: ContractRecord;
  onSigned?: (contract: ContractRecord) => void;
};

/** Full Greek contract text with typed-name electronic signature and PDF download. */
export function ContractSigner({ locale, contract, onSigned }: Props) {
  const t = getDict(locale);
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [current, setCurrent] = useState(contract);

  const sign = useMutation({
    mutationFn: () => signMyContract({ contractId: current.id, signerName: name.trim() }),
    onSuccess: (signed) => {
      setCurrent(signed);
      queryClient.invalidateQueries({ queryKey: ["my-contracts"] });
      queryClient.invalidateQueries({ queryKey: ["my-contract", current.kind] });
      queryClient.invalidateQueries({ queryKey: ["ops-contracts"] });
      toast.success(t.contracts.signSuccess);
      onSigned?.(signed);
    },
    onError: () => toast.error(t.contracts.signError),
  });

  const isSigned = current.status === "signed";

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-primary">{current.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isSigned
              ? `${t.contracts.signedBy}: ${current.signerName} · ${t.contracts.signedOn} ${
                  current.signedAt ? new Date(current.signedAt).toLocaleString() : ""
                }`
              : t.contracts.readPrompt}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isSigned ? "bg-accent/15 text-accent-deep" : "bg-muted text-muted-foreground"
          }`}
        >
          {isSigned ? t.contracts.statusSigned : t.contracts.statusPending}
        </span>
      </div>

      <div className="mt-5 max-h-[26rem] overflow-y-auto rounded-2xl border border-border bg-background p-5">
        <pre className="whitespace-pre-wrap font-sans text-[13px] leading-6 text-foreground">
          {current.body}
        </pre>
      </div>

      {isSigned ? (
        <div className="mt-5 space-y-4">
          <div className="rounded-2xl bg-muted/50 p-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <ShieldCheck className="h-4 w-4" strokeWidth={1.7} />
              {t.contracts.auditTitle}
            </div>
            <p className="mt-2 break-all">
              {t.contracts.fingerprint}: {current.bodySha256 ?? "—"}
            </p>
            <p className="mt-1">v{current.templateVersion}</p>
          </div>
          <button
            type="button"
            onClick={() => void downloadContractPdf(current)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <Download className="h-4 w-4" strokeWidth={1.7} />
            {t.contracts.downloadPdf}
          </button>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          <label className="block text-sm">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              {t.contracts.typedNameLabel}
            </span>
            <input
              value={name}
              maxLength={120}
              placeholder={t.contracts.typedNamePlaceholder}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 block w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm"
            />
          </label>
          <label className="flex items-start gap-3 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(event) => setAccepted(event.target.checked)}
              className="mt-1 h-4 w-4"
            />
            <span>{t.contracts.acceptLabel}</span>
          </label>
          <button
            type="button"
            disabled={sign.isPending}
            onClick={() => {
              if (!accepted || name.trim().length < 3) {
                toast.error(t.contracts.mustAccept);
                return;
              }
              sign.mutate();
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
          >
            <FileSignature className="h-4 w-4" strokeWidth={1.7} />
            {sign.isPending ? t.contracts.signing : t.contracts.signButton}
          </button>
        </div>
      )}
    </div>
  );
}
