import { pgTable, uuid, jsonb, timestamp } from 'drizzle-orm/pg-core';

/**
 * RS-2.3 Identity Registry — immutable after issuance
 *
 * Maps to migration: infra/migrations/0001_identities.sql
 *
 * Grants: INSERT, SELECT to role 'ss2_writer' only.
 * No UPDATE/DELETE grant to any role (T10, IS §9.2).
 */
export const identities = pgTable('identities', {
  identityId: uuid('identity_id').primaryKey().defaultRandom(),
  originReference: jsonb('origin_reference').notNull(),
  issuedAt: timestamp('issued_at', { withTimezone: true }).notNull().defaultNow(),
});
