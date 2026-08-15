import { defineConfig } from "tsup";

/**
 * TAS §9.1 stage 8 — "tsup bundle per package + Docker image build".
 * The @gov/* aliases are tsconfig `paths` (no per-package package.json exists),
 * so each workspace member is bundled from its src/index.ts entry. esbuild does
 * not resolve tsconfig paths natively, hence the explicit `alias` map below.
 */
export default defineConfig({
  entry: {
    shared: "packages/shared/src/index.ts",
    ss1: "packages/ss1-trust-qualification/src/index.ts",
    ss2: "packages/ss2-identity-attribution/src/index.ts",
    ss3: "packages/ss3-action-interpretation/src/index.ts",
    ss4: "packages/ss4-authority-lifecycle/src/index.ts",
    ss5: "packages/ss5-policy-definition/src/index.ts",
    ss6: "packages/ss6-policy-evaluation/src/index.ts",
    ss7: "packages/ss7-authorization-mediation/src/index.ts",
    ss8: "packages/ss8-decision-accountability/src/index.ts",
    persistence: "packages/persistence/src/index.ts",
    "policy-engine": "packages/policy-engine/src/index.ts",
    "governance-api": "apps/governance-api/src/main.ts",
  },
  alias: {
    "@gov/shared": "packages/shared/src/index.ts",
    "@gov/ss1": "packages/ss1-trust-qualification/src/index.ts",
    "@gov/ss2": "packages/ss2-identity-attribution/src/index.ts",
    "@gov/ss3": "packages/ss3-action-interpretation/src/index.ts",
    "@gov/ss4": "packages/ss4-authority-lifecycle/src/index.ts",
    "@gov/ss5": "packages/ss5-policy-definition/src/index.ts",
    "@gov/ss6": "packages/ss6-policy-evaluation/src/index.ts",
    "@gov/ss7": "packages/ss7-authorization-mediation/src/index.ts",
    "@gov/ss8": "packages/ss8-decision-accountability/src/index.ts",
    "@gov/persistence": "packages/persistence/src/index.ts",
    "@gov/policy-engine": "packages/policy-engine/src/index.ts",
  },
  format: ["esm"],
  platform: "node",
  target: "node22",
  dts: false,
  clean: true,
  treeshake: true,
  noExternal: [/.*/],
});