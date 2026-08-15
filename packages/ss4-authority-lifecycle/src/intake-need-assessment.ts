import type { IdentityRef, Result } from "@gov/shared";
import type { BoundNeedAssessment, NeedContextInput } from "./types";
import type { Ss4Failure } from "./errors";

export function intakeNeedAssessment(
  identity: IdentityRef,
  need: NeedContextInput,
): Result<BoundNeedAssessment, Ss4Failure> {
  // TODO: implement
  throw new Error("TODO: implement");
}
