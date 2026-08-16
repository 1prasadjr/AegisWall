import { err, ok, type Result } from "@gov/shared";
import type { Ss2Failure } from "./errors.js";
import type { IdentityIssuanceEvent, OriginRecord } from "./types.js";

export function issueIdentity(
  originRecord: OriginRecord,
): Result<IdentityIssuanceEvent, Ss2Failure> {
  const subject = originRecord.subject?.trim();
  const issuer = originRecord.issuer?.trim();

  // QA-7 (Identity Distinctness): Must refuse if originRecord cannot distinguish this acting instance
  if (!subject || !issuer) {
    return err({
      code: "identity_not_distinguishable",
      message: "Subject and Issuer must be present and non-empty to distinguish the identity",
    });
  }

  return ok({
    originRecord: {
      subject,
      issuer,
      verifiedAt: originRecord.verifiedAt,
    },
    issuedAt: new Date().toISOString(),
  });
}
