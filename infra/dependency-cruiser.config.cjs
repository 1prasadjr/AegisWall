module.exports = {
  forbidden: [
    {
      name: "apps-governance-api-must-not-import-ss4-directly",
      severity: "error",
      from: { path: "^apps/governance-api/src" },
      to: { path: "^packages/ss4-authority-lifecycle/src" },
    },
    {
      name: "apps-governance-api-must-not-import-ss6-directly",
      severity: "error",
      from: { path: "^apps/governance-api/src" },
      to: { path: "^packages/ss6-policy-evaluation/src" },
    },
    {
      name: "apps-governance-api-must-not-import-ss7-directly",
      severity: "error",
      from: { path: "^apps/governance-api/src" },
      to: { path: "^packages/ss7-authorization-mediation/src" },
    },
    {
      name: "ss5-must-not-import-ss6",
      severity: "error",
      from: { path: "^packages/ss5-policy-definition/src" },
      to: { path: "^packages/ss6-policy-evaluation/src" },
    },
    {
      name: "ss6-must-not-import-ss5-internals",
      severity: "error",
      from: { path: "^packages/ss6-policy-evaluation/src" },
      to: {
        path: "^packages/ss5-policy-definition/src/(?!index\.ts$|get-rule-content\.ts$)",
      },
    },
    {
      name: "ss8-must-remain-type-only-against-decision-path-packages",
      severity: "error",
      from: { path: "^packages/ss8-decision-accountability/src" },
      to: {
        path: "^packages/(ss3-action-interpretation|ss4-authority-lifecycle|ss6-policy-evaluation|ss7-authorization-mediation)/src",
      },
    },
    {
      name: "no-package-may-import-ss7-internals",
      severity: "error",
      from: {
        path: "^packages|^apps",
        pathNot: "^packages/ss7-authorization-mediation/src",
      },
      to: { path: "^packages/ss7-authorization-mediation/src/(?!index\.ts$)" },
    },
    {
      name: "no-package-may-import-ss8-internals",
      severity: "error",
      from: {
        path: "^packages|^apps",
        pathNot: "^packages/ss8-decision-accountability/src",
      },
      to: { path: "^packages/ss8-decision-accountability/src/(?!index\.ts$)" },
    },
  ],
  options: {
    doNotFollow: {
      path: "node_modules",
    },
    exclude: "node_modules",
    tsConfig: {
      fileName: "./tsconfig.base.json",
    },
  },
};
