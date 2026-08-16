import type { Result, Uuid } from "@gov/shared";
import type { DecisionRecord, DecisionRecordInput } from "./types";

export function writeRecord(
  _record: DecisionRecordInput,
): Promise<Result<void, "duplicate_decision_reference">> {
  // TODO: implement
  throw new Error("TODO: implement");
}

export function readRecord(
  _decisionId: Uuid,
): Promise<DecisionRecord | "no_such_record"> {
  // TODO: implement
  throw new Error("TODO: implement");
}
