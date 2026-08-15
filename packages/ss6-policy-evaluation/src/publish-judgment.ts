import type { PolicyJudgment } from "./types";

// EXTENSION POINT: Escalation Routing / Consent Binding, Deferred MVP — do not implement
export function publishJudgment(judgment: PolicyJudgment): PolicyJudgment {
  // TODO: implement
  throw new Error("TODO: implement");
}
