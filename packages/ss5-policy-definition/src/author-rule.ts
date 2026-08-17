import { isErr, type Result, type Uuid } from "@gov/shared";
import { validateRegoSyntax } from "@gov/policy-engine";
import type { RuleAuthoringInput } from "./types.js";
import type { Ss5Failure } from "./errors.js";
import { intakeRuleRequest } from "./intake-rule-request.js";
import { writeRule } from "./rule-repository.js";

/**
 * SS-5 public authoring pipeline (RS-5.1, IS §5.5).
 *
 * Sequence: intakeRuleRequest -> policy-engine.validateRegoSyntax -> writeRule.
 *
 * Structural rules enforced by this file:
 * - validateRegoSyntax is the ONLY @gov/policy-engine entry point used here
 *   (HLTAS §3.2 TB-4: authoring is structurally distinct from application).
 * - evaluatePolicy is NEVER imported or called from this package.
 * - @gov/ss6 is never imported in any form (TAS §3.2 row).
 */

// EXTENSION POINT: Rule Correction, Post-MVP — do not implement
export async function authorRule(
  request: RuleAuthoringInput,
): Promise<Result<{ ruleId: Uuid; version: number }, Ss5Failure>> {
  // 1. Synchronous intake (RS-5.1): drop the TB-4 caller reference and
  //    structurally validate the request. A failure here MUST short-circuit
  //    the pipeline — neither validateRegoSyntax nor writeRule is called.
  const intake = intakeRuleRequest(request);
  if (isErr(intake)) {
    return intake;
  }

  // 2. Authoring-time Rego syntax gate. validateRegoSyntax is the single
  //    @gov/policy-engine surface permitted here (TB-4). Any other shape of
  //    error (e.g. we cannot determine why a call would fail other than
  //    'invalid_rego_syntax') is the next-line-of-defence, not a redesign.
  const syntaxCheck = await validateRegoSyntax(intake.value.regoSource);
  if (isErr(syntaxCheck)) {
    // validateRegoSyntax returns the string 'invalid_rego_syntax' on failure.
    // We map it to the Ss5Failure shape required by our public signature.
    return {
      ok: false,
      error: { code: "invalid_rego_syntax", message: "Rego syntax validation failed" },
    };
  }

  // 3. Persist as a new versioned row. 'authoring_refused' is reserved
  //    for content-level insufficiency that survives the syntax gate but
  //    cannot be admitted into the repository as written. The repository's
  //    unique-constraint rejection is surfaced as 'unauthorable' (treated
  //    as a transient concurrency loss) — see rule-repository.writeRule.
  //
  //    We treat any failure from writeRule that is not a content-shape issue
  //    as 'authoring_refused' so that the public code surfaces give callers
  //    a distinct signal from raw DB connectivity / concurrency loss.
  //    In practice, rule-repository only ever returns 'unauthorable' (its
  //    sole declared code), so this branch is a no-op today and is here as
  //    the single chokepoint for the 'authoring_refused' extension if the
  //    repository ever grows a content-shape rejection path.
  const persisted = await writeRule(intake.value);
  if (isErr(persisted)) {
    if (persisted.error.code === "unauthorable") {
      return persisted;
    }
    return {
      ok: false,
      error: {
        code: "authoring_refused",
        message: persisted.error.message,
      },
    };
  }

  return persisted;
}
