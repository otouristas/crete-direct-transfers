import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import ts from "typescript";

const roots = ["src", "apps/driver", "apps/rider", "packages/mobile-shared"];
const files = execFileSync("rg", ["--files", ...roots, "-g", "*.ts", "-g", "*.tsx"], {
  encoding: "utf8",
})
  .trim()
  .split("\n")
  .filter(Boolean)
  .filter(
    (file) =>
      !file.includes("/i18n/") &&
      !file.includes("/data/") &&
      !file.includes("/integrations/supabase/types.ts") &&
      !file.endsWith("routeTree.gen.ts") &&
      !file.includes("/__tests__/") &&
      !file.match(/\.(test|spec)\.[jt]sx?$/),
  );

const visibleAttributes = new Set(["alt", "aria-label", "placeholder", "title"]);
const allowed = [
  /^[\s.,:;!?+×/|()[\]{}'"’“”–—→←•·€$£¥%#&=-]*$/,
  /^(TransferAround|Transfer|Around|Touristas AI|Google|Apple|Visa|Mastercard|PayPal|WhatsApp|Stripe|Supabase|Pexels)$/,
  /^[A-Z0-9]{2,8}$/,
  /^(?:\+?\d|\+44|\+30|you@email\.com|YYYY-MM-DD(?:THH:mm)?|Ref:|km|min|24h|\/4|~|1\.|2\.)/,
];
const findings = [];

function isAllowed(value) {
  const normalized = value.replace(/\s+/g, " ").trim();
  return !normalized || allowed.some((pattern) => pattern.test(normalized));
}

for (const file of files) {
  const sourceText = readFileSync(file, "utf8");
  const source = ts.createSourceFile(
    file,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );

  function add(node, value) {
    if (isAllowed(value)) return;
    const position = source.getLineAndCharacterOfPosition(node.getStart(source));
    findings.push(
      `${file}:${position.line + 1}:${position.character + 1} ${JSON.stringify(value.trim())}`,
    );
  }

  function visit(node) {
    if (ts.isJsxText(node)) add(node, node.text);
    if (
      ts.isJsxAttribute(node) &&
      visibleAttributes.has(node.name.getText(source)) &&
      node.initializer &&
      ts.isStringLiteral(node.initializer)
    ) {
      add(node.initializer, node.initializer.text);
    }
    ts.forEachChild(node, visit);
  }

  visit(source);
}

if (findings.length) {
  console.error("User-visible copy must come from a locale catalog:");
  console.error(findings.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Hardcoded-copy check passed across ${files.length} maintained source files with zero findings.`,
  );
}
