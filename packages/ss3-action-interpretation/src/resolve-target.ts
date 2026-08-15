import type { Result } from "@gov/shared";
import type { BoundProposal, ResolvedTarget } from "./types";
import type { Ss3Failure } from "./errors";

export function resolveTarget(
  proposal: BoundProposal,
): Result<ResolvedTarget, Ss3Failure> {
  // TODO: implement
  throw new Error("TODO: implement");
}
