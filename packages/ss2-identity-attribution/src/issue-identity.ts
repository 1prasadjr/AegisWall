import type { Result } from "@gov/shared";
import type { Ss2Failure } from "./errors";
import type { IdentityIssuanceEvent, OriginRecord } from "./types";

export function issueIdentity(
  originRecord: OriginRecord,
): Result<IdentityIssuanceEvent, Ss2Failure> {
  // TODO: implement
  throw new Error("TODO: implement");
}
