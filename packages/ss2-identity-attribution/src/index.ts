/** SS-2 public surface. */
export { establishIdentity } from "./establish-identity.js";
export { attestIdentity } from "./attest-identity.js";
export { initIdentityRegistry } from "./identity-registry.js";
export type {
  OriginInput,
  OriginRecord,
  IdentityIssuanceEvent,
  AttestedIdentity,
  IdentityRef,
} from "./types.js";
export type { Ss2Failure } from "./errors.js";
