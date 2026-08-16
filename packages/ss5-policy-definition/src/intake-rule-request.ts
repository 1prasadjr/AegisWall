import type { Result } from "@gov/shared";
import type { NormalizedRuleRequest, RuleAuthoringInput } from "./types";
import type { Ss5Failure } from "./errors";

export function intakeRuleRequest(
  _request: RuleAuthoringInput,
): Result<NormalizedRuleRequest, Ss5Failure> {
  // TODO: implement
  throw new Error("TODO: implement");
}
