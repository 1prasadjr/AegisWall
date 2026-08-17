import { err, ok, type Result } from "@gov/shared";
import type { NormalizedRuleRequest, RuleAuthoringInput } from "./types.js";
import type { Ss5Failure } from "./errors.js";

/**
 * Internal intake step (RS-5.1 / IS §5.5).
 *
 * Synchronously validates the SHAPE of an authoring request and, on success,
 * drops the TB-4 caller reference (`authoredBy`) to produce a normalized
 * request ready for the policy-engine syntax gate and the repository writer.
 *
 * `unauthorable` is reserved for shape-level defects only — missing fields,
 * wrong types, empty strings. Content-level insufficiency (e.g. whitespace-
 * only body) is the next gate's job (see author-rule.ts → 'authoring_refused')
 * so that intake remains a pure structural pass.
 */
export function intakeRuleRequest(
  request: RuleAuthoringInput,
): Result<NormalizedRuleRequest, Ss5Failure> {
  if (
    !request ||
    typeof request.category !== "string" ||
    typeof request.regoSource !== "string" ||
    typeof request.authoredBy !== "string"
  ) {
    return err({
      code: "unauthorable",
      message: "RuleAuthoringInput must have string category, regoSource, and authoredBy",
    });
  }

  if (request.category.length === 0) {
    return err({
      code: "unauthorable",
      message: "RuleAuthoringInput.category must be a non-empty string",
    });
  }

  if (request.regoSource.length === 0) {
    return err({
      code: "unauthorable",
      message: "RuleAuthoringInput.regoSource must be a non-empty string",
    });
  }

  if (request.authoredBy.length === 0) {
    return err({
      code: "unauthorable",
      message: "RuleAuthoringInput.authoredBy must be a non-empty string (TB-4 caller reference)",
    });
  }

  return ok({
    category: request.category,
    regoSource: request.regoSource,
  });
}
