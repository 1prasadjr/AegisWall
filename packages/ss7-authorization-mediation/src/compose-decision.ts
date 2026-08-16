import type {
  AdmittedRequest,
  AuthorityContext,
  CandidateDecision,
  PolicyContext,
} from "./types";

export function composeDecision(
  _request: AdmittedRequest,
  _authority: AuthorityContext,
  _policy: PolicyContext,
): CandidateDecision {
  // TODO: implement
  throw new Error("TODO: implement");
}
