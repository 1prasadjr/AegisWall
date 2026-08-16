import { describe, it, expect, vi, beforeEach } from "vitest";
import { attestIdentity } from "./attest-identity.js";
import * as registry from "./identity-registry.js";
import { ok, type Uuid } from "@gov/shared";

// Mock identity-registry.ts module
vi.mock("./identity-registry.js", () => {
  return {
    readIdentity: vi.fn(),
    writeIdentity: vi.fn(),
  };
});

describe("attestIdentity", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("delegates to readIdentity only and never writeIdentity", async () => {
    const mockRef = { identityId: "mock-uuid" as Uuid };
    const mockResponse = {
      identityId: "mock-uuid" as Uuid,
      originReference: {
        subject: "user-123",
        issuer: "https://auth.gov.test",
        verifiedAt: new Date().toISOString(),
      },
      issuedAt: new Date().toISOString(),
    };

    vi.mocked(registry.readIdentity).mockResolvedValueOnce(ok(mockResponse));

    const result = await attestIdentity(mockRef);

    // Assert readIdentity is called once with mockRef
    expect(registry.readIdentity).toHaveBeenCalledTimes(1);
    expect(registry.readIdentity).toHaveBeenCalledWith(mockRef);

    // Assert writeIdentity is never called
    expect(registry.writeIdentity).not.toHaveBeenCalled();

    // Verify result propagates correctly
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toEqual(mockResponse);
  });
});
