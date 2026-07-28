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
  /^(TransferAround|Transfer|Around|Touristas AI|Google|Apple|Visa|Mastercard|PayPal|WhatsApp|Stripe|Supabase)$/,
  /^[A-Z0-9]{2,8}$/,
  /^(?:\+?\d|\+44|\+30|you@email\.com|YYYY-MM-DD(?:THH:mm)?|Ref:|km|min|24h|\/4|~|1\.|2\.)/,
];
const findings = [];
const legacyBaseline = new Map(
  Object.entries({
    "apps/driver/app/(tabs)/index.tsx": 16,
    "apps/driver/app/job/[id].tsx": 8,
    "apps/driver/components/login-form.tsx": 1,
    "apps/rider/app/(tabs)/account.tsx": 4,
    "apps/rider/app/(tabs)/index.tsx": 17,
    "apps/rider/app/trip/[id].tsx": 6,
    "apps/rider/components/login-form.tsx": 1,
    "apps/rider/components/signup-form.tsx": 1,
    "packages/mobile-shared/src/ui/brand.tsx": 4,
    "src/components/airports/airport-page-sections.tsx": 47,
    "src/components/booking-widget.tsx": 4,
    "src/components/booking/booking-summary.tsx": 5,
    "src/components/booking/booking-vehicle-list.tsx": 1,
    "src/components/contact-form.tsx": 4,
    "src/components/crete-map-inner.tsx": 1,
    "src/components/crete-map-real.tsx": 1,
    "src/components/driver/driver-onboarding.tsx": 1,
    "src/components/language-suggestion-banner.tsx": 1,
    "src/components/location-picker-inner.tsx": 1,
    "src/components/logo.tsx": 2,
    "src/components/mobile-menu.tsx": 1,
    "src/components/sections/page-hero.tsx": 1,
    "src/components/sections/routes-chapter.tsx": 1,
    "src/components/site-footer.tsx": 2,
    "src/components/site-header.tsx": 1,
    "src/components/ui/breadcrumb.tsx": 2,
    "src/components/ui/carousel.tsx": 2,
    "src/components/ui/dialog.tsx": 1,
    "src/components/ui/pagination.tsx": 6,
    "src/components/ui/sheet.tsx": 1,
    "src/components/ui/sidebar.tsx": 5,
    "src/routes/{-$locale}/airports.$slug.$routeSlug.tsx": 14,
    "src/routes/{-$locale}/airports.$slug.tsx": 3,
    "src/routes/{-$locale}/airports.index.tsx": 9,
    "src/routes/{-$locale}/book.success.tsx": 1,
    "src/routes/{-$locale}/book.tsx": 3,
    "src/routes/{-$locale}/cities.$slug.tsx": 12,
    "src/routes/{-$locale}/cities.index.tsx": 3,
    "src/routes/{-$locale}/fleet.$class.tsx": 16,
    "src/routes/{-$locale}/ops.tsx": 22,
    "src/routes/{-$locale}/routes.$slug.tsx": 1,
    "src/routes/{-$locale}/services.$slug.tsx": 13,
    "src/routes/{-$locale}/signup.tsx": 1,
  }),
);

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

const countByFile = new Map();
for (const finding of findings) {
  const file = finding.slice(0, finding.indexOf(":"));
  countByFile.set(file, (countByFile.get(file) ?? 0) + 1);
}
const regressions = [...countByFile].filter(
  ([file, count]) => count > (legacyBaseline.get(file) ?? 0),
);

if (process.argv.includes("--strict") && findings.length) {
  console.error("User-visible copy must come from a locale catalog:");
  console.error(findings.join("\n"));
  process.exitCode = 1;
} else if (regressions.length) {
  console.error("Hardcoded-copy baseline increased:");
  console.error(
    regressions
      .map(
        ([file, count]) => `${file}: ${count} findings (baseline ${legacyBaseline.get(file) ?? 0})`,
      )
      .join("\n"),
  );
  process.exitCode = 1;
} else {
  console.log(
    `Hardcoded-copy regression check passed across ${files.length} maintained source files. ` +
      `${findings.length} legacy findings remain; run with --strict to list them.`,
  );
}
