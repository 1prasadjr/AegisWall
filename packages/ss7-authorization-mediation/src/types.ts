import type { IdentityRef, Uuid } from "@gov/shared";
import type { CurrentAuthorityState } from "@gov/ss4";
import type { PolicyJudgment } from "@gov/ss6";
import type { ResolvedAction } from "@gov/ss3";

export type AdmittedRequest = {
  resolvedAction: ResolvedAction;
  identity: IdentityRef;
  admittedAt: string;
};

export type AuthorityContext = {
  state: CurrentAuthorityState | "empty";
};

export type PolicyContext = {
  judgment: PolicyJudgment;
};

export type CandidateDecision = {
  outcome: "permit" | "deny" | "modify";
  reason: string;
};

export type Decision = {
  outcome: "permit" | "deny" | "modify";
  reason: string;
  decisionId: Uuid;
  decidedAt: string;
};
