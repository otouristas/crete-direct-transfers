import type { ContractRecord } from "@/functions/contracts";

const PAGE_WIDTH = 595.28; // A4
const PAGE_HEIGHT = 841.89;
const MARGIN = 56;
const FONT_SIZE = 9.5;
const LINE_HEIGHT = 13.5;

function wrap(
  text: string,
  maxWidth: number,
  measure: (line: string) => number,
): string[] {
  const out: string[] = [];
  for (const paragraph of text.split("\n")) {
    if (!paragraph.trim()) {
      out.push("");
      continue;
    }
    let line = "";
    for (const word of paragraph.split(/\s+/)) {
      const candidate = line ? `${line} ${word}` : word;
      if (measure(candidate) > maxWidth && line) {
        out.push(line);
        line = word;
      } else {
        line = candidate;
      }
    }
    if (line) out.push(line);
  }
  return out;
}

/** Build a Greek-capable PDF of a contract and trigger a browser download. */
export async function downloadContractPdf(contract: ContractRecord): Promise<void> {
  const [{ PDFDocument, rgb }, fontkitModule, regular, bold] = await Promise.all([
    import("pdf-lib"),
    import("@pdf-lib/fontkit"),
    fetch("/fonts/DejaVuSans.ttf").then((r) => r.arrayBuffer()),
    fetch("/fonts/DejaVuSans-Bold.ttf").then((r) => r.arrayBuffer()),
  ]);

  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkitModule.default ?? fontkitModule);
  const font = await pdf.embedFont(regular, { subset: true });
  const fontBold = await pdf.embedFont(bold, { subset: true });

  pdf.setTitle(contract.title);
  pdf.setAuthor("Transfer Around");

  const usableWidth = PAGE_WIDTH - MARGIN * 2;
  let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;

  const newPage = () => {
    page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    y = PAGE_HEIGHT - MARGIN;
  };

  const draw = (line: string, useBold = false, size = FONT_SIZE) => {
    if (y < MARGIN + LINE_HEIGHT) newPage();
    page.drawText(line, {
      x: MARGIN,
      y,
      size,
      font: useBold ? fontBold : font,
      color: rgb(0.11, 0.16, 0.2),
    });
    y -= size + 4;
  };

  // Title
  draw(contract.title, true, 13);
  y -= 6;

  const isHeading = (line: string) =>
    /^(Άρθρο|ΠΑΡΑΡΤΗΜΑ|ΟΙ ΣΥΜΒΑΛΛΟΜΕΝΟΙ|ΓΙΑ ΤΗΝ ΕΤΑΙΡΕΙΑ|Ο ΣΥΝΕΡΓΑΤΗΣ|ΕΙΔΙΚΟΙ ΟΡΟΙ|ΤΕΧΝΙΚΗ)/.test(
      line.trim(),
    );

  for (const rawLine of contract.body.split("\n")) {
    if (!rawLine.trim()) {
      y -= 6;
      continue;
    }
    const heading = isHeading(rawLine);
    const activeFont = heading ? fontBold : font;
    const lines = wrap(rawLine, usableWidth, (l) => activeFont.widthOfTextAtSize(l, FONT_SIZE));
    if (heading) y -= 4;
    for (const line of lines) {
      if (y < MARGIN + LINE_HEIGHT) newPage();
      page.drawText(line, {
        x: MARGIN,
        y,
        size: FONT_SIZE,
        font: activeFont,
        color: rgb(0.11, 0.16, 0.2),
      });
      y -= LINE_HEIGHT;
    }
  }

  // Audit block
  if (contract.status === "signed") {
    y -= 12;
    if (y < MARGIN + LINE_HEIGHT * 6) newPage();
    draw("ΣΤΟΙΧΕΙΑ ΗΛΕΚΤΡΟΝΙΚΗΣ ΥΠΟΓΡΑΦΗΣ", true, 10);
    const audit = [
      `Υπογράφων: ${contract.signerName ?? "—"}`,
      `Ημερομηνία/ώρα (UTC): ${contract.signedAt ? new Date(contract.signedAt).toISOString() : "—"}`,
      `Έκδοση κειμένου: ${contract.templateVersion}`,
      `Αποτύπωμα SHA-256: ${contract.bodySha256 ?? "—"}`,
      `Αναγνωριστικό εγγράφου: ${contract.id}`,
    ];
    for (const line of audit) {
      for (const wrapped of wrap(line, usableWidth, (l) => font.widthOfTextAtSize(l, 8))) {
        if (y < MARGIN) newPage();
        page.drawText(wrapped, { x: MARGIN, y, size: 8, font, color: rgb(0.35, 0.38, 0.4) });
        y -= 11;
      }
    }
  }

  const bytes = await pdf.save();
  const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${contract.kind === "driver" ? "symfonitiko-odigou" : "symfonitiko-synergati"}-${contract.id.slice(0, 8)}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
