import type { Result } from "@gov/shared";
import type { QualifiedInput, RawInput } from "./types.js";
import type { Ss1Failure } from "./errors.js";
import { normalizeInput } from "./normalize-input.js";
import { analyzeProvenance } from "./analyze-provenance.js";
import { determineReliability } from "./determine-reliability.js";
import { publishQualifiedInput } from "./publish-qualified-input.js";

/**
 * PUBLIC entry point — sole export of this package.
 *
 * Strict pipeline (D1 — Non-Skippable, ordered):
 *   normalizeInput → analyzeProvenance → determineReliability → publishQualifiedInput
 *
 * If normalizeInput returns Result.err, qualifyInput returns that same
 * Result.err immediately. The remaining three functions are not invoked.
 */
export function qualifyInput(
  raw: RawInput,
): Result<QualifiedInput, Ss1Failure> {
  // Step 1 — normalise (only I/O-boundary step; may fail)
  const normalizeResult = normalizeInput(raw);
  if (!normalizeResult.ok) {
    // D1: short-circuit — propagate error, abort pipeline
    return normalizeResult;
  }

  // Step 2 — derive provenance signals (never reads zone for grounding)
  const signals = analyzeProvenance(normalizeResult.value);

  // Step 3 — deterministic reliability lookup (pure, no I/O)
  const determination = determineReliability(signals);

  // Step 4 — assemble and return qualified record
  const qualified = publishQualifiedInput(normalizeResult.value, determination);

  return { ok: true, value: qualified };
}
