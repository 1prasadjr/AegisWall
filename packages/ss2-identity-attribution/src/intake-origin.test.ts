import { describe, it, expect, beforeAll } from "vitest";
import * as jose from "jose";
import { intakeOrigin } from "./intake-origin.js";
import { initSs2 } from "./config.js";

describe("intakeOrigin", () => {
  let publicKey: any;
  let privateKey: any;
  let validJwt: string;
  let expiredJwt: string;

  beforeAll(async () => {
    // Generate ES256 key pair
    const keyPair = await jose.generateKeyPair("ES256");
    publicKey = keyPair.publicKey;
    privateKey = keyPair.privateKey;

    // Initialize SS2 config with the generated public key
    initSs2({ jwtPublicKey: publicKey });

    // Generate a valid JWT
    validJwt = await new jose.SignJWT({
      sub: "user-123",
      iss: "https://auth.gov.test",
    })
      .setProtectedHeader({ alg: "ES256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(privateKey);

    // Generate an expired JWT
    expiredJwt = await new jose.SignJWT({
      sub: "user-123",
      iss: "https://auth.gov.test",
    })
      .setProtectedHeader({ alg: "ES256" })
      .setIssuedAt(Math.floor(Date.now() / 1000) - 3600)
      .setExpirationTime(Math.floor(Date.now() / 1000) - 1800)
      .sign(privateKey);
  });

  it("successfully parses and verifies a valid JWT", async () => {
    const result = await intakeOrigin({
      assertion: validJwt,
      requestedAt: new Date().toISOString(),
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.value.subject).toBe("user-123");
    expect(result.value.issuer).toBe("https://auth.gov.test");
    expect(typeof result.value.verifiedAt).toBe("string");
    expect(Date.parse(result.value.verifiedAt)).not.toBeNaN();
  });

  it("returns 'origin_unresolved' for an expired JWT", async () => {
    const result = await intakeOrigin({
      assertion: expiredJwt,
      requestedAt: new Date().toISOString(),
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.error.code).toBe("origin_unresolved");
    expect(result.error.message).toContain("claim timestamp check failed");
  });

  it("returns 'origin_unresolved' for a malformed JWT string", async () => {
    const result = await intakeOrigin({
      assertion: "not.a.jwt",
      requestedAt: new Date().toISOString(),
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.error.code).toBe("origin_unresolved");
  });

  it("returns 'origin_unresolved' if signature verification fails (signed with different key)", async () => {
    // Generate a different key pair
    const differentKeyPair = await jose.generateKeyPair("ES256");
    const wrongJwt = await new jose.SignJWT({
      sub: "user-123",
      iss: "https://auth.gov.test",
    })
      .setProtectedHeader({ alg: "ES256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(differentKeyPair.privateKey);

    const result = await intakeOrigin({
      assertion: wrongJwt,
      requestedAt: new Date().toISOString(),
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.error.code).toBe("origin_unresolved");
    expect(result.error.message).toContain("verification failed");
  });

  it("returns 'origin_unresolved' if 'sub' claim is missing", async () => {
    const noSubJwt = await new jose.SignJWT({
      iss: "https://auth.gov.test",
    })
      .setProtectedHeader({ alg: "ES256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(privateKey);

    const result = await intakeOrigin({
      assertion: noSubJwt,
      requestedAt: new Date().toISOString(),
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.error.code).toBe("origin_unresolved");
    expect(result.error.message).toContain("missing or invalid 'sub' claim");
  });

  it("returns 'origin_unresolved' if 'iss' claim is missing", async () => {
    const noIssJwt = await new jose.SignJWT({
      sub: "user-123",
    })
      .setProtectedHeader({ alg: "ES256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(privateKey);

    const result = await intakeOrigin({
      assertion: noIssJwt,
      requestedAt: new Date().toISOString(),
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.error.code).toBe("origin_unresolved");
    expect(result.error.message).toContain("missing or invalid 'iss' claim");
  });
});
