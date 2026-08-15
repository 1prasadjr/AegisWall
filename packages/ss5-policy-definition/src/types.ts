export type RuleAuthoringInput = {
  category: string;
  regoSource: string;
  authoredBy: string;
};

export type NormalizedRuleRequest = {
  category: string;
  regoSource: string;
};

export type RuleContent = {
  category: string;
  version: number;
  regoSource: string;
};
