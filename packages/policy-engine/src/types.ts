/**
 * Opaque interface representing a loaded and compiled WASM policy module.
 * The actual structure is determined by @open-policy-agent/opa-wasm.
 */
export interface CompiledPolicy {
  /**
   * The evaluate function signature matches the OPA WASM runtime API.
   * Takes a JSON-serializable input object and returns the evaluation result.
   */
  evaluate: (
    input: Record<string, unknown>,
  ) => Promise<Record<string, unknown>>;
}

/**
 * Input shape passed to the evaluator.
 *
 * Per IS §5.10, this is the input provided to the WASM policy evaluator.
 * This type structurally mirrors ss6's BoundAssessment without importing from @gov/ss6
 * (TAS §7.3 Diagram 4 — importing ss6 would reverse the allowed dependency direction).
 *
 * ResolvedAction fields mirror @gov/ss3 types.ts (IS §5.3).
 * RuleContent fields mirror @gov/ss5 types.ts (IS §5.5).
 */
export type PolicyEvalInput = {
  resolvedAction: {
    target:
      | { determinate: true; value: unknown }
      | { determinate: false }
      | "indeterminate";
    parameters:
      | { determinate: true; value: unknown }
      | { determinate: false }
      | "indeterminate";
    scope:
      | { determinate: true; value: unknown }
      | { determinate: false }
      | "indeterminate";
    determinate: boolean;
    identity: unknown;
  };
  ruleContent: {
    category: string;
    version: number;
    regoSource: string;
  };
};

/**
 * Result returned from a successful policy evaluation.
 *
 * This is a structurally independent type (not imported from @gov/ss6)
 * matching the shape of ss6's RawMatchResult per IS §5.10.
 */
export interface RawEvaluationResult {
  /** Whether the policy matched */
  matched: boolean;
  /** The version of the rule that matched */
  matchedRuleVersion: number;
  /** Flag indicating parameters were evaluated (always true on match) */
  parametersEvaluated: true;
}
