import pg from 'pg';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schemaImport from './schema/index.js';

/**
 * PostgresClient: thin wrapper around pg.Pool + Drizzle ORM instance.
 *
 * TAS §2 "Database Access" — Drizzle ORM, SQL-transparent, no hidden query magic.
 * Called exactly once from apps/governance-api/src/main.ts at boot.
 *
 * No query logic belongs here — this package supplies only the connection factory
 * and schema objects. Read/write functions belong to:
 * - ss2/identity-registry.ts
 * - ss4/current-authority-ledger.ts
 * - ss5/rule-repository.ts
 * - ss8/decision-record-store.ts
 */
export interface PostgresClient {
  readonly pool: pg.Pool;
  readonly db: NodePgDatabase<typeof schemaImport.schema>;
}

export function createPostgresClient(connectionString: string): PostgresClient {
  const pool = new pg.Pool({ connectionString });
  const db = drizzle(pool, { schema: schemaImport.schema });

  return { pool, db };
}
