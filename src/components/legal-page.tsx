import type { ReactNode } from "react";
import { useLocale, useT, localePath, type Locale } from "@/i18n";
import type { LegalDoc } from "@/i18n/legal/types";
import { CONTACT_EMAIL } from "@/lib/site";

const LEGAL_EMAILS = {
  support: "support@transferaround.com",
  privacy: "privacy@transferaround.com",
  compliance: "compliance@transferaround.com",
  hello: CONTACT_EMAIL,
} as const;

const LEGAL_PATHS = {
  terms: "/legal/terms",
  privacy: "/legal/privacy",
  cookies: "/legal/cookies",
  refunds: "/legal/refunds",
  imprint: "/legal/imprint",
  driverPartnership: "/legal/driver-partnership",
  kyc: "/legal/kyc",
} as const;

const EXTERNAL_URLS = {
  odr: "https://ec.europa.eu/consumers/odr",
} as const;

const TOKEN_RE = /\{(email|link|url):([a-zA-Z]+)\}/g;

function linkLabel(key: string, t: ReturnType<typeof useT>): string {
  switch (key) {
    case "terms":
      return t.footer.terms;
    case "privacy":
      return t.footer.privacy;
    case "cookies":
      return t.footer.cookies;
    case "refunds":
      return t.footer.refunds;
    case "imprint":
      return t.footer.imprint;
    case "driverPartnership":
      return t.footer.driverPartnership;
    case "kyc":
      return t.footer.kyc;
    case "odr":
      return "ec.europa.eu/consumers/odr";
    default:
      return key;
  }
}

function renderRichText(text: string, locale: Locale, t: ReturnType<typeof useT>): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(TOKEN_RE.source, "g");
  let key = 0;

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const [, kind, token] = match;
    if (kind === "email") {
      const email =
        LEGAL_EMAILS[token as keyof typeof LEGAL_EMAILS] ?? `${token}@transferaround.com`;
      nodes.push(
        <a key={key++} href={`mailto:${email}`}>
          {email}
        </a>,
      );
    } else if (kind === "link") {
      const path = LEGAL_PATHS[token as keyof typeof LEGAL_PATHS];
      if (path) {
        nodes.push(
          <a key={key++} href={localePath(locale, path)}>
            {linkLabel(token, t)}
          </a>,
        );
      } else {
        nodes.push(linkLabel(token, t));
      }
    } else if (kind === "url") {
      const href = EXTERNAL_URLS[token as keyof typeof EXTERNAL_URLS];
      if (href) {
        nodes.push(
          <a key={key++} href={href} rel="noopener noreferrer" target="_blank">
            {linkLabel(token, t)}
          </a>,
        );
      } else {
        nodes.push(token);
      }
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : [text];
}

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  const t = useT();
  return (
    <>
      <section className="border-b border-border bg-gradient-to-b from-muted to-background">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-deep">
            {t.legal.eyebrow}
          </div>
          <h1 className="mt-3 text-4xl font-display text-primary md:text-5xl">{title}</h1>
          <div className="mt-3 text-sm text-muted-foreground">
            {t.common.lastUpdated}: {updated}
          </div>
        </div>
      </section>
      <article className="mx-auto max-w-3xl space-y-6 px-6 py-14 leading-relaxed text-foreground/90 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-primary [&_h2]:pt-4 [&_p]:text-base [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_li]:text-base [&_a]:text-accent-deep [&_a]:underline">
        {children}
        <p className="border-t border-border pt-8 text-sm text-muted-foreground">
          {t.legal.companyDetails} {t.footer.contactTitle}: {CONTACT_EMAIL}.
        </p>
      </article>
    </>
  );
}

/** Renders a structured legal document from i18n (intro + titled sections). */
export function LegalDocument({ doc }: { doc: LegalDoc }) {
  const t = useT();
  const locale = useLocale();

  return (
    <>
      {doc.intro ? <p>{renderRichText(doc.intro, locale, t)}</p> : null}
      {doc.sections.map((section) => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          {section.paragraphs?.map((paragraph, i) => (
            <p key={`${section.title}-p-${i}`}>{renderRichText(paragraph, locale, t)}</p>
          ))}
          {section.items && section.items.length > 0 ? (
            <ul>
              {section.items.map((item, i) => (
                <li key={`${section.title}-i-${i}`}>{renderRichText(item, locale, t)}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </>
  );
}
