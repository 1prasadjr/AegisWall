import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      // Hard gate: 100% branch coverage on the decision path (TAS §9.1 Stage 6, IS §11.1)
      // These are the single synthesis point (P8) and the last fail-closed check (RD12).
      thresholds: {
        branches: 100,
        lines: 100,
        functions: 100,
        statements: 100,
      },
      include: [
        'packages/ss7-authorization-mediation/src/compose-decision.ts',
        'packages/ss7-authorization-mediation/src/validate-decision.ts',
      ],
    },
  },
});
