import type { BoundAssessment } from "./types";
import type { ResolvedAction } from "@gov/ss3";

export function intakeAssessment(
  _resolvedAction: ResolvedAction,
): Promise<BoundAssessment | "assessment_blocked"> {
  // TODO: implement
  throw new Error("TODO: implement");
}
