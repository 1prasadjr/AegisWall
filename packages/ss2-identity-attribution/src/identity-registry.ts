import { eq } from "drizzle-orm";
import { schema, type PostgresClient } from "@gov/persistence";
import { err, ok, type Result, type Uuid } from "@gov/shared";
import type { Ss2Failure } from "./errors.js";
import type {
  AttestedIdentity,
  IdentityIssuanceEvent,
  IdentityRef,
  OriginRecord,
} from "./types.js";

const { identities } = schema;

let dbClient: PostgresClient | null = null;

export function initIdentityRegistry(client: PostgresClient): void {
  dbClient = client;
}

function getDb(): PostgresClient["db"] {
  if (!dbClient) {
    throw new Error("Identity registry not initialized with PostgresClient.");
  }
  return dbClient.db;
}

export async function writeIdentity(
  event: IdentityIssuanceEvent,
): Promise<Result<IdentityRef, Ss2Failure>> {
  try {
    const db = getDb();
    const [inserted] = await db
      .insert(identities)
      .values({
        originReference: event.originRecord,
        issuedAt: new Date(event.issuedAt),
      })
      .returning({
        identityId: identities.identityId,
      });

    if (!inserted) {
      return err({
        code: "not_attributable",
        message: "Failed to persist identity record",
      });
    }

    return ok({
      identityId: inserted.identityId as Uuid,
    });
  } catch (error: any) {
    return err({
      code: "not_attributable",
      message: error.message || "Database write failed",
    });
  }
}

export async function readIdentity(
  ref: IdentityRef,
): Promise<Result<AttestedIdentity, Ss2Failure>> {
  try {
    const db = getDb();
    const results = await db
      .select()
      .from(identities)
      .where(eq(identities.identityId, ref.identityId));

    if (results.length === 0) {
      // D10 Fail-Closed: unknown identity on readIdentity returns Result.err('not_attributable')
      return err({
        code: "not_attributable",
        message: `Identity not found for id ${ref.identityId}`,
      });
    }

    const record = results[0];
    return ok({
      identityId: record.identityId as Uuid,
      originReference: record.originReference as OriginRecord,
      issuedAt: record.issuedAt.toISOString(),
    });
  } catch (error: any) {
    return err({
      code: "not_attributable",
      message: error.message || "Database read failed",
    });
  }
}
