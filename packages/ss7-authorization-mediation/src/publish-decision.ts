import type {
  Decision,
  AuthorityContext,
  PolicyContext,
  _AdmittedRequest,
} from "./types";
import type { IdentityRef } from "@gov/shared";
import type { ResolvedAction } from "@gov/ss3";

// EXTENSION POINT: Consequence Containment, Deferred MVP — attaches downstream of this function's return value, never inside it
export function publishDecision(
  _decision: Decision,
  _resolvedAction: ResolvedAction,
  _authority: AuthorityContext,
  _policy: PolicyContext,
  _identity: IdentityRef,
): Promise<Decision> {
  // TODO: implement
  throw new Error("TODO: implement");
}
