import { queryOptions } from "@tanstack/react-query";
import {
  adminIssueContract,
  adminListContracts,
  getMyContract,
  listMyContracts,
  signContract,
  type ContractRecord,
  type ContractSummary,
} from "@/functions/contracts";
import type { ContractKind, ContractVariables } from "@/lib/contracts";

export type { ContractRecord, ContractSummary };

export const myContractsQuery = queryOptions({
  queryKey: ["my-contracts"],
  queryFn: () => listMyContracts(),
});

export const myContractQuery = (kind: ContractKind, variables?: ContractVariables) =>
  queryOptions({
    queryKey: ["my-contract", kind],
    queryFn: () => getMyContract({ data: { kind, variables } }),
  });

export const opsContractsQuery = queryOptions({
  queryKey: ["ops-contracts"],
  queryFn: () => adminListContracts(),
});

export function signMyContract(input: { contractId: string; signerName: string }) {
  return signContract({ data: input });
}

export function issueContractAdmin(input: {
  userId: string;
  kind: ContractKind;
  variables?: ContractVariables;
}) {
  return adminIssueContract({ data: input });
}
