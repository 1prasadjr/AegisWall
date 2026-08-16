import { describe, it, expect } from "vitest";
import { issueIdentity } from "./issue-identity.js";

describe("issueIdentity", () => {
  it("successfully creates IdentityIssuanceEvent for a valid distinguishable OriginRecord", () => {
    const originRecord = {
      subject: "user-123",
      issuer: "https://auth.gov.test",
      verifiedAt: new Date().toISOString(),
    };

    const result = issueIdentity(originRecord);

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.value.originRecord.subject).toBe("user-123");
    expect(result.value.originRecord.issuer).toBe("https://auth.gov.test");
    expect(result.value.originRecord.verifiedAt).toBe(originRecord.verifiedAt);
    expect(typeof result.value.issuedAt).toBe("string");
    expect(Date.parse(result.value.issuedAt)).not.toBeNaN();
  });

  it("refuses to issue identity if subject is empty or whitespace", () => {
    const originRecord = {
      subject: "   ",
      issuer: "https://auth.gov.test",
      verifiedAt: new Date().toISOString(),
    };

    const result = issueIdentity(originRecord);

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.error.code).toBe("identity_not_distinguishable");
  });

  it("refuses to issue identity if issuer is empty or whitespace", () => {
    const originRecord = {
      subject: "user-123",
      issuer: "",
      verifiedAt: new Date().toISOString(),
    };

    const result = issueIdentity(originRecord);

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.error.code).toBe("identity_not_distinguishable");
  });
});
