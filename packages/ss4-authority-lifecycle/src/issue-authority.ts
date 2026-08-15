import type { Result } from "@gov/shared";
import type { AuthorityIssuanceEvent, BoundNeedAssessment } from "./types";
import type { Ss4Failure } from "./errors";

export function issueAuthority(
  assessment: BoundNeedAssessment,
): Result<AuthorityIssuanceEvent, Ss4Failure> {
  // TODO: implement
  throw new Error("TODO: implement");
}
