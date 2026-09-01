import {
  DRIVER_AGREEMENT_BODY,
  DRIVER_AGREEMENT_TITLE,
  DRIVER_AGREEMENT_VERSION,
} from "@/data/contracts/driver-agreement";
import {
  PARTNER_AGREEMENT_BODY,
  PARTNER_AGREEMENT_TITLE,
  PARTNER_AGREEMENT_VERSION,
} from "@/data/contracts/partner-agreement";

export type ContractKind = "driver" | "partner";
export type ContractStatus = "pending" | "signed" | "void";
export type ContractVariables = Record<string, string>;

export const COMPANY_NAME = "Transfer Around Ο.Ε.";
export const COMPANY_SIGNER_NAME = "Transfer Around Ο.Ε.";

export type ContractTemplate = {
  kind: ContractKind;
  version: string;
  title: string;
  body: string;
};

export const CONTRACT_TEMPLATES: Record<ContractKind, ContractTemplate> = {
  driver: {
    kind: "driver",
    version: DRIVER_AGREEMENT_VERSION,
    title: DRIVER_AGREEMENT_TITLE,
    body: DRIVER_AGREEMENT_BODY,
  },
  partner: {
    kind: "partner",
    version: PARTNER_AGREEMENT_VERSION,
    title: PARTNER_AGREEMENT_TITLE,
    body: PARTNER_AGREEMENT_BODY,
  },
};

export function getContractTemplate(kind: ContractKind): ContractTemplate {
  return CONTRACT_TEMPLATES[kind];
}

const GREEK_WEEKDAYS = [
  "Κυριακή",
  "Δευτέρα",
  "Τρίτη",
  "Τετάρτη",
  "Πέμπτη",
  "Παρασκευή",
  "Σάββατο",
];

export function greekDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getUTCDate())}/${pad(date.getUTCMonth() + 1)}/${date.getUTCFullYear()}`;
}

export function greekWeekday(date: Date): string {
  return GREEK_WEEKDAYS[date.getUTCDay()] ?? "";
}

/** Fields an admin may override before issuing a contract. */
export const OVERRIDABLE_FIELDS: Record<ContractKind, string[]> = {
  driver: [
    "driver_name",
    "driver_address",
    "driver_afm",
    "driver_doy",
    "driver_share",
    "platform_share",
    "notice_days",
    "start_date",
    "bank_name",
    "bank_holder",
    "bank_iban",
    "bank_bic",
    "special_terms",
  ],
  partner: [
    "partner_legal_name",
    "partner_brand",
    "partner_address",
    "partner_afm",
    "partner_representative",
    "partnership_type",
    "commission_percent",
    "notice_days",
    "partner_id",
    "partner_email",
    "referral_code",
    "booking_link",
    "ad_format",
    "ad_duration",
    "ad_placement",
    "ad_price",
    "ad_start",
    "bank_name",
    "bank_holder",
    "bank_iban",
    "bank_bic",
    "special_terms",
  ],
};

export const PARTNERSHIP_TYPES = [
  "Advertising Partner",
  "Referral Partner",
  "Booking Partner / Travel Agent",
  "Referral & Booking Partner",
  "Advertising + Referral Partner",
  "Advertising + Booking Partner",
] as const;

const BLANK = "…………………";

export function defaultVariables(kind: ContractKind, now = new Date()): ContractVariables {
  const shared: ContractVariables = {
    contract_date: greekDate(now),
    contract_weekday: greekWeekday(now),
    company_signer_name: COMPANY_SIGNER_NAME,
    notice_days: "30",
  };
  if (kind === "driver") {
    return {
      ...shared,
      driver_share: "85",
      platform_share: "15",
      driver_share_words: "ογδόντα πέντε τοις εκατό",
      platform_share_words: "δεκαπέντε τοις εκατό",
      start_date: greekDate(now),
    };
  }
  return {
    ...shared,
    commission_percent: "3",
    commission_words: "τρία τοις εκατό",
    partnership_type: "Referral & Booking Partner",
  };
}

/** Values that only exist once the document is actually signed. */
export type SignatureContext = {
  signerName?: string | null;
  signedAt?: string | Date | null;
};

export function signatureVariables(ctx: SignatureContext): ContractVariables {
  if (!ctx.signerName || !ctx.signedAt) {
    return { signer_name: BLANK, signature: BLANK, signed_date: BLANK, company_signature: BLANK };
  }
  const date = typeof ctx.signedAt === "string" ? new Date(ctx.signedAt) : ctx.signedAt;
  return {
    signer_name: ctx.signerName,
    signature: `/s/ ${ctx.signerName} (ηλεκτρονική υπογραφή)`,
    signed_date: greekDate(date),
    company_signature: `/s/ ${COMPANY_SIGNER_NAME} (ηλεκτρονική υπογραφή)`,
  };
}

/** Replace {{placeholders}}; unknown ones become blank dotted lines. */
export function renderContract(kind: ContractKind, variables: ContractVariables): string {
  const template = getContractTemplate(kind);
  const merged: ContractVariables = {
    ...defaultVariables(kind),
    ...variables,
  };
  merged.special_terms_block = merged.special_terms?.trim()
    ? `ΕΙΔΙΚΟΙ ΟΡΟΙ\n\n${merged.special_terms.trim()}`
    : "";
  merged.partnership_type_block = "";

  return template.body
    .replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
      const value = merged[key];
      return value === undefined || value === "" ? BLANK : value;
    })
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** SHA-256 of the exact accepted text — works in browser and worker runtimes. */
export async function sha256Hex(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
