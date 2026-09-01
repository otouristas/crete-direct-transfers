import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { getDict, type Locale } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { previewCancellation } from "@/queries/driver-account";
import { cancelMyJob } from "@/functions/driver-account";
import { formatEur } from "@/lib/pricing";

/**
 * Driver-side cancellation: shows the exact penalty for the current notice
 * window before the driver confirms, then releases the job to the marketplace.
 */
export function CancelJobDialog({
  bookingId,
  locale,
  onDone,
}: {
  bookingId: string;
  locale: Locale;
  onDone?: () => void;
}) {
  const t = getDict(locale);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const queryClient = useQueryClient();
  const cancelJob = useServerFn(cancelMyJob);

  const preview = useQuery({
    queryKey: ["cancel-preview", bookingId],
    queryFn: () => previewCancellation(bookingId),
    enabled: open,
    staleTime: 0,
  });

  const cancel = useMutation({
    mutationFn: () => cancelJob({ data: { bookingId, reason: reason.trim() || undefined } }),
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
      queryClient.invalidateQueries({ queryKey: ["driver-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["driver-ledger"] });
      queryClient.invalidateQueries({ queryKey: ["driver-balance"] });
      queryClient.invalidateQueries({ queryKey: ["driver-reliability"] });
      toast.success(t.driverAccount.cancelDone);
      onDone?.();
    },
    onError: () => toast.error(t.driverAccount.cancelFailed),
  });

  const penaltyCents = preview.data?.penalty_cents ?? 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="rounded-xl border border-destructive/40 px-5 py-2.5 text-sm font-medium text-destructive transition hover:bg-destructive/10">
        {t.driverAccount.cancelJob}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.driverAccount.cancelTitle}</DialogTitle>
          <DialogDescription>{t.driverAccount.cancelBody}</DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm">
          {preview.isPending ? (
            <p className="text-muted-foreground">…</p>
          ) : penaltyCents > 0 ? (
            <div className="flex items-start gap-3 text-destructive">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-medium">{t.driverAccount.cancelPenalty}</p>
                <p className="font-display text-2xl">{formatEur(penaltyCents / 100)}</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">{t.driverAccount.cancelFree}</p>
          )}
        </div>

        <label className="block text-sm">
          <span className="text-muted-foreground">{t.driverAccount.cancelReason}</span>
          <Textarea
            className="mt-2"
            rows={3}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </label>

        <ul className="space-y-1 text-xs text-muted-foreground">
          <li>{t.driverAccount.policy72}</li>
          <li>{t.driverAccount.policy48}</li>
          <li>{t.driverAccount.policy24}</li>
          <li>{t.driverAccount.policyLate}</li>
          <li>{t.driverAccount.policyNoShow}</li>
        </ul>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t.account.cancelKeep}
          </Button>
          <Button
            variant="destructive"
            disabled={cancel.isPending || preview.isPending}
            onClick={() => cancel.mutate()}
          >
            {t.driverAccount.cancelConfirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
