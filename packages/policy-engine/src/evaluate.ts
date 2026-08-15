import { CompiledPolicy, PolicyEvalInput, RawEvaluationResult } from "./types";

/**
 * Evaluates a compiled WASM policy against the given input in-process.
 *
 * Per the specification (IS §5.10, TAS §3.2/SS-6), this function:
 * - Runs the WASM policy evaluation entirely in-process (no OPA server,
 *   no network hop).
 * - Returns a Promise of RawEvaluationResult on a definitive match.
 * - Returns the literal string 'inconclusive' when WASM output is
 *   ambiguous or contradictory, per RD3/T3 — never throws.
 */
export async function evaluatePolicy(
  policy: CompiledPolicy,
  input: PolicyEvalInput,
): Promise<RawEvaluationResult | "inconclusive"> {
  try {
    // In-process WASM evaluation via @open-policy-agent/opa-wasm.
    // The compiled policy object is opaque; we invoke its evaluate()
    // entry point with the resolved input. If the WASM runtime is not
    // initialized or the policy is invalid, we treat the result as
    // inconclusive rather than throwing (RD3, T3).
    const evaluateFn = policy.evaluate;
    if (typeof evaluateFn !== "function") {
      return "inconclusive";
    }

    const result = await evaluateFn(input);

    // A definitive, well-formed result is returned directly.
    if (
      result &&
      typeof result === "object" &&
      typeof result.matched === "boolean" &&
      typeof result.matchedRuleVersion === "number" &&
      result.parametersEvaluated === true
    ) {
      return result as unknown as RawEvaluationResult;
    }

    // Ambiguous, contradictory, or malformed WASM output → 'inconclusive'.
    return "inconclusive";
  } catch {
    // Any failure during evaluation is reported as 'inconclusive'
    // rather than propagated as a thrown exception (RD3, T3).
    return "inconclusive";
  }
}
