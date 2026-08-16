import type { PolicyJudgment } from "./types";
import type { ResolvedAction } from "@gov/ss3";

export function assessAction(
  _resolvedAction: ResolvedAction,
): Promise<PolicyJudgment> {
  // TODO: implement
  throw new Error("TODO: implement");
}
