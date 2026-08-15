import type { Uuid } from "@gov/shared";
import type { DecisionRecord } from "./types";

export function getDecisionRecord(
  decisionId: Uuid,
): Promise<DecisionRecord | "no_such_record"> {
  // TODO: implement
  throw new Error("TODO: implement");
}
