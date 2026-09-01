import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  getContractTemplate,
  renderContract,
  sha256Hex,
  signatureVariables,
  type ContractKind,
  type ContractVariables,
} from "@/lib/contracts";

export type ContractRecord = {
  id: string;
  kind: ContractKind;
  status: "pending" | "signed" | "void";
  templateVersion: string;
  variables: ContractVariables;
  signerName: string | null;
  signedAt: string | null;
  bodySha256: string | null;
  body: string;
  title: string;
};

type ContractRow = {
  id: string;
  kind: string;
  status: string;
  template_version: string;
  variables: unknown;
  signer_name: string | null;
  signed_at: string | null;
  body_sha256: string | null;
  rendered_body: string | null;
};

function toRecord(row: ContractRow): ContractRecord {
  const kind = row.kind as ContractKind;
  const variables = (row.variables ?? {}) as ContractVariables;
  const body =
    row.rendered_body ??
    renderContract(kind, {
      ...variables,
      ...signatureVariables({ signerName: row.signer_name, signedAt: row.signed_at }),
    });
  return {
    id: row.id,
    kind,
    status: row.status as ContractRecord["status"],
    templateVersion: row.template_version,
    variables,
    signerName: row.signer_name,
    signedAt: row.signed_at,
    bodySha256: row.body_sha256,
    body,
    title: getContractTemplate(kind).title,
  };
}

const SELECT =
  "id, kind, status, template_version, variables, signer_name, signed_at, body_sha256, rendered_body";

/** Get (or create) the signed-in user's contract of a given kind. */
export const getMyContract = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { kind: ContractKind; variables?: ContractVariables }) => {
    if (d?.kind !== "driver" && d?.kind !== "partner") throw new Error("invalid_kind");
    return d;
  })
  .handler(async ({ data, context }): Promise<ContractRecord> => {
    const template = getContractTemplate(data.kind);
    const { data: row, error } = await context.supabase.rpc("ensure_my_contract", {
      p_kind: data.kind,
      p_template_version: template.version,
      p_variables: (data.variables ?? {}) as never,
    });
    if (error) throw new Error(error.message);
    return toRecord(row as unknown as ContractRow);
  });

/** List every contract belonging to the signed-in user. */
export const listMyContracts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ContractRecord[]> => {
    const { data, error } = await context.supabase
      .from("contracts")
      .select(SELECT)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => toRecord(row as ContractRow));
  });

/** Sign a pending contract with a typed name; freezes the text and audit trail. */
export const signContract = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { contractId: string; signerName: string }) => {
    if (!d?.contractId) throw new Error("contract_required");
    const name = (d.signerName ?? "").trim();
    if (name.length < 3 || name.length > 120) throw new Error("invalid_signer_name");
    return { contractId: d.contractId, signerName: name };
  })
  .handler(async ({ data, context }): Promise<ContractRecord> => {
    const { data: existing, error: loadError } = await context.supabase
      .from("contracts")
      .select(SELECT)
      .eq("id", data.contractId)
      .single();
    if (loadError) throw new Error(loadError.message);

    const row = existing as ContractRow;
    const kind = row.kind as ContractKind;
    const rendered = renderContract(kind, {
      ...((row.variables ?? {}) as ContractVariables),
      ...signatureVariables({ signerName: data.signerName, signedAt: new Date() }),
    });
    const hash = await sha256Hex(rendered);

    const request = getRequest();
    const ip =
      request.headers.get("cf-connecting-ip") ??
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      null;

    const { data: signed, error } = await context.supabase.rpc("sign_contract", {
      p_contract_id: data.contractId,
      p_signer_name: data.signerName,
      p_rendered_body: rendered,
      p_body_sha256: hash,
      p_ip: ip ?? undefined,
      p_user_agent: request.headers.get("user-agent") ?? undefined,
    });
    if (error) throw new Error(error.message);
    return toRecord(signed as unknown as ContractRow);
  });

/** Admin: issue or re-issue a contract with custom annex values. */
export const adminIssueContract = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (d: {
      userId: string;
      kind: ContractKind;
      variables?: ContractVariables;
      partnerId?: string | null;
    }) => {
      if (!d?.userId) throw new Error("user_required");
      if (d.kind !== "driver" && d.kind !== "partner") throw new Error("invalid_kind");
      return d;
    },
  )
  .handler(async ({ data, context }): Promise<ContractRecord> => {
    const template = getContractTemplate(data.kind);
    const { data: row, error } = await context.supabase.rpc("admin_issue_contract", {
      p_user_id: data.userId,
      p_kind: data.kind,
      p_template_version: template.version,
      p_variables: (data.variables ?? {}) as never,
      p_partner_id: data.partnerId ?? undefined,
    });
    if (error) throw new Error(error.message);
    return toRecord(row as unknown as ContractRow);
  });

export type ContractSummary = {
  id: string;
  kind: ContractKind;
  status: ContractRecord["status"];
  userId: string;
  fullName: string | null;
  signerName: string | null;
  signedAt: string | null;
  createdAt: string;
  variables: ContractVariables;
};

/** Admin: every contract in the system. */
export const adminListContracts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ContractSummary[]> => {
    const { data, error } = await context.supabase
      .from("contract_overview")
      .select("id, kind, status, user_id, full_name, signer_name, signed_at, created_at, variables")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => ({
      id: row.id as string,
      kind: row.kind as ContractKind,
      status: row.status as ContractRecord["status"],
      userId: row.user_id as string,
      fullName: (row.full_name as string | null) ?? null,
      signerName: (row.signer_name as string | null) ?? null,
      signedAt: (row.signed_at as string | null) ?? null,
      createdAt: row.created_at as string,
      variables: (row.variables ?? {}) as ContractVariables,
    }));
  });

/** Admin: full text of any contract (for review / PDF). */
export const adminGetContract = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { contractId: string }) => {
    if (!d?.contractId) throw new Error("contract_required");
    return d;
  })
  .handler(async ({ data, context }): Promise<ContractRecord> => {
    const { data: row, error } = await context.supabase
      .from("contracts")
      .select(SELECT)
      .eq("id", data.contractId)
      .single();
    if (error) throw new Error(error.message);
    return toRecord(row as ContractRow);
  });
