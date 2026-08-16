// SS-2 identity-registry contract tests (Item A.5 required run sequence).
//
// This file requires a live PostgreSQL reachable via $DATABASE_URL. The
// expected workflow (TAS §9.1 stage 7, "CI-provisioned ephemeral PostgreSQL"):
//
//   1. Bring up the disposable Postgres (host port 5433, NOT the dev default
//      5432) and apply infra/migrations/0001_identities.sql:
//        docker compose -f infra/docker-compose.test.yml up -d postgres-test
//      (the postgres image auto-applies /docker-entrypoint-initdb.d/*.sql on
//      first init, which is where infra/migrations/0001_identities.sql lives
//      because the compose file mounts ../infra/migrations into that path).
//   2. Export the connection string from the compose stack:
//        export DATABASE_URL=postgresql://test_user:test_pass@localhost:5433/governance_test
//   3. Run vitest:
//        pnpm --filter @gov/ss2 test
//
// If the stack is up the DB-dependent tests must PASS (real round-trip). If
// it is not running the SAME tests must FAIL loudly — there is no silent
// pass-by-skipping and no fallback list of URLs. We do NOT use `beforeAll` to
// bootstrap the connection, because a thrown error inside beforeAll makes
// Vitest mark the suite's tests as SKIPPED rather than FAILED, which is the
// exact failure mode Item A.3 forbids. Instead each DB-dependent test calls
// bootstrapDb() itself, so a connect failure surfaces as a real failed
// assertion, exit code 1.

import { describe, it, expect, afterAll } from "vitest";
import {
  initIdentityRegistry,
  writeIdentity,
  readIdentity,
} from "./identity-registry.js";
import type { IdentityIssuanceEvent } from "./types.js";
import * as registry from "./identity-registry.js";
import { type Uuid } from "@gov/shared";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. The SS-2 DB-dependent tests refuse to silently skip; " +
      "start infra/docker-compose.test.yml and export DATABASE_URL before running " +
      "`pnpm --filter @gov/ss2 test` (see top-of-file comment).",
  );
}

const DATABASE_URL: string = process.env.DATABASE_URL;

// Initialised lazily by the first DB-dependent test. Re-initialising a second
// time is cheap because createPostgresClient returns a fresh pool.
// The pool is closed after the whole suite finishes.
let activePool: { end: () => Promise<void> } | null = null;
let bootstrapped = false;

async function bootstrapDb(): Promise<void> {
  if (bootstrapped) return;
  const { createPostgresClient } = await import("@gov/persistence");
  const candidate = createPostgresClient(DATABASE_URL);
  try {
    // Round-trip the connection before declaring success. If the stack is not
    // running this throws — the calling test then fails, not skips.
    await candidate.db.execute("SELECT 1");
    initIdentityRegistry(candidate);
    activePool = candidate.pool;
    bootstrapped = true;
  } catch (e) {
    await candidate.pool.end().catch(() => {});
    throw new Error(
      `Could not reach PostgreSQL at $DATABASE_URL (${DATABASE_URL}). ` +
        `Bring up infra/docker-compose.test.yml and re-run. Underlying error: ${(e as Error).message}`,
    );
  }
}

describe("identity-registry", () => {
  afterAll(async () => {
    if (activePool) {
      await activePool.end().catch(() => {});
      activePool = null;
    }
  });

  it("exports no update or delete functions (immutability compile-time/reflection assertion)", () => {
    expect((registry as any).updateIdentity).toBeUndefined();
    expect((registry as any).deleteIdentity).toBeUndefined();
    expect((registry as any).update).toBeUndefined();
    expect((registry as any).delete).toBeUndefined();
  });

  it("returns 'not_attributable' for unknown identity reference", async () => {
    await bootstrapDb();
    const result = await readIdentity({
      identityId: "00000000-0000-0000-0000-000000000000" as Uuid,
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.error.code).toBe("not_attributable");
  });

  it("performs a successful write and read round-trip (immutable insert + select)", async () => {
    await bootstrapDb();

    const event: IdentityIssuanceEvent = {
      originRecord: {
        subject: `user-${Date.now()}`,
        issuer: "https://auth.gov.test",
        verifiedAt: new Date().toISOString(),
      },
      issuedAt: new Date().toISOString(),
    };

    // 1. Write the identity record
    const writeResult = await writeIdentity(event);
    expect(writeResult.ok).toBe(true);
    if (!writeResult.ok) return;

    const ref = writeResult.value;
    expect(ref.identityId).toBeDefined();

    // 2. Read the identity record back (RD7: fresh SELECT)
    const readResult = await readIdentity(ref);
    expect(readResult.ok).toBe(true);
    if (!readResult.ok) return;

    const attested = readResult.value;
    expect(attested.identityId).toBe(ref.identityId);
    expect(attested.originReference.subject).toBe(event.originRecord.subject);
    expect(attested.originReference.issuer).toBe(event.originRecord.issuer);
    // DB timestamp may differ by a few ms due to clock skew; allow 2s tolerance.
    const timeDiff = Math.abs(
      new Date(attested.issuedAt).getTime() - new Date(event.issuedAt).getTime(),
    );
    expect(timeDiff).toBeLessThan(2000);
  });
});
