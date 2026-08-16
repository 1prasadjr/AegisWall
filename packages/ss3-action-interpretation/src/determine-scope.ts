import type { Result } from "@gov/shared";
import type { BoundProposal, ResolvedScope } from "./types";
import type { Ss3Failure } from "./errors";

export function determineScope(
  _proposal: BoundProposal,
): Result<ResolvedScope, Ss3Failure> {
  // TODO: implement
  throw new Error("TODO: implement");
}
