import type { IdentityRef, Uuid } from "@gov/shared";
import type { CurrentAuthorityState } from "@gov/ss4";
import type { PolicyJudgment } from "@gov/ss6";
import type { ResolvedAction } from "@gov/ss3";

export interface AdmittedRequest {
  resolvedAction: ResolvedAction;
  identity: IdentityRef;
  admittedAt: string;
}

export interface AuthorityContext {
  state: CurrentAuthorityState | "empty";
}

export interface PolicyContext {
  judgment: PolicyJudgment;
}

export interface CandidateDecision {
  outcome: "permit" | "deny" | "modify";
  reason: string;
}

export interface Decision {
  outcome: "permit" | "deny" | "modify";
  reason: string;
  decisionId: Uuid;
  decidedAt: string;
}
