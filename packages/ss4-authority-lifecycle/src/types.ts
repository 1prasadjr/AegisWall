import type { IdentityRef, Uuid } from "@gov/shared";

export type NeedContextInput = {
  taskDescription: string;
  requestedScope: unknown;
};

// Bound types in this subsystem follow the IS convention: they bind exactly the intake function parameters and no more.
export type BoundNeedAssessment = {
  identity: IdentityRef;
  need: NeedContextInput;
};

export type AuthorityIssuanceEvent = {
  identityId: Uuid;
  scope: unknown;
  issuedAt: string;
};

export type CurrentAuthorityState = {
  identityId: Uuid;
  grants: ReadonlyArray<{ scope: unknown; issuedAt: string }>;
  empty: boolean;
};
