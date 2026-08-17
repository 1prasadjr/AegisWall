import type { RuleContent } from "./types.js";
import { readRule } from "./rule-repository.js";

/**
 * SS-5 public read path (RS-5.4, RD7, D10).
 *
 * Delegates to readRule on every call — no in-package cache, no memoization.
 * Two sequential calls produce two fresh SELECTs against policy_rules; the
 * repository is the single point of truth and is responsible for the actual
 * round-trip. A category with no authored rule yields the literal string
 * 'no_applicable_rule' (D10 Fail-Closed) — never an empty object, never
 * a thrown error, never a default RuleContent.
 */
export async function getRuleContent(
  category: string,
): Promise<RuleContent | "no_applicable_rule"> {
  return readRule(category);
}
