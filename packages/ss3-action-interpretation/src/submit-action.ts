import type { QualifiedInput } from "@gov/ss1";
import type { AttestedIdentity } from "@gov/ss2";
import type { Result } from "@gov/shared";
import type { Decision } from "@gov/ss7";
import type { ProposedActionInput } from "./types";
import type { Ss3Failure, Ss7ForwardedFailure } from "./errors";

export function submitAction(
  _proposal: ProposedActionInput,
  _qualifiedInput: QualifiedInput,
  _identity: AttestedIdentity,
): Promise<Result<Decision, Ss3Failure | Ss7ForwardedFailure>> {
  // TODO: implement
  throw new Error("TODO: implement");
}
