import { Download } from "lucide-react";
import { getDict, type Locale } from "@/i18n";

export type ReceiptData = {
  reference: string;
  route: string;
  pickupAt: string;
  passengers: number;
  vehicle: string;
  total: string;
  paymentStatus: string;
};

/**
 * Opens a print-ready receipt in a new window; the browser print dialog
 * offers "Save as PDF" on every desktop and mobile platform we support.
 */
export function ReceiptButton({
  data,
  locale,
  brand,
}: {
  data: ReceiptData;
  locale: Locale;
  brand: string;
}) {
  const t = getDict(locale);

  const print = () => {
    const rows: [string, string][] = [
      [t.account.bookingRef, data.reference],
      [t.account.pickupTitle, data.pickupAt],
      [t.widget.passengers, String(data.passengers)],
      [t.widget.vehicleClass, data.vehicle],
      [t.common.total, data.total],
    ];
    const html = `<!doctype html><html lang="${locale}"><head><meta charset="utf-8">
<title>${t.account.receiptTitle} · ${data.reference}</title>
<style>
 body{font-family:Inter,system-ui,sans-serif;color:#0F172A;margin:48px;max-width:640px}
 h1{font-size:22px;margin:0 0 4px}
 p.sub{color:#64748B;margin:0 0 28px;font-size:13px}
 table{width:100%;border-collapse:collapse;font-size:14px}
 td{padding:10px 0;border-bottom:1px solid #E2E8F0}
 td:last-child{text-align:right;font-weight:600}
 .total td{border-bottom:none;font-size:18px;padding-top:18px}
 .foot{margin-top:32px;font-size:12px;color:#64748B}
</style></head><body>
<h1>${brand}</h1><p class="sub">${t.account.receiptTitle} — ${data.route}</p>
<table>${rows
      .slice(0, -1)
      .map(([k, v]) => `<tr><td>${escapeHtml(k)}</td><td>${escapeHtml(v)}</td></tr>`)
      .join("")}
<tr class="total"><td>${escapeHtml(t.common.total)}</td><td>${escapeHtml(data.total)}</td></tr></table>
<p class="foot">${escapeHtml(data.paymentStatus)}</p>
</body></html>`;
    const w = window.open("", "_blank", "width=780,height=900");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 250);
  };

  return (
    <button
      type="button"
      onClick={print}
      className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
    >
      <Download className="h-4 w-4" />
      {t.account.downloadReceipt}
    </button>
  );
}

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );
}
