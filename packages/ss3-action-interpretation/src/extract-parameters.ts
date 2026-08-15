import type { Result } from "@gov/shared";
import type { BoundProposal, ResolvedParameters } from "./types";
import type { Ss3Failure } from "./errors";

export function extractParameters(
  proposal: BoundProposal,
): Result<ResolvedParameters, Ss3Failure> {
  // TODO: implement
  throw new Error("TODO: implement");
}
