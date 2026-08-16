import {
  pgTable,
  uuid,
  jsonb,
  timestamp,
  text,
  index,
} from "drizzle-orm/pg-core";
import { identities } from "./identities.js";

/**
 * RS-4.3 Current Authority Ledger — append-only event log
 *
 * Current state is a query over this log, never a second mutable table.
 * Maps to migration: infra/migrations/0002_authority_events.sql
 *
 * Grants: INSERT, SELECT to role 'ss4_writer' only.
 * No UPDATE/DELETE grant to any role (T10, IS §9.2).
 *
 * Issuance writes acquire: SELECT ... FOR UPDATE on identity_id
 * before appending (RD6/RD7 per-Identity serialization).
 */
export const authorityEvents = pgTable(
  "authority_events",
  {
    eventId: uuid("event_id").primaryKey().defaultRandom(),
    identityId: uuid("identity_id")
      .notNull()
      .references(() => identities.identityId),
    eventType: text("event_type", { enum: ["issue", "withdraw"] }).notNull(),
    scope: jsonb("scope").notNull(),
    occurredAt: timestamp("occurred_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    identityIdx: index("authority_events_identity_idx").on(
      table.identityId,
      table.occurredAt,
    ),
  }),
);
