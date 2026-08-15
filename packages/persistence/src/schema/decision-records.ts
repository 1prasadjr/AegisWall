import { pgTable, uuid, jsonb, timestamp, text, boolean } from 'drizzle-orm/pg-core';
import { identities } from './identities.js';

/**
 * RS-8.3 Decision Record Store — append-only, the durable trace of every Decision
 *
 * Maps to migration: infra/migrations/0004_decision_records.sql
 *
 * Grants: INSERT, SELECT to role 'ss8_writer' only.
 * No UPDATE/DELETE grant to any role, ever (T10, IS §9.2, §9.3).
 *
 * This is a database-level, not merely application-level, enforcement
 * of SI-7/D7 append-only.
 *
 * IMPORTANT: identity_id is NULLABLE per IS §9.2 amendment.
 * - null = unattributable (LCDS §9 SS-8)
 * - `complete = false` = a contributing input was missing at capture time
 *
 * These are independent, orthogonal flags (IS §9.2).
 */
export const decisionRecords = pgTable('decision_records', {
  decisionId: uuid('decision_id').primaryKey(),
  identityId: uuid('identity_id').references(() => identities.identityId),
  resolvedAction: jsonb('resolved_action').notNull(),
  authorityContext: jsonb('authority_context').notNull(),
  policyJudgment: jsonb('policy_judgment').notNull(),
  outcome: text('outcome', { enum: ['permit', 'deny', 'modify'] }).notNull(),
  complete: boolean('complete').notNull(),
  decidedAt: timestamp('decided_at', { withTimezone: true }).notNull().defaultNow(),
});
