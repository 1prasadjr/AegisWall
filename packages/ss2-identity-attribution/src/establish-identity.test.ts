import { describe, it, expect, vi, beforeEach } from "vitest";
import { establishIdentity } from "./establish-identity.js";
import { intakeOrigin } from "./intake-origin.js";
import { issueIdentity } from "./issue-identity.js";
import { writeIdentity } from "./identity-registry.js";
import { err, ok, type Uuid } from "@gov/shared";

// Mock the internal functions
vi.mock("./intake-origin.js", () => ({
  intakeOrigin: vi.fn(),
}));

vi.mock("./issue-identity.js", () => ({
  issueIdentity: vi.fn(),
}));

vi.mock("./identity-registry.js", () => ({
  writeIdentity: vi.fn(),
  readIdentity: vi.fn(),
}));

describe("establishIdentity", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("completes full pipeline successfully when all stages pass", async () => {
    const originInput = { assertion: "jwt", requestedAt: "now" };
    const mockOriginRecord = {
      subject: "sub",
      issuer: "iss",
      verifiedAt: "time",
    };
    const mockEvent = { originRecord: mockOriginRecord, issuedAt: "time2" };
    const mockRef = { identityId: "uuid-123" as Uuid };

    vi.mocked(intakeOrigin).mockResolvedValueOnce(ok(mockOriginRecord));
    vi.mocked(issueIdentity).mockReturnValueOnce(ok(mockEvent));
    vi.mocked(writeIdentity).mockResolvedValueOnce(ok(mockRef));

    const result = await establishIdentity(originInput);

    // Verify all steps called in sequence
    expect(intakeOrigin).toHaveBeenCalledWith(originInput);
    expect(issueIdentity).toHaveBeenCalledWith(mockOriginRecord);
    expect(writeIdentity).toHaveBeenCalledWith(mockEvent);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value).toEqual(mockRef);
  });

  it("short-circuits on intakeOrigin failure", async () => {
    const originInput = { assertion: "jwt", requestedAt: "now" };
    const mockFailure = {
      code: "origin_unresolved" as const,
      message: "bad jwt",
    };

    vi.mocked(intakeOrigin).mockResolvedValueOnce(err(mockFailure));

    const result = await establishIdentity(originInput);

    expect(intakeOrigin).toHaveBeenCalledWith(originInput);
    // Subsequent steps are NOT called
    expect(issueIdentity).not.toHaveBeenCalled();
    expect(writeIdentity).not.toHaveBeenCalled();

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toEqual(mockFailure);
  });

  it("short-circuits on issueIdentity failure", async () => {
    const originInput = { assertion: "jwt", requestedAt: "now" };
    const mockOriginRecord = {
      subject: "sub",
      issuer: "iss",
      verifiedAt: "time",
    };
    const mockFailure = {
      code: "identity_not_distinguishable" as const,
      message: "undistinguishable",
    };

    vi.mocked(intakeOrigin).mockResolvedValueOnce(ok(mockOriginRecord));
    vi.mocked(issueIdentity).mockReturnValueOnce(err(mockFailure));

    const result = await establishIdentity(originInput);

    expect(intakeOrigin).toHaveBeenCalledWith(originInput);
    expect(issueIdentity).toHaveBeenCalledWith(mockOriginRecord);
    // writeIdentity is NOT called
    expect(writeIdentity).not.toHaveBeenCalled();

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error).toEqual(mockFailure);
  });
});
