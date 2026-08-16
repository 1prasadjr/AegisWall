import type { ProvenanceSignalSet, ReliabilityDetermination } from "./types.js";

/**
 * Pure deterministic lookup/switch table (TAS §3.2: "not a model").
 *
 * No I/O, no clock, no randomness — same input always yields same output.
 *
 * Rule table (D10/RD3 — fail-closed):
 *   signals empty                         → 'unqualified'
 *   zero grounded signals                 → 'unqualified'
 *   some grounded (0 < grounded < total)  → 'low_confidence'
 *   all signals grounded                  → 'qualified'
 */
export function determineReliability(
  { signals }: ProvenanceSignalSet,
): ReliabilityDetermination {
  // Fail-closed: no signals → unqualified
  if (signals.length === 0) {
    return "unqualified";
  }

  const groundedCount = signals.filter((s) => s.grounded).length;

  // Fail-closed: no grounded evidence → unqualified
  if (groundedCount === 0) {
    return "unqualified";
  }

  // Full evidence → qualified
  if (groundedCount === signals.length) {
    return "qualified";
  }

  // Partial evidence → low_confidence
  return "low_confidence";
}
