import type { IdentityRef, Result } from "@gov/shared";
import type { NeedContextInput } from "./types";
import type { Ss4Failure } from "./errors";

export function grantAuthority(
  identity: IdentityRef,
  need: NeedContextInput,
): Promise<Result<void, Ss4Failure>> {
  // TODO: implement
  throw new Error("TODO: implement");
}
