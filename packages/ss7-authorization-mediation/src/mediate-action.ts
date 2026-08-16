import type { IdentityRef } from "@gov/shared";
import type { ResolvedAction } from "@gov/ss3";
import type { Decision } from "./types";

export function mediateAction(
  _resolvedAction: ResolvedAction,
  _identity: IdentityRef,
): Promise<Decision> {
  // TODO: implement
  throw new Error("TODO: implement");
}
