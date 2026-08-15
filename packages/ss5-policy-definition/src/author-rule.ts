import type { Result, Uuid } from "@gov/shared";
import type { RuleAuthoringInput } from "./types";
import type { Ss5Failure } from "./errors";

export function authorRule(
  request: RuleAuthoringInput,
): Promise<Result<{ ruleId: Uuid; version: number }, Ss5Failure>> {
  // TODO: implement
  throw new Error("TODO: implement");
}
