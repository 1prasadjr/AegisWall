import type { Result } from "@gov/shared";
import type { Ss2Failure } from "./errors";
import type { AttestedIdentity, IdentityRef } from "./types";

export function attestIdentity(
  _ref: IdentityRef,
): Promise<Result<AttestedIdentity, Ss2Failure>> {
  // TODO: implement
  throw new Error("TODO: implement");
}
