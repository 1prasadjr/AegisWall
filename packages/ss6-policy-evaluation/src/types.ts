import type { ResolvedAction } from "@gov/ss3";
import type { RuleContent } from "@gov/ss5";

export interface BoundAssessment {
  resolvedAction: ResolvedAction;
  ruleContent: RuleContent;
}

export interface RawMatchResult {
  matched: boolean;
  matchedRuleVersion: number;
  parametersEvaluated: true;
}

export interface PolicyJudgment {
  outcome: "auto_permit" | "auto_deny" | "inconclusive";
  basis: RawMatchResult | "assessment_blocked" | "inconclusive";
}
