import type { ResolvedAction } from "@gov/ss3";
import type { RuleContent } from "@gov/ss5";

export type BoundAssessment = {
  resolvedAction: ResolvedAction;
  ruleContent: RuleContent;
};

export type RawMatchResult = {
  matched: boolean;
  matchedRuleVersion: number;
  parametersEvaluated: true;
};

export type PolicyJudgment = {
  outcome: "auto_permit" | "auto_deny" | "inconclusive";
  basis: RawMatchResult | "assessment_blocked" | "inconclusive";
};
