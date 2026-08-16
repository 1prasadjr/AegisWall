import type { Result } from "@gov/shared";
import type { Ss2Failure } from "./errors";
import type { IdentityRef, OriginInput } from "./types";

export function establishIdentity(
  _origin: OriginInput,
): Promise<Result<IdentityRef, Ss2Failure>> {
  // TODO: implement
  throw new Error("TODO: implement");
}
