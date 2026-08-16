import type { IdentityRef, Result } from "@gov/shared";
import type { AuthorityIssuanceEvent, CurrentAuthorityState } from "./types";
import type { Ss4Failure } from "./errors";

// EXTENSION POINT: Authority Withdrawal (LC-4.5), Deferred MVP — do not implement
export function appendIssuanceEvent(
  _event: AuthorityIssuanceEvent,
): Promise<Result<void, Ss4Failure>> {
  // TODO: implement
  throw new Error("TODO: implement");
}

export function readCurrentState(
  _identity: IdentityRef,
): Promise<CurrentAuthorityState> {
  // TODO: implement
  throw new Error("TODO: implement");
}
