import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@gov/shared": resolve(import.meta.dirname, "../../packages/shared/src/index.ts"),
    },
  },
  test: {
    environment: "node",
    globals: true,
  },
});
