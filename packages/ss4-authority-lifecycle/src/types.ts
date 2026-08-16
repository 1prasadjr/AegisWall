import type { IdentityRef, Uuid } from "@gov/shared";

export interface NeedContextInput {
  taskDescription: string;
  requestedScope: unknown;
}

// Bound types in this subsystem follow the IS convention: they bind exactly the intake function parameters and no more.
export interface BoundNeedAssessment {
  identity: IdentityRef;
  need: NeedContextInput;
}

export interface AuthorityIssuanceEvent {
  identityId: Uuid;
  scope: unknown;
  issuedAt: string;
}

export interface CurrentAuthorityState {
  identityId: Uuid;
  grants: readonly { scope: unknown; issuedAt: string }[];
  empty: boolean;
}
