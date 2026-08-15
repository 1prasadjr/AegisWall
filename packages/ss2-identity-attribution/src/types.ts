import type { IdentityRef, Uuid } from "@gov/shared";

export type OriginInput = {
  assertion: string;
  requestedAt: string;
};

export type OriginRecord = {
  subject: string;
  issuer: string;
  verifiedAt: string;
};

export type IdentityIssuanceEvent = {
  originRecord: OriginRecord;
  issuedAt: string;
};

export type AttestedIdentity = {
  identityId: Uuid;
  originReference: OriginRecord;
  issuedAt: string;
};

export type { IdentityRef } from "@gov/shared";
