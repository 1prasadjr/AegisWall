import type {
  NormalizedInput,
  QualifiedInput,
  ReliabilityDetermination,
} from "./types.js";

/**
 * Assembles the final QualifiedInput from a normalised record and the
 * reliability determination produced by determineReliability.
 *
 * The determination is passed through unmodified — this function never
 * re-evaluates or overrides it.
 */
export function publishQualifiedInput(
  record: NormalizedInput,
  determination: ReliabilityDetermination,
): QualifiedInput {
  return {
    content: record.content,
    determination,
    qualifiedAt: new Date().toISOString(),
  };
}
