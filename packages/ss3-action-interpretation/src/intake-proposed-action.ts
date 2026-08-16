import type { AttestedIdentity } from "@gov/ss2";
import type { QualifiedInput } from "@gov/ss1";
import type { Result } from "@gov/shared";
import type { BoundProposal, ProposedActionInput } from "./types";
import type { Ss3Failure } from "./errors";

export function intakeProposedAction(
  _proposal: ProposedActionInput,
  _qualifiedInput: QualifiedInput,
  _identity: AttestedIdentity,
): Result<BoundProposal, Ss3Failure> {
  // TODO: implement
  throw new Error("TODO: implement");
}
