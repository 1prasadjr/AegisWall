import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './packages/persistence/src/schema/*.ts',
  out: './infra/migrations-generated',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/governance_dev',
  },
});
