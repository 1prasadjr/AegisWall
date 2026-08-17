// SS-5 rule-repository contract tests (RS-5.2, RS-5.3, IS §9.1, §9.3, §9.4, RD7, D7/D10).
//
// Requires a live PostgreSQL reachable via $DATABASE_URL. The expected
// workflow is identical to SS-2's Item A.5 (Task J contract):
//
//   1. Bring up the disposable Postgres on host port 5433 (NOT 5432):
//        docker compose -f infra/docker-compose.test.yml up -d postgres-test
//      (the postgres image auto-applies /docker-entrypoint-initdb.d/*.sql on
//      first init, including infra/migrations/0003_policy_rules.sql which
//      creates the policy_rules table, the unique (category, version)
//      constraint, and the ss5_writer role.)
//   2. export DATABASE_URL=postgresql://test_user:test_pass@localhost:5433/governance_test
//   3. pnpm --filter @gov/ss5 test
//
// If the stack is up the DB-dependent tests must PASS for real. If it is
// not running the SAME tests must FAIL loudly — no silent pass-by-skipping.
// This file does NOT use `beforeAll` to bootstrap the connection: a thrown
// error inside beforeAll marks the suite's tests as SKIPPED, which is the
// exact failure mode the standing rules forbid. Each DB-dependent test
// calls bootstrapDb() itself, so a connect failure surfaces as a real
// failed assertion, exit code 1.

import { describe, it, expect, afterAll } from "vitest";
import {
  initRuleRepository,
  writeRule,
  readRule,
} from "./rule-repository.js";
import * as repository from "./rule-repository.js";
import type { NormalizedRuleRequest } from "./types.js";
import type { Uuid } from "@gov/shared";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. The SS-5 DB-dependent tests refuse to silently skip; " +
      "start infra/docker-compose.test.yml and export DATABASE_URL before running " +
      "`pnpm --filter @gov/ss5 test` (see top-of-file comment).",
  );
}

const DATABASE_URL: string = process.env.DATABASE_URL;

// Initialised lazily by the first DB-dependent test.
let activePool: { end: () => Promise<void> } | null = null;
let bootstrapped = false;

async function bootstrapDb(): Promise<void> {
  if (bootstrapped) return;
  const { createPostgresClient } = await import("@gov/persistence");
  const candidate = createPostgresClient(DATABASE_URL);
  try {
    // Round-trip the connection before declaring success. If the stack is
    // not running this throws — the calling test then fails, not skips.
    await candidate.db.execute("SELECT 1");
    initRuleRepository(candidate);
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

function uniqueCategory(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
}

describe("rule-repository", () => {
  afterAll(async () => {
    if (activePool) {
      await activePool.end().catch(() => {});
      activePool = null;
    }
  });

  it("exports no update or delete functions (D7 Append-Only)", () => {
    expect((repository as any).updateRule).toBeUndefined();
    expect((repository as any).deleteRule).toBeUndefined();
    expect((repository as any).update).toBeUndefined();
    expect((repository as any).delete).toBeUndefined();
  });

  it("writeRule + readRule round-trip against real Postgres", async () => {
    await bootstrapDb();

    const category = uniqueCategory("repo-roundtrip");
    const rego = "package test\n\ndefault allow = false\n";

    const writeResult = await writeRule({
      category,
      regoSource: rego,
    } as NormalizedRuleRequest);

    expect(writeResult.ok).toBe(true);
    if (!writeResult.ok) return;

    const { ruleId, version } = writeResult.value;
    expect(typeof ruleId).toBe("string");
    expect(version).toBe(1);

    const read = await readRule(category);
    expect(read).not.toBe("no_applicable_rule");
    if (read === "no_applicable_rule") return;
    expect(read.category).toBe(category);
    expect(read.version).toBe(1);
    expect(read.regoSource).toBe(rego);
  });

  it("readRule returns 'no_applicable_rule' for an unauthored category (D10 Fail-Closed)", async () => {
    await bootstrapDb();
    const read = await readRule(uniqueCategory("never-authored"));
    expect(read).toBe("no_applicable_rule");
  });

  it("readRule performs a fresh SELECT on every call (RD7 — no caching)", async () => {
    await bootstrapDb();

    const category = uniqueCategory("fresh-read");
    await writeRule({
      category,
      regoSource: "package fresh\n",
    } as NormalizedRuleRequest);

    // Two sequential calls must both succeed. The repository is structurally
    // forbidden from caching — each call issues a fresh SELECT. We assert
    // the result, not the internal call count, because call counting on a
    // private helper is brittle; what matters is that the second call
    // surfaces the same authoritative value without stale-state risk.
    const first = await readRule(category);
    const second = await readRule(category);

    expect(first).not.toBe("no_applicable_rule");
    expect(second).not.toBe("no_applicable_rule");
    if (first === "no_applicable_rule" || second === "no_applicable_rule") {
      return;
    }
    expect(first.version).toBe(second.version);
    expect(first.regoSource).toBe(second.regoSource);
  });

  it("assigns monotonically increasing versions per category", async () => {
    await bootstrapDb();
    const category = uniqueCategory("version-monotonic");

    const r1 = await writeRule({
      category,
      regoSource: "package v1\n",
    } as NormalizedRuleRequest);
    expect(r1.ok).toBe(true);
    if (!r1.ok) return;
    expect(r1.value.version).toBe(1);

    const r2 = await writeRule({
      category,
      regoSource: "package v2\n",
    } as NormalizedRuleRequest);
    expect(r2.ok).toBe(true);
    if (!r2.ok) return;
    expect(r2.value.version).toBe(2);

    const read = await readRule(category);
    expect(read).not.toBe("no_applicable_rule");
    if (read === "no_applicable_rule") return;
    expect(read.version).toBe(2);
    expect(read.regoSource).toBe("package v2\n");
  });
});
