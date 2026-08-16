import { isErr, type Result } from "@gov/shared";
import type { Ss2Failure } from "./errors.js";
import type { IdentityRef, OriginInput } from "./types.js";
import { intakeOrigin } from "./intake-origin.js";
import { issueIdentity } from "./issue-identity.js";
import { writeIdentity } from "./identity-registry.js";

export async function establishIdentity(
  origin: OriginInput,
): Promise<Result<IdentityRef, Ss2Failure>> {
  // 1. Intake origin record from assertion
  const intakeResult = await intakeOrigin(origin);
  if (isErr(intakeResult)) {
    return intakeResult;
  }

  // 2. Issue the identity from origin record
  const issueResult = issueIdentity(intakeResult.value);
  if (isErr(issueResult)) {
    return issueResult;
  }

  // 3. Persist the identity in registry
  return writeIdentity(issueResult.value);
}
