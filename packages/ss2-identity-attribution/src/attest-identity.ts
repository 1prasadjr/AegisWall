import type { Result } from "@gov/shared";
import type { Ss2Failure } from "./errors.js";
import type { AttestedIdentity, IdentityRef } from "./types.js";
import { readIdentity } from "./identity-registry.js";

export async function attestIdentity(
  ref: IdentityRef,
): Promise<Result<AttestedIdentity, Ss2Failure>> {
  // Public read path: delegates to readIdentity only
  return readIdentity(ref);
}
