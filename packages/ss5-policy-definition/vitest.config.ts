import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@gov/shared": resolve(import.meta.dirname, "../shared/src/index.ts"),
      "@gov/persistence": resolve(import.meta.dirname, "../persistence/src/index.ts"),
      "@gov/policy-engine": resolve(import.meta.dirname, "../policy-engine/src/index.ts"),
    },
  },
  test: {
    environment: "node",
    globals: true,
  },
});
