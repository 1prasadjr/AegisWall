import type { Result } from "@gov/shared";
import type { Ss2Failure } from "./errors";
import type { OriginInput, OriginRecord } from "./types";

// EXTENSION POINT: Provenance Linking, Deferred MVP — do not implement
export function intakeOrigin(
  _origin: OriginInput,
): Result<OriginRecord, Ss2Failure> {
  // TODO: implement
  throw new Error("TODO: implement");
}
