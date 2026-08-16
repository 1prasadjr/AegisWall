import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

/**
 * RS-5.3 Rule Repository — append-only, versioned
 *
 * Maps to migration: infra/migrations/0003_policy_rules.sql
 *
 * Grants: INSERT, SELECT to role 'ss5_writer' only.
 * No UPDATE/DELETE grant to any role (T10, IS §9.2).
 *
 * A "correction" (Post-MVP, reserved) is a new version row,
 * never an UPDATE.
 */
export const policyRules = pgTable(
  "policy_rules",
  {
    ruleId: uuid("rule_id").primaryKey().defaultRandom(),
    category: text("category").notNull(),
    version: integer("version").notNull(),
    regoSource: text("rego_source").notNull(),
    authoredAt: timestamp("authored_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    categoryVersionUnique: unique("policy_rules_category_version_key").on(
      table.category,
      table.version,
    ),
  }),
);
