import type { IdentityRef, Uuid } from "@gov/shared";
import type { AuthorityContext } from "@gov/ss7";
import type { PolicyJudgment } from "@gov/ss6";
import type { Decision } from "@gov/ss7";
import type { ResolvedAction } from "@gov/ss3";

export type DecisionBasisInput = {
  decision: Decision;
  resolvedAction: ResolvedAction;
  authorityContext: AuthorityContext;
  policyJudgment: PolicyJudgment;
  identity: IdentityRef | "unattributable";
};

export type DecisionRecordInput = {
  decisionId: Uuid;
  identityId: Uuid | null;
  resolvedAction: unknown;
  authorityContext: unknown;
  policyJudgment: unknown;
  outcome: "permit" | "deny" | "modify";
  complete: boolean;
};

export type DecisionRecord = DecisionRecordInput & { decidedAt: string };
