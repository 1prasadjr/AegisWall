import type { Uuid } from "@gov/shared";

export interface OriginInput {
  assertion: string;
  requestedAt: string;
}

export interface OriginRecord {
  subject: string;
  issuer: string;
  verifiedAt: string;
}

export interface IdentityIssuanceEvent {
  originRecord: OriginRecord;
  issuedAt: string;
}

export interface AttestedIdentity {
  identityId: Uuid;
  originReference: OriginRecord;
  issuedAt: string;
}

export type { IdentityRef } from "@gov/shared";
