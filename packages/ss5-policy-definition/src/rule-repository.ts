import type { Result, Uuid } from "@gov/shared";
import type { NormalizedRuleRequest, RuleContent } from "./types";
import type { Ss5Failure } from "./errors";

export function writeRule(
  _request: NormalizedRuleRequest,
): Promise<Result<{ ruleId: Uuid; version: number }, Ss5Failure>> {
  // TODO: implement
  throw new Error("TODO: implement");
}

export function readRule(
  _category: string,
): Promise<RuleContent | "no_applicable_rule"> {
  // TODO: implement
  throw new Error("TODO: implement");
}
