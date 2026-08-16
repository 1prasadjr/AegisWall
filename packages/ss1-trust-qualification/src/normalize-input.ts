import { ok, err } from "@gov/shared";
import type { Result } from "@gov/shared";
import type { NormalizedInput, RawInput } from "./types.js";
import type { Ss1Failure } from "./errors.js";

/**
 * Validates and normalises a raw inbound input.
 *
 * Failure modes (code: 'unnormalizable'):
 *   - content is null or undefined
 *   - receivedAt is not a valid ISO 8601 date string
 */
export function normalizeInput(
  raw: RawInput,
): Result<NormalizedInput, Ss1Failure> {
  // Guard: content must be present
  if (raw.content === null || raw.content === undefined) {
    return err<Ss1Failure>({
      code: "unnormalizable",
      message: "content must not be null or undefined",
    });
  }

  // Guard: receivedAt must be a parseable ISO 8601 date string
  const ts = Date.parse(raw.receivedAt);
  if (Number.isNaN(ts)) {
    return err<Ss1Failure>({
      code: "unnormalizable",
      message: `receivedAt is not a valid ISO 8601 date string: "${raw.receivedAt}"`,
    });
  }

  const normalized: NormalizedInput = {
    content: raw.content,
    zone: raw.zone,
    normalizedAt: new Date().toISOString(),
  };

  return ok(normalized);
}
