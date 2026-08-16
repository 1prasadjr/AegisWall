export interface RuleAuthoringInput {
  category: string;
  regoSource: string;
  authoredBy: string;
}

export interface NormalizedRuleRequest {
  category: string;
  regoSource: string;
}

export interface RuleContent {
  category: string;
  version: number;
  regoSource: string;
}
