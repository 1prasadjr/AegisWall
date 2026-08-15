import type {
  AdmittedRequest,
  AuthorityContext,
  CandidateDecision,
  PolicyContext,
} from "./types";

export function composeDecision(
  request: AdmittedRequest,
  authority: AuthorityContext,
  policy: PolicyContext,
): CandidateDecision {
  // TODO: implement
  throw new Error("TODO: implement");
}
