import type { NormalizedInput, ProvenanceSignalSet } from "./types.js";

/**
 * Derives provenance signals from independently-observable structural
 * properties of content.
 *
 * Invariant SI-8: record.zone is NEVER read here. Zone membership is
 * not a grounding signal. Grounding comes exclusively from the content
 * itself.
 *
 * Signals produced:
 *   content-present   — content is non-null and non-undefined
 *   content-structured — content is a non-null object or a non-empty string
 *   content-non-empty  — content has at least one own key (object) or is a
 *                        non-empty array / non-empty string
 */
export function analyzeProvenance(
  record: NormalizedInput,
): ProvenanceSignalSet {
  const { content } = record;
  // NOTE: record.zone is intentionally never accessed (SI-8).

  const isPresent = content !== null && content !== undefined;

  const isStructured =
    isPresent &&
    (typeof content === "object" || (typeof content === "string" && content.length > 0));

  let isNonEmpty = false;
  if (isPresent && isStructured) {
    if (Array.isArray(content)) {
      isNonEmpty = content.length > 0;
    } else if (typeof content === "object" && content !== null) {
      isNonEmpty = Object.keys(content as object).length > 0;
    } else if (typeof content === "string") {
      isNonEmpty = content.length > 0;
    }
  }

  return {
    signals: [
      { signalType: "content-present", grounded: isPresent },
      { signalType: "content-structured", grounded: isStructured },
      { signalType: "content-non-empty", grounded: isNonEmpty },
    ],
  };
}
