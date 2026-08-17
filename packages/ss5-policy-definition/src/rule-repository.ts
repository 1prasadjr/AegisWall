import { desc, eq } from "drizzle-orm";
import { schema, type PostgresClient } from "@gov/persistence";
import { err, ok, type Result, type Uuid } from "@gov/shared";
import type { Ss5Failure } from "./errors.js";
import type { NormalizedRuleRequest, RuleContent } from "./types.js";

const { policyRules } = schema;

/**
 * SS-5 Rule Repository (RS-5.2 / RS-5.3, IS §5.5, IS §9.1, IS §9.3, IS §9.4).
 *
 * This is the ONLY file in the package permitted to import @gov/persistence
 * (D3/D5 Single Writer). The `policy_rules` table is append-only and versioned;
 * the unique (category, version) constraint is the sole concurrency control —
 * a duplicate INSERT is rejected by the database, never by an application-level
 * check-then-insert (IS §9.4). UPDATE/DELETE grants are not assumed (T10, D7).
 */

let dbClient: PostgresClient | null = null;

export function initRuleRepository(client: PostgresClient): void {
  dbClient = client;
}

function getDb(): PostgresClient["db"] {
  if (!dbClient) {
    throw new Error("Rule repository not initialized with PostgresClient.");
  }
  return dbClient.db;
}

/**
 * Determines the next version for `category` by reading the current max
 * version (or 0 when none exists) and returning max + 1. The unique
 * (category, version) constraint is the actual race-rejection mechanism —
 * two concurrent writers may both compute the same next version, but only
 * one INSERT will succeed. The loser's INSERT returns a unique-violation
 * error surfaced as 'unauthorable' (treated as a transient concurrency
 * loss, per IS §9.4).
 */
async function nextVersionFor(
  category: string,
): Promise<{ value: number } | { error: string }> {
  try {
    const db = getDb();
    const rows = await db
      .select({ version: policyRules.version })
      .from(policyRules)
      .where(eq(policyRules.category, category))
      .orderBy(desc(policyRules.version))
      .limit(1);
    const currentMax = rows.length > 0 ? rows[0].version : 0;
    return { value: currentMax + 1 };
  } catch (error) {
    return { error: (error as Error).message || "Database read failed" };
  }
}

/**
 * Persist a normalized rule request as a new policy_rules row.
 *
 * Performs a single-statement INSERT relying on the (category, version)
 * unique constraint to reject a concurrent duplicate. The author-time
 * syntax check happens upstream in author-rule.ts — by the time we are
 * called the Rego has been validated and the row is safe to insert.
 */
export async function writeRule(
  request: NormalizedRuleRequest,
): Promise<Result<{ ruleId: Uuid; version: number }, Ss5Failure>> {
  try {
    const db = getDb();

    // Determine the next version (max + 1). Concurrency-safe: the unique
    // constraint at the database is the single point of rejection.
    const next = await nextVersionFor(request.category);
    if ("error" in next) {
      return err({
        code: "unauthorable",
        message: next.error,
      });
    }

    const [inserted] = await db
      .insert(policyRules)
      .values({
        category: request.category,
        version: next.value,
        regoSource: request.regoSource,
      })
      .returning({
        ruleId: policyRules.ruleId,
        version: policyRules.version,
      });

    if (!inserted) {
      return err({
        code: "unauthorable",
        message: "Failed to persist rule record",
      });
    }

    return ok({
      ruleId: inserted.ruleId as Uuid,
      version: inserted.version,
    });
  } catch (error) {
    return err({
      code: "unauthorable",
      message: (error as Error).message || "Database write failed",
    });
  }
}

/**
 * Read the latest authored rule for a category. Always issues a fresh
 * SELECT (RD7) — no caching, no memoization at any layer. Returns the
 * literal string 'no_applicable_rule' when no row exists (D10 Fail-Closed),
 * which keeps the read-shape uniform for the public getRuleContent caller.
 */
export async function readRule(
  category: string,
): Promise<RuleContent | "no_applicable_rule"> {
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(policyRules)
      .where(eq(policyRules.category, category))
      .orderBy(desc(policyRules.version))
      .limit(1);

    if (rows.length === 0) {
      return "no_applicable_rule";
    }

    const row = rows[0];
    return {
      category: row.category,
      version: row.version,
      regoSource: row.regoSource,
    };
  } catch {
    // D10 Fail-Closed: a read failure on an unknown/unreachable category
    // is indistinguishable from "no authored rule" at the public surface.
    // The package is structurally forbidden from throwing out of getRuleContent.
    return "no_applicable_rule";
  }
}