import type { IdentityRef } from "@gov/shared";
import type { AttestedIdentity } from "@gov/ss2";
import type { QualifiedInput } from "@gov/ss1";

// Bound types in this subsystem follow the IS convention: they bind exactly the intake function parameters and no more.
export interface ProposedActionInput {
  statedTarget: unknown;
  statedParameters: unknown;
  statedScope: unknown;
  agentAssertedIntent: string;
}

export interface BoundProposal {
  proposal: ProposedActionInput;
  qualifiedInput: QualifiedInput;
  identity: AttestedIdentity;
}

export type ResolvedTarget =
  { determinate: true; value: unknown } | { determinate: false };

export type ResolvedParameters =
  { determinate: true; value: unknown } | { determinate: false };

export type ResolvedScope =
  { determinate: true; value: unknown } | { determinate: false };

export interface ResolvedAction {
  target: ResolvedTarget | "indeterminate";
  parameters: ResolvedParameters | "indeterminate";
  scope: ResolvedScope | "indeterminate";
  determinate: boolean;
  identity: IdentityRef;
}
