import type {
  Decision,
  AuthorityContext,
  PolicyContext,
  AdmittedRequest,
} from "./types";
import type { IdentityRef } from "@gov/shared";
import type { ResolvedAction } from "@gov/ss3";

// EXTENSION POINT: Consequence Containment, Deferred MVP — attaches downstream of this function's return value, never inside it
export function publishDecision(
  decision: Decision,
  resolvedAction: ResolvedAction,
  authority: AuthorityContext,
  policy: PolicyContext,
  identity: IdentityRef,
): Promise<Decision> {
  // TODO: implement
  throw new Error("TODO: implement");
}
