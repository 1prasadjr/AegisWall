import * as jose from "jose";
import { err, ok, type Result } from "@gov/shared";
import type { Ss2Failure } from "./errors.js";
import type { OriginInput, OriginRecord } from "./types.js";
import { getSs2Config } from "./config.js";

// EXTENSION POINT: Provenance Linking, Deferred MVP — do not implement
export async function intakeOrigin(
  origin: OriginInput,
): Promise<Result<OriginRecord, Ss2Failure>> {
  try {
    const assertion = origin.assertion;
    if (!assertion || typeof assertion !== "string") {
      return err({
        code: "origin_unresolved",
        message: "Assertion must be a non-empty string",
      });
    }

    // Retrieve configured public key
    const config = getSs2Config();
    const publicKey = config.jwtPublicKey;

    // Verify and decode JWT using jose exclusively (TAS §2)
    let result: jose.JWTVerifyResult;
    try {
      result = await jose.jwtVerify(assertion, publicKey);
    } catch (error: any) {
      return err({
        code: "origin_unresolved",
        message: error.message || "JWT verification failed",
      });
    }

    const payload = result.payload;

    // Validate required claims
    if (!payload.sub || typeof payload.sub !== "string") {
      return err({
        code: "origin_unresolved",
        message: "JWT missing or invalid 'sub' claim",
      });
    }
    if (!payload.iss || typeof payload.iss !== "string") {
      return err({
        code: "origin_unresolved",
        message: "JWT missing or invalid 'iss' claim",
      });
    }

    return ok({
      subject: payload.sub,
      issuer: payload.iss,
      verifiedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return err({
      code: "origin_unresolved",
      message: error.message || "Unknown error during JWT intake",
    });
  }
}
