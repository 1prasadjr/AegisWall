import type { Result } from "@gov/shared";
import type { Ss2Failure } from "./errors";
import type {
  AttestedIdentity,
  IdentityIssuanceEvent,
  IdentityRef,
} from "./types";

export function writeIdentity(
  _event: IdentityIssuanceEvent,
): Promise<Result<IdentityRef, Ss2Failure>> {
  // TODO: implement
  throw new Error("TODO: implement");
}

export function readIdentity(
  _ref: IdentityRef,
): Promise<Result<AttestedIdentity, Ss2Failure>> {
  // TODO: implement
  throw new Error("TODO: implement");
}
