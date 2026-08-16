import type { Result } from "@gov/shared";
import type { QualifiedInput, RawInput } from "./types";
import type { Ss1Failure } from "./errors";

export function qualifyInput(
  _raw: RawInput,
): Result<QualifiedInput, Ss1Failure> {
  // TODO: implement
  throw new Error("TODO: implement");
}
